import { z } from "zod";

export const LogsViewSchema = z.object({
  id: z.number(),
  completed: z.boolean(),
  logDate: z.preprocess(
    val => {
      if (val instanceof Date) {
        // converte Date in stringa 'YYYY-MM-DD'
        return val.toISOString().slice(0, 10);
      }
      if (typeof val === "string") {
        // se è stringa, prendiamo solo i primi 10 caratteri per estrarre la data
        return val.slice(0, 10);
      }
      return val;
    },
    z.string().refine(
      dateStr => /^\d{4}-\d{2}-\d{2}$/.test(dateStr),
      { message: "logDate deve essere nel formato 'YYYY-MM-DD'" }
    )
  ),
  habit: z.object({
    titolo: z.string(),
    color: z.string(),
    priority: z.string(),
    categoria: z.object({
      icona: z.string(),
    }),
  }),
}).transform(({ id, completed, logDate, habit }) => ({
  id,
  completed,
  logDate,       // 'YYYY-MM-DD'
  titolo: habit.titolo,
  color: habit.color,
  priority: habit.priority,
  categoriaIcona: habit.categoria.icona,
}));

// Schema per oggetto raggruppato per data (se serve)
export const GroupedDayViewSchema = z.record(LogsViewSchema.array());

// Tipi esportati
export type LogsView = z.infer<typeof LogsViewSchema>;
export type GroupedDayView = z.infer<typeof GroupedDayViewSchema>;
