import { z } from "zod";

export const SingleDayDetailSchema = z.object({
  id: z.number(),
  completed: z.boolean(),
  value: z.nullable(z.any()),
  note: z.nullable(z.any()),
  habit: z.object({
    targetValue: z.nullable(z.any()),
    titolo: z.string(),
    color: z.string(),
    priority: z.string(),
    categoria: z.object({
      titolo: z.string(),
      icona: z.string(),
    }),
  }),
}).transform(({ id, completed, value, note, habit }) => ({
  id,
  completed,
  value,
  note,
  targetValue: habit.targetValue,
  titolo: habit.titolo,
  color: habit.color,
  priority: habit.priority,
  categoriaTitolo: habit.categoria.titolo,
  categoriaIcona: habit.categoria.icona,
}));

// Schema per l'oggetto raggruppato per data
export const GroupedDayDetailSchema = z.record(SingleDayDetailSchema.array());

// Tipi esportati
export type SingleDayDetails = z.infer<typeof SingleDayDetailSchema>;
export type GroupedDayDetails = z.infer<typeof GroupedDayDetailSchema>;
