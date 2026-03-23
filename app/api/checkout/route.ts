import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(process.env.STRIPE_SECRET_KEY as string) : null;

const CREDIT_PACKAGES = {
  1000: 40,
  2000: 100,
  3000: 180
} as const;

function resolveBaseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const identity = await getCurrentUserIdentity();

  if (!identity.authenticatedAppUserId) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const { amount } = (await req.json()) as { amount?: number };
  const normalizedAmount = Number(amount);
  const credits = CREDIT_PACKAGES[normalizedAmount as keyof typeof CREDIT_PACKAGES];

  if (!credits) {
    return NextResponse.json({ error: "Invalid credit package" }, { status: 400 });
  }

  const baseUrl = resolveBaseUrl(req);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${credits} Credits`
          },
          unit_amount: normalizedAmount
        },
        quantity: 1
      }
    ],
    metadata: {
      userId: `user:${identity.authenticatedAppUserId}`,
      credits: String(credits)
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/`
  });

  return NextResponse.json({ url: session.url });
}
