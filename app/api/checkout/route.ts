import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    console.log("AMOUNT:", amount);

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
      success_url: "https://your-site.vercel.app/success",
      cancel_url: "https://your-site.vercel.app/cancel",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json({ error: "Stripe failed" });
  }
}
