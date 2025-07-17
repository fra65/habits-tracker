"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileInputClientSchema } from "../../schema/ProfileInput"
import createProfile from "../../api/createProfile"
import { useRouter } from "next/navigation"

export default function CreateProfileForm() {
  // Stato per messaggi di feedback
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"error" | "success" | null>(null)
  const router = useRouter()

async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const nome = (form.nome as HTMLInputElement).value;
  const cognome = (form.cognome as HTMLInputElement).value;
  const data_nascita = (form["data_nascita"] as HTMLInputElement).value;
  const sesso = (form.elements.namedItem("sesso") as HTMLInputElement)?.value || "";

  const data = {
    nome,
    cognome,
    data_nascita,
    sesso,
    is_completed: true,
  };

  //console.log("Dati inviati per validazione:", data);

  // Validazione con Zod
  const result = ProfileInputClientSchema.safeParse(data);

  if (!result.success) {
    console.error("Errore di validazione Zod:", result.error.message);

    // Stampa dettagliata di ogni errore
    result.error.errors.forEach((err, index) => {
      console.error(`Errore #${index + 1}:`);
      console.error(`  Path: ${err.path.join(" > ")}`);
      console.error(`  Messaggio: ${err.message}`);
      console.error(`  Tipo: ${err.code}`);
    });

    setMessage("Errore nei dati inseriti. Controlla i campi e riprova.");
    setMessageType("error");
    return;
  }

  try {
    const createdUser = await createProfile(result.data);

    //console.log("Risultato createProfile:", createdUser);

    if (!createdUser) {
      setMessage("Impossibile creare il profilo. Riprova più tardi.");
      setMessageType("error");
    } else {
      setMessage("Profilo creato con successo! Reindirizzamento in corso...");
      setMessageType("success");
      router.push('/pages/profile')
      form.reset();
    }
  } catch (error) {
    console.error("Errore nella creazione del profilo:", error);
    setMessage("Si è verificato un errore durante la creazione del profilo.");
    setMessageType("error");
  }
}


  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Crea il tuo profilo</CardTitle>
          <CardDescription>Inserisci le tue informazioni personali per completare la registrazione.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" placeholder="Inserisci il tuo nome" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cognome">Cognome</Label>
                <Input id="cognome" placeholder="Inserisci il tuo cognome" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_nascita">Data di nascita</Label>
                <Input id="data_nascita" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sesso">Sesso</Label>
                <Select name="sesso" defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona il sesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Maschio</SelectItem>
                    <SelectItem value="F">Femmina</SelectItem>
                    <SelectItem value="A">Altro</SelectItem>
                    <SelectItem value="N">Preferisco non specificare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {message && (
              <p
                className={`mt-2 ${
                  messageType === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Crea profilo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}