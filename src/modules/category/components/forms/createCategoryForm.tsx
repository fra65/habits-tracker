'use client'

import React, { useState } from "react";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import createCategory from "../../api/createCategory";
import { CategoryInputSchema } from "../../schema/CategoryInput.schema";
import type { z } from "zod";

export function CreateCategoryForm() {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [icona, setIcona] = useState("");
  const [colore, setColore] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof CategoryInputSchema>, string>>>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerMessage(null);
    setIsError(false);

    const data = { titolo, descrizione, icona, colore };

    // Validazione client con Zod
    const result = CategoryInputSchema.safeParse(data);
    if (!result.success) {
      // Mappa errori campo per campo
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      setServerMessage("Correggi gli errori evidenziati.");
      setIsError(true);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await createCategory(result.data);

      if (response.success) {
        setServerMessage(response.message || "Categoria creata correttamente!");
        setIsError(false);

        // Resetta form
        setTitolo("");
        setDescrizione("");
        setIcona("");
        setColore("");
      } else {
        setServerMessage(response.message || "Errore durante la creazione della categoria.");
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setServerMessage("Errore di rete o server. Riprova più tardi.");
      setIsError(true);
    }

    setTimeout(() => setIsSubmitting(false), 1000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="titolo">Titolo*</Label>
        <Input
          id="titolo"
          type="text"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
          required
          placeholder="Inserisci il titolo"
          disabled={isSubmitting}
        />
        {errors.titolo && <p className="text-red-600 mt-1">{errors.titolo}</p>}
      </div>

      <div>
        <Label htmlFor="descrizione">Descrizione</Label>
        <Input
          id="descrizione"
          type="text"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          placeholder="Inserisci la descrizione"
          disabled={isSubmitting}
        />
        {errors.descrizione && <p className="text-red-600 mt-1">{errors.descrizione}</p>}
      </div>

      <div>
        <Label htmlFor="icona">Icona</Label>
        <Input
          id="icona"
          type="text"
          value={icona}
          onChange={(e) => setIcona(e.target.value)}
          placeholder="Inserisci l'icona"
          disabled={isSubmitting}
        />
        {errors.icona && <p className="text-red-600 mt-1">{errors.icona}</p>}
      </div>

      <div>
        <Label htmlFor="colore">Colore</Label>
        <Input
          id="colore"
          type="color"
          value={colore}
          onChange={(e) => setColore(e.target.value)}
          disabled={isSubmitting}
        />
        {errors.colore && <p className="text-red-600 mt-1">{errors.colore}</p>}
      </div>

      {serverMessage && (
        <p className={`mt-2 ${isError ? "text-red-600" : "text-green-600"}`}>
          {serverMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creazione in corso..." : "Crea Categoria"}
      </Button>
    </form>
  );
}
