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

export type Lang = "fa" | "en"

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  dir: "rtl" | "ltr"
}

const Ctx = createContext<LangCtx>({
  lang: "fa",
  setLang: () => {},
  toggle: () => {},
  dir: "rtl",
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

const STORAGE_KEY = "pl-lang"

/* Tiny external store so the persisted language is read via
   useSyncExternalStore (no setState-in-effect cascade), while the
   server snapshot stays "fa" for a stable static prerender. */
const langStore = {
  current: "fa" as Lang,
  listeners: new Set<() => void>(),
  subscribe(cb: () => void) {
    langStore.listeners.add(cb)
    return () => langStore.listeners.delete(cb)
  },
  get(): Lang {
    return langStore.current
  },
  getServer(): Lang {
    return "fa"
  },
  set(l: Lang) {
    langStore.current = l
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* storage unavailable — keep in-memory value */
    }
    langStore.listeners.forEach((cb) => cb())
  },
}

/* Hydrate from localStorage once, before React subscribes. */
if (typeof window !== "undefined") {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "fa" || saved === "en") langStore.current = saved
  } catch {
    /* ignore */
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(langStore.subscribe, langStore.get, langStore.getServer)

  // sync <html lang/dir> with the active language
  useEffect(() => {
    const dir = lang === "fa" ? "rtl" : "ltr"
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang])

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      setLang: (l) => langStore.set(l),
      toggle: () => langStore.set(langStore.current === "fa" ? "en" : "fa"),
      dir: lang === "fa" ? "rtl" : "ltr",
    }),
    [lang],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
