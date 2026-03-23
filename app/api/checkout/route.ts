import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "No amount" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Credits",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "https://story-generator-pi-hazel.vercel.app/success",
      cancel_url: "https://story-generator-pi-hazel.vercel.app/",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json(
      { error: "Stripe error" },
      { status: 500 }
    );
  }
}