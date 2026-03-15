"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import { clearStoryHistory, getStoryHistory } from "@/lib/storyHistory";
import type { SavedStory } from "@/types/story";

const historyCopy: Record<SupportedLanguage, {
  savedLabel: string;
  title: string;
  subtitle: string;
  backHome: string;
  clearHistory: string;
  emptyTitle: string;
  emptySubtitle: string;
  forLabel: string;
  styleLabel: string;
  themeLabel: string;
  illustrationsSaved: string;
  pagePreview: string;
}> = {
  en: {
    savedLabel: "Saved Locally",
    title: "Story History",
    subtitle: "Showing your latest {count} stories (up to 10).",
    backHome: "Back Home",
    clearHistory: "Clear History",
    emptyTitle: "No stories yet",
    emptySubtitle: "Generate your first story on the home page to see it here.",
    forLabel: "For",
    styleLabel: "Style",
    themeLabel: "Theme",
    illustrationsSaved: "Illustrations saved",
    pagePreview: "Page 1 Preview"
  },
  ru: {
    savedLabel: "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e",
    title: "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0441\u043a\u0430\u0437\u043e\u043a",
    subtitle: "\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u044b \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u0438\u0441\u0442\u043e\u0440\u0438\u0438: {count} \u0438\u0437 10.",
    backHome: "\u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e",
    clearHistory: "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
    emptyTitle: "\u0418\u0441\u0442\u043e\u0440\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442",
    emptySubtitle: "\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043f\u0435\u0440\u0432\u0443\u044e \u0438\u0441\u0442\u043e\u0440\u0438\u044e \u043d\u0430 \u0433\u043b\u0430\u0432\u043d\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435, \u0438 \u043e\u043d\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.",
    forLabel: "\u0414\u043b\u044f",
    styleLabel: "\u0421\u0442\u0438\u043b\u044c",
    themeLabel: "\u0422\u0435\u043c\u0430",
    illustrationsSaved: "\u0418\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0439 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e",
    pagePreview: "\u041f\u0440\u0435\u0432\u044c\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b 1"
  },
  es: {
    savedLabel: "Guardado localmente",
    title: "Historial de historias",
    subtitle: "Mostrando tus ultimas historias: {count} de 10.",
    backHome: "Volver al inicio",
    clearHistory: "Borrar historial",
    emptyTitle: "Todavia no hay historias",
    emptySubtitle: "Genera tu primera historia en la pagina principal para verla aqui.",
    forLabel: "Para",
    styleLabel: "Estilo",
    themeLabel: "Tema",
    illustrationsSaved: "Ilustraciones guardadas",
    pagePreview: "Vista previa de la pagina 1"
  },
  de: {
    savedLabel: "Lokal gespeichert",
    title: "Geschichtsverlauf",
    subtitle: "Deine letzten Geschichten: {count} von 10.",
    backHome: "Zur Startseite",
    clearHistory: "Verlauf loschen",
    emptyTitle: "Noch keine Geschichten",
    emptySubtitle: "Erstelle deine erste Geschichte auf der Startseite, um sie hier zu sehen.",
    forLabel: "Fur",
    styleLabel: "Stil",
    themeLabel: "Thema",
    illustrationsSaved: "Gespeicherte Illustrationen",
    pagePreview: "Vorschau Seite 1"
  },
  fr: {
    savedLabel: "Enregistre localement",
    title: "Historique des histoires",
    subtitle: "Affichage de tes dernieres histoires : {count} sur 10.",
    backHome: "Retour a l'accueil",
    clearHistory: "Effacer l'historique",
    emptyTitle: "Pas encore d'histoires",
    emptySubtitle: "Genere ta premiere histoire sur la page d'accueil pour la voir ici.",
    forLabel: "Pour",
    styleLabel: "Style",
    themeLabel: "Theme",
    illustrationsSaved: "Illustrations enregistrees",
    pagePreview: "Apercu de la page 1"
  },
  it: {
    savedLabel: "Salvato localmente",
    title: "Cronologia delle storie",
    subtitle: "Visualizzazione delle ultime storie: {count} su 10.",
    backHome: "Torna alla home",
    clearHistory: "Cancella cronologia",
    emptyTitle: "Ancora nessuna storia",
    emptySubtitle: "Genera la tua prima storia nella home per vederla qui.",
    forLabel: "Per",
    styleLabel: "Stile",
    themeLabel: "Tema",
    illustrationsSaved: "Illustrazioni salvate",
    pagePreview: "Anteprima pagina 1"
  },
  pt: {
    savedLabel: "Salvo localmente",
    title: "Historico de historias",
    subtitle: "Mostrando suas ultimas historias: {count} de 10.",
    backHome: "Voltar ao inicio",
    clearHistory: "Limpar historico",
    emptyTitle: "Ainda nao ha historias",
    emptySubtitle: "Gere sua primeira historia na pagina inicial para ve-la aqui.",
    forLabel: "Para",
    styleLabel: "Estilo",
    themeLabel: "Tema",
    illustrationsSaved: "Ilustracoes salvas",
    pagePreview: "Previa da pagina 1"
  },
  zh: {
    savedLabel: "\u672c\u5730\u4fdd\u5b58",
    title: "\u6545\u4e8b\u5386\u53f2",
    subtitle: "\u663e\u793a\u4f60\u6700\u8fd1\u7684\u6545\u4e8b\uff1a{count} / 10\u3002",
    backHome: "\u8fd4\u56de\u9996\u9875",
    clearHistory: "\u6e05\u7a7a\u5386\u53f2",
    emptyTitle: "\u8fd8\u6ca1\u6709\u6545\u4e8b",
    emptySubtitle: "\u5148\u5728\u9996\u9875\u751f\u6210\u4f60\u7684\u7b2c\u4e00\u4e2a\u6545\u4e8b\uff0c\u5b83\u5c31\u4f1a\u663e\u793a\u5728\u8fd9\u91cc\u3002",
    forLabel: "\u5bf9\u8c61",
    styleLabel: "\u98ce\u683c",
    themeLabel: "\u4e3b\u9898",
    illustrationsSaved: "\u5df2\u4fdd\u5b58\u63d2\u56fe",
    pagePreview: "\u7b2c 1 \u9875\u9884\u89c8"
  }
};

