import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const [, localeSegment] = pathname.split("/");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", isLocale(localeSegment) ? localeSegment : defaultLocale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|tea-journey|robots.txt|sitemap.xml).*)"],
};
