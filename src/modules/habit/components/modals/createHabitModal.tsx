/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react" // icona X importata

import getCategories from "@/modules/category/api/getCategories"
import { CategoryOutput } from "@/modules/category/schema/CategoryOutput.schema"
import { IconFromName } from "@/components/icons/iconFromName"
import createHabit from "../../api/createHabit"
import { HabitInputClientSchema } from "../../schema/HabitsInput.schema"

interface FormData {
  categoriaId: number | null
  titolo: string
  descrizione: string
  startDate: string
  endDate: string
  color: string
  priority: "BASSA" | "MEDIA" | "ALTA" | ""
  isActive: boolean
  visibility: "public" | "private"
  targetValue: number | null
}

type CreateHabitModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onHabitCreated: () => void
}

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  open,
  onOpenChange,
  onHabitCreated,
}) => {
  const t = useTranslations("CreateHabitModal")

  const [categories, setCategories] = useState<CategoryOutput[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    categoriaId: null,
    titolo: "",
    descrizione: "",
    startDate: "",
    endDate: "",
    color: "#1E90FF",
    priority: "",
    isActive: true,
    visibility: "private",
    targetValue: null,
  })

  // Stato per messaggi generali (non specifici per campo)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"error" | "success" | null>(null)

  // Stato per singoli errori di campo
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({})

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      // Reset stato quando modale si chiude
      setMessage(null)
      setMessageType(null)
      setFieldErrors({})
      setSubmitting(false)
      return
    }

    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await getCategories()
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        setMessage(t("error-categories"))
        setMessageType("error")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()

    setFormData({
      categoriaId: null,
      titolo: "",
      descrizione: "",
      startDate: "",
      endDate: "",
      color: "#1E90FF",
      priority: "",
      isActive: true,
      visibility: "private",
      targetValue: null,
    })
    setMessage(null)
    setMessageType(null)
    setFieldErrors({})
    setSubmitting(false)
  }, [open, t])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setMessage(null)
    setMessageType(null)
    setFieldErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setMessageType(null)
    setFieldErrors({})
    setSubmitting(true)

    // Preprocess per validazione (endDate null se stringa vuota)
    const dataToValidate = {
      ...formData,
      endDate: formData.endDate === "" ? null : formData.endDate,
    }

    const validateData = HabitInputClientSchema.safeParse(dataToValidate)

    if (!validateData.success) {
      // Mappa gli errori per campo
      const errors = validateData.error.formErrors.fieldErrors
      const newErrors: Record<string, string> = {}

      Object.entries(errors).forEach(([field, msgs]) => {
        if (msgs && msgs.length > 0) {
          newErrors[field] = msgs.join(", ")
        }
      })

      setFieldErrors(newErrors)
      setMessage(t("error-validation", { errorMessages: "Correggere i campi evidenziati" }))
      setMessageType("error")
      setSubmitting(false)
      return
    }

    try {
      const response = await createHabit(validateData.data)

      if (!response || response.success === false) {
        setMessage(t("error-create-habit"))
        setMessageType("error")
        setSubmitting(false)
        return
      }

      setMessage(t("success-message"))
      setMessageType("success")

      await onHabitCreated()
      onOpenChange(false)
    } catch (error) {
      setMessage(t("error-generic"))
      setMessageType("error")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90%] overflow-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-foreground">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titolo */}
          <div className="space-y-2">
            <Label htmlFor="titolo" className="text-foreground">
              {t("label-title")}
            </Label>
            <Input
              id="titolo"
              value={formData.titolo}
              onChange={(e) => handleInputChange("titolo", e.target.value)}
              placeholder={t("placeholder-title")}
              required
              disabled={submitting}
              aria-invalid={fieldErrors.titolo ? "true" : "false"}
              aria-describedby={fieldErrors.titolo ? "titolo-error" : undefined}
            />
            {fieldErrors.titolo && (
              <p id="titolo-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.titolo}
              </p>
            )}
          </div>

          {/* Descrizione */}
          <div className="space-y-2">
            <Label htmlFor="descrizione" className="text-foreground">
              {t("label-description")}
            </Label>
            <Textarea
              id="descrizione"
              value={formData.descrizione}
              onChange={(e) => handleInputChange("descrizione", e.target.value)}
              placeholder={t("placeholder-description")}
              rows={3}
              disabled={submitting}
              aria-invalid={fieldErrors.descrizione ? "true" : "false"}
              aria-describedby={fieldErrors.descrizione ? "descrizione-error" : undefined}
            />
            {fieldErrors.descrizione && (
              <p id="descrizione-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.descrizione}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground">
                {t("label-start-date")}
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
                disabled={submitting}
                className="text-muted-foreground"
                aria-invalid={fieldErrors.startDate ? "true" : "false"}
                aria-describedby={fieldErrors.startDate ? "startDate-error" : undefined}
              />
              {fieldErrors.startDate && (
                <p id="startDate-error" className="mt-1 text-sm text-red-600">
                  {fieldErrors.startDate}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-foreground">
                {t("label-end-date")}
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                disabled={submitting}
                className="text-muted-foreground"
                aria-invalid={fieldErrors.endDate ? "true" : "false"}
                aria-describedby={fieldErrors.endDate ? "endDate-error" : undefined}
              />
              {fieldErrors.endDate && (
                <p id="endDate-error" className="mt-1 text-sm text-red-600">
                  {fieldErrors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Categoria e colore */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-foreground">
                {t("label-category")}
              </Label>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">{t("category-loading")}</span>
                </div>
              ) : (
                <>
                  <Select
                    value={formData.categoriaId?.toString() || ""}
                    onValueChange={(value) => handleInputChange("categoriaId", Number.parseInt(value))}
                    disabled={submitting}
                    aria-invalid={fieldErrors.categoriaId ? "true" : "false"}
                    aria-describedby={fieldErrors.categoriaId ? "categoria-error" : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("category-loading-placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center gap-2">
                            {category.icona && <IconFromName iconName={category.icona} />}
                            <span>{category.titolo}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.categoriaId && (
                    <p id="categoria-error" className="mt-1 text-sm text-red-600">
                      {fieldErrors.categoriaId}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Colore */}
            <div className="space-y-2">
              <Label htmlFor="color" className="text-foreground">
                {t("color-label")}
              </Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className="w-16 h-10 p-1 border rounded cursor-pointer"
                  disabled={submitting}
                  aria-invalid={fieldErrors.color ? "true" : "false"}
                  aria-describedby={fieldErrors.color ? "color-error" : undefined}
                />
                <span className="text-sm text-muted-foreground">{formData.color}</span>
              </div>
              {fieldErrors.color && (
                <p id="color-error" className="mt-1 text-sm text-red-600">
                  {fieldErrors.color}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-foreground">
                {t("priority-label")}
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
                disabled={submitting}
                aria-invalid={fieldErrors.priority ? "true" : "false"}
                aria-describedby={fieldErrors.priority ? "priority-error" : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("priority-placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASSA">{t("priority-low")}</SelectItem>
                  <SelectItem value="MEDIA">{t("priority-medium")}</SelectItem>
                  <SelectItem value="ALTA">{t("priority-high")}</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.priority && (
                <p id="priority-error" className="mt-1 text-sm text-red-600">
                  {fieldErrors.priority}
                </p>
              )}
            </div>

            {/* Target Value */}
            <div className="space-y-2">
              <Label htmlFor="targetValue" className="text-foreground">
                {t("target-label")}
              </Label>
              <Input
                id="targetValue"
                type="number"
                value={formData.targetValue || ""}
                onChange={(e) =>
                  handleInputChange(
                    "targetValue",
                    e.target.value ? Number.parseFloat(e.target.value) : null
                  )
                }
                placeholder={t("target-placeholder")}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={submitting}
                aria-invalid={fieldErrors.targetValue ? "true" : "false"}
                aria-describedby={fieldErrors.targetValue ? "targetValue-error" : undefined}
              />
              {fieldErrors.targetValue && (
                <p id="targetValue-error" className="mt-1 text-sm text-red-600">
                  {fieldErrors.targetValue}
                </p>
              )}
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="visibility" className="text-foreground">
                {t("visibility-label")}
              </Label>
              <div className="text-sm text-muted-foreground">
                {formData.visibility === "public"
                  ? t("visibility-public")
                  : t("visibility-private")}
              </div>
            </div>
            <Switch
              id="visibility"
              checked={formData.visibility === "public"}
              onCheckedChange={(checked) =>
                handleInputChange("visibility", checked ? "public" : "private")
              }
              disabled={submitting}
            />
          </div>

          {/* Is Active Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              disabled={submitting}
            />
            <Label htmlFor="isActive" className="text-foreground">
              {t("active-label")}
            </Label>
          </div>

          {/* Messaggi di errore/successo generali */}
          {/* {message && (
            <div
              className={`mb-4 rounded-md p-3 font-semibold ${
                messageType === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
              role="alert"
            >
              {message}
            </div>
          )} */}

          {/* Bottone Submit */}
          <DialogFooter>
            <Button type="submit" className="w-full cursor-pointer" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("button-loading")}
                </>
              ) : (
                t("button-create")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
