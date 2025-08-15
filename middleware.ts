import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const sessionCookie = getSessionCookie(req);

  const isLoginPage = pathname === "/auth/login" || pathname === "/admin/auth/login";

  if (sessionCookie && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!sessionCookie && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) && !isLoginPage) {
    return NextResponse.redirect(new URL(`/auth/login?next=${pathname}${search}`, req.url));
  }

  return NextResponse.next();
}
