/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react"
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
import createCategory from "../../api/createCategory"
import { CategoryInput, CategoryInputSchema } from "../../schema/CategoryInput.schema"
import { useTranslations } from "next-intl"

// Importa la mappa delle icone
import { iconMap } from "@/utils/icons/iconMap"
import { IconFromName } from "@/components/icons/iconFromName"


const ICONS_PER_ROW = 5


export function CategoryModal({
  open,
  onOpenChange,
  onCategoryCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoryCreated: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CategoryInput>({
    resolver: zodResolver(CategoryInputSchema),
  })


  const [formError, setFormError] = React.useState<string | null>(null)
  const [showAllIcons, setShowAllIcons] = useState(false)


  const t = useTranslations("CategoryModals")


  // Prendi il valore corrente dell'icona dal form (default undefined)
  const selectedIcon = watch("icona")


  async function onSubmit(data: CategoryInput) {
    setFormError(null)
    try {
      const validateData = CategoryInputSchema.safeParse(data)


      if (!validateData.success) {
        setFormError(t("ccm-error-invalid"))
        return
      }


      const response = await createCategory(validateData.data)
      if (!response.success) {
        setFormError(response.message ?? t("ccm-error-create"))
        return
      }
      reset()
      setFormError(null)
      onOpenChange(false)
      onCategoryCreated()
      setShowAllIcons(false)
    } catch (error: any) {
      setFormError(error?.response?.data?.message ?? t("ccm-error-create"))
    }
  }


  // Lista delle icone disponibili, ordinata
  const iconNames = Object.keys(iconMap)


  // Divide le icone in righe da ICONS_PER_ROW
  const iconRows: string[][] = []
  for (let i = 0; i < iconNames.length; i += ICONS_PER_ROW) {
    iconRows.push(iconNames.slice(i, i + ICONS_PER_ROW))
  }


  // Determina quante righe mostrare in base a showAllIcons
  const rowsToShow = showAllIcons ? iconRows.length : 1


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("ccm-title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && <p className="mb-2 text-sm text-red-600">{formError}</p>}

          <div className="flex flex-col gap-2">
            <Label htmlFor="titolo" className="text-foreground">
              {t("ccm-cdm-title-label")}
            </Label>
            <Input
              id="titolo"
              {...register("titolo")}
              disabled={isSubmitting}
              className="pt-1"
            />
            {errors.titolo && (
              <p className="text-sm text-red-600">{errors.titolo.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descrizione" className="text-muted-foreground">
              {t("ccm-cdm-description-label")}
            </Label>
            <Input
              id="descrizione"
              {...register("descrizione")}
              disabled={isSubmitting}
              className="pt-1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-foreground">{t("ccm-cdm-icon-label")}</Label>

            {/* Griglia icone */}
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
                          color={isSelected ? "#2563eb" : "#6b7280"} // blu scuro o grigio
                        />
                        {/* <span className="text-xs mt-1 select-none text-muted-foreground">
                          {iconName}
                        </span> */}
                      </button>
                    )
                  })}
                </div>
              ))}

              {/* Toggle espandi/nascondi */}
              {iconRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowAllIcons(!showAllIcons)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  {showAllIcons
                    ? t("ccm-cdm-icon-collapse")
                    : t("ccm-cdm-icon-expand")}
                </button>
              )}
            </div>

            {/* Errore validazione icona */}
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

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? t("ccm-saving") : t("ccm-save")}
            </Button>
            <Button
              className="text-foreground cursor-pointer"
              variant="ghost"
              onClick={() => {
                reset()
                onOpenChange(false)
                setShowAllIcons(false)
              }}
              disabled={isSubmitting}
            >
              {t("cdm-cancel")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
