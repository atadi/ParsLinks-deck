import type { T as Bilingual } from "@/app/providers"

/** A named deck: ordered slide ids plus display metadata. Server-safe (no "use client"). */
export interface DeckMeta {
  slug: string
  title: Bilingual
  tagline: Bilingual
  slides: string[]
}

export const DECKS: DeckMeta[] = [
  {
    slug: "main",
    title: { fa: "ParsLinks × NovinHost", en: "ParsLinks × NovinHost" },
    tagline: { fa: "داستانِ اصلیِ ارائه", en: "The main presentation story" },
    slides: [
      "vision",
      "together",
      "shift",
      "opportunity",
      "oppmap",
      "layers",
      "scenarios",
      "foundation",
      "brings",
      "models",
      "pilot",
      "discussion",
    ],
  },
  {
    slug: "technical",
    title: { fa: "بررسیِ فنی", en: "Technical Deep Dive" },
    tagline: { fa: "شاخه‌ی اختیاری — قابل رد کردن", en: "Optional branch — may be skipped" },
    slides: [
      "t_overview",
      "t_planes",
      "t_lifecycle",
      "t_runtime",
      "t_networking",
      "t_storage",
      "t_observability",
      "t_security",
      "t_metering",
      "t_region",
      "t_integration",
    ],
  },
]

export const DECK_MAP: Record<string, DeckMeta> = Object.fromEntries(DECKS.map((d) => [d.slug, d]))

export const DECK_SLUGS = DECKS.map((d) => d.slug)
