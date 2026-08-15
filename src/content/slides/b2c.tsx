"use client"

import { Bi } from "@/app/providers"
import {
  BiN,
  Callout,
  Card,
  Chips,
  Flow,
  Hl,
  Lede,
  Pill,
  Plane,
  PConn,
  SlideHead,
  type Status,
} from "@/components/kit"

/* ============================ shift ============================ */

export function Shift() {
  return (
    <>
      <SlideHead
        eyebrow="// context"
        title={
          <BiN
            fa={
              <>
                تحول در <Hl>زیرساختِ ابری</Hl>
              </>
            }
            en={
              <>
                The Shift in <Hl>Cloud Infrastructure</Hl>
              </>
            }
          />
        }
      />
      <Flow
        nodes={[
          { code: "Physical", sub: { fa: "زیرساخت فیزیکی", en: "Infrastructure" } },
          { code: "VMs", sub: { fa: "ماشین مجازی", en: "Virtual machines" } },
          { code: "Cloud", sub: { fa: "ابر", en: "Cloud" } },
          { code: "Containers", sub: { fa: "کانتینر", en: "Containers" } },
          {
            code: "Dev Platforms",
            sub: { fa: "پلتفرم توسعه‌دهنده", en: "Dev platforms" },
            hero: true,
          },
        ]}
      />
      <Callout>
        <Bi
          fa="زیرساخت به‌تنهایی دیگر "
          en="Infrastructure alone is no longer the "
        />
        <strong>
          <Bi fa="محصولِ نهایی" en="final product" />
        </strong>
        <Bi
          fa=" نیست. توسعه‌دهندگان انتظار پلتفرم‌هایی را دارند که پیچیدگیِ زیرساخت را انتزاع کنند و اجازه دهند اپلیکیشن مستقیماً از روی کد مستقر شود."
          en=". Developers expect platforms that abstract infrastructure complexity and let applications deploy directly from code."
        />
      </Callout>
      <Lede muted>
        <Bi
          fa="هر نسل، لایه‌ی زیرین را به «جزئیاتِ پنهان» تبدیل کرده است. لایه‌ی بعدی، پلتفرمی است که تیم‌ها روی آن می‌سازند — نه سروری که باید مدیریت کنند."
          en="Each generation turned the layer beneath it into hidden detail. The next layer is a platform teams build on — not a server they manage."
        />
      </Lede>
    </>
  )
}

/* ============================ missing ============================ */

export function Missing() {
  return (
    <>
      <SlideHead
        eyebrow="// the gap"
        title={
          <BiN
            fa={
              <>
                لایه‌ی گمشده در <Hl>اکوسیستمِ ابریِ ایران</Hl>
              </>
            }
            en={
              <>
                The Missing Layer in <Hl>Iran&apos;s Cloud Ecosystem</Hl>
              </>
            }
          />
        }
      />
      <div>
        <Plane
          hero
          code="Application Platform · PaaS"
          sub={{ fa: "ParsLinks — لایه‌ی گمشده", en: "ParsLinks — the missing layer" }}
          accentSub
          items={["Deploy", "Build", "Runtime", "Autoscale", "Observability", "Edge"]}
        />
        <PConn up />
        <Plane
          infra
          code="Existing building blocks"
          sub={{ fa: "آنچه امروز موجود است", en: "What exists today" }}
          items={[
            { fa: "دامنه", en: "Domains" },
            "SSL",
            { fa: "کولوکیشن", en: "Colocation" },
            { fa: "ارتباطات شبکه", en: "Connectivity" },
            { fa: "ماشین مجازی", en: "Virtual machines" },
            { fa: "ذخیره‌سازی شیء", en: "Object storage" },
            { fa: "زیرساخت ابری", en: "Cloud infrastructure" },
          ]}
        />
      </div>
      <Callout>
        <Bi
          fa="ارائه‌دهندگانِ زیرساختِ ایران، بیشترِ بلوک‌های پایه را در اختیار دارند. فرصت، "
          en="Iran's infrastructure providers already own most of the building blocks. The opportunity is to "
        />
        <strong>
          <Bi
            fa="عرضه‌ی یکپارچه‌ی آن‌ها به‌شکلِ یک پلتفرمِ توسعه‌دهنده"
            en="expose them, unified, as a developer platform"
          />
        </strong>
        <Bi fa=" است — نه ساختِ دوباره‌ی زیرساخت." en=" — not to rebuild infrastructure." />
      </Callout>
    </>
  )
}

