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
  SlideHead,
} from "@/components/kit"

/* ============================ opportunity ============================ */

export function Opportunity() {
  return (
    <>
      <SlideHead
        eyebrow="// opportunity"
        title={<BiN fa={<>فرصت</>} en={<>The Opportunity</>} />}
      />
      <Flow
        nodes={[
          { sub: { fa: "توسعه‌دهندگانِ منفرد", en: "Individual developers" } },
          { sub: { fa: "استارتاپ‌ها", en: "Startups" } },
          { sub: { fa: "شرکت‌های نرم‌افزاری", en: "Software companies" } },
          { sub: { fa: "تجارتِ الکترونیک", en: "E-commerce" } },
          { sub: { fa: "شرکت‌های SaaS", en: "SaaS companies" } },
          { sub: { fa: "تیم‌های سازمانی", en: "Enterprise teams" } },
          { sub: { fa: "دولت / سازمان‌های بزرگ", en: "Gov · large orgs" }, hero: true },
        ]}
      />
      <Callout>
        <Bi
          fa="همه‌ی این‌ها به استقرارِ نرم‌افزار نیاز دارند. ParsLinks می‌تواند "
          en="All of them need to deploy software. ParsLinks can be the "
        />
        <strong>
          <Bi fa="لایه‌ی استقرارِ اپلیکیشن" en="application deployment layer" />
        </strong>
        <Bi
          fa=" باشد که توسعه‌دهندگان را به زیرساختِ ابریِ داخلی متصل می‌کند."
          en=" that connects developers to domestic cloud infrastructure."
        />
      </Callout>
      <Lede muted>
        <Bi
          fa="این استدلال، از اعدادِ بحث‌برانگیزِ اندازه‌ی بازار قابل‌دفاع‌تر است."
          en="That's easier to defend than questionable market-size numbers."
        />
      </Lede>
    </>
  )
}

/* ============================ needs ============================ */

const NEEDS = [
  {
    k: "Infrastructure",
    title: { fa: "زیرساخت", en: "Infrastructure" },
    desc: {
      fa: "ظرفیتِ Compute، ذخیره‌سازی، شبکه، منابعِ IP، Load Balancing و یکپارچگیِ DNS.",
      en: "Compute, storage, networking, IP resources, load balancing, DNS integration.",
    },
  },
  {
    k: "Operational",
    title: { fa: "عملیاتی", en: "Operational" },
    desc: {
      fa: "توانِ زیرساختی ۲۴×۷، مانیتورینگ و هم‌ترازیِ SLA.",
      en: "24×7 infrastructure capability, monitoring, SLA alignment.",
    },
  },
  {
    k: "Commercial",
    title: { fa: "تجاری", en: "Commercial" },
    desc: {
      fa: "دسترسی به بازار، مشتریانِ میزبانیِ موجود و روابطِ سازمانی.",
      en: "Go-to-market access, existing hosting customers, enterprise relationships.",
    },
  },
  {
    k: "Strategic",
    title: { fa: "راهبردی", en: "Strategic" },
    desc: {
      fa: "مشارکتِ بلندمدتِ زیرساختی.",
      en: "A long-term infrastructure partnership.",
    },
    accent: true,
  },
]

export function Needs() {
  return (
    <>
      <SlideHead
        eyebrow="// requirements"
        sm
        title={
          <BiN
            fa={
              <>
                آنچه برای <Hl>مقیاس‌دهیِ ParsLinks</Hl> لازم است
              </>
            }
            en={
              <>
                What We Need to <Hl>Scale ParsLinks</Hl>
              </>
            }
          />
        }
      />
      <div className="g4">
        {NEEDS.map((n) => (
          <Card key={n.k} k={n.k} title={n.title} desc={n.desc} accent={n.accent} />
        ))}
      </div>
      <Callout saf>
        <Bi fa="این‌طور، سرمایه‌گذاری به یک " en="This way, investment becomes a " />
        <strong>
          <Bi fa="نتیجه‌ی منطقی" en="logical consequence" />
        </strong>
        <Bi fa=" تبدیل می‌شود — نه یک درخواستِ دلبخواه." en=" — not an arbitrary request." />
      </Callout>
    </>
  )
}

/* ============================ roadmap ============================ */
/* Statuses here mirror the `capabilities` table exactly. No dates, no figures. */

export function Roadmap() {
  return (
    <>
      <SlideHead
        eyebrow="// roadmap"
        title={
          <BiN
            fa={
              <>
                نقشه‌ی راهِ <Hl>مرحله‌ای</Hl>
              </>
            }
            en={
              <>
                A <Hl>Phased</Hl> Roadmap
              </>
            }
          />
        }
      />
      <div className="g3">
        <Card accent k="Now" title={{ fa: "اکنون · موجود", en: "Now · Available" }}>
          <Chips
            on
            items={[
              { fa: "استقرارِ Git", en: "Git deploys" },
              "Node.js",
              "Python",
              { fa: "سایتِ ایستا", en: "Static sites" },
              { fa: "دامنه", en: "Domains" },
              "SSL",
              { fa: "لاگ", en: "Logs" },
              "Secrets",
              { fa: "مسیریابی", en: "Routing" },
            ]}
          />
        </Card>
        <Card k="Next" title={{ fa: "بعدی · در توسعه", en: "Next · In development" }}>
          <Chips
            items={[
              "Preview Deploys",
              { fa: "کانتینر", en: "Containers" },
              "PHP",
              { fa: "متریک", en: "Metrics" },
              "CDN / Edge",
              "Load Balancing",
              "Rollbacks",
            ]}
          />
        </Card>
        <Card k="Later" title={{ fa: "بعدتر · برنامه‌ریزی‌شده", en: "Later · Planned" }}>
          <Chips
            items={[
              "Autoscaling",
              "Audit Logs",
              { fa: "رانتایم‌های بیشتر", en: "Broader runtimes" },
              { fa: "چند-منطقه‌ای", en: "Multi-region" },
            ]}
          />
        </Card>
      </div>
      <Callout>
        <Bi fa="سرمایه‌گذاری، گذار از «بعدی» به «بعدتر» را " en="Investment " />
        <strong>
          <Bi fa="شتاب می‌دهد" en="accelerates" />
        </strong>
        <Bi
          fa=" — نقشه‌ی راه را به قابلیتِ عرضه‌شده تبدیل می‌کند."
          en=" the move from Next to Later — it converts roadmap into shipped capability."
        />
      </Callout>
    </>
  )
}

/* ============================ vision ============================ */

export function Vision() {
  return (
    <>
      <div className="intro">
        <span className="eyebrow">{"// vision"}</span>
        <div className="vword">ParsLinks</div>
        <h1 className="title sm">
          <Bi
            fa="از کد تا محیطِ عملیاتی — روی زیرساختِ ابریِ ایران"
            en="From code to production — on Iran's cloud infrastructure"
          />
        </h1>
      </div>
      <Callout center>
        <Bi
          fa="هدفِ ما ساختنِ یک سرویسِ میزبانیِ دیگر نیست — هدفِ ما ساختنِ "
          en="Our goal is not to build another hosting service — it's to build "
        />
        <strong>
          <Bi
            fa="پلتفرمی‌ست که توسعه‌دهندگان، پیش از آن‌که اصلاً به میزبانی فکر کنند، از آن استفاده می‌کنند."
            en="the platform developers use before they ever think about hosting."
          />
        </strong>
      </Callout>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Flow
          nodes={[
            { code: "Developer", hero: true },
            { code: "ParsLinks", hero: true },
            { code: "Partner Infrastructure" },
          ]}
        />
      </div>
    </>
  )
}
