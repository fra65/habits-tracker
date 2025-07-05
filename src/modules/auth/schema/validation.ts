// src/modules/auth/validation.ts
import { z } from "zod";

export const authSchema = {

  signup: z.object({

    username: z.string()
      .min(1, "L'username è obbligatorio")
      .max(20, "L'username non può superare i 20 caratteri")
      .regex(/^[a-zA-Z0-9_]+$/, "L'username può contenere solo lettere, numeri e underscore")
      .trim(),
    email: z.string().email("Inserisci una email valida").trim(),
    password: z.string()
      .min(8, "La password deve essere lunga almeno 8 caratteri")
      .regex(/[a-zA-Z]/, "Deve contenere almeno una lettera")
      .regex(/[0-9]/, "Deve contenere almeno un numero")
      .regex(/[^a-zA-Z0-9]/, "Deve contenere almeno un carattere speciale")
      .trim(),
    confirmPassword: z.string().trim(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  }),
  // .refine(async (data) => {
  //   // Funzione per controllare se l'username è già in uso
  //   const isUsernameTaken = await checkUsernameExists(data.username);
  //   return !isUsernameTaken;
  // }, 
  // {
  //   message: "Questo username è già in uso",
  //   path: ["username"],
  // }),

  login: z.object({

    email: z.string().email("Inserisci una email valida").trim(),
    password: z.string().min(8, "La password deve essere lunga almeno 8 caratteri"),

  }),
};

export type SignupInput = z.infer<typeof authSchema.signup>;
export type LoginInput = z.infer<typeof authSchema.login>;
