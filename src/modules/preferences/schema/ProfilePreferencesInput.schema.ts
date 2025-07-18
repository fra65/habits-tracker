import { z } from "zod"

export const ProfilePreferencesInputSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  lang: z.string()
})

export type ProfilePreferencesInputSchema = z.infer<typeof ProfilePreferencesInputSchema>
