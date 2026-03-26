import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    let credits = 0;

    if (amount === 1000) credits = 40;
    if (amount === 2000) credits = 100;
    if (amount === 3000) credits = 180;

    if (!credits) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

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

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/en/success?credits=${credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/en`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}