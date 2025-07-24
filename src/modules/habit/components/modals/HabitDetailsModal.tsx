"use client"

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
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema"
// import deleteHabit from "../../api/deleteHabit"
// import updateHabit from "../../api/updateHabit"
import { useTranslations } from "next-intl"

import { iconMap } from "@/utils/icons/iconMap"
import { IconFromName } from "@/components/icons/iconFromName"
import { HabitUpdateInput, HabitUpdateInputClientSchema } from "../../schema/HabitUpdateInput.schema"

const ICONS_PER_ROW = 5

interface HabitDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habit: HabitCategoryOutput | null
  onHabitUpdated: () => void
  onHabitDeleted: () => void
}

// Assumi che esistano questi schemi (da definire analoghi a quelli category)
// HabitUpdateInpu

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
  const [showAllIcons, setShowAllIcons] = useState(false)

  const t = useTranslations("HabitModals")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<HabitUpdateInput>({
    resolver: zodResolver(HabitUpdateInputClientSchema),
    defaultValues: {
      id: habit?.id,
      titolo: habit?.titolo,
      descrizione: habit?.descrizione,
      icona: habit?.categoria?.icona ?? "Target",
      colore: habit?.color ?? "#1E90FF",
      priority: habit?.priority,
      isActive: habit?.isActive,
      visibility: habit?.visibility ?? "private",
      targetValue: habit?.targetValue ?? null,
      startDate: habit?.startDate, // stringa "YYYY-MM-DD" dall'ISO
      endDate: habit?.endDate ? habit.endDate.split("T")[0] : "",
      categoriaId: habit?.categoriaId ?? undefined,
    },
  })

  useEffect(() => {
    if (open && habit) {
      reset({
        id: habit.id,
        titolo: habit.titolo,
        descrizione: habit.descrizione,
        icona: habit.categoria?.icona ?? "Target",
        colore: habit.color ?? "#1E90FF",
        priority: habit.priority,
        isActive: habit.isActive,
        visibility: habit.visibility ?? "private",
        targetValue: habit.targetValue ?? null,
        startDate: habit.startDate.split("T")[0],
        endDate: habit.endDate ? habit.endDate.split("T")[0] : "",
        categoriaId: habit.categoriaId,
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
      setShowAllIcons(false)
    }
  }, [open, habit, reset])

  async function handleUpdate(data: HabitUpdateInput) {
    try {
      const validateData = HabitUpdateInputSchema.safeParse(data)

      if (!validateData.success) {
        setFormError(t("hdm-error-invalid"))
        return
      }

      // Chiamata API da definire
      // const response = await updateHabit(validateData.data, habit?.id)

      // Simulazione response
      const response = { success: true }

      if (!response.success) {
        setFormError(response.message || t("hdm-error-update"))
        return
      }
      setFormError(null)
      onOpenChange(false)
      onHabitUpdated()
    } catch (error: any) {
      console.error(t("hdm-error-update"), error)
      setFormError(error?.message || t("hdm-error-update"))
    }
  }

  async function handleDelete() {
    if (!habit?.id || isDeleting) return

    setFormError(null)
    setIsDeleting(true)
    try {
      // Chiamata API da definire
      // await deleteHabit(habit.id)

      // Simulazione delay
      await new Promise((res) => setTimeout(res, 500))

      setShowDeleteConfirm(false)
      onOpenChange(false)
      onHabitDeleted()
    } catch (error: any) {
      console.error(t("hdm-error-delete"), error)
      setFormError(error?.message || t("hdm-error-delete"))
    } finally {
      setIsDeleting(false)
    }
  }

  if (!habit) return null

  // Preparazione righe icone
  const iconNames = Object.keys(iconMap)
  const iconRows: string[][] = []
  for (let i = 0; i < iconNames.length; i += ICONS_PER_ROW) {
    iconRows.push(iconNames.slice(i, i + ICONS_PER_ROW))
  }

  const rowsToShow = showAllIcons ? iconRows.length : 1
  const selectedIcon = watch("icona")

  // Opzionale: disabilita la possibilità di eliminare se habit è di certe categorie
  // esempio: bloccare per categorie predefinite
  const categoriaTitolo = habit.categoria?.titolo ?? ""
  const disableDelete =
    categoriaTitolo === "Salute" ||
    categoriaTitolo === "Lavoro" ||
    categoriaTitolo === "Sport"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("hdm-title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Input type="hidden" {...register("id")} />

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground" htmlFor="titolo">
              {t("hdm-title-label")}
            </Label>
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
            <Label className="text-muted-foreground" htmlFor="descrizione">
              {t("hdm-description-label")}
            </Label>
            <Input
              id="descrizione"
              {...register("descrizione")}
              disabled={!isEditing || isSubmitting}
              className="text-muted-foreground"
            />
          </div>

          {/* Puoi aggiungere qui anche campi per startDate, endDate, priority, isActive, visibility, targetValue se vuoi */}

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">{t("hdm-icon-label")}</Label>
            <div className="space-y-2">
              {iconRows.slice(0, rowsToShow).map((row, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4">
                  {row.map((iconName) => {
                    const isSelected = selectedIcon === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() =>
                          setValue("icona", iconName, { shouldValidate: true })
                        }
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
                      </button>
                    )
                  })}
                </div>
              ))}
              {iconRows.length > 1 && isEditing && (
                <button
                  type="button"
                  onClick={() => setShowAllIcons(!showAllIcons)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                  disabled={!isEditing || isSubmitting || isDeleting}
                >
                  {showAllIcons
                    ? t("hdm-icon-collapse")
                    : t("hdm-icon-expand")}
                </button>
              )}
            </div>
            {errors.icona && (
              <p className="text-sm text-red-600 mt-1">{errors.icona.message}</p>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <Label htmlFor="colore" className="text-foreground cursor-pointer">
              {t("hdm-color-label")}
            </Label>
            <Input
              id="colore"
              type="color"
              {...register("colore")}
              disabled={isSubmitting}
              className="w-1/3 p-0"
            />
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="flex-1">
              {formError && (
                <p className="mb-2 text-sm text-red-600">{formError}</p>
              )}
            </div>

            {!disableDelete && (
              <div className="flex flex-wrap gap-2 sm:gap-4 sm:flex-nowrap">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      disabled={isSubmitting || isDeleting}
                      className="cursor-pointer"
                    >
                      {isSubmitting ? t("hdm-saving") : t("hdm-save")}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting || isDeleting}
                      className="cursor-pointer text-foreground"
                    >
                      {t("hdm-cancel-edit")}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={isDeleting || isSubmitting}
                    className="cursor-pointer"
                  >
                    {t("hdm-edit")}
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
                      {isDeleting ? t("hdm-deleting") : t("hdm-delete")}
                    </Button>

                    {showDeleteConfirm && (
                      <Dialog open={true} onOpenChange={() => setShowDeleteConfirm(false)}>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>{t("hdm-confirm-delete-title")}</DialogTitle>
                          </DialogHeader>
                          <p className="mb-4">{t("hdm-confirm-delete-desc")}</p>
                          <DialogFooter className="flex justify-end gap-4">
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(false)}
                              disabled={isDeleting}
                            >
                              {t("hdm-cancel")}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={isDeleting}
                            >
                              {isDeleting ? t("hdm-deleting") : t("hdm-confirm")}
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
