import { notFound } from "next/navigation";
import { getLegalTranslations } from "@/lib/legalContent";
import { normalizeLanguageCode } from "@/lib/narrationVoices";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";

export default async function RefundsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLanguageCode(locale);

  if (normalized !== locale) {
    notFound();
  }

  return <LegalDocumentPage document={getLegalTranslations(normalized).refunds} />;
}
