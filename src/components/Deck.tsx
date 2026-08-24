"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import { Bi, useLang, useNum } from "@/app/providers"
import { DECK_MAP } from "@/content/decks"
import type { DeckSlide } from "@/content/slides"

export function Deck({ slides, deckSlug }: { slides: DeckSlide[]; deckSlug: string }) {
  const { lang, dir, toggle } = useLang()
  const num = useNum()
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
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", window.location.pathname + hash)
    }
  }, [i])

  /* ---------- keyboard (direction-aware) ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  return (
    <>
      <div className="progress" aria-hidden>
        <i style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      <div className="counter" aria-live="polite">
        <Bi fa="اسلاید" en="Slide" /> {num(i + 1)} / {num(total)}
      </div>

      <main className="slide" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="slide-body" key={`${slide.id}-${lang}`}>
          <Comp />
        </div>
        <footer className="sfoot">
          <span className="brand">ParsLinks · {num(String(i + 1).padStart(2, "0"))}</span>
          <span>
            <Bi {...slide.section} />
          </span>
        </footer>
      </main>

      {/* ---------------- HUD ---------------- */}
      <nav className="hud" aria-label={lang === "fa" ? "کنترل ارائه" : "Presenter controls"}>
        <Link className="hbtn" href="/" aria-label={lang === "fa" ? "خانه" : "Home"}>
          ⌂
        </Link>
        <button
          className="hbtn"
          onClick={prev}
          disabled={i === 0}
          aria-label={lang === "fa" ? "قبلی" : "Previous"}
        >
          {dir === "rtl" ? "→" : "←"}
        </button>
        <button
          className="hbtn"
          onClick={next}
          disabled={i === total - 1}
          aria-label={lang === "fa" ? "بعدی" : "Next"}
        >
          {dir === "rtl" ? "←" : "→"}
        </button>
        {DECK_MAP[deckSlug === "main" ? "technical" : "main"] && (
          <Link
            className="hbtn"
            href={`/${deckSlug === "main" ? "technical" : "main"}`}
            aria-label={
              deckSlug === "main"
                ? lang === "fa"
                  ? "بررسیِ فنی"
                  : "Technical Deep Dive"
                : lang === "fa"
                  ? "داستانِ اصلی"
                  : "Main Story"
            }
          >
            {deckSlug === "main" ? "⚙" : "★"}
          </Link>
        )}
        <button
          className="hbtn"
          onClick={() => setOverview(true)}
          aria-label={lang === "fa" ? "نمای کلی" : "Overview"}
        >
          ▦ <span className="wide">{lang === "fa" ? "نمای کلی" : "Overview"}</span>
        </button>
        <button
          className="hbtn"
          onClick={() => setHelp(true)}
          aria-label={lang === "fa" ? "راهنما" : "Help"}
        >
          ?
        </button>
        <button className="hbtn" onClick={toggle} aria-label="Toggle language">
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
              <Bi fa="نمای کلی" en="Overview" />
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
                  <span className="t">
                    <Bi {...s.title} />
                  </span>
                  <span className="s">
                    <Bi {...s.section} />
                  </span>
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
              <Bi fa="کلیدهای میان‌بر" en="Keyboard shortcuts" />
            </h2>
            <div className="keys">
              {[
                {
                  k: dir === "rtl" ? "←" : "→",
                  t: { fa: "اسلاید بعدی", en: "Next slide" },
                },
                {
                  k: dir === "rtl" ? "→" : "←",
                  t: { fa: "اسلاید قبلی", en: "Previous slide" },
                },
                { k: "Space", t: { fa: "بعدی", en: "Next" } },
                { k: "PageUp / PageDown", t: { fa: "قبلی / بعدی", en: "Prev / Next" } },
                { k: "Home / End", t: { fa: "اول / آخر", en: "First / Last" } },
                { k: "O", t: { fa: "نمای کلی", en: "Overview" } },
                { k: "?", t: { fa: "این راهنما", en: "This help" } },
                { k: "L", t: { fa: "تغییر زبان", en: "Toggle language" } },
                { k: "Esc", t: { fa: "بستن", en: "Close overlays" } },
              ].map((row) => (
                <div className="keyrow" key={row.k}>
                  <kbd>{row.k}</kbd>
                  <span>
                    <Bi {...row.t} />
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
