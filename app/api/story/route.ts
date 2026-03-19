import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { generateStoryWithOpenAI, OpenAIRequestError } from "@/lib/openai";
import { getUiTranslations } from "@/lib/uiTranslations";
import { decrementUserCredits, getUserStoryUsage } from "@/lib/usageStore";
import { storyInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

const STORY_COST = 5;

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
    const statusCode =
      message.toLowerCase().includes("required") || message.toLowerCase().includes("invalid")
        ? 400
        : 500;

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

    const identity = await getCurrentUserIdentity();

    if (!identity.authenticatedAppUserId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const userId = `user:${identity.authenticatedAppUserId}`;
    const usage = await getUserStoryUsage(userId);

    if ((usage.credits || 0) < STORY_COST) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 403 }
      );
    }

    console.log("[api/story] credits check", {
      userId,
      credits: usage.credits || 0
    });

    const story = await generateStoryWithOpenAI(input, {
      includeImages: true
    });

    const nextUsage = await decrementUserCredits(userId, STORY_COST);

    return NextResponse.json({
      ...story,
      creditsRemaining: nextUsage.credits
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
