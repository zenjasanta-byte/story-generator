import { promises as fs } from "fs";
import path from "path";
import { getUiLanguageFromStoryLanguage } from "@/lib/uiTranslations";
import type { StoryIllustration, StoryPage, StoryResponse } from "@/types/story";

const PDF_FONT_FAMILY = "ArialUnicode";
const PDF_FONT_REGULAR_FILE = "ArialUnicode-Regular.ttf";
const PDF_FONT_BOLD_FILE = "ArialUnicode-Bold.ttf";

let cachedFontBinaries: { regular: string; bold: string } | null = null;

function resolveImageSrc(rawUrl: string): string {
  if (rawUrl.startsWith("data:") || rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  return `data:image/png;base64,${rawUrl}`;
}

function findIllustration(pageNumber: StoryPage["pageNumber"], illustrations: StoryIllustration[]) {
  return illustrations.find((item) => item.pageNumber === pageNumber) ?? null;
}

function uint8ArrayToBinaryString(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  let result = "";

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    result += String.fromCharCode(...chunk);
  }

  return result;
}

async function registerPdfUnicodeFont(doc: any) {
  if (!cachedFontBinaries) {
    const fontsDir = path.join(process.cwd(), "public", "fonts");
    const [regularBuffer, boldBuffer] = await Promise.all([
      fs.readFile(path.join(fontsDir, "arial.ttf")),
      fs.readFile(path.join(fontsDir, "arialbd.ttf"))
    ]);

    cachedFontBinaries = {
      regular: uint8ArrayToBinaryString(new Uint8Array(regularBuffer)),
      bold: uint8ArrayToBinaryString(new Uint8Array(boldBuffer))
    };
  }

  doc.addFileToVFS(PDF_FONT_REGULAR_FILE, cachedFontBinaries.regular);
  doc.addFont(PDF_FONT_REGULAR_FILE, PDF_FONT_FAMILY, "normal");

  doc.addFileToVFS(PDF_FONT_BOLD_FILE, cachedFontBinaries.bold);
  doc.addFont(PDF_FONT_BOLD_FILE, PDF_FONT_FAMILY, "bold");
}

async function urlToDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Image fetch failed (${response.status})`);
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const bytes = new Uint8Array(await response.arrayBuffer());
  return `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`;
}

function detectPdfImageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  const normalized = dataUrl.slice(0, 40).toLowerCase();
  if (normalized.includes("image/jpeg") || normalized.includes("image/jpg")) return "JPEG";
  if (normalized.includes("image/webp")) return "WEBP";
  return "PNG";
}

const pdfCoverSubtitleByUiLanguage = {
  en: "A personalized picture book",
  ru: "\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u0430\u044f \u043a\u043d\u0438\u0433\u0430 \u0434\u043b\u044f \u0447\u0442\u0435\u043d\u0438\u044f",
  de: "Ein personalisiertes Bilderbuch",
  es: "Un libro ilustrado personalizado",
  fr: "Un livre illustre personnalise",
  it: "Un libro illustrato personalizzato",
  pt: "Um livro ilustrado personalizado",
  zh: "\u4e00\u672c\u4e2a\u6027\u5316\u56fe\u753b\u4e66"
} as const;

function getPdfCoverSubtitle(storyLanguage: string): string {
  const uiLanguage = getUiLanguageFromStoryLanguage(storyLanguage);
  return pdfCoverSubtitleByUiLanguage[uiLanguage] || pdfCoverSubtitleByUiLanguage.en;
}

async function preparePdfImage(url: string): Promise<{ dataUrl: string; format: "PNG" | "JPEG" | "WEBP" }> {
  const resolved = resolveImageSrc(url);
  const dataUrl = resolved.startsWith("data:") ? resolved : await urlToDataUrl(resolved);
  return { dataUrl, format: detectPdfImageFormat(dataUrl) };
}

export async function generateStoryBookPdfBuffer(story: StoryResponse, storyLanguage = "English"): Promise<Buffer> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  await registerPdfUnicodeFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const pages = story.pages.slice().sort((a, b) => a.pageNumber - b.pageNumber);

  doc.setFillColor(255, 247, 235);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setTextColor(40, 40, 40);
  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(26);
  doc.text(story.title, pageWidth / 2, 80, { align: "center", maxWidth: pageWidth - margin * 2 });
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(12);
  doc.text(getPdfCoverSubtitle(storyLanguage), pageWidth / 2, 95, { align: "center" });

  for (const page of pages) {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setFont(PDF_FONT_FAMILY, "bold");
    doc.setFontSize(12);
    doc.text(`Page ${page.pageNumber}`, margin, 14);
    doc.setFontSize(18);
    doc.text(page.sceneTitle, margin, 24, { maxWidth: pageWidth - margin * 2 });

    const illustration = findIllustration(page.pageNumber, story.illustrations);
    const imageTop = 32;
    const imageHeight = 105;
    const imageWidth = pageWidth - margin * 2;

    if (illustration?.url) {
      try {
        const image = await preparePdfImage(illustration.url);
        doc.addImage(image.dataUrl, image.format, margin, imageTop, imageWidth, imageHeight);
      } catch {
        doc.setDrawColor(220, 220, 220);
        doc.rect(margin, imageTop, imageWidth, imageHeight);
        doc.setFont(PDF_FONT_FAMILY, "normal");
        doc.setFontSize(11);
        doc.text("Illustration unavailable", margin + 8, imageTop + imageHeight / 2);
      }
    } else {
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, imageTop, imageWidth, imageHeight);
      doc.setFont(PDF_FONT_FAMILY, "normal");
      doc.setFontSize(11);
      doc.text("Illustration unavailable", margin + 8, imageTop + imageHeight / 2);
    }

    const textTop = imageTop + imageHeight + 10;
    doc.setFont(PDF_FONT_FAMILY, "normal");
    doc.setFontSize(12);
    const wrapped = doc.splitTextToSize(page.text, pageWidth - margin * 2);
    doc.text(wrapped, margin, textTop);
  }

  doc.addPage();
  doc.setFillColor(240, 249, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFont(PDF_FONT_FAMILY, "bold");
  doc.setFontSize(20);
  doc.text("Moral", margin, 35);
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(12);
  const moralText = doc.splitTextToSize(`${story.moral}\n\n${story.age_label}`, pageWidth - margin * 2);
  doc.text(moralText, margin, 50);

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
