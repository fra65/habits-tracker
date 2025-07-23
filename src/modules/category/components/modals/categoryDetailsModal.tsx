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
import * as z from "zod"
import { CategoryOutput } from "../../schema/CategoryOutput.schema" // Assicurati che questo sia corretto
import deleteCategory from "../../api/deleteCategory"
import updateCategory from "../../api/updateCategory"
// import updateCategory from "../../api/updateCategory" // Da creare
// import deleteCategory from "../../api/deleteCategory" // Da creare

// Schema per la modifica (uguale all'input ma potresti avere validazioni diverse)
const CategoryUpdateSchema = z.object({
  id: z.number(), // L'ID è necessario per l'aggiornamento/eliminazione
  titolo: z.string().min(1, "Titolo obbligatorio"),
  descrizione: z.string().optional(),
  icona: z.string().optional(),
  colore: z.string().optional(),
})

type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>

export function CategoryDetailsModal({
  open,
  onOpenChange,
  category, // Categoria da visualizzare/modificare
  onCategoryUpdated, // Callback per refresh lista dopo modifica
  onCategoryDeleted, // Callback per refresh lista dopo eliminazione
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryOutput | null // Può essere null se non c'è una categoria selezionata
  onCategoryUpdated: () => void
  onCategoryDeleted: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // Stato per la conferma eliminazione

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryUpdateInput>({
    resolver: zodResolver(CategoryUpdateSchema),
    defaultValues: {
      id: category?.id, // Imposta i valori iniziali dal prop category
      titolo: category?.titolo,
      descrizione: category?.descrizione,
      icona: category?.icona,
      colore: category?.colore,
    },
  })

  // Aggiorna il form quando la categoria prop cambia o il modale si apre/chiude
  useEffect(() => {
    if (open && category) {
      reset({
        id: category.id,
        titolo: category.titolo,
        descrizione: category.descrizione,
        icona: category.icona,
        colore: category.colore,
      })
      setIsEditing(false) // Resetta la modalità di modifica all'apertura
    } else if (!open) {
      reset() // Resetta il form quando il modale si chiude
      setIsEditing(false)
      setIsDeleting(false) // Resetta lo stato di eliminazione
    }
  }, [open, category, reset])

  async function handleUpdate(data: CategoryUpdateInput) {
    try {
      console.log("Dati inviati per l'aggiornamento:", data)
      await updateCategory(data, category?.id) // Chiama la tua API di aggiornamento
      onOpenChange(false) // Chiudi il modale
      onCategoryUpdated() // Triggera il refresh della lista
    } catch (error) {
      console.error("Errore nell'aggiornamento della categoria:", error)
      // TODO: Gestisci l'errore UI (es. toast)
    }
  }

  async function handleDelete() {
    if (!category?.id || isDeleting) return // Previene doppie chiamate o se ID non c'è

    setIsDeleting(true)
    try {
      console.log("Eliminazione categoria con ID:", category.id)
      await deleteCategory(category.id) // Chiama la tua API di eliminazione
      onOpenChange(false) // Chiudi il modale
      onCategoryDeleted() // Triggera il refresh della lista
    } catch (error) {
      console.error("Errore nell'eliminazione della categoria:", error)
      // TODO: Gestisci l'errore UI
    } finally {
      setIsDeleting(false) // Resetta lo stato di eliminazione
    }
  }

  // Se non c'è una categoria, non mostrare il modale (o gestisci diversamente)
  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Dettagli Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          {/* Campo ID nascosto ma necessario per l'update */}
          <Input type="hidden" {...register("id")} />

          <div>
            <Label htmlFor="titolo">Titolo *</Label>
            <Input id="titolo" {...register("titolo")} disabled={!isEditing || isSubmitting} />
            {errors.titolo && (
              <p className="text-sm text-red-600">{errors.titolo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="descrizione">Descrizione</Label>
            <Input id="descrizione" {...register("descrizione")} disabled={!isEditing || isSubmitting} />
          </div>
          <div>
            <Label htmlFor="icona">Icona</Label>
            <Input id="icona" {...register("icona")} disabled={!isEditing || isSubmitting} />
          </div>
          <div>
            <Label htmlFor="colore">Colore</Label>
            <Input id="colore" type="color" {...register("colore")} disabled={!isEditing || isSubmitting} />
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
            {isEditing ? (
              <>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salva Modifiche"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                  Annulla Modifica
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Modifica
              </Button>
            )}

            {/* Bottone Elimina */}
            {!isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (window.confirm("Sei sicuro di voler eliminare questa categoria?")) {
                    handleDelete()
                  }
                }}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Elimina"}
              </Button>
            )}

            {/* Bottone Chiudi (sempre visibile) */}
            <Button
              variant="ghost"
              onClick={() => {
                onOpenChange(false)
                setIsEditing(false) // Assicurati di resettare lo stato di modifica alla chiusura
                setIsDeleting(false)
              }}
            >
              Chiudi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}