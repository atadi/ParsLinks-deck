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

      <div className="cover-hero">
        <span className="eyebrow">ParsLinks × NovinHost</span>
        <h1 className="cover-title">
          <Bi
            fa="زیرساخت، تبدیل‌شده به محصول"
            en="Infrastructure, turned into products"
          />
        </h1>
        <p className="cover-sub">
          <Bi
            fa="ترکیبِ زیرساختِ NovinHost و مهندسیِ نرم‌افزارِ ParsLinks، تا نسلِ بعدیِ سرویس‌های ابری را بسازیم."
            en="Combining NovinHost infrastructure and ParsLinks software engineering to create the next generation of cloud services."
          />
        </p>
      </div>

      <div className="cover-eq">
        <span className="cover-pill">
          <Bi fa="داستانِ اصلی · ۱۲ اسلاید" en="Main story · 12 slides" />
        </span>
      </div>

      <div className="cover-cta">
        <Link className="cover-btn" href="/main">
          <Bi fa="شروعِ ارائه" en="Start the presentation" />
          <span aria-hidden>{dir === "rtl" ? "←" : "→"}</span>
        </Link>
        <Link className="cover-link" href="/technical">
          <Bi fa="بررسیِ فنی (اختیاری)" en="Technical Deep Dive (optional)" />
        </Link>
      </div>

      <div className="cover-foot">
        <Bi
          fa="ارائه برای جلسه‌ی مشترکِ ParsLinks و NovinHost. بخشِ فنی اختیاری‌ست و می‌توان آن را رد کرد."
          en="Prepared for the joint ParsLinks × NovinHost session. The technical section is optional and may be skipped."
        />
      </div>
    </main>
  )
}
