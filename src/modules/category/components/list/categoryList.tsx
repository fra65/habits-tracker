'use client'

import React, { useEffect, useState } from "react"
import CategoryListItem from "../list-item/CategoryListItem"
import getCategories from "../../api/getCategories"
import { CategoryOutput } from "../../schema/CategoryOutput.schema"
import CategoryListSkeleton from "../skeleton/CategoryListSkeleton"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

const CategoryList = () => {

  const [categories, setCategories] = useState<CategoryOutput[] | null>(null)
  const [loading, setLoading] = useState(true)

  const t = useTranslations("CategoryListPage")

  useEffect(() => {

    async function fetchCategories() {

      setLoading(true)
      const data = await getCategories()
      setCategories(data)
      setLoading(false)

    }

    fetchCategories()

  }, [])

  if (loading) {
    return (
      <div className="p-4">
        <CategoryListSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
        <ul className="space-y-3">
          {categories?.map((category) => (
            <CategoryListItem
              key={category.id}
              titolo={category.titolo}
              descrizione={category.descrizione}
              colore={category.colore} 
              id={0}
              icona={category.icona}          
            />
          ))}
        </ul>

        <div className="">
          <Button>{t("Buttons.b-new")}</Button>
        </div>
    </div>
  )
}

export default CategoryList
