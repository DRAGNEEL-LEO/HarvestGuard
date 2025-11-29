"use client"

import { useState, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { i18n } from "@/lib/i18n"
import Link from "next/link"
import { ArrowLeft, Upload, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import Image from "next/image"

interface PestAnalysis {
  pestName: string
  pestNameBangla: string
  riskLevel: "High" | "Medium" | "Low" | "Critical"
  riskLevelBangla: string
  description: string
  descriptionBangla: string
  treatmentPlan: string
  treatmentPlanBangla: string
  confidence: number
}

export default function PestDetectionPage() {
  const { language } = useLanguage()
  const t = i18n[language].pestDetection
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PestAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      setImagePreview(base64)
      setError(null)

      // Send to API for Gemini analysis
      setIsAnalyzing(true)
      try {
        const res = await fetch("/api/pest/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to analyze image")
        }

        const { data } = await res.json()
        setAnalysis(data)
        // eslint-disable-next-line no-console
        console.log("[Gemini Pest Analysis Result]", data)
      } catch (err) {
        const message = (err as Error).message || "Failed to analyze image"
        setError(message)
        // eslint-disable-next-line no-console
        console.error("[Pest Detection Error]", err)
      } finally {
        setIsAnalyzing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-50 border-red-200"
      case "High":
        return "bg-orange-50 border-orange-200"
      case "Medium":
        return "bg-yellow-50 border-yellow-200"
      case "Low":
        return "bg-green-50 border-green-200"
      default:
        return "bg-gray-50"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Critical":
        return <AlertTriangle className="w-6 h-6 text-red-600" />
      case "High":
        return <AlertTriangle className="w-6 h-6 text-orange-600" />
      case "Medium":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      case "Low":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      default:
        return null
    }
  }

  const getRiskLevelBangla = (level: string) => {
    switch (level) {
      case "Critical":
        return "গুরুতর"
      case "High":
        return "উচ্চ"
      case "Medium":
        return "মাঝারি"
      case "Low":
        return "কম"
      default:
        return "অজানা"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>{language === "en" ? "Back to Dashboard" : "ড্যাশবোর্ডে ফিরুন"}</span>
          </Link>

          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Image Upload Section */}
        <div className="bg-background rounded-2xl shadow-lg p-8 border border-muted mb-8">
          <div className="flex items-center justify-center">
            <div className="w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-primary mb-2" />
                  <p className="text-lg font-semibold mb-1">{t.upload_image}</p>
                  <p className="text-sm text-muted-foreground">{t.choose_file}</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isAnalyzing}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-8 p-6 rounded-lg border border-muted bg-background">
            <h3 className="font-semibold mb-4">{t.image_preview}</h3>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">{t.analyzing}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 mb-8">
            <p className="text-red-700 font-semibold mb-2">{language === "en" ? "Analysis Error" : "বিশ্লেষণ ত্রুটি"}</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-2">
              {error.includes("API key")
                ? language === "en"
                  ? "Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file and restart the server."
                  : ".env.local ফাইলে NEXT_PUBLIC_GEMINI_API_KEY যোগ করুন এবং সার্ভার পুনরায় চালু করুন।"
                : ""}
            </p>
          </div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">{t.analyzing}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !isAnalyzing && (
          <div className="space-y-6">
            {/* Pest Details */}
            <div className={`p-6 rounded-lg border ${getRiskBgColor(analysis.riskLevel)}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getRiskIcon(analysis.riskLevel)}</div>
                <div className="flex-1">
                  <div className="mb-2">
                    <h3 className="text-2xl font-bold">{analysis.pestName}</h3>
                    <p className="text-sm text-muted-foreground">{analysis.pestNameBangla}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold">{t.risk_level}:</span>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      {analysis.riskLevelBangla}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {language === "en" ? "Confidence:" : "আত্মবিশ্বাস:"} {Math.round(analysis.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-sm mb-4">{language === "en" ? analysis.description : analysis.descriptionBangla}</p>
                </div>
              </div>
            </div>

            {/* Treatment Plan */}
            <div className="p-6 rounded-lg border border-muted bg-background">
              <h4 className="font-semibold mb-4 text-lg">{t.treatment_plan}</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-primary mb-2">{language === "en" ? "Treatment:" : "চিকিৎসা:"}</h5>
                  <p className="text-sm">{language === "en" ? analysis.treatmentPlan : analysis.treatmentPlanBangla}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setImagePreview(null)
                  setAnalysis(null)
                  setError(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="flex-1 px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors font-semibold"
              >
                {language === "en" ? "Upload Another Image" : "অন্য ছবি আপলোড করুন"}
              </button>
              <button className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold">
                {language === "en" ? "Save Result" : "ফলাফল সংরক্ষণ করুন"}
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        {!analysis && (
          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "Upload an image of pest damage or the pest itself. Our AI will identify it and provide local treatment methods in Bangla."
                : "কীটপতঙ্গ বা তার ক্ষতির ছবি আপলোড করুন। আমাদের এআই এটি চিহ্নিত করবে এবং স্থানীয় চিকিৎসা পদ্ধতি বাংলায় প্রদান করবে।"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
