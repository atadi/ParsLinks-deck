"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { localeMeta, type Locale } from "@/i18n/config"

export type Lang = Locale

interface LangCtx {
  lang: Lang
  dir: "rtl" | "ltr"
  setLang: (l: Lang) => void
  toggle: () => void
}

const Ctx = createContext<LangCtx>({
  lang: "fa",
  dir: "rtl",
  setLang: () => {},
  toggle: () => {},
})

export function useLang() {
  return useContext(Ctx)
}

/** Bilingual string pair — every human-language string is authored as one. */
export interface T {
  fa: string
  en: string
}

/** Renders the active language only (no CSS hiding). */
export function Bi({ fa, en }: T) {
  const { lang } = useLang()
  return <>{lang === "fa" ? fa : en}</>
}

/** Language-neutral technical token: identical text, always LTR. */
export function Tk({ children }: { children: ReactNode }) {
  return <span className="tk">{children}</span>
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

/** Localises digits: Persian numerals in FA, Latin in EN. */
export function useNum() {
  const { lang } = useLang()
  return useCallback(
    (n: number | string) =>
      lang === "fa"
        ? String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)])
        : String(n),
    [lang],
  )
}

/**
 * Locale source of truth = the URL segment ([locale]).
 * No localStorage language state: the URL drives everything, so shared links
 * and browser history are correct (see i18n docs). The <html> lang/dir is
 * synced from the resolved locale on mount.
 */
export function Providers({ children, locale }: { children: ReactNode; locale: Locale }) {
  const value = useMemo<LangCtx>(
    () => ({
      lang: locale,
      dir: localeMeta[locale].dir,
      setLang: (l: Lang) => switchLocale(l),
      toggle: () => switchLocale(locale === "fa" ? "en" : "fa"),
    }),
    [locale],
  )

  useEffect(() => {
    const dir = localeMeta[locale].dir
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/**
 * Replace the first path segment (/fa/... -> /en/...) preserving the rest of
 * the path, the slide hash, and all query params (e.g. edit=1). Falls back to
 * a full reload if the history API is unavailable.
 */
function switchLocale(next: Locale) {
  if (typeof window === "undefined") return
  const url = new URL(window.location.href)
  const parts = url.pathname.split("/")
  // parts[0] is "" (leading slash). parts[1] is the locale segment.
  if (parts[1] && (parts[1] === "fa" || parts[1] === "en")) {
    parts[1] = next
  } else {
    // No locale prefix — prepend it.
    parts.splice(1, 0, next)
  }
  url.pathname = parts.join("/")
  window.location.assign(url.toString())
}
