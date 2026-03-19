"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAccountCopy } from "@/lib/accountTranslations";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import { SITE_NAME } from "@/lib/siteConfig";

type AccountOverviewResponse = {
  isAuthenticated: boolean;
  guestUserId: string | null;
  appUserId: string | null;
  linkedGuestSession: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  plan: "free" | "premium";
  isPremium: boolean;
  subscriptionStatus:
    | "inactive"
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired"
    | "paused";
  billingInterval: "month" | "year" | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};

function maskValue(value: string | null) {
  if (!value) return null;
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function AccountPageClient({ locale }: { locale: string }) {
  const currentLocale = normalizeLanguageCode(locale);
  const t = useMemo(() => getAccountCopy(currentLocale), [currentLocale]);
  const [credits, setCredits] = useState(0);
  const [overview, setOverview] = useState<AccountOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/credits")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setCredits(data.credits);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCredits(0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        const response = await fetch("/api/account/overview", {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin"
        });

        const payload = (await response.json()) as AccountOverviewResponse;
        if (!cancelled) {
          setOverview(payload);
        }
      } catch {
        if (!cancelled) {
          setOverview(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    window.location.href = `/${currentLocale}`;
  }

  async function handleManageSubscription() {
    if (portalLoading) return;

    setPortalLoading(true);
    setPortalError(t.portalError);
    setPortalLoading(false);
  }

  const planLabel = overview?.plan === "premium" ? t.premiumPlan : t.freePlan;
  const intervalLabel =
    overview?.billingInterval === "month"
      ? t.monthly
      : overview?.billingInterval === "year"
        ? t.yearly
        : t.unavailable;
  const statusLabel = overview ? t.subscriptionStatuses[overview.subscriptionStatus] || overview.subscriptionStatus : t.unavailable;
  const showCanceledActive = Boolean(overview?.isPremium && overview?.cancelAtPeriodEnd);
  const activeUntilLabel = overview?.currentPeriodEnd
    ? new Intl.DateTimeFormat(currentLocale, { dateStyle: "long" }).format(new Date(overview.currentPeriodEnd))
    : null;
  const canManageSubscription = Boolean(overview?.stripeCustomerId);
  const loginHref = `/${currentLocale}/login?next=${encodeURIComponent(`/${currentLocale}/account`)}`;
  const signupHref = `/${currentLocale}/signup?next=${encodeURIComponent(`/${currentLocale}/account`)}`;

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb left-[5%] top-[6%]" />
        <div className="hero-orb hero-orb-alt right-[8%] top-[18%]" />
        <span className="fairy-sparkle left-[18%] top-[24%]" />
        <span className="fairy-sparkle right-[25%] top-[20%]" style={{ animationDelay: "0.8s" }} />
      </div>

      <div
        style={{
          padding: "12px",
          borderRadius: "10px",
          background: "#111",
          color: "#fff",
          marginBottom: "10px"
        }}
      >
        Credits: {credits}
      </div>

      <section className="glass-card rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd9b8] bg-[#fff8ef] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5d2d]">
          {t.badge}
          <span>?</span>
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">{t.title}</h1>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#8d618c]">{SITE_NAME}</p>
        <p className="mt-3 text-lg font-medium text-[#5f4d73]">{t.subtitle}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${currentLocale}`} className="storybook-button storybook-button-soft px-5 py-3 text-sm">
            {t.goHomeButton}
          </Link>
          <Link href={`/${currentLocale}/billing`} className="storybook-button storybook-button-primary px-5 py-3 text-sm">
            {t.goToBillingButton}
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="glass-card rounded-[28px] border border-[#ecd3b9] bg-gradient-to-br from-[#fffaf4] to-[#f7f0ff] p-6 shadow-[0_18px_38px_rgba(118,82,157,0.16)]">
          {loading ? (
            <p className="text-sm font-medium text-[#695a7f]">{t.loading}</p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.statusLabel}</p>
                <p className="mt-2 text-lg font-bold text-[#3b2551]">
                  {overview?.isAuthenticated ? t.loggedInValue : t.guestValue}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.loggedInLabel}</p>
                  <p className="mt-2 text-base font-semibold text-[#3b2551]">{overview?.isAuthenticated ? t.loggedInValue : t.guestValue}</p>
                </div>
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.emailLabel}</p>
                  <p className="mt-2 text-base font-semibold text-[#3b2551]">{overview?.user?.email || t.emailMissing}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.planLabel}</p>
                  <p className="mt-2 text-base font-semibold text-[#3b2551]">{planLabel}</p>
                </div>
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.subscriptionStatusLabel}</p>
                  <p className="mt-2 text-base font-semibold text-[#3b2551]">{statusLabel}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.intervalLabel}</p>
                  <p className="mt-2 text-base font-semibold text-[#3b2551]">{intervalLabel}</p>
                </div>
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.stripeCustomerLabel}</p>
                  <p className="mt-2 text-sm font-medium text-[#5f4d73]">{maskValue(overview?.stripeCustomerId ?? null) || t.unavailable}</p>
                </div>
              </div>

              {overview?.linkedGuestSession ? (
                <div className="rounded-2xl border border-[#d7c6f7] bg-[#fbf6ff] p-4 text-sm text-[#5f4d73]">
                  {t.linkedNote}
                </div>
              ) : null}

              {showCanceledActive ? (
                <div className="rounded-2xl border border-[#ffd7a8] bg-[#fff7eb] p-4 text-sm text-[#7a5330]">
                  <p className="font-semibold">{t.canceledActiveMessage}</p>
                  {activeUntilLabel ? <p className="mt-2">{t.activeUntilPrefix}: {activeUntilLabel}</p> : null}
                </div>
              ) : null}

              {!overview?.isAuthenticated ? (
                <div className="rounded-2xl border border-[#d7c6f7] bg-[#fbf6ff] p-4 text-sm text-[#5f4d73]">{t.signInPrompt}</div>
              ) : null}
            </div>
          )}
        </article>

        <aside className="glass-card rounded-[28px] border border-[#e6c4ff] bg-gradient-to-br from-[#fff6f1] via-[#fff1fb] to-[#edf3ff] p-6 shadow-[0_18px_38px_rgba(138,102,188,0.2)]">
          {overview?.isAuthenticated ? (
            <>
              <h2 className="text-2xl font-black text-[#3b2551]">{overview.user?.email || t.title}</h2>
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="storybook-button w-full rounded-full border border-[#d7c6f7] bg-white/80 px-6 py-3 text-sm font-semibold text-[#69478b] shadow-[0_10px_22px_rgba(118,82,157,0.14)] transition hover:bg-white"
                >
                  {t.signOutButton}
                </button>
                {canManageSubscription ? (
                  <button
                    type="button"
                    onClick={() => void handleManageSubscription()}
                    disabled={portalLoading}
                    className="storybook-button w-full rounded-full bg-gradient-to-r from-[#8c77ff] to-[#b18cff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(118,82,157,0.14)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {portalLoading ? t.openingPortal : t.manageSubscriptionButton}
                  </button>
                ) : null}
                <Link href={`/${currentLocale}/billing`} className="storybook-button storybook-button-soft w-full px-6 py-3 text-center text-sm">
                  {t.goToBillingButton}
                </Link>
              </div>
              {portalError ? <p className="mt-3 text-sm font-semibold text-[#9f4967]">{portalError}</p> : null}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-[#3b2551]">{t.guestValue}</h2>
              <div className="mt-5 grid gap-3">
                <Link href={loginHref} className="storybook-button storybook-button-primary w-full px-6 py-3 text-center text-sm">
                  {t.signInButton}
                </Link>
                <Link href={signupHref} className="storybook-button storybook-button-soft w-full px-6 py-3 text-center text-sm">
                  {t.createAccountButton}
                </Link>
                <Link href={`/${currentLocale}/billing`} className="storybook-button w-full rounded-full border border-[#d7c6f7] bg-white/80 px-6 py-3 text-center text-sm font-semibold text-[#69478b] shadow-[0_10px_22px_rgba(118,82,157,0.14)] transition hover:bg-white">
                  {t.goToBillingButton}
                </Link>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

