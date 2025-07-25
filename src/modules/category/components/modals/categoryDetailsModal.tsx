/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CategoryOutput } from "../../schema/CategoryOutput.schema"
import deleteCategory from "../../api/deleteCategory"
import updateCategory from "../../api/updateCategory"
import { CategoryInputSchema } from "../../schema/CategoryInput.schema"
import { CategoryUpdateInput, CategoryUpdateInputSchema } from "../../schema/CategoryUpdateInput.schema"

import { useTranslations } from "next-intl"

import { iconMap } from "@/utils/icons/iconMap"
import { IconFromName } from "@/components/icons/iconFromName"

const ICONS_PER_ROW = 5

export function CategoryDetailsModal({
  open,
  onOpenChange,
  category,
  onCategoryUpdated,
  onCategoryDeleted,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryOutput | null
  onCategoryUpdated: () => void
  onCategoryDeleted: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAllIcons, setShowAllIcons] = useState(false)

  const t = useTranslations("CategoryModals")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CategoryUpdateInput>({
    resolver: zodResolver(CategoryUpdateInputSchema),
    defaultValues: {
      id: category?.id,
      titolo: category?.titolo,
      descrizione: category?.descrizione,
      icona: category?.icona,
      colore: category?.colore,
    },
  })

  useEffect(() => {
    if (open && category) {
      reset({
        id: category.id,
        titolo: category.titolo,
        descrizione: category.descrizione,
        icona: category.icona,
        colore: category.colore,
      })
      setIsEditing(false)
      setFormError(null)
      setShowDeleteConfirm(false)
      // non resettare showAllIcons all’apertura
    } else if (!open) {
      reset()
      setIsEditing(false)
      setIsDeleting(false)
      setFormError(null)
      setShowDeleteConfirm(false)
      setShowAllIcons(false) // reset solo alla chiusura
    }
  }, [open, category, reset])

  async function handleUpdate(data: CategoryUpdateInput) {
    try {
      const validateData = CategoryInputSchema.safeParse(data)

      if (!validateData.success) {
        setFormError(t("cdm-error-invalid"))
        return
      }

      const response = await updateCategory(validateData.data, category?.id)

      if (!response.success) {
        setFormError(response.message || t("cdm-error-update"))
        return
      }
      setFormError(null)
      onOpenChange(false)
      onCategoryUpdated()
    } catch (error: any) {
      console.error(t("cdm-error-update"), error)
      setFormError(error?.message || t("cdm-error-update"))
    }
  }

  async function handleDelete() {
    if (!category?.id || isDeleting) return

    setFormError(null)
    setIsDeleting(true)
    try {
      await deleteCategory(category.id)
      setShowDeleteConfirm(false)
      onOpenChange(false)
      onCategoryDeleted()
    } catch (error: any) {
      console.error(t("cdm-error-delete"), error)
      setFormError(error?.message || t("cdm-error-delete"))
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) return null

  const iconNames = Object.keys(iconMap)
  const iconRows: string[][] = []
  for (let i = 0; i < iconNames.length; i += ICONS_PER_ROW) {
    iconRows.push(iconNames.slice(i, i + ICONS_PER_ROW))
  }

  const rowsToShow = showAllIcons ? iconRows.length : 1
  const selectedIcon = watch("icona")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("cdm-title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Input type="hidden" {...register("id")} />

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground" htmlFor="titolo">{t("ccm-cdm-title-label")}</Label>
            <Input
              id="titolo"
              {...register("titolo")}
              disabled={!isEditing || isSubmitting}
              className="text-muted-foreground" 
            />
            {errors.titolo && (
              <p className="text-sm text-red-600">{errors.titolo.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground" htmlFor="descrizione">{t("ccm-cdm-description-label")}</Label>
            <Input
              id="descrizione"
              {...register("descrizione")}
              disabled={!isEditing || isSubmitting}
              className="text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">{t("ccm-cdm-icon-label")}</Label>

            <div className="space-y-2">
              {iconRows.slice(0, rowsToShow).map((row, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4">
                  {row.map((iconName) => {
                    const isSelected = selectedIcon === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setValue("icona", iconName, { shouldValidate: true })}
                        disabled={!isEditing || isSubmitting || isDeleting}
                        className={`flex flex-col items-center justify-center cursor-pointer rounded-md p-2 border ${
                          isSelected
                            ? "border-blue-600 bg-blue-100"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        aria-label={`Select icon ${iconName}`}
                      >
                        <IconFromName
                          iconName={iconName}
                          size={28}
                          color={isSelected ? "#2563eb" : "#6b7280"}
                        />
                        {/* <span className="text-xs mt-1 select-none">{iconName}</span> */}
                      </button>
                    )
                  })}
                </div>
              ))}
              {iconRows.length > 1 && isEditing &&(
                
                  <button
                    type="button"
                    onClick={() => setShowAllIcons(!showAllIcons)}
                    className="text-sm text-blue-600 hover:underline mt-1"
                    disabled={!isEditing || isSubmitting || isDeleting}
                  >
                    {
                      showAllIcons 
                        ? t("ccm-cdm-icon-collapse") 
                        : t("ccm-cdm-icon-expand")
                    }
                  </button>
              )}
            </div>

            {errors.icona && (
              <p className="text-sm text-red-600 mt-1">{errors.icona.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Label htmlFor="colore" className="text-foreground cursor-pointer">
              {t("ccm-cdm-color-label")}
            </Label>
            <Input
              id="colore"
              type="color"
              {...register("colore")}
              disabled={isSubmitting}
              className="w-1/3 p-0 "
            />
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="flex-1">
              {formError && (
                <p className="mb-2 text-sm text-red-600">{formError}</p>
              )}
            </div>

            {(category.titolo !== "Salute") &&
             (category.titolo !== "Lavoro") &&
             (category.titolo !== "Sport") && (
              <div className="flex flex-wrap gap-2 sm:gap-4 sm:flex-nowrap">
                {isEditing ? (
                  <>
                    <Button type="submit" disabled={isSubmitting || isDeleting} className="cursor-pointer">
                      {isSubmitting ? t("cdm-saving") : t("cdm-save")}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting || isDeleting}
                      className="cursor-pointer text-foreground"
                    >
                      {t("cdm-cancel-edit")}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={isDeleting || isSubmitting}
                    className="cursor-pointer" 
                  >
                    {t("cdm-edit")}
                  </Button>
                )}

                {!isEditing && (
                  <>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSubmitting || isDeleting}
                      className="cursor-pointer" 
                    >
                      {isDeleting ? t("cdm-deleting") : t("cdm-delete")}
                    </Button>

                    {showDeleteConfirm && (
                      <Dialog open={true} onOpenChange={() => setShowDeleteConfirm(false)}>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">{t("cdm-confirm-delete-title")}</DialogTitle>
                          </DialogHeader>
                          <p className="mb-4 text-muted-foreground">{t("cdm-confirm-delete-desc")}</p>
                          <DialogFooter className="flex justify-end gap-4">
                            <Button
                              variant="ghost"
                              onClick={() => setShowDeleteConfirm(false)}
                              disabled={isDeleting}
                              className="text-foreground cursor-pointer"
                            >
                              {t("cdm-cancel")}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="cursor-pointer"
                            >
                              {isDeleting ? t("cdm-deleting") : t("cdm-confirm")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </>
                )}
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
