"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { getUiLanguageFromStoryLanguage } from "@/lib/uiTranslations";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          language?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

function getTurnstileLanguage(storyLanguage: string) {
  const uiLanguage = getUiLanguageFromStoryLanguage(storyLanguage);
  if (uiLanguage === "zh") {
    return "zh-CN";
  }

  return uiLanguage;
}

type TurnstileWidgetProps = {
  siteKey: string;
  storyLanguage: string;
  resetSignal: number;
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
};

export function TurnstileWidget({
  siteKey,
  storyLanguage,
  resetSignal,
  onVerify,
  onExpire,
  onError
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const language = useMemo(() => getTurnstileLanguage(storyLanguage), [storyLanguage]);

  useEffect(() => {
    if (!scriptLoaded || !siteKey || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    containerRef.current.innerHTML = "";
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      language,
      callback: onVerify,
      "expired-callback": onExpire,
      "error-callback": onError
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [language, onError, onExpire, onVerify, scriptLoaded, siteKey]);

  useEffect(() => {
    if (!widgetIdRef.current || !window.turnstile) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
  }, [resetSignal]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  );
}
