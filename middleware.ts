import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, getAuthSecret, parseSessionToken } from "@/lib/auth/session-token";
import { siteConfig } from "@/lib/config/site-config";

const LOGIN_PATH = siteConfig.routes.admin.login;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const secret = getAuthSecret(process.env.AUTH_SECRET);
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await parseSessionToken(token, secret) : null;

  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    if (session) {
      return NextResponse.redirect(
        new URL(siteConfig.routes.admin.dashboard, request.url),
      );
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
