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
      pathname === "/generator" ||
      pathname === "/generator/create" ||
      pathname === "/load" ||
      pathname === "/load/create" ||
      pathname === "/seriesCapacitor" ||
      pathname === "/seriesCapacitor/create" ||
      pathname === "/shuntCapacitor" ||
      pathname === "/shuntCapacitor/create" ||
      pathname === "/shuntReactor" ||
      pathname === "/shuntReactor/create" ||
      pathname === "/singleLineDiagram" ||
      pathname === "/singleLineDiagram/create" ||
      pathname === "/transformersThreeWinding" ||
      pathname === "/transformersThreeWinding/create" ||
      pathname === "/transformersTwoWinding" ||
      pathname === "/transformersTwoWinding/create" ||
      pathname === "/transmissionLine" ||
      pathname === "/transmissionLine/create" ||
      pathname === "/turbineGovernor" ||
      pathname === "/turbineGovernor/create" ||
      pathname === "/ibr" ||
      pathname === "/ibr/create" ||
      pathname === "/lccHvdcLink" ||
      pathname === "/lccHvdcLink/create" ||
      pathname === "/seriesFact" ||
      pathname === "/seriesFact/create" ||
      pathname === "/shuntFact" ||
      pathname === "/shuntFact/create" ||
      pathname === "/vscHvdcLink" ||
      pathname === "/vscHvdcLink/create" ||
      pathname === "/historyLog" ||
      pathname === "/profile" ||
      pathname === "/requests"
    )
      return NextResponse.next();
    else return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/bus/:path*",
    "/excitationSystem/:path*",
    "/generator/:path*",
    "/load/:path*",
    "/seriesCapacitor/:path*",
    "/shuntCapacitor/:path*",
    "/shuntReactor/:path*",
    "/singleLineDiagram/:path*",
    "/transformersThreeWinding/:path*",
    "/transformersTwoWinding/:path*",
    "/transmissionLine/:path*",
    "/turbineGovernor/:path*",
    "/requests",
    "/historyLog",
    "/profile",
    "/ibr/:path*",
    "/lccHvdcLink/:path*",
    "/seriesFact/:path*",
    "/shuntFact/:path*",
    "/vscHvdcLink/:path*",
  ],
};
