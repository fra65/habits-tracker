// middleware.ts
import { authConfig } from "@/lib/auth.config"; // Importa authConfig dal nuovo file
import NextAuth from "next-auth"; // Assicurati di importare NextAuth

// Inizializza Auth.js con la configurazione Edge-compatible
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const protectedPaths = ["/dashboard", "reset-password"];

  if (req.auth) {
    // Se l'utente è autenticato e sta cercando di accedere a una pagina di autenticazione, redirect alla dashboard
    if (authPaths.includes(pathname)) {
      return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  } else {
    // Se l'utente non è autenticato e sta cercando di accedere a una pagina protetta, redirect al login
    if (protectedPaths.includes(pathname)) {
      return Response.redirect(new URL("/login", req.nextUrl.origin));
    }
  }
});


export const config = {
    matcher: [
        '/:path((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
    ],
};
