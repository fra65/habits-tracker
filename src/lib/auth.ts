/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authOption = {
    providers: [
        GitHub,
        Google,
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const user = {
                    email: "io@gmail.com",
                    password: "psw123",
                }
        
                // // logic to salt and hash password
                // const pwHash = saltAndHashPassword(credentials.password)
        
                // // logic to verify if the user exists
                // user = await getUserFromDb(credentials.email, pwHash)
        
                if (!user) {
                    throw new Error("Invalid credentials.")
                }
        
                // return user object with their profile data
                return user
            },
        }),        
    ],
    pages: {},
    callbacks: {

        // Controlla se l’utente è autorizzato ad accedere (usato dal middleware)
        authorized: async ({ auth, request }) => {
            // Se l’utente è autenticato, autorizza l’accesso
            if (auth?.user) return true;

            // Permetti sempre l’accesso alle pagine di login e registrazione per utenti non autenticati
            if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
            return true;
            }

            // Blocca l’accesso a tutte le altre pagine se non autenticato
            return false;
        },

        // Opzionale: personalizza cosa viene salvato nella sessione
        // session: async ({ session, token }) => {
        //     // Aggiungi dati extra alla sessione se vuoi
        //     session.user.id = token.sub;
        //     return session;
        // },

        // // Opzionale: personalizza il token JWT
        // jwt: async ({ token, user }) => {
        //     if (user) {
        //     token.sub = user.id;
        //     }
        //     return token;
        // }
    }


} satisfies NextAuthConfig
 
export const { handlers, signIn, signOut, auth } = NextAuth(authOption)