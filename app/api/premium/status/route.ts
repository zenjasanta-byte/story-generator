import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";

export const runtime = "nodejs";

export async function GET() {
  const identity = await getCurrentUserIdentity();

  return NextResponse.json({
    userId: identity.authenticatedAppUserId || null,
    isPremium: false
  });
}
