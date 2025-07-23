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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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
    } else if (!open) {
      reset()
      setIsEditing(false)
      setIsDeleting(false)
      setFormError(null)
    }
  }, [open, category, reset])

  async function handleUpdate(data: CategoryUpdateInput) {
    try {

      const validateData = CategoryInputSchema.safeParse(data)

      if(!validateData.success) {
        setFormError("Dati non corretti")
        return
      }

      const response = await updateCategory(validateData.data, category?.id)

      if (!response.success) {
        setFormError(response.message || "Errore durante l'aggiornamento. Riprova più tardi.")
        return // Non chiudere il modal
      }
      setFormError(null) // Reset errore solo se update ok
      onOpenChange(false)
      onCategoryUpdated()
    } catch (error: any) {
      console.error("Errore nell'aggiornamento della categoria:", error)
      setFormError(
        error?.message || "Errore durante l'aggiornamento. Riprova più tardi."
      )
    }
  }

  async function handleDelete() {
    if (!category?.id || isDeleting) return

    setFormError(null)
    setIsDeleting(true)
    try {
      console.log("Eliminazione categoria con ID:", category.id)
      await deleteCategory(category.id)
      onOpenChange(false)
      onCategoryDeleted()
    } catch (error: any) {
      console.error("Errore nell'eliminazione della categoria:", error)
      setFormError(
        error?.message || "Errore durante l'eliminazione. Riprova più tardi."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Dettagli Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Input type="hidden" {...register("id")} />

          <div>
            <Label htmlFor="titolo">Titolo *</Label>
            <Input
              id="titolo"
              {...register("titolo")}
              disabled={!isEditing || isSubmitting}
            />
            {errors.titolo && (
              <p className="text-sm text-red-600">{errors.titolo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="descrizione">Descrizione</Label>
            <Input
              id="descrizione"
              {...register("descrizione")}
              disabled={!isEditing || isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="icona">Icona</Label>
            <Input
              id="icona"
              {...register("icona")}
              disabled={!isEditing || isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="colore">Colore</Label>
            <Input
              id="colore"
              type="color"
              {...register("colore")}
              disabled={!isEditing || isSubmitting}
            />
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="flex-1">
              {formError && (
                <p className="mb-2 text-sm text-red-600">{formError}</p>
              )}
            
            </div>

            {
              (category.titolo !== "Salute") && (category.titolo !== "Lavoro") && (category.titolo !== "Sport")

              &&

                <div className="flex flex-wrap gap-2 sm:gap-4 sm:flex-nowrap">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={isSubmitting || isDeleting}>
                        {isSubmitting ? "Salvando..." : "Salva Modifiche"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting || isDeleting}
                      >
                        Annulla Modifica
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      disabled={isDeleting || isSubmitting}
                    >
                      Modifica
                    </Button>
                  )}

                  {!isEditing && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Sei sicuro di voler eliminare questa categoria?"
                          )
                        ) {
                          handleDelete()
                        }
                      }}
                      disabled={isSubmitting || isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "Elimina"}
                    </Button>
                  )}

                  {/* <Button
                    variant="ghost"
                    onClick={() => {
                      onOpenChange(false)
                      setIsEditing(false)
                      setIsDeleting(false)
                      setFormError(null)
                    }}
                  >
                    Chiudi
                  </Button> */}
                </div>

            }
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
