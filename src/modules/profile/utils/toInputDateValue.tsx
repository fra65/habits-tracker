export default function toInputDateValue(date: Date | string | undefined) {
  if (!date) return ""
  if (typeof date === "string") {
    // Se già in formato "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
    // Altri casi gestisci parsing
    const tmp = new Date(date)
    if (!isNaN(tmp.valueOf())) return tmp.toISOString().slice(0, 10)
    return ""
  }
  if (date instanceof Date && !isNaN(date.valueOf())) return date.toISOString().slice(0, 10)
  return ""
}