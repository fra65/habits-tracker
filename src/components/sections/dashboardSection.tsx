"use client"

import getIsCompleteProfile from "@/modules/profile/api/getIsComplete"
import { CompletaProfiloToast } from "@/modules/profile/components/info/completaProfiloToast"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"

const DashboardSection = () => {
  const { data: session, status } = useSession()
  const [isComplete, setIsComplete] = useState<boolean | null>(null) // null = non ancora caricato

  useEffect(() => {

    if (session?.user && status === "authenticated") {
      
      async function checkProfile() {
        try {
          const result = await getIsCompleteProfile()
          setIsComplete(result)
        } catch (error) {
          // gestisci errore a piacere
          setIsComplete(false)
          console.error("Errore nel caricamento dello stato profilo:", error)
        }
      }

      checkProfile()
    } else {
      // Se non autenticato, setta esplicitamente isComplete a false o null
      setIsComplete(null)
    }
  })

  if (status === "loading" || isComplete === null) {
    return <p>loading...</p>
  }

  if (status !== "authenticated") {
    return <p>WARNING: UTENTE NON AUTENTICATO</p>
  }

  return (
    <main className="w-full bg-background p-4 flex flex-col">
      <h1 className="text-foreground font-bold uppercase w-full text-center">
        Dashboard
      </h1>

      {!isComplete && <CompletaProfiloToast />}
    </main>
  )
}

export default DashboardSection
