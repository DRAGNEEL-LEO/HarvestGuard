export const BANGLADESH_CROPS = [
  { value: "Paddy/Rice", en: "Paddy/Rice", bn: "ধান/চাল" },
  { value: "Wheat", en: "Wheat", bn: "গম" },
  { value: "Maize", en: "Maize", bn: "ভুট্টা" },
  { value: "Pulses", en: "Pulses", bn: "ডাল/শিম" },
  { value: "Potatoes", en: "Potatoes", bn: "আলু" },
  { value: "Onions", en: "Onions", bn: "পেঁয়াজ" },
  { value: "Garlic", en: "Garlic", bn: "রসুন" },
  { value: "Tomatoes", en: "Tomatoes", bn: "টমেটো" },
  { value: "Cabbage", en: "Cabbage", bn: "কপি/স্তন" },
  { value: "Cauliflower", en: "Cauliflower", bn: "ফুলকপি" },
  { value: "Brinjal", en: "Brinjal", bn: "বেগুন" },
  { value: "Cucumber", en: "Cucumber", bn: "শসা" },
  { value: "Pumpkin", en: "Pumpkin", bn: "কুমড়ো" },
  { value: "Jute", en: "Jute", bn: "পাট" },
  { value: "Cotton", en: "Cotton", bn: "কটন" },
  { value: "Sugar Cane", en: "Sugar Cane", bn: "চিনিগোলার" },
  { value: "Mustard", en: "Mustard", bn: "সরিষা" },
  { value: "Sesame", en: "Sesame", bn: "তিল" },
  { value: "Turmeric", en: "Turmeric", bn: "হলুদ" },
  { value: "Ginger", en: "Ginger", bn: "আদা" },
]

export type CropItem = {
  value: string
  en: string
  bn: string
}

export const cropLabel = (item: CropItem, lang: "en" | "bn") => (lang === "bn" ? item.bn : item.en)
