/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
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
  const t = useTranslations("HabitDetailsModal")

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

  const formatDateToInput = (dateString: string | null | undefined) => {
    if (!dateString) return ""
    return dateString.split("T")[0] // YYYY-MM-DD
  }

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
        startDate: formatDateToInput(habit.startDate),
        endDate: formatDateToInput(habit.endDate),
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
        setFormError(t("error-invalid-data"))
        return
      }
      const response = await updateHabit(parsed.data, habit?.id)
      if (!response.success) {
        setFormError(response.message || t("error-update"))
        return
      }
      setFormError(null)
      onOpenChange(false)
      onHabitUpdated()
    } catch (error: any) {
      console.error("Update error:", error)
      setFormError(error?.message || t("error-generic"))
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
      console.error("Delete error:", error)
      setFormError(error?.message || t("error-delete"))
    } finally {
      setIsDeleting(false)
    }
  }

  if (!habit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("title")}</DialogTitle>
          {formError && (
            <p className="mb-2 text-sm text-red-600">{formError}</p>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <Input type="hidden" {...register("id")} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="titolo" className="text-foreground">
              {t("label-title")}
            </Label>
            <Input
              id="titolo"
              {...register("titolo")}
              disabled={!isEditing || isSubmitting}
              placeholder={t("placeholder-title")}
              className="text-muted-foreground"
            />
            {typeof errors.titolo?.message === "string" && (
              <p className="text-sm text-red-600">{errors.titolo.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descrizione" className="text-foreground">
              {t("label-description")}
            </Label>
            <Input
              id="descrizione"
              {...register("descrizione")}
              disabled={!isEditing || isSubmitting}
              placeholder={t("placeholder-description")}
              className="text-muted-foreground"
            />
            {typeof errors.descrizione?.message === "string" && (
              <p className="text-sm text-red-600">{errors.descrizione.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="startDate" className="text-foreground">
              {t("label-start-date")}
            </Label>
            <Input
              type="date"
              id="startDate"
              {...register("startDate")}
              disabled={!isEditing || isSubmitting}
              className="text-muted-foreground"
            />
            {typeof errors.startDate?.message === "string" && (
              <p className="text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="endDate" className="text-foreground">
              {t("label-end-date")}
            </Label>
            <Input
              type="date"
              id="endDate"
              {...register("endDate")}
              disabled={!isEditing || isSubmitting}
              className="text-muted-foreground"
            />
            {typeof errors.endDate?.message === "string" && (
              <p className="text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>

          {/* Categoria e colore */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoriaId" className="text-foreground">
                {t("label-category")}
              </Label>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {t("category-loading")}
                  </span>
                </div>
              ) : (
                <Select
                  value={watch("categoriaId")?.toString() || ""}
                  onValueChange={(value) =>
                    setValue("categoriaId", Number(value), { shouldValidate: true })
                  }
                  disabled={!isEditing || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("category-placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          {category.icona && <IconFromName iconName={category.icona} />}
                          <span className="text-muted-foreground">{category.titolo}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>
              )}
            {typeof errors.categoriaId?.message === "string" && (
              <p className="text-sm text-red-600">{errors.categoriaId.message}</p>
            )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-foreground">
                {t("color-label")}
              </Label>
              <div className="flex items-center space-x-3">
                <Input
                  type="color"
                  id="color"
                  {...register("color")}
                  disabled={!isEditing || isSubmitting}
                  className="w-1/3 p-0 cursor-pointer"
                  aria-label={t("color-label")}
                />
                <span className="text-sm text-muted-foreground">{watch("color")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">{t("priority-label")}</Label>
              <Select
                value={watch("priority") || ""}
                onValueChange={(value) =>
                  setValue("priority", value as any, { shouldValidate: true })
                }
                disabled={!isEditing || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("priority-placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASSA">
                    <span className="text-muted-foreground">{t("priority-low")}</span>
                  </SelectItem>
                  <SelectItem value="MEDIA">
                    <span className="text-muted-foreground">{t("priority-medium")}</span>
                  </SelectItem>
                  <SelectItem value="ALTA">
                    <span className="text-muted-foreground">{t("priority-high")}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {typeof errors.priority?.message === "string" && (
                <p className="text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="visibility" className="text-foreground">
                  {t("visibility-label")}
                </Label>
                <div className="text-sm text-muted-foreground">
                  {watch("visibility") === "public" ? t("visibility-public") : t("visibility-private")}
                </div>
              </div>
              <Switch
                id="visibility"
                checked={watch("visibility") === "public"}
                onCheckedChange={(checked) => setValue("visibility", checked ? "public" : "private")}
                disabled={!isEditing || isSubmitting}
                className="cursor-pointer"
                aria-label={t("visibility-label")}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              disabled={!isEditing || isSubmitting}
              className="cursor-pointer"
              aria-label={t("active-label")}
            />
            <Label htmlFor="isActive" className="text-foreground">
              {t("active-label")}
            </Label>
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="flex-1"></div>
            <div className="flex flex-wrap gap-2 sm:gap-4 sm:flex-nowrap">
              {isEditing ? (
                <>
                  <Button type="submit" disabled={isSubmitting || isDeleting} className="cursor-pointer">
                    {t("button-save")}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting || isDeleting}
                    className="cursor-pointer text-foreground"
                  >
                    {t("button-cancel")}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={isSubmitting || isDeleting}
                  className="cursor-pointer"
                >
                  {t("button-edit")}
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
                    {isDeleting ? t("button-deleting") : t("button-delete")}
                  </Button>

                  {showDeleteConfirm && (
                    <Dialog open={true} onOpenChange={() => setShowDeleteConfirm(false)}>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">{t("delete-confirm-title")}</DialogTitle>
                        </DialogHeader>
                        <p className="mb-4 text-muted-foreground">{t("delete-confirm-desc")}</p>
                        <DialogFooter className="flex justify-end gap-4">
                          <Button
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                            className="cursor-pointer text-foreground"
                          >
                            {t("button-cancel")}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="cursor-pointer"
                          >
                            {isDeleting ? t("button-deleting") : t("button-confirm")}
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
