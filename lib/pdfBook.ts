"use client";

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

function slugifyTitle(value: string): string {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  return cleaned || "story-book";
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

async function fetchFontBinary(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load PDF font: ${path}`);
  }

  const buffer = await response.arrayBuffer();
  return uint8ArrayToBinaryString(new Uint8Array(buffer));
}

async function registerPdfUnicodeFont(doc: any) {
  if (!cachedFontBinaries) {
    const [regularBinary, boldBinary] = await Promise.all([
      fetchFontBinary("/fonts/arial.ttf"),
      fetchFontBinary("/fonts/arialbd.ttf")
    ]);
    cachedFontBinaries = { regular: regularBinary, bold: boldBinary };
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

  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to convert image to data URL"));
    };
    reader.onerror = () => reject(new Error("FileReader failed for image conversion"));
    reader.readAsDataURL(blob);
  });
}

function detectPdfImageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  const normalized = dataUrl.slice(0, 40).toLowerCase();
  if (normalized.includes("image/jpeg") || normalized.includes("image/jpg")) return "JPEG";
  if (normalized.includes("image/webp")) return "WEBP";
  return "PNG";
}

const pdfCoverSubtitleByUiLanguage = {
  en: "A personalized picture book",
  ru: "Персональная книга для чтения",
  de: "Ein personalisiertes Bilderbuch",
  es: "Un libro ilustrado personalizado",
  fr: "Un livre illustré personnalisé",
  it: "Un libro illustrato personalizzato",
  pt: "Um livro ilustrado personalizado",
  zh: "一本个性化图画书"
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

async function buildStoryBookPdfDocument(story: StoryResponse, storyLanguage: string = "English") {
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
    doc.text(`Страница ${page.pageNumber}`, margin, 14);

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
        doc.text("Иллюстрация недоступна для PDF", margin + 8, imageTop + imageHeight / 2);
      }
    } else {
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, imageTop, imageWidth, imageHeight);
      doc.setFont(PDF_FONT_FAMILY, "normal");
      doc.setFontSize(11);
      doc.text("Иллюстрация недоступна", margin + 8, imageTop + imageHeight / 2);
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
  doc.text("Мораль", margin, 35);
  doc.setFont(PDF_FONT_FAMILY, "normal");
  doc.setFontSize(12);
  const moralText = doc.splitTextToSize(`${story.moral}\n\n${story.age_label}`, pageWidth - margin * 2);
  doc.text(moralText, margin, 50);

  return doc;
}

export async function generateStoryBookPdfBlob(story: StoryResponse, storyLanguage: string = "English"): Promise<Blob> {
  const doc = await buildStoryBookPdfDocument(story, storyLanguage);
  return doc.output("blob");
}

export async function downloadStoryBookPdf(story: StoryResponse, storyLanguage: string = "English") {
  const pdfBlob = await generateStoryBookPdfBlob(story, storyLanguage);
  const url = URL.createObjectURL(pdfBlob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slugifyTitle(story.title)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}





