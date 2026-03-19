"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { StoryForm } from "@/components/StoryForm";
import { StoryResultCard } from "@/components/StoryResultCard";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import { pushStoryHistory } from "@/lib/storyHistory";
import { getUiTranslations } from "@/lib/uiTranslations";
import type { SavedStory, StoryFormInput, StoryResponse } from "@/types/story";

const paywallCopy: Record<
  SupportedLanguage,
  {
    limitReached: string;
    featureLocked: string;
    openPremium: string;
    freeStoriesLeft: string;
    lastFreeStory: string;
    freeStoriesFinished: string;
    freeStoriesDescription: string;
    checkoutFailed: string;
  }
> = {
  ru: {
    limitReached: "\u0412\u044b \u0434\u043e\u0441\u0442\u0438\u0433\u043b\u0438 \u043b\u0438\u043c\u0438\u0442\u0430 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u0438\u0441\u0442\u043e\u0440\u0438\u0439.",
    featureLocked: "\u042d\u0442\u0430 \u0444\u0443\u043d\u043a\u0446\u0438\u044f \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u0432 Premium.",
    openPremium: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043d\u0430 Premium",
    freeStoriesLeft: "\u0421\u0435\u0433\u043e\u0434\u043d\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u043e \u0438\u0441\u0442\u043e\u0440\u0438\u0439: {remaining} / 3",
    lastFreeStory: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u044f\u044f \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u0430\u044f \u0438\u0441\u0442\u043e\u0440\u0438\u044f",
    freeStoriesFinished: "\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0435 \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0438\u0441\u044c",
    freeStoriesDescription: "\u041e\u0444\u043e\u0440\u043c\u0438\u0442\u0435 Premium, \u0447\u0442\u043e\u0431\u044b \u0441\u043e\u0437\u0434\u0430\u0432\u0430\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435 \u0438\u0441\u0442\u043e\u0440\u0438\u0439.",
    checkoutFailed: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043e\u043f\u043b\u0430\u0442\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."
  },
  en: {
    limitReached: "You have reached the free story limit.",
    featureLocked: "This feature is available in Premium.",
    openPremium: "Unlock Premium",
    freeStoriesLeft: "Free stories left: {remaining} / 3",
    lastFreeStory: "Last free story",
    freeStoriesFinished: "Your free stories are finished",
    freeStoriesDescription: "Unlock unlimited magical stories for your child.",
    checkoutFailed: "Could not open checkout. Please try again."
  },
  es: {
    limitReached: "Has alcanzado el limite gratuito de historias.",
    featureLocked: "Esta funcion esta disponible en Premium.",
    openPremium: "Abrir Premium",
    freeStoriesLeft: "Historias gratis restantes: {remaining} / 3",
    lastFreeStory: "Ultima historia gratis",
    freeStoriesFinished: "Tus historias gratis se han terminado",
    freeStoriesDescription: "Desbloquea historias magicas ilimitadas para tu hijo.",
    checkoutFailed: "No se pudo abrir el pago. Intentalo de nuevo."
  },
  de: {
    limitReached: "Du hast das kostenlose Geschichtenlimit erreicht.",
    featureLocked: "Diese Funktion ist in Premium verfuegbar.",
    openPremium: "Premium oeffnen",
    freeStoriesLeft: "Kostenlose Geschichten uebrig: {remaining} / 3",
    lastFreeStory: "Letzte kostenlose Geschichte",
    freeStoriesFinished: "Deine kostenlosen Geschichten sind aufgebraucht",
    freeStoriesDescription: "Schalte unbegrenzt magische Geschichten fuer dein Kind frei.",
    checkoutFailed: "Checkout konnte nicht geoeffnet werden. Bitte versuche es erneut."
  },
  fr: {
    limitReached: "Vous avez atteint la limite gratuite d'histoires.",
    featureLocked: "Cette fonctionnalite est disponible en Premium.",
    openPremium: "Ouvrir Premium",
    freeStoriesLeft: "Histoires gratuites restantes : {remaining} / 3",
    lastFreeStory: "Derniere histoire gratuite",
    freeStoriesFinished: "Vos histoires gratuites sont terminees",
    freeStoriesDescription: "Debloquez des histoires magiques illimitees pour votre enfant.",
    checkoutFailed: "Impossible d'ouvrir le paiement. Veuillez reessayer."
  },
  it: {
    limitReached: "Hai raggiunto il limite gratuito di storie.",
    featureLocked: "Questa funzione e disponibile in Premium.",
    openPremium: "Apri Premium",
    freeStoriesLeft: "Storie gratuite rimanenti: {remaining} / 3",
    lastFreeStory: "Ultima storia gratuita",
    freeStoriesFinished: "Le tue storie gratuite sono finite",
    freeStoriesDescription: "Sblocca storie magiche illimitate per il tuo bambino.",
    checkoutFailed: "Impossibile aprire il pagamento. Riprova."
  },
  pt: {
    limitReached: "Voce atingiu o limite gratuito de historias.",
    featureLocked: "Este recurso esta disponivel no Premium.",
    openPremium: "Abrir Premium",
    freeStoriesLeft: "Historias gratis restantes: {remaining} / 3",
    lastFreeStory: "Ultima historia gratis",
    freeStoriesFinished: "Suas historias gratis acabaram",
    freeStoriesDescription: "Desbloqueie historias magicas ilimitadas para sua crianca.",
    checkoutFailed: "Nao foi possivel abrir o pagamento. Tente novamente."
  },
  zh: {
    limitReached: "\u60a8\u5df2\u8fbe\u5230\u514d\u8d39\u6545\u4e8b\u6570\u91cf\u9650\u5236",
    featureLocked: "\u6b64\u529f\u80fd\u4ec5\u5728 Premium \u4e2d\u53ef\u7528\u3002",
    openPremium: "\u5347\u7ea7 Premium",
    freeStoriesLeft: "\u4eca\u5929\u521b\u5efa\u7684\u6545\u4e8b\uff1a{remaining} / 3",
    lastFreeStory: "\u6700\u540e\u4e00\u4e2a\u514d\u8d39\u6545\u4e8b",
    freeStoriesFinished: "\u514d\u8d39\u6545\u4e8b\u6b21\u6570\u5df2\u7528\u5b8c",
    freeStoriesDescription: "\u5347\u7ea7\u5230 Premium \u4ee5\u89e3\u9501\u65e0\u9650\u6545\u4e8b",
    checkoutFailed: "\u65e0\u6cd5\u6253\u5f00\u7ed3\u8d26\u9875\u9762\uff0c\u8bf7\u91cd\u8bd5\u3002"
  }
};

function localeToStoryLanguage(locale: SupportedLanguage): string {
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
  const languageCode = useMemo(() => normalizeLanguageCode(selectedStoryLanguage), [selectedStoryLanguage]);
  const t = useMemo(() => getUiTranslations(selectedStoryLanguage), [selectedStoryLanguage]);
  const tPaywall = useMemo(() => paywallCopy[languageCode] || paywallCopy.en, [languageCode]);

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
      alert("Not enough credits");
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
          setPaywallMessage(tPaywall.featureLocked);
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
                <p className="text-sm font-semibold text-[#5b466f]">Осталось кредитов: {credits}</p>
                {paywallMessage ? <p className="text-sm font-semibold text-[#9f4967]">{paywallMessage}</p> : null}
              </div>
            }
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
