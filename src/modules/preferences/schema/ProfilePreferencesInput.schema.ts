import { z } from "zod"

export const ProfilePreferencesInputSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  sidebarDefaultOpen: z.boolean(),
  sidebarOpenShortcut: z.string().min(1, "Shortcut obbligatoria"),
  sidebarSide: z.enum(['left', 'right']),
  sidebarType: z.enum(['floating', 'inset', 'sidebar']),
})

export type ProfilePreferencesInputSchema = z.infer<typeof ProfilePreferencesInputSchema>
