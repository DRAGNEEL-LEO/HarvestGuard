"use client"

import { Clock, AlertTriangle, BarChart3 } from "lucide-react"

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

export default function ETCLCalculator({ riskData, language }: Props) {
  const content = {
    en: {
      etcl_title: "Estimated Time to Critical Loss (ETCL)",
      etcl_desc:
        "Time estimate until your crop reaches critical loss conditions. Calculated based on current moisture, temperature, and weather patterns.",
      calculation_factors: "Calculation Factors",
      environmental_conditions: "Environmental Conditions",
      risk_triggers: "Risk Triggers",
      action_needed: "Immediate Actions Needed",
      monitor: "Monitor daily",
      increase_aeration: "Increase aeration",
      apply_fungicide: "Consider fungicide application",
      emergency: "Emergency intervention",
      hours: "Hours",
      days: "Days",
      moisture_factor: "Moisture Impact",
      temperature_factor: "Temperature Impact",
      combined_risk: "Combined Risk Score",
    },
    bn: {
      etcl_title: "আনুমানিক সময় থেকে সংকটজনক ক্ষতি (ETCL)",
      etcl_desc:
        "আপনার ফসল সংকটজনক ক্ষতির অবস্থায় পৌঁছানো পর্যন্ত সময়ের অনুমান। বর্তমান আর্দ্রতা, তাপমাত্রা এবং আবহাওয়ার নিদর্শনের উপর ভিত্তি করে গণনা করা হয়েছে।",
      calculation_factors: "গণনা ফ্যাক্টর",
      environmental_conditions: "পরিবেশগত অবস্থা",
      risk_triggers: "ঝুঁকির ট্রিগার",
      action_needed: "তাৎক্ষণিক পদক্ষেপ প্রয়োজন",
      monitor: "প্রতিদিন পর্যবেক্ষণ করুন",
      increase_aeration: "বায়ু চলাচল বাড়ান",
      apply_fungicide: "ছত্রাকনাশক প্রয়োগ বিবেচনা করুন",
      emergency: "জরুরি হস্তক্ষেপ",
      hours: "ঘন্টা",
      days: "দিন",
      moisture_factor: "আর্দ্রতার প্রভাব",
      temperature_factor: "তাপমাত্রার প্রভাব",
      combined_risk: "সংমিশ্রিত ঝুঁকি স্কোর",
    },
  }

  const t = content[language]

  const hours = Math.round(riskData.etcl)
  const days = Math.round(riskData.etcl / 24)

  const getMoistureImpact = () => {
    if (riskData.moistureLevel > 75) return 75
    if (riskData.moistureLevel > 70) return 50
    if (riskData.moistureLevel > 65) return 25
    return 0
  }

  const getTemperatureImpact = () => {
    if (riskData.temperatureLevel > 30) return 75
    if (riskData.temperatureLevel > 28) return 50
    if (riskData.temperatureLevel > 25) return 25
    return 0
  }

  const getActionsNeeded = () => {
    if (riskData.riskLevel === "critical") {
      return [t.emergency, t.increase_aeration, t.apply_fungicide]
    } else if (riskData.riskLevel === "high") {
      return [t.apply_fungicide, t.increase_aeration]
    } else if (riskData.riskLevel === "medium") {
      return [t.monitor, t.increase_aeration]
    } else {
      return [t.monitor]
    }
  }

  const moistureImpact = getMoistureImpact()
  const temperatureImpact = getTemperatureImpact()
  const combinedRisk = Math.round((moistureImpact + temperatureImpact) / 2)

  return (
    <div className="bg-background rounded-2xl shadow-lg border border-muted p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">{t.etcl_title}</h2>
      <p className="text-muted-foreground mb-8">{t.etcl_desc}</p>

      {/* ETCL Display */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-8 text-center">
          <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-2">{t.etcl_title}</p>
          <div className="flex justify-center gap-6 items-baseline">
            <div>
              <p className="text-4xl font-bold text-foreground">{hours}</p>
              <p className="text-xs text-muted-foreground">{t.hours}</p>
            </div>
            <p className="text-2xl text-muted-foreground">/</p>
            <div>
              <p className="text-4xl font-bold text-foreground">{days}</p>
              <p className="text-xs text-muted-foreground">{t.days}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground mt-4">{riskData.etclLabel}</p>
        </div>

        {/* Calculation Factors */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-8">
          <BarChart3 className="w-12 h-12 text-orange-600 mb-3" />
          <h3 className="font-semibold text-foreground mb-4">{t.calculation_factors}</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">{t.moisture_factor}</p>
              <div className="h-2 bg-orange-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-orange-600" style={{ width: `${moistureImpact}%` }}></div>
              </div>
              <p className="text-sm font-semibold text-foreground mt-1">{moistureImpact}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.temperature_factor}</p>
              <div className="h-2 bg-orange-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-orange-600" style={{ width: `${temperatureImpact}%` }}></div>
              </div>
              <p className="text-sm font-semibold text-foreground mt-1">{temperatureImpact}%</p>
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-xl p-8 flex flex-col">
          <AlertTriangle className="w-12 h-12 text-red-600 mb-3" />
          <h3 className="font-semibold text-foreground mb-4">{t.combined_risk}</h3>
          <div className="flex-1 flex items-end">
            <div className="text-center w-full">
              <p className="text-5xl font-bold text-red-600">{combinedRisk}%</p>
              <p className="text-xs text-muted-foreground mt-2">
                {combinedRisk > 70 ? "High Risk" : combinedRisk > 40 ? "Medium Risk" : "Low Risk"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Needed */}
      <div className="bg-muted/30 rounded-xl border border-muted p-8">
        <h3 className="text-lg font-bold text-foreground mb-4">{t.action_needed}</h3>
        <ul className="space-y-3">
          {getActionsNeeded().map((action, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
              <span className="text-foreground">{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
