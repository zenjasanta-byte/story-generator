import { notFound } from "next/navigation";
import { AccountPageClient } from "@/components/account/AccountPageClient";
import { normalizeLanguageCode } from "@/lib/narrationVoices";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLanguageCode(locale);

  if (normalized !== locale) {
    notFound();
  }

  return <AccountPageClient locale={normalized} />;
}