/* ============================ whatis ============================ */

export function WhatIs() {
  return (
    <>
      <SlideHead
        eyebrow="// product"
        title={
          <BiN
            fa={
              <>
                <Hl>ParsLinks</Hl> چیست؟
              </>
            }
            en={
              <>
                What is <Hl>ParsLinks</Hl>?
              </>
            }
          />
        }
      />
      <Callout>
        <Bi fa="پارس‌لینکس یک " en="ParsLinks is a " />
        <strong>
          <Bi
            fa="پلتفرم به‌عنوان سرویسِ توسعه‌دهنده‌محور"
            en="developer-first Platform-as-a-Service"
          />
        </strong>
        <Bi
          fa=" است؛ به تیم‌ها اجازه می‌دهد اپلیکیشن‌های وب را بسازند، مستقر کنند، مقیاس دهند و اداره کنند — بدونِ مدیریتِ مستقیمِ سرور یا زیرساخت."
          en=" that lets teams build, deploy, scale and operate web applications — without managing servers or infrastructure directly."
        />
      </Callout>
      <Flow
        nodes={[
          { code: "Git Push" },
          { code: "Build" },
          { code: "Deploy" },
          { code: "Scale" },
          { code: "Observe" },
          { code: "Deliver", hero: true },
        ]}
      />
      <Chips
        items={[
          { fa: "استقرارِ مبتنی بر Git", en: "Git-based deploys" },
          { fa: "محیط‌های Preview", en: "Preview environments" },
          { fa: "HTTPS خودکار", en: "Automatic HTTPS" },
          { fa: "دامنه‌ی اختصاصی", en: "Custom domains" },
          { fa: "رانتایم اپلیکیشن", en: "App runtime" },
          "Serverless",
          { fa: "بارِ ایستا و پویا", en: "Static & dynamic workloads" },
          { fa: "شبکه‌ی مدیریت‌شده", en: "Managed networking" },
          "CI/CD",
          { fa: "لاگ و مشاهده‌پذیری", en: "Logs & observability" },
          { fa: "مقیاس‌پذیریِ خودکار", en: "Autoscaling" },
        ]}
      />
    </>
  )
}

/* ============================ devexp ============================ */

export function DevExp() {
  return (
    <>
      <SlideHead
        eyebrow="// developer experience"
        title={
          <BiN
            fa={
              <>
                تجربه‌ی <Hl>توسعه‌دهنده</Hl>
              </>
            }
            en={
              <>
                The Developer <Hl>Experience</Hl>
              </>
            }
          />
        }
      />
      <div className="two">
        <Flow
          vert
          nodes={[
            { code: "Developer" },
            { code: "git push" },
            { code: "ParsLinks", hero: true },
            { code: "Build → Deploy" },
            { code: "Domain + HTTPS" },
            { code: "Production", hero: true },
          ]}
        />
        <div className="term">
          <div className="thead">
            <span className="tdot" aria-hidden />
            <span className="tname">parslinks · shop-frontend</span>
            <span className="tpill">Ready</span>
          </div>
          <div className="tmeta">
            <span className="live">● production</span>
            <span>main@a3f9c1</span>
          </div>
          <pre className="tlog">
            <span>
              <span className="a">▸</span> Cloning repository… done
            </span>
            <span>
              <span className="a">▸</span> Detected: Node.js 20
            </span>
            <span>
              <span className="s">▸</span> Building… 42s
            </span>
            <span>
              <span className="a">▸</span> Uploading artifact… done
            </span>
            <span className="ok">✔ Deployed to shop.parslinks.ir</span>
          </pre>
        </div>
      </div>
      <Callout>
        <Bi fa="از مخزنِ کد تا محیطِ عملیاتی، " en="From repository to production, " />
        <strong>
          <Bi fa="در چند دقیقه" en="in minutes" />
        </strong>
        <Bi fa="." en="." />
      </Callout>
    </>
  )
}

