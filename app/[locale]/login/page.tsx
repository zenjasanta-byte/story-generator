import { notFound } from "next/navigation";
import { AuthFormCard } from "@/components/AuthFormCard";
import { normalizeLanguageCode } from "@/lib/narrationVoices";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLanguageCode(locale);

  if (normalized !== locale) {
    notFound();
  }

  return <AuthFormCard locale={normalized} mode="login" />;
}
