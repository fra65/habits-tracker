"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileInputClientSchema } from "../../schema/ProfileInput"
import createProfile from "../../api/createProfile"
import { useRouter } from "next/navigation"

export default function CreateProfileForm() {
  const t = useTranslations('CreateProfileForm');
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

    setMessage(t('msg-invalid-data'));
    setMessageType("error");
    return;
  }

  try {
    const createdUser = await createProfile(result.data);

    //console.log("Risultato createProfile:", createdUser);

    if (!createdUser) {
      setMessage(t('msg-create-fail'));
      setMessageType("error");
    } else {
      setMessage(t('msg-create-success'));
      setMessageType("success");
      router.push('/pages/profile')
      form.reset();
    }
  } catch (error) {
    console.error("Errore nella creazione del profilo:", error);
    setMessage(t('msg-create-error'));
    setMessageType("error");
  }
}


  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">{t('label-nome')}</Label>
                <Input id="nome" placeholder={t('placeholder-nome')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cognome">{t('label-cognome')}</Label>
                <Input id="cognome" placeholder={t('placeholder-cognome')} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_nascita">{t('label-data-nascita')}</Label>
                <Input id="data_nascita" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sesso">{t('label-sesso')}</Label>
                <Select name="sesso" defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder={t('placeholder-sesso')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">{t('option-maschio')}</SelectItem>
                    <SelectItem value="F">{t('option-femmina')}</SelectItem>
                    <SelectItem value="A">{t('option-altro')}</SelectItem>
                    <SelectItem value="N">{t('option-non-specificato')}</SelectItem>
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
                {t('btn-create-profile')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}