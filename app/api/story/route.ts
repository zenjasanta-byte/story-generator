import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { getIpStoryUsage, incrementIpStoryUsage } from "@/lib/ipUsageStore";
import { generateStoryWithOpenAI, OpenAIRequestError } from "@/lib/openai";
import { getBillingRecord, shouldKeepPremiumForStatus } from "@/lib/premiumStore";
import { getClientIp, takeIpRateLimit } from "@/lib/rateLimit";
import { isTurnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";
import { getUiTranslations } from "@/lib/uiTranslations";
import { getUserStoryUsage, incrementUserStoryUsage } from "@/lib/usageStore";
import { storyInputSchema } from "@/lib/validation";

const FREE_LIMIT = 3; // сколько историй на аккаунт
const FREE_IP_DAILY_LIMIT = 10; // лимит для гостей (IP)
const PREMIUM_DAILY_LIMIT = 100; // премиум пользователи

// Rate limit (защита от спама)
const IP_RATE_LIMIT_MAX_REQUESTS =
  process.env.NODE_ENV === "development" ? 100 : 20;

const IP_RATE_LIMIT_WINDOW_MS =
  process.env.NODE_ENV === "development"
    ? 60 * 1000 // 1 минута в dev
    : 5 * 60 * 1000; // 5 минут в проде

export const runtime = "nodejs";

function getLocalizedStoryErrorMessage(language: string, error: unknown) {
  const t = getUiTranslations(language);

  if (error instanceof OpenAIRequestError && error.status === 429 && error.code === "insufficient_quota") {
    return {
      message: t.home.errors.serviceBusy,
      status: 503
    };
  }

  if (error instanceof Error) {
    const message = error.message;
    const statusCode = message.toLowerCase().includes("required") || message.toLowerCase().includes("invalid") ? 400 : 500;

    return {
      message,
      status: statusCode
    };
  }

  return {
    message: t.home.errors.unexpected,
    status: 500
  };
}

export async function POST(request: Request) {
  let requestLanguage = "en";

  try {
    const body = await request.json();
    const input = storyInputSchema.parse(body);
    requestLanguage = input.language;
    const t = getUiTranslations(requestLanguage);
    const verificationErrorMessage = t.home.errors.verificationFailed;
    const clientIp = getClientIp(request);
    const turnstileEnabled = isTurnstileEnabled();
    const rateLimit = takeIpRateLimit({
      ip: clientIp,
      maxRequests: IP_RATE_LIMIT_MAX_REQUESTS,
      windowMs: IP_RATE_LIMIT_WINDOW_MS
    });

    if (!rateLimit.allowed) {
      console.warn("[api/story] ip rate limit blocked request", {
        ip: clientIp,
        route: "/api/story",
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        {
          error: t.home.errors.rateLimitExceeded
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds)
          }
        }
      );
    }

    const turnstileToken = typeof body?.turnstileToken === "string" ? body.turnstileToken : "";
    if (turnstileEnabled) {
      const turnstileResult = await verifyTurnstileToken({
        token: turnstileToken,
        remoteIp: clientIp === "unknown" ? null : clientIp
      });

      if (!turnstileResult.ok) {
        console.warn("[api/story] turnstile blocked request", {
          reason: turnstileResult.reason,
          errorCodes: turnstileResult.errorCodes ?? []
        });
        return NextResponse.json({ error: verificationErrorMessage }, { status: 403 });
      }
    }

const identity = await getCurrentUserIdentity();

// лог (оставь для проверки)
console.log("IDENTITY:", {
  appUserId: identity.appUserId,
  authenticatedAppUserId: identity.authenticatedAppUserId
});

// единый userId (НЕ трогай больше)
const userId = identity.authenticatedAppUserId
  ? `user:${identity.authenticatedAppUserId}`
  : `guest:${identity.appUserId}`;

// ✅ твой premium ID
const PREMIUM_USERS = [
  "7e56013c-66a6-45e2-8469-b098f83accfb"
];

// проверка premium
const authUserId = identity?.authenticatedAppUserId || "";
const cleanId = authUserId.trim();

const isPremium = PREMIUM_USERS.includes(cleanId);

console.log("CHECK:", {
  original: authUserId,
  clean: cleanId,
  isPremium,
  premiumList: PREMIUM_USERS
});
// usage
let usage = await getUserStoryUsage(userId);
let ipUsage = clientIp !== "unknown"
  ? await getIpStoryUsage(clientIp)
  : null;

// ✅ IP лимит (ТОЛЬКО для free)
if (
  !isPremium &&
  ipUsage &&
  ipUsage.storiesGenerated >= FREE_IP_DAILY_LIMIT
) {
  console.warn("[api/story] free ip fair-use limit reached", {
    ip: clientIp,
    dailyStoriesGenerated: ipUsage.storiesGenerated,
    dailyLimit: FREE_IP_DAILY_LIMIT,
  });

  return NextResponse.json(
    { error: "Free limit reached (IP)" },
    { status: 403 }
  );
}

// ✅ лимит для free аккаунта
if (!isPremium && usage.storiesGenerated >= FREE_LIMIT) {
  console.warn("[api/story] free limit reached", {
    userId,
    storiesGenerated: usage.storiesGenerated
  });

  return NextResponse.json(
    {
      error: "Free story limit reached",
      upgradeRequired: true,
      storiesRemaining: 0
    },
    { status: 403 }
  );
}

// ✅ лимит для premium (дневной)

    if (isPremium && usage.dailyStoriesGenerated >= PREMIUM_DAILY_LIMIT) {
      console.warn("[api/story] premium daily limit reached", {
        userId,
        feature: "story_generation",
        dailyStoriesGenerated: usage.dailyStoriesGenerated,
        dailyLimit: PREMIUM_DAILY_LIMIT
      });

      return NextResponse.json(
        {
          error: getUiTranslations(requestLanguage).home.errors.dailyLimitReached
        },
        { status: 429 }
      );
    }

    console.log("[api/story] generation tier", {
      userId,
      tier: isPremium ? "premium" : "free",
      generatedAssets: isPremium ? ["story_text", "cover_image", "page_illustrations"] : ["story_text"],
      dailyStoriesGenerated: usage.dailyStoriesGenerated
    });

    const story = await generateStoryWithOpenAI(input, {
      includeImages: isPremium
    });

    usage = await incrementUserStoryUsage(userId);
    if (ipUsage) {
      ipUsage = await incrementIpStoryUsage(clientIp);
    }

    const storiesRemaining = isPremium ? null : Math.max(FREE_LIMIT - usage.storiesGenerated, 0);

    return NextResponse.json({
      ...story,
      storiesRemaining,
      fairUseRemaining: !isPremium && ipUsage ? Math.max(FREE_IP_DAILY_LIMIT - ipUsage.storiesGenerated, 0) : null
    });
  } catch (error: unknown) {
    if (error instanceof OpenAIRequestError) {
      console.error("[api/story] openai request failed", {
        status: error.status,
        code: error.code,
        message: error.message
      });
    } else {
      console.error("[api/story] failed", error);
    }

    const localized = getLocalizedStoryErrorMessage(requestLanguage, error);
    return NextResponse.json({ error: localized.message }, { status: localized.status });
  }
}
