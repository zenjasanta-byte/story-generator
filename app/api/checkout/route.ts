import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    console.log("AMOUNT:", amount);

    let credits = 0;

    if (amount === 1000) credits = 40;
    else if (amount === 2000) credits = 100;
    else if (amount === 3000) credits = 180;
    else {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    console.log("CREDITS:", credits);

    const BASE_URL = "https://story-generator-pi-hazel.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${credits} Credits`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/en/success?credits=${credits}`,
      cancel_url: `${BASE_URL}/en`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}