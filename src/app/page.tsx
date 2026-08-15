"use client"

import Link from "next/link"

import { Bi, useLang, useNum } from "./providers"
import { CATEGORIES } from "@/content/categories"
import { SLIDES } from "@/content/slides"

const PIPELINE = ["git push", "build", "deploy", "production"]

export default function Landing() {
  const { lang, toggle } = useLang()
  const num = useNum()

  return (
    <div className="land">
      <header className="lhead">
        <span className="wordmark">ParsLinks</span>
        <button className="hbtn" onClick={toggle} aria-label="Toggle language">
          {lang === "fa" ? "EN" : "فا"}
        </button>
      </header>

      <section className="lhero">
        <span className="eyebrow">{"// confidential deck"}</span>
        <h1 className="title">
          <Bi
            fa="پلتفرمِ توسعه‌دهندگان برای ابرِ ایران"
            en="The developer platform for Iran's cloud"
          />
        </h1>
        <p className="lede">
          <Bi
            fa="یک ارائه در چهار مسیر — بسته به مخاطب، مسیرِ خود را انتخاب کنید."
            en="One deck, four tracks — choose the path for your audience."
          />
        </p>

        {/* single orchestrated motion moment: the deploy pipeline */}
        <div className="pipe" aria-hidden>
          {PIPELINE.map((stop, i) => (
            <span key={stop} style={{ display: "contents" }}>
              {i > 0 && <span className="rail" />}
              <span className="stop">{stop}</span>
            </span>
          ))}
        </div>

        <p className="ltags">
          <Bi
            fa="PaaS بومی • تحویل اپلیکیشن • Edge • تجربه‌ی توسعه‌دهنده"
            en="Native PaaS • Application Delivery • Edge • Developer Experience"
          />
        </p>
      </section>

      <nav className="cards" aria-label={lang === "fa" ? "مسیرهای ارائه" : "Deck tracks"}>
        {CATEGORIES.map((c) => {
          const count = c.slides.filter((id) => SLIDES[id]).length + 1
          return (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="ccard"
              style={{ ["--accent" as string]: c.accent }}
            >
              <span className="cidx">{c.index}</span>
              <span className="ctag">{c.tagline}</span>
              <h2 className="ctitle">
                <Bi {...c.title} />
              </h2>
              <p className="cdesc">
                <Bi {...c.desc} />
              </p>
              <span className="cfoot">
                <span>
                  {num(count)} <Bi fa="اسلاید" en="slides" />
                </span>
                <span className="go" aria-hidden />
              </span>
            </Link>
          )
        })}
      </nav>

      <footer className="lfoot">
        <Bi fa="ParsLinks · ارائه‌ی محرمانه" en="ParsLinks · Confidential deck" />
      </footer>
    </div>
  )
}
