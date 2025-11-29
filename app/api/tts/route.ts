import { NextRequest, NextResponse } from "next/server"

interface TTSRequest {
  text: string
  language?: "bn" | "en"
}

export async function POST(req: NextRequest) {
  try {
    const body: TTSRequest = await req.json()
    const { text, language = "bn" } = body

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Use Google Translate TTS endpoint (free, no API key needed)
    // This endpoint returns audio/mpeg file
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob&ttsspeed=0.9`

    // Fetch the audio from Google Translate
    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to generate TTS from Google Translate" },
        { status: 500 }
      )
    }

    const audioBuffer = await response.arrayBuffer()

    // Return audio with proper headers
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (err) {
    console.error("[api/tts] Error:", err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
