import { z } from "zod";

export const CategoryOutputSchema = z.object({
    id: z.number(),
    titolo: z.string(),
    descrizione: z.string(),
    icona: z.string(),
    colore: z.string(),
});

export type CategoryOutput = z.infer<typeof CategoryOutputSchema>;