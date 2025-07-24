/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Aggiunto per coerenza, anche se non strettamente necessario per un form semplice
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
  open: boolean
  onOpenChange: (open: boolean) => void
  onHabitCreated: () => void // Questa callback dovrebbe essere usata per triggerare il refresh nel genitore
}

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  open,
  onOpenChange,
  onHabitCreated,
}) => {
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

  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"error" | "success" | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Effetto per caricare le categorie e resettare il form all'apertura del modale
  useEffect(() => {
    if (!open) {
      // Se il modale si chiude, potresti voler pulire lo stato dei messaggi, ecc.
      setMessage(null);
      setMessageType(null);
      return;
    }

    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        setMessage("Errore nel caricamento delle categorie");
        setMessageType("error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();

    // Reset form e messaggi ogni volta che si apre il modale
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
    });
    setMessage(null);
    setMessageType(null);
    setSubmitting(false);
  }, [open]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset messaggi a ogni modifica
    setMessage(null);
    setMessageType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    setSubmitting(true);

    // Prepara dati con endDate nullable
    const dataToValidate = {
      ...formData,
      endDate: formData.endDate === "" ? null : formData.endDate,
    };

    const validateData = HabitInputClientSchema.safeParse(dataToValidate);

    if (!validateData.success) {
      const formattedErrors = validateData.error.format();

      const errorMessages = Object.entries(formattedErrors)
        .map(([key, value]) => {
          // Gestisce sia array di errori (es. ZodError) che oggetti con _errors (per nested errors)
          if (Array.isArray(value) && value.length > 0) {
            return `${key}: ${value.join(", ")}`;
          }
          if (typeof value === "object" && value && '_errors' in value && Array.isArray(value._errors) && value._errors.length > 0) {
              return `${key}: ${value._errors.join(", ")}`;
          }
          return null;
        })
        .filter(Boolean) // Filtra i null
        .join("; ");

      setMessage(`Errore di validazione: ${errorMessages}`);
      setMessageType("error");
      setSubmitting(false);
      return;
    }

    try {
      const response = await createHabit(validateData.data);

      if (!response || response.success === false) {
        setMessage("Errore nella creazione dell’abitudine, riprova.");
        setMessageType("error");
        setSubmitting(false);
        return;
      }

      setMessage("Obiettivo creato con successo!");
      setMessageType("success");

      // Prima aggiorna la lista nel genitore
      await onHabitCreated(); // se onHabitCreated restituisce una Promise

      // Poi chiudi il modale
      onOpenChange(false);
    } catch (error) {
      setMessage("Errore di rete o inatteso, riprova.");
      setMessageType("error");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Crea Nuovo Obiettivo</DialogTitle>
          <DialogDescription>
            Compila i campi per creare un nuovo obiettivo
          </DialogDescription>
        </DialogHeader>

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
              disabled={submitting}
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
              disabled={submitting}
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
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Fine</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                disabled={submitting}
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
                  <span className="text-sm text-muted-foreground">Caricamento categorie...</span>
                </div>
              ) : (
                <Select
                  value={formData.categoriaId?.toString() || ""}
                  onValueChange={(value) => handleInputChange("categoriaId", Number.parseInt(value))}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2"> {/* Usato flex per allineare icona e testo */}
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
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className="w-16 h-10 p-1 border rounded cursor-pointer"
                  disabled={submitting}
                />
                <span className="text-sm text-muted-foreground">{formData.color}</span>
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
                disabled={submitting}
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
                    e.target.value ? Number.parseFloat(e.target.value) : null
                  )
                }
                placeholder="Es. 1000"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={submitting}
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
              onCheckedChange={(checked) => handleInputChange("visibility", checked ? "public" : "private")}
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
            <Label htmlFor="isActive">Obiettivo attivo</Label>
          </div>

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

          {/* Submit Button */}
          <DialogFooter> {/* Utilizzo DialogFooter per il bottone di submit */}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Caricamento...
                </>
              ) : (
                "Crea Obiettivo"
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};
