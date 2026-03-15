import Stripe from "stripe";
import { NextResponse } from "next/server";
import { activatePremiumForUser, type BillingInterval, type SubscriptionStatus, updatePremiumSubscriptionForUser } from "@/lib/premiumStore";

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

function getSubscriptionDetails(subscription: Stripe.Subscription | null): {
  stripeSubscriptionId: string | null;
  subscriptionStatus: SubscriptionStatus;
  stripePriceId: string | null;
  billingInterval: BillingInterval;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
} {
  if (!subscription) {
    return {
      stripeSubscriptionId: null,
      subscriptionStatus: "inactive",
      stripePriceId: null,
      billingInterval: null,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null
    };
  }

  const price = subscription.items.data[0]?.price;
  const interval = price?.recurring?.interval;
  const periodEndUnix = subscription.items.data[0]?.current_period_end ?? null;

  return {
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: toSubscriptionStatus(subscription.status),
    stripePriceId: price?.id ?? null,
    billingInterval: interval === "month" || interval === "year" ? interval : null,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null
  };
}

export async function GET(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured on the server." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"]
    });

    const userId = session.metadata?.userId || session.client_reference_id;
    if (!userId) {
      return NextResponse.json({ error: "No user identifier found on checkout session." }, { status: 400 });
    }

    const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    const expandedSubscription = session.subscription && typeof session.subscription !== "string" ? session.subscription : null;
    const details = getSubscriptionDetails(expandedSubscription);

    await activatePremiumForUser({
      userId,
      stripeCustomerId,
      stripeSubscriptionId: details.stripeSubscriptionId,
      stripeCheckoutSessionId: session.id,
      subscriptionStatus: "active",
      cancelAtPeriodEnd: details.cancelAtPeriodEnd,
      currentPeriodEnd: details.currentPeriodEnd
    });

    await updatePremiumSubscriptionForUser({
      userId,
      stripeCustomerId,
      stripeSubscriptionId: details.stripeSubscriptionId,
      stripePriceId: details.stripePriceId,
      billingInterval: details.billingInterval,
      subscriptionStatus: details.subscriptionStatus,
      cancelAtPeriodEnd: details.cancelAtPeriodEnd,
      currentPeriodEnd: details.currentPeriodEnd
    });

    console.log("[stripe-checkout-session] premium synced from success page", {
      userId,
      sessionId: session.id,
      stripeCustomerId,
      stripeSubscriptionId: details.stripeSubscriptionId,
      stripePriceId: details.stripePriceId,
      billingInterval: details.billingInterval,
      subscriptionStatus: details.subscriptionStatus
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[stripe-checkout-session] failed to sync checkout session", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve checkout session." },
      { status: 500 }
    );
  }
}
