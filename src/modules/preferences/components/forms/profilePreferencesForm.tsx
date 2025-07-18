/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import getPreferences from "../../api/getPreferences"
import { ProfileSkeleton } from "@/components/skeletons/profileSkeleton"
import { Button } from "@/components/ui/button"
import { ProfilePreferencesOutput } from "../../schema/ProfilePreferencesOutput.schema"
import updatePreferences from "../../api/updatePreferences"
import { ProfilePreferencesInputSchema } from "../../schema/ProfilePreferencesInput.schema"
import resetPreferences from "../../api/resetPreferences"
import ResetModal from "../modals/resetPreferencesModal"
import { ThemeToggle } from "@/components/button/theme-toggle"
import { useTheme } from "next-themes"

const ProfilePreferencesForm = () => {
  const { data: session, status } = useSession()
  const [preferences, setPreferences] = useState<ProfilePreferencesOutput | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editPreferences, setEditPreferences] = useState<Partial<ProfilePreferencesOutput & { lang?: string }>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showModal, setShowModal] = useState(false)

    // dentro il componente
  const { setTheme } = useTheme()

  React.useEffect(() => {
    if (status === "authenticated") {
      setLoading(true)
      getPreferences()
        .then((data: any) => {
          setPreferences(data)
          setEditPreferences({ ...data, lang: data.lang ?? "it" })
        })
        .catch(() => {
          setPreferences(null)
          setEditPreferences({ lang: "it" })
        })
        .finally(() => setLoading(false))
    } else {
      setPreferences(null)
      setEditPreferences({ lang: "it" })
      setLoading(false)
    }
    setErrors({})
  }, [status])

  const handleFieldChange = (field: keyof (ProfilePreferencesOutput & { lang?: string }), value: any) => {
    setEditPreferences((prev: any) => ({
      ...prev,
      [field]: value,
    }))
    const partialForValidation = { ...editPreferences, [field]: value }
    const result = ProfilePreferencesInputSchema.safeParse(partialForValidation)
    if (!result.success) {
      const issues = result.error.issues.filter((i: any) => i.path[0] === field)
      setErrors((prev) => ({
        ...prev,
        [field]: issues.length > 0 ? issues[0].message : "",
      }))
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleReset = async () => {
    try {
      setLoading(true)
      const preferences = await resetPreferences()
      if (!preferences) throw new Error("Errore nel caricamento dei valori di default")

      setPreferences(preferences)
      setEditPreferences(preferences)
      setIsEditing(false)
      setErrors({})
    } catch (error) {
      console.error("Errore nel reset preferenze:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center p-6 min-h-40">
        <ProfileSkeleton />
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Attenzione: devi effettuare il login per vedere le preferenze utente.
      </div>
    )
  }

  const handleSave = async () => {
    const validateData = ProfilePreferencesInputSchema.safeParse(editPreferences)
    if (!validateData.success) {
      // gestione errori omessa per brevità
      return
    }

    try {
      const updated = await updatePreferences(validateData.data)
      setPreferences(updated ?? validateData.data)
      setEditPreferences(updated ?? validateData.data)
      setErrors({})
      setIsEditing(false)

      // AGGIUNTA: aggiorna tema nell'app in base al valore salvato
      const newTheme = updated?.theme ?? validateData.data.theme ?? "system"
      setTheme(newTheme)
    } catch (error) {
      console.error("Errore salvataggio preferenze", error)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    handleFieldChange("theme", newTheme)
  }

  return (
    <>

      <div className="max-w-4xl mx-auto mb-4">
        <h1 className="font-medium text-muted-foreground">Preferenze Utente</h1>
      </div>
      <form className="max-w-4xl mx-auto flex flex-col gap-4" onSubmit={e => e.preventDefault()}>

        {errors._global && (
          <div className="col-span-4 mb-4 text-red-600 font-semibold">
            {errors._global}
          </div>
        )}

        <div className="flex flex-col w-1/6">
          <label htmlFor="theme" className="mb-2 text-sm font-medium text-muted-foreground">
            Tema
          </label>
          <ThemeToggle
            value={isEditing ? editPreferences.theme ?? "system" : preferences?.theme ?? "system"}
            disabled={!isEditing}
            onChange={handleThemeChange}
          />
          {errors.theme && <span className="text-sm text-red-500 mt-1">{errors.theme}</span>}
        </div>

        <div className="flex flex-col col-span-1 w-1/6">
          <label htmlFor="lang" className="mb-2 text-sm font-medium text-muted-foreground">
            Lingua
          </label>
          <Input
            id="lang"
            type="text"
            disabled={!isEditing}
            value={editPreferences.lang ?? preferences?.lang ?? "it"}
            onChange={e => handleFieldChange("lang", e.target.value)}
            maxLength={30}
            placeholder="it"
            className="bg-input rounded-md border p-2 text-muted-foreground"
          />
          {errors.lang && <span className="text-sm text-red-500 mt-1">{errors.lang}</span>}
        </div>

        <div className="col-span-4 flex justify-end gap-2">
          <Button
            type="button"
            className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-linear"
            onClick={() => {
              if (isEditing) {
                handleSave()
              } else {
                setIsEditing(true)
                setEditPreferences({ ...preferences, lang: preferences?.lang ?? "it" })
                setErrors({})
              }
            }}
          >
            {isEditing ? "Salva" : "Modifica"}
          </Button>

          <Button
            type="button"
            className={`cursor-pointer rounded-md bg-destructive px-4 py-2 text-white hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-linear ${isEditing ? "hidden" : ""}`}
            onClick={() => setShowModal(true)}
          >
            Ripristina
          </Button>
        </div>

        {showModal && (
          <ResetModal
            onClose={() => setShowModal(false)}
            onResetSuccess={() => {
              setShowModal(false)
              handleReset()
            }}
          />
        )}
      </form>
    </>
  )
}

export default ProfilePreferencesForm