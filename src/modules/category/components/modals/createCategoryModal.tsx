/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
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
  } = useForm<CategoryInput>({
    resolver: zodResolver(CategoryInputSchema),
  })

  const [formError, setFormError] = React.useState<string | null>(null);

  async function onSubmit(data: CategoryInput) {
    setFormError(null);
    try {

      const validateData = CategoryInputSchema.safeParse(data)

      if(!validateData.success) {
        setFormError("Dati non corretti")
        return
      }

      const response = await createCategory(validateData.data);
      if (!response.success) {
        // Mostra sempre il messaggio esatto restituito dal backend
        setFormError(response.message ?? "Errore durante la creazione. Riprova più tardi.");
        return; // Non chiudere il modal
      }
      reset();
      setFormError(null);
      onOpenChange(false);
      onCategoryCreated();
    } catch (error: any) {
      // Mostra il messaggio di errore del backend se disponibile
      setFormError(error?.response?.data?.message ?? "Errore durante la creazione. Riprova più tardi.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <p className="mb-2 text-sm text-red-600">{formError}</p>
          )}
          <div>
            <Label htmlFor="titolo">Titolo *</Label>
            <Input id="titolo" {...register("titolo")} />
            {errors.titolo && (
              <p className="text-sm text-red-600">{errors.titolo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="descrizione">Descrizione</Label>
            <Input id="descrizione" {...register("descrizione")} />
          </div>
          <div>
            <Label htmlFor="icona">Icona</Label>
            <Input id="icona" {...register("icona")} />
          </div>
          <div>
            <Label htmlFor="colore">Colore</Label>
            <Input id="colore" type="color" {...register("colore")} />
          </div>

            <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salva"}
            </Button>
            <Button
                variant="ghost"
                onClick={() => {
                reset()
                onOpenChange(false)
                }}
            >
                Annulla
            </Button>
            </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
