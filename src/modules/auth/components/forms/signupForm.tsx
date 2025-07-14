/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { authSchema, SignupInput } from "../../schema/auth.schema";
import { createUser } from "../../../user/api/createUser";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/navigation"; // Importa useRouter

function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "pr-10 border-red-600" : "pr-10"}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={show ? "Nascondi password" : "Mostra password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default function SignupForm() {
  const router = useRouter(); // Inizializza useRouter

  const [formData, setFormData] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Assicurati che authSchema.signup sia correttamente tipizzato per innerType()
  // Se authSchema.signup è già uno ZodObject, non serve innerType().
  // Se è ZodEffects (e.g. per .refine()), allora innerType() è corretto.
  // Qui assumo che sia ZodEffects come discusso precedentemente.
  const signupObjectSchema = authSchema.signup.innerType() as z.ZodObject<any>;

  const validateField = (name: keyof SignupInput, value: string) => {
    try {
      // Per `confirmPassword`, la validazione specifica avviene nel blocco `if` più in basso
      // che compara le due password. Qui ci assicuriamo solo che il campo esista se necessario.
      if (name === "confirmPassword") {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        return;
      }
      
      // Valida il campo specifico usando la sua definizione nello schema
      signupObjectSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: err.errors[0].message }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SignupInput;

    // Aggiorna formData immediatamente per permettere la validazione incrociata
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [fieldName]: value,
      };

      // Controllo password corrispondenti qui per avere accesso ai valori aggiornati
      if (fieldName === "password" || fieldName === "confirmPassword") {
        const passwordValue = fieldName === "password" ? value : newFormData.password;
        const confirmPasswordValue = fieldName === "confirmPassword" ? value : newFormData.confirmPassword;

        if (passwordValue !== confirmPasswordValue) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: "Le password non corrispondono",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: undefined, // Rimuovi l'errore se corrispondono
          }));
        }
      }
      return newFormData;
    });

    // Esegui la validazione del singolo campo
    validateField(fieldName, value);

    // Pulisci messaggi generici (successo/errore di submit) ad ogni input
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(null);

    // Validazione completa con Zod (prima di inviare al server)
    const result = authSchema.signup.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupInput, string>> = {};
      for (const err of result.error.errors) {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as keyof SignupInput;
          fieldErrors[fieldName] = err.message;
        }
      }
      setErrors(fieldErrors);
      return; // Blocca il submit se ci sono errori di validazione front-end
    }

    try {
      await createUser(formData.username, formData.email, formData.password, "credentials");
      setSubmitSuccess("Registrazione avvenuta con successo! Reindirizzamento...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error: any) {
      // Controlla se error.response e error.response.data esistono
      if (error.response) {
        if (error.response.status === 500) {
          // Se il backend manda un messaggio specifico dentro data.message o simile
          const backendMessage = error.response.data?.message || error.response.data || "Email e/o username sono già in uso.";
          setSubmitError(backendMessage);
        } else {
          setSubmitError(error.response.data?.message || "Errore durante la registrazione.");
        }
      } else {
        setSubmitError(error.message || "Errore durante la registrazione.");
      }
    }
  }

  // Controlla se ci sono errori correnti nello stato
  const hasErrors = Object.values(errors).some((err) => err !== undefined);
  // Controlla se tutti i campi obbligatori sono stati riempiti
  const allFieldsFilled = Object.values(formData).every((val) => val.trim() !== "");
  // Controlla se le password corrispondono
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Determina se il pulsante deve essere disabilitato
  const isSubmitDisabled = hasErrors || !allFieldsFilled || !passwordsMatch;

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Registrati</h1>
        <p className="text-muted-foreground">
          Inserisci i tuoi dati per creare un account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="w-full flex justify-center gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Il tuo username"
              value={formData.username}
              onChange={handleInputChange}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              required
              className={errors.username ? "border-red-600" : ""}
            />
            {errors.username && (
              <p id="username-error" className="text-red-600 text-sm mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@esempio.com"
              value={formData.email}
              onChange={handleInputChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
              className={errors.email ? "border-red-600" : ""}
            />
            {errors.email && (
              <p id="email-error" className="text-red-600 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="La tua password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Conferma Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Conferma la tua password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
          />
        </div>

        {/* Questo messaggio viene mostrato solo se passwordsMatch è false e non c'è già un errore specifico da Zod sulla confirmPassword */}
        {!passwordsMatch && !errors.confirmPassword && (
          <p className="text-sm text-destructive">Le password non corrispondono</p>
        )}

        {submitError && (
          <p className="text-red-700 font-semibold text-center">{submitError}</p>
        )}

        {submitSuccess && (
          <p className="text-green-700 font-semibold text-center">{submitSuccess}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
          Registrati
        </Button>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-700 transition-all duration-300 ease"
          >
            Hai già un account? Accedi
          </Link>
        </div>
      </form>
    </div>
  );
}
