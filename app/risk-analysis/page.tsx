"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, Zap } from "lucide-react"
import RiskAssessment from "@/components/risk-assessment"
import ETCLCalculator from "@/components/etcl-calculator"

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
}

interface RiskData {
  batchId: string
  riskLevel: "low" | "medium" | "high" | "critical"
  etcl: number // hours
  etclLabel: string
  afflatoxinRisk: boolean
  moistureLevel: number
  temperatureLevel: number
  recommendation: string
  recommendationBn: string
}

export default function RiskAnalysisPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [batches, setBatches] = useState<CropBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [riskData, setRiskData] = useState<RiskData | null>(null)
  const [loading, setLoading] = useState(false)

  const content = {
    en: {
      title: "Risk Analysis & Prediction",
      subtitle: "Monitor crop health and get early warnings",
      select_batch: "Select a Crop Batch",
      analyze: "Analyze Risk",
      no_batches: "No active batches found. Please add a batch first.",
      loading: "Analyzing risk factors...",
      back: "Back to Dashboard",
    },
    bn: {
      title: "ঝুঁকি বিশ্লেষণ এবং পূর্বাভাস",
      subtitle: "ফসনের স্বাস্থ্য পর্যবেক্ষণ করুন এবং প্রাথমিক সতর্কতা পান",
      select_batch: "একটি ফসলের ব্যাচ নির্বাচন করুন",
      analyze: "ঝুঁকি বিশ্লেষণ করুন",
      no_batches: "কোনো সক্রিয় ব্যাচ পাওয়া যায়নি। প্রথমে একটি ব্যাচ যোগ করুন।",
      loading: "ঝুঁকির কারণগুলি বিশ্লেষণ করছি...",
      back: "ড্যাশবোর্ডে ফিরুন",
    },
  }

  const t = content[language]

  // Load batches from localStorage (user-scoped when possible)
  useEffect(() => {
    try {
      const storedFarmer = localStorage.getItem("currentUser") || localStorage.getItem("farmer")
      let farmerData = null
      if (storedFarmer) {
        farmerData = JSON.parse(storedFarmer)
      }

      const key = farmerData ? `cropBatches_${farmerData.id}` : "cropBatches"
      const storedBatches = localStorage.getItem(key) || localStorage.getItem("cropBatches")
      if (storedBatches) {
        const parsed = JSON.parse(storedBatches)
        const active = parsed.filter((b: CropBatch) => b.status === "active")
        setBatches(active)
        if (active.length > 0) setSelectedBatch(active[0].id)
      }
    } catch (e) {
      // ignore malformed storage
    }
  }, [])

  // Calculate risk using Gemini API
  const calculateRisk = async (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId)
    if (!batch) return

    setLoading(true)

    try {
      const response = await fetch("/api/risk/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId,
          cropType: batch.cropType,
          estimatedWeight: batch.estimatedWeight,
          storageLocation: batch.storageLocation,
          storageType: batch.storageType,
          createdAt: batch.createdAt,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to analyze risk")
      }

      const apiResult = await response.json()
      const riskAnalysis = apiResult.data

      // Convert etclLabel to localized version if needed
      let etclLabel = riskAnalysis.etclLabel
      if (language === "bn") {
        if (riskAnalysis.etcl < 24) {
          etclLabel = "সংকটজনক - ১ দিনের কম"
        } else if (riskAnalysis.etcl < 48) {
          etclLabel = "উচ্চ - ১-২ দিন"
        } else if (riskAnalysis.etcl < 96) {
          etclLabel = "মাধ্যম - ২-৪ দিন"
        } else {
          etclLabel = "কম - ৪+ দিন"
        }
      }

      setRiskData({
        batchId,
        riskLevel: riskAnalysis.riskLevel,
        etcl: riskAnalysis.etcl,
        etclLabel,
        afflatoxinRisk: riskAnalysis.afflatoxinRisk,
        moistureLevel: riskAnalysis.moistureLevel,
        temperatureLevel: riskAnalysis.temperatureLevel,
        recommendation: riskAnalysis.recommendation,
        recommendationBn: riskAnalysis.recommendationBn,
      })
      setLoading(false)
    } catch (error) {
      console.error("Error analyzing risk:", error)
      alert(language === "en" ? "Failed to analyze risk" : "ঝুঁকি বিশ্লেষণ ব্যর্থ হয়েছে")
      setLoading(false)
    }
  }

  const handleAnalyze = () => {
    if (selectedBatch) {
      calculateRisk(selectedBatch)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <img
          src="/rice-paddy-field-sunset-agriculture-bangladesh.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <header className="bg-background border-b border-muted shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.back}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {batches.length === 0 ? (
          <div className="bg-background rounded-2xl shadow-lg border border-muted p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-6">{t.no_batches}</p>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
            >
              {language === "en" ? "Go to Dashboard" : "ড্যাশবোর্ডে যান"}
            </Link>
          </div>
        ) : (
          <>
            {/* Batch Selection */}
            <div className="mb-8 bg-background rounded-2xl shadow-md border border-muted p-6">
              <label className="block text-sm font-medium text-foreground mb-4">{t.select_batch}</label>
              <div className="flex gap-4 flex-wrap">
                {batches.map((batch) => (
                  <button
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      selectedBatch === batch.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {batch.cropType} ({Math.round(batch.estimatedWeight)} kg)
                  </button>
                ))}
              </div>
              <button
                onClick={handleAnalyze}
                className="mt-6 w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg"
              >
                <Zap className="w-5 h-5" />
                <span>{t.analyze}</span>
              </button>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t.loading}</p>
              </div>
            )}

            {riskData && !loading && (
              <>
                <RiskAssessment riskData={riskData} language={language} />
                <ETCLCalculator riskData={riskData} language={language} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
