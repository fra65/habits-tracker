import { z } from "zod";

// Schema client: senza 'id'
export const ProfileUpdateInputSchema = z.object({
  nome: z.string({
    required_error: "Il nome è obbligatorio",
    invalid_type_error: "Il nome deve essere una stringa",
  })
    .min(1, { message: "Il nome non può essere vuoto" })
    .max(50, { message: "Il nome non può superare i 50 caratteri" }),

  cognome: z.string({
    required_error: "Il cognome è obbligatorio",
    invalid_type_error: "Il cognome deve essere una stringa",
  })
    .min(1, { message: "Il cognome non può essere vuoto" })
    .max(50, { message: "Il cognome non può superare i 50 caratteri" }),

  data_nascita: z.string({
    required_error: "La data è obbligatoria",
  })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La data non è valida",
    })
    .transform((val) => new Date(val)),

  sesso: z.enum(["M", "F", "A", "N"], {
    invalid_type_error: "Il sesso deve essere M, F, A o N",
  }).optional(),

});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateInputSchema>;
