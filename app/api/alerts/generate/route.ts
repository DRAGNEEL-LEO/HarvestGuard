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

// Helper: generate alerts using Gemini API based on crop batch data
async function generateAlertsWithGemini(batches: CropBatch[]): Promise<GeneratedAlert[]> {
  const alerts: GeneratedAlert[] = []
  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

  if (!geminiApiKey || batches.length === 0) {
    return generateMockAlerts()
  }

  const now = new Date()

  for (const batch of batches) {
    const harvestDate = new Date(batch.harvest_date)
    const daysAgo = Math.floor((now.getTime() - harvestDate.getTime()) / (1000 * 60 * 60 * 24))
    const cropNameBangla = getCropNameBangla(batch.crop_type)

    try {
      // Call Gemini API to assess risk and generate alert
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiApiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert agricultural alert system. Analyze this crop batch storage situation and generate a smart alert.

Crop Information:
- Crop Type: ${batch.crop_type}
- Storage Type: ${batch.storage_type}
- Storage Location: ${batch.storage_location}
- Days in Storage: ${daysAgo}
- Moisture Level: ${batch.moisture_level ?? "unknown"}%
- Temperature: ${batch.temperature ?? "unknown"}°C

Please respond in JSON format ONLY (no markdown, no extra text):
{
  "riskLevel": "Critical|High|Medium|Low",
  "message": "English alert message describing the situation",
  "messageBangla": "বাংলা সতর্কতা বার্তা",
  "suggestion": "English recommendation for low risk only",
  "suggestionBangla": "বাংলা সুপারিশ শুধুমাত্র কম ঝুঁকির জন্য"
}

Assessment criteria:
- CRITICAL: Moisture >70% OR Temp >32°C OR mold risk detected OR immediate action needed
- HIGH: Moisture 60-70% OR Temp 28-32°C OR stored >45 days in unsuitable conditions
- MEDIUM: Moisture 50-60% OR Temp 25-28°C OR stored >30 days
- LOW: Optimal conditions with no immediate concerns

For Low risk only, provide helpful suggestions. For higher risks, focus on the danger.
Be specific about the ${batch.crop_type} crop and its storage requirements.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 512,
            },
          }),
        }
      )

      if (!geminiResponse.ok) {
        console.error("[api/alerts] Gemini API error:", await geminiResponse.json())
        // Fallback to mock for this batch
        alerts.push(...generateMockAlertsForBatch(batch, daysAgo, cropNameBangla))
        continue
      }

      const geminiData = await geminiResponse.json()
      const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

      if (!textContent) {
        alerts.push(...generateMockAlertsForBatch(batch, daysAgo, cropNameBangla))
        continue
      }

      // Parse JSON response from Gemini
      let alertData: any
      try {
        const cleanedText = textContent.replace(/```json\n?|\n?```/g, "").trim()
        alertData = JSON.parse(cleanedText)
      } catch (parseErr) {
        console.error("[api/alerts] JSON parse error:", parseErr)
        alerts.push(...generateMockAlertsForBatch(batch, daysAgo, cropNameBangla))
        continue
      }

      alerts.push({
        id: `alert_${batch.id}`,
        riskLevel: alertData.riskLevel || "Medium",
        message: alertData.message || "Unable to assess risk.",
        messageBangla: alertData.messageBangla || "ঝুঁকি মূল্যায়ন করতে অক্ষম।",
        suggestion: alertData.suggestion,
        suggestionBangla: alertData.suggestionBangla,
        timestamp: `${daysAgo} days ago`,
        crop: cropNameBangla,
        cropType: batch.crop_type,
      })
    } catch (error) {
      console.error("[api/alerts] Error calling Gemini for batch", batch.id, error)
      // Fallback to mock for this batch
      alerts.push(...generateMockAlertsForBatch(batch, daysAgo, cropNameBangla))
    }
  }

  return alerts
}

// Fallback mock alert generator
function generateMockAlerts(): GeneratedAlert[] {
  return [
    {
      id: "1",
      riskLevel: "Low",
      message: "No active crop batches. Add a batch to get smart alerts.",
      messageBangla: "কোনো সক্রিয় ফসলের ব্যাচ নেই। স্মার্ট সতর্কতা পেতে একটি ব্যাচ যোগ করুন।",
      timestamp: "now",
      crop: "ধান",
      cropType: "rice",
    },
  ]
}

function generateMockAlertsForBatch(batch: CropBatch, daysAgo: number, cropNameBangla: string): GeneratedAlert[] {
  // Simple fallback logic if Gemini fails
  let riskLevel: "Critical" | "High" | "Medium" | "Low" = "Low"
  let message = ""
  let messageBangla = ""

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
  }

  return [
    {
      id: `alert_${batch.id}`,
      riskLevel,
      message,
      messageBangla,
      timestamp: `${daysAgo} days ago`,
      crop: cropNameBangla,
      cropType: batch.crop_type,
    },
  ]
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

    const alerts = await generateAlertsWithGemini(batches || [])
    return NextResponse.json({ data: alerts })
  } catch (err) {
    console.error("[api/alerts/generate]", err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