/* ============================ fordev ============================ */

export function ForDev() {
  return (
    <>
      <SlideHead
        eyebrow="// for developers"
        title={
          <BiN
            fa={
              <>
                چرا برای <Hl>توسعه‌دهندگان</Hl> مهم است
              </>
            }
            en={
              <>
                Why This Matters for <Hl>Developers</Hl>
              </>
            }
          />
        }
      />
      <Card k={{ fa: "بدونِ PaaS", en: "Without a PaaS" }}>
        <Chips
          items={[
            "Dev",
            "VM",
            "OS",
            "Firewall",
            "Runtime",
            "Proxy",
            "SSL",
            "CI/CD",
            "Scaling",
            "Monitoring",
          ]}
        />
      </Card>
      <Card accent k={{ fa: "با ParsLinks", en: "With ParsLinks" }}>
        <Flow
          nodes={[
            { code: "Developer", hero: true },
            { code: "Repository", hero: true },
            { code: "Deploy", hero: true },
          ]}
        />
      </Card>
      <Callout>
        <Bi fa="زیرساخت حذف نمی‌شود — " en="Infrastructure doesn't disappear — " />
        <strong>
          <Bi
            fa="مسئولیتِ آن از دوشِ توسعه‌دهنده به پلتفرم منتقل می‌شود."
            en="its responsibility shifts from the developer to the platform."
          />
        </strong>
      </Callout>
    </>
  )
}

/* ========================== capabilities ========================== */

const CAP_COLUMNS = ["Application", "Platform", "Delivery", "Operations"] as const

const CAP_ROWS: [string, Status][][] = [
  [
    ["Node.js", "ok"],
    ["Git Deployments", "ok"],
    ["CDN / Edge", "dev"],
    ["Logs", "ok"],
  ],
  [
    ["Python", "ok"],
    ["Preview Deploys", "dev"],
    ["Domains", "ok"],
    ["Metrics", "dev"],
  ],
  [
    ["PHP", "dev"],
    ["Env Variables", "ok"],
    ["SSL", "ok"],
    ["Health Checks", "ok"],
  ],
  [
    ["Static Sites", "ok"],
    ["Autoscaling", "plan"],
    ["Routing", "ok"],
    ["Rollbacks", "dev"],
  ],
  [
    ["Containers", "dev"],
    ["Secrets", "ok"],
    ["Load Balancing", "dev"],
    ["Audit Logs", "plan"],
  ],
]

export function Capabilities() {
  return (
    <>
      <SlideHead
        eyebrow="// capabilities"
        title={
          <BiN
            fa={
              <>
                قابلیت‌های <Hl>پلتفرم</Hl>
              </>
            }
            en={
              <>
                Platform <Hl>Capabilities</Hl>
              </>
            }
          />
        }
        sm
      />
      <div className="tblwrap">
        <table className="tbl">
          <thead>
            <tr>
              {CAP_COLUMNS.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAP_ROWS.map((row, i) => (
              <tr key={i}>
                {row.map(([feature, status]) => (
                  <td key={feature}>
                    <span className="cell">
                      <span className="tk">{feature}</span>
                      <Pill s={status} />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flow" style={{ gap: 10 }}>
        <Pill s="ok" />
        <Pill s="dev" />
        <Pill s="plan" />
      </div>
      <Lede muted>
        <Bi
          fa="صادق بودن درباره‌ی وضعیت، از وانمود کردن به «همه‌چیز آماده است» معتبرتر است."
          en="Being honest about status is more credible than pretending everything ships today."
        />
      </Lede>
    </>
  )
}
