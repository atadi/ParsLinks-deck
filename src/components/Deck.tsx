"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { useLang, useNum } from "@/app/providers"
import { CT, useEditHref } from "@/content/edit"
import { DECK_MAP } from "@/content/decks"
import type { DeckSlide } from "@/content/slides"

export function Deck({ slides, deckSlug }: { slides: DeckSlide[]; deckSlug: string }) {
  const { lang, dir, toggle } = useLang()
  const num = useNum()
  const t = useTranslations("ui")
  const total = slides.length

  const [i, setI] = useState(0)
  const [overview, setOverview] = useState(false)
  const [help, setHelp] = useState(false)

  const go = useCallback(
    (n: number) => setI(Math.max(0, Math.min(total - 1, n))),
    [total],
  )
  const next = useCallback(() => setI((c) => Math.min(total - 1, c + 1)), [total])
  const prev = useCallback(() => setI((c) => Math.max(0, c - 1)), [])

  /* ---------- deep linking: #n (1-based) ---------- */
  const hydrated = useRef(false)

  useEffect(() => {
    const fromHash = () => {
      const n = parseInt(window.location.hash.replace("#", ""), 10)
      if (!Number.isNaN(n) && n >= 1 && n <= total) setI(n - 1)
    }
    fromHash()
    hydrated.current = true
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [total])

  useEffect(() => {
    if (!hydrated.current) return
    const hash = `#${i + 1}`
    // preserve any query params (e.g. edit=1) when syncing the slide hash
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", window.location.search + window.location.pathname + hash)
    }
  }, [i])

  /* ---------- keyboard (direction-aware) ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // While editing, keyboard input belongs to the editor: never move
      // slides when focus is inside a text field or the editor popover.
      const t = e.target as HTMLElement | null
      const inEditor =
        !!t &&
        (t.tagName === "TEXTAREA" ||
          t.tagName === "INPUT" ||
          t.tagName === "SELECT" ||
          t.isContentEditable ||
          !!t.closest(".edit-pop"))
      if (inEditor) {
        if (e.key !== "Escape") return
      }
      if (e.key === "Escape") {
        setOverview(false)
        setHelp(false)
        return
      }
      switch (e.key) {
        case "ArrowLeft":
          dir === "rtl" ? next() : prev()
          break
        case "ArrowRight":
          dir === "rtl" ? prev() : next()
          break
        case " ":
        case "PageDown":
        case "ArrowDown":
          e.preventDefault()
          next()
          break
        case "PageUp":
        case "ArrowUp":
          e.preventDefault()
          prev()
          break
        case "Home":
          go(0)
          break
        case "End":
          go(total - 1)
          break
        case "o":
        case "O":
          setOverview((v) => !v)
          break
        case "?":
          setHelp((v) => !v)
          break
        case "l":
        case "L":
          toggle()
          break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [dir, next, prev, go, total, toggle])

  /* ---------- touch swipe (direction-aware) ---------- */
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return
    const forward = dir === "rtl" ? dx > 0 : dx < 0
    forward ? next() : prev()
  }

  const slide = slides[i]
  const { Comp } = slide
  const homeHref = useEditHref("/")
  const otherDeckHref = useEditHref(`/${deckSlug === "main" ? "technical" : "main"}`)

  return (
    <>
      <div className="progress" aria-hidden>
        <i style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      <div className="counter" aria-live="polite">
        <CT k="hud.counter" /> {num(i + 1)} / {num(total)}
      </div>

      <main className="slide" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="slide-body" key={`${slide.id}-${lang}`}>
          <Comp />
        </div>
        <footer className="sfoot">
          <span className="brand">ParsLinks · {num(String(i + 1).padStart(2, "0"))}</span>
          <span>{slide.section}</span>
        </footer>
      </main>

      {/* ---------------- HUD ---------------- */}
      <nav className="hud" aria-label={t("controlsLabel")}>
        <Link className="hbtn" href={homeHref} data-edit-behavior="navigation" aria-label={t("home")}>
          ⌂
        </Link>
        <button
          className="hbtn"
          onClick={prev}
          disabled={i === 0}
          aria-label={t("prev")}
        >
          {dir === "rtl" ? "→" : "←"}
        </button>
        <button
          className="hbtn"
          onClick={next}
          disabled={i === total - 1}
          aria-label={t("next")}
        >
          {dir === "rtl" ? "←" : "→"}
        </button>
        {DECK_MAP[deckSlug === "main" ? "technical" : "main"] && (
          <Link
            className="hbtn"
            href={otherDeckHref}
            data-edit-behavior="navigation"
            aria-label={deckSlug === "main" ? t("technical") : t("mainStory")}
          >
            {deckSlug === "main" ? "⚙" : "★"}
          </Link>
        )}
        <button
          className="hbtn"
          onClick={() => setOverview(true)}
          aria-label={t("overview")}
        >
          ▦ <span className="wide">{t("overview")}</span>
        </button>
        <button
          className="hbtn"
          onClick={() => setHelp(true)}
          aria-label={t("help")}
        >
          ?
        </button>
        <button className="hbtn" onClick={toggle} aria-label={t("langSwitch")}>
          {lang === "fa" ? "EN" : "فا"}
        </button>
      </nav>

      {/* ---------------- overview ---------------- */}
      {overview && (
        <div className="backdrop" onClick={() => setOverview(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={lang === "fa" ? "نمای کلی اسلایدها" : "Slide overview"}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              <CT k="overview.title" />
            </h2>
            <div className="ovgrid">
              {slides.map((s, n) => (
                <button
                  key={s.id}
                  className={n === i ? "ovcard cur" : "ovcard"}
                  onClick={() => {
                    go(n)
                    setOverview(false)
                  }}
                >
                  <span className="n">{num(String(n + 1).padStart(2, "0"))}</span>
                  <span className="t">{s.title}</span>
                  <span className="s">{s.section}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- help ---------------- */}
      {help && (
        <div className="backdrop" onClick={() => setHelp(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={lang === "fa" ? "کلیدهای میان‌بر" : "Keyboard shortcuts"}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              <CT k="help.title" />
            </h2>
            <div className="keys">
              {[
                { k: dir === "rtl" ? "←" : "→", t: "help.nextSlide" },
                { k: dir === "rtl" ? "→" : "←", t: "help.prevSlide" },
                { k: "Space", t: "help.next" },
                { k: "PageUp / PageDown", t: "help.prevNext" },
                { k: "Home / End", t: "help.firstLast" },
                { k: "O", t: "hud.overview" },
                { k: "?", t: "help.thisHelp" },
                { k: "L", t: "help.toggleLang" },
                { k: "Esc", t: "help.close" },
              ].map((row) => (
                <div className="keyrow" key={row.k}>
                  <kbd>{row.k}</kbd>
                  <span>
                    <CT k={row.t as "help.nextSlide"} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
