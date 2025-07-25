/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { useTranslations } from "next-intl"
import { IconFromName } from "@/components/icons/iconFromName"
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema"

interface HabitsListItemProps extends HabitCategoryOutput {
  onClick: () => void
}

const predefinedTitles = ["Salute", "Lavoro", "Sport"] // puoi adattare se serve

const HabitsListItem = ({
  id,
  categoriaId,
  titolo,
  descrizione,
  color,
  priority,
  isActive,
  categoria,
  onClick,
}: HabitsListItemProps) => {

  const t = useTranslations("HabitsListPage")

  // Traduci il titolo se è uno dei predefiniti
  const displayCategoryTitle = predefinedTitles.includes(categoria.titolo)
    ? t(`PredefinedCategories.${categoria.titolo}`)
    : categoria.titolo

  // Traduci la priorità
  const displayPriority = t(`Priorities.${priority.toUpperCase()}`)

  // Stile per abitudine attiva o inattiva (opzionale)
  const activeClass = isActive ? "opacity-100" : "opacity-50"

  return (
    <li
      id={`${id}`}
      style={{ backgroundColor: color }}
      className={`flex items-center space-x-4 rounded-md p-4 shadow-sm text-white cursor-pointer ${activeClass}`}
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
    </li>
  )
}

export default HabitsListItem
