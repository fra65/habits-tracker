'use client';

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import updateProfile from "../../api/updateProfile";
import { useForm } from "react-hook-form";

type FormData = {
  nome: string;
  cognome: string;
  data_nascita: string;
  sesso: "M" | "F" | "Altro";
};

export function UpdateForm() {
  const form = useForm<FormData>({
    defaultValues: {
      nome: "",
      cognome: "",
      data_nascita: "",
      sesso: "M",
    },
  });

  function onSubmit(data: FormData) {
    
    updateProfile(data)
    // Qui puoi fare chiamate API o altre azioni con i dati
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci il nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cognome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cognome</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci il cognome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_nascita"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data di nascita</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sesso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sesso</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona il sesso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="M">Maschio</SelectItem>
                  <SelectItem value="F">Femmina</SelectItem>
                  <SelectItem value="Altro">Altro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Invia</Button>
      </form>
    </Form>
  );
}

