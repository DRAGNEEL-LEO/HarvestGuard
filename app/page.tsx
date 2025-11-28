"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Shield, TrendingUp, Zap, BarChart3, Leaf, Cloud, Play } from "lucide-react"
import { DemoModal } from "@/components/demo-modal"
import { useLanguage } from "@/components/language-provider"
import { BANGLADESH_CROPS } from "@/lib/crops"
import { i18n } from "@/lib/i18n"

export default function LandingPage() {
  const { language } = useLanguage()
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [news, setNews] = useState<any[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState("")
  const [expandedNews, setExpandedNews] = useState<Record<number, boolean>>({})

  const t = i18n[language].home
  const nav = i18n[language].nav

  useEffect(() => {
    // detect logged-in user from localStorage so homepage can adapt
    try {
      const stored = localStorage.getItem("currentUser") || localStorage.getItem("farmer")
      if (stored) setCurrentUser(JSON.parse(stored))
    } catch (e) {
      // ignore parse errors
    }

    let mounted = true
    async function loadNews() {
      setNewsLoading(true)
        try {
        const res = await fetch("/api/news")
        if (!res.ok) throw new Error("Failed to fetch news")
        const data = await res.json()
        if (mounted) {
          // show only articles that match the selected language
          const filtered = (data || []).filter((a: any) => a.language === language)
          setNews(filtered)
        }
      } catch (err: any) {
        if (mounted) setNewsError(err?.message || i18n[language].news.error)
      } finally {
        if (mounted) setNewsLoading(false)
      }
    }

    loadNews()

    return () => {
      mounted = false
    }
  }, [language])

  const handleDemoLogin = async () => {
    // lightweight fallback: navigate to dashboard for demo users
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - modern two-column layout */}
      <section className="pt-24 pb-12 px-6 lg:py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6 w-max">
              <Cloud className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.hero_badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              {t.hero_title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">{t.hero_subtitle}</p>

            <div className="flex flex-wrap items-center gap-4">
              {currentUser ? (
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-xl transition-smooth hover:shadow-2xl hover:-translate-y-1">
                  {t.cta_dashboard}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-xl transition-smooth hover:shadow-2xl hover:-translate-y-1">
                    {t.hero_cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setShowDemoModal(true)} className="px-5 py-3 border border-primary rounded-lg text-primary hover:bg-primary/5 transition-smooth hover:-translate-y-0.5">
                    {t.hero_secondary}
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>{t.feature_monitor.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span>{t.feature_bangla.title}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-primary/8 to-accent/6 transition-smooth transform-gpu hover:scale-[1.01]">
              <div className="relative w-full h-96">
                <img src="/images/FARMER.jpg" alt="Hero illustration" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/6 to-transparent mix-blend-overlay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial strip */}
      <section className="py-6 border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/images/whatsapp-20image-202025-11-27-20at-2012.jpeg" alt="logo" className="w-12 h-12 rounded-full" />
              <div>
                <div className="text-sm font-semibold">{t.testimonial_title}</div>
                <div className="text-xs text-muted-foreground">{t.testimonial_sub}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">{i18n[language].home.testimonial_sub}</div>
          </div>
        </div>
      </section>
      {/* Problem Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm mb-2">{t.problem_intro}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "en" ? "Bangladesh Loses Millions in Food Annually" : "বাংলাদেশ বার্ষিক খাদ্য লক্ষ লক্ষ হারায়"}
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto md:overflow-visible py-4 md:justify-center">
            {[
              { stat: t.problem_stat1, desc: t.problem_stat1_desc },
              { stat: t.problem_stat2, desc: t.problem_stat2_desc },
              { stat: t.problem_stat3, desc: t.problem_stat3_desc },
            ].map((item, idx) => (
              <div
                key={idx}
                className="min-w-[18rem] flex-shrink-0 text-center p-8 rounded-2xl bg-background border border-primary/20 transition-smooth soft-card lift-on-hover"
              >
                <div className="text-5xl font-bold text-primary mb-3">{item.stat}</div>
                <p className="text-muted-foreground text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.features_title}</h2>
            <p className="text-xl text-muted-foreground">{t.features_subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: t.feature_monitor.title, desc: t.feature_monitor.desc, icon: <BarChart3 className="w-6 h-6" /> },
              {
                title: t.feature_predict.title,
                desc: t.feature_predict.desc,
                icon: <TrendingUp className="w-6 h-6" />,
              },
              { title: t.feature_health.title, desc: t.feature_health.desc, icon: <Zap className="w-6 h-6" /> },
              { title: t.feature_offline.title, desc: t.feature_offline.desc, icon: <Shield className="w-6 h-6" /> },
              { title: t.feature_bangla.title, desc: t.feature_bangla.desc, icon: <Leaf className="w-6 h-6" /> },
              {
                title: t.feature_rewards.title,
                desc: t.feature_rewards.desc,
                icon: <TrendingUp className="w-6 h-6" />,
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-2xl transition-smooth lift-on-hover group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.how_title}</h2>
            <p className="text-muted-foreground">{t.features_heading}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-background border border-muted text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <Cloud className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-2">{t.how_step1_title}</h3>
              <p className="text-sm text-muted-foreground">{t.how_step1_desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-muted text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-2">{t.how_step2_title}</h3>
              <p className="text-sm text-muted-foreground">{t.how_step2_desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-muted text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-2">{t.how_step3_title}</h3>
              <p className="text-sm text-muted-foreground">{t.how_step3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Trust */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">{t.testimonial_1_text}</h3>
            <div className="text-sm text-muted-foreground">{t.testimonial_1_author}</div>
          </div>

          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="opacity-80 grayscale"> <img src="/images/whatsapp-20image-202025-11-27-20at-2012.jpeg" alt="trust 1" className="h-10" /> </div>
            <div className="opacity-80 grayscale"> <img src="/images/harvestguard-wordmark.svg" alt="trust 2" className="h-8" /> </div>
            <div className="opacity-80 grayscale"> <img src="/images/whatsapp-20image-202025-11-27-20at-2012.jpeg" alt="trust 3" className="h-10" /> </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.getting_started.title}</h2>
            <p className="text-muted-foreground">{language === 'en' ? 'A quick guide to start using HarvestGuard' : 'HarvestGuard ব্যবহার শুরু করার সংক্ষিপ্ত নির্দেশিকা'}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-background border border-muted text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t.getting_started.step1.title}</h3>
              <p className="text-sm text-muted-foreground">{t.getting_started.step1.desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-muted text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t.getting_started.step2.title}</h3>
              <p className="text-sm text-muted-foreground">{t.getting_started.step2.desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-muted text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{t.getting_started.step3.title}</h3>
              <p className="text-sm text-muted-foreground">{t.getting_started.step3.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.cta_title}</h2>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-xl transition-smooth hover:shadow-2xl hover:-translate-y-1 text-lg transform-gpu"
          >
            {t.cta_button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* News Section (moved to end of page) */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{i18n[language].news.latest}</h2>
            <p className="text-muted-foreground">{i18n[language].news.latest_sub}</p>
          </div>

          {newsLoading ? (
            <p className="text-center text-muted-foreground">{i18n[language].news.loading}</p>
          ) : newsError ? (
            <p className="text-center text-destructive">{newsError}</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {news.slice(0, 4).map((item: any) => (
                <article key={item.id} className="p-6 rounded-2xl border border-muted bg-background shadow-sm">
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{item.date} • {item.author}</div>
                      <h3 className="text-lg font-semibold mb-2">
                        <Link href={`/news-articles?id=${item.id}`} className="hover:underline">
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.excerpt}</p>
                      <div className="text-sm text-foreground" style={{maxHeight: expandedNews[item.id] ? 'none' : '4.5rem', overflow: 'hidden'}}>
                        {item.content}
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedNews((s) => ({ ...s, [item.id]: !s[item.id] }))}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          {expandedNews[item.id] ? i18n[language].news.show_less : i18n[language].news.show_more}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <img src="/images/whatsapp-20image-202025-11-27-20at-2012.jpeg" alt="Logo" className="w-6 h-6" />
            <span className="font-semibold">{t.nav}</span>
          </div>
          <p className="text-muted-foreground">{t.footer_tagline}</p>
          <div className="border-t border-border mt-8 pt-8 text-sm text-muted-foreground">
            <p>© 2025 HarvestGuard. {language === "en" ? "All rights reserved." : "সর্বস্বত্ব সংরক্ষিত।"}</p>
          </div>
        </div>
      </footer>

      <DemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onDemoLogin={handleDemoLogin}
        language={language}
      />
    </div>
  )
}
