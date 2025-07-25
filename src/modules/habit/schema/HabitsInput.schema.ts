import { z } from "zod";

export const PRIORITY_ENUM = ["BASSA", "MEDIA", "ALTA"] as const;

// Schema base comune (senza userId)
const HabitInputBaseSchema = z.object({
  categoriaId: z.number({
    required_error: "La categoria è obbligatoria",
    invalid_type_error: "La categoria deve essere un numero",
  }),
  titolo: z.string()
    .min(2, "Il titolo deve avere almeno 2 caratteri")
    .max(30, "Il titolo può avere massimo 30 caratteri"),
  descrizione: z.string().optional(),

  startDate: z.preprocess((arg) => {
    if (!arg) return new Date();
    if (typeof arg === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
        return new Date(`${arg}T00:00:00.000Z`);
      }
      return new Date(arg);
    }
    if (arg instanceof Date) return arg;
    return new Date();
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
});

// Schema client (senza userId)
export const HabitInputClientSchema = HabitInputBaseSchema;

// Schema server (con userId)
export const HabitInputSchema = HabitInputBaseSchema.extend({
  userId: z.number(),
});

// Tipi inferiti:
export type HabitInputClient = z.infer<typeof HabitInputClientSchema>;
export type HabitInput = z.infer<typeof HabitInputSchema>;
