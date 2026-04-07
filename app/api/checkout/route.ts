import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

type CheckoutPlan = "small" | "medium" | "large";

function getAmountFromPlan(plan: CheckoutPlan | undefined) {
  if (plan === "small") return 1000;
  if (plan === "medium") return 2000;
  if (plan === "large") return 3000;
  return 0;
}

function getCreditsFromAmount(amount: number) {
  if (amount === 1000) return 40;
  if (amount === 2000) return 100;
  if (amount === 3000) return 180;
  return 0;
}

function getBaseUrl() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!rawBaseUrl) {
    return null;
  }

  const trimmed = rawBaseUrl.trim().replace(/\/$/, "");

  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
    }

    const identity = await getCurrentUserIdentity();

    if (!identity.authenticatedAppUserId) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
    }

    const body = (await req.json()) as { amount?: number; plan?: CheckoutPlan; locale?: string };
    const amount = Number(body.amount || getAmountFromPlan(body.plan));
    const credits = getCreditsFromAmount(amount);
    const locale = typeof body.locale === "string" && body.locale.trim().length > 0 ? body.locale.trim() : "en";
    const baseUrl = getBaseUrl();

    console.log("AMOUNT:", amount);
    console.log("CREDITS:", credits);

    if (!credits) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!baseUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_BASE_URL is not configured" }, { status: 500 });
    }

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
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: `user:${identity.authenticatedAppUserId}`,
        credits: String(credits),
        amount: String(amount)
      },
      success_url: `${baseUrl}/${locale}/success?credits=${credits}`,
      cancel_url: `${baseUrl}/${locale}`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
