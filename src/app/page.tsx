"use client"

import Link from "next/link"

import { useLang } from "@/app/providers"
import { CT } from "@/content/edit"

/**
 * Slide 0 — the presentation opening statement.
 * Composition: brand kicker → display statement → partnership equation band.
 * The equation band is a single architectural strip (not three cards):
 * infrastructure + software layer = new cloud products, tied together by
 * one baseline rule that runs beneath all three cells.
 */
export default function Home() {
  const { lang, dir, toggle } = useLang()
  return (
    <main className="cover">
      <div className="cover-head">
        <span className="cover-mark">ParsLinks</span>
        <button className="hbtn" onClick={toggle} aria-label="Toggle language">
          {lang === "fa" ? "EN" : "فا"}
        </button>
      </div>

      <div className="cover-grid">
        <div className="cover-hero">
          <span className="cover-kicker">
            ParsLinks&nbsp;<b>×</b>&nbsp;<em>نوین هاست</em>
          </span>
          <h1 className="cover-title">
            <CT k="hero.title" />
          </h1>
          <div className="cover-rule" aria-hidden />
          <p className="cover-sub">
            <CT k="hero.subtitle" />
          </p>
          <div className="cover-cta">
            <Link className="cover-btn" href="/main">
              <CT k="hero.cta.start" />
              <span aria-hidden>{dir === "rtl" ? "←" : "→"}</span>
            </Link>
            <Link className="cover-link" href="/technical">
              <CT k="hero.cta.technical" />
            </Link>
          </div>
        </div>

        {/* partnership equation band */}
        <div className="eqband" role="img" aria-label="Infrastructure plus Software equals Cloud Products">
          <div className="eqb-cell eqb-infra">
            <span className="eqb-tag">Infrastructure</span>
            <span className="eqb-name">
              <CT k="hero.visual.infra.name" />
            </span>
            <span className="eqb-meta">
              <CT k="hero.visual.infra.meta" />
            </span>
          </div>
          <div className="eqb-op op-plus" aria-hidden>
            +
          </div>
          <div className="eqb-cell eqb-soft">
            <span className="eqb-tag">Software / Product</span>
            <span className="eqb-name">
              <CT k="hero.visual.soft.name" />
            </span>
            <span className="eqb-meta">
              <CT k="hero.visual.soft.meta" />
            </span>
          </div>
          <div className="eqb-op res" aria-hidden>
            =
          </div>
          <div className="eqb-cell eqb-res">
            <span className="eqb-tag">Cloud Products</span>
            <span className="eqb-name">
              <CT k="hero.visual.result" />
            </span>
            <span className="eqb-meta">
              <CT k="hero.visual.result.meta" />
            </span>
          </div>
        </div>
      </div>

      <div className="cover-foot">
        <CT k="hero.foot" />
      </div>
    </main>
  )
}
