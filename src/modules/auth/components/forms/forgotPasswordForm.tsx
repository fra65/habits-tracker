/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ForgotPasswordFormData, forgotPasswordSchema } from "../../schema/forgot-password.schema"
import axios from "axios"
import { useState } from "react"

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const email = data.email;
      const response = await axios.post('/api/users/check-email', { email });

      if (response.status === 200) {
        const userId = response.data.user.id;

        const tokenResponse = await axios.post('/api/password-reset/create-token', { userId, email });

        if (tokenResponse.status === 200) {
          setFeedbackMessage('Token creato con successo. Controlla la tua email.');
          setFeedbackType("success");
        } else {
          setFeedbackMessage('Errore nella creazione del token.');
          setFeedbackType("error");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setFeedbackMessage("Email non trovata.");
        setFeedbackType("error");
      } else if (error.response?.status === 429) {
        setFeedbackMessage(error.response.data.error || "Troppi tentativi, riprova più tardi.");
        setFeedbackType("error")
      }
      else {
        console.error(error);
        setFeedbackMessage("Errore nel processo di recupero password.");
        setFeedbackType("error");
      }
    }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </a>
            <h1 className="text-xl font-bold">Inserisci la mail per recupero password</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Invio in corso..." : "Invia email"}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>

      {feedbackMessage && (
        <p className={cn(
          "text-center text-sm",
          feedbackType === "success" ? "text-green-600" : "text-red-600"
        )}>
          {feedbackMessage}
        </p>
      )}
    </div>
  )
}