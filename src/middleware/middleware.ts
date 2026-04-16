import { NextResponse } from "next/server";
import { auth } from "../lib/auth/auth";

export default auth((req: any) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startWith("/login");
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}