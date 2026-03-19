import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { getProcessedCreditPurchase, markCreditPurchaseProcessed } from "@/lib/creditPurchaseStore";
import { incrementUserCredits } from "@/lib/usageStore";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const identity = await getCurrentUserIdentity();

  if (!identity.authenticatedAppUserId) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const { sessionId } = (await req.json()) as { sessionId?: string };

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  }

  const userId = `user:${identity.authenticatedAppUserId}`;
  const processed = await getProcessedCreditPurchase(sessionId);

  if (processed) {
    if (processed.userId !== userId) {
      return NextResponse.json({ error: "Invalid payment session" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      creditsAdded: processed.credits,
      alreadyProcessed: true
    });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment is not completed" }, { status: 400 });
  }

  const sessionUserId = session.metadata?.userId;
  const credits = Number(session.metadata?.credits || 0);

  if (sessionUserId !== userId || credits <= 0) {
    return NextResponse.json({ error: "Invalid payment session" }, { status: 403 });
  }

  const usage = await incrementUserCredits(userId, credits);
  await markCreditPurchaseProcessed(sessionId, userId, credits);

  return NextResponse.json({
    success: true,
    credits: usage.credits,
    creditsAdded: credits
  });
}
