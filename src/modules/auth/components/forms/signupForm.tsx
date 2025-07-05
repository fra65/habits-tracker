/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { authSchema } from "../../schema/validation"
import { createUser } from "../../api/createUser"

function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
}: {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pr-10"
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
    </div>
  )
}

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = authSchema.signup.safeParse(formData)

    if (!result.success) {
      alert("Errore di validazione. Controlla i dati inseriti.")
      return
    }

    try {
      await createUser(formData.username, formData.email, formData.password)
      alert("Registrazione avvenuta con successo!")
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Registrati</h1>
        <p className="text-muted-foreground">Inserisci i tuoi dati per creare un account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Il tuo username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nome@esempio.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="La tua password"
            value={formData.password}
            onChange={handleInputChange}
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
          />
        </div>

        {formData.password &&
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <p className="text-sm text-destructive">Le password non corrispondono</p>
          )}

        <Button
          type="submit"
          className="w-full"
          disabled={formData.password !== formData.confirmPassword}
        >
          Registrati
        </Button>
      </form>
    </div>
  )
}
