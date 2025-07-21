import { z } from 'zod'

export const PreferencesLangOutputSchema = z.object({
  lang: z.string().min(2, "La lingua deve essere di almeno 2 caratteri"),
})

export type PreferencesLangOutput = z.infer<typeof PreferencesLangOutputSchema>
