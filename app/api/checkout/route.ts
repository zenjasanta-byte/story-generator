import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY:", body);

    const { amount } = body;

    let credits = 0;

    if (amount === 1000) credits = 40;
    else if (amount === 2000) credits = 100;
    else if (amount === 3000) credits = 180;
    else {
      console.log("❌ INVALID AMOUNT:", amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const BASE_URL = "https://story-generator-pi-hazel.vercel.app";

    console.log("BASE_URL:", BASE_URL);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${credits} credits`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/en/success?credits=${credits}`,
      cancel_url: `${BASE_URL}/en`,
    });

    console.log("✅ SESSION CREATED");

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("🔥 STRIPE ERROR:", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}