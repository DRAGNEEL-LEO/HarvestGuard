"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "bn"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem("selectedLanguage") as Language | null
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem("selectedLanguage", lang)

      // If a user is logged in, also persist their preferredLanguage so
      // other pages (which read `farmer`/`currentUser`) won't overwrite it.
      const raw = localStorage.getItem("currentUser") || localStorage.getItem("farmer")
      if (raw) {
        try {
          const obj = JSON.parse(raw)
          if (obj && typeof obj === "object") {
            obj.preferredLanguage = lang
            localStorage.setItem("currentUser", JSON.stringify(obj))
            localStorage.setItem("farmer", JSON.stringify(obj))
          }
        } catch (e) {
          // ignore JSON parse errors
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }

  if (!mounted) return null

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
