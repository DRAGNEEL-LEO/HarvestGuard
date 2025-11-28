"use client"

import { X, LogIn, Leaf } from "lucide-react"
import Link from "next/link"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  onDemoLogin: () => void
  language: "en" | "bn"
}

export function DemoModal({ isOpen, onClose, onDemoLogin, language }: DemoModalProps) {
  if (!isOpen) return null

  const content = {
    en: {
      title: "How to Use HarvestGuard",
      steps: [
        {
          num: 1,
          title: "Register Your Crops",
          desc: "Add crop batches with harvest details and storage information. All data is saved locally.",
        },
        {
          num: 2,
          title: "Monitor Real-Time Weather",
          desc: "Get 5-day forecasts and location-specific advisories in your preferred language.",
        },
        {
          num: 3,
          title: "Analyze Crop Health",
          desc: "Upload crop photos for AI analysis to detect quality and potential diseases.",
        },
        {
          num: 4,
          title: "Get Risk Predictions",
          desc: "Receive ETCL calculations and actionable recommendations based on conditions.",
        },
      ],
      tryDemo: "Try Demo Account",
      createAccount: "Create Your Account",
      or: "or",
    },
    bn: {
      title: "HarvestGuard কীভাবে ব্যবহার করবেন",
      steps: [
        {
          num: 1,
          title: "আপনার ফসল নিবন্ধন করুন",
          desc: "ফসলের ব্যাচ যোগ করুন এবং সংরক্ষণের তথ্য দিন। সমস্ত ডেটা স্থানীয়ভাবে সংরক্ষিত হয়।",
        },
        {
          num: 2,
          title: "রিয়েল-টাইম আবহাওয়া পর্যবেক্ষণ করুন",
          desc: "৫-দিনের পূর্বাভাস এবং স্থান-নির্দিষ্ট পরামর্শ পান।",
        },
        {
          num: 3,
          title: "ফসলের স্বাস্থ্য বিশ্লেষণ করুন",
          desc: "AI বিশ্লেষণের জন্য ফসলের ছবি আপলোড করুন।",
        },
        {
          num: 4,
          title: "ঝুঁকি পূর্বাভাস পান",
          desc: "ETCL গণনা এবং কার্যকর সুপারিশ পান।",
        },
      ],
      tryDemo: "ডেমো অ্যাকাউন্ট চেষ্টা করুন",
      createAccount: "আপনার অ্যাকাউন্ট তৈরি করুন",
      or: "অথবা",
    },
  }

  const t = content[language]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {t.steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  {step.num}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground mb-4">{t.or}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={onDemoLogin}
                className="p-6 rounded-xl border-2 border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <LogIn className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-semibold">{t.tryDemo}</h5>
                  <p className="text-sm text-muted-foreground">Pre-loaded sample data</p>
                </div>
              </button>
              <Link
                href="/register"
                className="p-6 rounded-xl border-2 border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-semibold">{t.createAccount}</h5>
                  <p className="text-sm text-muted-foreground">Start fresh with your data</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
