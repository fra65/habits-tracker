"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";

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
        <Link href='/'>
          <Button type="button">HOME</Button>
        </Link>
        <CardTitle className="text-center">Accedi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="flex flex-col gap-2">

          {/* Form GitHub */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn("github", { callbackUrl: "/dashboard" });
            }}
            className="flex gap-2"
          >
            <Button type="submit" variant={"outline"} className="flex-1 border-black hover:bg-black hover:text-white cursor-pointer transition-all duration-300 ease">
              Accedi con GitHub
            </Button>
          </form>

          {/* Form Google */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn("google", { callbackUrl: "/dashboard" });
            }}
            className="flex gap-2"
          >
            <Button type="submit" variant={"outline"} className="flex-1 border-black hover:bg-black hover:text-white cursor-pointer transition-all duration-300 ease">
              Accedi con Google
            </Button>
          </form>

        </div>

        <Separator  />

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
          <Button type="submit" className="w-full cursor-pointer">
            Accedi
          </Button>

          <div className="flex flex-col gap-4">

            <Link href='/signup' className="text-blue-500 hover:text-blue-700 transition-all duration-300 ease">Non hai un account? Registrati</Link>

            {/* <Link href='/reset-password' className="text-blue-500 hover:text-blue-700 transition-all duration-300 ease">Non hai un account? Registrati</Link> */}

          </div>

        </form>
      </CardContent>
    </Card>
  );
}
