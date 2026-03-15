"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { isPremiumVoiceStyle, normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import { getUiTranslations } from "@/lib/uiTranslations";
import type { StoryIllustration, StoryPage, StoryResponse, VoiceStyle } from "@/types/story";

type StoryResultCardProps = {
  data: StoryResponse;
  childName?: string;
  storyLanguage: string;
  onCopy: () => void;
  onDownload: () => void;
  onDownloadPdf: () => void;
  copySuccess: boolean;
  isPremium: boolean;
  premiumFeatureMessage: string;
  premiumCtaLabel: string;
  onReset: () => void;
};

function findIllustrationForPage(pageNumber: StoryPage["pageNumber"], illustrations: StoryIllustration[]) {
  return illustrations.find((item) => item.pageNumber === pageNumber) ?? null;
}

function resolveImageSrc(rawUrl: string): string {
  if (rawUrl.startsWith("data:") || rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  return `data:image/png;base64,${rawUrl}`;
}

function formatTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
const voiceStyleCopy: Record<
  SupportedLanguage,
  {
    sectionLabel: string;
    sectionDescription: string;
    label: string;
    helper: string;
    premiumBadge: string;
    premiumNotice: string;
    premiumCta: string;
    options: Record<VoiceStyle, string>;
  }
> = {
  ru: {
    sectionLabel: "\u0413\u043e\u043b\u043e\u0441 \u0441\u043a\u0430\u0437\u043a\u0438",
    sectionDescription:
      "\u041c\u044f\u0433\u043a\u0430\u044f \u0441\u043a\u0430\u0437\u043e\u0447\u043d\u0430\u044f \u043e\u0437\u0432\u0443\u0447\u043a\u0430 \u0441 \u043f\u043e\u0434\u0431\u043e\u0440\u043e\u043c \u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0433\u043e \u0433\u043e\u043b\u043e\u0441\u0430 \u0434\u043b\u044f \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e \u044f\u0437\u044b\u043a\u0430. \u041f\u043e\u043b\u043d\u0430\u044f \u0438\u0441\u0442\u043e\u0440\u0438\u044f \u0437\u0432\u0443\u0447\u0438\u0442 \u043a\u0430\u043a \u0443\u044e\u0442\u043d\u0430\u044f \u043a\u043d\u0438\u0433\u0430 \u043f\u0435\u0440\u0435\u0434 \u0441\u043d\u043e\u043c, \u0430 \u043e\u0437\u0432\u0443\u0447\u043a\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0432\u043a\u043b\u044e\u0447\u0430\u0435\u0442\u0441\u044f \u0431\u044b\u0441\u0442\u0440\u0435\u0435.",
    label: "\u0421\u0442\u0438\u043b\u044c \u0433\u043e\u043b\u043e\u0441\u0430",
    helper: "\u041c\u044b \u043f\u043e\u0434\u0431\u0435\u0440\u0435\u043c \u0441\u0430\u043c\u044b\u0439 \u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0433\u043e\u043b\u043e\u0441 \u0434\u043b\u044f \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e \u044f\u0437\u044b\u043a\u0430 \u0438 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u044f.",
    premiumBadge: "Premium",
    premiumNotice: "\u042d\u0442\u043e\u0442 \u0433\u043e\u043b\u043e\u0441 \u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0432 Premium.",
    premiumCta: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c Premium",
    options: {
      gentle: "\u041d\u0435\u0436\u043d\u044b\u0439 \u0433\u043e\u043b\u043e\u0441",
      fairy: "\u0421\u043a\u0430\u0437\u043e\u0447\u043d\u044b\u0439 \u0433\u043e\u043b\u043e\u0441",
      bedtime: "\u0421\u043f\u043e\u043a\u043e\u0439\u043d\u044b\u0439 \u0433\u043e\u043b\u043e\u0441 \u043d\u0430 \u043d\u043e\u0447\u044c"
    }
  },
  en: {
    sectionLabel: "Story voice",
    sectionDescription:
      "Soft fairy-tale narration with a natural voice chosen for the selected language. Full story mode feels like a cozy bedtime audiobook, while page mode starts faster.",
    label: "Voice style",
    helper: "We will choose the most neutral-sounding voice available for this language and mood.",
    premiumBadge: "Premium",
    premiumNotice: "This voice is available in Premium.",
    premiumCta: "Unlock Premium",
    options: {
      gentle: "Gentle voice",
      fairy: "Fairy voice",
      bedtime: "Calm bedtime voice"
    }
  },
  es: {
    sectionLabel: "Voz del cuento",
    sectionDescription:
      "Narracion suave de cuento con una voz natural elegida para el idioma seleccionado. La historia completa suena como un audiolibro para dormir, y la pagina individual se reproduce mas rapido.",
    label: "Estilo de voz",
    helper: "Elegiremos la voz mas natural y neutral disponible para este idioma y estilo.",
    premiumBadge: "Premium",
    premiumNotice: "Esta voz esta disponible en Premium.",
    premiumCta: "Abrir Premium",
    options: {
      gentle: "Voz suave",
      fairy: "Voz de cuento",
      bedtime: "Voz tranquila para dormir"
    }
  },
  de: {
    sectionLabel: "Maerchenstimme",
    sectionDescription:
      "Sanfte Maerchenerzaehlung mit einer moeglichst natuerlichen Stimme fuer die gewaehlte Sprache. Die ganze Geschichte klingt wie ein gemuetliches Hoerbuch zur Nacht, die Seitenversion startet schneller.",
    label: "Stimmstil",
    helper: "Wir waehlen die moeglichst natuerliche und neutrale Stimme fuer diese Sprache und Stimmung.",
    premiumBadge: "Premium",
    premiumNotice: "Diese Stimme ist in Premium verfuegbar.",
    premiumCta: "Premium oeffnen",
    options: {
      gentle: "Sanfte Stimme",
      fairy: "Maerchenhafte Stimme",
      bedtime: "Ruhige Abendstimme"
    }
  },
  fr: {
    sectionLabel: "Voix du conte",
    sectionDescription:
      "Une narration douce et feerique avec une voix naturelle choisie pour la langue selectionnee. L'histoire complete ressemble a un livre audio du soir, tandis que la page seule demarre plus vite.",
    label: "Style de voix",
    helper: "Nous choisirons la voix la plus naturelle et neutre possible pour cette langue et cette ambiance.",
    premiumBadge: "Premium",
    premiumNotice: "Cette voix est disponible en Premium.",
    premiumCta: "Ouvrir Premium",
    options: {
      gentle: "Voix douce",
      fairy: "Voix feerique",
      bedtime: "Voix calme du soir"
    }
  },
  it: {
    sectionLabel: "Voce della fiaba",
    sectionDescription:
      "Una narrazione fiabesca e delicata con la voce piu naturale per la lingua selezionata. La storia completa sembra un audiolibro della buonanotte, mentre la singola pagina parte piu velocemente.",
    label: "Stile della voce",
    helper: "Sceglieremo la voce piu naturale e neutra disponibile per questa lingua e atmosfera.",
    premiumBadge: "Premium",
    premiumNotice: "Questa voce e disponibile in Premium.",
    premiumCta: "Apri Premium",
    options: {
      gentle: "Voce delicata",
      fairy: "Voce fiabesca",
      bedtime: "Voce calma della buonanotte"
    }
  },
  pt: {
    sectionLabel: "Voz da historia",
    sectionDescription:
      "Uma narracao suave e encantada com a voz mais natural para o idioma selecionado. A historia completa soa como um audiolivro para dormir, enquanto a pagina individual comeca mais rapido.",
    label: "Estilo de voz",
    helper: "Vamos escolher a voz mais natural e neutra disponivel para este idioma e clima.",
    premiumBadge: "Premium",
    premiumNotice: "Esta voz esta disponivel no Premium.",
    premiumCta: "Abrir Premium",
    options: {
      gentle: "Voz suave",
      fairy: "Voz de conto de fadas",
      bedtime: "Voz calma para dormir"
    }
  },
  zh: {
    sectionLabel: "\u6545\u4e8b\u6717\u8bfb",
    sectionDescription: "\u4e3a\u6240\u9009\u8bed\u8a00\u6311\u9009\u5c3d\u53ef\u80fd\u81ea\u7136\u7684\u7ae5\u8bdd\u65c1\u767d\u58f0\u97f3\u3002\u5b8c\u6574\u6545\u4e8b\u50cf\u6e29\u67d4\u7684\u7761\u524d\u6709\u58f0\u4e66\uff0c\u5355\u9875\u6717\u8bfb\u5219\u4f1a\u66f4\u5feb\u5f00\u59cb\u3002",
    label: "\u8bed\u97f3\u98ce\u683c",
    helper: "\u6211\u4eec\u4f1a\u4e3a\u5f53\u524d\u8bed\u8a00\u548c\u98ce\u683c\u9009\u62e9\u5c3d\u53ef\u80fd\u81ea\u7136\u3001\u4e2d\u6027\u7684\u58f0\u97f3\u3002",
    premiumBadge: "Premium",
    premiumNotice: "\u6b64\u58f0\u97f3\u4ec5\u5728 Premium \u4e2d\u63d0\u4f9b\u3002",
    premiumCta: "\u5f00\u542f Premium",
    options: {
      gentle: "\u6e29\u67d4\u58f0\u97f3",
      fairy: "\u7ae5\u8bdd\u58f0\u97f3",
      bedtime: "\u665a\u5b89\u8f7b\u67d4\u58f0\u97f3"
    }
  }
};

const audioActionLabels: Record<
  SupportedLanguage,
  {
    listenFullStory: string;
    downloadAudio: string;
    downloadAll: string;
    preparing: string;
    preparingZip: string;
    narrationReady: string;
    fullNarrationDescription: string;
    downloadAudioError: string;
    downloadPackError: string;
  }
> = {
  ru: {
    listenFullStory: "\u0421\u043b\u0443\u0448\u0430\u0442\u044c \u0432\u0441\u044e \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
    downloadAudio: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c \u0430\u0443\u0434\u0438\u043e",
    downloadAll: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c \u0432\u0441\u0451",
    preparing: "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430...",
    preparingZip: "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 ZIP...",
    narrationReady: "\u041e\u0437\u0432\u0443\u0447\u043a\u0430 \u0433\u043e\u0442\u043e\u0432\u0430",
    fullNarrationDescription: "\u041f\u043e\u043b\u043d\u043e\u0435 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u043e\u0435 \u043e\u0437\u0432\u0443\u0447\u0438\u0432\u0430\u043d\u0438\u0435 \u0432\u0441\u0435\u0439 \u043a\u043d\u0438\u0433\u0438.",
    downloadAudioError: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043a\u0430\u0447\u0430\u0442\u044c \u0430\u0443\u0434\u0438\u043e. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",
    downloadPackError: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043a\u0430\u0447\u0430\u0442\u044c \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."
  },
  en: {
    listenFullStory: "Listen to the full story",
    downloadAudio: "Download audio",
    downloadAll: "Download all",
    preparing: "Preparing...",
    preparingZip: "Preparing ZIP...",
    narrationReady: "Narration is ready",
    fullNarrationDescription: "Full calm narration for the entire book.",
    downloadAudioError: "Could not download audio. Please try again.",
    downloadPackError: "Could not download the story pack. Please try again."
  },
  es: {
    listenFullStory: "Escuchar toda la historia",
    downloadAudio: "Descargar audio",
    downloadAll: "Descargar todo",
    preparing: "Preparando...",
    preparingZip: "Preparando ZIP...",
    narrationReady: "La narracion esta lista",
    fullNarrationDescription: "Narracion completa y tranquila para todo el libro.",
    downloadAudioError: "No se pudo descargar el audio. Intentalo de nuevo.",
    downloadPackError: "No se pudo descargar el paquete. Intentalo de nuevo."
  },
  de: {
    listenFullStory: "Die ganze Geschichte anhoeren",
    downloadAudio: "Audio herunterladen",
    downloadAll: "Alles herunterladen",
    preparing: "Wird vorbereitet...",
    preparingZip: "ZIP wird vorbereitet...",
    narrationReady: "Die Erzaehlung ist bereit",
    fullNarrationDescription: "Vollstaendige ruhige Erzaehlung fuer das ganze Buch.",
    downloadAudioError: "Das Audio konnte nicht heruntergeladen werden. Bitte versuche es erneut.",
    downloadPackError: "Das Paket konnte nicht heruntergeladen werden. Bitte versuche es erneut."
  },
  fr: {
    listenFullStory: "Ecouter toute l'histoire",
    downloadAudio: "Telecharger l'audio",
    downloadAll: "Tout telecharger",
    preparing: "Preparation...",
    preparingZip: "Preparation du ZIP...",
    narrationReady: "La narration est prete",
    fullNarrationDescription: "Narration complete et calme pour tout le livre.",
    downloadAudioError: "Impossible de telecharger l'audio. Veuillez reessayer.",
    downloadPackError: "Impossible de telecharger le pack. Veuillez reessayer."
  },
  it: {
    listenFullStory: "Ascolta tutta la storia",
    downloadAudio: "Scarica audio",
    downloadAll: "Scarica tutto",
    preparing: "Preparazione...",
    preparingZip: "Preparazione ZIP...",
    narrationReady: "La narrazione e pronta",
    fullNarrationDescription: "Narrazione completa e calma per tutto il libro.",
    downloadAudioError: "Impossibile scaricare l'audio. Riprova.",
    downloadPackError: "Impossibile scaricare il pacchetto. Riprova."
  },
  pt: {
    listenFullStory: "Ouvir a historia completa",
    downloadAudio: "Baixar audio",
    downloadAll: "Baixar tudo",
    preparing: "Preparando...",
    preparingZip: "Preparando ZIP...",
    narrationReady: "A narracao esta pronta",
    fullNarrationDescription: "Narracao completa e calma para todo o livro.",
    downloadAudioError: "Nao foi possivel baixar o audio. Tente novamente.",
    downloadPackError: "Nao foi possivel baixar o pacote. Tente novamente."
  },
  zh: {
    listenFullStory: "\u6536\u542c\u5b8c\u6574\u6545\u4e8b",
    downloadAudio: "\u4e0b\u8f7d\u97f3\u9891",
    downloadAll: "\u5168\u90e8\u4e0b\u8f7d",
    preparing: "\u51c6\u5907\u4e2d...",
    preparingZip: "\u6b63\u5728\u51c6\u5907 ZIP...",
    narrationReady: "\u65c1\u767d\u5df2\u51c6\u5907\u597d",
    fullNarrationDescription: "\u6574\u672c\u4e66\u7684\u5b8c\u6574\u6e29\u548c\u65c1\u767d\u3002",
    downloadAudioError: "\u65e0\u6cd5\u4e0b\u8f7d\u97f3\u9891\uff0c\u8bf7\u91cd\u8bd5\u3002",
    downloadPackError: "\u65e0\u6cd5\u4e0b\u8f7d\u6253\u5305\u6587\u4ef6\uff0c\u8bf7\u91cd\u8bd5\u3002"
  }
};

export function StoryResultCard({
  data,
  childName,
  storyLanguage,
  onCopy,
  onDownload,
  onDownloadPdf,
  copySuccess,
  isPremium,
  premiumFeatureMessage,
  premiumCtaLabel,
  onReset
}: StoryResultCardProps) {
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"cover" | "reading">("cover");

  const [audioSrc, setAudioSrc] = useState<string | null>(data.narrationAudioUrl || null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioDownloadLoading, setAudioDownloadLoading] = useState(false);
  const [audioDownloadError, setAudioDownloadError] = useState<string | null>(null);
  const [isDownloadingPack, setIsDownloadingPack] = useState(false);
  const [downloadPackError, setDownloadPackError] = useState<string | null>(null);
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>("bedtime");
  const [voiceStyleNotice, setVoiceStyleNotice] = useState<string | null>(null);
  const [premiumActionNotice, setPremiumActionNotice] = useState<string | null>(null);
  const [isFullStoryPlayerOpen, setIsFullStoryPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [pageAudioByNumber, setPageAudioByNumber] = useState<Record<number, string>>({});
  const [pageAudioLoading, setPageAudioLoading] = useState(false);
  const [pageAudioError, setPageAudioError] = useState<string | null>(null);
  const [isPageAudioPlaying, setIsPageAudioPlaying] = useState(false);
  const [shouldAutoplayPageAudio, setShouldAutoplayPageAudio] = useState(false);

  const fullStoryAudioRef = useRef<HTMLAudioElement | null>(null);
  const pageAudioRef = useRef<HTMLAudioElement | null>(null);

  const params = useParams<{locale: string}>();
  const currentLocale = String(params.locale || "en");

  const t = useMemo(() => getUiTranslations(storyLanguage), [storyLanguage]);
  const normalizedLanguage = useMemo(() => normalizeLanguageCode(storyLanguage), [storyLanguage]);
  const voiceStyleUi = useMemo(() => voiceStyleCopy[normalizedLanguage] || voiceStyleCopy.en, [normalizedLanguage]);
  const tAudio = useMemo(() => audioActionLabels[normalizedLanguage] || audioActionLabels.en, [normalizedLanguage]);

  const pages = useMemo(() => data.pages.slice().sort((a, b) => a.pageNumber - b.pageNumber), [data.pages]);

  useEffect(() => {
    setLoadedMap({});
    setCurrentPageIndex(0);
    setViewMode("cover");

    setAudioError(null);
    setAudioLoading(false);
    setAudioDownloadLoading(false);
    setAudioDownloadError(null);
    setIsDownloadingPack(false);
    setDownloadPackError(null);
    setAudioSrc(data.narrationAudioUrl || null);
    setVoiceStyleNotice(null);
    setIsFullStoryPlayerOpen(false);
    setIsPlaying(false);

    setPageAudioByNumber({});
    setPageAudioError(null);
    setPageAudioLoading(false);
    setIsPageAudioPlaying(false);
    setShouldAutoplayPageAudio(false);

    if (fullStoryAudioRef.current) {
      fullStoryAudioRef.current.pause();
      fullStoryAudioRef.current.currentTime = 0;
    }

    if (pageAudioRef.current) {
      pageAudioRef.current.pause();
      pageAudioRef.current.currentTime = 0;
    }
  }, [data.title, data.pages, data.illustrations, data.coverImageUrl, data.narrationAudioUrl]);

  useEffect(() => {
    setAudioSrc(data.narrationAudioUrl || null);
    setAudioError(null);
    setAudioDownloadError(null);
    setIsFullStoryPlayerOpen(false);
    setIsPlaying(false);
    setPageAudioByNumber({});
    setPageAudioError(null);

    if (fullStoryAudioRef.current) {
      fullStoryAudioRef.current.pause();
      fullStoryAudioRef.current.currentTime = 0;
    }

    if (pageAudioRef.current) {
      pageAudioRef.current.pause();
      pageAudioRef.current.currentTime = 0;
    }
  }, [voiceStyle, data.narrationAudioUrl]);

  const currentPage = pages[currentPageIndex];
  const currentIllustration = currentPage ? findIllustrationForPage(currentPage.pageNumber, data.illustrations) : null;

  const pageImageKey = currentPage ? `page-${currentPage.pageNumber}` : "";
  const pageImageLoaded = pageImageKey ? loadedMap[pageImageKey] : false;

  const successfulCount = data.illustrations.filter((item) => Boolean(item.url)).length;
  const isFirst = currentPageIndex === 0;
  const isLast = currentPageIndex === pages.length - 1;

  const pageImageSrc = currentIllustration?.url ? resolveImageSrc(currentIllustration.url) : "";
  const coverImageSrc = data.coverImageUrl ? resolveImageSrc(data.coverImageUrl) : "";
  const fullStoryAudioUrl = audioSrc;
  const isDownloadingAudio = audioDownloadLoading;
  const downloadAudioError = audioDownloadError;

  const currentPageAudioSrc = currentPage ? pageAudioByNumber[currentPage.pageNumber] || null : null;

  useEffect(() => {
    if (!isPremium && isPremiumVoiceStyle(voiceStyle)) {
      setVoiceStyle("bedtime");
    }
  }, [isPremium, voiceStyle]);

  function handleVoiceStyleSelect(option: VoiceStyle) {
    if (!isPremium && isPremiumVoiceStyle(option)) {
      setVoiceStyleNotice(voiceStyleUi.premiumNotice);
      return;
    }

    setVoiceStyle(option);
    setVoiceStyleNotice(null);
  }

  useEffect(() => {
    if (!shouldAutoplayPageAudio || !currentPageAudioSrc || !pageAudioRef.current) return;

    async function autoplayGeneratedPageAudio() {
      try {
        pageAudioRef.current!.currentTime = 0;
        await pageAudioRef.current!.play();
        setIsPageAudioPlaying(true);
        setShouldAutoplayPageAudio(false);
      } catch (error: unknown) {
        console.error("[page-audio-ui] autoplay failed", error);
        setPageAudioError(error instanceof Error ? error.message : t.reader.thisPageFailed);
        setShouldAutoplayPageAudio(false);
      }
    }

    void autoplayGeneratedPageAudio();
  }, [currentPageAudioSrc, shouldAutoplayPageAudio, t.reader.thisPageFailed]);

  useEffect(() => {
    setPageAudioError(null);
    setShouldAutoplayPageAudio(false);
    setIsPageAudioPlaying(false);

    if (pageAudioRef.current) {
      pageAudioRef.current.pause();
      pageAudioRef.current.currentTime = 0;
    }
  }, [currentPageIndex]);

  async function handleGenerateAudio() {
    if (audioLoading) return;
    if (audioSrc) return;

    setAudioLoading(true);
    setAudioError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      console.log("[audio-ui] starting generation request", { title: data.title, language: storyLanguage });
      const response = await fetch("/api/story/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode: "full",
          title: data.title,
          pages: data.pages,
          moral: data.moral,
          language: storyLanguage,
          voiceStyle,
          isPremium,
          childName
        })
      });

      const payload = await response.json();
      console.log("[audio-ui] response", { status: response.status, ok: response.ok, hasAudio: Boolean(payload?.audioUrl) });

      if (!response.ok || !payload?.audioUrl) {
        if (payload?.upgradeRequired) {
          setPremiumActionNotice(t.reader.premiumOnlyFeature || premiumFeatureMessage);
          setAudioError(null);
          return;
        }

        throw new Error(payload?.error || "Audio generation failed");
      }

      setAudioSrc(payload.audioUrl);
      setAudioError(null);
    } catch (error: unknown) {
      console.error("[audio-ui] generation error", error);
      setAudioError(error instanceof Error ? error.message : t.reader.audioFailed);
    } finally {
      clearTimeout(timeout);
      setAudioLoading(false);
    }
  }
  async function handleDownloadAudio(audioUrl: string) {
    if (!isPremium) {
      setPremiumActionNotice(premiumFeatureMessage);
      return;
    }
    if (audioDownloadLoading) return;

    setAudioDownloadLoading(true);
    setAudioDownloadError(null);

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error("Failed to download audio");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "storybook-audio.mp3";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error: unknown) {
      console.error("[audio-ui] download error", error);
      setAudioDownloadError(error instanceof Error ? error.message : tAudio.downloadAudioError);
    } finally {
      setAudioDownloadLoading(false);
    }
  }
  async function handleGenerateCurrentPageAudio() {
    if (!currentPage || pageAudioLoading) return;
    if (currentPageAudioSrc) {
      void handlePlayPageAudio();
      return;
    }

    setPageAudioLoading(true);
    setPageAudioError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

    try {
      console.log("[page-audio-ui] starting generation request", {
        title: data.title,
        pageNumber: currentPage.pageNumber,
        language: storyLanguage
      });

      const response = await fetch("/api/story/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode: "page",
          title: data.title,
          page: currentPage,
          language: storyLanguage,
          voiceStyle,
          isPremium,
          childName
        })
      });

      const payload = await response.json();
      console.log("[page-audio-ui] response", {
        status: response.status,
        ok: response.ok,
        hasAudio: Boolean(payload?.audioUrl)
      });

      if (!response.ok || !payload?.audioUrl) {
        if (payload?.upgradeRequired) {
          setPremiumActionNotice(t.reader.premiumOnlyFeature || premiumFeatureMessage);
          setPageAudioError(null);
          return;
        }

        throw new Error(payload?.error || "Page audio generation failed");
      }

      setPageAudioByNumber((prev) => ({
        ...prev,
        [currentPage.pageNumber]: payload.audioUrl
      }));
      setShouldAutoplayPageAudio(true);
      setPageAudioError(null);
    } catch (error: unknown) {
      console.error("[page-audio-ui] generation error", error);
      setPageAudioError(error instanceof Error ? error.message : t.reader.thisPageFailed);
    } finally {
      clearTimeout(timeout);
      setPageAudioLoading(false);
    }
  }

  async function handleDownloadPack() {
    if (!isPremium) {
      setPremiumActionNotice(premiumFeatureMessage);
      return;
    }
    if (isDownloadingPack || !fullStoryAudioUrl) return;

    setIsDownloadingPack(true);
    setDownloadPackError(null);

    try {
      const response = await fetch("/api/story/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: data,
          storyLanguage,
          audioDataUrl: fullStoryAudioUrl
        })
      });

      const contentType = response.headers.get("content-type") || "";
      if (response.status === 403 && contentType.includes("application/json")) {
        const payload = await response.json().catch(() => ({}));
        if (payload?.upgradeRequired) {
          setPremiumActionNotice(t.reader.premiumOnlyFeature || premiumFeatureMessage);
          return;
        }
      }

      if (!response.ok) {
        throw new Error("Failed to download story pack");
      }

      const zipBlob = await response.blob();
      const objectUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "story-pack.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error: unknown) {
      console.error("[story-pack] zip download error", error);
      setDownloadPackError(error instanceof Error ? error.message : tAudio.downloadPackError);
    } finally {
      setIsDownloadingPack(false);
    }
  }
  async function handlePlayFullStory() {
    if (isFullStoryPlayerOpen) {
      if (fullStoryAudioRef.current) {
        fullStoryAudioRef.current.pause();
        fullStoryAudioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setIsFullStoryPlayerOpen(false);
      return;
    }

    setIsFullStoryPlayerOpen(true);
    await handleGenerateAudio();
  }

  async function handlePlayPageAudio() {
    if (!pageAudioRef.current || !currentPageAudioSrc) return;

    try {
      await pageAudioRef.current.play();
      setIsPageAudioPlaying(true);
    } catch (error: unknown) {
      setPageAudioError(error instanceof Error ? error.message : t.reader.thisPageFailed);
    }
  }

  function handlePausePageAudio() {
    if (!pageAudioRef.current) return;
    pageAudioRef.current.pause();
    setIsPageAudioPlaying(false);
  }

  function handleRestartPageAudio() {
    if (!pageAudioRef.current) return;
    pageAudioRef.current.currentTime = 0;
    void handlePlayPageAudio();
  }

  return (
    <section className="glass-card animate-fade-up relative overflow-hidden rounded-[30px] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#ffd4ab]/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-[#d8c2ff]/35 blur-3xl" />

      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a5f2f]">{t.reader.headerLabel}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#3b2650] sm:text-3xl">{data.title}</h2>
        </div>

        <span className="rounded-full border border-[#f6cfa7] bg-[#fff4e4] px-4 py-1 text-sm font-semibold text-[#81522a] shadow-[0_6px_16px_rgba(190,140,82,0.2)]">
          {data.age_label}
        </span>
      </div>

      {viewMode === "cover" ? (
        <article className="animate-fade-up overflow-hidden rounded-[24px] border border-[#f1d7bc] bg-gradient-to-br from-[#fffef8] via-[#fff7ea] to-[#f8f0ff] shadow-[0_18px_38px_rgba(120,84,164,0.14)]">
          <div className="overflow-hidden bg-[#f9f2e9]">
            {data.coverImageUrl ? (
              <img key={`${data.title}-${data.coverImageUrl ?? "no-cover"}`} src={coverImageSrc} alt={data.coverImageAlt} className="h-64 w-full object-cover sm:h-80" />
            ) : (
              <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#fff4df] to-[#f2e8ff] p-4 text-center sm:h-80">
                <p className="text-sm font-medium text-[#705f85]">{t.reader.coverFallback}</p>
              </div>
            )}
          </div>

          <div className="p-6 text-center sm:p-8">
            <h3 className="text-3xl font-black text-[#39244f] sm:text-4xl">{data.title}</h3>
            <p className="mt-2 text-base font-medium text-[#6a5a7f]">{t.reader.coverSubtitle}</p>
            {childName && <p className="mt-2 text-sm font-semibold text-[#955e2f]">{t.reader.coverForPrefix} {childName}</p>}

            <button type="button" onClick={() => { setCurrentPageIndex(0); setViewMode("reading"); }} className="storybook-button storybook-button-primary mt-6 px-7 py-3 text-sm">
              {t.reader.startReading}
            </button>
          </div>
        </article>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#5f4d73]">{formatTemplate(t.reader.pageOf, { current: currentPage?.pageNumber ?? 1, total: pages.length })}</p>
            <p className="text-xs font-medium text-[#8a789f]">{formatTemplate(t.reader.illustrationsReady, { ready: successfulCount, total: data.illustrations.length })}</p>
          </div>

          {currentPage && (
            <article className="animate-fade-up overflow-hidden rounded-[24px] border border-[#efd7bd] bg-gradient-to-br from-[#fffdf8] via-[#fff8ee] to-[#f8f2ff] shadow-[0_16px_34px_rgba(118,82,157,0.15)]" key={`active-page-${data.title}-${currentPage.pageNumber}`}>
              <div className="flex items-center justify-between border-b border-[#f2e2cf] px-4 py-2">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#945d2d]">{t.reader.pageLabel} {currentPage.pageNumber}</p>
                <p className="text-xs font-medium text-[#766589]">{currentPage.sceneTitle}</p>
              </div>

              <div className="overflow-hidden bg-[#f9f2ea]/70">
                {currentIllustration?.url ? (
                  <div className="relative">
                    {!pageImageLoaded && <div className="h-56 w-full animate-pulse bg-gradient-to-r from-[#f8ecdc] via-[#f3e8ff] to-[#f8ecdc] sm:h-72" aria-hidden="true" />}
                    <img
                      key={`${data.title}-${currentPage.pageNumber}-${pageImageSrc.slice(0, 50)}`}
                      src={pageImageSrc}
                      alt={currentIllustration.alt}
                      onLoad={() => setLoadedMap((prev) => ({ ...prev, [pageImageKey]: true }))}
                      onError={() => setLoadedMap((prev) => ({ ...prev, [pageImageKey]: true }))}
                      className={`h-56 w-full object-cover transition-opacity duration-500 sm:h-72 ${pageImageLoaded ? "opacity-100" : "absolute inset-0 opacity-0"}`}
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#fff4df] to-[#f2e8ff] p-4 text-center sm:h-72">
                    <p className="text-xs font-medium text-[#6c5f7d]">{currentIllustration?.error || t.reader.illustrationUnavailable}</p>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-xl font-bold text-[#3a2650]">{currentPage.sceneTitle}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#5c4c70] sm:text-base">{currentPage.text}</p>
              </div>
            </article>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setCurrentPageIndex((idx) => Math.max(0, idx - 1))} disabled={isFirst} className="storybook-button storybook-button-soft px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
              {t.reader.previous}
            </button>

            <p className="text-sm font-semibold text-[#6a5b7e]">{formatTemplate(t.reader.pageOf, { current: currentPageIndex + 1, total: pages.length })}</p>

            <button type="button" onClick={() => setCurrentPageIndex((idx) => Math.min(pages.length - 1, idx + 1))} disabled={isLast} className="storybook-button storybook-button-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
              {t.reader.next}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => setViewMode("cover")} className="storybook-button storybook-button-soft rounded-full px-3 py-1 text-xs">
              {t.reader.backToCover}
            </button>

            {pages.map((page, idx) => {
              const active = idx === currentPageIndex;
              return (
                <button
                  key={`dot-${page.pageNumber}`}
                  type="button"
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition ${active ? "bg-[#8b63ff] shadow-[0_0_12px_rgba(139,99,255,0.8)]" : "bg-[#d8cce8] hover:bg-[#bca8d5]"}`}
                  aria-label={`${t.reader.pageLabel} ${page.pageNumber}`}
                />
              );
            })}
          </div>
        </>
      )}

      <div className="mt-6 rounded-2xl border border-[#f2d9bc] bg-gradient-to-br from-[#fff5e7] to-[#f8eefe] p-4 shadow-[0_10px_24px_rgba(145,103,186,0.14)]">
        <div className="mb-4 rounded-2xl border border-[#f4d8c2] bg-gradient-to-r from-[#fff8ef] via-[#fff4fb] to-[#f2f3ff] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a5f2f]">{voiceStyleUi.sectionLabel}</p>
          <p className="mt-2 text-sm leading-6 text-[#6b5a7f]">{voiceStyleUi.sectionDescription}</p>
        </div>

        <div className="rounded-2xl border border-[#ead6ff] bg-white/60 p-3 shadow-[0_8px_18px_rgba(126,94,170,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7f5baf]">{voiceStyleUi.label}</p>
          <p className="mt-1 text-xs leading-5 text-[#6d5c82]">{voiceStyleUi.helper}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["gentle", "fairy", "bedtime"] as VoiceStyle[]).map((option) => {
              const isSelected = voiceStyle === option;
              const isLocked = !isPremium && isPremiumVoiceStyle(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleVoiceStyleSelect(option)}
                  aria-pressed={isSelected}
                  className={
                    isSelected
                      ? "rounded-full border border-[#d9b38c] bg-gradient-to-r from-[#ffd7c8] via-[#f7c7ff] to-[#c9d8ff] px-4 py-2 text-sm font-semibold text-[#4b2e68] shadow-sm"
                      : isLocked
                        ? "rounded-full border border-[#ecd5bf] bg-[#fffaf7] px-4 py-2 text-sm font-medium text-[#9f7d96] opacity-90 transition hover:bg-[#fff7f1]"
                        : "rounded-full border border-[#ecd5bf] bg-white/80 px-4 py-2 text-sm font-medium text-[#7a648d] transition hover:bg-[#fff7f1]"
                  }
                >
                  <span>{voiceStyleUi.options[option]}</span>
                  {isLocked ? (
                    <span className="ml-2 inline-flex items-center rounded-full bg-[#fff0f6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#b05a85]">{voiceStyleUi.premiumBadge}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {voiceStyleNotice ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-[#9f4967]">{voiceStyleNotice}</p>
              <Link
                href={`/${currentLocale}/premium`}
                className="rounded-full border border-[#efc9da] bg-[#fff6fb] px-3 py-1 text-xs font-semibold text-[#9f4967] transition hover:bg-white"
              >
                {voiceStyleUi.premiumCta}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handlePlayFullStory()}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7aa8ff] to-[#8f7cff] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            {audioLoading ? t.reader.generatingFullStoryAudio : tAudio.listenFullStory}
          </button>

          <button
            type="button"
            onClick={() => fullStoryAudioUrl && handleDownloadAudio(fullStoryAudioUrl)}
            disabled={isDownloadingAudio || !fullStoryAudioUrl}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5ec7a2] to-[#3bb273] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloadingAudio ? tAudio.preparing : `${tAudio.downloadAudio}${!isPremium ? " (Premium)" : ""}`}
          </button>

          <button
            type="button"
            onClick={handleDownloadPack}
            disabled={isDownloadingPack || !fullStoryAudioUrl}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#f6a96c] to-[#e27d47] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloadingPack ? tAudio.preparingZip : `${tAudio.downloadAll}${!isPremium ? " (Premium)" : ""}`}
          </button>
        </div>

        <p className="mt-2 text-xs font-medium text-[#876b4b]">{tAudio.fullNarrationDescription}</p>
        <p className="mt-2 text-xs font-medium text-[#6f5a82]">{audioError ? audioError : fullStoryAudioUrl ? `${tAudio.narrationReady}${isPlaying ? " • ♪" : ""}` : ""}</p>
        {downloadAudioError ? (
          <p className="mt-2 text-sm text-red-600">{downloadAudioError}</p>
        ) : null}
        {downloadPackError ? (
          <p className="mt-2 text-sm text-red-600">{downloadPackError}</p>
        ) : null}

        {premiumActionNotice ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#9f4967]">{premiumActionNotice}</p>
            <Link href={`/${currentLocale}/premium`} className="rounded-full border border-[#efc9da] bg-[#fff6fb] px-3 py-1 text-xs font-semibold text-[#9f4967] transition hover:bg-white">
              {premiumCtaLabel}
            </Link>
          </div>
        ) : null}
        {isFullStoryPlayerOpen && fullStoryAudioUrl ? (
          <div className="mt-6 rounded-2xl border border-[#f2d9bc] bg-[#fffaf4] p-4 shadow-sm">
            <audio
              ref={fullStoryAudioRef}
              controls
              src={fullStoryAudioUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="w-full"
            />
          </div>
        ) : null}
      </div>

      {viewMode === "reading" && currentPage && (
        <div className="mt-4 rounded-2xl border border-[#d8c5ff] bg-gradient-to-br from-[#f6edff] to-[#efe9ff] p-4 shadow-[0_10px_24px_rgba(111,88,171,0.16)]">
          <audio
            ref={pageAudioRef}
            src={currentPageAudioSrc ?? undefined}
            onPlay={() => setIsPageAudioPlaying(true)}
            onPause={() => setIsPageAudioPlaying(false)}
            onEnded={() => setIsPageAudioPlaying(false)}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateCurrentPageAudio}
              disabled={pageAudioLoading}
              className="storybook-button storybook-button-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pageAudioLoading ? t.reader.generatingThisPageAudio : t.reader.listenToThisPage}
            </button>

            {currentPageAudioSrc && (
              <>
                <button type="button" onClick={handlePlayPageAudio} className="storybook-button storybook-button-soft px-4 py-2 text-sm">{t.reader.playAudio}</button>
                <button type="button" onClick={handlePausePageAudio} className="storybook-button storybook-button-soft px-4 py-2 text-sm">{t.reader.pauseAudio}</button>
                <button type="button" onClick={handleRestartPageAudio} className="storybook-button storybook-button-soft px-4 py-2 text-sm">{t.reader.restartAudio}</button>
              </>
            )}
          </div>

          <p className="mt-2 text-xs font-medium text-[#6e5a8e]">{t.reader.narrationFastHint}</p>
          <p className="mt-2 text-xs font-medium text-[#675388]">
            {pageAudioError ? pageAudioError : currentPageAudioSrc ? `${t.reader.thisPageReady}${isPageAudioPlaying ? " • ♪" : ""}` : ""}
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[#d8e8ff] bg-gradient-to-br from-[#eaf5ff] to-[#e5f0ff] p-4 text-[#294c76] shadow-[0_10px_24px_rgba(93,141,205,0.18)]">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#33669d]">{t.reader.moralLabel}</p>
        <p className="mt-2 text-base leading-7">{data.moral}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onCopy} className="storybook-button bg-[#2e213e] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(46,33,62,0.32)]">
          {copySuccess ? t.reader.copied : t.reader.copyStory}
        </button>

        <button type="button" onClick={onDownload} className="storybook-button storybook-button-secondary px-5 py-3 text-sm">
          {t.reader.downloadTxt}
        </button>

        <button type="button" onClick={() => { if (!isPremium) { setPremiumActionNotice(premiumFeatureMessage); return; } onDownloadPdf(); }} className="storybook-button bg-gradient-to-r from-[#50b67d] to-[#37a876] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(56,157,112,0.3)]">
          {`${t.reader.downloadPdf}${!isPremium ? " (Premium)" : ""}`}
        </button>

        <button type="button" onClick={onReset} className="storybook-button storybook-button-primary px-5 py-3 text-sm">
          {t.reader.generateAnother}
        </button>
      </div>
    </section>
  );
}
















































