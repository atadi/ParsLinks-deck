"use client"

import type { JSX } from "react"

import type { T as Bilingual } from "@/app/providers"
import { DECK_MAP, type DeckMeta } from "./decks"
import * as MAIN from "./slides/main"
import * as TECH from "./slides/technical"

export interface DeckSlide {
  id: string
  /** footer label */
  section: Bilingual
  /** overview label */
  title: Bilingual
  Comp: () => JSX.Element
}

const MAIN_SEC: Bilingual = { fa: "داستانِ اصلی", en: "Main Story" }
const TECH_SEC: Bilingual = { fa: "بررسیِ فنی", en: "Technical Deep Dive" }

/* ---------------- slide registry ---------------- */

export const SLIDES: Record<string, DeckSlide> = {
  /* ============ MAIN STORY (presenter-controlled) ============ */
  vision: { id: "vision", section: MAIN_SEC, title: { fa: "چشم‌انداز", en: "Vision" }, Comp: MAIN.Vision },
  together: { id: "together", section: MAIN_SEC, title: { fa: "با هم", en: "Together" }, Comp: MAIN.CapabilitiesSplit },
  shift: { id: "shift", section: MAIN_SEC, title: { fa: "از منابع تا محصول", en: "Resources → Products" }, Comp: MAIN.InfraToProducts },
  opportunity: { id: "opportunity", section: MAIN_SEC, title: { fa: "فرصت", en: "Opportunity" }, Comp: MAIN.OpportunityMsg },
  oppmap: { id: "oppmap", section: MAIN_SEC, title: { fa: "نقشه‌ی فرصت", en: "Opportunity Map" }, Comp: MAIN.OpportunityMap },
  layers: { id: "layers", section: MAIN_SEC, title: { fa: "لایه‌های معماری", en: "Architecture Layers" }, Comp: MAIN.LayeredDiagram },
  scenarios: { id: "scenarios", section: MAIN_SEC, title: { fa: "سناریوها", en: "Scenarios" }, Comp: MAIN.Scenarios },
  foundation: { id: "foundation", section: MAIN_SEC, title: { fa: "پایه‌ی فناوری", en: "Foundation" }, Comp: MAIN.Foundation },
  brings: { id: "brings", section: MAIN_SEC, title: { fa: "آورده‌ی ParsLinks", en: "What ParsLinks Brings" }, Comp: MAIN.WhatBrings },
  models: { id: "models", section: MAIN_SEC, title: { fa: "مدل‌های مشارکت", en: "Partnership Models" }, Comp: MAIN.PartnershipModels },
  pilot: { id: "pilot", section: MAIN_SEC, title: { fa: "پایلوت", en: "Pilot" }, Comp: MAIN.Pilot },
  discussion: { id: "discussion", section: MAIN_SEC, title: { fa: "بحث", en: "Discussion" }, Comp: MAIN.Discussion },

  /* ============ TECHNICAL DEEP DIVE (optional) ============ */
  t_overview: { id: "t_overview", section: TECH_SEC, title: { fa: "نمای کلیِ معماری", en: "Architecture Overview" }, Comp: TECH.TechOverview },
  t_planes: { id: "t_planes", section: TECH_SEC, title: { fa: "صفحه‌ها", en: "Planes" }, Comp: TECH.TechPlanes },
  t_lifecycle: { id: "t_lifecycle", section: TECH_SEC, title: { fa: "چرخه‌ی استقرار", en: "Lifecycle" }, Comp: TECH.TechLifecycle },
  t_runtime: { id: "t_runtime", section: TECH_SEC, title: { fa: "مدلِ اجرا", en: "Runtime Model" }, Comp: TECH.TechRuntime },
  t_networking: { id: "t_networking", section: TECH_SEC, title: { fa: "شبکه", en: "Networking" }, Comp: TECH.TechNetworking },
  t_storage: { id: "t_storage", section: TECH_SEC, title: { fa: "ذخیره‌سازی", en: "Storage" }, Comp: TECH.TechStorage },
  t_observability: { id: "t_observability", section: TECH_SEC, title: { fa: "مشاهده‌پذیری", en: "Observability" }, Comp: TECH.TechObservability },
  t_security: { id: "t_security", section: TECH_SEC, title: { fa: "امنیت", en: "Security" }, Comp: TECH.TechSecurity },
  t_metering: { id: "t_metering", section: TECH_SEC, title: { fa: "Metering", en: "Metering" }, Comp: TECH.TechMetering },
  t_region: { id: "t_region", section: TECH_SEC, title: { fa: "Region / Replica", en: "Region / Replica" }, Comp: TECH.TechRegion },
  t_integration: { id: "t_integration", section: TECH_SEC, title: { fa: "یکپارچگی", en: "Integration" }, Comp: TECH.TechIntegration },
}

/** Resolve a deck's slides into ordered DeckSlide[] (filters unknown ids). */
export function resolveDeck(slug: string): DeckSlide[] {
  const deck: DeckMeta | undefined = DECK_MAP[slug]
  if (!deck) return []
  return deck.slides.map((id) => SLIDES[id]).filter(Boolean)
}
