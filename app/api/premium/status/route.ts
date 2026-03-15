import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { type PremiumStatusResponse } from "@/lib/premiumAccess";
import { getBillingRecord, shouldKeepPremiumForStatus } from "@/lib/premiumStore";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const identity = await getCurrentUserIdentity();
  const userId = identity.authenticatedAppUserId || null;

  if (!userId) {
    const payload: PremiumStatusResponse = {
      userId: null,
      isPremium: false,
      plan: "free",
      subscriptionStatus: "inactive",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      billingInterval: null
    };

    return NextResponse.json(payload);
  }

  try {
    await fetch(`${request.nextUrl.origin}/api/stripe/sync-subscription`, {
      headers: {
        cookie: request.headers.get("cookie") || ""
      },
      cache: "no-store"
    });
  } catch (error) {
    console.error("[premium-status] subscription sync failed", error);
  }

  const record = await getBillingRecord(userId);

  const payload: PremiumStatusResponse = {
    userId,
    isPremium: record.plan === "premium" && shouldKeepPremiumForStatus(record.subscriptionStatus),
    plan: record.plan,
    subscriptionStatus: record.subscriptionStatus,
    stripeCustomerId: record.stripeCustomerId,
    stripeSubscriptionId: record.stripeSubscriptionId,
    stripePriceId: record.stripePriceId,
    billingInterval: record.billingInterval
  };

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
