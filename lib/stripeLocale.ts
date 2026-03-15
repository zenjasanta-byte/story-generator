import { normalizeLanguageCode } from "@/lib/narrationVoices";

export type StripeLocale = "en" | "ru" | "es" | "de" | "fr" | "it" | "pt" | "zh";

const stripeLocaleMap: Record<string, StripeLocale> = {
  en: "en",
  ru: "ru",
  es: "es",
  de: "de",
  fr: "fr",
  it: "it",
  pt: "pt",
  zh: "zh",
  "pt-br": "pt",
  "pt-pt": "pt",
  "zh-cn": "zh",
  "zh-tw": "zh",
  "zh-hk": "zh"
};

export function normalizeStripeLocale(localeInput: string): StripeLocale {
  const raw = String(localeInput || "en").trim().toLowerCase();
  if (stripeLocaleMap[raw]) {
    return stripeLocaleMap[raw];
  }

  return stripeLocaleMap[normalizeLanguageCode(raw)] || "en";
}
