import { z } from "zod";

const forbiddenTitles = ["Salute", "Healty", "Lavoro", "Work", "Sport"];

export const CategoryInputSchema = z.object({
  titolo: z
    .string()
    .nonempty("Il campo titolo è obbligatorio.")
    .refine(
      (val) => !forbiddenTitles.includes(val),
      {
        message: `Il titolo non può essere: ${forbiddenTitles.join(", ")}`,
      }
    ),
  descrizione: z.string().optional(),
  icona: z.string().optional(),
  colore: z.string().optional(),
});

export type CategoryInput = z.infer<typeof CategoryInputSchema>;
