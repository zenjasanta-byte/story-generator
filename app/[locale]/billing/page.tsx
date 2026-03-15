"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLegalTranslations, SUPPORT_EMAIL_PLACEHOLDER } from "@/lib/legalContent";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import type { PremiumStatusResponse } from "@/lib/premiumAccess";
import { SITE_NAME } from "@/lib/siteConfig";

type BillingAction = "portal" | "change-plan" | "cancel" | null;

type BillingPageCopy = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  statusLabel: string;
  planLabel: string;
  intervalLabel: string;
  customerLabel: string;
  subscriptionLabel: string;
  active: string;
  inactive: string;
  premiumPlan: string;
  freePlan: string;
  month: string;
  year: string;
  unavailable: string;
  manageButton: string;
  changePlanButton: string;
  cancelButton: string;
  openingManage: string;
  openingChangePlan: string;
  openingCancel: string;
  portalError: string;
  loading: string;
  refreshNote: string;
  backHome: string;
  viewPremium: string;
  noSubscriptionTitle: string;
  noSubscriptionBody: string;
  directActionsTitle: string;
  directActionsBody: string;
};

const billingCopy: Record<SupportedLanguage, BillingPageCopy> = {
  en: {
    badge: "Billing",
    title: "Billing & Subscription",
    subtitle: "A safe place to return from Stripe and manage your plan.",
    description: "Review your current Premium access and open the exact Stripe flow you need.",
    statusLabel: "Subscription status",
    planLabel: "Current plan",
    intervalLabel: "Billing interval",
    customerLabel: "Stripe customer",
    subscriptionLabel: "Stripe subscription",
    active: "Active",
    inactive: "Not active",
    premiumPlan: "Premium",
    freePlan: "Free",
    month: "Monthly",
    year: "Yearly",
    unavailable: "Not available",
    manageButton: "Manage Subscription",
    changePlanButton: "Change Plan",
    cancelButton: "Cancel Subscription",
    openingManage: "Opening portal...",
    openingChangePlan: "Opening plan change...",
    openingCancel: "Opening cancellation...",
    portalError: "Failed to open billing portal. Please try again.",
    loading: "Loading your billing details...",
    refreshNote: "Changes from Stripe can take a moment to refresh here after you return.",
    backHome: "Back to stories",
    viewPremium: "View Premium",
    noSubscriptionTitle: "No active subscription yet",
    noSubscriptionBody: "You can upgrade on the Premium page whenever you are ready.",
    directActionsTitle: "Direct subscription actions",
    directActionsBody: "Use the buttons below to jump straight into the relevant Stripe screen instead of the generic portal home."
  },
  ru: {
    badge: "Биллинг",
    title: "Оплата и подписка",
    subtitle: "Безопасная страница возврата из Stripe и управления подпиской.",
    description: "Здесь можно проверить текущий статус Premium и открыть сразу нужный экран Stripe.",
    statusLabel: "Статус подписки",
    planLabel: "Текущий план",
    intervalLabel: "Период оплаты",
    customerLabel: "Stripe customer",
    subscriptionLabel: "Stripe subscription",
    active: "Активна",
    inactive: "Неактивна",
    premiumPlan: "Premium",
    freePlan: "Бесплатный",
    month: "Ежемесячно",
    year: "Ежегодно",
    unavailable: "Нет данных",
    manageButton: "Управлять подпиской",
    changePlanButton: "Сменить план",
    cancelButton: "Отменить подписку",
    openingManage: "Открываем кабинет...",
    openingChangePlan: "Открываем смену плана...",
    openingCancel: "Открываем отмену подписки...",
    portalError: "Не удалось открыть billing portal. Попробуйте ещё раз.",
    loading: "Загружаем данные подписки...",
    refreshNote: "После возврата из Stripe изменения могут появиться здесь с небольшой задержкой.",
    backHome: "К историям",
    viewPremium: "Открыть Premium",
    noSubscriptionTitle: "Активной подписки пока нет",
    noSubscriptionBody: "Когда будете готовы, оформить Premium можно на отдельной странице.",
    directActionsTitle: "Прямые действия с подпиской",
    directActionsBody: "Кнопки ниже ведут сразу в нужный экран Stripe, без лишнего круга через главную страницу портала."
  },
  es: {
    badge: "Facturacion",
    title: "Facturacion y suscripcion",
    subtitle: "Un lugar seguro para volver desde Stripe y gestionar tu plan.",
    description: "Aqui puedes revisar tu estado Premium actual y abrir directamente la pantalla correcta de Stripe.",
    statusLabel: "Estado de la suscripcion",
    planLabel: "Plan actual",
    intervalLabel: "Periodo de cobro",
    customerLabel: "Cliente de Stripe",
    subscriptionLabel: "Suscripcion de Stripe",
    active: "Activa",
    inactive: "No activa",
    premiumPlan: "Premium",
    freePlan: "Gratis",
    month: "Mensual",
    year: "Anual",
    unavailable: "No disponible",
    manageButton: "Gestionar suscripcion",
    changePlanButton: "Cambiar plan",
    cancelButton: "Cancelar suscripcion",
    openingManage: "Abriendo portal...",
    openingChangePlan: "Abriendo cambio de plan...",
    openingCancel: "Abriendo cancelacion...",
    portalError: "No se pudo abrir el portal de facturacion. Intentalo de nuevo.",
    loading: "Cargando tus datos de facturacion...",
    refreshNote: "Los cambios de Stripe pueden tardar un momento en reflejarse aqui al volver.",
    backHome: "Volver a las historias",
    viewPremium: "Ver Premium",
    noSubscriptionTitle: "Todavia no hay una suscripcion activa",
    noSubscriptionBody: "Puedes mejorar a Premium en la pagina Premium cuando quieras.",
    directActionsTitle: "Acciones directas de suscripcion",
    directActionsBody: "Los botones de abajo te llevan directamente a la pantalla correcta de Stripe, sin pasar por la portada generica del portal."
  },
  de: {
    badge: "Billing",
    title: "Abrechnung und Abo",
    subtitle: "Ein sicherer Rueckkehrort aus Stripe fuer dein Abo.",
    description: "Hier kannst du deinen aktuellen Premium-Status pruefen und direkt die richtige Stripe-Ansicht oeffnen.",
    statusLabel: "Abo-Status",
    planLabel: "Aktueller Plan",
    intervalLabel: "Abrechnungsintervall",
    customerLabel: "Stripe-Kunde",
    subscriptionLabel: "Stripe-Abo",
    active: "Aktiv",
    inactive: "Nicht aktiv",
    premiumPlan: "Premium",
    freePlan: "Kostenlos",
    month: "Monatlich",
    year: "Jaehrlich",
    unavailable: "Nicht verfuegbar",
    manageButton: "Abo verwalten",
    changePlanButton: "Tarif wechseln",
    cancelButton: "Abo kuendigen",
    openingManage: "Portal wird geoeffnet...",
    openingChangePlan: "Tarifwechsel wird geoeffnet...",
    openingCancel: "Kuendigung wird geoeffnet...",
    portalError: "Das Billing-Portal konnte nicht geoeffnet werden. Bitte versuche es erneut.",
    loading: "Deine Abrechnungsdaten werden geladen...",
    refreshNote: "Aenderungen aus Stripe koennen nach der Rueckkehr einen Moment brauchen, bis sie hier sichtbar sind.",
    backHome: "Zurueck zu den Geschichten",
    viewPremium: "Premium ansehen",
    noSubscriptionTitle: "Noch kein aktives Abo",
    noSubscriptionBody: "Wenn du bereit bist, kannst du auf der Premium-Seite upgraden.",
    directActionsTitle: "Direkte Abo-Aktionen",
    directActionsBody: "Mit diesen Buttons springst du direkt in die passende Stripe-Ansicht statt auf die allgemeine Portal-Startseite."
  },
  fr: {
    badge: "Facturation",
    title: "Facturation et abonnement",
    subtitle: "Un espace de retour stable depuis Stripe pour gerer votre offre.",
    description: "Vous pouvez verifier votre statut Premium actuel et ouvrir directement l'ecran Stripe utile.",
    statusLabel: "Statut de l'abonnement",
    planLabel: "Offre actuelle",
    intervalLabel: "Frequence de facturation",
    customerLabel: "Client Stripe",
    subscriptionLabel: "Abonnement Stripe",
    active: "Active",
    inactive: "Inactive",
    premiumPlan: "Premium",
    freePlan: "Gratuit",
    month: "Mensuel",
    year: "Annuel",
    unavailable: "Indisponible",
    manageButton: "Gerer l'abonnement",
    changePlanButton: "Changer d'offre",
    cancelButton: "Resilier l'abonnement",
    openingManage: "Ouverture du portail...",
    openingChangePlan: "Ouverture du changement d'offre...",
    openingCancel: "Ouverture de la resiliation...",
    portalError: "Impossible d'ouvrir le portail de facturation. Veuillez reessayer.",
    loading: "Chargement de vos informations de facturation...",
    refreshNote: "Les changements Stripe peuvent prendre un instant avant d'apparaitre ici apres votre retour.",
    backHome: "Retour aux histoires",
    viewPremium: "Voir Premium",
    noSubscriptionTitle: "Pas encore d'abonnement actif",
    noSubscriptionBody: "Vous pouvez passer a Premium depuis la page Premium quand vous le souhaitez.",
    directActionsTitle: "Actions directes sur l'abonnement",
    directActionsBody: "Les boutons ci-dessous ouvrent directement le bon ecran Stripe sans repasser par la page d'accueil generique du portail."
  },
  it: {
    badge: "Fatturazione",
    title: "Fatturazione e abbonamento",
    subtitle: "Una pagina sicura di ritorno da Stripe per gestire il piano.",
    description: "Qui puoi controllare lo stato Premium attuale e aprire direttamente la schermata Stripe corretta.",
    statusLabel: "Stato dell'abbonamento",
    planLabel: "Piano attuale",
    intervalLabel: "Intervallo di fatturazione",
    customerLabel: "Cliente Stripe",
    subscriptionLabel: "Abbonamento Stripe",
    active: "Attiva",
    inactive: "Non attiva",
    premiumPlan: "Premium",
    freePlan: "Gratis",
    month: "Mensile",
    year: "Annuale",
    unavailable: "Non disponibile",
    manageButton: "Gestisci abbonamento",
    changePlanButton: "Cambia piano",
    cancelButton: "Annulla abbonamento",
    openingManage: "Apertura portale...",
    openingChangePlan: "Apertura cambio piano...",
    openingCancel: "Apertura annullamento...",
    portalError: "Impossibile aprire il portale di fatturazione. Riprova.",
    loading: "Caricamento dei dettagli di fatturazione...",
    refreshNote: "Le modifiche di Stripe possono richiedere un momento per comparire qui dopo il ritorno.",
    backHome: "Torna alle storie",
    viewPremium: "Vedi Premium",
    noSubscriptionTitle: "Nessun abbonamento attivo",
    noSubscriptionBody: "Puoi passare a Premium dalla pagina Premium quando vuoi.",
    directActionsTitle: "Azioni dirette sull'abbonamento",
    directActionsBody: "I pulsanti qui sotto aprono subito la schermata Stripe giusta, senza passare dalla home generica del portale."
  },
  pt: {
    badge: "Cobranca",
    title: "Cobranca e assinatura",
    subtitle: "Um lugar seguro para voltar do Stripe e gerir seu plano.",
    description: "Aqui voce pode ver seu status Premium atual e abrir diretamente a tela correta do Stripe.",
    statusLabel: "Status da assinatura",
    planLabel: "Plano atual",
    intervalLabel: "Periodo de cobranca",
    customerLabel: "Cliente Stripe",
    subscriptionLabel: "Assinatura Stripe",
    active: "Ativa",
    inactive: "Nao ativa",
    premiumPlan: "Premium",
    freePlan: "Gratis",
    month: "Mensal",
    year: "Anual",
    unavailable: "Indisponivel",
    manageButton: "Gerir assinatura",
    changePlanButton: "Mudar plano",
    cancelButton: "Cancelar assinatura",
    openingManage: "Abrindo portal...",
    openingChangePlan: "Abrindo mudanca de plano...",
    openingCancel: "Abrindo cancelamento...",
    portalError: "Nao foi possivel abrir o portal de cobranca. Tente novamente.",
    loading: "Carregando seus detalhes de cobranca...",
    refreshNote: "As mudancas do Stripe podem levar um momento para aparecer aqui depois do retorno.",
    backHome: "Voltar as historias",
    viewPremium: "Ver Premium",
    noSubscriptionTitle: "Ainda nao ha uma assinatura ativa",
    noSubscriptionBody: "Voce pode fazer upgrade para Premium na pagina Premium quando quiser.",
    directActionsTitle: "Acoes diretas da assinatura",
    directActionsBody: "Os botoes abaixo levam direto para a tela certa do Stripe, sem voltar para a home generica do portal."
  },
  zh: {
    badge: "账单",
    title: "账单与订阅",
    subtitle: "这是一个适合从 Stripe 返回后继续管理订阅的稳定页面。",
    description: "你可以在这里查看当前 Premium 状态，并直接打开需要的 Stripe 页面。",
    statusLabel: "订阅状态",
    planLabel: "当前套餐",
    intervalLabel: "计费周期",
    customerLabel: "Stripe 客户",
    subscriptionLabel: "Stripe 订阅",
    active: "已激活",
    inactive: "未激活",
    premiumPlan: "Premium",
    freePlan: "免费",
    month: "月付",
    year: "年付",
    unavailable: "暂无",
    manageButton: "管理订阅",
    changePlanButton: "更改套餐",
    cancelButton: "取消订阅",
    openingManage: "正在打开门户...",
    openingChangePlan: "正在打开套餐变更...",
    openingCancel: "正在打开取消流程...",
    portalError: "无法打开账单门户，请重试。",
    loading: "正在加载你的账单信息...",
    refreshNote: "从 Stripe 返回后，变更可能需要一点时间才会在这里刷新显示。",
    backHome: "返回故事",
    viewPremium: "查看 Premium",
    noSubscriptionTitle: "当前还没有激活订阅",
    noSubscriptionBody: "你可以随时前往 Premium 页面进行升级。",
    directActionsTitle: "直接订阅操作",
    directActionsBody: "下面的按钮会直接带你进入对应的 Stripe 页面，而不是通用的门户首页。"
  }
};

