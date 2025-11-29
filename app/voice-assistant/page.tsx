"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { i18n } from "@/lib/i18n"
import Link from "next/link"
import { ArrowLeft, Mic, MicOff, Volume2, Copy, Send } from "lucide-react"
interface Message {
  id: string
  role: "user" | "assistant"
  text: string
  textBangla: string
}

// Mock answers for common Bangla questions
const getMockAnswer = (question: string): { text: string; bangla: string } => {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes("আবহাওয়া") || lowerQuestion.includes("weather") || lowerQuestion.includes("আজ")) {
    return {
      text: "Today's weather is partly cloudy with 65% humidity. Rain expected by evening.",
      bangla: "আজকের আবহাওয়া আংশিক মেঘলা এবং ৬৫% আর্দ্রতা। সন্ধ্যায় বৃষ্টির সম্ভাবনা।",
    }
  }

  if (lowerQuestion.includes("ধান") || lowerQuestion.includes("rice") || lowerQuestion.includes("অবস্থা") || lowerQuestion.includes("condition")) {
    return {
      text: "Your rice crop is in good condition. Monitor for plant hoppers this week.",
      bangla: "আপনার ধান ফসল ভালো অবস্থায় আছে। এই সপ্তাহে গাছ বিছু পর্যবেক্ষণ করুন।",
    }
  }

  if (lowerQuestion.includes("গুদাম") || lowerQuestion.includes("storage")) {
    return {
      text: "Keep storage humidity below 70%. Ensure proper ventilation and check for mold.",
      bangla: "গুদামের আর্দ্রতা ৭০% এর নিচে রাখুন। সঠিক বায়ু সঞ্চালন নিশ্চিত করুন এবং ছাঁচ পরীক্ষা করুন।",
    }
  }

  if (lowerQuestion.includes("কাট") || lowerQuestion.includes("harvest") || lowerQuestion.includes("কবে")) {
    return {
      text: "Harvest your rice when it reaches 25-30% moisture content, typically in 2 weeks.",
      bangla: "যখন ধান ২৫-৩০% আর্দ্রতায় পৌঁছায় তখন কাটুন, সাধারণত ২ সপ্তাহে।",
    }
  }

  if (lowerQuestion.includes("কীটনাশক") || lowerQuestion.includes("pesticide")) {
    return {
      text: "Apply pesticide in early morning or late evening. Always follow safety instructions on the label.",
      bangla: "ভোরবেলা বা সন্ধ্যায় কীটনাশক প্রয়োগ করুন। লেবেলের নিরাপত্তা নির্দেশনা অনুসরণ করুন।",
    }
  }

  return {
    text: "I can help with weather, crop status, storage tips, harvest timing, and pest management. Ask a question!",
    bangla: "আমি আবহাওয়া, ফসলের অবস্থা, গুদাম ব্যবস্থাপনা, ফসল কাটার সময় এবং কীটপতঙ্গ নিয়ন্ত্রণে সহায়তা করতে পারি।",
  }
}

