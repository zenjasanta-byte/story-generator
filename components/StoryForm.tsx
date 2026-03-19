"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { getUiTranslations } from "@/lib/uiTranslations";
import type { StoryFormInput, StoryLength, StoryStyle } from "@/types/story";

type StoryFormProps = {
  onGenerate: (input: StoryFormInput, turnstileToken: string) => Promise<void>;
  loading: boolean;
  submitDisabled?: boolean;
  initialLanguage?: string;
  onLanguageChange?: (language: string) => void;
  footerContent?: React.ReactNode;
};

function buildDefaultData(language: string): StoryFormInput {
  return {
    childName: "Mila",
    age: 6,
    gender: "girl",
    mainCharacter: "little fox",
    theme: "kindness and helping friends",
    length: "medium",
    language,
    style: "bedtime"
  };
}

const presets: Array<{ key: "bedtime" | "friendship" | "educational"; data: Partial<StoryFormInput> }> = [
  {
    key: "bedtime",
    data: {
      style: "bedtime",
      theme: "calm evening routine and sweet dreams",
      mainCharacter: "sleepy moon rabbit",
      length: "short"
    }
  },
  {
    key: "friendship",
    data: {
      style: "friendship",
      theme: "teamwork and sharing",
      mainCharacter: "two forest friends",
      length: "medium"
    }
  },
  {
    key: "educational",
    data: {
      style: "educational",
      theme: "learning colors and nature",
      mainCharacter: "curious little owl",
      length: "medium"
    }
  }
];

const languageOptions = ["English", "Russian", "Spanish", "German", "French", "Italian", "Portuguese", "Chinese"];

export function StoryForm({
  onGenerate,
  loading,
  submitDisabled = false,
  initialLanguage = "English",
  onLanguageChange,
  footerContent
}: StoryFormProps) {
  const [formData, setFormData] = useState<StoryFormInput>(() => buildDefaultData(initialLanguage));
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileEnabled = Boolean(turnstileSiteKey);

  const ui = useMemo(() => getUiTranslations(formData.language), [formData.language]);
  const t = ui.form;

  useEffect(() => {
    setFormData((prev) => (prev.language === initialLanguage ? prev : { ...prev, language: initialLanguage }));
  }, [initialLanguage]);

  const update = <K extends keyof StoryFormInput>(key: K, value: StoryFormInput[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "language") {
      onLanguageChange?.(String(value));
    }
  };

  function applyPreset(data: Partial<StoryFormInput>) {
    if (loading) return;
    setFormData((prev) => ({ ...prev, ...data }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (turnstileEnabled && !turnstileToken) {
      setTurnstileError(ui.home.errors.verificationRequired);
      return;
    }

    setTurnstileError(null);

    try {
      await onGenerate(formData, turnstileToken || "");
    } finally {
      setTurnstileToken(null);
      setTurnstileResetSignal((prev) => prev + 1);
    }
  }

  const handleVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError(null);
  }, []);

  const handleExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleWidgetError = useCallback(() => {
    setTurnstileToken(null);
    setTurnstileError(ui.home.errors.verificationFailed);
  }, [ui.home.errors.verificationFailed]);

  return (
    <form onSubmit={handleSubmit} className="glass-card animate-fade-up relative overflow-hidden rounded-[28px] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#ffd2b0]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-8 h-24 w-24 rounded-full bg-[#d8c6ff]/35 blur-2xl" />

      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d5930]">{t.quickPresets}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="storybook-button rounded-full border border-[#ffd3af] bg-gradient-to-br from-[#fff4de] to-[#ffe8cb] px-4 py-2 text-sm font-semibold text-[#8c6036] shadow-[0_8px_18px_rgba(203,145,88,0.18)]"
            >
              {preset.key === "bedtime" ? t.presetBedtime : preset.key === "friendship" ? t.presetFriendship : t.presetEducational}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label={t.labels.childName}>
          <input required value={formData.childName} onChange={(e) => update("childName", e.target.value)} className="input" placeholder={t.placeholders.childName} />
        </Field>

        <Field label={t.labels.age}>
          <input required type="number" min={2} max={12} value={formData.age} onChange={(e) => update("age", Number(e.target.value))} className="input" />
        </Field>

        <Field label={t.labels.gender}>
          <input value={formData.gender ?? ""} onChange={(e) => update("gender", e.target.value)} className="input" placeholder={t.placeholders.gender} />
        </Field>

        <Field label={t.labels.mainCharacter}>
          <input
            required
            value={formData.mainCharacter}
            onChange={(e) => update("mainCharacter", e.target.value)}
            className="input"
            placeholder={t.placeholders.mainCharacter}
          />
        </Field>

        <Field label={t.labels.theme}>
          <input required value={formData.theme} onChange={(e) => update("theme", e.target.value)} className="input" placeholder={t.placeholders.theme} />
        </Field>

        <Field label={t.labels.language}>
          <select value={formData.language} onChange={(e) => update("language", e.target.value)} className="input">
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {t.languageNames[language] || language}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs font-medium text-[#7d6b90]">{t.helperLanguage}</p>
        </Field>

        <Field label={t.labels.length}>
          <select value={formData.length} onChange={(e) => update("length", e.target.value as StoryLength)} className="input">
            <option value="short">{t.lengthOptions.short}</option>
            <option value="medium">{t.lengthOptions.medium}</option>
            <option value="long">{t.lengthOptions.long}</option>
          </select>
        </Field>

        <Field label={t.labels.style}>
          <select value={formData.style} onChange={(e) => update("style", e.target.value as StoryStyle)} className="input">
            <option value="bedtime">{t.styleOptions.bedtime}</option>
            <option value="educational">{t.styleOptions.educational}</option>
            <option value="adventure">{t.styleOptions.adventure}</option>
            <option value="friendship">{t.styleOptions.friendship}</option>
          </select>
        </Field>
      </div>

      {turnstileEnabled ? (
        <div className="mt-6 rounded-[20px] border border-[#ecd9f9] bg-white/70 p-4 shadow-[0_10px_20px_rgba(131,96,177,0.08)]">
          <TurnstileWidget
            siteKey={turnstileSiteKey || ""}
            storyLanguage={formData.language}
            resetSignal={turnstileResetSignal}
            onVerify={handleVerify}
            onExpire={handleExpire}
            onError={handleWidgetError}
          />
          {turnstileError ? <p className="mt-3 text-sm font-semibold text-[#9f4967]">{turnstileError}</p> : null}
        </div>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading || submitDisabled}
          className="storybook-button storybook-button-primary px-7 py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? t.buttons.generating : t.buttons.generate}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            const nextData = buildDefaultData(initialLanguage);
            setFormData(nextData);
            onLanguageChange?.(nextData.language);
          }}
          className="storybook-button storybook-button-soft px-5 py-3 text-sm"
        >
          {t.buttons.sampleData}
        </button>
      </div>

      {footerContent ? <div className="mt-4">{footerContent}</div> : null}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgba(255, 209, 169, 0.7);
          background: linear-gradient(160deg, #fffdf8, #fff6ea);
          padding: 0.95rem 1rem;
          font-size: 1rem;
          color: #3a2b4c;
          outline: none;
          box-shadow: 0 8px 16px rgba(162, 112, 173, 0.08);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .input:focus {
          border-color: #c893ff;
          box-shadow: 0 0 0 3px rgba(191, 147, 255, 0.22), 0 10px 20px rgba(112, 87, 165, 0.15);
          transform: translateY(-1px);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#5f486f]">{label}</span>
      {children}
    </label>
  );
}
