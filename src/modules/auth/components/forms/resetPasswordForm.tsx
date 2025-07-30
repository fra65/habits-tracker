/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GalleryVerticalEnd, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResetPasswordFormData, resetPasswordSchema } from "../../schema/reset-password.schema";
import Link from "next/link";
import { resetPassword } from "../../api/password-reset/resetPassword";
import { getPasswordStrength } from "../../schema/password-strength.schema";
// import axios from "axios";

interface ResetPasswordFormProps {
  className?: string;
}

export function ResetPasswordForm({ className }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setFormMessage(null);

    if (!token) {
      setFormMessage({ type: "error", text: "Token mancante nell'URL. Impossibile procedere." });
      return;
    }

    try {

      const result = await resetPassword(token, data.password)

      // await axios.post("/api/password-reset", {
      //   token,
      //   password: data.password,
      // });

      if(!result) {
        return null
      }

      setFormMessage({
        type: "success",
        text: "Password aggiornata con successo! Reindirizzamento in corso...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Errore nel reset della password:", error);

      const errorMsg =
        error.response?.data?.message ||
        "Si è verificato un problema durante l'aggiornamento della password. Per favore riprova.";

      setFormMessage({ type: "error", text: errorMsg });
    }
  };

  const passwordStrength = getPasswordStrength(password || "");

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {formMessage && (
        <div
          className={cn(
            "mb-4 rounded-md p-3 text-center font-medium",
            formMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}
          role="alert"
          aria-live="polite"
        >
          {formMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </a>
            <h1 className="text-xl font-bold">Reimposta la tua password!</h1>
            <p className="text-sm text-muted-foreground text-center">Inserisci la tua nuova password</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Nuova Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Inserisci la nuova password"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs text-muted-foreground">Sicurezza: {passwordStrength.label}</p>
                  )}
                </div>
              )}
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Conferma la nuova password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Nascondi password" : "Mostra password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Aggiornamento in corso..." : "Aggiorna Password"}
            </Button>
          </div>
        </div>
      </form>

      <div className="text-balance text-center text-xs text-muted-foreground">
        <div className="space-y-1">
          <p className="font-medium">Requisiti password:</p>
          <ul className="text-left space-y-1">
            <li>• Almeno 8 caratteri</li>
            <li>• Una lettera maiuscola e una minuscola</li>
            <li>• Almeno un numero</li>
            <li>• Almeno un carattere speciale</li>
          </ul>
        </div>
      </div>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Ricordi la tua password? <Link href="/login">Torna al login</Link>
      </div>
    </div>
  );
}