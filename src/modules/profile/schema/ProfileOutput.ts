import { z } from "zod";

// Schema output (puoi differenziarlo da quello input se vuoi)
export const ProfileOutputSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cognome: z.string(),
  data_nascita: z.date(),
  sesso: z.enum(['M', 'F', 'A', 'N']).nullable().optional(),
  is_complete: z.union([z.number(), z.boolean()]).transform(val => val === 1 || val === true),
});

export type ProfileOutput = z.infer<typeof ProfileOutputSchema>;