export default function VoiceAssistantPage() {
  const { language } = useLanguage()
  const t = i18n[language].voiceAssistant
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [textInput, setTextInput] = useState("")
  const recognitionRef = useRef<any>(null)
  const submitQuestionRef = useRef<(question: string) => void>()
  const [showCommonQuestions, setShowCommonQuestions] = useState(true)
  const [error, setError] = useState("")

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.lang = language === "bn" ? "bn-BD" : "en-US"
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setTranscript("")
          setError("")
        }

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const text = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              setTranscript(text)
              // Auto-submit the recognized text when speech recognition ends
              if (submitQuestionRef.current) {
                setTimeout(() => {
                  submitQuestionRef.current?.(text)
                }, 300)
              }
            } else {
              interimTranscript += text
            }
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          setIsListening(false)
          const errorMessages: { [key: string]: string } = {
            "no-speech": "No speech detected. Please speak clearly and try again.",
            "audio-capture": "No microphone found. Please check your microphone permissions.",
            "network": "Network error. Please check your internet connection.",
            "not-allowed": "Microphone permission denied. Please allow access to your microphone.",
            "service-not-allowed": "Speech recognition service not allowed.",
          }
          const msg = errorMessages[event.error] || `Speech recognition error: ${event.error}`
          setError(msg)
          console.error("Speech recognition error", event.error)
        }
      }
    }
  }, [language])

  const handleStartListening = () => {
    if (recognitionRef.current) {
      setError("")
      setTranscript("")
      recognitionRef.current.start()
      // Auto-stop after 15 seconds
      setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
        }
      }, 15000)
    }
  }

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleSubmitQuestion = (questionText: string) => {
    if (!questionText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      text: questionText,
      textBangla: language === "bn" ? questionText : "",
    }
    setMessages((prev) => [...prev, userMessage])
    setTranscript("")
    setTextInput("")
    setShowCommonQuestions(false)

    // Simulate assistant response after a delay
    setTimeout(() => {
      const answer = getMockAnswer(questionText)
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        text: language === "en" ? answer.text : answer.bangla,
        textBangla: answer.bangla,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Speak the response using Google TTS (Bangla support)
      if (typeof window !== "undefined") {
        speakBangla(answer.bangla)
      }
    }, 800)
  }

  // Store the function in a ref so it can be accessed from event handlers
  useEffect(() => {
    submitQuestionRef.current = handleSubmitQuestion
  }, [language])

  const speakBangla = async (text: string) => {
    try {
      // Call our server TTS endpoint (uses Google Translate TTS with native Bangla accent)
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: "bn" }),
      })

      if (!response.ok) {
        throw new Error("TTS request failed")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play().catch((err) => {
        console.warn("Audio playback failed:", err)
      })
    } catch (err) {
      console.warn("Google Translate TTS failed, using fallback:", err)
      // Fallback to native Speech Synthesis
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "bn-BD"
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const commonQuestions = [
    t.q1,
    t.q2,
    t.q3,
    t.q4,
    t.q5,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>{language === "en" ? "Back to Dashboard" : "ড্যাশবোর্ডে ফিরুন"}</span>
          </Link>

          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Chat Area */}
        <div className="bg-background rounded-2xl shadow-lg border border-muted overflow-hidden flex flex-col h-96 mb-6">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Volume2 className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">{language === "en" ? "Start by asking a question..." : "একটি প্রশ্ন জিজ্ঞাসা করে শুরু করুন..."}</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Voice Input Area */}
          <div className="border-t border-muted p-4 bg-muted/50">
            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              {isListening ? (
                <>
                  <button
                    onClick={handleStopListening}
                    className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <MicOff className="w-5 h-5" />
                    {t.stop_listening}
                  </button>
                  <p className="text-sm text-muted-foreground animate-pulse">{t.listening}</p>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartListening}
                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    {t.start_listening}
                  </button>
                  {transcript && (
                    <p className="text-sm text-muted-foreground">{transcript}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Text Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder={language === "en" ? "Or type your question..." : "বা আপনার প্রশ্ন টাইপ করুন..."}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmitQuestion(textInput)
              }
            }}
            className="flex-1 px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
          />
          <button
            onClick={() => handleSubmitQuestion(textInput)}
            disabled={!textInput.trim()}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            {t.answer}
          </button>
        </div>

        {/* Common Questions */}
        {showCommonQuestions && (
          <div className="p-6 rounded-lg border border-muted bg-background">
            <h3 className="font-semibold mb-4">{t.common_questions}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {commonQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmitQuestion(q)}
                  className="text-left p-3 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground">
            {language === "en"
              ? "Use the voice input button to ask questions in Bangla or English. Or type your question. The assistant will provide answers based on your crop data and local agriculture practices."
              : "বাংলা বা ইংরেজিতে প্রশ্ন জিজ্ঞাসা করতে ভয়েস ইনপুট বাটন ব্যবহার করুন। অথবা আপনার প্রশ্ন টাইপ করুন।"}
          </p>
        </div>
      </div>
    </div>
  )
}
