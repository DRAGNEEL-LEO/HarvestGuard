import { type NextRequest, NextResponse } from "next/server"

// Bangladesh city coordinates for OpenWeatherMap
const bangladeshLocations: Record<string, { lat: number; lon: number }> = {
  Dhaka: { lat: 23.8103, lon: 90.4125 },
  Chittagong: { lat: 22.3569, lon: 91.7832 },
  Khulna: { lat: 22.8456, lon: 89.5403 },
  Rajshahi: { lat: 24.3745, lon: 88.6042 },
  Barisal: { lat: 22.701, lon: 90.3535 },
  Sylhet: { lat: 24.8949, lon: 91.8687 },
  Rangpur: { lat: 25.7439, lon: 89.2752 },
  Mymensingh: { lat: 24.7471, lon: 90.4203 },
}

export async function GET(request: NextRequest) {
  try {
    const location = request.nextUrl.searchParams.get("location") || "Dhaka"
    const coords = bangladeshLocations[location]

    if (!coords) {
      return NextResponse.json({ error: "Location not found" }, { status: 400 })
    }

    // Note: In production, add your OpenWeatherMap API key to environment variables
    const apiKey = process.env.OPENWEATHER_API_KEY || "demo"

    // Mock data for demo - in production, call real API
    const mockWeather = {
      location,
      temperature: 28 + Math.random() * 5,
      humidity: 70 + Math.random() * 15,
      rainChance: Math.floor(Math.random() * 100),
      windSpeed: 5 + Math.random() * 10,
      condition: "Partly Cloudy",
      forecast: Array.from({ length: 5 }, (_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
        date: new Date(Date.now() + i * 86400000).toLocaleDateString(),
        maxTemp: 28 + Math.random() * 3,
        minTemp: 22 + Math.random() * 3,
        rainChance: Math.floor(Math.random() * 100),
        humidity: 70 + Math.random() * 15,
      })),
    }

    return NextResponse.json(mockWeather)
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 })
  }
}
