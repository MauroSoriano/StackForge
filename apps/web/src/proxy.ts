import { NextResponse, type NextRequest } from "next/server";

// Coincide con ACCESS_TOKEN_COOKIE de apps/api (httpOnly, sameSite)
const ACCESS_TOKEN_COOKIE = "stackforge_at";

export function proxy(request: NextRequest) {
  const session = request.cookies.get(ACCESS_TOKEN_COOKIE);
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};