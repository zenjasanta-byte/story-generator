import { getUiTranslations } from "@/lib/uiTranslations";

type EmptyStateProps = {
  storyLanguage: string;
};

export function EmptyState({ storyLanguage }: EmptyStateProps) {
  const t = getUiTranslations(storyLanguage);

  return (
    <section className="glass-card animate-fade-up relative overflow-hidden rounded-[28px] p-8 text-center">
      <div className="pointer-events-none absolute -top-6 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[#ffe0c0]/45 blur-2xl" />
      <h2 className="text-2xl font-black tracking-tight text-[#3d2851]">{t.emptyState.title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#625477]">{t.emptyState.subtitle}</p>
    </section>
  );
}
