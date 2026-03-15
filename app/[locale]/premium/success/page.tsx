"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";

const copy: Record<
  SupportedLanguage,
  {
    title: string;
    subtitle: string;
    body: string;
    activating: string;
    activated: string;
    activationFailed: string;
    back: string;
    premium: string;
  }
> = {
  en: {
    title: "Payment successful",
    subtitle: "Your Premium checkout is complete",
    body: "Thank you. We are confirming your Premium access now.",
    activating: "Activating Premium access...",
    activated: "Premium access is active.",
    activationFailed: "We could not confirm Premium access yet. The webhook will still complete this shortly.",
    back: "Back to stories",
    premium: "Back to Premium"
  },
  ru: {
    title: "\u041e\u043f\u043b\u0430\u0442\u0430 \u043f\u0440\u043e\u0448\u043b\u0430 \u0443\u0441\u043f\u0435\u0448\u043d\u043e",
    subtitle: "\u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 Premium \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e",
    body: "\u0421\u043f\u0430\u0441\u0438\u0431\u043e. \u0421\u0435\u0439\u0447\u0430\u0441 \u043c\u044b \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u043c \u0434\u043e\u0441\u0442\u0443\u043f \u043a Premium.",
    activating: "\u0410\u043a\u0442\u0438\u0432\u0438\u0440\u0443\u0435\u043c \u0434\u043e\u0441\u0442\u0443\u043f \u043a Premium...",
    activated: "\u0414\u043e\u0441\u0442\u0443\u043f \u043a Premium \u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u043d.",
    activationFailed: "\u041f\u043e\u043a\u0430 \u043d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c Premium \u0441\u0440\u0430\u0437\u0443. Webhook \u0432\u0441\u0435 \u0440\u0430\u0432\u043d\u043e \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442 \u0430\u043a\u0442\u0438\u0432\u0430\u0446\u0438\u044e \u0447\u0435\u0440\u0435\u0437 \u043c\u043e\u043c\u0435\u043d\u0442.",
    back: "\u041a \u0438\u0441\u0442\u043e\u0440\u0438\u044f\u043c",
    premium: "\u041d\u0430\u0437\u0430\u0434 \u0432 Premium"
  },
  es: {
    title: "Pago completado",
    subtitle: "Tu compra de Premium se ha completado",
    body: "Gracias. Ahora estamos confirmando tu acceso Premium.",
    activating: "Activando acceso Premium...",
    activated: "El acceso Premium ya esta activo.",
    activationFailed: "Todavia no pudimos confirmar Premium al instante. El webhook lo terminara en breve.",
    back: "Volver a las historias",
    premium: "Volver a Premium"
  },
  de: {
    title: "Zahlung erfolgreich",
    subtitle: "Dein Premium-Kauf ist abgeschlossen",
    body: "Danke. Wir bestaetigen jetzt deinen Premium-Zugang.",
    activating: "Premium-Zugang wird aktiviert...",
    activated: "Premium-Zugang ist aktiv.",
    activationFailed: "Premium konnte noch nicht sofort bestaetigt werden. Der Webhook schliesst das gleich ab.",
    back: "Zurueck zu den Geschichten",
    premium: "Zurueck zu Premium"
  },
  fr: {
    title: "Paiement reussi",
    subtitle: "Ton achat Premium est termine",
    body: "Merci. Nous confirmons maintenant ton acces Premium.",
    activating: "Activation de l'acces Premium...",
    activated: "L'acces Premium est actif.",
    activationFailed: "Nous n'avons pas encore pu confirmer Premium immediatement. Le webhook finalisera cela sous peu.",
    back: "Retour aux histoires",
    premium: "Retour a Premium"
  },
  it: {
    title: "Pagamento riuscito",
    subtitle: "Il tuo acquisto Premium e completato",
    body: "Grazie. Stiamo confermando ora il tuo accesso Premium.",
    activating: "Attivazione dell'accesso Premium...",
    activated: "L'accesso Premium e attivo.",
    activationFailed: "Non siamo ancora riusciti a confermare Premium subito. Il webhook completera comunque l'attivazione a breve.",
    back: "Torna alle storie",
    premium: "Torna a Premium"
  },
  pt: {
    title: "Pagamento concluido",
    subtitle: "Sua compra Premium foi concluida",
    body: "Obrigado. Estamos confirmando agora seu acesso Premium.",
    activating: "Ativando acesso Premium...",
    activated: "O acesso Premium esta ativo.",
    activationFailed: "Ainda nao conseguimos confirmar Premium imediatamente. O webhook concluira isso em instantes.",
    back: "Voltar as historias",
    premium: "Voltar ao Premium"
  },
  zh: {
    title: "\u652f\u4ed8\u6210\u529f",
    subtitle: "\u4f60\u7684 Premium \u8d2d\u4e70\u5df2\u5b8c\u6210",
    body: "\u611f\u8c22\u4f60\u3002\u6211\u4eec\u6b63\u5728\u786e\u8ba4\u4f60\u7684 Premium \u6743\u9650\u3002",
    activating: "\u6b63\u5728\u6fc0\u6d3b Premium \u6743\u9650...",
    activated: "Premium \u6743\u9650\u5df2\u6fc0\u6d3b\u3002",
    activationFailed: "\u6682\u65f6\u8fd8\u65e0\u6cd5\u7acb\u5373\u786e\u8ba4 Premium\uff0c\u4f46 webhook \u5f88\u5feb\u4f1a\u5b8c\u6210\u540c\u6b65\u3002",
    back: "\u8fd4\u56de\u6545\u4e8b",
    premium: "\u8fd4\u56de Premium"
  }
};

