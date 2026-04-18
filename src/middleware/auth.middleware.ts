import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/sell"];
const AUTH_ROUTES = ["/auth/signin", "/auth/error"];

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl, auth: session } = req as any;
  const isLoggedIn = !!session;

  const isProtected = PROTECTED_ROUTES.some((route) => 
    nextUrl.pathname.startWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => 
    nextUrl.pathname.startWith(route)
  )

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isProtected && isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }
  return NextResponse.next();
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}