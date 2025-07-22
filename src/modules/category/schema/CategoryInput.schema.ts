import { z } from "zod";

export const CategoryInputSchema = z.object({
  titolo: z.string().nonempty("Il campo titolo è obbligatorio."),
  descrizione: z.string().optional(),
  icona: z.string().optional(),
  colore: z.string().optional(),
});

export type CategoryInput = z.infer<typeof CategoryInputSchema>;

