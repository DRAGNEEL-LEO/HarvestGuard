"use client"

import { Cloud, Droplets, Wind } from "lucide-react"

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

export default function WeatherDisplay({ weather, language }: Props) {
  const content = {
    en: {
      temperature: "Temperature",
      humidity: "Humidity",
      rain_chance: "Rain Chance",
      wind_speed: "Wind Speed",
      condition: "Condition",
    },
    bn: {
      temperature: "তাপমাত্রা",
      humidity: "আর্দ্রতা",
      rain_chance: "বৃষ্টির সম্ভাবনা",
      wind_speed: "বায়ুর গতি",
      condition: "অবস্থা",
    },
  }

  const t = content[language]

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-8 shadow-lg">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Main Temperature Display */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Cloud className="w-24 h-24 text-primary mx-auto mb-4" />
            <p className="text-6xl font-bold text-foreground mb-2">{Math.round(weather.temperature)}°C</p>
            <p className="text-xl text-muted-foreground">{weather.condition}</p>
          </div>
        </div>

        {/* Weather Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-background rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="w-6 h-6 text-accent" />
              <p className="text-sm font-medium text-muted-foreground">{t.humidity}</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.round(weather.humidity)}%</p>
          </div>

          <div className="bg-background rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Cloud className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">{t.rain_chance}</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.round(weather.rainChance)}%</p>
          </div>

          <div className="bg-background rounded-xl p-6 shadow-md col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Wind className="w-6 h-6 text-secondary" />
              <p className="text-sm font-medium text-muted-foreground">{t.wind_speed}</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.round(weather.windSpeed)} km/h</p>
          </div>
        </div>
      </div>
    </div>
  )
}