export default function PremiumSuccessPage() {
  const params = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const normalized = normalizeLanguageCode(String(params.locale || "en"));
  const t = useMemo(() => copy[normalized] || copy.en, [normalized]);
  const sessionId = searchParams.get("session_id");
  const [activationState, setActivationState] = useState<"idle" | "loading" | "success" | "error">(
    sessionId ? "loading" : "idle"
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const checkoutSessionId = sessionId;
    let cancelled = false;

    async function syncCheckoutSession() {
      try {
        const response = await fetch(`/api/stripe/checkout-session?session_id=${encodeURIComponent(checkoutSessionId)}`, {
          cache: "no-store"
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok || payload?.success !== true) {
          throw new Error(payload?.error || "Failed to sync checkout session.");
        }

        await fetch("/api/premium/status", { cache: "no-store" });

        if (!cancelled) {
          setActivationState("success");
        }
      } catch (error) {
        console.error("[premium-success] failed to activate premium immediately", error);

        if (!cancelled) {
          setActivationState("error");
        }
      }
    }

    void syncCheckoutSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="glass-card w-full rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex rounded-full border border-[#d6f1dd] bg-[#f5fff7] px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#3d8a58]">Stripe Checkout</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">{t.title}</h1>
        <p className="mt-3 text-lg font-medium text-[#5f4d73]">{t.subtitle}</p>
        <p className="mt-4 text-base leading-7 text-[#6a5a7f]">{t.body}</p>
        {activationState === "loading" ? <p className="mt-4 text-sm font-semibold text-[#6a5a7f]">{t.activating}</p> : null}
        {activationState === "success" ? <p className="mt-4 text-sm font-semibold text-[#3d8a58]">{t.activated}</p> : null}
        {activationState === "error" ? <p className="mt-4 text-sm font-semibold text-[#9f4967]">{t.activationFailed}</p> : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${normalized}`} className="storybook-button storybook-button-primary px-6 py-3 text-sm">{t.back}</Link>
          <Link href={`/${normalized}/premium`} className="storybook-button storybook-button-soft px-6 py-3 text-sm">{t.premium}</Link>
        </div>
      </section>
    </main>
  );
}