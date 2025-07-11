import { z } from "zod";

// Schema client: senza 'id'
export const ProfileInputClientSchema = z.object({
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

  is_complete: z.boolean({
    invalid_type_error: 'Il campo "isComplete" deve essere booleano',
  }).default(true),
});

// Schema server: estende il client aggiungendo 'id'
export const ProfileInputSchema = ProfileInputClientSchema.extend({
  id: z.number({
    required_error: "L'id utente è obbligatorio",
    invalid_type_error: "L'id deve essere un numero",
  }),
});

// Infer del tipo completo (con id)
export type ProfileInputClient = z.infer<typeof ProfileInputClientSchema>;
export type ProfileInput = z.infer<typeof ProfileInputSchema>;
