import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import {
  clearStaleStripeSubscriptionForUser,
  deactivatePremiumForUser,
  getBillingRecord,
  type BillingInterval,
  type SubscriptionStatus,
  updatePremiumSubscriptionForUser
} from "@/lib/premiumStore";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover"
    })
  : null;

function toSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "past_due") return "past_due";
  if (status === "canceled") return "canceled";
  if (status === "unpaid") return "unpaid";
  if (status === "incomplete") return "incomplete";
  if (status === "incomplete_expired") return "incomplete_expired";
  if (status === "paused") return "paused";
  return "inactive";
}

function toBillingInterval(interval: string | null | undefined): BillingInterval {
  return interval === "month" || interval === "year" ? interval : null;
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription): string | null {
  const periodEndUnix = subscription.items.data[0]?.current_period_end ?? null;
  return periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null;
}

function isStaleSubscriptionError(error: unknown) {
  if (!(error instanceof Stripe.errors.StripeInvalidRequestError)) {
    return false;
  }

  if (error.code === "resource_missing" && error.param === "id") {
    return true;
  }

  return typeof error.message === "string" && error.message.includes("similar object exists in test mode");
}

export async function GET() {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured on the server." }, { status: 500 });
    }

    const identity = await getCurrentUserIdentity();
    const userId = identity.authenticatedAppUserId;

    if (!userId) {
      return NextResponse.json({ synced: false, skipped: "missing_user" });
    }

    const record = await getBillingRecord(userId);

    if (!record.stripeSubscriptionId) {
      return NextResponse.json({ synced: false, skipped: "missing_subscription" });
    }

    let subscription: Stripe.Subscription;
    try {
      subscription = await stripe.subscriptions.retrieve(record.stripeSubscriptionId);
    } catch (error) {
      if (isStaleSubscriptionError(error)) {
        await clearStaleStripeSubscriptionForUser(userId);
        console.warn("[stripe-sync-subscription] cleared stale subscription id", {
          userId,
          stripeSubscriptionId: record.stripeSubscriptionId
        });

        return NextResponse.json({
          synced: false,
          cleared: "stale_subscription",
          stripeSubscriptionId: record.stripeSubscriptionId
        });
      }

      throw error;
    }

    const subscriptionStatus = toSubscriptionStatus(subscription.status);
    const priceId = subscription.items.data[0]?.price?.id ?? null;
    const billingInterval = toBillingInterval(subscription.items.data[0]?.price?.recurring?.interval);
    const stripeCustomerId =
      typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;
    const cancelAtPeriodEnd = Boolean(subscription.cancel_at_period_end);
    const currentPeriodEnd = getCurrentPeriodEnd(subscription);

    if (subscriptionStatus === "active" || subscriptionStatus === "trialing") {
      await updatePremiumSubscriptionForUser({
        userId,
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        billingInterval,
        subscriptionStatus,
        cancelAtPeriodEnd,
        currentPeriodEnd
      });
    } else if (subscriptionStatus === "canceled" || subscriptionStatus === "unpaid") {
      await deactivatePremiumForUser({
        userId,
        subscriptionStatus,
        clearStripeSubscriptionId: false,
        cancelAtPeriodEnd,
        currentPeriodEnd
      });
    } else {
      await updatePremiumSubscriptionForUser({
        userId,
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        billingInterval,
        subscriptionStatus,
        cancelAtPeriodEnd,
        currentPeriodEnd
      });
    }

    return NextResponse.json({ synced: true });
  } catch (error) {
    console.error("[stripe-sync-subscription] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync subscription." },
      { status: 500 }
    );
  }
}
