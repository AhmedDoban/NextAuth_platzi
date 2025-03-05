import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");
  const JoinedSegments = segments.join("/");

  /************  For Login and website middleware ==> 2 type of pages *********/

  // const ChechAuth =
  //   request.cookies.get("Template_Cookies")?.value !== undefined ? true : false;

  // const AuthRoutes = /(Dashboard|Profile|Settings)/gi;
  // const GuestRoutes = /(Login)/gi;

  // const TestAuth = AuthRoutes.test(JoinedSegments);
  // const TestGuest = GuestRoutes.test(JoinedSegments);

  // if (locale != null && TestAuth && ChechAuth) {
  //   request.nextUrl.pathname = `/${locale}/${JoinedSegments}`;
  // } else {
  //   if (locale != null && !TestAuth && ChechAuth) {
  //     request.nextUrl.pathname = `/${locale}/Dashboard`;
  //   } else {
  //     if (locale != null && !TestAuth && !ChechAuth && TestGuest) {
  //       request.nextUrl.pathname = `/${locale}/${JoinedSegments}`;
  //     } else {
  //       request.nextUrl.pathname = `/${locale}/Login`;
  //     }
  //   }
  // }

  /************  For Login and website and authedSections middleware ==> 3 type of pages *********/

  // const ChechAuth =
  //   request.cookies.get("Template_Cookies")?.value !== undefined
  //     ? true
  //     : false;

  // const AuthRoutes = /(LoyaltyCoins|OrderHistory)/gi;
  // const GuestRoutes = /(Login|Register|OTP|PINCode)/gi;
  // const GlobalRoutes =
  //   /(about|Our_Brands|Recipes|Find_Us|Careers|Contact_Us|Products|New_Arrivals|Shop|Terms_Conditions)/gi;

  // const TestAuth = AuthRoutes.test(JoinedSegments);
  // const TestGlobal = GlobalRoutes.test(JoinedSegments);
  // const TestGuest = GuestRoutes.test(JoinedSegments);

  // if (locale != null && !!ChechAuth && (TestAuth || TestGlobal) && !TestGuest) {
  //   request.nextUrl.pathname = `/${locale}/${JoinedSegments}`;
  // } else {
  //   if (locale != null && segments.length > 0 && (TestGuest || TestGlobal)) {
  //     if (ChechAuth) {
  //       request.nextUrl.pathname = `/${locale}/Shop`;
  //     } else {
  //       request.nextUrl.pathname = `/${locale}/${JoinedSegments}`;
  //     }
  //   } else {
  //     request.nextUrl.pathname = `/${locale}`;
  //   }
  // }

  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
