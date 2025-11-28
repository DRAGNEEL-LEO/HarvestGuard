"use client"

import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

interface RiskData {
  batchId: string
  riskLevel: "low" | "medium" | "high" | "critical"
  etcl: number
  etclLabel: string
  afflatoxinRisk: boolean
  moistureLevel: number
  temperatureLevel: number
  recommendation: string
  recommendationBn: string
}

interface Props {
  riskData: RiskData
  language: "en" | "bn"
}

export default function RiskAssessment({ riskData, language }: Props) {
  const content = {
    en: {
      risk_assessment: "Risk Assessment",
      risk_level: "Risk Level",
      moisture: "Current Moisture Level",
      temperature: "Current Temperature",
      recommendations: "Recommendations",
      aflatoxin: "Aflatoxin Mold Risk",
      yes: "Yes",
      no: "No",
    },
    bn: {
      risk_assessment: "ঝুঁকি মূল্যায়ন",
      risk_level: "ঝুঁকির স্তর",
      moisture: "বর্তমান আর্দ্রতার স্তর",
      temperature: "বর্তমান তাপমাত্রা",
      recommendations: "সুপারিশ",
      aflatoxin: "আফ্লাটক্সিন ছত্রাক ঝুঁকি",
      yes: "হ্যাঁ",
      no: "না",
    },
  }

  const t = content[language]

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "high":
        return "bg-orange-50 border-orange-200"
      case "medium":
        return "bg-yellow-50 border-yellow-200"
      case "low":
        return "bg-green-50 border-green-200"
      default:
        return "bg-background border-muted"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "critical":
      case "high":
        return <AlertTriangle className="w-8 h-8 text-red-600" />
      case "medium":
        return <AlertCircle className="w-8 h-8 text-orange-600" />
      case "low":
        return <CheckCircle className="w-8 h-8 text-green-600" />
      default:
        return null
    }
  }

  const getRiskLevelText = (level: string) => {
    const levelMap = {
      en: {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
      },
      bn: {
        critical: "সংকটজনক",
        high: "উচ্চ",
        medium: "মাধ্যম",
        low: "কম",
      },
    }
    return levelMap[language][level as keyof typeof levelMap.en]
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">{t.risk_assessment}</h2>

      <div className={`rounded-2xl border-2 p-8 ${getRiskColor(riskData.riskLevel)}`}>
        <div className="flex items-center gap-4 mb-8">
          {getRiskIcon(riskData.riskLevel)}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t.risk_level}</p>
            <p className="text-3xl font-bold text-foreground">{getRiskLevelText(riskData.riskLevel)}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background rounded-xl p-6 shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">{t.moisture}</p>
            <p className="text-3xl font-bold text-foreground">{Math.round(riskData.moistureLevel)}%</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  riskData.moistureLevel > 75
                    ? "bg-red-500"
                    : riskData.moistureLevel > 65
                      ? "bg-orange-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min(riskData.moistureLevel, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-background rounded-xl p-6 shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">{t.temperature}</p>
            <p className="text-3xl font-bold text-foreground">{Math.round(riskData.temperatureLevel)}°C</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  riskData.temperatureLevel > 28
                    ? "bg-red-500"
                    : riskData.temperatureLevel > 25
                      ? "bg-orange-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min((riskData.temperatureLevel / 40) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            {riskData.afflatoxinRisk ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            <p className="font-semibold text-foreground">{t.aflatoxin}</p>
          </div>
          <p className="text-foreground">{riskData.afflatoxinRisk ? t.yes : t.no}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-background rounded-2xl shadow-lg border border-muted p-8">
        <h3 className="text-xl font-bold text-foreground mb-4">{t.recommendations}</h3>
        <p className="text-lg leading-relaxed text-foreground">
          {language === "en" ? riskData.recommendation : riskData.recommendationBn}
        </p>
      </div>
    </div>
  )
}
