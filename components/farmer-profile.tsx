"use client"

import { Trophy, Leaf, AlertCircle } from "lucide-react"

interface Farmer {
  id: string
  name: string
  email: string
  phone: string
  preferredLanguage: "en" | "bn"
  createdAt: string
}

interface Props {
  farmer: Farmer
  language: "en" | "bn"
}

export default function FarmerProfile({ farmer, language }: Props) {
  const content = {
    en: {
      profile_title: "Your Profile",
      name: "Name",
      email: "Email",
      phone: "Phone",
      joined: "Member Since",
      language: "Language",
      achievements: "Achievements",
      first_harvest: "First Harvest Logged",
      risk_expert: "Risk Mitigator",
      data_guardian: "Data Guardian",
      english: "English",
      bangla: "Bangla",
    },
    bn: {
      profile_title: "আপনার প্রোফাইল",
      name: "নাম",
      email: "ইমেইল",
      phone: "ফোন",
      joined: "যোগদানের সময়",
      language: "ভাষা",
      achievements: "অর্জন",
      first_harvest: "প্রথম ফসল লগ করা হয়েছে",
      risk_expert: "ঝুঁকি প্রশমনকারী",
      data_guardian: "ডেটা সংরক্ষক",
      english: "English",
      bangla: "বাংলা",
    },
  }

  const t = content[language]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "bn-BD")
  }

  return (
    <div className="bg-background rounded-2xl shadow-md border border-muted p-8">
      <h3 className="text-2xl font-bold text-foreground mb-6">{t.profile_title}</h3>

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">{t.name}</p>
          <p className="text-lg font-semibold text-foreground">{farmer.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t.email}</p>
          <p className="text-lg font-semibold text-foreground break-all">{farmer.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t.phone}</p>
          <p className="text-lg font-semibold text-foreground">{farmer.phone}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t.language}</p>
          <p className="text-lg font-semibold text-foreground">
            {farmer.preferredLanguage === "en" ? t.english : t.bangla}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t.joined}</p>
          <p className="text-lg font-semibold text-foreground">{formatDate(farmer.createdAt)}</p>
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">{t.achievements}</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <Trophy className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium text-foreground">{t.first_harvest}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg opacity-50">
            <AlertCircle className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-foreground">{t.risk_expert}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg opacity-50">
            <Leaf className="w-6 h-6 text-secondary" />
            <span className="text-sm font-medium text-foreground">{t.data_guardian}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
