"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLegalTranslations, SUPPORT_EMAIL_PLACEHOLDER } from "@/lib/legalContent";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import { SITE_NAME } from "@/lib/siteConfig";

export default function PremiumPage() {
  const params = useParams<{ locale: string }>();
  const currentLocale = String(params.locale || "en");

  const currentLanguageCode = useMemo(
    () => normalizeLanguageCode(currentLocale),
    [currentLocale]
  );

  const t = useMemo(() => {
    return {
      title: "Premium",
      subtitle: "Choose your credits",
      back: "Back",
      error: "Payment failed",
    };
  }, []);

  const legalFooter = useMemo(
    () => getLegalTranslations(currentLanguageCode).footer,
    [currentLanguageCode]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(plan: "small" | "medium" | "large") {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          locale: currentLocale,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No URL");
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  const homeHref = useMemo(() => `/${currentLocale}`, [currentLocale]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-500 mb-6">{t.subtitle}</p>

        <div className="grid gap-4">
          <button
            onClick={() => handleCheckout("small")}
            className="rounded-xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="text-lg font-bold">€10</div>
            <div className="text-sm text-gray-500">40 credits</div>
          </button>

          <button
            onClick={() => handleCheckout("medium")}
            className="rounded-xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="text-lg font-bold">€20</div>
            <div className="text-sm text-gray-500">100 credits</div>
          </button>

          <button
            onClick={() => handleCheckout("large")}
            className="rounded-xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="text-lg font-bold">€30</div>
            <div className="text-sm text-gray-500">180 credits</div>
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        <Link
          href={homeHref}
          className="block mt-6 text-sm text-gray-500 hover:underline"
        >
          {t.back}
        </Link>

        <div className="mt-6 text-xs text-gray-400">
          <p>{legalFooter.support}</p>
          <p>{SUPPORT_EMAIL_PLACEHOLDER}</p>
        </div>
      </div>
    </main>
  );
}