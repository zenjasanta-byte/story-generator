import JSZip from "jszip";
import { NextResponse } from "next/server";
import { generateStoryBookPdfBuffer } from "@/lib/pdfBookServer";
import { canExportZip, requirePremiumAccess } from "@/lib/premiumGuards";
import type { StoryResponse } from "@/types/story";

export const runtime = "nodejs";

function audioDataUrlToBuffer(audioDataUrl: string): Buffer {
  const match = audioDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid audio data.");
  }

  return Buffer.from(match[2], "base64");
}

export async function POST(request: Request) {
  try {
    const auth = await requirePremiumAccess("story_export_zip");
    if (!auth.ok) {
      return auth.response;
    }

    if (!canExportZip(auth.billing)) {
      console.warn("[api/story/export/zip] blocked", {
        userId: auth.userId,
        feature: "story_export_zip",
        plan: auth.billing.plan
      });

      return NextResponse.json(
        { error: "Premium subscription required", upgradeRequired: true },
        { status: 403 }
      );
    }

    const body = (await request.json()) as {
      story?: StoryResponse;
      storyLanguage?: string;
      audioDataUrl?: string;
    };

    if (!body?.story || !body?.audioDataUrl) {
      return NextResponse.json({ error: "Missing export payload." }, { status: 400 });
    }

    const pdfBuffer = await generateStoryBookPdfBuffer(body.story, body.storyLanguage || "English");
    const audioBuffer = audioDataUrlToBuffer(body.audioDataUrl);

    const zip = new JSZip();
    zip.file("storybook.pdf", pdfBuffer);
    zip.file("storybook-audio.mp3", audioBuffer);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="story-pack.zip"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error: unknown) {
    console.error("[api/story/export/zip] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export ZIP." },
      { status: 500 }
    );
  }
}
