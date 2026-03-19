import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const CREDIT_PACKAGES = {
  40: 1000,
  100: 2000,
  180: 3000
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

  const { credits, price } = (await req.json()) as { credits?: number; price?: number };
  const normalizedCredits = Number(credits);
  const normalizedPrice = Number(price);
  const expectedPrice = CREDIT_PACKAGES[normalizedCredits as keyof typeof CREDIT_PACKAGES];

  if (!expectedPrice || expectedPrice !== normalizedPrice) {
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
            name: `${normalizedCredits} Credits`
          },
          unit_amount: normalizedPrice
        },
        quantity: 1
      }
    ],
    metadata: {
      userId: `user:${identity.authenticatedAppUserId}`,
      credits: String(normalizedCredits)
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/`
  });

  return NextResponse.json({ url: session.url });
}
