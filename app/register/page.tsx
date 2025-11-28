"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, AlertCircle, Leaf } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { language, setLanguage } = useLanguage()
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    preferredLanguage: language as "en" | "bn",
  })

  const content = {
    en: {
      title: "Join HarvestGuard",
      subtitle: "Protect your harvest with AI-powered insights",
      step1_title: "Basic Information",
      step1_name: "Full Name",
      step1_email: "Email Address",
      step1_phone: "Phone Number",
      step1_placeholder_name: "Your full name",
      step1_placeholder_email: "your@email.com",
      step1_placeholder_phone: "+880...",
      step2_title: "Security Setup",
      step2_password: "Password",
      step2_confirm: "Confirm Password",
      step2_placeholder_password: "Create a strong password",
      language_title: "Preferred Language",
      english: "English",
      bangla: "বাংলা",
      next_button: "Next",
      back_button: "Back",
      complete_button: "Create Account",
      already_member: "Already have an account?",
      sign_in: "Sign in",
      success_title: "Registration Successful!",
      success_message: "Welcome to HarvestGuard. Your account has been created successfully.",
      go_dashboard: "Go to Dashboard",
      validation_name: "Please enter your full name",
      validation_email: "Please enter a valid email",
      validation_phone: "Please enter a valid phone number",
      validation_password: "Password must be at least 6 characters",
      validation_password_match: "Passwords do not match",
      error: "Error",
      password_strength: "Password strength",
      weak: "Weak",
      good: "Good",
      strong: "Strong",
    },
    bn: {
      title: "HarvestGuard-এ যোগ দিন",
      subtitle: "AI-চালিত অন্তর্দৃষ্টি দিয়ে আপনার ফসল রক্ষা করুন",
      step1_title: "মৌলিক তথ্য",
      step1_name: "পূর্ণ নাম",
      step1_email: "ইমেইল ঠিকানা",
      step1_phone: "ফোন নম্বর",
      step1_placeholder_name: "আপনার পূর্ণ নাম",
      step1_placeholder_email: "your@email.com",
      step1_placeholder_phone: "+880...",
      step2_title: "নিরাপত্তা সেটআপ",
      step2_password: "পাসওয়ার্ড",
      step2_confirm: "পাসওয়ার্ড নিশ্চিত করুন",
      step2_placeholder_password: "একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন",
      language_title: "পছন্দের ভাষা",
      english: "English",
      bangla: "বাংলা",
      next_button: "পরবর্তী",
      back_button: "ফিরে যান",
      complete_button: "অ্যাকাউন্ট তৈরি করুন",
      already_member: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      sign_in: "সাইন ইন করুন",
      success_title: "রেজিস্ট্রেশন সফল!",
      success_message: "HarvestGuard-এ স্বাগতম। আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
      go_dashboard: "ড্যাশবোর্ডে যান",
      validation_name: "আপনার পূর্ণ নাম লিখুন",
      validation_email: "একটি বৈধ ইমেইল লিখুন",
      validation_phone: "একটি বৈধ ফোন নম্বর লিখুন",
      validation_password: "পাসওয়ার্ড কমপক্ষে 6 অক্ষরের হতে হবে",
      validation_password_match: "পাসওয়ার্ড মেলে না",
      error: "ত্রুটি",
      password_strength: "পাসওয়ার্ড শক্তি",
      weak: "দুর্বল",
      good: "ভাল",
      strong: "শক্তিশালী",
    },
  }

  const t = content[language]

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^\+?880\d{9,10}$|^\d{10,11}$/.test(phone.replace(/\s/g, ""))
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return 0
    if (password.length < 8) return 1
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 3
    return 2
  }

  const handleNext = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t.validation_name
    if (!validateEmail(formData.email)) newErrors.email = t.validation_email
    if (!validatePhone(formData.phone)) newErrors.phone = t.validation_phone

    if (Object.keys(newErrors).length === 0) {
      setErrors({})
      setStep(2)
    } else {
      setErrors(newErrors)
    }
  }

  const handleBack = () => {
    setStep(1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (formData.password.length < 6) newErrors.password = t.validation_password
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t.validation_password_match

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // Use server-side API to perform signup (avoids browser CORS/network issues)
      // eslint-disable-next-line no-console
      console.debug("Calling /api/auth/signup")

      const resp = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          preferredLanguage: formData.preferredLanguage,
        }),
      })

      // Guard against non-JSON responses (e.g., 404/HTML error pages) which would throw when parsing.
      let result: any
      const contentType = resp.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        result = await resp.json()
      } else {
        const text = await resp.text()
        setErrors({ submit: `Server error: ${text}` })
        return
      }

      if (!resp.ok) {
        setErrors({ submit: result.error || "Registration failed" })
        return
      }

      // If confirmation is required, show the confirmation success screen
      if (result.confirmationRequired) {
        setLanguage(formData.preferredLanguage)
        setSuccess(true)
        setErrors({})
        return
      }

      // Regular successful signup (user created and usable immediately)
      setLanguage(formData.preferredLanguage)
      setSuccess(true)
      setErrors({})

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      if (message === "Load failed" || message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setErrors({
          submit:
            language === "en"
              ? "Network error: failed to reach Supabase. Check your NEXT_PUBLIC_SUPABASE_URL and internet connection."
              : "নেটওয়ার্ক ত্রুটি: Supabase-এ পৌঁছানো যায়নি। আপনার NEXT_PUBLIC_SUPABASE_URL এবং ইন্টারনেট সংযোগ পরীক্ষা করুন।",
        })
      } else {
        setErrors({ submit: message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-foreground">{t.success_title}</h1>
            <p className="text-muted-foreground mb-8">{t.success_message}</p>
            <Link
              href="/dashboard"
              className="inline-block w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {t.go_dashboard}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = [t.weak, t.good, t.strong]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === "en" ? "Back" : "ফিরে যান"}</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="hidden md:flex flex-col justify-between rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground p-8 relative">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <img src="/images/whatsapp-20image-202025-11-27-20at-2012.jpeg" alt="Logo" className="w-10 h-10" />
                <span className="text-xl font-bold">HarvestGuard</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome to HarvestGuard</h2>
              <p className="text-primary-foreground/90 text-lg leading-relaxed">
                Protect your harvest with AI-powered monitoring, real-time alerts, and expert recommendations to reduce
                food loss.
              </p>
            </div>

            <div className="absolute bottom-0 right-0 opacity-10">
              <Leaf className="w-48 h-48" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  language === "en"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  language === "bn"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                বাংলা
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl shadow-xl p-8 border border-border flex-1 flex flex-col"
            >
              <div className="flex gap-3 mb-8">
                <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">{t.step1_title}</h2>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.step1_name}</label>
                    <input
                      type="text"
                      placeholder={t.step1_placeholder_name}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors bg-background text-foreground placeholder-muted-foreground focus:outline-none ${
                        errors.name
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.step1_email}</label>
                    <input
                      type="email"
                      placeholder={t.step1_placeholder_email}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors bg-background text-foreground placeholder-muted-foreground focus:outline-none ${
                        errors.email
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.step1_phone}</label>
                    <input
                      type="tel"
                      placeholder={t.step1_placeholder_phone}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors bg-background text-foreground placeholder-muted-foreground focus:outline-none ${
                        errors.phone
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg mt-8"
                  >
                    {t.next_button}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">{t.step2_title}</h2>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.step2_password}</label>
                    <input
                      type="password"
                      placeholder={t.step2_placeholder_password}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors bg-background text-foreground placeholder-muted-foreground focus:outline-none ${
                        errors.password
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">{t.password_strength}:</span>
                          <span className="text-xs font-semibold text-primary">{strengthLabels[passwordStrength]}</span>
                        </div>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={`flex-1 h-1 rounded-full transition-colors ${
                                i <= passwordStrength ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.step2_confirm}</label>
                    <input
                      type="password"
                      placeholder={t.step2_placeholder_password}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors bg-background text-foreground placeholder-muted-foreground focus:outline-none ${
                        errors.confirmPassword
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">{t.language_title}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredLanguage: "en" })}
                        className={`py-2 rounded-lg font-medium transition-all ${
                          formData.preferredLanguage === "en"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {t.english}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredLanguage: "bn" })}
                        className={`py-2 rounded-lg font-medium transition-all ${
                          formData.preferredLanguage === "bn"
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {t.bangla}
                      </button>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </div>
                  )}

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                    >
                      {t.back_button}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? "Creating..." : t.complete_button}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="text-center mt-6 text-muted-foreground">
              {t.already_member}{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                {t.sign_in}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
