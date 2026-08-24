"use client"

import Link from "next/link"

import { useLang } from "@/app/providers"
import { CT } from "@/content/edit"

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
        {/* Left: meaningful transformation visual */}
        <div className="cover-visual">
          <div className="cv-card cv-infra">
            <span className="cv-tag">Infrastructure</span>
            <span className="cv-name">
              <CT k="hero.visual.infra.name" />
            </span>
            <span className="cv-meta">
              <CT k="hero.visual.infra.meta" />
            </span>
          </div>
          <div className="cv-arrow" aria-hidden>
            +
          </div>
          <div className="cv-card cv-soft">
            <span className="cv-tag">Software / Product</span>
            <span className="cv-name">
              <CT k="hero.visual.soft.name" />
            </span>
            <span className="cv-meta">
              <CT k="hero.visual.soft.meta" />
            </span>
          </div>
          <div className="cv-equals" aria-hidden>
            =
          </div>
          <div className="cv-card cv-res">
            <span className="cv-name">
              <CT k="hero.visual.result" />
            </span>
          </div>
        </div>

        {/* Right: title + copy + CTA */}
        <div className="cover-hero">
          <span className="eyebrow">
            <CT k="brand.lockup" />
          </span>
          <h1 className="cover-title">
            <CT k="hero.title" />
          </h1>
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
      </div>

      <div className="cover-foot">
        <CT k="hero.foot" />
      </div>
    </main>
  )
}
