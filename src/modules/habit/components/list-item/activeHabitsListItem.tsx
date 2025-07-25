/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { IconFromName } from "@/components/icons/iconFromName"
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema"

interface ActiveHabitsListItemProps extends HabitCategoryOutput {
  onClick: () => void
}

// Funzioni API simulate: sostituisci con chiamate reali
async function addToLog(habitId: number): Promise<{ success: boolean; message: string }> {
  // Simulazione delay
  await new Promise((r) => setTimeout(r, 1000))
  // Simulazione: se id è dispari, esito negativo (esempio)
  if (habitId % 2 === 1) {
    return { success: false, message: "L'abitudine è già presente nel log." }
  }
  return { success: true, message: "Aggiornamento log riuscito." }
}

async function removeFromLog(habitId: number): Promise<{ success: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 1000))
  if (habitId % 2 === 0) {
    return { success: false, message: "L'abitudine non è presente nel log." }
  }
  return { success: true, message: "Rimozione dal log riuscita." }
}

const predefinedTitles = ["Salute", "Lavoro", "Sport"] // puoi adattare se serve

const ActiveHabitsListItem = ({
  id,
  categoriaId,
  titolo,
  descrizione,
  color,
  priority,
  isActive,
  categoria,
  onClick,
}: ActiveHabitsListItemProps) => {
  const t = useTranslations("HabitsListPage")

  const displayCategoryTitle = predefinedTitles.includes(categoria.titolo)
    ? t(`PredefinedCategories.${categoria.titolo}`)
    : categoria.titolo

  const displayPriority = t(`Priorities.${priority.toUpperCase()}`)

  const activeClass = isActive ? "opacity-100" : "opacity-50"

  // Stati per le operazioni API
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoadingAdd(true)
    setMessage(null)
    setMessageType(null)
    try {
      const result = await addToLog(id)
      setMessage(result.message)
      setMessageType(result.success ? "success" : "error")
    } catch {
      setMessage(t("error-generic"))
      setMessageType("error")
    } finally {
      setLoadingAdd(false)
    }
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoadingRemove(true)
    setMessage(null)
    setMessageType(null)
    try {
      const result = await removeFromLog(id)
      setMessage(result.message)
      setMessageType(result.success ? "success" : "error")
    } catch {
      setMessage(t("error-generic"))
      setMessageType("error")
    } finally {
      setLoadingRemove(false)
    }
  }

  return (
    <li
      id={`${id}`}
      style={{ backgroundColor: color }}
      className={`flex items-center justify-between rounded-md p-4 shadow-sm text-white cursor-pointer ${activeClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex items-center space-x-4">
        <div>
          <IconFromName iconName={categoria.icona} />
          {/* {displayCategoryTitle} */}
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{titolo}</h3>
          {/* <p className="text-sm opacity-90">{descrizione}</p> */}
          <small className="text-xs opacity-70">
            {t("hlp-priority")}: {displayPriority}
          </small>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2 min-w-[150px]">
        <div className="flex space-x-2">
          <button
            onClick={handleAdd}
            disabled={loadingAdd || loadingRemove}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded text-sm"
            aria-label={t("Buttons.add-to-log")}
          >
            {loadingAdd ? t("loading") : "✔️"}
          </button>
          <button
            onClick={handleRemove}
            disabled={loadingRemove || loadingAdd}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded text-sm"
            aria-label={t("Buttons.remove-from-log")}
          >
            {loadingRemove ? t("loading") : "❌"}
          </button>
        </div>

        {message && (
          <p
            className={`text-xs whitespace-normal max-w-xs ${
              messageType === "success" ? "text-green-300" : "text-red-300"
            }`}
            role={messageType === "error" ? "alert" : undefined}
          >
            {message}
          </p>
        )}
      </div>
    </li>
  )
}

export default ActiveHabitsListItem
