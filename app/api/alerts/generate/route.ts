import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface CropBatch {
  id: string
  crop_type: string
  harvest_date: string
  storage_location: string
  storage_type: string
  moisture_level: number | null
  temperature: number | null
  status: string
}

interface GeneratedAlert {
  id: string
  riskLevel: "Critical" | "High" | "Medium" | "Low"
  message: string
  messageBangla: string
  suggestion?: string
  suggestionBangla?: string
  timestamp: string
  crop: string
  cropType: string
}

// Helper: generate alerts based on crop batch data
async function generateAlertsFromBatches(batches: CropBatch[]): Promise<GeneratedAlert[]> {
  const alerts: GeneratedAlert[] = []
  const now = new Date()

  for (const batch of batches) {
    const harvestDate = new Date(batch.harvest_date)
    const daysAgo = Math.floor((now.getTime() - harvestDate.getTime()) / (1000 * 60 * 60 * 24))

    // Determine risk level based on crop type, storage conditions, and age
    let riskLevel: "Critical" | "High" | "Medium" | "Low" = "Low"
    let message = ""
    let messageBangla = ""
    let suggestion = ""
    let suggestionBangla = ""

    const cropNameBangla = getCropNameBangla(batch.crop_type)

    // Risk assessment logic
    if (batch.moisture_level && batch.moisture_level > 70) {
      riskLevel = "Critical"
      message = `${batch.crop_type} storage humidity exceeds 70% (${batch.moisture_level}%). Ventilate immediately to prevent fungal growth.`
      messageBangla = `${cropNameBangla} গুদামের আর্দ্রতা ৭০% অতিক্রম করেছে (${batch.moisture_level}%)। ছত্রাক বৃদ্ধি প্রতিরোধে অবিলম্বে বায়ু সঞ্চালন করুন।`
    } else if (batch.moisture_level && batch.moisture_level > 60) {
      riskLevel = "High"
      message = `${batch.crop_type} storage humidity is high (${batch.moisture_level}%). Monitor and consider ventilation.`
      messageBangla = `${cropNameBangla} গুদামের আর্দ্রতা বেশি (${batch.moisture_level}%)। পর্যবেক্ষণ করুন এবং বায়ু সঞ্চালন বিবেচনা করুন।`
    } else if (batch.temperature && batch.temperature > 30) {
      riskLevel = "High"
      message = `${batch.crop_type} storage temperature is elevated (${batch.temperature}°C). Ensure adequate ventilation.`
      messageBangla = `${cropNameBangla} গুদামের তাপমাত্রা বেশি (${batch.temperature}°C)। পর্যাপ্ত বায়ু সঞ্চালন নিশ্চিত করুন।`
    } else if (daysAgo > 30 && batch.storage_type === "open") {
      riskLevel = "Medium"
      message = `${batch.crop_type} has been stored for ${daysAgo} days in open storage. Consider moving to controlled storage.`
      messageBangla = `${cropNameBangla} ${daysAgo} দিন ধরে খোলা গুদামে রাখা হয়েছে। নিয়ন্ত্রিত গুদামে স্থানান্তর বিবেচনা করুন।`
    } else {
      riskLevel = "Low"
      message = `${batch.crop_type} storage conditions are good. Continue regular monitoring.`
      messageBangla = `${cropNameBangla} গুদামের অবস্থা ভাল। নিয়মিত পর্যবেক্ষণ চালিয়ে যান।`
      suggestion = `Best practice: Check moisture weekly, rotate stock if stored > 60 days, ensure ventilation is working.`
      suggestionBangla = `সেরা অনুশীলন: সাপ্তাহিক আর্দ্রতা পরীক্ষা করুন, ৬০ দিনের বেশি সংরক্ষণ করলে স্টক পরিবর্তন করুন, বায়ু সঞ্চালন সঠিক আছে কি নিশ্চিত করুন।`
    }

    alerts.push({
      id: `alert_${batch.id}`,
      riskLevel,
      message,
      messageBangla,
      suggestion,
      suggestionBangla,
      timestamp: `${daysAgo} days ago`,
      crop: cropNameBangla,
      cropType: batch.crop_type,
    })
  }

  return alerts
}

function getCropNameBangla(cropType: string): string {
  const cropMap: Record<string, string> = {
    rice: "ধান",
    wheat: "গম",
    potato: "আলু",
    corn: "ভুট্টা",
    soybean: "সয়াবিন",
    maize: "ভুট্টা",
  }
  return cropMap[cropType?.toLowerCase()] || cropType
}

export async function GET() {
  try {
    const supabase = await createClient()
    const userResult = await supabase.auth.getUser()
    const user = (userResult as any)?.data?.user ?? (userResult as any)?.user
    const userError = (userResult as any)?.error ?? null

    if (userError || !user) {
      // Return mock alerts if no auth
      const mockAlerts: GeneratedAlert[] = [
        {
          id: "1",
          riskLevel: "Critical",
          message: "Storage humidity exceeds 70%. Turn on ventilation now.",
          messageBangla: "গুদামের আর্দ্রতা ৭০% অতিক্রম করেছে। এখনই বায়ু সঞ্চালন চালু করুন।",
          timestamp: "2 minutes ago",
          crop: "ধান",
          cropType: "rice",
        },
        {
          id: "2",
          riskLevel: "Low",
          message: "Potato storage conditions are optimal.",
          messageBangla: "আলু গুদামের অবস্থা সর্বোত্তম।",
          suggestion: "Continue regular monitoring and check moisture weekly.",
          suggestionBangla: "নিয়মিত পর্যবেক্ষণ চালিয়ে যান এবং সাপ্তাহিক আর্দ্রতা পরীক্ষা করুন।",
          timestamp: "3 hours ago",
          crop: "আলু",
          cropType: "potato",
        },
      ]
      return NextResponse.json({ data: mockAlerts })
    }

    const userId = user.id
    const { data: batches, error } = await supabase
      .from("crop_batches")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const alerts = await generateAlertsFromBatches(batches || [])
    return NextResponse.json({ data: alerts })
  } catch (err) {
    console.error("[api/alerts/generate]", err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
