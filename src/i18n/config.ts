import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"

/**
 * Canonical locale registry.
 *
 * Adding a language is a single-line change here + a UI message catalog
 * + presentation content for every ID. Nothing else in the codebase
 * hardcodes the locale set (see README/i18n docs).
 *
 * URL is the source of truth: /fa, /en, /fa/main/3, etc.
 * Static export caveat: next-intl `middleware` does NOT run under
 * output:"export", so locale auto-detection/redirect is handled by a tiny
 * client redirect at `/` (see src/app/page.tsx) using the cookie/remember
 * preference. All real routes live under app/[locale].
 */
export const locales = ["fa", "en"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "fa"

/** Per-locale metadata — direction and display label derive from this. */
export const localeMeta: Record<Locale, { dir: "rtl" | "ltr"; label: string }> = {
  fa: { dir: "rtl", label: "فارسی" },
  en: { dir: "ltr", label: "English" },
}

/** Locales ordered for the switcher (default first). */
export const localeOrder: Locale[] = [...locales]

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return localeMeta[locale].dir
}

/* ---------------- next-intl routing ---------------- */

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Static export: we resolve locale from the [locale] segment, not a prefix
  // strategy that needs middleware. localePrefix default "always" keeps
  // every URL prefixed, which is what we want (/fa, /en).
  localePrefix: "always",
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
