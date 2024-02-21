import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req: req,
    secret: process?.env?.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
  });

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const isAdmin = token.role === "admin";

  // if (!isAdmin && pathname !== "/vendors") return NextResponse.redirect(new URL("/", req.url));

  // else if (!isAdmin && pathname !== "/vendors/create") return NextResponse.redirect(new URL("/", req.url));

  // if (!isAdmin && pathname.startsWith("/warehouses/")) return NextResponse.redirect(new URL("/", req.url));

  // if (!isAdmin && pathname.startsWith("/products/")) return NextResponse.redirect(new URL("/", req.url));

  // if (!isAdmin && pathname === "/requests") return NextResponse.redirect(new URL("/", req.url));

  if (!isAdmin) {
    if (
      pathname === "/vendors" ||
      pathname === "/vendors/create" ||
      pathname === "/warehouses" ||
      pathname === "/warehouses/create" ||
      pathname === "/products" ||
      pathname === "/products/create"
    )
      return NextResponse.next();
    else return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/vendors/:path*", "/warehouses/:path*", "/products/:path*", "/requests"],
};
