import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { getAuthCopy } from "@/lib/authTranslations";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import type { SupportedLanguage } from "@/lib/narrationVoices";

export async function AuthFooterLinks({ locale }: { locale: SupportedLanguage }) {
  const copy = getAuthCopy(locale);
  const session = await getCurrentUserIdentity();

  if (session.isAuthenticated && session.authenticatedUser) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs text-[#7a6a90]">
        <span>
          {copy.signedInAs}: {session.authenticatedUser.email}
        </span>
        <Link href={`/${locale}/account`} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
          {copy.accountLink}
        </Link>
        <SignOutButton
          label={copy.logoutButton}
          redirectTo={`/${locale}`}
          className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]"
        />
      </div>
    );
  }

  const nextPath = `/${locale}`;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-[#7a6a90]">
      <span>{copy.footerGuestLabel}</span>
      <Link href={`/${locale}/login?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
        {copy.loginButton}
      </Link>
      <Link href={`/${locale}/signup?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
        {copy.signupButton}
      </Link>
    </div>
  );
}
