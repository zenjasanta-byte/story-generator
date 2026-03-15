import { NextResponse } from "next/server";
import { getAuthIdentityLink } from "@/lib/authIdentityStore";
import { verifyAuthCredentials } from "@/lib/authStore";
import { createAuthSessionToken, isAuthConfigured, setAuthSessionCookie } from "@/lib/authSession.server";

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
    const user = await verifyAuthCredentials({ email, password });

    if (!user) {
      return NextResponse.json(
        { error: "Incorrect email or password.", errorCode: "invalid_credentials" },
        { status: 401 }
      );
    }

    const identityLink = await getAuthIdentityLink(user.id);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      appUserId: identityLink?.appUserId ?? user.id,
      linkedCurrentSession: Boolean(identityLink?.guestUserId)
    });

    setAuthSessionCookie(response, createAuthSessionToken(user.id));
    return response;
  } catch (error) {
    console.error("[auth-login] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed.", errorCode: "auth_failed" },
      { status: 500 }
    );
  }
}
