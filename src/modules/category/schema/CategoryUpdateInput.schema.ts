import z from "zod"

export const CategoryUpdateInputSchema = z.object({
  id: z.number(),
  titolo: z.string().min(1, "Titolo obbligatorio"),
  descrizione: z.string().optional(),
  icona: z.string().optional(),
  colore: z.string().optional(),
})

export type CategoryUpdateInput = z.infer<typeof CategoryUpdateInputSchema>