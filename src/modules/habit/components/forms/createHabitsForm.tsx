/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HabitInputSchema, PRIORITY_ENUM, type HabitInput } from "../../schema/HabitsInput.schema";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import createHabit from "../../api/createHabit";

export function CreateHabitForm() {
  const form = useForm({
    resolver: zodResolver(HabitInputSchema),
    defaultValues: {
      categoriaId: 0,
      titolo: "",
      descrizione: "",
      startDate: new Date().toISOString().substring(0, 10), // string
      endDate: undefined,
      color: "#000000",
      priority: "MEDIA",
      isActive: false,
      visibility: "",
      targetValue: undefined,
      userId: 0,
    },
  });

  async function onSubmit(data: HabitInput) {

    const validateData = HabitInputSchema.safeParse(data)

    if(!validateData.success)
      return

    await createHabit(validateData.data)

    // console.log("Valid data:", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        {/* categoriaId (number) */}
        <FormField
          control={form.control}
          name="categoriaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria ID</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* titolo (string) */}
        <FormField
          control={form.control}
          name="titolo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* descrizione (string optional) */}
        <FormField
          control={form.control}
          name="descrizione"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* startDate (date) */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Inizio</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value as string}
                  onChange={e => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Fine</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? (field.value as string) : ""}
                  onChange={e => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* color (hex color string) */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colore</FormLabel>
              <FormControl>
                <Input {...field} type="color" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* priority (enum select) */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priorità</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona priorità" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Priorità</SelectLabel>
                    {PRIORITY_ENUM.map((priority: any) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* isActive (boolean checkbox) */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
              <FormLabel className="font-normal">Attivo</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* visibility (optional string) */}
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibilità</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* targetValue (optional positive int) */}
        <FormField
          control={form.control}
          name="targetValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valore Obiettivo</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  min={1} 
                  step={1} 
                  onChange={e => {
                    const val = e.target.value;
                    field.onChange(val ? parseInt(val) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* userId (number) */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Salva</Button>

      </form>
    </Form>
  );
}
