/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.config.ts
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// ATTENZIONE: Qui NON importiamo `loginUser` né `authSchema`
// Questi moduli potrebbero contenere logiche incompatibili con Edge
// o dipendenze che causano l'errore.
// Le validazioni e l'accesso al DB devono avvenire nel runtime Node.js tradizionale.

export const authConfig = {
    providers: [
        GitHub,
        Google,
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            // La logica di `authorize` va spostata nel file `auth.ts` principale,
            // poiché tipicamente involve l'accesso a un database o la validazione
            // che potrebbe usare librerie non Edge-compatible (es. bcrypt per hashPassword,
            // che si basa su `node-gyp-build`).
            // Lasciando `authorize` qui, anche se in teoria potresti fare validazioni semplici,
            // è più sicuro spostarla completamente.
            authorize: async (credentials) => {
                // Questo authorize NON verrà usato dal middleware edge,
                // ma è necessario per la configurazione base dei providers.
                // La logica vera e propria sarà nel file `auth.ts` principale.
                // Per il middleware, l'autorizzazione si basa sul JWT.
                return null; // Il middleware userà la strategia JWT e il callback `authorized`.
            },
        }),        
    ],
    // Le pagine non sono strettamente necessarie per il middleware,
    // ma possono essere incluse per completezza se non causano problemi.
    pages: {},
    session: {
        strategy: 'jwt' // Cruciale per la compatibilità con Edge [2][3].
    },
    callbacks: {
        // Il callback `authorized` è essenziale per il middleware edge [3].
        authorized: async ({ auth, request }) => {
            if (auth?.user) return true;

            if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
                return true;
            }

            return false;
        },
        // Gli altri callback (`session`, `jwt`) non sono strettamente necessari qui
        // perché verranno gestiti dal file `auth.ts` principale che gira su Node.js.
        // Li lasciamo per chiarezza, ma la loro logica completa sarà nel file principale.
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.username = token.username as string | null | undefined ?? null;
            }
            return session;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.username = (user as any).username ?? null;
            }
            return token;
        },
    }
} satisfies NextAuthConfig;

// Questo file esporta solo l'oggetto di configurazione.
// NON chiamiamo `NextAuth()` qui [3].
export default authConfig;