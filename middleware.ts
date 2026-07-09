import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "__session";

// Cheap edge-level gate only — the authoritative verification (Admin SDK
// verifySessionCookie) happens in getSession() on the Node runtime. This just
// bounces obviously-unauthenticated traffic before it hits a server component.
// Gates the /ops dashboard; /staff (the public chooser) is intentionally open.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has(SESSION_COOKIE);

  if (pathname.startsWith("/ops") && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/ops";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops", "/ops/:path*", "/login"],
};
