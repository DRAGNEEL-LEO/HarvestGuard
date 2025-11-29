"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { i18n } from "@/lib/i18n"
import Link from "next/link"
import { ArrowLeft, MapPin, Loader } from "lucide-react"
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

// Bangladesh divisions with their centers
const DIVISIONS: Record<string, [number, number]> = {
  Dhaka: [23.8103, 90.4125],
  Mymensingh: [24.7471, 90.4203],
  Chittagong: [22.3569, 91.7832],
  Sylhet: [24.8949, 91.868],
  Khulna: [22.8456, 89.5403],
  Barisal: [22.7010, 90.3535],
  Rajshahi: [24.3745, 88.6042],
  Rangpur: [25.7439, 89.2752],
}

// Bangladesh districts fallback coordinates
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

// Geocode location string to exact coordinates using Nominatim (OSM)
const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=bd&limit=1`,
      { headers: { 'User-Agent': 'HarvestGuard' } }
    )
    const data = await response.json()
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
  } catch (err) {
    console.error('Geocoding error:', err)
  }
  return null
}

interface FarmLocation {
  id: string
  lat: number
  lng: number
  cropType: string
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  lastUpdate: string
  storageLocation: string
  estimatedWeight: number
  isUserBatch?: boolean
}

interface CropBatch {
  id: string
  cropType: string
  storageLocation: string
  estimatedWeight: number
  harvestDate: string
  status: string
}

export default function RiskMapPage() {
  const { language } = useLanguage()
  const t = i18n[language].riskMap
  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [geoError, setGeoError] = useState<string>("")
  const [selectedDivision, setSelectedDivision] = useState<string>("Dhaka")
  const [neighborFarmers, setNeighborFarmers] = useState<FarmLocation[]>([])
  const mapReady = useRef(false)
  const mapRef = useRef<any | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Load crop batches from localStorage and geocode their locations
  useEffect(() => {
    const loadCropBatches = async () => {
      setLoading(true)
      try {
        // Load batches from localStorage
        const storedFarmer = localStorage.getItem("currentUser") || localStorage.getItem("farmer")
        let farmerData = null
        if (storedFarmer) {
          farmerData = JSON.parse(storedFarmer)
        }

        const batchesKey = farmerData ? `cropBatches_${farmerData.id}` : "cropBatches"
        const storedBatches = localStorage.getItem(batchesKey) || localStorage.getItem("cropBatches")
        const batches: CropBatch[] = storedBatches ? JSON.parse(storedBatches) : []
        const activeBatches = batches.filter((b) => b.status === "active").slice(0, 8)

        // Geocode each batch location
        const locations: FarmLocation[] = []
        for (const batch of activeBatches) {
          const coords = await geocodeLocation(batch.storageLocation)
          if (coords) {
            const riskLevels: Array<"Low" | "Medium" | "High" | "Critical"> = ["Low", "Medium", "High", "Critical"]
            locations.push({
              id: batch.id,
              lat: coords[0],
              lng: coords[1],
              cropType: batch.cropType,
              riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
              lastUpdate: language === "en" ? "Just now" : "এখনই",
              storageLocation: batch.storageLocation,
              estimatedWeight: batch.estimatedWeight,
              isUserBatch: true,
            })
          }
        }

        if (locations.length > 0) {
          setFarmLocations(locations)
          setSelectedLocation([locations[0].lat, locations[0].lng])
        } else {
          setGeoError(language === "en" ? "No active crop batches found" : "কোনো সক্রিয় ফসলের ব্যাচ পাওয়া যায়নি")
          setSelectedLocation(DISTRICT_COORDS.Mymensingh)
        }
      } catch (err) {
        console.error("Error loading batches:", err)
        setGeoError(language === "en" ? "Failed to load crop locations" : "ফসলের অবস্থান লোড করতে ব্যর্থ")
        setSelectedLocation(DISTRICT_COORDS.Mymensingh)
      } finally {
        setLoading(false)
      }
    }

    loadCropBatches()
  }, [language])

  // Recenter map when selected location changes
  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      try {
        mapRef.current.setView(selectedLocation, 12, { animate: true })
      } catch (e) {
        // ignore
      }
    }
  }, [selectedLocation])

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

  // Generate mock neighbor farmers for selected division
  useEffect(() => {
    const generateNeighbors = () => {
      const divisionCoords = DIVISIONS[selectedDivision]
      if (!divisionCoords) return
      
      // Create 3-5 mock neighbors around the division center
      const neighbors: FarmLocation[] = []
      const neighborCount = 3 + Math.floor(Math.random() * 3)
      
      for (let i = 0; i < neighborCount; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.5
        const offsetLng = (Math.random() - 0.5) * 0.5
        neighbors.push({
          id: `neighbor_${selectedDivision}_${i}`,
          lat: divisionCoords[0] + offsetLat,
          lng: divisionCoords[1] + offsetLng,
          cropType: ['Rice', 'Wheat', 'Corn', 'Potato'][Math.floor(Math.random() * 4)],
          riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
          lastUpdate: language === "en" ? "2 hours ago" : "২ ঘন্টা আগে",
          storageLocation: selectedDivision,
          estimatedWeight: Math.floor(Math.random() * 500) + 100,
          isUserBatch: false,
        })
      }
      setNeighborFarmers(neighbors)
    }
    
    generateNeighbors()
  }, [selectedDivision, language])

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

        {/* Crop Location Selector */}
        {loading ? (
          <div className="mb-6 flex items-center gap-2 text-muted-foreground">
            <Loader className="w-4 h-4 animate-spin" />
            <span>{language === "en" ? "Loading your crop locations..." : "আপনার ফসলের অবস্থান লোড হচ্ছে..."}</span>
          </div>
        ) : geoError ? (
          <div className="mb-6 p-4 rounded-lg border border-orange-200 bg-orange-50 text-orange-700">
            <p className="font-semibold mb-1">⚠️ {language === "en" ? "Location Issue" : "অবস্থান সমস্যা"}</p>
            <p className="text-sm">{geoError}</p>
          </div>
        ) : farmLocations.length > 0 ? (
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <label className="font-semibold">{language === "en" ? "Your Crops:" : "আপনার ফসল:"}</label>
            <div className="flex gap-2 flex-wrap">
              {farmLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation([loc.lat, loc.lng])}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedLocation?.[0] === loc.lat && selectedLocation?.[1] === loc.lng
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {loc.cropType} ({loc.storageLocation})
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Division Selector for Neighbor Farmers */}
        <div className="mb-6 p-4 rounded-lg border border-muted bg-background">
          <label className="block text-sm font-semibold mb-3">
            {language === "en" ? "Check Neighbor Farmers in Division:" : "বিভাগে প্রতিবেশী কৃষকদের পরীক্ষা করুন:"}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.keys(DIVISIONS).map((division) => (
              <button
                key={division}
                onClick={() => setSelectedDivision(division)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDivision === division
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {division}
              </button>
            ))}
          </div>
          {neighborFarmers.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-semibold mb-2">
                {language === "en" ? `${neighborFarmers.length} Neighbor Farmers in ${selectedDivision}` : `${selectedDivision}ে ${neighborFarmers.length} জন প্রতিবেশী কৃষক`}
              </p>
              <div className="space-y-1">
                {neighborFarmers.map((farmer) => (
                  <div key={farmer.id} className="text-xs p-2 bg-background rounded border border-muted">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{farmer.cropType}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          farmer.riskLevel === "High"
                            ? "bg-red-100 text-red-700"
                            : farmer.riskLevel === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {language === "en" ? farmer.riskLevel : farmer.riskLevel === "High" ? "উচ্চ" : farmer.riskLevel === "Medium" ? "মাঝারি" : "কম"}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{farmer.estimatedWeight} kg • {farmer.lastUpdate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-muted mb-8">
          <div className="bg-background p-6">
            {typeof window !== "undefined" && (
              <div className="h-96 bg-gray-200 rounded-lg relative">
                <MapContainer
                  center={selectedLocation || DISTRICT_COORDS.Mymensingh}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  className="z-10"
                  whenCreated={(mapInstance: any) => {
                    mapRef.current = mapInstance
                    try {
                      const centerPoint = selectedLocation || DISTRICT_COORDS.Mymensingh
                      mapInstance.setView(centerPoint, 12, { animate: false })
                    } catch (e) {}
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />

                  {/* User's crop batch locations with exact coordinates */}
                  {farmLocations.map((farm) => {
                    const isSelected = selectedLocation?.[0] === farm.lat && selectedLocation?.[1] === farm.lng
                    const color = farm.riskLevel === "Critical" ? "#FF0000" : farm.riskLevel === "High" ? "#FF4444" : farm.riskLevel === "Medium" ? "#FFA500" : "#00AA00"
                    const icon = L.divIcon({
                      html: `<div style="background-color: ${color}; width: ${isSelected ? 44 : 36}px; height: ${isSelected ? 44 : 36}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display:flex;align-items:center;justify-content:center; transition: all 0.2s;"><div style="width:${isSelected ? 14 : 10}px;height:${isSelected ? 14 : 10}px;background:white;border-radius:50%"></div></div>`,
                      iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
                      iconAnchor: [isSelected ? 22 : 18, isSelected ? 22 : 18],
                      className: 'user-crop-marker',
                    })
                    return (
                      <Marker key={farm.id} position={[farm.lat, farm.lng]} icon={icon}>
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{farm.cropType}</p>
                            <p className="text-xs text-muted-foreground mb-2">📍 {farm.storageLocation}</p>
                            <p className="text-xs">⚖️ {farm.estimatedWeight} kg</p>
                            <p className="text-xs">⚠️ {language === "en" ? "Risk: " : "ঝুঁকি: "}{farm.riskLevel}</p>
                            <p className="text-xs text-muted-foreground mt-2">{farm.lat.toFixed(4)}, {farm.lng.toFixed(4)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}

                  {/* Neighbor farmers in selected division */}
                  {neighborFarmers.map((farm) => {
                    const color = farm.riskLevel === "High" ? "#FF6B6B" : farm.riskLevel === "Medium" ? "#FFB84D" : "#51CF66"
                    const icon = L.divIcon({
                      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); opacity: 0.7; display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%"></div></div>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                      className: 'neighbor-marker',
                    })
                    return (
                      <Marker key={farm.id} position={[farm.lat, farm.lng]} icon={icon}>
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{farm.cropType} {language === "en" ? "(Neighbor)" : "(প্রতিবেশী)"}</p>
                            <p className="text-xs text-muted-foreground mb-2">📍 {farm.storageLocation}</p>
                            <p className="text-xs">⚖️ {farm.estimatedWeight} kg</p>
                            <p className="text-xs">⚠️ {language === "en" ? "Risk: " : "ঝুঁকি: "}{farm.riskLevel}</p>
                            <p className="text-xs text-muted-foreground mt-2">{farm.lat.toFixed(4)}, {farm.lng.toFixed(4)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}

                  {/* User location marker from browser geolocation (if available) - BLUE COLOR */}
                  {userLocation && (() => {
                    const userIcon = L.divIcon({
                      html: `<div style="background-color: #0066FF; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0, 102, 255, 0.5);"><div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent);"></div></div>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                      className: 'user-marker',
                    })
                    return (
                      <Marker position={userLocation} icon={userIcon}>
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{language === 'en' ? 'Your GPS Location' : 'আপনার GPS অবস্থান'}</p>
                            <p className="text-xs text-muted-foreground">{userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })()}
                </MapContainer>
              </div>
            )}
          </div>
        </div>

        {/* Risk Legend */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="font-semibold">{language === "en" ? "Your Location" : "আপনার অবস্থান"}</span>
            </div>
            <p className="text-sm text-muted-foreground">{language === "en" ? "Your GPS position" : "আপনার GPS অবস্থান"}</p>
          </div>
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
