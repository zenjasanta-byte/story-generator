import Link from "next/link";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";

const copy: Record<SupportedLanguage, { title: string; subtitle: string; body: string; retry: string; back: string }> = {
  en: {
    title: "Checkout canceled",
    subtitle: "No changes were made",
    body: "You can return to Premium and try again whenever you are ready.",
    retry: "Try Premium again",
    back: "Back to stories"
  },
  ru: {
    title: "Оплата отменена",
    subtitle: "Изменения не внесены",
    body: "Можно вернуться на страницу Premium и попробовать ещё раз в любой момент.",
    retry: "Попробовать снова",
    back: "К историям"
  },
  es: {
    title: "Pago cancelado",
    subtitle: "No se realizaron cambios",
    body: "Puedes volver a Premium e intentarlo de nuevo cuando quieras.",
    retry: "Probar de nuevo",
    back: "Volver a las historias"
  },
  de: {
    title: "Zahlung abgebrochen",
    subtitle: "Es wurden keine Aenderungen vorgenommen",
    body: "Du kannst jederzeit zu Premium zurueckkehren und es erneut versuchen.",
    retry: "Erneut versuchen",
    back: "Zurueck zu den Geschichten"
  },
  fr: {
    title: "Paiement annule",
    subtitle: "Aucun changement n'a ete applique",
    body: "Tu peux revenir sur Premium et reessayer quand tu veux.",
    retry: "Reessayer",
    back: "Retour aux histoires"
  },
  it: {
    title: "Pagamento annullato",
    subtitle: "Nessuna modifica applicata",
    body: "Puoi tornare a Premium e riprovare in qualsiasi momento.",
    retry: "Riprova",
    back: "Torna alle storie"
  },
  pt: {
    title: "Pagamento cancelado",
    subtitle: "Nenhuma alteracao foi aplicada",
    body: "Voce pode voltar ao Premium e tentar novamente quando quiser.",
    retry: "Tentar novamente",
    back: "Voltar as historias"
  },
  zh: {
    title: "已取消支付",
    subtitle: "没有进行任何更改",
    body: "你可以随时返回 Premium 页面再次尝试。",
    retry: "再次尝试",
    back: "返回故事"
  }
};

export default async function PremiumCancelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLanguageCode(locale);
  const t = copy[normalized] || copy.en;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="glass-card w-full rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex rounded-full border border-[#ffe2c5] bg-[#fff8ef] px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#a26837]">Stripe Checkout</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">{t.title}</h1>
        <p className="mt-3 text-lg font-medium text-[#5f4d73]">{t.subtitle}</p>
        <p className="mt-4 text-base leading-7 text-[#6a5a7f]">{t.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${normalized}/premium`} className="storybook-button storybook-button-primary px-6 py-3 text-sm">{t.retry}</Link>
          <Link href={`/${normalized}`} className="storybook-button storybook-button-soft px-6 py-3 text-sm">{t.back}</Link>
        </div>
      </section>
    </main>
  );
}
