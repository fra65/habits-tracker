/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { CategoryOutput } from "../../schema/CategoryOutput.schema"

const CategoryListItem = ({
  id,
  titolo,
  descrizione,
  colore,
  icona

}: CategoryOutput) => {
  return (
    <li
        id={`${id}`}
        style={{ backgroundColor: colore }}
        className={`flex items-center space-x-4 rounded-md p-4 shadow-sm text-white`}
    >
      
      <div className="">
        {icona}
      </div>

      <div>
        <h3 className="text-lg font-semibold">{titolo}</h3>
        <p className="text-sm opacity-80">{descrizione}</p>

      </div>
    </li>
  )
}

export default CategoryListItem
