"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, LoginInput } from "../../validation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
    
  const form = useForm<LoginInput>({
    resolver: zodResolver(authSchema.login),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    // qui gestisci il login, ad esempio chiamando API o hook di autenticazione
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl suppressHydrationWarning>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Accedi
        </Button>

        <div className="flex justify-between text-sm text-blue-600">
          <Link href="/signup" className="hover:underline">
            Non hai un account? Registrati
          </Link>
          <Link href="/forgot-password" className="hover:underline">
            Password dimenticata?
          </Link>
        </div>
      </form>
    </Form>
  );
}