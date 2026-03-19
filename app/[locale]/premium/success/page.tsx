"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";

const copy: Record<
  SupportedLanguage,
  {
    title: string;
    subtitle: string;
    body: string;
    back: string;
    premium: string;
  }
> = {
  en: {
    title: "Premium page",
    subtitle: "Premium checkout is currently unavailable",
    body: "This project is running without Stripe integration, so no payment sync is required.",
    back: "Back to stories",
    premium: "Back to Premium"
  },
  ru: {
    title: "Страница Premium",
    subtitle: "Оформление Premium сейчас недоступно",
    body: "Проект сейчас работает без интеграции Stripe, поэтому синхронизация оплаты не требуется.",
    back: "К историям",
    premium: "Назад в Premium"
  },
  es: {
    title: "Pagina Premium",
    subtitle: "La compra Premium no esta disponible ahora",
    body: "Este proyecto ahora funciona sin integracion con Stripe, por lo que no se necesita sincronizacion de pago.",
    back: "Volver a las historias",
    premium: "Volver a Premium"
  },
  de: {
    title: "Premium-Seite",
    subtitle: "Premium-Kauf ist derzeit nicht verfuegbar",
    body: "Dieses Projekt laeuft jetzt ohne Stripe-Integration, daher ist keine Zahlungssynchronisierung noetig.",
    back: "Zurueck zu den Geschichten",
    premium: "Zurueck zu Premium"
  },
  fr: {
    title: "Page Premium",
    subtitle: "L'achat Premium est indisponible pour le moment",
    body: "Ce projet fonctionne maintenant sans integration Stripe, donc aucune synchronisation de paiement n'est necessaire.",
    back: "Retour aux histoires",
    premium: "Retour a Premium"
  },
  it: {
    title: "Pagina Premium",
    subtitle: "L'acquisto Premium non e disponibile al momento",
    body: "Questo progetto ora funziona senza integrazione Stripe, quindi non serve alcuna sincronizzazione dei pagamenti.",
    back: "Torna alle storie",
    premium: "Torna a Premium"
  },
  pt: {
    title: "Pagina Premium",
    subtitle: "A compra Premium nao esta disponivel no momento",
    body: "Este projeto agora funciona sem integracao com Stripe, por isso nao e necessaria sincronizacao de pagamento.",
    back: "Voltar as historias",
    premium: "Voltar ao Premium"
  },
  zh: {
    title: "Premium 页面",
    subtitle: "当前无法购买 Premium",
    body: "这个项目现在不再使用 Stripe，因此不需要任何支付同步。",
    back: "返回故事",
    premium: "返回 Premium"
  }
};

export default function PremiumSuccessPage() {
  const params = useParams<{ locale: string }>();
  const normalized = normalizeLanguageCode(String(params.locale || "en"));
  const t = useMemo(() => copy[normalized] || copy.en, [normalized]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="glass-card w-full rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex rounded-full border border-[#d6f1dd] bg-[#f5fff7] px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#3d8a58]">Premium</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">{t.title}</h1>
        <p className="mt-3 text-lg font-medium text-[#5f4d73]">{t.subtitle}</p>
        <p className="mt-4 text-base leading-7 text-[#6a5a7f]">{t.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${normalized}`} className="storybook-button storybook-button-primary px-6 py-3 text-sm">{t.back}</Link>
          <Link href={`/${normalized}/premium`} className="storybook-button storybook-button-soft px-6 py-3 text-sm">{t.premium}</Link>
        </div>
      </section>
    </main>
  );
}
