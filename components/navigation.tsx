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
  const navItems = [
    { href: "/weather", label: navLabels.weather, id: "weather" },
    { href: "/risk-analysis", label: navLabels.risk, id: "risk" },
    { href: "/crop-scanner", label: navLabels.scanner, id: "scanner" },
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
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 bg-background/70 backdrop-blur-md border border-border rounded-2xl shadow-[var(--elev-1)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/90 rounded-lg flex items-center justify-center ring-1 ring-primary/10 shadow-sm">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <img
              src="/images/harvestguard-wordmark.svg"
              alt={navLabels.brand}
              className="h-6 sm:h-8 block"
              onError={(e: any) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <span className="sr-only">{navLabels.brand}</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {navLabels.dashboard}
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}

            { !currentUser && (
              <Link href="/register" className="ml-3 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md">
                {navLabels.get_started || (language === "en" ? "Get Started" : "শুরু করুন")}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              // Show avatar + dropdown with profile and logout
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80">
                      <Avatar>
                        {currentUser?.avatarUrl ? (
                          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name || currentUser.email} />
                        ) : (
                          <AvatarFallback>{(currentUser.name || currentUser.email || 'U')[0]?.toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="hidden sm:inline">{currentUser.name || currentUser.email?.split('@')[0]}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>{currentUser.name || currentUser.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => router.push('/dashboard')}>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={async () => {
                        try {
                          const supabase = createClient()
                          await supabase.auth.signOut()
                        } catch (e) {
                          // ignore
                        } finally {
                          try {
                            localStorage.removeItem('currentUser')
                            localStorage.removeItem('farmer')
                          } catch {}
                          setCurrentUser(null)
                          router.push('/')
                        }
                      }}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-block px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80">
                {navLabels.login}
              </Link>
            )}

            <ThemeToggle />

            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
            >
              {navLabels.langToggle}
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              {navLabels.dashboard}
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {currentUser ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
                  {currentUser.name || currentUser.email?.split('@')[0] || navLabels.dashboard}
                </Link>
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
                  className="w-full text-left block px-4 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
                {navLabels.login}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
