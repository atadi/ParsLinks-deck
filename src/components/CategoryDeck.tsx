"use client"

import { useNum } from "@/app/providers"
import { CT } from "@/content/edit"
import type { ContentId } from "@/content/store"
import { Deck } from "@/components/Deck"
import { resolveDeck, SLIDES, type DeckSlide } from "@/content/slides"
import { DECKS, DECK_MAP } from "@/content/decks"

/** Generated first slide of every deck, built from the deck metadata. */
function makeIntro(slug: string): DeckSlide {
  const deck = DECK_MAP[slug]
  const titleK = (`deck.${slug === "main" ? "main" : "technical"}.title`) as ContentId
  const taglineK = (`deck.${slug === "main" ? "main" : "technical"}.tagline`) as ContentId
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
  const slides: DeckSlide[] = [makeIntro(slug), ...resolveDeck(slug)]
  void SLIDES
  return <Deck slides={slides} deckSlug={slug} />
}
