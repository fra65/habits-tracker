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
import { HabitInputClientSchema } from "../../schema/HabitsInput.schema"
import updateHabit from "../../api/updateHabit"
import deleteHabit from "../../api/deleteHabit"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema"
import getCategories from "@/modules/category/api/getCategories"
import { IconFromName } from "@/components/icons/iconFromName"
import { Loader2 } from "lucide-react"
import { HabitUpdateInputClient, HabitUpdateInputClientSchema } from "../../schema/HabitUpdateInput.schema"

type HabitDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  habit: HabitCategoryOutput | null
  onHabitUpdated: () => void
  onHabitDeleted: () => void
}

export function HabitDetailsModal({
  open,
  onOpenChange,
  habit,
  onHabitUpdated,
  onHabitDeleted,
}: HabitDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(HabitInputClientSchema),
    defaultValues: {
      categoriaId: habit?.categoriaId || null,
      titolo: habit?.titolo || "",
      descrizione: habit?.descrizione || "",
      startDate: habit?.startDate || "",
      endDate: habit?.endDate || null,
      color: habit?.color || "#1E90FF",
      priority: habit?.priority || "",
      isActive: habit?.isActive ?? true,
      visibility: habit?.visibility || "private",
      targetValue: habit?.targetValue || null,
    },
  })

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      const data = await getCategories()
      setCategories(data || [])
      setLoading(false)
    }

    if (open && habit) {
      reset({
        categoriaId: habit.categoriaId,
        titolo: habit.titolo,
        descrizione: habit.descrizione,
        startDate: habit.startDate,
        endDate: habit.endDate,
        color: habit.color,
        priority: habit.priority,
        isActive: habit.isActive,
        visibility: habit.visibility,
        targetValue: habit.targetValue,
      })
      setIsEditing(false)
      setFormError(null)
      setShowDeleteConfirm(false)
    } else if (!open) {
      reset()
      setIsEditing(false)
      setIsDeleting(false)
      setFormError(null)
      setShowDeleteConfirm(false)
    }


    fetchCategories()
  }, [open, habit, reset])

  async function handleUpdate(data: HabitUpdateInputClient) {
    try {
      const parsed = HabitUpdateInputClientSchema.safeParse(data)
      if (!parsed.success) {
        setFormError("Dati non validi.")
        return
      }
      const response = await updateHabit(parsed.data, habit?.id)
      if (!response.success) {
        setFormError(response.message || "Errore nell'aggiornamento")
        return
      }
      setFormError(null)
      onOpenChange(false)
      onHabitUpdated()
    } catch (error: any) {
      console.error("Errore nell'aggiornamento:", error)
      setFormError(error?.message || "Errore generico")
    }
  }

  async function handleDelete() {
    if (!habit?.id || isDeleting) return
    setFormError(null)
    setIsDeleting(true)
    try {
      await deleteHabit(habit?.id)
      setShowDeleteConfirm(false)
      onOpenChange(false)
      onHabitDeleted()
    } catch (error: any) {
      console.error("Errore durante l'eliminazione:", error)
      setFormError(error?.message || "Errore durante l'eliminazione")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!habit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Dettagli Obiettivo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Input type="hidden" {...register("id")} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="titolo">Titolo</Label>
            <Input id="titolo" {...register("titolo")} disabled={!isEditing || isSubmitting} />
            {errors.titolo && <p className="text-sm text-red-600">ERROREEEEEEEEEEEEE</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descrizione">Descrizione</Label>
            <Input id="descrizione" {...register("descrizione")} disabled={!isEditing || isSubmitting} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="startDate">Data Inizio</Label>
            <Input type="date" id="startDate" {...register("startDate")} disabled={!isEditing || isSubmitting} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="endDate">Data Fine</Label>
            <Input type="date" id="endDate" {...register("endDate")} disabled={!isEditing || isSubmitting} />
          </div>

            {/* Categoria e colore */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoriaId">Categoria *</Label>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Caricamento categorie...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={watch("categoriaId")?.toString() || ""}
                    onValueChange={(value) => setValue("categoriaId", Number(value), { shouldValidate: true })}
                    disabled={!isEditing || isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center gap-2">
                            {/* Mostra icona se disponibile */}
                            {category.icona && <IconFromName iconName={category.icona} />}
                            <span>{category.titolo}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Colore */}
              <div className="space-y-2">
                <Label htmlFor="color">Colore abitudine</Label>
                <div className="flex items-center space-x-3">
                    <Input type="color" id="color" {...register("color")} disabled={!isEditing || isSubmitting} className="w-1/3 p-0" />
                </div>
              </div>
            </div>

          {/* <div className="flex flex-col gap-2">
            <Label htmlFor="color">Colore</Label>
            <Input type="color" id="color" {...register("color")} disabled={!isEditing || isSubmitting} className="w-1/3 p-0" />
          </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <div className="flex flex-col gap-2">
            <Label>Priorità</Label>
            <Select
              value={watch("priority") || ""}
              onValueChange={(value) => setValue("priority", value as any, { shouldValidate: true })}
              disabled={!isEditing || isSubmitting}
            >
              <SelectTrigger><SelectValue placeholder="Seleziona priorità" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BASSA">Bassa</SelectItem>
                <SelectItem value="MEDIA">Media</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

            <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label htmlFor="visibility">Visibilità</Label>
                <div className="text-sm text-muted-foreground">
                {/* {value === "public" ? "Pubblico" : "Privato"} */}
                </div>
            </div>
            <Switch
                id="visibility"
                checked={watch("visibility") === "public"}
                onCheckedChange={(checked) => setValue("visibility", checked ? "public" : "private")}
                disabled={!isEditing || isSubmitting}
                
            />
            </div>

        </div>

          {/* <div className="flex flex-col gap-2">
            <Label>Visibilità</Label>
            <Switch
              checked={watch("visibility") === "public"}
              onCheckedChange={(checked) => setValue("visibility", checked ? "public" : "private")}
              disabled={!isEditing || isSubmitting}
            />
          </div> */}

          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" checked={watch("isActive")} onCheckedChange={(checked) => setValue("isActive", checked)} disabled={!isEditing || isSubmitting} />
            <Label htmlFor="isActive">Obiettivo attivo</Label>
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="flex-1">
              {formError && <p className="mb-2 text-sm text-red-600">{formError}</p>}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 sm:flex-nowrap">
              {isEditing ? (
                <>
                  <Button type="submit" disabled={isSubmitting || isDeleting}>Salva</Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSubmitting || isDeleting}>Annulla</Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)} disabled={isSubmitting || isDeleting}>Modifica</Button>
              )}

              {!isEditing && (
                <>
                  <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isSubmitting || isDeleting}>
                    {isDeleting ? "Eliminazione..." : "Elimina"}
                  </Button>

                  {showDeleteConfirm && (
                    <Dialog open={true} onOpenChange={() => setShowDeleteConfirm(false)}>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Conferma eliminazione</DialogTitle>
                        </DialogHeader>
                        <p className="mb-4">Sei sicuro di voler eliminare questo obiettivo?</p>
                        <DialogFooter className="flex justify-end gap-4">
                          <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>Annulla</Button>
                          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Eliminazione..." : "Conferma"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
