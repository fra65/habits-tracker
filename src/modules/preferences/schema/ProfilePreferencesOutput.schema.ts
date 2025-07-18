import { z } from 'zod'

const Theme = z.enum(["light", "dark", "system"])
const SidebarSide = z.enum(["left", "right"])
const SidebarType = z.enum(["floating", "inset", "sidebar"])

export const ProfilePreferencesOutputSchema = z.object({
  theme: Theme,
  sidebarDefaultOpen: z.boolean(),
  sidebarOpenShortcut: z.string(),
  sidebarSide: SidebarSide,
  sidebarType: SidebarType,
  lang: z.string(),
})

export type ProfilePreferencesOutput = z.infer<typeof ProfilePreferencesOutputSchema>
