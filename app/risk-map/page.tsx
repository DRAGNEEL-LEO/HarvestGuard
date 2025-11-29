"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { i18n } from "@/lib/i18n"
import Link from "next/link"
import { ArrowLeft, MapPin } from "lucide-react"
import dynamic from "next/dynamic"
import L from "leaflet"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

// Mock Bangladesh districts and their coordinates
const DISTRICT_COORDS: Record<string, [number, number]> = {
  Dhaka: [23.8103, 90.4125],
  Mymensingh: [24.7471, 90.4203],
  Chittagong: [22.3569, 91.7832],
  Sylhet: [24.8949, 91.868],
  Khulna: [22.8456, 89.5403],
  Barisal: [22.7010, 90.3535],
  Rajshahi: [24.3745, 88.6042],
  Rangpur: [25.7439, 89.2752],
}

interface MockFarm {
  id: string
  lat: number
  lng: number
  cropType: string
  riskLevel: "Low" | "Medium" | "High"
  lastUpdate: string
}

// Generate mock neighbor data within 0.5 degrees of the center
const generateMockNeighbors = (centerLat: number, centerLng: number): MockFarm[] => {
  const crops = ["ধান", "গম", "আলু", "ভুট্টা", "সয়াবিন"]
  const risks = ["Low", "Medium", "High"] as const
  const neighbors: MockFarm[] = []

  for (let i = 0; i < 12; i++) {
    neighbors.push({
      id: `farm_${i}`,
      lat: centerLat + (Math.random() - 0.5) * 0.5,
      lng: centerLng + (Math.random() - 0.5) * 0.5,
      cropType: crops[Math.floor(Math.random() * crops.length)],
      riskLevel: risks[Math.floor(Math.random() * risks.length)],
      lastUpdate: `${Math.floor(Math.random() * 24)} ঘন্টা আগে`,
    })
  }

  return neighbors
}

export default function RiskMapPage() {
  const { language } = useLanguage()
  const t = i18n[language].riskMap
  const [selectedDistrict, setSelectedDistrict] = useState("Mymensingh")
  const [neighbors, setNeighbors] = useState<MockFarm[]>([])
  const mapReady = useRef(false)
  const mapRef = useRef<any | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  const farmerCoords = DISTRICT_COORDS[selectedDistrict] || DISTRICT_COORDS.Mymensingh

  useEffect(() => {
    setNeighbors(generateMockNeighbors(farmerCoords[0], farmerCoords[1]))
  }, [selectedDistrict, farmerCoords])

  // Recenter map when district changes
  useEffect(() => {
    if (mapRef.current) {
      try {
        mapRef.current.setView(farmerCoords, 12, { animate: true })
      } catch (e) {
        // ignore
      }
    }
  }, [selectedDistrict, farmerCoords])

  // Try to get browser geolocation and show user's position
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          setUserLocation(coords)
          // If map is ready, center on user initially
          if (mapRef.current) {
            try {
              mapRef.current.setView(coords, 13, { animate: true })
            } catch {}
          }
        },
        (err) => {
          // ignore geolocation errors silently
        },
        { enableHighAccuracy: true, maximumAge: 1000 * 60 * 5 }
      )
    }
  }, [])

  // Create map marker colors based on risk
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "#FF4444"
      case "Medium":
        return "#FFA500"
      case "Low":
        return "#00AA00"
      default:
        return "#808080"
    }
  }

  const getRiskBangla = (risk: string) => {
    switch (risk) {
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>{language === "en" ? "Back to Dashboard" : "ড্যাশবোর্ডে ফিরুন"}</span>
          </Link>

          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* District Selector */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <label className="font-semibold">{language === "en" ? "Select District:" : "জেলা বেছে নিন:"}</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 rounded-lg border border-muted bg-background text-foreground"
          >
            {Object.keys(DISTRICT_COORDS).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Map Container */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-muted mb-8">
          <div className="bg-background p-6">
            {typeof window !== "undefined" && (
              <div className="h-96 bg-gray-200 rounded-lg relative">
                <MapContainer
                  center={farmerCoords}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  className="z-10"
                  whenCreated={(mapInstance: any) => {
                    mapRef.current = mapInstance
                    // If userLocation already available center on it, otherwise center on district
                    try {
                      if (userLocation) {
                        mapInstance.setView(userLocation, 13, { animate: true })
                      } else {
                        mapInstance.setView(farmerCoords, 12, { animate: false })
                      }
                    } catch (e) {}
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />

                  {/* Farmer's own location (blue pin) */}
                                  {
                                    (() => {
                                      const farmerIcon = L.divIcon({
                                        html: `<div style="background-color: #2B9AF3; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display:flex;align-items:center;justify-content:center;"><div style="width:10px;height:10px;background:white;border-radius:50%"></div></div>`,
                                        iconSize: [36, 36],
                                        iconAnchor: [18, 18],
                                        className: 'farmer-marker',
                                      })
                                      return (
                                        <Marker position={farmerCoords} icon={farmerIcon}>
                                          <Popup>
                                            <div className="text-sm">
                                              <p className="font-semibold">{t.your_location}</p>
                                              <p className="text-xs text-muted-foreground">{selectedDistrict}</p>
                                            </div>
                                          </Popup>
                                        </Marker>
                                      )
                                    })()
                                  }
                  

                  {/* User location marker (if available) */}
                  {userLocation && (() => {
                    const userIcon = L.divIcon({
                      html: `<div style="background-color: #00CC66; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25);"></div>`,
                      iconSize: [30, 30],
                      iconAnchor: [15, 15],
                      className: 'user-marker',
                    })
                    return (
                      <Marker position={userLocation} icon={userIcon}>
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{language === 'en' ? 'Your location' : 'আপনার অবস্থান'}</p>
                            <p className="text-xs text-muted-foreground">{userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })()}

                  {/* Neighbor locations (color-coded pins) */}
                  {neighbors.map((neighbor) => {
                    const color = getRiskColor(neighbor.riskLevel)
                    const icon = L.divIcon({
                      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                      className: "custom-map-marker",
                    })
                    return (
                      <Marker
                        key={neighbor.id}
                        position={[neighbor.lat, neighbor.lng]}
                        icon={icon}
                      >
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{t.neighbor}</p>
                            <p>{t.crop_type}: {neighbor.cropType}</p>
                            <p>{t.risk_level}: {getRiskBangla(neighbor.riskLevel)}</p>
                            <p className="text-xs text-muted-foreground">{t.last_update}: {neighbor.lastUpdate}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MapContainer>
              </div>
            )}
          </div>
        </div>

        {/* Risk Legend */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="font-semibold">{t.low_risk}</span>
            </div>
            <p className="text-sm text-muted-foreground">{language === "en" ? "Safe conditions" : "নিরাপদ অবস্থা"}</p>
          </div>
          <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="font-semibold">{t.medium_risk}</span>
            </div>
            <p className="text-sm text-muted-foreground">{language === "en" ? "Monitor closely" : "ঘনিষ্ঠভাবে পর্যবেক্ষণ করুন"}</p>
          </div>
          <div className="p-4 rounded-lg border border-red-200 bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="font-semibold">{t.high_risk}</span>
            </div>
            <p className="text-sm text-muted-foreground">{language === "en" ? "Take action" : "ব্যবস্থা নিন"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
