/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Importa lo schema di validazione per l'autenticazione
import { authSchema } from "@/modules/auth/schema/auth.schema";
// Importa la funzione per effettuare il login personalizzato (es. interrogare il DB)
import { loginUser } from "@/modules/auth/services/auth.service";
// Importa il tipo dell'input per il login
import { LoginUserInput } from "@/modules/auth/types/LoginUserInput";

// Importa NextAuth e i provider OAuth + Credentials
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Importa i tipi per sessione, utente e JWT per la tipizzazione TypeScript
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";

// Funzione helper per normalizzare il ruolo (importata da utils)
import { normalizeRole } from "@/utils/roleEnumHelper";

// Importa la configurazione base (providers, session strategy, middleware edge compatibile)
import authConfig from "./auth.config"; // Assicurati che il percorso sia corretto
import { createUser, createUserOauth, getUserByAuthProvider, getUserByEmail } from "@/modules/user/services/user.service";
import { createUserPreferences } from "@/modules/preferences/services/preferences.service";

// Esporta la configurazione NextAuth con i provider e i callback personalizzati
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // Espandi la configurazione base (providers, session strategy, middleware)

  providers: [
    GitHub, // Provider OAuth GitHub
    Google, // Provider OAuth Google
    Credentials({
      credentials: {
        username: {}, // Definisce i campi accettati per il login con credenziali
        password: {},
      },
      // Funzione che gestisce il login con credenziali personalizzate
      // Viene eseguita solo lato server (runtime Node.js), non nel middleware edge
      authorize: async (credentials) => {
        // Validazione dei dati di input con lo schema definito (es. Zod)
        const parsed = authSchema.login.safeParse(credentials);

        if (!parsed.success) {
          // Se la validazione fallisce, logga l'errore e blocca l'autenticazione
          console.error("Validazione fallita", parsed.error.format());
          throw new Error("Credenziali non valide");
        }

        // Estrai i dati validati
        const input: LoginUserInput = parsed.data;

        // Chiama il servizio loginUser per verificare le credenziali e ottenere l'utente
        const user = await loginUser(input);

        // Se l'utente non viene trovato o credenziali errate, ritorna null
        if (!user) {
          return null;
        }

        // Ritorna l'oggetto utente (deve contenere almeno id, username, role coerenti con i tipi)
        return user;
      },
    }),
  ],

  callbacks: {

    async signIn({ user, account }) {
      if (account && account.provider !== "credentials") {

        if(!user.email) {
          return false;
        }

        // Verifica se l'utente esiste con email + provider
        const existingUser = await getUserByEmail(user.email, account.provider)

        if (!existingUser) {

          // Crea utente senza password
          const createdUser = await createUserOauth({
            username: user.name ?? user.email?.split("@")[0] ?? "user",
            email: user.email,
            provider: account.provider
          }) 

          // creo le preferenze di default per questo utente
          await createUserPreferences(createdUser.id);

        }
      }
      return true; // consenti il login
    },

    // Callback chiamato ogni volta che si crea o aggiorna la sessione lato client
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string; // ← già corretto
        session.user.role = normalizeRole(token.role) ?? "USER";
        session.user.username = token.username ?? null;
      }
      return session;
    },

    // Callback chiamato ogni volta che si crea o aggiorna il token JWT
    jwt: async ({ token, user, account }): Promise<JWT> => {
      if (user) {
        try {
          let dbUser;

          if (account && account.provider !== "credentials") {
            // Login OAuth - recupera utente tramite email
            dbUser = await getUserByEmail(user.email!, account.provider);
          } else {
            // Login con credenziali - user già contiene id numerico
            dbUser = user as any; // tipizzato già come utente dal DB
          }

          if (dbUser) {
            token.id = dbUser.id; // ← Usa sempre la PK dal DB
            token.role = normalizeRole(dbUser.role);
            token.username = dbUser.username ?? null;
          } else {
            console.warn("[JWT callback] Utente non trovato nel DB.");
          }
        } catch (error) {
          console.error("[JWT callback] Errore nel recupero utente dal DB:", error);
        }
      }
      return token;
    },
},
});
