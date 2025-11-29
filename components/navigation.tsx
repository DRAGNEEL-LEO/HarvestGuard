"use client"

import Link from "next/link"
import { Leaf, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { i18n } from "@/lib/i18n"

import { createClient } from "@/lib/supabase/client"
import { usePathname } from "next/navigation"

export function Navigation({ currentPage }: { currentPage?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const router = useRouter()

  const navLabels = i18n[language].nav

  // Core features that should remain visible in the top nav
  const coreItems = [
    { href: "/weather", label: navLabels.weather, id: "weather" },
    { href: "/smart-alerts", label: language === "en" ? "Smart Alerts" : "স্মার্ট সতর্কতা", id: "smart-alerts" },
    { href: "/risk-map", label: language === "en" ? "Risk Map" : "ঝুঁকি মানচিত্র", id: "risk-map" },
    { href: "/crop-scanner", label: navLabels.scanner, id: "scanner" },
  ]

  // Additional features (kept reachable under Dashboard dropdown and profile menu)
  const moreItems = [
    { href: "/risk-analysis", label: navLabels.risk, id: "risk" },
    { href: "/pest-detection", label: language === "en" ? "Pest ID" : "কীটপতঙ্গ", id: "pest-detection" },
    { href: "/voice-assistant", label: language === "en" ? "Voice" : "ভয়েস", id: "voice-assistant" },
    { href: "/news-articles", label: i18n[language].news?.latest || "News", id: "news" },
  ]

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = typeof window !== "undefined" && (localStorage.getItem("currentUser") || localStorage.getItem("farmer"))
        if (stored) {
          const parsed = JSON.parse(stored)
          // eslint-disable-next-line no-console
          console.debug('[nav] loaded user from localStorage', parsed)
          setCurrentUser(parsed)
          return
        }

        // fall back to reading from supabase client session if present
        const supabase = createClient()
        const { data, error } = await supabase.auth.getUser()
        if (!error && data?.user) {
          const u = data.user
          const normalized = {
            id: u.id,
            name: u.user_metadata?.name ?? u.email?.split('@')[0],
            email: u.email,
          }
          // eslint-disable-next-line no-console
          console.debug('[nav] loaded user from supabase session', normalized)
          setCurrentUser(normalized)
        } else {
          setCurrentUser(null)
        }
        } catch (e) {
        // ignore read errors
        setCurrentUser(null)
      }
    }

    loadUser()

    const supabase = createClient()
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = session.user
        const normalized = {
          id: u.id,
          name: u.user_metadata?.name ?? u.email?.split('@')[0],
          email: u.email,
        }
        setCurrentUser(normalized)
      } else {
        setCurrentUser(null)
      }
    })

    return () => {
      try {
        listener?.subscription.unsubscribe()
      } catch {}
    }
  }, [pathname, language])

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 bg-background/70 backdrop-blur-md border border-border rounded-2xl shadow-[var(--elev-1)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg flex-shrink-0">
            <img
              src="/harvestguardlogo1.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-lg shadow-sm object-cover"
              onError={(e: any) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <img
              src="/images/harvestguard-wordmark.svg"
              alt={navLabels.brand}
              className="h-6 hidden sm:block"
              onError={(e: any) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </Link>

          {/* Desktop Core Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              {navLabels.dashboard}
            </Link>
            {coreItems.map((item) => (
              <Link key={item.id} href={item.href} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              // User logged in - show profile dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 transition-colors">
                    <Avatar className="w-6 h-6">
                      {currentUser?.avatarUrl ? (
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name || currentUser.email} />
                      ) : (
                        <AvatarFallback className="text-xs">{(currentUser.name || currentUser.email || 'U')[0]?.toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name || currentUser.email?.split('@')[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{currentUser.name || currentUser.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push('/dashboard')}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* All features in profile dropdown */}
                  <DropdownMenuLabel className="text-xs text-muted-foreground">{language === "en" ? "Tools" : "সরঞ্জাম"}</DropdownMenuLabel>
                  {coreItems.map((item) => (
                    <DropdownMenuItem key={item.id} onSelect={() => router.push(item.href)}>{item.label}</DropdownMenuItem>
                  ))}
                  {moreItems.map((it) => (
                    <DropdownMenuItem key={it.id} onSelect={() => router.push(it.href)}>{it.label}</DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={async () => {
                    try {
                      const supabase = createClient()
                      await supabase.auth.signOut()
                    } catch (e) {}
                    finally {
                      try {
                        localStorage.removeItem('currentUser')
                        localStorage.removeItem('farmer')
                      } catch {}
                      setCurrentUser(null)
                      router.push('/')
                    }
                  }}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // User not logged in
              <Link href="/register" className="hidden md:inline-block px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                {navLabels.get_started || "Get Started"}
              </Link>
            )}

            <ThemeToggle />

            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="px-2 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 transition-colors hidden sm:block"
            >
              {language === "en" ? "বাং" : "EN"}
            </button>

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-border pt-2">
            <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              {navLabels.dashboard}
            </Link>
            {coreItems.map((item) => (
              <Link key={item.id} href={item.href} className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border my-2 pt-2">
              {moreItems.map((it) => (
                <Link key={it.id} href={it.href} className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
                  {it.label}
                </Link>
              ))}
            </div>
            {currentUser ? (
              <>
                <button
                  onClick={async () => {
                    try {
                      const supabase = createClient()
                      await supabase.auth.signOut()
                    } catch {}
                    try {
                      localStorage.removeItem('currentUser')
                      localStorage.removeItem('farmer')
                    } catch {}
                    setMobileOpen(false)
                    setCurrentUser(null)
                    router.push('/')
                  }}
                  className="w-full text-left block px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
                {navLabels.login}
              </Link>
            )}
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              {language === "en" ? "বাংলা" : "English"}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
