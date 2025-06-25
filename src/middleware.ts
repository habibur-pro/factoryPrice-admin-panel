import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public paths (accessible without login)
const PUBLIC_PATHS = ["/sign-in"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const { pathname } = url;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // Block unauthenticated users from protected routes
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Prevent authenticated users from visiting auth pages
  if (token && pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/orders/:path*",
    "/inventory/:path*",
    "/products/:path*",
    "/customers/:path*",
    "/payments/:path*",
    "/sign-in",
    "/",
  ],
};
