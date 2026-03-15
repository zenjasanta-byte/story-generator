import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { USER_ID_COOKIE } from "@/lib/premiumAccess";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  if (!request.cookies.get(USER_ID_COOKIE)?.value) {
    response.cookies.set(USER_ID_COOKIE, crypto.randomUUID(), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
