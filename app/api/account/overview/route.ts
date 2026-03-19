import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";

export const runtime = "nodejs";

export async function GET() {
  const identity = await getCurrentUserIdentity();

  return NextResponse.json(
    {
      isAuthenticated: identity.isAuthenticated,
      guestUserId: identity.guestUserId,
      appUserId: identity.authenticatedAppUserId ?? null,
      linkedGuestSession: identity.linkedGuestSession,
      user: identity.authenticatedUser
        ? {
            id: identity.authenticatedUser.id,
            email: identity.authenticatedUser.email
          }
        : null,
      plan: "free",
      isPremium: false,
      subscriptionStatus: "inactive",
      billingInterval: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
