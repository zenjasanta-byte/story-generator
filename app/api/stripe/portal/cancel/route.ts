import { NextResponse } from "next/server";
import { PortalRouteError, createPortalSession } from "@/lib/stripePortal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const session = await createPortalSession({
      localeInput: String(body?.locale || "en"),
      flow: "subscription_cancel"
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe-portal-cancel] failed to create portal session", error);

    if (error instanceof PortalRouteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create cancellation session." },
      { status: 500 }
    );
  }
}
