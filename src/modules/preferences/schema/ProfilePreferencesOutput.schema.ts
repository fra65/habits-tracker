import { z } from 'zod'

const Theme = z.enum(["light", "dark", "system"])

export const ProfilePreferencesOutputSchema = z.object({
  theme: Theme,
  lang: z.string(),
})

export type ProfilePreferencesOutput = z.infer<typeof ProfilePreferencesOutputSchema>
