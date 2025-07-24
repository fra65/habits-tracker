import { CategoryOutputSchema } from "@/modules/category/schema/CategoryOutput.schema";
import { z } from "zod";

export const PRIORITY_ENUM = ["BASSA", "MEDIA", "ALTA"] as const;

export const HabitCategoryOutputSchema = z.object({
  id: z.number(),
  categoriaId: z.number(),
  titolo: z.string().min(2).max(100),
  descrizione: z.string().optional(),

  // Preprocess per accettare Date o stringa ISO, validare come stringa datetime
  startDate: z.preprocess((val) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === "string") return val;
    return val; // passerà comunque a string().datetime() e fallirà se non valido
  }, z.string().datetime()),

  endDate: z.preprocess((val) => {
    if (val === null || val === undefined) return undefined;
    if (val instanceof Date) return val.toISOString();
    if (typeof val === "string") return val;
    return val;
  }, z.string().datetime().optional()),

  color: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/),
  priority: z.enum(PRIORITY_ENUM),
  isActive: z.boolean(),
  visibility: z.enum(["public", "private"]).optional(),

  // Permette number positivo intero, null o undefined (trasformato in undefined)
  targetValue: z.preprocess((val) => (val === null ? undefined : val), z.number().int().positive().optional()),

  userId: z.number(),

        // Inclusione campo categoria come oggetto validato
  categoria: CategoryOutputSchema
});

export type HabitCategoryOutput = z.infer<typeof HabitCategoryOutputSchema>;
