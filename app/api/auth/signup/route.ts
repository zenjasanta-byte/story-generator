import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { linkAuthUserToAppIdentity } from "@/lib/authIdentityStore";
import { createAuthUser } from "@/lib/authStore";
import { createAuthSessionToken, isAuthConfigured, setAuthSessionCookie } from "@/lib/authSession.server";
import { USER_ID_COOKIE } from "@/lib/premiumAccess";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isAuthConfigured()) {
      return NextResponse.json(
        { error: "Authentication is not configured on the server.", errorCode: "not_configured" },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address.", errorCode: "invalid_email" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters.", errorCode: "invalid_password" },
        { status: 400 }
      );
    }

    const created = await createAuthUser({ email, password });
    if (!created.ok) {
      return NextResponse.json(
        { error: "An account with this email already exists.", errorCode: "email_taken" },
        { status: 409 }
      );
    }

    const cookieStore = await cookies();
    const guestUserId = cookieStore.get(USER_ID_COOKIE)?.value ?? null;
    const appUserId = guestUserId || created.user.id;

    await linkAuthUserToAppIdentity({
      authUserId: created.user.id,
      appUserId,
      guestUserId
    });

    const response = NextResponse.json({
      success: true,
      user: { id: created.user.id, email: created.user.email },
      appUserId,
      linkedCurrentSession: Boolean(guestUserId)
    });

    setAuthSessionCookie(response, createAuthSessionToken(created.user.id));
    return response;
  } catch (error) {
    console.error("[auth-signup] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed.", errorCode: "auth_failed" },
      { status: 500 }
    );
  }
}
