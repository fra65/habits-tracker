// auth.ts (il tuo file esistente)
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authSchema } from "@/modules/auth/schema/auth.schema"
import { loginUser } from "@/modules/auth/services/auth.service"
import { LoginUserInput } from "@/modules/auth/types/LoginUserInput"
// import { hashPassword } from "@/modules/auth/utils/hashPassword" // Commenta o rimuovi se non usata direttamente qui
import NextAuth from "next-auth" // Rimuovi NextAuthConfig da qui
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// Importa la configurazione base compatibile con Edge
import authConfig from "./auth.config" // Assicurati che il percorso sia corretto

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig, // Espandi la configurazione base
    providers: [
        GitHub,
        Google,
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                // Questa è la logica completa di `authorize` che interagisce con il DB.
                // Questa parte del codice verrà eseguita solo nel runtime Node.js,
                // non nel middleware edge.
                const parsed = authSchema.login.safeParse(credentials);

                if (!parsed.success) {
                    console.error("Validazione fallita", parsed.error.format());
                    throw new Error("Credenziali non valide");
                }

                const input: LoginUserInput = parsed.data;

                const user = await loginUser(input)
        
                if (!user) {
                    return null
                }
                return user
            },
        }),        
    ],
    // Se avessi adapter per il database (es. PrismaAdapter), lo aggiungeresti qui:
    // adapter: PrismaAdapter(prisma),
    // E ti assicuri che la session strategy sia 'jwt' se hai un adapter incompatibile con Edge
    // session: { strategy: 'jwt' }, // Già definito in authConfig, ma lo ribadiamo per chiarezza
    callbacks: {
        // Qui puoi estendere o modificare i callbacks definiti in authConfig.
        // Il callback `authorized` non va qui, rimane in `auth.config.ts` per il middleware.
        session: async ({ session, token }) => {
            // Esempio: personalizzazione della sessione,
            // Assicurati che questa logica sia compatibile con il server side (Node.js)
            if (session.user) {
                session.user.username = token.username as string | null | undefined ?? null;
            }

            return session;
        },
        jwt: async ({ token, user }) => {
            // Esempio: personalizzazione del JWT
            if (user) {
                token.username = (user as any).username ?? null;
            }

            return token;
        },
    }
})