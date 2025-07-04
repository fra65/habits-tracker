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

export default function SignInForm() {

  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // o un placeholder

  const credentialsAction = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    signIn("credentials", data)
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

        {/* Form Email */}
        <form action={credentialsAction} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
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
