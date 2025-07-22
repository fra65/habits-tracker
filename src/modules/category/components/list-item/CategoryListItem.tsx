import React from "react"
import { CategoryOutput } from "../../schema/CategoryOutput.schema"

interface CategoryListItemProps extends CategoryOutput {
  onClick: () => void
}

const CategoryListItem = ({
  id,
  titolo,
  descrizione,
  colore,
  icona,
  onClick,
}: CategoryListItemProps) => {
  return (
    <li
      id={`${id}`}
      style={{ backgroundColor: colore }}
      className="flex items-center space-x-4 rounded-md p-4 shadow-sm text-white cursor-pointer"
      onClick={onClick}
    >
      <div>{icona}</div>
      <div>
        <h3 className="text-lg font-semibold">{titolo}</h3>
        <p className="text-sm opacity-80">{descrizione}</p>
      </div>
    </li>
  )
}

export default CategoryListItem
