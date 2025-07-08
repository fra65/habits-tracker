import { z } from "zod"

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La password deve essere di almeno 8 caratteri")
      .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
      .regex(/[a-z]/, "La password deve contenere almeno una lettera minuscola")
      .regex(/[0-9]/, "La password deve contenere almeno un numero")
      .regex(/[^A-Za-z0-9]/, "La password deve contenere almeno un carattere speciale"),
    confirmPassword: z.string().min(1, "La conferma password è obbligatoria"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
