import { NextRequest, NextResponse } from "next/server"

interface PestAnalysisRequest {
  imageBase64: string
  croppingArea?: string
}

interface PestAnalysisResponse {
  pestName: string
  pestNameBangla: string
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  riskLevelBangla: string
  description: string
  descriptionBangla: string
  treatmentPlan: string
  treatmentPlanBangla: string
  confidence: number
}

export async function POST(req: NextRequest) {
  try {
    const body: PestAnalysisRequest = await req.json()
    const { imageBase64, croppingArea } = body

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY to .env.local" },
        { status: 500 }
      )
    }

    // Call Gemini Vision API
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
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
                text: `You are an expert agricultural pest identification specialist. Analyze this crop image and identify any pests present.

Please respond in JSON format ONLY (no markdown, no extra text):
{
  "pestName": "English pest name or 'No pest detected'",
  "pestNameBangla": "Bengali pest name",
  "riskLevel": "Low|Medium|High|Critical",
  "riskLevelBangla": "কম|মাঝারি|উচ্চ|গুরুতর",
  "description": "Detailed description of the pest and its characteristics in English",
  "descriptionBangla": "বিস্তারিত বর্ণনা বাংলায়",
  "treatmentPlan": "Practical treatment steps in English",
  "treatmentPlanBangla": "বাংলায় ব্যবহারিক চিকিৎসা পদক্ষেপ",
  "confidence": 0.95
}

Analyze the crop carefully for common agricultural pests like insects, diseases, or fungi. If no pest is detected, indicate 'No pest detected'.${croppingArea ? ` The crop area is: ${croppingArea}` : ""}`,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageBase64.split(",")[1] || imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!geminiResponse.ok) {
      let errorData = {}
      try {
        errorData = await geminiResponse.json()
      } catch (e) {
        errorData = { message: 'Failed to read error body from Gemini' }
      }
      console.error("[api/pest/analyze] Gemini API error:", errorData)

      // Fallback: return a safe mock analysis so the UI remains functional
      const fallbackAnalysis: PestAnalysisResponse = {
        pestName: "Unknown",
        pestNameBangla: "অজানা",
        riskLevel: "Low",
        riskLevelBangla: "কম",
        description: "Gemini API returned an error. Unable to analyze image right now.",
        descriptionBangla: "Gemini API ত্রুটি => ইমেজ বিশ্লেষণ করা যাচ্ছে না।",
        treatmentPlan: "Keep the crop under observation and try again later.",
        treatmentPlanBangla: "ফসল পর্যবেক্ষণ করুন এবং পরে আবার চেষ্টা করুন।",
        confidence: 0,
      }

      return NextResponse.json({ data: fallbackAnalysis, warning: 'Gemini API error', details: errorData })
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
    let analysis: PestAnalysisResponse
    try {
      // Clean up potential markdown code blocks
      const cleanedText = textContent.replace(/```json\n?|\n?```/g, "").trim()
      analysis = JSON.parse(cleanedText)
    } catch (parseErr) {
      console.error("[api/pest/analyze] JSON parse error:", parseErr, "Raw text:", textContent)
      return NextResponse.json(
        { error: "Failed to parse Gemini response", details: textContent },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: analysis })
  } catch (err) {
    console.error("[api/pest/analyze] Error:", err)

    // On network/DNS or unexpected errors, return a safe fallback so UI doesn't break.
    const fallbackAnalysis: PestAnalysisResponse = {
      pestName: "Unknown",
      pestNameBangla: "অজানা",
      riskLevel: "Low",
      riskLevelBangla: "কম",
      description: "Unable to reach Gemini service. Please check your network or API key.",
      descriptionBangla: "Gemini সার্ভিসে পৌঁছায়নি। নেটওয়ার্ক বা API কী পরীক্ষা করুন।",
      treatmentPlan: "Keep the crop under observation and try again later.",
      treatmentPlanBangla: "ফসল পর্যবেক্ষণ করুন এবং পরে আবার চেষ্টা করুন।",
      confidence: 0,
    }

    return NextResponse.json({ data: fallbackAnalysis, error: (err as Error).message })
  }
}
