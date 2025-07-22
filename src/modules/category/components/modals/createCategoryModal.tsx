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
import * as z from "zod"
import createCategory from "../../api/createCategory"

const CategoryInputSchema = z.object({
  titolo: z.string().min(1, "Titolo obbligatorio"),
  descrizione: z.string().optional(),
  icona: z.string().optional(),
  colore: z.string().optional(),
})

type CategoryInput = z.infer<typeof CategoryInputSchema>

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

  async function onSubmit(data: CategoryInput) {
    try {
      console.log("Dati inviati al server:", data)
      await createCategory(data)
      reset()
      onOpenChange(false)
      onCategoryCreated()
    } catch (error) {
      console.error("Errore nella creazione della categoria:", error)
      // Puoi aggiungere gestione errori UI qui
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
