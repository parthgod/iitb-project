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

  if (!isAdmin) {
    if (
      pathname === "/bus" ||
      pathname === "/bus/create" ||
      pathname === "/excitationSystem" ||
      pathname === "/excitationSystem/create" ||
      pathname === "/generators" ||
      pathname === "/generators/create"
    )
      return NextResponse.next();
    else return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/bus/:path*", "/excitationSystem/:path*", "/generators/:path*", "/requests"],
};
