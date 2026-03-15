import type { LegalDocument } from "@/lib/legalContent";

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb left-[4%] top-[8%]" />
        <div className="hero-orb hero-orb-alt right-[10%] top-[18%]" />
        <span className="fairy-sparkle left-[20%] top-[20%]" />
        <span className="fairy-sparkle right-[24%] top-[26%]" style={{ animationDelay: "0.8s" }} />
      </div>

      <section className="glass-card rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd9b8] bg-[#fff8ef] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5d2d]">
          {document.badge}
          <span>✦</span>
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">{document.title}</h1>
        <p className="mt-4 text-base leading-7 text-[#6a5a7f]">{document.intro}</p>
        <p className="mt-4 text-sm font-semibold text-[#7b6b8e]">{document.lastUpdatedLabel}: {document.lastUpdatedValue}</p>
      </section>

      <section className="mt-8 space-y-4">
        {document.sections.map((section) => (
          <article key={section.title} className="glass-card rounded-[28px] border border-[#ecd3b9] bg-gradient-to-br from-[#fffaf4] to-[#f7f0ff] p-6 shadow-[0_18px_38px_rgba(118,82,157,0.16)]">
            <h2 className="text-2xl font-black text-[#3b2551]">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-[#5f4d73] sm:text-base">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
