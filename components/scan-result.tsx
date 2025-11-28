"use client"

import { CheckCircle, AlertTriangle, AlertCircle, Leaf } from "lucide-react"

interface ScanAnalysis {
  status: "fresh" | "rotten" | "unknown"
  confidence: number
  details: string
  detailsBn: string
  recommendations: string[]
  recommendationsBn: string[]
  diseaseDetected: string[]
  severity: "low" | "medium" | "high"
}

interface Props {
  result: ScanAnalysis
  language: "en" | "bn"
}

export default function ScanResult({ result, language }: Props) {
  const content = {
    en: {
      health_status: "Crop Health Status",
      confidence: "Analysis Confidence",
      details: "Analysis Details",
      diseases_detected: "Diseases Detected",
      severity: "Severity Level",
      recommendations: "Recommendations",
      no_diseases: "No diseases detected",
      fresh: "Fresh & Healthy",
      rotten: "Signs of Deterioration",
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    bn: {
      health_status: "ফসনের স্বাস্থ্য অবস্থা",
      confidence: "বিশ্লেষণ আত্মবিশ্বাস",
      details: "বিশ্লেষণের বিবরণ",
      diseases_detected: "রোগ সনাক্ত করা হয়েছে",
      severity: "গুরুত্ব স্তর",
      recommendations: "সুপারিশ",
      no_diseases: "কোনো রোগ সনাক্ত করা হয়নি",
      fresh: "তাজা এবং স্বাস্থ্যকর",
      rotten: "অবনতির লক্ষণ",
      low: "কম",
      medium: "মাধ্যম",
      high: "উচ্চ",
    },
  }

  const t = content[language]

  const getStatusIcon = () => {
    if (result.status === "fresh") {
      return <CheckCircle className="w-16 h-16 text-green-500" />
    } else if (result.status === "rotten") {
      return <AlertTriangle className="w-16 h-16 text-red-500" />
    }
    return <AlertCircle className="w-16 h-16 text-orange-500" />
  }

  const getStatusColor = () => {
    if (result.status === "fresh") return "bg-green-50 border-green-200"
    if (result.status === "rotten") return "bg-red-50 border-red-200"
    return "bg-orange-50 border-orange-200"
  }

  const getSeverityColor = () => {
    if (result.severity === "low") return "bg-green-100 text-green-700"
    if (result.severity === "medium") return "bg-orange-100 text-orange-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <div className="space-y-6">
      {/* Health Status Card */}
      <div className={`rounded-2xl border-2 p-8 ${getStatusColor()}`}>
        <div className="flex flex-col items-center text-center">
          {getStatusIcon()}
          <h2 className="text-3xl font-bold text-foreground mt-4">{result.status === "fresh" ? t.fresh : t.rotten}</h2>
          <p className="text-muted-foreground mt-2">{language === "en" ? result.details : result.detailsBn}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background rounded-xl shadow-md border border-muted p-6">
          <p className="text-sm text-muted-foreground mb-2">{t.confidence}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${result.confidence}%` }}></div>
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">{result.confidence}%</span>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-md border border-muted p-6">
          <p className="text-sm text-muted-foreground mb-2">{t.severity}</p>
          <div className={`px-4 py-2 rounded-lg font-semibold text-center ${getSeverityColor()}`}>
            {t[result.severity as "low" | "medium" | "high"]}
          </div>
        </div>
      </div>

      {/* Diseases Detected */}
      <div className="bg-background rounded-2xl shadow-md border border-muted p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">{t.diseases_detected}</h3>
        {result.diseaseDetected.length === 0 ? (
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <p>{t.no_diseases}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {result.diseaseDetected.map((disease, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 font-medium">{disease}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          {t.recommendations}
        </h3>
        <ul className="space-y-3">
          {(language === "en" ? result.recommendations : result.recommendationsBn).map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span className="text-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
