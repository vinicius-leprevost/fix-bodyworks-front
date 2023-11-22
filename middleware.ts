import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const rt = request.cookies.has("rt");
  const at = request.cookies.has("at");

  if (!rt || !at) {
    if (request.nextUrl.pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    return NextResponse.next();
  }

  if (rt || at) {
    if (
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/signup"
    ) {
      return NextResponse.redirect(new URL("/app", request.nextUrl));
    }
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
