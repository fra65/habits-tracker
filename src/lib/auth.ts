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
    // Callback chiamato ogni volta che si crea o aggiorna la sessione lato client
    session: async ({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) => {
      if (session.user) {
        // Copia l'id dal token JWT nella sessione (tipizzato come number)
        session.user.id = token.id as number;

        // Normalizza il ruolo usando la funzione helper e assegna "USER" come default se non valido
        session.user.role = normalizeRole(token.role) ?? "USER";

        // Copia lo username dal token o assegna null se non presente
        session.user.username = token.username ?? null;
      }
      // Ritorna la sessione aggiornata
      return session;
    },

    // Callback chiamato ogni volta che si crea o aggiorna il token JWT
    jwt: async (params: {
      token: JWT;
      user?: User | AdapterUser; // user può essere User (DB) o AdapterUser (OAuth)
      account?: any;
      profile?: any;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: any;
    }): Promise<JWT> => {
      const { token, user } = params;

      if (user) {
        // Normalizza l'id:
        // Se è stringa numerica (es. OAuth), prova a convertirla in number
        // Altrimenti mantieni la stringa (es. UUID)
        token.id = typeof user.id === "string" ? parseInt(user.id, 10) || user.id : user.id;

        // Definisce i ruoli validi come costanti
        const validRoles = ["USER", "ADMIN", "MODERATOR"] as const;
        type Role = (typeof validRoles)[number];

        // Funzione interna per normalizzare il ruolo (simile a quella importata)
        function normalizeRole(role: unknown): Role {
          if (typeof role === "string" && validRoles.includes(role as Role)) {
            return role as Role;
          }
          return "USER"; // default se ruolo non valido
        }

        // Normalizza e assegna il ruolo al token
        token.role = normalizeRole((user as any).role);

        // Copia lo username o assegna null se non presente
        token.username = (user as any).username ?? null;
      }

      // Ritorna il token aggiornato
      return token;
    },
  },
});
