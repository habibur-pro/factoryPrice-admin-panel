import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Prevent redirect loop for logged-out users trying to access dashboard
  if (!token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect logged-in users from auth pages to dashboard
  if (token) {
    if (url.pathname.startsWith("/sign-in")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow request to proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in"],
};
