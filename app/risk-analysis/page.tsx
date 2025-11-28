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

  // Calculate risk based on batch and mock weather data
  const calculateRisk = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId)
    if (!batch) return

    setLoading(true)

    // Simulate risk calculation with random factors
    setTimeout(() => {
      const moistureLevel = 55 + Math.random() * 30
      const temperatureLevel = 25 + Math.random() * 10
      const daysInStorage = Math.floor((Date.now() - new Date(batch.createdAt).getTime()) / (1000 * 60 * 60 * 24))

      // ETCL calculation logic
      let etcl = 72 // default
      let riskLevel: "low" | "medium" | "high" | "critical" = "low"
      let afflatoxinRisk = false

      if (moistureLevel > 75 && temperatureLevel > 30) {
        etcl = 24 + Math.random() * 24 // High risk: 24-48 hours
        riskLevel = "critical"
        afflatoxinRisk = true
      } else if (moistureLevel > 70 || temperatureLevel > 28) {
        etcl = 48 + Math.random() * 48 // Medium-high risk: 48-96 hours
        riskLevel = "high"
        afflatoxinRisk = Math.random() > 0.5
      } else if (moistureLevel > 65 || temperatureLevel > 25) {
        etcl = 72 + Math.random() * 72 // Medium risk: 72-144 hours
        riskLevel = "medium"
        afflatoxinRisk = false
      } else {
        etcl = 144 + Math.random() * 168 // Low risk: 144+ hours
        riskLevel = "low"
        afflatoxinRisk = false
      }

      const etclLabel =
        etcl < 24
          ? language === "en"
            ? "Critical - Less than 1 day"
            : "সংকটজনক - ১ দিনের কম"
          : etcl < 48
            ? language === "en"
              ? "High - 1-2 days"
              : "উচ্চ - ১-২ দিন"
            : etcl < 96
              ? language === "en"
                ? "Medium - 2-4 days"
                : "মাধ্যম - ২-৪ দিন"
              : language === "en"
                ? "Low - 4+ days"
                : "কম - ৪+ দিন"

      let recommendation = ""
      let recommendationBn = ""

      if (afflatoxinRisk) {
        recommendation = `High Risk of Aflatoxin Mold (ETCL: ${Math.round(etcl)} hours). Weather forecast suggests high humidity, requiring immediate indoor aeration. Check storage and increase ventilation immediately.`
        recommendationBn = `আফ্লাটক্সিন ছত্রাকের উচ্চ ঝুঁকি (ETCL: ${Math.round(etcl)} ঘন্টা)। আবহাওয়ার পূর্বাভাস উচ্চ আর্দ্রতা প্রস্তাব করে, তাৎক্ষণিক অভ্যন্তরীণ বায়ু চলাচল প্রয়োজন। অবিলম্বে সংরক্ষণ পরীক্ষা করুন এবং বায়ু চলাচল বাড়ান।`
      } else if (riskLevel === "high") {
        recommendation = `High Risk of moisture damage detected. Moisture: ${Math.round(moistureLevel)}%. Implement aeration schedule and monitor daily for early signs of mold.`
        recommendationBn = `আর্দ্রতা ক্ষতির উচ্চ ঝুঁকি সনাক্ত করা হয়েছে। আর্দ্রতা: ${Math.round(moistureLevel)}%। বায়ু চলাচলের সময়সূচী প্রয়োগ করুন এবং ছত্রাকের প্রাথমিক লক্ষণের জন্য দৈনিক পর্যবেক্ষণ করুন।`
      } else if (riskLevel === "medium") {
        recommendation = `Moderate risk detected. Maintain regular monitoring schedule. Current conditions: Moisture ${Math.round(moistureLevel)}%, Temperature ${Math.round(temperatureLevel)}°C. Schedule weekly inspections.`
        recommendationBn = `মাঝারি ঝুঁকি সনাক্ত করা হয়েছে। নিয়মিত পর্যবেক্ষণ সময়সূচী বজায় রাখুন। বর্তমান অবস্থা: আর্দ্রতা ${Math.round(moistureLevel)}%, তাপমাত্রা ${Math.round(temperatureLevel)}°C। সাপ্তাহিক পরিদর্শন নির্ধারণ করুন।`
      } else {
        recommendation = `Low risk detected. Conditions are favorable. Continue regular monitoring and maintain proper storage practices.`
        recommendationBn = `কম ঝুঁকি সনাক্ত করা হয়েছে। অবস্থা অনুকূল। নিয়মিত পর্যবেক্ষণ চালিয়ে যান এবং সঠিক সংরক্ষণ অনুশীলন বজায় রাখুন।`
      }

      setRiskData({
        batchId,
        riskLevel,
        etcl,
        etclLabel,
        afflatoxinRisk,
        moistureLevel,
        temperatureLevel,
        recommendation,
        recommendationBn,
      })
      setLoading(false)
    }, 1000)
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
