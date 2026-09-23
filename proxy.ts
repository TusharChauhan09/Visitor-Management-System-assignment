import { NextRequest, NextResponse } from "next/server";
import { parseSessionCookie, SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Next.js 16 network boundary (formerly middleware.ts).
 * Reads the session cookie only — login/logout use lib/auth/session.ts.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseSessionCookie(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login") {
    if (session?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (session?.role === "employee") {
      return NextResponse.redirect(new URL("/employee", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/employee")) {
    if (pathname === "/employee/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname === "/employee/register") {
      return NextResponse.next();
    }
    if (!session || session.role !== "employee") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/employee/:path*"],
};
