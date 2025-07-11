import { z } from "zod";

// Schema output (puoi differenziarlo da quello input se vuoi)
export const ProfileUpdateOutputSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cognome: z.string(),
  data_nascita: z.date(),
  sesso: z.enum(['M', 'F', 'A', 'N']).nullable().optional(),
});

export type ProfileUpdateOutput = z.infer<typeof ProfileUpdateOutputSchema>;