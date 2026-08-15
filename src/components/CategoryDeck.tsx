"use client"

import { Bi } from "@/app/providers"
import { Deck } from "@/components/Deck"
import { CATEGORY_MAP, type CategoryMeta } from "@/content/categories"
import { SLIDES, type DeckSlide } from "@/content/slides"

/** Generated first slide of every track, built from CategoryMeta. */
function makeIntro(meta: CategoryMeta): DeckSlide {
  return {
    id: `intro-${meta.slug}`,
    section: meta.title,
    title: meta.title,
    Comp: function CategoryIntro() {
      return (
        <div className="intro">
          <div className="idx" style={{ color: meta.accent }}>
            {meta.index}
          </div>
          <span className="tag">{meta.tagline}</span>
          <h1 className="title">
            <Bi {...meta.title} />
          </h1>
          <p className="lede" style={{ marginInline: "auto" }}>
            <Bi {...meta.desc} />
          </p>
          <p className="hint">
            <Bi fa="برای شروع: ← یا Space" en="Press → or Space to begin" />
          </p>
        </div>
      )
    },
  }
}

export function CategoryDeck({ slug }: { slug: string }) {
  const meta = CATEGORY_MAP[slug]
  const slides: DeckSlide[] = [
    makeIntro(meta),
    ...meta.slides.map((id) => SLIDES[id]).filter(Boolean),
  ]
  return <Deck slides={slides} />
}
