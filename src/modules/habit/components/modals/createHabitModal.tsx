/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Loader2 } from "lucide-react"
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitCreated: () => void;
  // ...altre props se servono
};

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ open, onOpenChange, onHabitCreated }) => {
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

  // Messaggi frontend
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"error" | "success" | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        if (!data) return
        setCategories(data)
      } catch (error) {
        setMessage("Errore nel caricamento delle categorie")
        setMessageType("error")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Resetta messaggi precedenti
    setMessage(null)
    setMessageType(null)

    // Prepara i dati, converti endDate vuoto in null
    const dataToValidate = {
      ...formData,
      endDate: formData.endDate === "" ? null : formData.endDate,
    }

    const validateData = HabitInputClientSchema.safeParse(dataToValidate)

    if (!validateData.success) {
      // Costruisco messaggi di errore leggibili per frontend
      const formattedErrors = validateData.error.format()

      // Estrazione messaggi per mostrare in modo leggibile
      const errorMessages = Object.entries(formattedErrors)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.join(", ")
          }
          if (typeof value === "object" && value?._errors) {
            return value._errors.join(", ")
          }
          return null
        })
        .filter(Boolean)
        .join("; ")

      setMessage(`Errore di validazione: ${errorMessages}`)
      setMessageType("error")
      return
    }

    const response = await createHabit(validateData.data)

    if (!response) {
      setMessage("Errore di invio dati, riprova.")
      setMessageType("error")
      return
    }

    setMessage("Obiettivo creato con successo!")
    setMessageType("success")

    // Se vuoi, resetta il form dopo il successo:
    // setFormData({
    //   categoriaId: null,
    //   titolo: "",
    //   descrizione: "",
    //   startDate: "",
    //   endDate: "",
    //   color: "#1E90FF",
    //   priority: "",
    //   isActive: true,
    //   visibility: "private",
    //   targetValue: null,
    // })
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Resetta messaggi quando si modifica input
    setMessage(null)
    setMessageType(null)
  }

  return (
    <div className="w-full h-full mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Crea Nuovo Obiettivo</CardTitle>
          <CardDescription>
            Compila i campi per creare un nuovo obiettivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Messaggio stato */}
          {message && (
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
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titolo */}
            <div className="space-y-2">
              <Label htmlFor="titolo">Titolo *</Label>
              <Input
                id="titolo"
                value={formData.titolo}
                onChange={(e) => handleInputChange("titolo", e.target.value)}
                placeholder="Es. MANGIARE 1kg di zucchine"
                required
              />
            </div>

            {/* Descrizione */}
            <div className="space-y-2">
              <Label htmlFor="descrizione">Descrizione</Label>
              <Textarea
                id="descrizione"
                value={formData.descrizione}
                onChange={(e) => handleInputChange("descrizione", e.target.value)}
                placeholder="Descrizione opzionale dell'obiettivo..."
                rows={3}
              />
            </div>

            {/* Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inizio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Fine</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>

            {/* Categoria e colore */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Caricamento categorie...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={formData.categoriaId?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange("categoriaId", Number.parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          <div>
                            <IconFromName iconName={category.icona} />
                          </div>
                          <div>{category.titolo}</div>
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
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priorità *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona priorità" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASSA">Bassa</SelectItem>
                    <SelectItem value="MEDIA">Media</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Value */}
              <div className="space-y-2">
                <Label htmlFor="targetValue">Valore Target</Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={formData.targetValue || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "targetValue",
                      e.target.value ? Number.parseFloat(e.target.value) : null,
                    )
                  }
                  placeholder="Es. 1000"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="visibility">Visibilità</Label>
                <div className="text-sm text-muted-foreground">
                  {formData.visibility === "public" ? "Pubblico" : "Privato"}
                </div>
              </div>
              <Switch
                id="visibility"
                checked={formData.visibility === "public"}
                onCheckedChange={(checked) =>
                  handleInputChange("visibility", checked ? "public" : "private")
                }
              />
            </div>

            {/* Is Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Obiettivo attivo</Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Crea Obiettivo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
