import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");
  const JoinedSegments = segments.join("/");

  const ChechAuth =
    request.cookies.get("Template_Cookies")?.value !== undefined ||
    request.cookies.get("__Secure-authjs.session-token")?.value !== undefined;

  const AuthRoutes = /()/gi;
  const GuestRoutes = /(Login)/gi;

  const TestAuth = AuthRoutes.test(JoinedSegments);
  const TestGuest = GuestRoutes.test(JoinedSegments);

  if (locale != null && TestAuth && ChechAuth) {
    request.nextUrl.pathname = `/${locale}/${JoinedSegments}`;
  } else {
    if (locale != null && !TestAuth && ChechAuth) {
      request.nextUrl.pathname = `/${locale}/`;
    } else {
      if (locale != null && !TestAuth && !ChechAuth && TestGuest) {
        request.nextUrl.pathname = `/${locale}/${JoinedSegments}`;
      } else {
        request.nextUrl.pathname = `/${locale}/Login`;
      }
    }
  }

  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
