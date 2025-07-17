/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import getUserProfile from "../../api/getUser"
import { ProfileSkeleton } from "@/components/skeletons/profileSkeleton"
import { Button } from "@/components/ui/button"
import DeleteModal from "../modals/deleteModal"
import { ProfileOutput } from "../../schema/ProfileOutput"
import toInputDateValue from "../../utils/toInputDateValue"
import updateProfile from "../../api/updateProfile"
import { ProfileUpdateInputSchema } from "../../schema/ProfileUpdateInputSchema"

const SESSO_OPTIONS = [
  { value: "M", label: "Uomo" },
  { value: "F", label: "Donna" },
  { value: "A", label: "Altro" },
  { value: "N", label: "Non dichiarato" },
]

const InfoProfileForm = () => {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<ProfileOutput | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [editProfile, setEditProfile] = useState<Partial<ProfileOutput>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  React.useEffect(() => {
    if (status === "authenticated") {
      setLoading(true)
      getUserProfile()
        .then((data: any) => {
          setProfile(data)
          setEditProfile(data ?? {})
        })
        .catch(() => {
          setProfile(null)
          setEditProfile({})
        })
        .finally(() => setLoading(false))
    } else {
      setProfile(null)
      setEditProfile({})
      setLoading(false)
    }
    setErrors({})
  }, [status, isDelete])

  // Validazione campo singolo e gestione errori
  const handleFieldChange = (field: keyof ProfileOutput, value: string) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Costruisci un oggetto con il campo aggiornato
    const partial = { ...editProfile, [field]: value }
    const result = ProfileUpdateInputSchema.safeParse(partial)
    if (!result.success) {
      const issues = result.error.issues.filter((i) => i.path[0] === field)
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
        Attenzione: devi effettuare il login per vedere le informazioni del profilo.
      </div>
    )
  }

  // Funzione di salvataggio (non modificata)
  const handleSave = () => {
    const validateData = ProfileUpdateInputSchema.safeParse(editProfile)
    if (!validateData || !validateData.data) return "NON VALIDATO !!"
    updateProfile(validateData.data)
    setIsEditing(false)
    setProfile(editProfile as ProfileOutput)
  }

  return (
    <>
      <div className="max-w-4xl mx-auto mb-4">
        <h1 className="font-medium text-muted-foreground">Info Profilo</h1>
      </div>
      <form
        id="form"
        className="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Nome */}
        <div className="flex flex-col">
          <label
            htmlFor="nome"
            className="mb-2 text-sm font-medium text-muted-foreground"
          >
            Nome
          </label>
          <Input
            id="nome"
            disabled={!isEditing}
            value={isEditing ? editProfile.nome ?? "" : profile?.nome ?? ""}
            placeholder="Nome"
            className="bg-input"
            onChange={(e) => handleFieldChange("nome", e.target.value)}
          />
          {errors.nome && (
            <span className="text-sm text-red-500 mt-1">{errors.nome}</span>
          )}
        </div>
        {/* Cognome */}
        <div className="flex flex-col">
          <label
            htmlFor="cognome"
            className="mb-2 text-sm font-medium text-muted-foreground"
          >
            Cognome
          </label>
          <Input
            id="cognome"
            disabled={!isEditing}
            value={isEditing ? editProfile.cognome ?? "" : profile?.cognome ?? ""}
            placeholder="Cognome"
            className="bg-input"
            onChange={(e) => handleFieldChange("cognome", e.target.value)}
          />
          {errors.cognome && (
            <span className="text-sm text-red-500 mt-1">{errors.cognome}</span>
          )}
        </div>
        {/* Data di nascita */}
        <div className="flex flex-col">
          <label
            htmlFor="data_nascita"
            className="mb-2 text-sm font-medium text-muted-foreground"
          >
            Data di nascita
          </label>
          <Input
            id="data_nascita"
            type="date"
            disabled={!isEditing}
            value={
              isEditing
                ? toInputDateValue(editProfile.data_nascita)
                : toInputDateValue(profile?.data_nascita)
            }
            placeholder="gg/mm/aaaa"
            className="bg-input"
            onChange={(e) => handleFieldChange("data_nascita", e.target.value)}
          />
          {errors.data_nascita && (
            <span className="text-sm text-red-500 mt-1">{errors.data_nascita}</span>
          )}
        </div>
        {/* Sesso */}
        <div className="flex flex-col">
          <label
            htmlFor="sesso"
            className="mb-2 text-sm font-medium text-muted-foreground"
          >
            Sesso
          </label>
          <select
            id="sesso"
            disabled={!isEditing}
            className="bg-input rounded-md border p-2 text-muted-foreground focus:ring-2 focus:ring-primary"
            value={isEditing ? editProfile.sesso ?? "" : profile?.sesso ?? ""}
            onChange={(e) => handleFieldChange("sesso", e.target.value)}
          >
            <option value="">Seleziona...</option>
            {SESSO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.sesso && (
            <span className="text-sm text-red-500 mt-1">{errors.sesso}</span>
          )}
        </div>
        {/* Bottoni */}
        <div className="md:col-span-2 flex justify-end gap-2">
          <Button
            type="button"
            className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all duration-300 ease-linear"
            onClick={() => {
              if (isEditing) {
                handleSave()
              } else {
                setIsEditing(true)
                setEditProfile(profile ?? {})
              }
            }}
          >
            {isEditing ? "Salva" : "Modifica"}
          </Button>
          {profile && (
            <Button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            >
              DELETE
            </Button>
          )}
          {showModal && (
            <DeleteModal
              onClose={() => setShowModal(false)}
              onDeleteSuccess={() => {
                setShowModal(false)
                setIsDelete(true)
                setProfile(null)
              }}
            />
          )}
        </div>
      </form>
    </>
  )
}

export default InfoProfileForm
