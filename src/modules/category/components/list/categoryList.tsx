'use client'

import React, { useEffect, useState } from "react"
import CategoryListItem from "../list-item/CategoryListItem"
import getCategories from "../../api/getCategories"
import { CategoryOutput } from "../../schema/CategoryOutput.schema"
import CategoryListSkeleton from "../skeleton/CategoryListSkeleton"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { CategoryModal } from "../modals/createCategoryModal"
import { CategoryDetailsModal } from "../modals/categoryDetailsModal"

const CategoryList = () => {
  const [categories, setCategories] = useState<CategoryOutput[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryOutput | null>(null)

  const t = useTranslations("CategoryListPage")

  async function fetchCategories() {
    setLoading(true)
    const data = await getCategories()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function handleCategoryCreated() {
    fetchCategories()
  }

  function handleCategoryUpdated() {
    fetchCategories()
  }

  function handleCategoryDeleted() {
    fetchCategories()
  }

  function openDetailsModal(category: CategoryOutput) {
    setSelectedCategory(category)
    setDetailsModalOpen(true)
  }

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
            id={category.id}
            icona={category.icona}
            onClick={() => openDetailsModal(category)} // Aggiungi la callback onClick
          />
        ))}
      </ul>

      <div className="mt-4">
        <Button onClick={() => setCreateModalOpen(true)}>{t("Buttons.b-new")}</Button>
      </div>

      {/* Modale crea nuova categoria */}
      <CategoryModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCategoryCreated={() => {
          handleCategoryCreated()
          setCreateModalOpen(false)
        }}
      />

      {/* Modale dettagli/modifica categoria */}
      <CategoryDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        category={selectedCategory}
        onCategoryUpdated={() => {
          handleCategoryUpdated()
          setDetailsModalOpen(false)
        }}
        onCategoryDeleted={() => {
          handleCategoryDeleted()
          setDetailsModalOpen(false)
        }}
      />
    </div>
  )
}

export default CategoryList
