import { z } from "zod";

export const PRIORITY_ENUM = ["BASSA", "MEDIA", "ALTA"] as const;

export const HabitInputSchema = z.object({
  categoriaId: z.number({
    required_error: "La categoria è obbligatoria",
    invalid_type_error: "La categoria deve essere un numero",
  }),
  titolo: z.string()
    .min(2, "Il titolo deve avere almeno 2 caratteri")
    .max(100, "Il titolo può avere massimo 100 caratteri"),
  descrizione: z.string().optional(),

  // Qui preprocess per convertire stringa "YYYY-MM-DD" in Date
  startDate: z.preprocess((arg) => {
    if (!arg) return new Date();
    if (typeof arg === "string") {
      // Se è nel formato "YYYY-MM-DD", aggiungiamo tempo mezzanotte UTC per evitare ambiguità
      if (/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
        return new Date(`${arg}T00:00:00.000Z`);
      }
      // Se è già un ISO completo o altra stringa, prova a convertire normalmente
      return new Date(arg);
    }
    if (arg instanceof Date) return arg;
    return new Date(); // fallback
  }, z.date()),

  endDate: z.preprocess((arg) => {
    if (!arg) return undefined;
    if (typeof arg === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
        return new Date(`${arg}T00:00:00.000Z`);
      }
      return new Date(arg);
    }
    if (arg instanceof Date) return arg;
    return undefined;
  }, z.date().optional().nullable()),

  color: z.string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Il colore deve essere un codice esadecimale valido"),
  priority: z.enum(PRIORITY_ENUM),
  isActive: z.boolean(),
  visibility: z.string().optional(),
  targetValue: z.number().int().positive().optional().nullable(),
  userId: z.number(),
});

export type HabitInput = z.infer<typeof HabitInputSchema>;