function format(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export default function StoryHistoryPage() {
  const params = useParams<{locale: string}>();
  const currentLocale = normalizeLanguageCode(String(params.locale || "en"));
  const t = useMemo(() => historyCopy[currentLocale] || historyCopy.en, [currentLocale]);
  const [stories, setStories] = useState<SavedStory[]>([]);

  useEffect(() => {
    setStories(getStoryHistory());
  }, []);

  function handleClear() {
    clearStoryHistory();
    setStories([]);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="glass-card mb-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{t.savedLabel}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-2 text-slate-600">{format(t.subtitle, stories.length)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={
              "/" + currentLocale
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t.backHome}
          </Link>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {t.clearHistory}
          </button>
        </div>
      </header>

      {stories.length === 0 ? (
        <section className="glass-card rounded-3xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">{t.emptyTitle}</h2>
          <p className="mt-2 text-slate-600">{t.emptySubtitle}</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {stories.map((item) => (
            <article key={item.id} className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-900">{item.output.title}</h2>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">{item.output.age_label}</span>
              </div>
              <p className="mb-2 text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              <p className="mb-2 text-sm text-slate-700">
                <strong>{t.forLabel}:</strong> {item.input.childName}, {item.input.age} years old | <strong>{t.styleLabel}:</strong> {item.input.style} | <strong>{t.themeLabel}:</strong>{" "}
                {item.input.theme}
              </p>
              <p className="mb-3 text-xs font-medium text-slate-500">
                {t.illustrationsSaved}: {item.output.successfulIllustrations}/{item.output.totalIllustrations}
              </p>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.pagePreview}</p>
              <p className="max-h-28 overflow-hidden whitespace-pre-wrap text-slate-700">{item.output.pages[0]?.text || ""}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
