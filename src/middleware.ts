import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (req.auth) {
    if (pathname === "/login" || pathname === "/signup") {
      return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  } else {
    if (pathname !== "/login" && pathname !== "/signup" && pathname !== "/") {
      return Response.redirect(new URL("/login", req.nextUrl.origin));
    }
  }
});

export const config = {
  matcher: [
    '/:path((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
