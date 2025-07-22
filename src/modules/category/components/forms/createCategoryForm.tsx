'use client'

import React, { useState } from "react";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import createCategory from "../../api/createCategory";

export function CreateCategoryForm() {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [icona, setIcona] = useState("");
  const [colore, setColore] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!titolo.trim()) {
      alert("Il campo titolo è obbligatorio.");
      return;
    }

    const data = {
      titolo,
      descrizione,
      icona,
      colore,
    };


    createCategory(data);
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
        />
      </div>

      <div>
        <Label htmlFor="descrizione">Descrizione</Label>
        <Input
          id="descrizione"
          type="text"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          placeholder="Inserisci la descrizione"
        />
      </div>

      <div>
        <Label htmlFor="icona">Icona</Label>
        <Input
          id="icona"
          type="text"
          value={icona}
          onChange={(e) => setIcona(e.target.value)}
          placeholder="Inserisci l'icona"
        />
      </div>

      <div>
        <Label htmlFor="colore">Colore</Label>
        <Input
          id="colore"
          type="color"
          value={colore}
          onChange={(e) => setColore(e.target.value)}
        />
      </div>

      <Button type="submit">Crea Categoria</Button>
    </form>
  );
}
