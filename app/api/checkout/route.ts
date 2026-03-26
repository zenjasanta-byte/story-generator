import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { plan, locale } = await req.json();

    console.log("PLAN:", plan);

    let amount = 0;
    let credits = 0;

    if (plan === "small") {
      amount = 1000;
      credits = 40;
    } else if (plan === "medium") {
      amount = 2000;
      credits = 100;
    } else if (plan === "large") {
      amount = 3000;
      credits = 180;
    } else {
      throw new Error("Invalid plan");
    }

    const safeLocale = locale || "en";

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
      success_url: `https://story-generator-26hdkfojo-zenjasanta-bytes-projects.vercel.app/${safeLocale}/success?credits=${credits}`,
      cancel_url: `https://story-generator-26hdkfojo-zenjasanta-bytes-projects.vercel.app/${safeLocale}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("STRIPE ERROR:", error.message);
    return NextResponse.json(
      { error: "Stripe error" },
      { status: 500 }
    );
  }
}