function maskValue(value: string | null) {
  if (!value) return null;
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export default function BillingPage() {
  const params = useParams<{ locale: string }>();
  const currentLocale = normalizeLanguageCode(String(params.locale || "en"));
  const t = useMemo(() => billingCopy[currentLocale] || billingCopy.en, [currentLocale]);
  const legalFooter = useMemo(() => getLegalTranslations(currentLocale).footer, [currentLocale]);
  const [status, setStatus] = useState<PremiumStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<BillingAction>(null);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/premium/status", { cache: "no-store" });
        const payload = (await response.json()) as PremiumStatusResponse;

        if (!cancelled) {
          setStatus(payload);
        }
      } catch {
        if (!cancelled) {
          setStatus(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function openPortalFlow(action: Exclude<BillingAction, null>) {
    if (activeAction) return;

    setActiveAction(action);
    setPortalError(null);

    const route = action === "change-plan" ? "/api/stripe/portal/change-plan" : action === "cancel" ? "/api/stripe/portal/cancel" : "/api/stripe/portal";

    try {
      const response = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: currentLocale })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || t.portalError);
      }

      window.location.href = String(payload.url);
    } catch (error: unknown) {
      setPortalError(error instanceof Error ? error.message : t.portalError);
      setActiveAction(null);
    }
  }

  const isPremium = Boolean(status?.isPremium);
  const subscriptionActive = isPremium;
  const planLabel = isPremium ? t.premiumPlan : t.freePlan;
  const intervalLabel =
    status?.billingInterval === "month" ? t.month : status?.billingInterval === "year" ? t.year : t.unavailable;

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb left-[5%] top-[6%]" />
        <div className="hero-orb hero-orb-alt right-[8%] top-[18%]" />
        <span className="fairy-sparkle left-[18%] top-[24%]" />
        <span className="fairy-sparkle right-[25%] top-[20%]" style={{ animationDelay: "0.8s" }} />
      </div>

      <section className="glass-card rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd9b8] bg-[#fff8ef] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5d2d]">
          {t.badge}
          <span>✦</span>
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">{t.title}</h1>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#8d618c]">{SITE_NAME}</p>
        <p className="mt-3 text-lg font-medium text-[#5f4d73]">{t.subtitle}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#6a5a7f]">{t.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${currentLocale}`} className="storybook-button storybook-button-soft px-5 py-3 text-sm">
            {t.backHome}
          </Link>
          <Link href={`/${currentLocale}/premium`} className="storybook-button storybook-button-primary px-5 py-3 text-sm">
            {t.viewPremium}
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#6a5a7f]">
          <Link href={`/${currentLocale}/support`} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
            {legalFooter.support}
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL_PLACEHOLDER}`} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
            {SUPPORT_EMAIL_PLACEHOLDER}
          </a>
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
                <p className="mt-2 text-lg font-bold text-[#3b2551]">{subscriptionActive ? t.active : t.inactive}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.planLabel}</p>
                  <p className="mt-2 text-base font-semibold text-[#3b2551]">{planLabel}</p>
                </div>
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.intervalLabel}</p>
                  <p className="mt-2 text-base font-semibold text-[#3b2551]">{intervalLabel}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.customerLabel}</p>
                  <p className="mt-2 text-sm font-medium text-[#5f4d73]">{maskValue(status?.stripeCustomerId ?? null) || t.unavailable}</p>
                </div>
                <div className="rounded-2xl border border-[#f1decc] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{t.subscriptionLabel}</p>
                  <p className="mt-2 text-sm font-medium text-[#5f4d73]">{maskValue(status?.stripeSubscriptionId ?? null) || t.unavailable}</p>
                </div>
              </div>

              <p className="text-sm text-[#6a5a7f]">{t.refreshNote}</p>
            </div>
          )}
        </article>

        <aside className="glass-card rounded-[28px] border border-[#e6c4ff] bg-gradient-to-br from-[#fff6f1] via-[#fff1fb] to-[#edf3ff] p-6 shadow-[0_18px_38px_rgba(138,102,188,0.2)]">
          {isPremium ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b57a7]">{t.directActionsTitle}</p>
              <h2 className="mt-4 text-2xl font-black text-[#3b2551]">{t.manageButton}</h2>
              <p className="mt-2 text-sm leading-6 text-[#695a7f]">{t.directActionsBody}</p>
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => void openPortalFlow("change-plan")}
                  disabled={activeAction !== null}
                  className="storybook-button w-full rounded-full bg-gradient-to-r from-[#8c77ff] to-[#b18cff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(118,82,157,0.14)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {activeAction === "change-plan" ? t.openingChangePlan : t.changePlanButton}
                </button>
                <button
                  type="button"
                  onClick={() => void openPortalFlow("cancel")}
                  disabled={activeAction !== null}
                  className="storybook-button w-full rounded-full bg-gradient-to-r from-[#ffb18c] to-[#f57d7d] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(201,104,116,0.16)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {activeAction === "cancel" ? t.openingCancel : t.cancelButton}
                </button>
                <button
                  type="button"
                  onClick={() => void openPortalFlow("portal")}
                  disabled={activeAction !== null}
                  className="storybook-button w-full rounded-full border border-[#d7c6f7] bg-white/80 px-6 py-3 text-sm font-semibold text-[#69478b] shadow-[0_10px_22px_rgba(118,82,157,0.14)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {activeAction === "portal" ? t.openingManage : t.manageButton}
                </button>
              </div>
              {portalError ? <p className="mt-3 text-sm font-semibold text-[#9f4967]">{portalError}</p> : null}
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b57a7]">{t.badge}</p>
              <h2 className="mt-4 text-2xl font-black text-[#3b2551]">{t.noSubscriptionTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[#695a7f]">{t.noSubscriptionBody}</p>
              <Link href={`/${currentLocale}/premium`} className="storybook-button storybook-button-primary mt-5 inline-flex px-6 py-3 text-sm">
                {t.viewPremium}
              </Link>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
