"use client"

import { Bi, useLang, useNum } from "@/app/providers"
import { Deck } from "@/components/Deck"
import { resolveDeck, type DeckSlide } from "@/content/slides"
import { DECKS, DECK_MAP, type DeckMeta } from "@/content/decks"

/** Generated first slide of every deck, built from the deck metadata. */
function makeIntro(slug: string): DeckSlide {
  const deck: DeckMeta = DECK_MAP[slug]
  return {
    id: `intro-${slug}`,
    section: deck.title,
    title: deck.title,
    Comp: function DeckIntro() {
      const { lang } = useLang()
      const num = useNum()
      const idx = DECKS.findIndex((d) => d.slug === slug) + 1
      return (
        <div className="intro">
          <div className="idx" style={{ color: "var(--color-turq)" }}>
            {num(String(idx).padStart(2, "0"))}
          </div>
          <span className="tag">
            <Bi {...deck.tagline} />
          </span>
          <h1 className="title" style={{ maxWidth: "20ch" }}>
            <Bi {...deck.title} />
          </h1>
          <p className="hint">
            <Bi fa="برای شروع: ← یا Space" en="Press → or Space to begin" />
          </p>
        </div>
      )
    },
  }
}

export function CategoryDeck({ slug }: { slug: string }) {
  const slides: DeckSlide[] = [makeIntro(slug), ...resolveDeck(slug)]
  return <Deck slides={slides} deckSlug={slug} />
}
