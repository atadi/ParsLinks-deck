/**
 * categories.ts — plain data, server-importable (no "use client").
 *
 * A slide's track is JUST an entry in the `slides` array below.
 * Moving a slide between tracks is a one-line edit.
 */

export interface Bilingual {
  fa: string
  en: string
}

export interface CategoryMeta {
  slug: string
  index: string
  tagline: string
  accent: string
  title: Bilingual
  desc: Bilingual
  slides: string[]
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "b2c",
    index: "01",
    tagline: "product story",
    accent: "var(--color-turq)",
    title: { fa: "روایتِ محصول", en: "Product Story" },
    desc: {
      fa: "برای توسعه‌دهندگان: چه چیزی می‌سازیم، چرا اهمیت دارد و تجربه‌ی استقرار چگونه است.",
      en: "For developers: what we build, why it matters, and what deploying feels like.",
    },
    slides: ["shift", "missing", "whatis", "devexp", "fordev", "capabilities"],
  },
  {
    slug: "b2b",
    index: "02",
    tagline: "partnership & strategy",
    accent: "var(--color-saffron)",
    title: { fa: "مشارکت و استراتژی", en: "Partnership & Strategy" },
    desc: {
      fa: "برای شریکِ زیرساخت: چرا این لایه ارزشِ زیرساختِ موجود را افزایش می‌دهد.",
      en: "For the infrastructure partner: why this layer raises the value of existing infrastructure.",
    },
    slides: ["partner", "strategic", "partnership", "moat"],
  },
  {
    slug: "investment",
    index: "03",
    tagline: "investment plans",
    accent: "var(--color-turq-deep)",
    title: { fa: "برنامه‌های سرمایه‌گذاری", en: "Investment Plans" },
    desc: {
      fa: "فرصت، نیازهای مقیاس‌دهی و نقشه‌ی راهِ مرحله‌ای — بر پایه‌ی استدلال، نه اعدادِ ساختگی.",
      en: "The opportunity, what scaling needs, and a phased roadmap — argued logically, not from invented figures.",
    },
    slides: ["opportunity", "needs", "roadmap", "vision"],
  },
  {
    slug: "technical",
    index: "A",
    tagline: "technical appendix",
    accent: "var(--color-ink)",
    title: { fa: "پیوستِ فنی", en: "Technical Appendix" },
    desc: {
      fa: "عمقِ فنی به‌درخواست: معماری، ایزولاسیون، شبکه، مقیاس‌پذیری، امنیت و بازیابی.",
      en: "Technical depth on demand: architecture, isolation, networking, scaling, security and recovery.",
    },
    slides: [
      "wheresits",
      "platformarch",
      "lifecycle",
      "a1",
      "a2",
      "a3",
      "a4",
      "a5",
      "a6",
      "a7",
      "a8",
      "a9",
      "a10",
    ],
  },
]

export const CATEGORY_MAP: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
)

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug)
