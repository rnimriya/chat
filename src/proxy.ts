import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  const session = token ? await verifyToken(token) : null;

  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (AUTH_PAGES.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
