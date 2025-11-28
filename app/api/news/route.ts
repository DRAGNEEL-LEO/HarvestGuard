import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const agriculturalNews = [
    {
      id: 1,
      title: "Bangladesh Rice Production Reaches Record Levels",
      category: "News",
      date: "2025-02-20",
      excerpt: "Government reports show record rice production this season with improved storage techniques...",
      content:
        "Bangladesh has achieved record rice production levels in 2025, driven by improved storage infrastructure and farmer education initiatives. The government attributes this success to HarvestGuard-like technologies reducing post-harvest losses.",
      image: "/rice-harvest-bangladesh.jpg",
      author: "Ministry of Agriculture",
      language: "en",
    },
    {
      id: 2,
      title: "নতুন সংরক্ষণ কৌশল খাদ্য ক্ষতি ৩৫% কমিয়েছে",
      category: "সংবাদ",
      date: "2025-02-18",
      excerpt: "বাংলাদেশ কৃষি বিভাগ নতুন সংরক্ষণ পদ্ধতির ফলাফল প্রকাশ করেছে যা উল্লেখযোগ্য ফলাফল দেখিয়েছে...",
      content:
        "সাম্প্রতিক গবেষণা অনুযায়ী, উন্নত সংরক্ষণ কৌশল ব্যবহার করে খাদ্য ক্ষতি ৩৫% পর্যন্ত হ্রাস পেয়েছে। এই সাফল্য ছোট কৃষকদের জন্য বড় সম্ভাবনা তৈরি করছে।",
      image: "/farmers-harvesting-grain-bangladesh.jpg",
      author: "বাংলাদেশ কৃষি সংবাদ",
      language: "bn",
    },
    {
      id: 3,
      title: "AI-Powered Crop Monitoring Gains Traction in South Asia",
      category: "Technology",
      date: "2025-02-15",
      excerpt:
        "Tech companies are deploying AI solutions for crop monitoring across South Asia, improving yields and reducing losses...",
      content:
        "Artificial intelligence is revolutionizing agriculture in South Asia. Real-time crop monitoring systems using computer vision can detect diseases and moisture problems early, allowing farmers to take preventive action before significant losses occur.",
      image: "/agriculture-technology-ai-monitoring.jpg",
      author: "Tech Innovation Weekly",
      language: "en",
    },
    {
      id: 4,
      title: "জলবায়ু পরিবর্তন এবং কৃষি: নতুন চ্যালেঞ্জ মোকাবেলা",
      category: "গবেষণা",
      date: "2025-02-10",
      excerpt: "জলবায়ু পরিবর্তন বাংলাদেশের কৃষি খাতে নতুন চ্যালেঞ্জ তৈরি করছে কিন্তু সমাধানও রয়েছে...",
      content:
        "বিশ্ববিদ্যালয়ের গবেষণা দেখায় যে জলবায়ু-স্থিতিস্থাপক ফসল চাষ এবং উন্নত সংরক্ষণ কৌশল চ্যালেঞ্জগুলি মোকাবেলা করতে পারে। কৃষকদের প্রশিক্ষণ এবং প্রযুক্তি অ্যাক্সেস মূল চাবিকাঠি।",
      image: "/climate-resilient-farming-techniques.jpg",
      author: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
      language: "bn",
    },
    {
      id: 5,
      title: "Sustainable Farming Practices Increase Farmer Income by 40%",
      category: "Journal",
      date: "2025-02-05",
      excerpt:
        "New study reveals that sustainable farming practices combined with proper storage can increase farmer income significantly...",
      content:
        "A comprehensive study published in the Agricultural Economics Journal shows that farmers implementing sustainable practices with modern storage solutions see a 40% increase in net income. This includes reduced waste and better market prices.",
      image: "/sustainable-farming-practices-income.jpg",
      author: "Agricultural Economics Journal",
      language: "en",
    },
    {
      id: 6,
      title: "ডিজিটাল কৃষি: তরুণ প্রজন্মের জন্য নতুন সুযোগ",
      category: "সাক্ষাৎকার",
      date: "2025-01-28",
      excerpt: "তরুণ উদ্যোক্তারা বাংলাদেশে ডিজিটাল কৃষি সমাধান নিয়ে আসছে যা কৃষিকে আধুনিক করছে...",
      content:
        "সাক্ষাৎকারে স্থানীয় স্টার্টআপ প্রতিষ্ঠাতারা ব্যাখ্যা করেন কীভাবে ডিজিটাল প্রযুক্তি গ্রামীণ কৃষকদের ক্ষমতায়ন করছে এবং তাদের আয় বৃদ্ধি করছে।",
      image: "/digital-agriculture-youth-entrepreneurs.jpg",
      author: "স্টার্টআপ বাংলাদেশ",
      language: "bn",
    },
  ]

  return NextResponse.json(agriculturalNews)
}
