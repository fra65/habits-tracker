"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authSchema, LoginInput } from "../../schema/validation";

export default function LoginForm() {
  const [isMounted, setIsMounted] = useState(false);

  // Stati per i valori input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Stati per gli errori di validazione
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});

  // Stato per errore di login da next-auth
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errori
    setErrors({});
    setLoginError(null);

    // Prepara dati da validare
    const formData = {
      username: username.trim(),
      password: password.trim(),
    };

    // Validazione con Zod
    const result = authSchema.login.safeParse(formData);

    if (!result.success) {
      // Estrai errori e impostali nello stato
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      for (const err of result.error.errors) {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as keyof LoginInput;
          fieldErrors[fieldName] = err.message;
        }
      }
      setErrors(fieldErrors);
      return; // blocca submit se errori
    }

    // Se validazione ok, procedi con signIn
    const signInResult = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setLoginError("Username o password non validi");
    } else if (signInResult?.ok) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <Link href="/">
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
            <Button
              type="submit"
              variant={"outline"}
              className="flex-1 border-black hover:bg-black hover:text-white cursor-pointer transition-all duration-300 ease"
            >
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
            <Button
              type="submit"
              variant={"outline"}
              className="flex-1 border-black hover:bg-black hover:text-white cursor-pointer transition-all duration-300 ease"
            >
              Accedi con Google
            </Button>
          </form>
        </div>

        <Separator />

        {/* Form Username */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Input
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!errors.username}
              aria-describedby="username-error"
              required
            />
            {errors.username && (
              <p id="username-error" className="text-red-600 text-sm mt-1">
                {errors.username}
              </p>
            )}

            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              required
            />
            {errors.password && (
              <p id="password-error" className="text-red-600 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {loginError && (
            <p className="text-red-700 font-semibold text-center">{loginError}</p>
          )}

          <Button type="submit" className="w-full cursor-pointer">
            Accedi
          </Button>

          <div className="flex flex-col gap-4">
            <Link
              href="/signup"
              className="text-blue-500 hover:text-blue-700 transition-all duration-300 ease"
            >
              Non hai un account? Registrati
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
