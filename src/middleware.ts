// middleware.ts
import { authConfig } from "@/lib/auth.config"; // Importa authConfig dal nuovo file
import NextAuth from "next-auth"; // Assicurati di importare NextAuth

// Inizializza Auth.js con la configurazione Edge-compatible
const { auth } = NextAuth(authConfig);

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
