"use client"

import Link from "next/link"

import { Bi, useLang } from "@/app/providers"

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
        {/* Left: meaningful transformation visual (option C) */}
        <div className="cover-visual" aria-hidden>
          <div className="cv-card cv-infra">
            <span className="cv-tag">Infrastructure</span>
            <span className="cv-name">
              <Bi fa="نوین هاست" en="NovinHost Infrastructure" />
            </span>
            <span className="cv-meta">
              <Bi fa="محاسبات · شبکه · ذخیره‌سازی · ظرفیت" en="Compute · Network · Storage · Capacity" />
            </span>
          </div>
          <div className="cv-arrow" aria-hidden>
            <Bi fa="+" en="+" />
          </div>
          <div className="cv-card cv-soft">
            <span className="cv-tag">Software / Product</span>
            <span className="cv-name">
              <Bi fa="ParsLinks" en="ParsLinks Software Eng." />
            </span>
            <span className="cv-meta">
              <Bi fa="Control Plane · اتوماسیون · DX" en="Control Plane · Automation · DX" />
            </span>
          </div>
          <div className="cv-equals" aria-hidden>
            <Bi fa="=" en="=" />
          </div>
          <div className="cv-card cv-res">
            <span className="cv-name">
              <Bi fa="محصولات ابری تازه" en="New Cloud Products" />
            </span>
          </div>
        </div>

        {/* Right: title + copy + CTA */}
        <div className="cover-hero">
          <span className="eyebrow">ParsLinks × NovinHost</span>
          <h1 className="cover-title">
            <Bi fa="از قلب Infrastructure نوین هاست تا Productی که مشتری لمس می‌کند" en="Infrastructure, turned into products" />
          </h1>
          <p className="cover-sub">
            <Bi
              fa="نوین هاست قدرت Infrastructure را دارد؛ ParsLinks آن را به یک Software Layer تبدیل می‌کند که سرویس می‌سازد."
              en="Combining NovinHost infrastructure and ParsLinks software engineering to create the next generation of cloud services."
            />
          </p>
          <div className="cover-cta">
            <Link className="cover-btn" href="/main">
              <Bi fa="شروع ارائه" en="Start the presentation" />
              <span aria-hidden>{dir === "rtl" ? "←" : "→"}</span>
            </Link>
            <Link className="cover-link" href="/technical">
              <Bi fa="بررسی فنی (اختیاری)" en="Technical Deep Dive (optional)" />
            </Link>
          </div>
        </div>
      </div>

      <div className="cover-foot">
        <Bi
          fa="ارائه برای جلسه مشترک ParsLinks و نوین هاست. بخش فنی اختیاری‌ست و می‌توان آن را نادیده گرفت."
          en="Prepared for the joint ParsLinks × NovinHost session. The technical section is optional and may be skipped."
        />
      </div>
    </main>
  )
}
