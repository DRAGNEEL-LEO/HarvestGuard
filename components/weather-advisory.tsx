"use client"

import { AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  rainChance: number
  windSpeed: number
  condition: string
  forecast: any[]
}

interface Props {
  weather: WeatherData
  language: "en" | "bn"
}

export default function WeatherAdvisory({ weather, language }: Props) {
  // Generate advisories based on weather conditions
  const generateAdvisories = () => {
    const advisories = []

    // High temperature advisory
    if (weather.temperature > 32) {
      advisories.push({
        level: "high",
        title: language === "en" ? "High Temperature Alert" : "উচ্চ তাপমাত্রা সতর্কতা",
        message:
          language === "en"
            ? `Temperature is ${Math.round(weather.temperature)}°C. Ensure proper ventilation and cover crops to prevent heat damage.`
            : `তাপমাত্রা ${Math.round(weather.temperature)}°C। ফসল সুরক্ষার জন্য সঠিক বায়ু সংচালন নিশ্চিত করুন এবং ফসল ঢেকে রাখুন।`,
        icon: AlertTriangle,
      })
    }

    // High humidity advisory
    if (weather.humidity > 75) {
      advisories.push({
        level: "high",
        title: language === "en" ? "High Humidity Risk" : "উচ্চ আর্দ্রতার ঝুঁকি",
        message:
          language === "en"
            ? `Humidity at ${Math.round(weather.humidity)}%. High risk of mold and fungal diseases. Increase aeration and check for rot.`
            : `আর্দ্রতা ${Math.round(weather.humidity)}%। ছত্রাক এবং ছত্রাকজনিত রোগের উচ্চ ঝুঁকি। বায়ু চলাচল বাড়ান এবং পচা পরীক্ষা করুন।`,
        icon: AlertCircle,
      })
    }

    // Rain advisory
    if (weather.rainChance > 70) {
      advisories.push({
        level: "medium",
        title: language === "en" ? "Heavy Rain Expected" : "প্রবল বৃষ্টি প্রত্যাশিত",
        message:
          language === "en"
            ? `${Math.round(weather.rainChance)}% chance of rain. Ensure drainage and cover stored crops to prevent water damage.`
            : `${Math.round(weather.rainChance)}% বৃষ্টির সম্ভাবনা। নিকাশ নিশ্চিত করুন এবং সংরক্ষিত ফসল পানির ক্ষতি থেকে রক্ষা করতে ঢেকে রাখুন।`,
        icon: AlertCircle,
      })
    }

    // Favorable conditions
    if (weather.temperature > 20 && weather.temperature < 30 && weather.humidity < 65 && weather.rainChance < 30) {
      advisories.push({
        level: "good",
        title: language === "en" ? "Ideal Conditions" : "আদর্শ অবস্থা",
        message:
          language === "en"
            ? "Perfect weather for storage and monitoring. Crops are at lower risk. Continue regular checks."
            : "সংরক্ষণ এবং পর্যবেক্ষণের জন্য নিখুঁত আবহাওয়া। ফসল কম ঝুঁকিতে রয়েছে। নিয়মিত পরীক্ষা চালিয়ে যান।",
        icon: CheckCircle,
      })
    }

    return advisories
  }

  const advisories = generateAdvisories()

  const getAdvisoryColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-50 border-red-200"
      case "medium":
        return "bg-orange-50 border-orange-200"
      case "good":
        return "bg-green-50 border-green-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getIconColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "good":
        return "text-green-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="space-y-4">
      {advisories.length === 0 ? (
        <div className="bg-background rounded-xl border border-muted p-6 text-center">
          <Info className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">
            {language === "en" ? "No critical advisories at this time." : "এই সময়ে কোনো গুরুত্বপূর্ণ পরামর্শ নেই।"}
          </p>
        </div>
      ) : (
        advisories.map((advisory, idx) => {
          const Icon = advisory.icon
          return (
            <div key={idx} className={`rounded-xl border-2 p-6 flex gap-4 ${getAdvisoryColor(advisory.level)}`}>
              <Icon className={`w-8 h-8 flex-shrink-0 ${getIconColor(advisory.level)}`} />
              <div>
                <h4 className="font-semibold text-foreground mb-2">{advisory.title}</h4>
                <p className="text-muted-foreground text-sm">{advisory.message}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
