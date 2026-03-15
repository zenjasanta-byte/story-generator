import { NextResponse } from "next/server";
import { generatePageNarrationAudio, generateStoryNarrationAudio } from "@/lib/openai";
import { canDownloadAudio, canUsePremiumVoice, requirePremiumAccess } from "@/lib/premiumGuards";
import { narrationRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    console.log("[api/story/audio] request received");
    const auth = await requirePremiumAccess("story_audio");
    if (!auth.ok) {
      return auth.response;
    }

    const body = await request.json();
    const input = narrationRequestSchema.parse(body);

    if (!canDownloadAudio(auth.billing) || !canUsePremiumVoice(auth.billing, input.voiceStyle)) {
      console.warn("[api/story/audio] blocked", {
        userId: auth.userId,
        feature: "story_audio",
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

    console.log("[api/story/audio] validated input", {
      mode: input.mode,
      title: input.title,
      language: input.language,
      voiceStyle: input.voiceStyle || "gentle",
      userId: auth.userId,
      plan: auth.billing.plan
    });

    const audio =
      input.mode === "page"
        ? await generatePageNarrationAudio({
            title: input.title,
            page: input.page,
            language: input.language,
            childName: input.childName,
            voiceStyle: input.voiceStyle,
            isPremium: auth.isPremium
          })
        : await generateStoryNarrationAudio({
            title: input.title,
            pages: input.pages,
            moral: input.moral,
            language: input.language,
            childName: input.childName,
            voiceStyle: input.voiceStyle,
            isPremium: auth.isPremium
          });

    console.log("[api/story/audio] audio generated", {
      mode: input.mode,
      mimeType: audio.mimeType,
      length: audio.audioDataUrl.length
    });

    return NextResponse.json({
      audioUrl: audio.audioDataUrl,
      mimeType: audio.mimeType
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    console.error("[api/story/audio] failed", error);
    const statusCode = message.toLowerCase().includes("required") || message.toLowerCase().includes("invalid") ? 400 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}