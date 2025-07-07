"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

export default function LoginForm() {

  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [psw, setPsw] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // o un placeholder

  const credentialsAction = async (formData: FormData) => {

    const data = Object.fromEntries(formData.entries());

    console.log("dati passati: " + JSON.stringify(data));

    const result = await signIn("credentials", {
    ...data,
    redirect: false, // importante per evitare reload automatico
  });

  if (result?.error) {
    // mostra errore all’utente
    
    console.error("Errore login:", result.error);
    // gestisci visualizzazione messaggio errore
  } else if (result?.ok) {
    // login riuscito, fai redirect manuale
    window.location.href = "/dashboard"; // o usa router.push se usi Next.js router
  }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Accedi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Form GitHub */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn("github", { callbackUrl: "/dashboard" });
          }}
          className="flex gap-2"
        >
          <Button type="submit" className="flex-1">
            Accedi con GitHub
          </Button>
        </form>

        <Separator />

        {/* Form Google */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn("google", { callbackUrl: "/dashboard" });
          }}
          className="flex gap-2"
        >
          <Button type="submit" className="flex-1">
            Accedi con Google
          </Button>
        </form>

        <Separator />

        {/* Form Username */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // blocca il comportamento di default (reload)
            const formData = new FormData(e.currentTarget); // crea FormData dal form
            credentialsAction(formData); // chiama la funzione con i dati
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Input
              name="username" 
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              name="password" 
              type="password"
              placeholder="••••••••"
              value={psw}
              onChange={(e) => setPsw(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <MailIcon className="mr-2 h-4 w-4" />
            Accedi con Credenziali
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
