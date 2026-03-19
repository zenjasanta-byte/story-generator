import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";

export const runtime = "nodejs";

export async function GET() {
  const identity = await getCurrentUserIdentity();

  return NextResponse.json({
    userId: identity.authenticatedAppUserId || null,
    isPremium: false
  });
}
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

  const PREMIUM_USERS = [
  "7e56013c-66a6-45e2-8469-b098f83accfb"
];

const isPremiumUser = PREMIUM_USERS.includes(userId);

const payload: PremiumStatusResponse = {
  userId,
  isPremium: isPremiumUser || (
    record.plan === "premium" &&
    shouldKeepPremiumForStatus(record.subscriptionStatus)
  ),
    plan: record.plan,
    subscriptionStatus: record.subscriptionStatus,
    stripeCustomerId: record.stripeCustomerId,
    stripeSubscriptionId: record.stripeSubscriptionId,
    stripePriceId: record.stripePriceId,
    billingInterval: record.billingInterval
  };

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
