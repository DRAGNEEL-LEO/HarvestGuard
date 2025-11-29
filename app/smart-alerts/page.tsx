"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { i18n } from "@/lib/i18n"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, AlertCircle, CheckCircle, Bell } from "lucide-react"

interface Alert {
  id: string
  riskLevel: "Critical" | "High" | "Medium" | "Low"
  message: string
  messageBangla: string
  suggestion?: string
  suggestionBangla?: string
  timestamp: string
  crop: string
}

export default function SmartAlertsPage() {
  const { language } = useLanguage()
  const t = i18n[language].smartAlerts
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/alerts/generate")
        const json = await res.json()
        setAlerts(json.data || [])
      } catch (err) {
        console.error("Failed to fetch alerts:", err)
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  // Simulate SMS notification on critical alert
  useEffect(() => {
    if (alerts.some((a) => a.riskLevel === "Critical")) {
      const criticalAlert = alerts.find((a) => a.riskLevel === "Critical")
      if (criticalAlert) {
        // eslint-disable-next-line no-console
        console.warn(`[SMS ALERT] ${criticalAlert.messageBangla}`)
      }
    }
  }, [alerts])

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Critical":
        return <AlertTriangle className="w-6 h-6 text-red-600" />
      case "High":
        return <AlertCircle className="w-6 h-6 text-orange-600" />
      case "Medium":
        return <Bell className="w-6 h-6 text-yellow-600" />
      case "Low":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      default:
        return <Bell className="w-6 h-6" />
    }
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
        return "bg-gray-50 border-gray-200"
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

        {/* Alert Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.critical, count: alerts.filter((a) => a.riskLevel === "Critical").length, color: "bg-red-100 text-red-700" },
            { label: t.high, count: alerts.filter((a) => a.riskLevel === "High").length, color: "bg-orange-100 text-orange-700" },
            { label: t.medium, count: alerts.filter((a) => a.riskLevel === "Medium").length, color: "bg-yellow-100 text-yellow-700" },
            { label: t.low, count: alerts.filter((a) => a.riskLevel === "Low").length, color: "bg-green-100 text-green-700" },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${item.color}`}>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center rounded-lg border border-muted bg-background">
              <p className="text-muted-foreground">{language === "en" ? "Loading alerts..." : "সতর্কতা লোড হচ্ছে..."}</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-muted bg-background">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">{t.no_alerts}</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-6 rounded-lg border ${getRiskBgColor(alert.riskLevel)}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getRiskIcon(alert.riskLevel)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {alert.crop} — {getRiskLevelBangla(alert.riskLevel)} ঝুঁকি
                      </h3>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm mb-2">{language === "en" ? alert.message : alert.messageBangla}</p>
                    {/* Show suggestion for good alerts (Low risk) */}
                    {alert.riskLevel === "Low" && alert.suggestionBangla && (
                      <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded text-sm text-green-700">
                        <p className="font-semibold mb-1">💡 {language === "en" ? "Suggestion:" : "পরামর্শ:"}</p>
                        <p>{language === "en" ? alert.suggestion : alert.suggestionBangla}</p>
                      </div>
                    )}
                    {alert.riskLevel === "Critical" && (
                      <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
                        ✓ {t.sms_notification}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground">
            {language === "en"
              ? "Smart Alerts are generated based on your stored crop data (moisture, temperature, storage type, and time). Bad alerts (Critical/High/Medium) describe the situation. Good alerts (Low) include helpful suggestions."
              : "স্মার্ট সতর্কতা আপনার সংরক্ষিত ফসল ডেটা (আর্দ্রতা, তাপমাত্রা, গুদাম প্রকার এবং সময়) এর উপর ভিত্তি করে তৈরি হয়। খারাপ সতর্কতা (গুরুতর/উচ্চ/মাঝারি) পরিস্থিতি বর্ণনা করে। ভাল সতর্কতা (কম) সহায়ক পরামর্শ অন্তর্ভুক্ত করে।"}
          </p>
        </div>
      </div>
    </div>
  )
}
