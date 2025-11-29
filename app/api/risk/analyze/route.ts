import { NextRequest, NextResponse } from "next/server"

interface RiskAnalysisRequest {
  batchId: string
  cropType: string
  estimatedWeight: number
  storageLocation: string
  storageType: string
  createdAt: string
  moistureLevel?: number
  temperatureLevel?: number
}

interface RiskAnalysisResponse {
  batchId: string
  riskLevel: "low" | "medium" | "high" | "critical"
  etcl: number
  etclLabel: string
  afflatoxinRisk: boolean
  moistureLevel: number
  temperatureLevel: number
  recommendation: string
  recommendationBn: string
}

export async function POST(req: NextRequest) {
  try {
    const body: RiskAnalysisRequest = await req.json()
    const {
      batchId,
      cropType,
      estimatedWeight,
      storageLocation,
      storageType,
      createdAt,
      moistureLevel: providedMoisture,
      temperatureLevel: providedTemperature,
    } = body

    if (!batchId || !cropType) {
      return NextResponse.json(
        { error: "Missing required fields: batchId and cropType" },
        { status: 400 }
      )
    }

    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json(
        {
          error: "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY to .env.local",
        },
        { status: 500 }
      )
    }

    // Calculate days in storage
    const daysInStorage = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Use provided moisture/temperature or generate realistic values
    const moistureLevel = providedMoisture || 55 + Math.random() * 30
    const temperatureLevel = providedTemperature || 25 + Math.random() * 10

    // Call Gemini API to analyze risk
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
                  text: `You are an expert agricultural storage and crop risk assessment specialist. Analyze the following crop storage situation and provide a risk assessment.

Batch Information:
- Crop Type: ${cropType}
- Weight: ${estimatedWeight} kg
- Storage Type: ${storageType}
- Storage Location: ${storageLocation}
- Days in Storage: ${daysInStorage} days
- Moisture Level: ${Math.round(moistureLevel)}%
- Temperature: ${Math.round(temperatureLevel)}°C

Please respond in JSON format ONLY (no markdown, no extra text):
{
  "riskLevel": "low|medium|high|critical",
  "riskLevelBn": "কম|মাঝারি|উচ্চ|গুরুতর",
  "etcl": 144,
  "etclLabel": "Low - 4+ days",
  "etclLabelBn": "কম - ৪+ দিন",
  "afflatoxinRisk": false,
  "recommendation": "Detailed English recommendation for the farmer",
  "recommendationBn": "বিস্তারিত বাংলা সুপারিশ"
}

Based on the moisture level, temperature, storage type, and days in storage, assess:
1. The ETCL (Estimated Time to Critical Loss) in hours
2. Whether there's afflatoxin mold risk (high moisture + warmth + time = higher risk)
3. Specific recommendations for preserving the crop
4. Consider the storage type and location in your assessment

For ETCL classification:
- Critical (<24 hours): Moisture >75% AND Temperature >30°C
- High (24-96 hours): Moisture >70% OR Temperature >28°C
- Medium (72-168 hours): Moisture >65% OR Temperature >25°C
- Low (144+ hours): Normal storage conditions

Provide practical, actionable recommendations in both English and Bengali.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error("[api/risk/analyze] Gemini API error:", errorData)
      return NextResponse.json(
        { error: "Failed to analyze risk with Gemini", details: errorData },
        { status: 500 }
      )
    }

    const geminiData = await geminiResponse.json()
    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textContent) {
      return NextResponse.json(
        { error: "No response from Gemini API" },
        { status: 500 }
      )
    }

    // Parse JSON response from Gemini
    let riskAnalysis: any
    try {
      const cleanedText = textContent.replace(/```json\n?|\n?```/g, "").trim()
      riskAnalysis = JSON.parse(cleanedText)
    } catch (parseErr) {
      console.error("[api/risk/analyze] JSON parse error:", parseErr, "Raw text:", textContent)
      return NextResponse.json(
        { error: "Failed to parse Gemini response", details: textContent },
        { status: 500 }
      )
    }

    // Validate ETCL is a number
    const etcl = parseFloat(riskAnalysis.etcl) || 144
    const etclLabel =
      riskAnalysis.etclLabel ||
      (etcl < 24
        ? "Critical - Less than 1 day"
        : etcl < 48
          ? "High - 1-2 days"
          : etcl < 96
            ? "Medium - 2-4 days"
            : "Low - 4+ days")

    const response: RiskAnalysisResponse = {
      batchId,
      riskLevel: riskAnalysis.riskLevel || "medium",
      etcl,
      etclLabel,
      afflatoxinRisk: riskAnalysis.afflatoxinRisk || false,
      moistureLevel: Math.round(moistureLevel * 100) / 100,
      temperatureLevel: Math.round(temperatureLevel * 100) / 100,
      recommendation: riskAnalysis.recommendation || "Regular monitoring recommended.",
      recommendationBn: riskAnalysis.recommendationBn || "নিয়মিত পর্যবেক্ষণ সুপারিশ করা হয়।",
    }

    return NextResponse.json({ data: response })
  } catch (err) {
    console.error("[api/risk/analyze] Error:", err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
