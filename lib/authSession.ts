import { createHmac } from "crypto";

export const AUTH_SESSION_COOKIE = "storybook_auth_session";
const AUTH_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = {
  userId: string;
  exp: number;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET || null;
}

function base64url(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function unbase64url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function isAuthConfigured() {
  return Boolean(getAuthSecret());
}

export function createAuthSessionToken(userId: string) {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  const payload: SessionPayload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + AUTH_SESSION_TTL_SECONDS
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthSessionToken(token: string): SessionPayload | null {
  const secret = getAuthSecret();
  if (!secret) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  if (signPayload(encodedPayload, secret) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(unbase64url(encodedPayload)) as SessionPayload;
    if (!payload.userId || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getSafeNextPath(nextInput: string | null | undefined, locale: string) {
  if (!nextInput || !nextInput.startsWith("/") || nextInput.startsWith("//")) {
    return `/${locale}`;
  }

  return nextInput;
}

export function getAuthSessionMaxAge() {
  return AUTH_SESSION_TTL_SECONDS;
}
