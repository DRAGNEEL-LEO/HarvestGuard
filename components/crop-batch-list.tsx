"use client"

import React from 'react'
import { Leaf, AlertTriangle, CheckCircle } from "lucide-react"
import { useWeather } from '@/hooks/use-weather'
import { formatFloat } from '@/lib/utils'

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

interface Props {
  batches: CropBatch[]
  language: "en" | "bn"
}

export default function CropBatchList({ batches, language }: Props) {
  const content = {
    en: {
      status_active: "Active",
      status_completed: "Completed",
      weight: "Weight",
      location: "Location",
      storage: "Storage",
      harvest: "Harvest Date",
      loss_events: "Loss Events",
      success_rate: "Success Rate",
    },
    bn: {
      status_active: "সক্রিয়",
      status_completed: "সম্পন্ন",
      weight: "ওজন",
      location: "অবস্থান",
      storage: "সংরক্ষণ",
      harvest: "ফসল কাটার তারিখ",
      loss_events: "ক্ষতির ঘটনা",
      success_rate: "সাফল্যের হার",
    },
  }

  const t = content[language]

  const activeBatches = batches.filter((b) => b.status === "active")
  const completedBatches = batches.filter((b) => b.status === "completed")

  // Prefetch weather for all unique locations used by batches
  const uniqueLocations = Array.from(new Set(batches.map((b) => b.storageLocation || 'Dhaka')))
  const weatherMap = useWeather(uniqueLocations)

  // Crop-specific risk multipliers (simple heuristics)
  const cropRiskFactors: Record<string, { humidityFactor: number; tempFactor: number; storageSensitivity: number }> = {
    'Paddy/Rice': { humidityFactor: 1.2, tempFactor: 1.0, storageSensitivity: 1.1 },
    Rice: { humidityFactor: 1.2, tempFactor: 1.0, storageSensitivity: 1.1 },
    Wheat: { humidityFactor: 1.0, tempFactor: 0.9, storageSensitivity: 1.0 },
    Maize: { humidityFactor: 1.1, tempFactor: 1.0, storageSensitivity: 1.05 },
  }

  function computeRiskForBatch(batch: CropBatch) {
    const loc = batch.storageLocation || 'Dhaka'
    const w = weatherMap[loc]
    const humidity = w?.humidity ?? 70
    const rain = w?.rainChance ?? 0
    const temp = w?.temperature ?? 28

    const crop = batch.cropType || 'Paddy/Rice'
    const factors = cropRiskFactors[crop] || { humidityFactor: 1.0, tempFactor: 1.0, storageSensitivity: 1.0 }

    let risk = 0
    // humidity
    if (humidity > 65) risk += (humidity - 65) * 0.8 * factors.humidityFactor
    // rain
    risk += rain * 0.35
    // temperature
    if (temp >= 35) risk += 8 * factors.tempFactor
    // storage type sensitivity
    if (batch.storageType && !/sealed|airtight|container/i.test(batch.storageType)) risk += 8 * factors.storageSensitivity
    // history and interventions
    risk += (batch.lossEvents || 0) * 6
    risk -= (batch.interventionSuccessRate || 0) * 0.25
    if (risk < 0) risk = 0
    if (risk > 100) risk = 100

    const expectedLossPercent = Math.min(50, Math.round(risk * 0.35))

    // suggestions
    const suggestions: string[] = []
    if (rain > 50) suggestions.push(language === 'en' ? 'Cover stored batches and improve drainage to avoid water ingress.' : 'সংরক্ষিত ব্যাচগুলি ঢেকে রাখুন এবং জল ​​প্রবেশ এড়াতে নিষ্কাশন উন্নত করুন।')
    if (humidity > 75) suggestions.push(language === 'en' ? 'Increase ventilation or use desiccants to reduce humidity.' : 'বায়ুচলাচল বাড়ান বা আর্দ্রতা কমাতে ডেসিক্যান্ট ব্যবহার করুন।')
    if (temp >= 35) suggestions.push(language === 'en' ? 'Move produce to cooler storage or provide shade to reduce heat stress.' : 'ঠান্ডা সংরক্ষণে স্থানান্তর করুন বা তাপ চাপ কমাতে ছায়া প্রদান করুন।')
    if ((batch.interventionSuccessRate || 0) < 50) suggestions.push(language === 'en' ? 'Review past interventions and increase monitoring frequency.' : 'পূর্ববর্তী হস্তক্ষেপ পর্যালোচনা করুন এবং পর্যবেক্ষণের ফ্রিকোয়েন্সি বাড়ান।')
    if (suggestions.length === 0) suggestions.push(language === 'en' ? 'No immediate actions — continue regular monitoring.' : 'তৎক্ষণাৎ কোনো পদক্ষেপ প্রয়োজন নেই — নিয়মিত পর্যবেক্ষণ চালিয়ে যান।')

    return { risk, expectedLossPercent, weather: w || null, suggestions }
  }

  // Aggregated report for active batches
  const aggregated = React.useMemo(() => {
    if (activeBatches.length === 0) return null
    let totalRisk = 0
    let totalExpectedLoss = 0
    for (const b of activeBatches) {
      const { risk, expectedLossPercent } = computeRiskForBatch(b)
      totalRisk += risk
      totalExpectedLoss += expectedLossPercent
    }
    return {
      averageRisk: Math.round(totalRisk / activeBatches.length),
      averageExpectedLoss: Math.round(totalExpectedLoss / activeBatches.length),
      count: activeBatches.length,
    }
  }, [batches.map((b) => b.id).join('|'), JSON.stringify(weatherMap)])

  const renderBatchCard = (batch: CropBatch) => {
    const computed = computeRiskForBatch(batch)
    return (
    <div
      key={batch.id}
      className="bg-background rounded-xl shadow-md border border-muted p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-primary" />
          <div>
            <h4 className="text-xl font-bold text-foreground">{batch.cropType}</h4>
            <p className="text-sm text-muted-foreground">ID: {batch.id}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            batch.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {batch.status === "active" ? t.status_active : t.status_completed}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">{t.weight}</p>
          <p className="text-lg font-semibold text-foreground">{batch.estimatedWeight} kg</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t.location}</p>
          <p className="text-lg font-semibold text-foreground">{batch.storageLocation}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t.harvest}</p>
          <p className="text-lg font-semibold text-foreground">{new Date(batch.harvestDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t.storage}</p>
          <p className="text-lg font-semibold text-foreground">{batch.storageType}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <div>
            <p className="text-xs text-muted-foreground">{t.loss_events}</p>
            <p className="text-sm font-semibold text-foreground">{batch.lossEvents}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-muted-foreground">{t.success_rate}</p>
            <p className="text-sm font-semibold text-foreground">{formatFloat(batch.interventionSuccessRate)}%</p>
          </div>
        </div>
      </div>
      {/* Weather / Risk summary */}
      <div className="mt-4 pt-4 border-t border-muted">
        <BatchWeatherAndRisk
          batch={batch}
          language={language}
          weather={computed.weather}
          risk={computed.risk}
          expectedLossPercent={computed.expectedLossPercent}
          suggestions={computed.suggestions}
        />
      </div>
    </div>
    )
  }
  return (
    <div className="space-y-8">
      {aggregated && (
        <div className="p-4 rounded-lg bg-background border border-muted">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">{language === 'en' ? 'Active batches summary' : 'সক্রিয় ব্যাচ সারাংশ'}</div>
              <div className="text-lg font-semibold">{language === 'en' ? `${aggregated.count} batches` : `${aggregated.count} টি ব্যাচ`}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{language === 'en' ? 'Avg. Risk' : 'গড় ঝুঁকি'}</div>
              <div className="text-xl font-bold text-foreground">{formatFloat(aggregated.averageRisk)}%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{language === 'en' ? 'Est. Loss' : 'আনুমানিক ক্ষতি'}</div>
              <div className="text-xl font-bold text-foreground">{formatFloat(aggregated.averageExpectedLoss)}%</div>
            </div>
          </div>
        </div>
      )}
      {activeBatches.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {language === "en" ? "Active Batches" : "সক্রিয় ব্যাচ"}
          </h4>
          <div className="grid gap-4">{activeBatches.map(renderBatchCard)}</div>
        </div>
      )}

      {completedBatches.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {language === "en" ? "Completed Batches" : "সম্পন্ন ব্যাচ"}
          </h4>
          <div className="grid gap-4">{completedBatches.map(renderBatchCard)}</div>
        </div>
      )}
    </div>
  )
}

