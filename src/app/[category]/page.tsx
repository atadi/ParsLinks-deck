import { notFound } from "next/navigation"

import { CategoryDeck } from "@/components/CategoryDeck"
import { DECK_MAP, DECK_SLUGS } from "@/content/decks"

export const dynamicParams = false

export function generateStaticParams() {
  return DECK_SLUGS.map((category) => ({ category }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!DECK_MAP[category]) notFound()
  return <CategoryDeck slug={category} />
}
