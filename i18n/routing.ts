import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "es", "de", "fr", "it", "pt", "zh"],
  defaultLocale: "en",
  localeDetection: false
});
