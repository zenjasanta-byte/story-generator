import type { VoiceStyle } from "@/types/story";

export type SupportedLanguage = "ru" | "en" | "es" | "de" | "fr" | "it" | "pt" | "zh";

export type VoiceConfig = {
  primary: string;
  fallback?: string;
};

const SAFE_DEFAULT_VOICE = "alloy";
const DEFAULT_VOICE_STYLE: VoiceStyle = "gentle";
const FREE_VOICE_STYLE: VoiceStyle = "bedtime";
const PREMIUM_VOICE_STYLES = new Set<VoiceStyle>(["gentle", "fairy"]);

const languageAliases: Record<string, SupportedLanguage> = {
  en: "en",
  english: "en",
  angliiskii: "en",
  russian: "ru",
  ru: "ru",
  russkii: "ru",
  "русский": "ru",
  es: "es",
  spanish: "es",
  espanol: "es",
  "español": "es",
  de: "de",
  german: "de",
  deutsch: "de",
  fr: "fr",
  french: "fr",
  francais: "fr",
  "français": "fr",
  it: "it",
  italian: "it",
  italiano: "it",
  pt: "pt",
  portuguese: "pt",
  portugues: "pt",
  "português": "pt",
  zh: "zh",
  chinese: "zh",
  mandarin: "zh",
  "中文": "zh"
};

export const languageVoiceMap: Record<SupportedLanguage, Record<VoiceStyle, VoiceConfig>> = {
  ru: {
    gentle: { primary: "sage", fallback: "alloy" },
    fairy: { primary: "shimmer", fallback: "sage" },
    bedtime: { primary: "ballad", fallback: "sage" }
  },
  en: {
    gentle: { primary: "alloy", fallback: "sage" },
    fairy: { primary: "shimmer", fallback: "alloy" },
    bedtime: { primary: "ballad", fallback: "alloy" }
  },
  es: {
    gentle: { primary: "shimmer", fallback: "alloy" },
    fairy: { primary: "coral", fallback: "shimmer" },
    bedtime: { primary: "ballad", fallback: "shimmer" }
  },
  de: {
    gentle: { primary: "sage", fallback: "alloy" },
    fairy: { primary: "verse", fallback: "sage" },
    bedtime: { primary: "ballad", fallback: "sage" }
  },
  fr: {
    gentle: { primary: "coral", fallback: "alloy" },
    fairy: { primary: "shimmer", fallback: "coral" },
    bedtime: { primary: "ballad", fallback: "coral" }
  },
  it: {
    gentle: { primary: "coral", fallback: "alloy" },
    fairy: { primary: "verse", fallback: "coral" },
    bedtime: { primary: "ballad", fallback: "coral" }
  },
  pt: {
    gentle: { primary: "shimmer", fallback: "alloy" },
    fairy: { primary: "coral", fallback: "shimmer" },
    bedtime: { primary: "ballad", fallback: "shimmer" }
  },
  zh: {
    gentle: { primary: "sage", fallback: "alloy" },
    fairy: { primary: "verse", fallback: "sage" },
    bedtime: { primary: "ballad", fallback: "sage" }
  }
};

export function normalizeLanguageCode(language: string): SupportedLanguage {
  const normalized = language.trim().toLowerCase();
  return languageAliases[normalized] || "en";
}

export function getDefaultVoiceStyle(): VoiceStyle {
  return DEFAULT_VOICE_STYLE;
}

export function isPremiumVoiceStyle(style: VoiceStyle): boolean {
  return PREMIUM_VOICE_STYLES.has(style);
}

export function getAccessibleVoiceStyle(requestedStyle: VoiceStyle | undefined, isPremium = false): VoiceStyle {
  const resolvedStyle = requestedStyle || DEFAULT_VOICE_STYLE;

  if (isPremium || !isPremiumVoiceStyle(resolvedStyle)) {
    return resolvedStyle;
  }

  return FREE_VOICE_STYLE;
}

export function resolveNarrationVoice(language: string, voiceStyle?: VoiceStyle, isPremium = false): string {
  const languageCode = normalizeLanguageCode(language);
  const resolvedStyle = getAccessibleVoiceStyle(voiceStyle, isPremium);
  const styleMap = languageVoiceMap[languageCode] || languageVoiceMap.en;
  const config = styleMap[resolvedStyle] || styleMap.bedtime || styleMap.gentle;

  if (config?.primary) return config.primary;
  if (config?.fallback) return config.fallback;

  const bedtimeVoice = styleMap.bedtime;
  if (bedtimeVoice?.primary) return bedtimeVoice.primary;
  if (bedtimeVoice?.fallback) return bedtimeVoice.fallback;

  return SAFE_DEFAULT_VOICE;
}

export function buildNarrationStyleInstruction(voiceStyle?: VoiceStyle): string {
  switch (voiceStyle || DEFAULT_VOICE_STYLE) {
    case "fairy":
      return "Add a light fairy-tale shimmer and sense of wonder while staying natural, soft, and child-safe.";
    case "bedtime":
      return "Use the calmest bedtime cadence with slower pacing, softer landings, and a sleepy, reassuring warmth.";
    case "gentle":
    default:
      return "Keep the voice warm, balanced, neutral, and reassuring with clear, natural phrasing.";
  }
}
