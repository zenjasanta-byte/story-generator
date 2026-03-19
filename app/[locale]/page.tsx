"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BuyCredits from "@/components/BuyCredits";
import { EmptyState } from "@/components/EmptyState";
import { StoryForm } from "@/components/StoryForm";
import { StoryResultCard } from "@/components/StoryResultCard";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import { pushStoryHistory } from "@/lib/storyHistory";
import { getUiTranslations } from "@/lib/uiTranslations";
import type { SavedStory, StoryFormInput, StoryResponse } from "@/types/story";

type AccountOverviewResponse = {
  isAuthenticated: boolean;
};

function localeToStoryLanguage(locale: ReturnType<typeof normalizeLanguageCode>): string {
  const map: Record<SupportedLanguage, string> = {
    en: "English",
    ru: "Russian",
    es: "Spanish",
    de: "German",
    fr: "French",
    it: "Italian",
    pt: "Portuguese",
    zh: "Chinese"
  };

  return map[locale] || "English";
}

export default function HomePage() {
  const params = useParams<{locale: string}>();
  const router = useRouter();
  const currentLocale = normalizeLanguageCode(String(params.locale || "en"));
  const [credits, setCredits] = useState(0);
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [lastChildName, setLastChildName] = useState<string>("");
  const [storyViewKey, setStoryViewKey] = useState(0);
  const [selectedStoryLanguage, setSelectedStoryLanguage] = useState(() => localeToStoryLanguage(currentLocale));
  const [paywallMessage, setPaywallMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const t = useMemo(() => getUiTranslations(selectedStoryLanguage), [selectedStoryLanguage]);

  useEffect(() => {
    let cancelled = false;

    async function loadCredits() {
      try {
        const response = await fetch("/api/credits", { cache: "no-store" });
        const payload = await response.json();
        if (!cancelled) {
          setCredits(Number(payload?.credits) || 0);
        }
      } catch {
        if (!cancelled) {
          setCredits(0);
        }
      }
    }

    void loadCredits();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAccountState() {
      try {
        const response = await fetch("/api/account/overview", { cache: "no-store" });
        const payload = (await response.json()) as AccountOverviewResponse;

        if (!cancelled) {
          setIsAuthenticated(Boolean(payload?.isAuthenticated));
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      }
    }

    void loadAccountState();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSelectedStoryLanguage(localeToStoryLanguage(currentLocale));
  }, [currentLocale]);

  const copyText = useMemo(() => {
    if (!story) return "";
    const pagesText = story.pages
      .slice()
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .map((page) => `Page ${page.pageNumber}: ${page.sceneTitle}\n${page.text}`)
      .join("\n\n");

    return `${story.title}\n\n${pagesText}\n\nMoral: ${story.moral}\n${story.age_label}`;
  }, [story]);

  function handleLanguageChange(language: string) {
    setSelectedStoryLanguage(language);

    const nextLocale = normalizeLanguageCode(language);
    if (nextLocale !== currentLocale) {
      router.replace(`/${nextLocale}`);
    }
  }

  async function handleGenerate(input: StoryFormInput, turnstileToken: string) {
    if (credits < 5) {
      setPaywallMessage("Недостаточно кредитов");
      return;
    }

    setSelectedStoryLanguage(input.language);

    setLoading(true);
    setError(null);
    setCopySuccess(false);
    setPaywallMessage(null);
    setLastChildName(input.childName);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          turnstileToken
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        if (payload?.upgradeRequired) {
          setPaywallMessage(payload?.error || t.home.errors.generateFailed);
          return;
        }

        throw new Error(payload?.error || t.home.errors.generateFailed);
      }

      setStory(payload);
      setStoryViewKey((prev) => prev + 1);

      const successCount = Array.isArray(payload.illustrations)
        ? payload.illustrations.filter((item: { url: string | null }) => item.url).length
        : 0;
      const totalCount = Array.isArray(payload.illustrations) ? payload.illustrations.length : 0;

      const item: SavedStory = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
        input,
        output: {
          title: payload.title,
          pages: payload.pages,
          moral: payload.moral,
          age_label: payload.age_label,
          successfulIllustrations: successCount,
          totalIllustrations: totalCount
        }
      };
      pushStoryHistory(item);

      if (typeof payload?.creditsRemaining === "number") {
        setCredits(payload.creditsRemaining);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.home.errors.unexpected);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1800);
    } catch {
      setError(t.home.errors.copyFailed);
    }
  }

  function handleDownload() {
    if (!story) return;

    const pagesText = story.pages
      .slice()
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .map((page) => `Page ${page.pageNumber}: ${page.sceneTitle}\n${page.text}`)
      .join("\n\n");

    const txt = `${story.title}\n\n${pagesText}\n\nMoral: ${story.moral}\n${story.age_label}\n`;
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${story.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "story"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownloadPdf() {
    if (!story) return;

    try {
      const response = await fetch("/api/story/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story,
          storyLanguage: selectedStoryLanguage
        })
      });

      if (response.status === 403) {
        const payload = await response.json().catch(() => ({}));
        if (payload?.upgradeRequired) {
          setPaywallMessage(payload?.error || "Недостаточно кредитов");
          return;
        }
      }

      if (!response.ok) {
        throw new Error("PDF export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${story.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "story"}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(t.home.errors.pdfFailed);
    }
  }

  return (
    <main className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb left-[2%] top-[2%]" />
        <div className="hero-orb hero-orb-alt right-[4%] top-[16%]" />
        <span className="fairy-sparkle left-[14%] top-[22%]" />
        <span className="fairy-sparkle right-[18%] top-[10%]" style={{ animationDelay: "0.9s" }} />
        <span className="fairy-sparkle right-[32%] top-[30%]" style={{ animationDelay: "1.6s" }} />
      </div>

      <header className="animate-fade-up mb-10 overflow-hidden rounded-[30px] border border-white/50 bg-gradient-to-br from-[#fff6ec]/95 via-[#fff3fb]/95 to-[#edf7ff]/90 p-6 shadow-[0_22px_50px_rgba(111,79,152,0.2)] sm:p-9">
        <div className="relative">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#ffd4ad]/45 blur-2xl" />
          <div className="absolute right-24 top-3 h-10 w-10 rounded-full bg-[#e6d4ff]/60 blur-xl" />

          <p className="inline-flex items-center gap-2 rounded-full border border-[#ffdcb9] bg-[#fff7ec] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5f2b]">
            {t.home.badge}
            <span>{"\u2726"}</span>
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl lg:text-6xl">{t.home.heroTitle}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#5c4a6f] sm:text-lg">{t.home.heroSubtitle}</p>

          <div className="mt-6">
            <Link
              href={`/${currentLocale}/history`}
              className="storybook-button storybook-button-soft inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              {t.home.historyButton}
              <span>{"\u2197"}</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="mb-8 grid animate-fade-up gap-4 sm:grid-cols-3">
        <MetricCard title={t.home.metrics.safeTitle} value={t.home.metrics.safeValue} subtitle={t.home.metrics.safeSubtitle} />
        <MetricCard title={t.home.metrics.langTitle} value={t.home.metrics.langValue} subtitle={t.home.metrics.langSubtitle} />
        <MetricCard title={t.home.metrics.saveTitle} value={t.home.metrics.saveValue} subtitle={t.home.metrics.saveSubtitle} />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr] lg:items-start">
        <div className="space-y-4">
          <StoryForm
            onGenerate={handleGenerate}
            loading={loading}
            initialLanguage={localeToStoryLanguage(currentLocale)}
            onLanguageChange={handleLanguageChange}
            footerContent={
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#5b466f]">Кредиты: {credits}</p>
                {!isAuthenticated ? <p className="text-sm font-semibold text-[#9f4967]">Войдите чтобы создать историю</p> : null}
                {isAuthenticated && credits < 5 ? <p className="text-sm font-semibold text-[#9f4967]">Недостаточно кредитов</p> : null}
                {paywallMessage ? <p className="text-sm font-semibold text-[#9f4967]">{paywallMessage}</p> : null}
              </div>
            }
            submitDisabled={!isAuthenticated || credits < 5}
          />

          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
              color: "#fff",
              marginTop: "20px",
              textAlign: "center"
            }}
          >
            <h3>💰 Your Credits</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {credits}
            </p>
            <p style={{ opacity: 0.7 }}>
              1 story = 5 credits
            </p>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "16px",
              background: "#fff",
              boxShadow: "0 12px 30px rgba(120, 84, 164, 0.12)"
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: "14px",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#3b2551"
              }}
            >
              Buy Credits
            </h3>
            <BuyCredits />
          </div>
        </div>

        <div className="space-y-5">
          {loading && (
            <section className="glass-card animate-fade-up rounded-3xl p-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#f6c6ff] border-t-[#8c6dff]" />
              <p className="text-lg font-semibold text-[#3e2e54]">{t.home.loadingTitle}</p>
              <p className="mt-1 text-sm text-[#6f6086]">{t.home.loadingSubtitle}</p>
            </section>
          )}

          {error && <p className="animate-fade-up rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm font-semibold text-red-700">{error}</p>}

          {!loading && !story && <EmptyState storyLanguage={selectedStoryLanguage} />}

          {!loading && story && (
            <StoryResultCard
              key={storyViewKey}
              data={story}
              childName={lastChildName || undefined}
              storyLanguage={selectedStoryLanguage}
              isPremium={false}
              premiumFeatureMessage="Not enough credits"
              premiumCtaLabel="Credits"
              onCopy={handleCopy}
              onDownload={handleDownload}
              onDownloadPdf={handleDownloadPdf}
              copySuccess={copySuccess}
              onReset={() => {
                setStory(null);
                setError(null);
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <article className="glass-card rounded-[22px] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(137,86,180,0.25)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b5f3b]">{title}</p>
      <p className="mt-2 text-2xl font-black text-[#3a2850]">{value}</p>
      <p className="mt-1 text-sm text-[#695a7e]">{subtitle}</p>
    </article>
  );
}
