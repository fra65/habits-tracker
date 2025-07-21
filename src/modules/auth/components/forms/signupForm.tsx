/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Non necessaria se usi FieldInput direttamente
import { Eye, EyeOff } from "lucide-react";
import { authSchema, SignupInput } from "../../schema/auth.schema";
import { createUser } from "../../../user/api/createUser";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import createPreferences from "@/modules/preferences/api/createPreferences";

// Componente PasswordInput con stile aggiornato
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
        // Applica le classi di shadcn per lo stato di errore
        className={error ? "pr-10 border-destructive" : "pr-10"}
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
        <p
          id={`${id}-error`}
          className="text-destructive text-sm mt-1 animate-in fade-in-0 duration-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupInput, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Assicurati che authSchema.signup sia correttamente tipizzato per innerType()
  const signupObjectSchema = authSchema.signup.innerType() as z.ZodObject<any>;

  const validateField = (name: keyof SignupInput, value: string) => {
    try {
      if (name === "confirmPassword") {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        return;
      }

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

    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [fieldName]: value,
      };

      if (fieldName === "password" || fieldName === "confirmPassword") {
        const passwordValue =
          fieldName === "password" ? value : newFormData.password;
        const confirmPasswordValue =
          fieldName === "confirmPassword" ? value : newFormData.confirmPassword;

        if (passwordValue !== confirmPasswordValue) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: "Le password non corrispondono",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: undefined,
          }));
        }
      }
      return newFormData;
    });

    validateField(fieldName, value);

    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(null);

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
      return;
    }

    try {
      const userCreated = await createUser(
        formData.username,
        formData.email,
        formData.password,
        "credentials"
      );

      if (!userCreated.success) {
        setErrors({});
        setSubmitError("Email e/o username sono già in uso.");
        return;
      }

      // creo il record vuoto delle preferenze
      await createPreferences(userCreated.data.user.id);

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
      if (error.response) {
        if (error.response.status === 500) {
          const backendMessage =
            error.response.data?.message ||
            error.response.data ||
            "Email e/o username sono già in uso.";
          setSubmitError(backendMessage);
        } else {
          setSubmitError(
            error.response.data?.message || "Errore durante la registrazione."
          );
        }
      } else {
        setSubmitError(error.message || "Errore durante la registrazione.");
      }
    }
  };

  const hasErrors = Object.values(errors).some((err) => err !== undefined);
  const allFieldsFilled = Object.values(formData).every((val) => val.trim() !== "");
  const passwordsMatch = formData.password === formData.confirmPassword;

  const isSubmitDisabled = hasErrors || !allFieldsFilled || !passwordsMatch;

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center p-4 text-foreground">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-card border-border mb-8 md:mb-0">
        <CardHeader className="text-center pb-6">
          <Link href="/" className="mb-4 block">
            <Button
              variant="outline"
              className="w-full text-primary hover:bg-muted-foreground hover:text-primary-foreground border-primary transition-colors duration-300"
            >
              HOME
            </Button>
          </Link>
          <CardTitle className="text-3xl font-bold text-primary-foreground">
            Registrati
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Inserisci i tuoi dati per creare un account
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
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
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <p
                    id="username-error"
                    className="text-destructive text-sm mt-1 animate-in fade-in-0 duration-300"
                  >
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-3">
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
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-destructive text-sm mt-1 animate-in fade-in-0 duration-300"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
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

            <div className="space-y-3">
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

            {!passwordsMatch && !errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1 animate-in fade-in-0 duration-300">
                Le password non corrispondono
              </p>
            )}

            {submitError && (
              <p className="text-destructive-foreground font-semibold text-center mt-4 animate-in fade-in-0 duration-300">
                {submitError}
              </p>
            )}

            {submitSuccess && (
              <p className="text-green-700 font-semibold text-center mt-4 animate-in fade-in-0 duration-300">
                {submitSuccess}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 py-2 rounded-md font-semibold tracking-normal"
              disabled={isSubmitDisabled}
            >
              Registrati
            </Button>
          </form>

          <div className="flex flex-col items-center space-y-3 mt-4">
            <Link
              href="/login"
              className="text-accent hover:text-accent-foreground transition-colors duration-300 ease-in-out text-sm"
            >
              Hai già un account? Accedi
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
