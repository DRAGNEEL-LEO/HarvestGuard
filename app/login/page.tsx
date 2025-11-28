"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"

export default function LoginPage() {
  const { language, setLanguage } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [infoMessage, setInfoMessage] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const content = {
    en: {
      title: "Sign In to HarvestGuard",
      subtitle: "Access your crop monitoring dashboard",
      email: "Email Address",
      password: "Password",
      email_placeholder: "your@email.com",
      password_placeholder: "Enter your password",
      sign_in: "Sign In",
      no_account: "Don't have an account?",
      register: "Register here",
      demo_mode: "Demo Mode",
      demo_button: "Try Demo Account",
      signing_in: "Signing in...",
    },
    bn: {
      title: "HarvestGuard এ সাইন ইন করুন",
      subtitle: "আপনার ফসল পর্যবেক্ষণ ড্যাশবোর্ড অ্যাক্সেস করুন",
      email: "ইমেইল ঠিকানা",
      password: "পাসওয়ার্ড",
      email_placeholder: "your@email.com",
      password_placeholder: "আপনার পাসওয়ার্ড লিখুন",
      sign_in: "সাইন ইন করুন",
      no_account: "অ্যাকাউন্ট নেই?",
      register: "এখানে রেজিস্টার করুন",
      demo_mode: "ডেমো মোড",
      demo_button: "ডেমো অ্যাকাউন্ট চেষ্টা করুন",
      signing_in: "সাইন ইন হচ্ছে...",
    },
  }

  const handleResend = async () => {
    setError("")
    setInfoMessage("")
    try {
      const resp = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await resp.json()
      if (!resp.ok) {
        setError(result.error || 'Failed to resend confirmation')
        return
      }
      setInfoMessage(result.message || 'Confirmation email sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleResetPassword = async () => {
    setError("")
    setInfoMessage("")
    try {
      const resp = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await resp.json()
      if (!resp.ok) {
        setError(result.error || 'Failed to send reset email')
        return
      }
      setInfoMessage('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const t = content[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Call server-side login API to avoid client-side network/CORS failures
      // eslint-disable-next-line no-console
      console.debug("Calling /api/auth/login")

      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      // If the server returns a non-JSON body (like an HTML 404), parsing will fail.
      // Check content-type before parsing so we can show a helpful message.
      const contentType = resp.headers.get("content-type") || ""
      let result: any
      if (contentType.includes("application/json")) {
        result = await resp.json()
      } else {
        const text = await resp.text()
        setError(`Server returned an unexpected response: ${text}`)
        return
      }
      // eslint-disable-next-line no-console
      console.debug('/api/auth/login response status:', resp.status, 'body:', result)

      if (!resp.ok) {
          // If server indicated email not confirmed, show UI to resend
          if (resp.status === 403 || (result && /confirm/i.test(result.error || ''))) {
            setError('Email not confirmed. Check your inbox or resend confirmation.')
            return
          }

          setError(result.error || "Sign in failed")
        return
      }

      // If the server returned a session, set it in the browser supabase client
      if (result?.data?.session) {
        try {
          // Set session locally so the browser supabase client is authenticated
          // eslint-disable-next-line no-console
          console.debug('Setting session on browser supabase client')
          const { error: setError } = await supabase.auth.setSession(result.data.session)
          if (setError) {
            setError(setError.message || 'Failed to set session locally')
            return
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to set session')
          return
        }
      }

      if (result?.data?.user || result?.data?.session) {
        try {
          const rawUser = result?.data?.user ?? result?.data?.session?.user
          if (rawUser) {
            const normalized = {
              id: rawUser.id,
              name: rawUser.user_metadata?.name ?? rawUser.name ?? rawUser.email?.split('@')[0],
              email: rawUser.email,
              phone: rawUser.user_metadata?.phone ?? rawUser.phone ?? '',
              // Prefer server-provided preferred language; otherwise fall back to the
              // client-selected language in localStorage (so toggling before login
              // is preserved), then default to 'en'.
              preferredLanguage:
                rawUser.user_metadata?.preferred_language ?? rawUser.user_metadata?.preferredLanguage ?? localStorage.getItem('selectedLanguage') ?? 'en',
              createdAt: rawUser.created_at ?? rawUser.confirmed_at ?? null,
            }

            localStorage.setItem('currentUser', JSON.stringify(normalized))
            localStorage.setItem('farmer', JSON.stringify(normalized))
          }
        } catch (e) {
          // ignore storage errors
        }

        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError("")
    setIsLoading(true)
    
    try {
      // Diagnostic: log supabase URL for demo login attempts
      // eslint-disable-next-line no-console
      console.debug("Supabase URL (demo):", process.env.NEXT_PUBLIC_SUPABASE_URL)
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: "demo@harvestguard.com",
        password: "demo123456",
      })

      if (authError) {
        setError(
          language === "en"
            ? "Demo account not available. Please register first."
            : "ডেমো অ্যাকাউন্ট উপলব্ধ নয়। প্রথমে রেজিস্টার করুন।",
        )
        return
      }

      if (data?.user) {
        // Normalize and persist user locally (same as regular login flow)
        try {
          const rawUser = data.user
          const normalized = {
            id: rawUser.id,
            name: rawUser.user_metadata?.name ?? rawUser.name ?? rawUser.email?.split('@')[0],
            email: rawUser.email,
            phone: rawUser.user_metadata?.phone ?? rawUser.phone ?? '',
            preferredLanguage:
              rawUser.user_metadata?.preferred_language ?? rawUser.user_metadata?.preferredLanguage ?? localStorage.getItem('selectedLanguage') ?? 'en',
            createdAt: rawUser.created_at ?? rawUser.confirmed_at ?? null,
          }

          localStorage.setItem('currentUser', JSON.stringify(normalized))
          localStorage.setItem('farmer', JSON.stringify(normalized))
        } catch (e) {
          // ignore storage errors
        }

        router.push("/dashboard")
      }
    } catch (err) {
      // Provide a clearer message for network-level failures such as "Load failed"
      const message = err instanceof Error ? err.message : "An error occurred"
      if (message === "Load failed" || message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError(
          language === "en"
            ? "Network error: failed to reach Supabase. Check your NEXT_PUBLIC_SUPABASE_URL and internet connection."
            : "নেটওয়ার্ক ত্রুটি: Supabase-এ পৌঁছানো যায়নি। আপনার NEXT_PUBLIC_SUPABASE_URL এবং ইন্টারনেট সংযোগ পরীক্ষা করুন।",
        )
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span>{language === "en" ? "Back" : "ফিরে যান"}</span>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <img src="/images/whatsapp-20image-202025-11-27-20at-2012.jpeg" alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-foreground">HarvestGuard</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              language === "en"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("bn")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              language === "bn"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            বাংলা
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-background rounded-2xl shadow-lg p-8 border border-muted mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t.email}</label>
              <input
                type="email"
                placeholder={t.email_placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t.password}</label>
              <input
                type="password"
                placeholder={t.password_placeholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-muted focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {infoMessage && (
              <div className="flex items-center gap-2 text-primary text-sm bg-primary/10 p-3 rounded-lg">
                <span>{infoMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? t.signing_in : t.sign_in}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button onClick={handleResend} disabled={!email} className="text-sm text-primary hover:underline mr-4">
            Resend confirmation
          </button>
          <button onClick={handleResetPassword} disabled={!email} className="text-sm text-muted-foreground hover:underline">
            Forgot password?
          </button>
        </div>

        <div className="mb-6">
          <p className="text-center text-sm text-muted-foreground mb-3">{t.demo_mode}</p>
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            {t.demo_button}
          </button>
        </div>

        <p className="text-center text-muted-foreground">
          {t.no_account}{" "}
          <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {t.register}
          </Link>
        </p>
      </div>
    </div>
  )
}
