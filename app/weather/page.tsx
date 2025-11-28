"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Cloud, Droplets, Wind } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  rainChance: number
  windSpeed: number
  condition: string
  forecast: ForecastDay[]
}

interface ForecastDay {
  day: string
  date: string
  maxTemp: number
  minTemp: number
  rainChance: number
  humidity: number
}

export default function WeatherPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [location, setLocation] = useState("Dhaka")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const divisions = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Barisal", "Sylhet", "Rangpur", "Mymensingh"]

  const content = {
    en: {
      title: "Weather Monitoring",
      subtitle: "Real-time weather forecasts for your crops",
      location_label: "Select Location",
      current_weather: "Current Weather",
      forecast: "5-Day Forecast",
      temperature: "Temperature",
      humidity: "Humidity",
      rain_chance: "Rain Chance",
      wind_speed: "Wind Speed",
      advisory: "Smart Advisory",
      loading: "Fetching weather data...",
      error_fetch: "Failed to fetch weather data",
      back: "Back to Dashboard",
    },
    bn: {
      title: "আবহাওয়া পর্যবেক্ষণ",
      subtitle: "আপনার ফসনের জন্য রিয়েল-টাইম আবহাওয়া পূর্বাভাস",
      location_label: "অবস্থান নির্বাচন করুন",
      current_weather: "বর্তমান আবহাওয়া",
      forecast: "৫ দিনের পূর্বাভাস",
      temperature: "তাপমাত্রা",
      humidity: "আর্দ্রতা",
      rain_chance: "বৃষ্টির সম্ভাবনা",
      wind_speed: "বায়ুর গতি",
      advisory: "স্মার্ট পরামর্শ",
      loading: "আবহাওয়া ডেটা আনছি...",
      error_fetch: "আবহাওয়া ডেটা আনতে ব্যর্থ",
      back: "ড্যাশবোর্ডে ফিরুন",
    },
  }

  const t = content[language]

  const generateMockWeather = (loc: string): WeatherData => {
    const baseTemp = loc === "Dhaka" ? 28 : loc === "Sylhet" ? 26 : 27
    const baseHumidity = loc === "Sylhet" ? 75 : loc === "Khulna" ? 65 : 70

    return {
      location: loc,
      temperature: baseTemp + Math.random() * 5,
      humidity: baseHumidity + Math.random() * 10,
      rainChance: Math.floor(Math.random() * 100),
      windSpeed: 5 + Math.random() * 10,
      condition: Math.random() > 0.5 ? "Partly Cloudy" : "Clear",
      forecast: Array.from({ length: 5 }, (_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
        date: new Date(Date.now() + i * 86400000).toLocaleDateString(),
        maxTemp: baseTemp + 2 + Math.random() * 3,
        minTemp: baseTemp - 2 + Math.random() * 3,
        rainChance: Math.floor(Math.random() * 100),
        humidity: baseHumidity + Math.random() * 10,
      })),
    }
  }

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation)
    setLoading(true)
    setError("")

    setTimeout(() => {
      try {
        const weatherData = generateMockWeather(newLocation)
        setWeather(weatherData)
      } catch (err) {
        setError(t.error_fetch)
      }
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    handleLocationChange(location)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <img src="/farmers-working-in-rice-field-harvest.jpg" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-md border-b border-blue-400/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">{t.title}</h1>
            <p className="text-blue-200">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 font-medium transition-colors border border-blue-400/30"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-blue-200 hover:bg-blue-500/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.back}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Location Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-blue-100 mb-3">{t.location_label}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => handleLocationChange(div)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  location === div
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                    : "bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 border border-slate-600"
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-200">{t.loading}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-6 text-red-200 mb-8">
            <p>{error}</p>
          </div>
        )}

        {weather && !loading && (
          <>
            {/* Current Weather */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{t.current_weather}</h2>
              <div className="bg-gradient-to-br from-slate-700/60 to-blue-800/60 backdrop-blur rounded-2xl shadow-xl border border-blue-400/20 p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-blue-200 text-lg mb-2">{weather.location}</p>
                    <p className="text-6xl font-bold text-cyan-400">{Math.round(weather.temperature)}°C</p>
                    <p className="text-blue-100 text-xl mt-2">{weather.condition}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-600/50 rounded-xl p-4 border border-blue-400/20">
                      <div className="flex items-center gap-2 text-blue-200 mb-2">
                        <Droplets className="w-5 h-5" />
                        <span>{t.humidity}</span>
                      </div>
                      <p className="text-3xl font-bold text-cyan-400">{Math.round(weather.humidity)}%</p>
                    </div>
                    <div className="bg-slate-600/50 rounded-xl p-4 border border-blue-400/20">
                      <div className="flex items-center gap-2 text-blue-200 mb-2">
                        <Cloud className="w-5 h-5" />
                        <span>{t.rain_chance}</span>
                      </div>
                      <p className="text-3xl font-bold text-cyan-400">{Math.round(weather.rainChance)}%</p>
                    </div>
                    <div className="bg-slate-600/50 rounded-xl p-4 border border-blue-400/20 col-span-2">
                      <div className="flex items-center gap-2 text-blue-200 mb-2">
                        <Wind className="w-5 h-5" />
                        <span>{t.wind_speed}</span>
                      </div>
                      <p className="text-3xl font-bold text-cyan-400">{Math.round(weather.windSpeed)} km/h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">{t.forecast}</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {weather.forecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-700/60 to-blue-800/60 backdrop-blur rounded-xl border border-blue-400/20 p-6 hover:border-cyan-400/50 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">{day.day}</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-blue-200">{t.temperature}</p>
                        <p className="text-lg font-semibold text-cyan-400">
                          {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-200">{t.humidity}</p>
                        <p className="text-lg font-semibold text-cyan-400">{Math.round(day.humidity)}%</p>
                      </div>
                      <div>
                        <p className="text-blue-200">{t.rain_chance}</p>
                        <p className="text-lg font-semibold text-cyan-400">{Math.round(day.rainChance)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
