"use client"

import type { JSX } from "react"

import { CT } from "@/content/edit"
import type { ContentId } from "@/content/store"
import { DECKS, DECK_MAP, type DeckMeta } from "./decks"
import * as MAIN from "./slides/main"
import * as TECH from "./slides/technical"

export interface DeckSlide {
  id: string
  /** footer label (content-bound node) */
  section: JSX.Element
  /** overview label (content-bound node) */
  title: JSX.Element
  Comp: () => JSX.Element
}

const MAIN_SEC = <CT k="section.main" />
const TECH_SEC = <CT k="section.technical" />

/* ---------------- slide registry ---------------- */

export const SLIDES: Record<string, DeckSlide> = {
  /* ============ MAIN STORY (presenter-controlled) ============
     "vision" slide removed — the landing page is the cover. */
  together: { id: "together", section: MAIN_SEC, title: <CT k="slide.together.title" />, Comp: MAIN.CapabilitiesSplit },
  shift: { id: "shift", section: MAIN_SEC, title: <CT k="slide.shift.title" />, Comp: MAIN.InfraToProducts },
  opportunity: { id: "opportunity", section: MAIN_SEC, title: <CT k="slide.opportunity.title" />, Comp: MAIN.OpportunityMsg },
  oppmap: { id: "oppmap", section: MAIN_SEC, title: <CT k="slide.oppmap.title" />, Comp: MAIN.OpportunityMap },
  layers: { id: "layers", section: MAIN_SEC, title: <CT k="slide.layers.title" />, Comp: MAIN.LayeredDiagram },
  scenarios: { id: "scenarios", section: MAIN_SEC, title: <CT k="slide.scenarios.title" />, Comp: MAIN.Scenarios },
  foundation: { id: "foundation", section: MAIN_SEC, title: <CT k="slide.foundation.title" />, Comp: MAIN.Foundation },
  brings: { id: "brings", section: MAIN_SEC, title: <CT k="slide.brings.title" />, Comp: MAIN.WhatBrings },
  models: { id: "models", section: MAIN_SEC, title: <CT k="slide.models.title" />, Comp: MAIN.PartnershipModels },
  pilot: { id: "pilot", section: MAIN_SEC, title: <CT k="slide.pilot.title" />, Comp: MAIN.Pilot },
  discussion: { id: "discussion", section: MAIN_SEC, title: <CT k="slide.discussion.title" />, Comp: MAIN.Discussion },

  /* ============ TECHNICAL DEEP DIVE (optional) ============ */
  t_overview: { id: "t_overview", section: TECH_SEC, title: <CT k="slide.t_overview.title" />, Comp: TECH.TechOverview },
  t_planes: { id: "t_planes", section: TECH_SEC, title: <CT k="slide.t_planes.title" />, Comp: TECH.TechPlanes },
  t_lifecycle: { id: "t_lifecycle", section: TECH_SEC, title: <CT k="slide.t_lifecycle.title" />, Comp: TECH.TechLifecycle },
  t_runtime: { id: "t_runtime", section: TECH_SEC, title: <CT k="slide.t_runtime.title" />, Comp: TECH.TechRuntime },
  t_networking: { id: "t_networking", section: TECH_SEC, title: <CT k="slide.t_networking.title" />, Comp: TECH.TechNetworking },
  t_storage: { id: "t_storage", section: TECH_SEC, title: <CT k="slide.t_storage.title" />, Comp: TECH.TechStorage },
  t_observability: { id: "t_observability", section: TECH_SEC, title: <CT k="slide.t_observability.title" />, Comp: TECH.TechObservability },
  t_security: { id: "t_security", section: TECH_SEC, title: <CT k="slide.t_security.title" />, Comp: TECH.TechSecurity },
  t_metering: { id: "t_metering", section: TECH_SEC, title: <CT k="slide.t_metering.title" />, Comp: TECH.TechMetering },
  t_region: { id: "t_region", section: TECH_SEC, title: <CT k="slide.t_region.title" />, Comp: TECH.TechRegion },
  t_integration: { id: "t_integration", section: TECH_SEC, title: <CT k="slide.t_integration.title" />, Comp: TECH.TechIntegration },
}

/** Resolve a deck's slides into ordered DeckSlide[] (filters unknown ids). */
export function resolveDeck(slug: string): DeckSlide[] {
  const deck: DeckMeta | undefined = DECK_MAP[slug]
  if (!deck) return []
  return deck.slides.map((id) => SLIDES[id]).filter(Boolean)
}

export type { DeckMeta }
