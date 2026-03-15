import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { normalizeLanguageCode } from "@/lib/narrationVoices";
import { normalizeStripeLocale } from "@/lib/stripeLocale";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceMonthId = process.env.STRIPE_PRICE_MONTH_ID || process.env.STRIPE_PRICE_ID;
const stripePriceYearId = process.env.STRIPE_PRICE_YEAR_ID;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover"
    })
  : null;

export async function POST(request: Request) {
  try {
    if (!stripe || !stripeSecretKey || !appUrl) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const plan = body?.plan === "year" ? "year" : "month";
    const priceId = plan === "year" ? stripePriceYearId : stripePriceMonthId;

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            plan === "year"
              ? "Yearly Stripe price is missing on the server. Set STRIPE_PRICE_YEAR_ID."
              : "Monthly Stripe price is missing on the server. Set STRIPE_PRICE_MONTH_ID."
        },
        { status: 500 }
      );
    }

    const locale = normalizeLanguageCode(String(body?.locale || "en"));
    const stripeLocale = normalizeStripeLocale(String(body?.locale || locale));
    const identity = await getCurrentUserIdentity();
    const userId = identity.authenticatedAppUserId;

    if (!userId) {
      return NextResponse.json({ error: "Authentication required", requiresAuth: true }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: userId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${appUrl}/${locale}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/premium/cancel`,
      locale: stripeLocale,
      metadata: {
        locale,
        userId,
        product: "storybook-premium",
        plan
      },
      allow_promotion_codes: true
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe Checkout URL was not created." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe-checkout] failed to create session", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
