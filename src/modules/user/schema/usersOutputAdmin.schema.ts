import { z } from "zod";

const UserProfileSchema = z.object({
  id: z.number(),
  nome: z.string().min(1, "Nome obbligatorio"),
  cognome: z.string().min(1, "Cognome obbligatorio"),
  data_nascita: z.preprocess(
    (val) => val instanceof Date ? val.toISOString() : val,
    z.string().min(1, "Data di nascita obbligatoria")
  ),
  sesso: z.string().min(1, "Sesso obbligatorio").nullable(),
  // aggiungi qui altri campi del profilo se servono
});

export const OutputUserWithProfileSchema = z.object({
  id: z.number(),
  username: z.string().min(3, "Username troppo corto").nullable(), // nullable perché da Prisma può arrivare null
  email: z.string().email("Email non valida").nullable(),         // nullable perché da Prisma può arrivare null
  role: z.enum(["ADMIN", "USER", "MODERATOR"]),
  provider: z.string().min(1, "Provider obbligatorio"),
  user_profile: UserProfileSchema.nullable(), // <-- ANNIDATO QUI!
});

export type OutputUserWithProfile = z.infer<typeof OutputUserWithProfileSchema>;
