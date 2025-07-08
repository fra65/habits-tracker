import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "L'email è obbligatoria").email("Inserisci un indirizzo email valido"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
