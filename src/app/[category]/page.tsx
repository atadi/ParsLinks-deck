import { notFound } from "next/navigation"

import { CategoryDeck } from "@/components/CategoryDeck"
import { CATEGORY_MAP, CATEGORY_SLUGS } from "@/content/categories"

export const dynamicParams = false

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!CATEGORY_MAP[category]) notFound()
  return <CategoryDeck slug={category} />
}
