import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthUserById, type AuthUserRecord } from "@/lib/authStore";
import {
  AUTH_SESSION_COOKIE,
  createAuthSessionToken,
  getAuthSessionMaxAge,
  getSafeNextPath,
  isAuthConfigured,
  verifyAuthSessionToken
} from "@/lib/authSession";
import { USER_ID_COOKIE } from "@/lib/premiumAccess";

export {
  AUTH_SESSION_COOKIE,
  createAuthSessionToken,
  getSafeNextPath,
  isAuthConfigured,
  verifyAuthSessionToken
};

export async function getAuthenticatedUser(): Promise<AuthUserRecord | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const payload = verifyAuthSessionToken(token);
  if (!payload) {
    return null;
  }

  return getAuthUserById(payload.userId);
}

export async function getRequestUserContext() {
  const cookieStore = await cookies();
  const guestUserId = cookieStore.get(USER_ID_COOKIE)?.value ?? null;
  const authenticatedUser = await getAuthenticatedUser();

  return {
    guestUserId,
    authenticatedUser,
    isAuthenticated: Boolean(authenticatedUser)
  };
}

export function setAuthSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAuthSessionMaxAge()
  });
}

export function clearAuthSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
