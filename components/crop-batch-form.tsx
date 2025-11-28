"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface CropBatch {
  cropType: string
  estimatedWeight: number
  harvestDate: string
  storageLocation: string
  storageType: string
  status: "active" | "completed"
}

import { BANGLADESH_CROPS, cropLabel } from "@/lib/crops"

interface Props {
  onSubmit: (batch: CropBatch) => void
  onCancel: () => void
  language: "en" | "bn"
  // accept either an array of string values or CropItem-like objects
  availableCrops?: Array<string | { value: string; en?: string; bn?: string }>
}

  const divisions = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Barisal", "Sylhet", "Rangpur", "Mymensingh"]

const storageTypes = ["Jute Bag Stack", "Silo", "Open Area", "Warehouse", "Underground Bunker"]

export default function CropBatchForm({ onSubmit, onCancel, language, availableCrops }: Props) {
  const defaultCrop = (availableCrops ?? BANGLADESH_CROPS).length > 0 ? (availableCrops ?? BANGLADESH_CROPS)[0] : "Paddy/Rice"
  const defaultValue = typeof defaultCrop === "string" ? defaultCrop : (defaultCrop as any).value ?? (defaultCrop as any).en

  const [formData, setFormData] = useState<CropBatch>({
    cropType: (defaultValue as string) || "Paddy/Rice",
    estimatedWeight: 0,
    harvestDate: "",
    storageLocation: divisions[0],
    storageType: storageTypes[0],
    status: "active",
  })

  const content = {
    en: {
      title: "Add New Crop Batch",
      crop_type: "Crop Type",
      weight: "Estimated Weight (kg)",
      harvest_date: "Harvest Date",
      storage_location: "Storage Location (Division)",
      storage_type: "Storage Type",
      cancel: "Cancel",
      submit: "Register Batch",
    },
    bn: {
      title: "নতুন ফসলের ব্যাচ যোগ করুন",
      crop_type: "ফসলের ধরন",
      weight: "আনুমানিক ওজন (কেজি)",
      harvest_date: "ফসল কাটার তারিখ",
      storage_location: "সংরক্ষণ স্থান (বিভাগ)",
      storage_type: "সংরক্ষণ প্রকার",
      cancel: "বাতিল করুন",
      submit: "ব্যাচ নিবন্ধন করুন",
    },
  }

  const t = content[language]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-2xl shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-muted flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.crop_type}</label>
            <select
              value={formData.cropType}
              onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
            >
              {(availableCrops ?? BANGLADESH_CROPS).map((c) => {
                const item = typeof c === "string" ? { value: c, en: c, bn: c } : { value: c.value, en: c.en ?? c.value, bn: c.bn ?? c.en ?? c.value }
                return (
                  <option key={item.value} value={item.value}>
                    {language === "bn" ? item.bn : item.en}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.weight}</label>
            <input
              type="number"
              min="0"
              value={formData.estimatedWeight}
              onChange={(e) => {
                const parsed = Number.parseFloat(e.target.value)
                setFormData({ ...formData, estimatedWeight: Number.isNaN(parsed) ? 0 : parsed })
              }}
              className="w-full px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.harvest_date}</label>
            <input
              type="date"
              value={formData.harvestDate}
              onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.storage_location}</label>
            <select
              value={formData.storageLocation}
              onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
            >
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.storage_type}</label>
            <select
              value={formData.storageType}
              onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
            >
              {storageTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
