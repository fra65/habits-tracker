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

const THEME_OPTIONS = [
  { value: "system", label: "System (predefinito)" },
  { value: "light", label: "Chiaro" },
  { value: "dark", label: "Scuro" },
]

const SIDEBAR_SIDE_OPTIONS = [
  { value: "left", label: "Sinistra (predefinito)" },
  { value: "right", label: "Destra" },
]

const SIDEBAR_TYPE_OPTIONS = [
  { value: "floating", label: "Floating (predefinito)" },
  { value: "inset", label: "Inset" },
  { value: "sidebar", label: "Sidebar" },
]

const DEFAULT_SHORTCUT = "b";

const ProfilePreferencesForm = () => {
  const { data: session, status } = useSession()
  const [preferences, setPreferences] = useState<ProfilePreferencesOutput | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editPreferences, setEditPreferences] = useState<Partial<ProfilePreferencesOutput & { lang?: string }>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showModal, setShowModal] = useState(false)

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

  // Validazione campo singolo e gestione errori
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

  // Salvataggio
  const handleSave = async () => {
    const validateData = ProfilePreferencesInputSchema.safeParse(editPreferences)
    if (!validateData.success) return

    await updatePreferences({ ...validateData.data })
    setIsEditing(false)
    setPreferences(editPreferences as ProfilePreferencesOutput)
  }

  if (!preferences) {
    return (
      <div className="flex flex-col gap-2">
        <h1>Preferenze non ancora impostate</h1>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto mb-4">
        <h1 className="font-medium text-muted-foreground">Preferenze Utente</h1>
      </div>
      <form className="max-w-4xl mx-auto grid grid-cols-4 gap-6" onSubmit={e => e.preventDefault()}>

        {/* Tema */}
        <div className="flex flex-col">
          <label htmlFor="theme" className="mb-2 text-sm font-medium text-muted-foreground">
            Tema
          </label>
          <select
            id="theme"
            className="bg-input rounded-md border p-2 text-muted-foreground"
            disabled={!isEditing}
            value={isEditing ? editPreferences.theme ?? "system" : preferences.theme ?? "system"}
            onChange={e => handleFieldChange("theme", e.target.value)}
          >
            {THEME_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.theme && <span className="text-sm text-red-500 mt-1">{errors.theme}</span>}
        </div>

        {/* Posizione Sidebar */}
        <div className="flex flex-col">
          <label htmlFor="sidebarSide" className="mb-2 text-sm font-medium text-muted-foreground">
            Posizione Sidebar
          </label>
          <select
            id="sidebarSide"
            className="bg-input rounded-md border p-2 text-muted-foreground"
            disabled={!isEditing}
            value={isEditing ? editPreferences.sidebarSide ?? "left" : preferences.sidebarSide ?? "left"}
            onChange={e => handleFieldChange("sidebarSide", e.target.value)}
          >
            {SIDEBAR_SIDE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.sidebarSide && <span className="text-sm text-red-500 mt-1">{errors.sidebarSide}</span>}
        </div>

        {/* Shortcut sidebar */}
        <div className="flex flex-col">
          <label htmlFor="sidebarOpenShortcut" className="mb-2 text-sm font-medium text-muted-foreground">
            Shortcut apertura sidebar
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm">Ctrl +</span>
            <Input
              id="sidebarOpenShortcut"
              type="text"
              disabled={!isEditing}
              value={
                isEditing
                  ? editPreferences.sidebarOpenShortcut ?? DEFAULT_SHORTCUT
                  : preferences.sidebarOpenShortcut ?? DEFAULT_SHORTCUT
              }
              maxLength={1}
              minLength={1}
              className="w-12 bg-input"
              onChange={e => {
                const val = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1)
                handleFieldChange("sidebarOpenShortcut", val)
              }}
              placeholder={DEFAULT_SHORTCUT}
            />
          </div>
          {errors.sidebarOpenShortcut && <span className="text-sm text-red-500 mt-1">{errors.sidebarOpenShortcut}</span>}
        </div>

        {/* Tipo sidebar */}
        <div className="flex flex-col">
          <label htmlFor="sidebarType" className="mb-2 text-sm font-medium text-muted-foreground">
            Tipo di Sidebar
          </label>
          <select
            id="sidebarType"
            className="bg-input rounded-md border p-2 text-muted-foreground"
            disabled={!isEditing}
            value={isEditing ? editPreferences.sidebarType ?? "floating" : preferences.sidebarType ?? "floating"}
            onChange={e => handleFieldChange("sidebarType", e.target.value)}
          >
            {SIDEBAR_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.sidebarType && <span className="text-sm text-red-500 mt-1">{errors.sidebarType}</span>}
        </div>

        {/* Lingua */}
        <div className="flex flex-col col-span-1">
          <label htmlFor="lang" className="mb-2 text-sm font-medium text-muted-foreground">
            Lingua
          </label>
          <Input
            id="lang"
            type="text"
            disabled={!isEditing}
            value={editPreferences.lang ?? "it"}
            onChange={e => handleFieldChange("lang", e.target.value)}
            maxLength={30}
            placeholder="it"
            className="bg-input rounded-md border p-2 text-muted-foreground"
          />
          {errors.lang && <span className="text-sm text-red-500 mt-1">{errors.lang}</span>}
        </div>

        {/* Bottone Modifica/Salva e Reset */}
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
