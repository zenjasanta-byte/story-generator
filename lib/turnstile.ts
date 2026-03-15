type VerifyTurnstileTokenParams = {
  token: string;
  remoteIp?: string | null;
};

type TurnstileVerificationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: "missing-token" | "missing-secret" | "request-failed" | "verification-failed";
      errorCodes?: string[];
    };

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstileToken({
  token,
  remoteIp
}: VerifyTurnstileTokenParams): Promise<TurnstileVerificationResult> {
  if (!isTurnstileEnabled()) {
    return {
      ok: true
    };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!token) {
    return {
      ok: false,
      reason: "missing-token"
    };
  }

  if (!secretKey) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY is not configured");
    return {
      ok: false,
      reason: "missing-secret"
    };
  }

  try {
    const body = new URLSearchParams({
      secret: secretKey,
      response: token
    });

    if (remoteIp) {
      body.set("remoteip", remoteIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString(),
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("[turnstile] verification request failed", {
        status: response.status
      });
      return {
        ok: false,
        reason: "request-failed"
      };
    }

    const payload = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!payload.success) {
      console.warn("[turnstile] verification rejected", {
        errorCodes: payload["error-codes"] ?? []
      });
      return {
        ok: false,
        reason: "verification-failed",
        errorCodes: payload["error-codes"] ?? []
      };
    }

    return {
      ok: true
    };
  } catch (error) {
    console.error("[turnstile] verification threw", error);
    return {
      ok: false,
      reason: "request-failed"
    };
  }
}
