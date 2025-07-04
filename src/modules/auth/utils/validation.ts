// src/modules/auth/validation.ts
import { z } from "zod";

export const authSchema = {

  signup: z.object({

    email: z.string().email("Inserisci una email valida").trim(),
    password: z.string()
      .min(8, "La password deve essere lunga almeno 8 caratteri")
      .regex(/[a-zA-Z]/, "Deve contenere almeno una lettera")
      .regex(/[0-9]/, "Deve contenere almeno un numero")
      .regex(/[^a-zA-Z0-9]/, "Deve contenere almeno un carattere speciale")
      .trim(),
    confermaPassword: z.string().trim(),

  }).refine((data) => data.password === data.confermaPassword, {

    message: "Le password non coincidono",
    path: ["confermaPassword"], // mostra l’errore sul campo confermaPassword

  }),
  login: z.object({

    email: z.string().email("Inserisci una email valida").trim(),
    password: z.string().min(8, "La password deve essere lunga almeno 8 caratteri"),

  }),
};

export type SignupInput = z.infer<typeof authSchema.signup>;
export type LoginInput = z.infer<typeof authSchema.login>;
