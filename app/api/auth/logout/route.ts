import { NextResponse } from "next/server";
import { clearAuthSessionCookie } from "@/lib/authSession.server";
import { USER_ID_COOKIE } from "@/lib/premiumAccess";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthSessionCookie(response);
  response.cookies.set(USER_ID_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
