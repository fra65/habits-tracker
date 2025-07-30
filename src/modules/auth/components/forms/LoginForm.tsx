"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authSchema, LoginInput } from "../../schema/auth.schema";
import { Github, Chrome } from "lucide-react";

export default function LoginForm() {
  const [isMounted, setIsMounted] = useState(false);

  // Input states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Validation error states
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  // Login error state
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoginError(null);

    const formData = {
      username: username.trim(),
      password: password.trim(),
    };

    const result = authSchema.login.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      for (const err of result.error.errors) {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as keyof LoginInput;
          fieldErrors[fieldName] = err.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    const signInResult = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setLoginError("Username o password non validi");
    } else if (signInResult?.ok) {
      window.location.href = "/pages/today";
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center p-4 text-foreground">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-card border-border md:mr-8 mb-8 md:mb-0">
        <CardHeader className="text-center pb-6">
          <Link href="/" className="mb-4 block">
            <Button
              variant="outline"
              className="w-full text-primary hover:bg-muted-foreground hover:text-primary-foreground border-primary transition-colors duration-300"
            >
              HOME
            </Button>
          </Link>
          <CardTitle className="text-3xl font-bold text-primary-foreground">Accedi</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social login buttons above form */}
          <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
            {/* GitHub */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                signIn("github", { callbackUrl: "/pages/dashboard" });
              }}
              className="w-full"
            >
              <Button
                variant="secondary"
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors duration-300 py-2 rounded-md font-semibold flex items-center justify-center space-x-2"
              >
                <Github className="h-5 w-5" />
                <span>Accedi con GitHub</span>
              </Button>
            </form>
            {/* Google */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                signIn("google", { callbackUrl: "/pages/dashboard" });
              }}
              className="w-full"
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full border-border bg-input text-foreground hover:bg-muted-foreground hover:text-foreground transition-colors duration-300 py-2 rounded-md font-semibold flex items-center justify-center space-x-2"
              >
                <Chrome className="h-5 w-5" />
                <span>Accedi con Google</span>
              </Button>
            </form>
          </div>

          {/* Separator with "OR" */}
          <Separator />
          {/* <div className="absolute left-1/2 top-[41%] bg-card px-3 text-muted text-sm select-none -translate-x-1/2">
            OR
          </div> */}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-3">
              <Input
                name="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={!!errors.username}
                aria-describedby="username-error"
                required
                className="input-field"
              />
              {errors.username && (
                <p
                  id="username-error"
                  className="text-destructive text-sm mt-1 animate-in fade-in-0 duration-300"
                >
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
                className="input-field"
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="text-destructive text-sm mt-1 animate-in fade-in-0 duration-300"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {loginError && (
              <p className="text-destructive-foreground font-semibold text-center mt-4 animate-in fade-in-0 duration-300">
                {loginError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 py-2 rounded-md font-semibold tracking-normal"
            >
              Accedi
            </Button>
          </form>

          <div className="flex flex-col items-center space-y-3 mt-4">
            <Link
              href="/signup"
              className="text-accent hover:text-accent-foreground transition-colors duration-300 ease-in-out text-sm"
            >
              Non hai un account? Registrati
            </Link>

            <Link
              href="/forgot-password"
              className="text-accent hover:text-accent-foreground transition-colors duration-300 ease-in-out text-sm"
            >
              Password dimenticata?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
