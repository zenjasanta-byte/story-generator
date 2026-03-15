import Link from "next/link";
import { AuthFooterLinks } from "@/components/AuthFooterLinks";
import { getLegalTranslations, SUPPORT_EMAIL_PLACEHOLDER } from "@/lib/legalContent";
import type { SupportedLanguage } from "@/lib/narrationVoices";
import { SITE_NAME } from "@/lib/siteConfig";

export function SiteFooter({ locale }: { locale: SupportedLanguage }) {
  const t = getLegalTranslations(locale).footer;

  return (
    <footer className="mt-16 border-t border-white/40 bg-gradient-to-br from-[#fff7ec]/90 via-[#fff2fb]/90 to-[#eef6ff]/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-[#6a5a7f] sm:px-6 lg:px-8">
        <div>
          <Link href={`/${locale}`} className="text-base font-black tracking-tight text-[#3b2551] transition hover:text-[#6a4b8c]">
            {SITE_NAME}
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 font-medium">
          <Link href={`/${locale}/privacy`} className="transition hover:text-[#3b2551]">{t.privacy}</Link>
          <Link href={`/${locale}/terms`} className="transition hover:text-[#3b2551]">{t.terms}</Link>
          <Link href={`/${locale}/refunds`} className="transition hover:text-[#3b2551]">{t.refunds}</Link>
          <Link href={`/${locale}/support`} className="transition hover:text-[#3b2551]">{t.support}</Link>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[#7a6a90]">
          <span>{t.allRightsReserved}</span>
          <a href={`mailto:${SUPPORT_EMAIL_PLACEHOLDER}`} className="transition hover:text-[#3b2551]">
            {t.supportEmailLabel}: {SUPPORT_EMAIL_PLACEHOLDER}
          </a>
        </div>
        <AuthFooterLinks locale={locale} />
      </div>
    </footer>
  );
}
