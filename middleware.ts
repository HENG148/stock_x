import { NextResponse } from "next/server";
import { auth } from "./src/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const isLoggedIn = !!user;
  const role = user?.role;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (pathname.startsWith("/profile")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  if (isLoggedIn && (pathname === "login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next()
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/login",
    "/register"
  ]
}