function BatchWeatherAndRisk({
  batch,
  language,
  weather,
  risk,
  expectedLossPercent,
  suggestions,
}: {
  batch: any
  language: 'en' | 'bn'
  weather: any
  risk: number
  expectedLossPercent: number
  suggestions: string[]
}) {
  if (!weather) {
    return <p className="text-sm text-muted-foreground">{language === 'en' ? 'Weather unavailable' : 'আবহাওয়া উপলব্ধ নেই'}</p>
  }

  const humidity = weather.humidity || 70
  const rain = weather.rainChance || 0
  const temp = weather.temperature || 28

  return (
    <div className="grid md:grid-cols-3 gap-4 items-start">
      <div>
        <p className="text-xs text-muted-foreground">{language === 'en' ? 'Weather' : 'আবহাওয়া'}</p>
        <p className="text-sm font-semibold">{weather.condition} · {formatFloat(temp)}°C</p>
        <p className="text-xs text-muted-foreground">{language === 'en' ? `Humidity: ${formatFloat(humidity)}%` : `আর্দ্রতা: ${formatFloat(humidity)}%`}</p>
        <p className="text-xs text-muted-foreground">{language === 'en' ? `Rain chance: ${formatFloat(rain)}%` : `বৃষ্টির সম্ভাবনা: ${formatFloat(rain)}%`}</p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{language === 'en' ? 'Risk Score' : 'ঝুঁকি স্কোর'}</p>
        <div className="flex items-center gap-3">
          <div className="w-full bg-muted h-3 rounded overflow-hidden">
            <div className="h-3 bg-orange-400" style={{ width: `${risk}%` }} />
          </div>
          <div className="text-sm font-semibold">{formatFloat(risk)}%</div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{language === 'en' ? `Estimated loss: ${formatFloat(expectedLossPercent)}%` : `আনুমানিক ক্ষতি: ${formatFloat(expectedLossPercent)}%`}</p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{language === 'en' ? 'Suggestions' : 'প্রস্তাবনা'}</p>
        <ul className="list-disc ml-4 mt-2 text-sm text-foreground">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
