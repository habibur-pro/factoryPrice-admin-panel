import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rolePermissions } from "./const";
import { UserRole } from "./enum";

// Public pages (no login required)
const PUBLIC_PATHS = ["/sign-in"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 1️⃣ Not logged in & accessing protected page → redirect to sign-in
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 2️⃣ Logged in but trying to visit /sign-in → redirect to home
  if (token && pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3️⃣ Role-based access control (only for logged-in users)
  if (token) {
    const role = token.role as UserRole;
  
    // Check if role exists in rolePermissions
    if (!(role in rolePermissions)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  
    // Super Admin and Admin have full access
    if (role === UserRole.super_admin || role === UserRole.admin) {
      return NextResponse.next();
    }
  
    const allowedPaths = rolePermissions[role];
  
    // For other roles, check if requested path is allowed (using startsWith)
    const isAllowed = allowedPaths.some(
      (p) => p === "*" || pathname.startsWith(p)
    );
  
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/:path*",
    "/payments/:path*",
    "/orders/:path*",
    "/discount/:path*",
    "/query/:path*",
    "/permission-management/:path*",
    "/sign-in",
    "/"
  ],
};
