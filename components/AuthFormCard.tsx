"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getAuthCopy } from "@/lib/authTranslations";
import { getSafeNextPath } from "@/lib/authSession";
import type { SupportedLanguage } from "@/lib/narrationVoices";

type AuthMode = "login" | "signup";

type AuthApiErrorCode =
  | "not_configured"
  | "invalid_email"
  | "invalid_password"
  | "invalid_credentials"
  | "email_taken"
  | "auth_failed";

function getLocalizedError(copy: ReturnType<typeof getAuthCopy>, errorCode?: string) {
  switch (errorCode as AuthApiErrorCode | undefined) {
    case "invalid_email":
      return copy.validationEmail;
    case "invalid_password":
      return copy.validationPassword;
    case "invalid_credentials":
      return copy.invalidCredentials;
    case "email_taken":
      return copy.emailTaken;
    case "not_configured":
      return copy.authNotConfigured;
    default:
      return copy.genericError;
  }
}

export function AuthFormCard({
  locale,
  mode
}: {
  locale: SupportedLanguage;
  mode: AuthMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = useMemo(() => getAuthCopy(locale), [locale]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const nextPath = getSafeNextPath(searchParams.get("next"), locale);
  const alternateHref = `/${locale}/${mode === "login" ? "signup" : "login"}?next=${encodeURIComponent(nextPath)}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.includes("@")) {
      setError(copy.validationEmail);
      return;
    }

    if (password.length < 6) {
      setError(copy.validationPassword);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(getLocalizedError(copy, payload?.errorCode));
        setSubmitting(false);
        return;
      }

      if (mode === "signup" && payload?.linkedCurrentSession) {
        setSuccessMessage(copy.signupLinkedMessage);
        window.setTimeout(() => {
          router.replace(nextPath);
          router.refresh();
        }, 1400);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError(copy.genericError);
      setSubmitting(false);
    }
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb left-[4%] top-[8%]" />
        <div className="hero-orb hero-orb-alt right-[10%] top-[16%]" />
        <span className="fairy-sparkle left-[18%] top-[18%]" />
        <span className="fairy-sparkle right-[24%] top-[24%]" style={{ animationDelay: "0.8s" }} />
      </div>

      <section className="glass-card rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd9b8] bg-[#fff8ef] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5d2d]">
          {copy.badge}
          <span>✦</span>
        </p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#8d618c]">{copy.siteLabel}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">
          {mode === "login" ? copy.loginTitle : copy.signupTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#6a5a7f]">
          {mode === "login" ? copy.loginSubtitle : copy.signupSubtitle}
        </p>
        <p className="mt-3 text-sm font-medium text-[#7a6a90]">{copy.continueAfterAuth}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#4a325f]">{copy.emailLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
              className="w-full rounded-2xl border border-[#e2d4f4] bg-white/90 px-4 py-3 text-sm text-[#3b2551] outline-none transition focus:border-[#b58cff] focus:ring-2 focus:ring-[#e8d9ff]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#4a325f]">{copy.passwordLabel}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.passwordPlaceholder}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-2xl border border-[#e2d4f4] bg-white/90 px-4 py-3 text-sm text-[#3b2551] outline-none transition focus:border-[#b58cff] focus:ring-2 focus:ring-[#e8d9ff]"
            />
          </label>

          {error ? <p className="text-sm font-semibold text-[#a14466]">{error}</p> : null}
          {successMessage ? <p className="text-sm font-semibold text-[#4f7a47]">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="storybook-button storybook-button-primary w-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mode === "login" ? copy.loginButton : copy.signupButton}
          </button>
        </form>

        <div className="mt-6 text-sm text-[#6a5a7f]">
          <span>{mode === "login" ? copy.switchToSignup : copy.switchToLogin} </span>
          <Link href={alternateHref} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
            {mode === "login" ? copy.switchSignupLink : copy.switchLoginLink}
          </Link>
        </div>
      </section>
    </main>
  );
}
