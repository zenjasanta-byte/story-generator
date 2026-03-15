import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";

export const runtime = "nodejs";

export async function GET() {
  const context = await getCurrentUserIdentity();

  const response = NextResponse.json({
    isAuthenticated: context.isAuthenticated,
    guestUserId: context.guestUserId,
    authenticatedAppUserId: context.authenticatedAppUserId,
    appUserId: context.appUserId,
    linkedGuestSession: context.linkedGuestSession,
    user: context.authenticatedUser
      ? {
          id: context.authenticatedUser.id,
          email: context.authenticatedUser.email
        }
      : null
  });

  response.headers.set("Cache-Control", "no-store");
  return response;
}
