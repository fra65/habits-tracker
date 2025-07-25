import React from "react"
import { CategoryOutput } from "../../schema/CategoryOutput.schema"
import { useTranslations } from "next-intl"
import { IconFromName } from "@/components/icons/iconFromName"

interface CategoryListItemProps extends CategoryOutput {
  onClick: () => void
}

const CategoryListItem = ({
  id,
  titolo,
  // descrizione,
  colore,
  icona,
  onClick,
}: CategoryListItemProps) => {

  const predefinedCategories = ["Salute", "Lavoro", "Sport"]
  // const predefinedCategoriesDescription = [
  //   "Tutto ciò che riguarda la tua salute fisica, come bere di più  o mangiare meglio", 
  //   "Tutto ciò che riguarda il lavoro, come completare n tasks", 
  //   "Tutto ciò che riguarda lo sport"
  // ]

  const t = useTranslations("CategoryListPage")

  const displayTitle = predefinedCategories.includes(titolo)
    ? t(`PredefinedCategories.${titolo}`) // cerca la traduzione usando la chiave esatta della categoria
    : titolo

  // const displayDesc = predefinedCategoriesDescription.includes(descrizione)
  //   ? t(`PredefinedCategories.${descrizione}`) // cerca la traduzione usando la chiave esatta della categoria
  //   : descrizione


  return (
    <li
      id={`${id}`}
      style={{ backgroundColor: colore }}
      className="flex min-w-sm items-center space-x-4 rounded-md p-4 shadow-sm text-white cursor-pointer"
      onClick={onClick}
    >
      <div>
        <IconFromName iconName={icona} />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{displayTitle}</h3>
        {/* <p className="text-sm opacity-80">{displayDesc}</p> */}
      </div>
    </li>
  )
}

export default CategoryListItem
