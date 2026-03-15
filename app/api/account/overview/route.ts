import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { getBillingRecord, shouldKeepPremiumForStatus } from "@/lib/premiumStore";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover"
    })
  : null;

export async function GET() {
  const identity = await getCurrentUserIdentity();
  const userId = identity.authenticatedAppUserId;

  const billing = userId ? await getBillingRecord(userId) : null;

  let cancelAtPeriodEnd = billing?.cancelAtPeriodEnd ?? false;
  let currentPeriodEnd: string | null = billing?.currentPeriodEnd ?? null;

  if (stripe && billing?.stripeSubscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(billing.stripeSubscriptionId);
      cancelAtPeriodEnd = Boolean(subscription.cancel_at_period_end);
      const periodEndUnix = subscription.items.data[0]?.current_period_end ?? null;
      currentPeriodEnd = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null;
    } catch (error) {
      console.error("[account-overview] failed to load Stripe subscription", error);
    }
  }

  return NextResponse.json(
    {
      isAuthenticated: identity.isAuthenticated,
      guestUserId: identity.guestUserId,
      appUserId: userId,
      linkedGuestSession: identity.linkedGuestSession,
      user: identity.authenticatedUser
        ? {
            id: identity.authenticatedUser.id,
            email: identity.authenticatedUser.email
          }
        : null,
      plan: billing?.plan ?? "free",
      isPremium: billing ? billing.plan === "premium" && shouldKeepPremiumForStatus(billing.subscriptionStatus) : false,
      subscriptionStatus: billing?.subscriptionStatus ?? "inactive",
      billingInterval: billing?.billingInterval ?? null,
      stripeCustomerId: billing?.stripeCustomerId ?? null,
      stripeSubscriptionId: billing?.stripeSubscriptionId ?? null,
      cancelAtPeriodEnd,
      currentPeriodEnd
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
