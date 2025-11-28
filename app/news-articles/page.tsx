"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Newspaper } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"

interface Article {
  id: number
  title: string
  category: string
  date: string
  excerpt: string
  content: string
  image: string
  author: string
  language: string
}

export default function NewsPage() {
  const { language, setLanguage } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "news" | "research" | "journal">("all")
  const searchParams = useSearchParams()

  const content = {
    en: {
      title: "Agricultural News & Insights",
      subtitle: "Latest updates from Bangladesh agriculture sector",
      back: "Back to Dashboard",
      read_more: "Read More",
      loading: "Loading articles...",
      no_articles: "No articles found",
      categories: {
        all: "All Articles",
        news: "News",
        research: "Research",
        journal: "Journal Articles",
      },
      by: "By",
      published: "Published",
    },
    bn: {
      title: "কৃষি সংবাদ এবং অন্তর্দৃষ্টি",
      subtitle: "বাংলাদেশ কৃষি খাতের সর্বশেষ আপডেট",
      back: "ড্যাশবোর্ডে ফিরুন",
      read_more: "আরও পড়ুন",
      loading: "নিবন্ধ লোড হচ্ছে...",
      no_articles: "কোনো নিবন্ধ পাওয়া যায়নি",
      categories: {
        all: "সমস্ত নিবন্ধ",
        news: "সংবাদ",
        research: "গবেষণা",
        journal: "জার্নাল নিবন্ধ",
      },
      by: "লেখক",
      published: "প্রকাশিত",
    },
  }

  const t = content[language]

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/news")
        const data: Article[] = await res.json()
        setAllArticles(data || [])
        // filter articles to the currently selected language for the list view
        const filtered = (data || []).filter((a: any) => a.language === language)
        setArticles(filtered)
      } catch (error) {
        console.error("[v0] Error fetching news:", error)
      }
      setLoading(false)
    }

    fetchArticles()
  }, [language])

  // If an `id` param is present, auto-open that article after articles load
  useEffect(() => {
    const idParam = searchParams?.get("id")
    if (!idParam) return
    const id = Number(idParam)
    if (isNaN(id)) return
    if (allArticles.length === 0) return

    // Always try to load the full article by id from the complete dataset (not just the filtered list)
    const foundInAll = allArticles.find((a) => a.id === id)
    if (foundInAll) {
      setSelectedArticle(foundInAll)
      return
    }

    // fallback: try the filtered list (shouldn't be necessary)
    const found = articles.find((a) => a.id === id)
    if (found) setSelectedArticle(found)
    else setSelectedArticle(null)
  }, [searchParams, allArticles, articles])

  // If the opened article language doesn't match the user's selected language, we'll keep
  // showing the full article but display a small notice. This preserves the detailed view
  // while making language mismatch clear.

  const filteredArticles = articles.filter((article) => {
    if (filter === "all") return true
    if (filter === "news") return article.category === "News" || article.category === "সংবাদ"
    if (filter === "research") return article.category === "Research" || article.category === "গবেষণা"
    if (filter === "journal") return article.category === "Journal" || article.category === "সাক্ষাৎকার"
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <img
          src="/rice-paddy-field-sunset-agriculture-bangladesh.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <header className="bg-background border-b border-muted shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-primary" />
              {t.title}
            </h1>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedArticle ? (
          // Article Detail View
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 mb-6 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === "en" ? "Back to Articles" : "নিবন্ধগুলিতে ফিরুন"}</span>
            </button>

            <article className="bg-background rounded-2xl shadow-md border border-muted overflow-hidden">
              <img
                src={selectedArticle.image || "/placeholder.svg"}
                alt={selectedArticle.title}
                className="w-full h-96 object-cover"
              />

              <div className="p-8">
                <div className="mb-4 flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {selectedArticle.category}
                  </span>
                  <span className="text-muted-foreground text-sm">{selectedArticle.date}</span>
                  <span className="text-muted-foreground text-sm">
                    {t.by} {selectedArticle.author}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-foreground mb-6">{selectedArticle.title}</h1>

                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                  {String(selectedArticle.content)
                    .split(/\n{2,}/)
                    .map((para, idx) => (
                      <p key={idx} className="text-lg mb-6">
                        {para}
                      </p>
                    ))}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-4">
                {language === "en" ? "Filter Articles" : "নিবন্ধ ফিল্টার করুন"}
              </label>
              <div className="flex gap-3 flex-wrap">
                {(["all", "news", "research", "journal"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {t.categories[cat]}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t.loading}</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted-foreground">{t.no_articles}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-background rounded-xl shadow-md border border-muted overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-xs font-semibold">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{article.date}</span>
                        <span className="text-primary font-medium">{t.read_more}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
