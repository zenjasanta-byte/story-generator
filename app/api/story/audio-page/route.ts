import { NextResponse } from "next/server";
import { generatePageNarrationAudio } from "@/lib/openai";
import { canDownloadAudio, canUsePremiumVoice, requirePremiumAccess } from "@/lib/premiumGuards";
import { pageNarrationInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    console.log("[api/story/audio-page] request received");
    const auth = await requirePremiumAccess("story_audio_page");
    if (!auth.ok) {
      return auth.response;
    }

    const body = await request.json();
    const input = pageNarrationInputSchema.parse({ ...body, mode: "page" });

    if (!canDownloadAudio(auth.billing) || !canUsePremiumVoice(auth.billing, input.voiceStyle)) {
      console.warn("[api/story/audio-page] blocked", {
        userId: auth.userId,
        feature: "story_audio_page",
        plan: auth.billing.plan,
        voiceStyle: input.voiceStyle || "bedtime"
      });

      return NextResponse.json(
        {
          error: "Premium subscription required",
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    console.log("[api/story/audio-page] validated input", {
      title: input.title,
      language: input.language,
      pageNumber: input.page.pageNumber,
      userId: auth.userId,
      plan: auth.billing.plan
    });

    const audio = await generatePageNarrationAudio({
      ...input,
      isPremium: auth.isPremium
    });

    console.log("[api/story/audio-page] audio generated", {
      mimeType: audio.mimeType,
      length: audio.audioDataUrl.length
    });

    return NextResponse.json({
      audioUrl: audio.audioDataUrl,
      mimeType: audio.mimeType
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    console.error("[api/story/audio-page] failed", error);
    const statusCode = message.toLowerCase().includes("required") || message.toLowerCase().includes("invalid") ? 400 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}