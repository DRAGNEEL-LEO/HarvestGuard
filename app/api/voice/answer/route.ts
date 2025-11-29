import { NextRequest, NextResponse } from "next/server"

interface VoiceQuestionRequest {
  question: string
  language?: "en" | "bn"
}

interface VoiceAnswerResponse {
  answer: string
  answerBangla: string
  confidence: number
}

export async function POST(req: NextRequest) {
  try {
    const body: VoiceQuestionRequest = await req.json()
    const { question, language = "bn" } = body

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    // Call Gemini to generate agriculture-specific answers in Bangla
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
                  text: `You are an expert agricultural advisor for Bangladeshi farmers. Answer the following question about farming, crop management, pest control, storage, or related agricultural topics.

Question: "${question}"

IMPORTANT: Respond ONLY in valid JSON format (no markdown, no extra text):
{
  "answerEnglish": "Brief answer in English",
  "answerBangla": "উত্তর বাংলায়",
  "confidence": 0.95
}

Make sure:
1. The Bangla answer is practical, actionable, and specific to Bangladesh farming conditions
2. Use proper Bengali script
3. Keep answers concise but informative (2-3 sentences)
4. Provide local/traditional methods when applicable
5. Confidence should be 0-1 (higher for questions you're very confident about)`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error("[api/voice/answer] Gemini API error:", errorData)
      return NextResponse.json(
        { error: "Failed to generate answer from Gemini" },
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
    let answer: VoiceAnswerResponse
    try {
      const cleanedText = textContent.replace(/```json\n?|\n?```/g, "").trim()
      const parsed = JSON.parse(cleanedText)
      answer = {
        answer: parsed.answerEnglish || parsed.answer || "Unable to generate answer",
        answerBangla: parsed.answerBangla || "উত্তর তৈরি করতে অক্ষম",
        confidence: parsed.confidence || 0.7,
      }
    } catch (parseErr) {
      console.error("[api/voice/answer] JSON parse error:", parseErr, "Raw text:", textContent)
      // Fallback to mock response if parse fails
      answer = {
        answer: "I can help with agricultural questions about crops, pest management, storage, and farming techniques.",
        answerBangla: "আমি ফসল, কীটপতঙ্গ নিয়ন্ত্রণ, গুদাম ব্যবস্থাপনা এবং কৃষি কৌশল সম্পর্কে প্রশ্নে সহায়তা করতে পারি।",
        confidence: 0.6,
      }
    }

    return NextResponse.json({ data: answer })
  } catch (err) {
    console.error("[api/voice/answer] Error:", err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
