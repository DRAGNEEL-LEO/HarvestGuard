"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, Plus, Download } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import FarmerProfile from "@/components/farmer-profile"
import CropBatchList from "@/components/crop-batch-list"
import CropBatchForm from "@/components/crop-batch-form"

interface Farmer {
  id: string
  name: string
  email: string
  phone: string
  preferredLanguage: "en" | "bn"
  createdAt: string
}

interface CropBatch {
  id: string
  cropType: string
  estimatedWeight: number
  harvestDate: string
  storageLocation: string
  storageType: string
  status: "active" | "completed"
  createdAt: string
  lossEvents: number
  interventionSuccessRate: number
  moisture?: number
  temperature?: number
}

import { BANGLADESH_CROPS } from "@/lib/crops"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage()
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [cropBatches, setCropBatches] = useState<CropBatch[]>([])
  const [showBatchForm, setShowBatchForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const content = {
    en: {
      title: "Dashboard",
      welcome: "Welcome",
      profile: "Profile",
      crops: "My Crops",
      new_batch: "Add New Batch",
      export_data: "Export Data",
      logout: "Logout",
      no_batches: "No active crop batches yet. Start by adding one.",
      loading: "Loading your data...",
      language_bn: "বাংলা",
      language_en: "English",
      please_login: "Please log in first",
      go_to_login: "Go to Login",
    },
    bn: {
      title: "ড্যাশবোর্ড",
      welcome: "স্বাগতম",
      profile: "প্রোফাইল",
      crops: "আমার ফসল",
      new_batch: "নতুন ব্যাচ যোগ করুন",
      export_data: "ডেটা রপ্তানি করুন",
      logout: "লগ আউট",
      no_batches: "এখনও কোনো সক্রিয় ফসলের ব্যাচ নেই। একটি যোগ করে শুরু করুন।",
      loading: "আপনার ডেটা লোড হচ্ছে...",
      language_bn: "বাংলা",
      language_en: "English",
      please_login: "প্রথমে লগ ইন করুন",
      go_to_login: "লগইন করুন",
    },
  }

  const t = content[language]

  useEffect(() => {
    // Load farmer and then user-scoped crop batches deterministically
    try {
      const storedFarmer = localStorage.getItem("currentUser") || localStorage.getItem("farmer")
      let farmerData = null

      if (storedFarmer) {
        farmerData = JSON.parse(storedFarmer)
        setFarmer(farmerData)
        // Sync language with farmer's preferred language
        if (farmerData.preferredLanguage) {
          setLanguage(farmerData.preferredLanguage)
        }
      }

      const batchesKey = farmerData ? `cropBatches_${farmerData.id}` : "cropBatches"
      const storedBatches = localStorage.getItem(batchesKey) || localStorage.getItem("cropBatches")

      if (storedBatches) {
        try {
          setCropBatches(JSON.parse(storedBatches))
        } catch (e) {
          // ignore malformed storage
        }
      }
    } finally {
      setLoading(false)
    }
  }, [setLanguage])

  // If a logged-in farmer exists, attempt to load authoritative batches from server
  useEffect(() => {
    const fetchServerBatches = async () => {
      if (!farmer) return
      try {
        const res = await fetch("/api/batches")
        // Debugging logs to help capture server response
        // eslint-disable-next-line no-console
        console.debug('/api/batches GET status:', res.status)
        const text = await res.text()
        let json: any
        try {
          json = JSON.parse(text)
        } catch {
          // Not JSON response
          // eslint-disable-next-line no-console
          console.warn('/api/batches returned non-JSON:', text)
          return
        }
        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.warn('/api/batches GET not ok', json)
          return
        }
        if (json?.data) {
          // map server rows to client shape
          const mapped = json.data.map((r: any) => ({
            id: r.id,
            cropType: r.crop_type,
            estimatedWeight: Number(r.estimated_weight),
            harvestDate: new Date(r.harvest_date).toISOString(),
            storageLocation: r.storage_location,
            storageType: r.storage_type,
            status: r.status,
            createdAt: r.created_at,
            lossEvents: 0,
            interventionSuccessRate: 0,
            moisture: r.moisture_level,
            temperature: r.temperature,
          }))
          setCropBatches(mapped)
        }
      } catch (e) {
        // ignore network errors — fallback to localStorage
      }
    }

    fetchServerBatches()
  }, [farmer])

  useEffect(() => {
    if (farmer) {
      localStorage.setItem("currentUser", JSON.stringify(farmer))
      localStorage.setItem("farmer", JSON.stringify(farmer))
    }
  }, [farmer])

  useEffect(() => {
    // Persist cropBatches to a user-scoped key when possible
    if (!loading) {
      try {
        const key = farmer ? `cropBatches_${farmer.id}` : "cropBatches"
        localStorage.setItem(key, JSON.stringify(cropBatches))
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [cropBatches, farmer, loading])

  const handleAddBatch = (newBatch: Omit<CropBatch, "id" | "createdAt" | "lossEvents" | "interventionSuccessRate">) => {
    const parsedDate = newBatch.harvestDate ? new Date(newBatch.harvestDate) : new Date()

    // If user is logged in, persist to server; otherwise fallback to localStorage
    if (farmer) {
      ;(async () => {
        try {
          // Attempt client-side insert first (uses the browser Supabase session)
          const supabase = createClient()
          const insertPayload = {
            user_id: farmer.id,
            crop_type: newBatch.cropType,
            estimated_weight: newBatch.estimatedWeight,
            harvest_date: newBatch.harvestDate ? new Date(newBatch.harvestDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            storage_location: newBatch.storageLocation,
            storage_type: newBatch.storageType,
            moisture_level: newBatch.moisture ?? null,
            temperature: newBatch.temperature ?? null,
            status: newBatch.status ?? "active",
          }

          const { data: inserted, error: insertError } = await supabase.from("crop_batches").insert([insertPayload]).select().single()
          let json: any = null
          // If client-side succeeded, use that result
          if (inserted && !insertError) {
            json = { data: inserted }
          } else {
            // Fallback to server route if client insert failed (e.g., no session/cors)
            // eslint-disable-next-line no-console
            console.warn('/api/batches: client insert failed, falling back to server route', insertError)
            const resp = await fetch("/api/batches", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newBatch),
            })
            const text = await resp.text()
            try {
              json = JSON.parse(text)
            } catch {
              json = null
            }
            // eslint-disable-next-line no-console
            console.debug('/api/batches POST status:', resp.status)
          }
          if (json?.data) {
            const r = json.data
            const batch: CropBatch = {
              id: r.id,
              cropType: r.crop_type,
              estimatedWeight: Number(r.estimated_weight),
              harvestDate: new Date(r.harvest_date).toISOString(),
              storageLocation: r.storage_location,
              storageType: r.storage_type,
              status: r.status,
              createdAt: r.created_at,
              lossEvents: 0,
              interventionSuccessRate: 0,
            }
            setCropBatches((s) => [batch, ...s])
          } else {
            // fallback to local
            const batch: CropBatch = {
              ...newBatch,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              harvestDate: isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString(),
              lossEvents: 0,
              interventionSuccessRate: 0,
            }
            setCropBatches((s) => [batch, ...s])
          }
        } catch (e) {
          const batch: CropBatch = {
            ...newBatch,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            harvestDate: isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString(),
            lossEvents: 0,
            interventionSuccessRate: 0,
          }
          setCropBatches((s) => [batch, ...s])
        } finally {
          setShowBatchForm(false)
        }
      })()
    } else {
      const batch: CropBatch = {
        ...newBatch,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        harvestDate: isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString(),
        lossEvents: 0,
        interventionSuccessRate: 0,
      }
      setCropBatches([...cropBatches, batch])
      setShowBatchForm(false)
    }
  }

  const handleExportData = () => {
    const data = {
      farmer,
      cropBatches,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const csvContent = convertToCSV(cropBatches)

    downloadFile(dataStr, "harvest-guard-data.json", "application/json")
    downloadFile(csvContent, "harvest-guard-crops.csv", "text/csv")
  }

  const handleDeleteBatch = async (batchId: string) => {
    // Remove from state
    setCropBatches((s) => s.filter((b) => b.id !== batchId))

    // If user is logged in, also delete from server
    if (farmer) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("crop_batches").delete().eq("id", batchId)
        if (error) {
          console.warn("Failed to delete batch from server:", error)
          // Could optionally re-add to state here if deletion fails
        }
      } catch (e) {
        console.warn("Error deleting batch from server:", e)
      }
    }
  }

  const convertToCSV = (batches: CropBatch[]) => {
    const headers = [
      "Batch ID",
      "Crop Type",
      "Weight (kg)",
      "Harvest Date",
      "Storage Location",
      "Storage Type",
      "Status",
      "Loss Events",
      "Success Rate %",
    ]
    const rows = batches.map((batch) => [
      batch.id,
      batch.cropType,
      batch.estimatedWeight,
      batch.harvestDate,
      batch.storageLocation,
      batch.storageType,
      batch.status,
      batch.lossEvents,
      batch.interventionSuccessRate,
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const element = document.createElement("a")
    element.setAttribute("href", `data:${type};charset=utf-8,${encodeURIComponent(content)}`)
    element.setAttribute("download", filename)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleLogout = () => {
    // Preserve user data (batches) after logout so users can log back in
    ;(async () => {
      try {
        // Clear local supabase session and then localStorage
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch (e) {
        // If signOut fails, fall back to clearing local storage
      } finally {
        localStorage.removeItem("currentUser")
        localStorage.removeItem("farmer")
        window.location.href = "/"
      }
    })()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    )
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t.please_login}</p>
          <Link
            href="/login"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.go_to_login}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="fixed inset-0 -z-10 opacity-10">
        <img
          src="/rice-paddy-field-sunset-agriculture-bangladesh.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background"></div>
      </div>

      <header className="bg-background border-b border-muted shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <img src="/images/whatsapp-20image-202025-11-27-20at-2012.jpeg" alt="Logo" className="w-8 h-8" />
              <h1 className="text-3xl font-bold text-foreground">HarvestGuard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t.logout}</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-colors"
            >
              {language === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
            </Link>
            <Link
              href="/weather"
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 font-medium transition-colors"
            >
              {language === "en" ? "Weather" : "আবহাওয়া"}
            </Link>
            <Link
              href="/risk-analysis"
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 font-medium transition-colors"
            >
              {language === "en" ? "Risk Analysis" : "ঝুঁকি বিশ্লেষণ"}
            </Link>
            <Link
              href="/crop-scanner"
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 font-medium transition-colors"
            >
              {language === "en" ? "Crop Scanner" : "ফসল স্ক্যানার"}
            </Link>
            <Link
              href="/news-articles"
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 font-medium transition-colors"
            >
              {language === "en" ? "News & Articles" : "সংবাদ ও নিবন্ধ"}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            {t.welcome}, {farmer.name}!
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "en"
              ? "Manage your crop batches and track food loss prevention"
              : "আপনার ফসলের ব্যাচ পরিচালনা করুন এবং খাদ্য ক্ষতি প্রতিরোধ ট্র্যাক করুন"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FarmerProfile farmer={farmer} language={language} />

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setShowBatchForm(!showBatchForm)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>{t.new_batch}</span>
              </button>
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>{t.export_data}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {showBatchForm ? (
              <CropBatchForm
                onSubmit={handleAddBatch}
                onCancel={() => setShowBatchForm(false)}
                language={language}
                availableCrops={BANGLADESH_CROPS}
              />
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground mb-6">{t.crops}</h3>
                {cropBatches.length === 0 ? (
                  <div className="bg-background rounded-2xl p-12 text-center shadow-md border border-muted">
                    <p className="text-muted-foreground text-lg mb-6">{t.no_batches}</p>
                    <button
                      onClick={() => setShowBatchForm(true)}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{t.new_batch}</span>
                    </button>
                  </div>
                ) : (
                  <CropBatchList batches={cropBatches} language={language} onDelete={handleDeleteBatch} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
