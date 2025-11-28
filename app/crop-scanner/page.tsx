"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Upload, Loader, Video } from "lucide-react"
import ScanResult from "@/components/scan-result"

interface ScanAnalysis {
  status: "fresh" | "rotten" | "unknown"
  confidence: number
  details: string
  detailsBn: string
  recommendations: string[]
  recommendationsBn: string[]
  diseaseDetected: string[]
  severity: "low" | "medium" | "high"
}

export default function CropScannerPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<ScanAnalysis | null>(null)
  const [useCameraMode, setUseCameraMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const content = {
    en: {
      title: "Crop Health Scanner",
      subtitle: "Upload crop photos for AI-powered health analysis",
      upload_photo: "Upload Photo",
      take_photo: "Take Photo with Camera",
      drag_drop: "Or drag and drop your photo here",
      file_size: "Supported formats: JPG, PNG (Max 10MB)",
      analyzing: "Analyzing crop health...",
      back: "Back to Dashboard",
      select_file: "Select Image",
      scan: "Analyze Crop Health",
      capture: "Capture Photo",
      stop_camera: "Stop Camera",
      switch_to_upload: "Switch to File Upload",
      switch_to_camera: "Switch to Camera",
    },
    bn: {
      title: "ফসনের স্বাস্থ্য স্ক্যানার",
      subtitle: "ফসনের ছবি আপলোড করুন AI-চালিত স্বাস্থ্য বিশ্লেষণের জন্য",
      upload_photo: "ছবি আপলোড করুন",
      take_photo: "ক্যামেরা দিয়ে ছবি তুলুন",
      drag_drop: "অথবা আপনার ছবি এখানে টেনে আনুন",
      file_size: "সমর্থিত ফরম্যাট: JPG, PNG (সর্বোচ্চ 10MB)",
      analyzing: "ফসনের স্বাস্থ্য বিশ্লেষণ করছি...",
      back: "ড্যাশবোর্ডে ফিরুন",
      select_file: "চিত্র নির্বাচন করুন",
      scan: "ফসনের স্বাস্থ্য বিশ্লেষণ করুন",
      capture: "ছবি ক্যাপচার করুন",
      stop_camera: "ক্যামেরা বন্ধ করুন",
      switch_to_upload: "ফাইল আপলোডে যান",
      switch_to_camera: "ক্যামেরায় যান",
    },
  }

  const t = content[language]

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setUseCameraMode(true)
    } catch (error) {
      console.error("[v0] Camera error:", error)
      alert(language === "en" ? "Camera access denied" : "ক্যামেরা অ্যাক্সেস অস্বীকার করা হয়েছে")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
            handleFileSelect(file)
            stopCamera()
          }
        })
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setUseCameraMode(false)
  }

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(language === "en" ? "File size must be less than 10MB" : "ফাইল সাইজ ১০ MB এর কম হতে হবে")
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const analyzeCrop = async () => {
    if (!imageFile) {
      alert(language === "en" ? "Please select an image" : "ছবি নির্বাচন করুন")
      return
    }

    setAnalyzing(true)

    // Simulate AI analysis with delay
    setTimeout(() => {
      // Mock analysis - in production, this would call an ML API
      const isHealthy = Math.random() > 0.4
      const confidence = 75 + Math.random() * 20
      const severity = isHealthy ? "low" : Math.random() > 0.5 ? "medium" : "high"

      const mockResult: ScanAnalysis = {
        status: isHealthy ? "fresh" : "rotten",
        confidence: Math.round(confidence),
        details: isHealthy
          ? language === "en"
            ? "Crop appears healthy with good color and texture. No visible signs of decay or disease detected."
            : "ফসন স্বাস্থ্যকর দেখাচ্ছে ভালো রঙ এবং টেক্সচার সহ। কোনো দৃশ্যমান ক্ষয় বা রোগের লক্ষণ নেই।"
          : language === "en"
            ? "Crop shows signs of deterioration. Possible mold growth and moisture damage detected. Immediate action recommended."
            : "ফসন অবনতির লক্ষণ দেখাচ্ছে। সম্ভাব্য ছত্রাক বৃদ্ধি এবং আর্দ্রতা ক্ষতি সনাক্ত করা হয়েছে। তাৎক্ষণিক পদক্ষেপ সুপারিশ করা হয়।",
        detailsBn: "",
        recommendations: isHealthy
          ? [
              language === "en" ? "Continue regular monitoring" : "নিয়মিত পর্যবেক্ষণ চালিয়ে যান",
              language === "en" ? "Maintain current storage conditions" : "বর্তমান সংরক্ষণ অবস্থা বজায় রাখুন",
              language === "en" ? "Schedule weekly inspections" : "সাপ্তাহিক পরিদর্শন নির্ধারণ করুন",
            ]
          : [
              language === "en" ? "Increase ventilation immediately" : "অবিলম্বে বায়ু চলাচল বাড়ান",
              language === "en" ? "Check entire batch for similar issues" : "সম্পূর্ণ ব্যাচে অনুরূপ সমস্যা পরীক্ষা করুন",
              language === "en" ? "Consider applying fungicide treatment" : "ছত্রাকনাশক চিকিত্সা প্রয়োগ বিবেচনা করুন",
            ],
        recommendationsBn: [],
        diseaseDetected: isHealthy
          ? []
          : ["Possible Aflatoxin Mold", "Moisture Damage", "Early Fungal Growth"].slice(
              0,
              Math.floor(Math.random() * 3) + 1,
            ),
        severity,
      }

      setResult(mockResult)
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <img src="/farmers-harvesting-grain-bangladesh.jpg" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <header className="bg-background border-b border-muted shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.back}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload/Camera Section */}
          {!result && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === "en" ? "Upload Crop Image" : "ফসনের ছবি আপলোড করুন"}
              </h2>

              {/* Mode Switcher */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => {
                    setUseCameraMode(false)
                    stopCamera()
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    !useCameraMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span>{t.switch_to_upload}</span>
                </button>
                <button
                  onClick={startCamera}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    useCameraMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>{t.switch_to_camera}</span>
                </button>
              </div>

              {/* Camera Mode */}
              {useCameraMode ? (
                <div className="bg-background rounded-2xl shadow-md border border-muted p-6 mb-6">
                  <div className="relative mb-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black" />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <span>{t.capture}</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                    >
                      {t.stop_camera}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* File Upload Area */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragDrop}
                    className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors mb-6"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{t.drag_drop}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{t.file_size}</p>

                    <div className="flex gap-3 justify-center flex-wrap">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        <span>{t.upload_photo}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Preview */}
              {previewUrl && (
                <div className="bg-background rounded-2xl shadow-md border border-muted p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    {language === "en" ? "Preview" : "প্রিভিউ"}
                  </p>
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full rounded-lg mb-6 max-h-96 object-cover"
                  />
                  <button
                    onClick={analyzeCrop}
                    disabled={analyzing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {analyzing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>{t.analyzing}</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        <span>{t.scan}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* AI Info */}
              <div className="mt-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  {language === "en" ? "How it works" : "এটি কীভাবে কাজ করে"}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>
                      {language === "en" ? "Upload or capture a crop photo" : "ফসনের একটি ছবি আপলোড বা ক্যাপচার করুন"}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>
                      {language === "en"
                        ? "AI analyzes texture, color, and defects"
                        : "AI টেক্সচার, রঙ এবং ত্রুটি বিশ্লেষণ করে"}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>
                      {language === "en" ? "Get health status and recommendations" : "স্বাস্থ্য অবস্থা এবং সুপারিশ পান"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Result Section */}
          {result && !analyzing && <ScanResult result={result} language={language} />}

          {/* Analysis Progress */}
          {analyzing && (
            <div className="flex flex-col items-center justify-center min-h-96 bg-background rounded-2xl shadow-md border border-muted">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-lg font-semibold text-foreground mb-2">{t.analyzing}</p>
              <p className="text-muted-foreground">
                {language === "en" ? "Our AI is examining your crop image..." : "আমাদের AI আপনার ফসনের ছবি পরীক্ষা করছে..."}
              </p>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {result && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setResult(null)
                setImageFile(null)
                setPreviewUrl("")
              }}
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              {language === "en" ? "Scan Another Crop" : "অন্য ফসন স্ক্যান করুন"}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
