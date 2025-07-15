import { z } from "zod";

export const UserOutputToAdminSchema = z.object({
  id: z.number(), // id è number
  username: z.string().min(3, "Username troppo corto"),
  email: z.string().email("Email non valida"),
  role: z.enum(["ADMIN", "USER", "MODERATOR"]), // ruoli in maiuscolo come nel DB
  provider: z.string().min(1, "Provider obbligatorio"),
});

export type UserOutputAdmin = z.infer<typeof UserOutputToAdminSchema>;
