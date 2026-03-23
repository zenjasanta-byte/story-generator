import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // 👉 считаем кредиты (пример: 1€ = 10 credits)
    const credits = amount / 100 * 10;

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

      // 🔥 ВОТ ГЛАВНОЕ ИЗМЕНЕНИЕ
      success_url: `https://story-generator-pi-hazel.vercel.app/en/success?credits=${credits}`,
      cancel_url: "https://story-generator-pi-hazel.vercel.app/en",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Stripe error" },
      { status: 500 }
    );
  }
}