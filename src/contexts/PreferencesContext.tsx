'use client'

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react"
import getPreferences from "@/modules/preferences/api/getPreferences"
import { ProfilePreferencesOutput } from "@/modules/preferences/schema/ProfilePreferencesOutput.schema"

interface PreferencesContextProps {
  preferences: ProfilePreferencesOutput | null
  setPreferences: React.Dispatch<React.SetStateAction<ProfilePreferencesOutput | null>>
  loading: boolean
}

const PreferencesContext = createContext<PreferencesContextProps>({
  preferences: null,
  setPreferences: () => {},
  loading: true,
})

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<ProfilePreferencesOutput | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrefs() {
      setLoading(true)
      try {
        const prefs = await getPreferences()
        setPreferences(prefs)
      } catch {
        setPreferences(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPrefs()
  }, [])

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences, loading }}>
      {children}
    </PreferencesContext.Provider>
  )
}

// Questa riga serve per usare facilmente il context
export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}
