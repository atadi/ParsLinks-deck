"use client"

import type { JSX } from "react"

import type { Bilingual } from "./categories"
import * as B2C from "./slides/b2c"
import * as B2B from "./slides/b2b"
import * as INV from "./slides/investment"
import * as TA from "./slides/technical-a"
import * as TB from "./slides/technical-b"

export interface DeckSlide {
  id: string
  /** footer label */
  section: Bilingual
  /** overview label */
  title: Bilingual
  Comp: () => JSX.Element
}

const STRATEGY: Bilingual = { fa: "استراتژی", en: "Strategy" }
const PRODUCT: Bilingual = { fa: "محصول", en: "Product" }
const VALUE: Bilingual = { fa: "ارزش", en: "Value" }
const PARTNERSHIP: Bilingual = { fa: "مشارکت", en: "Partnership" }
const MOAT: Bilingual = { fa: "تمایز", en: "Moat" }
const VISION: Bilingual = { fa: "چشم‌انداز", en: "Vision" }
const ARCH: Bilingual = { fa: "معماری", en: "Architecture" }
const appendix = (fa: string, en: string): Bilingual => ({
  fa: `پیوست · ${fa}`,
  en: `Appendix · ${en}`,
})

export const SLIDES: Record<string, DeckSlide> = {
  /* ---------------- product story ---------------- */
  shift: {
    id: "shift",
    section: STRATEGY,
    title: { fa: "تحول در زیرساختِ ابری", en: "The Shift in Cloud Infrastructure" },
    Comp: B2C.Shift,
  },
  missing: {
    id: "missing",
    section: STRATEGY,
    title: { fa: "لایه‌ی گمشده", en: "The Missing Layer" },
    Comp: B2C.Missing,
  },
  whatis: {
    id: "whatis",
    section: PRODUCT,
    title: { fa: "ParsLinks چیست؟", en: "What is ParsLinks?" },
    Comp: B2C.WhatIs,
  },
  devexp: {
    id: "devexp",
    section: PRODUCT,
    title: { fa: "تجربه‌ی توسعه‌دهنده", en: "The Developer Experience" },
    Comp: B2C.DevExp,
  },
  fordev: {
    id: "fordev",
    section: PRODUCT,
    title: { fa: "چرا برای توسعه‌دهندگان مهم است", en: "Why This Matters for Developers" },
    Comp: B2C.ForDev,
  },
  capabilities: {
    id: "capabilities",
    section: PRODUCT,
    title: { fa: "قابلیت‌های پلتفرم", en: "Platform Capabilities" },
    Comp: B2C.Capabilities,
  },

  /* ---------------- partnership & strategy ---------------- */
  partner: {
    id: "partner",
    section: VALUE,
    title: {
      fa: "از ارائه‌دهنده‌ی زیرساخت به پلتفرم",
      en: "From Infrastructure Provider to Platform",
    },
    Comp: B2B.Partner,
  },
  strategic: {
    id: "strategic",
    section: VALUE,
    title: {
      fa: "پلتفرمِ اپلیکیشنِ بومی",
      en: "A Native Application Platform",
    },
    Comp: B2B.Strategic,
  },
  partnership: {
    id: "partnership",
    section: PARTNERSHIP,
    title: { fa: "مدلِ مشارکت", en: "Partnership Model" },
    Comp: B2B.Partnership,
  },
  moat: {
    id: "moat",
    section: MOAT,
    title: { fa: "چرا ساختنِ ParsLinks دشوار است", en: "Why ParsLinks Is Hard to Build" },
    Comp: B2B.Moat,
  },

  /* ---------------- investment ---------------- */
  opportunity: {
    id: "opportunity",
    section: PARTNERSHIP,
    title: { fa: "فرصت", en: "The Opportunity" },
    Comp: INV.Opportunity,
  },
  needs: {
    id: "needs",
    section: PARTNERSHIP,
    title: { fa: "آنچه برای مقیاس‌دهی لازم است", en: "What We Need to Scale" },
    Comp: INV.Needs,
  },
  roadmap: {
    id: "roadmap",
    section: PARTNERSHIP,
    title: { fa: "نقشه‌ی راهِ مرحله‌ای", en: "A Phased Roadmap" },
    Comp: INV.Roadmap,
  },
  vision: {
    id: "vision",
    section: VISION,
    title: { fa: "چشم‌انداز", en: "Vision" },
    Comp: INV.Vision,
  },

  /* ---------------- technical appendix ---------------- */
  wheresits: {
    id: "wheresits",
    section: ARCH,
    title: { fa: "ParsLinks در کجای معماری", en: "Where ParsLinks Sits" },
    Comp: TA.WhereSits,
  },
  platformarch: {
    id: "platformarch",
    section: ARCH,
    title: { fa: "معماریِ پلتفرم", en: "Platform Architecture" },
    Comp: TA.PlatformArch,
  },
  lifecycle: {
    id: "lifecycle",
    section: ARCH,
    title: { fa: "چرخه‌ی حیاتِ استقرار", en: "Deployment Lifecycle" },
    Comp: TA.Lifecycle,
  },
  a1: {
    id: "a1",
    section: appendix("۰۱", "01"),
    title: { fa: "معماریِ تفصیلیِ سیستم", en: "Detailed System Architecture" },
    Comp: TA.A1,
  },
  a2: {
    id: "a2",
    section: appendix("۰۲", "02"),
    title: { fa: "Control در برابر Data Plane", en: "Control vs Data Plane" },
    Comp: TA.A2,
  },
  a3: {
    id: "a3",
    section: appendix("۰۳", "03"),
    title: { fa: "اجرای ایزوله‌ی اپلیکیشن‌ها", en: "Running Applications in Isolation" },
    Comp: TA.A3,
  },
  a4: {
    id: "a4",
    section: appendix("۰۴", "04"),
    title: { fa: "معماریِ خطِ لوله‌ی Build", en: "Build Pipeline Architecture" },
    Comp: TA.A4,
  },
  a5: {
    id: "a5",
    section: appendix("۰۵", "05"),
    title: { fa: "شبکه و مسیریابی", en: "Networking & Routing" },
    Comp: TB.A5,
  },
  a6: {
    id: "a6",
    section: appendix("۰۶", "06"),
    title: { fa: "مقیاس‌پذیریِ خودکار", en: "Autoscaling Architecture" },
    Comp: TB.A6,
  },
  a7: {
    id: "a7",
    section: appendix("۰۷", "07"),
    title: { fa: "معماریِ ذخیره‌سازی", en: "Storage Architecture" },
    Comp: TB.A7,
  },
  a8: {
    id: "a8",
    section: appendix("۰۸", "08"),
    title: { fa: "مشاهده‌پذیری و لاگ", en: "Observability & Logging" },
    Comp: TB.A8,
  },
  a9: {
    id: "a9",
    section: appendix("۰۹", "09"),
    title: { fa: "مدلِ امنیتی", en: "Security Model" },
    Comp: TB.A9,
  },
  a10: {
    id: "a10",
    section: appendix("۱۰", "10"),
    title: { fa: "دسترس‌پذیری بالا و بازیابی", en: "High Availability & Recovery" },
    Comp: TB.A10,
  },
}
