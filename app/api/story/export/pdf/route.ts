import { NextResponse } from "next/server";
import { generateStoryBookPdfBuffer } from "@/lib/pdfBookServer";
import { canExportPdf, requirePremiumAccess } from "@/lib/premiumGuards";
import type { StoryResponse } from "@/types/story";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const auth = await requirePremiumAccess("story_export_pdf");
    if (!auth.ok) {
      return auth.response;
    }

    if (!canExportPdf(auth.billing)) {
      console.warn("[api/story/export/pdf] blocked", {
        userId: auth.userId,
        feature: "story_export_pdf",
        plan: auth.billing.plan
      });

      return NextResponse.json(
        { error: "Premium subscription required", upgradeRequired: true },
        { status: 403 }
      );
    }

    const body = (await request.json()) as { story?: StoryResponse; storyLanguage?: string };
    if (!body?.story) {
      return NextResponse.json({ error: "Missing story payload." }, { status: 400 });
    }

    const pdfBuffer = await generateStoryBookPdfBuffer(body.story, body.storyLanguage || "English");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="storybook.pdf"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error: unknown) {
    console.error("[api/story/export/pdf] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export PDF." },
      { status: 500 }
    );
  }
}
