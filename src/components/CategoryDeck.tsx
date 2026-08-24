"use client"

import { useNum } from "@/app/providers"
import { CT } from "@/content/edit"
import type { ContentId } from "@/content/store"
import { Deck } from "@/components/Deck"
import { resolveDeck, type DeckSlide } from "@/content/slides"
import { DECKS, DECK_MAP } from "@/content/decks"

/**
 * Generated intro slide for decks that still need one.
 * The main deck opens directly on its first story slide — the approved
 * landing page (/) is the presentation cover — so only the optional
 * Technical Deep Dive branch keeps a generated intro card.
 */
function makeIntro(slug: string): DeckSlide {
  const deck = DECK_MAP[slug]
  const key = slug === "main" ? "main" : "technical"
  const titleK = `deck.${key}.title` as ContentId
  const taglineK = `deck.${key}.tagline` as ContentId
  return {
    id: `intro-${slug}`,
    section: <CT k={titleK} />,
    title: <CT k={titleK} />,
    Comp: function DeckIntro() {
      const num = useNum()
      const idx = DECKS.findIndex((d) => d.slug === slug) + 1
      return (
        <div className="intro">
          <div className="idx" style={{ color: "var(--color-turq)" }}>
            {num(String(idx).padStart(2, "0"))}
          </div>
          <span className="tag">
            <CT k={taglineK} />
          </span>
          <h1 className="title" style={{ maxWidth: "20ch" }}>
            <CT k={titleK} />
          </h1>
          <p className="hint">
            <CT k="intro.hint" />
          </p>
        </div>
      )
    },
  }
}

export function CategoryDeck({ slug }: { slug: string }) {
  // Landing page is the cover: the main deck starts straight on slide 1.
  const slides: DeckSlide[] =
    slug === "main" ? resolveDeck(slug) : [makeIntro(slug), ...resolveDeck(slug)]
  return <Deck slides={slides} deckSlug={slug} />
}
