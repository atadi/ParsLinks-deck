"use client"

import { Bi, useLang } from "@/app/providers"
import {
  BiN,
  Callout,
  Compare,
  Equation,
  Hl,
  LayerStack,
  Lede,
  OppMap,
  Phase,
  Questions,
  Matrix,
  Scenario,
  SlideHead,
  Split,
  Statement,
  Timeline,
} from "@/components/kit"

/* ==================================================================
   MAIN DECK — ParsLinks × NovinHost
   One deliberate executive story, presenter-controlled.
   Sections: Vision · Opportunity · Together · Existing Foundation ·
   Partnership · Pilot · Discussion
   ================================================================== */

/* ---------------- 01 · Vision (opening) ---------------- */

export function Vision() {
  const { lang } = useLang()
  return (
    <>
      <Statement
        kicker={lang === "fa" ? "ParsLinks × نوین هاست" : "ParsLinks × NovinHost"}
        lead={
          <BiN
            fa={
              <>
                از قلب Infrastructure <Hl>نوین هاست</Hl> تا Productی که مشتری لمس می‌کند
              </>
            }
            en={
              <>
                From the core of <Hl>NovinHost</Hl> Infrastructure to the Product the customer touches
              </>
            }
          />
        }
        sub={
          <Bi
            fa="نوین هاست قدرت Infrastructure را دارد؛ ParsLinks آن را به یک Software Layer تبدیل می‌کند که سرویس می‌سازد."
            en="NovinHost brings infrastructure power; ParsLinks turns it into a software layer that builds products."
          />
        }
      />
      <Equation
        left={
          <>
            <strong>
              <Bi fa="Infrastructure نوین هاست" en="NovinHost Infrastructure" />
            </strong>
            <span className="eq-meta">
              <Bi fa="محاسبات، شبکه، ذخیره‌سازی، ظرفیت" en="Compute, network, storage, capacity" />
            </span>
          </>
        }
        right={
          <>
            <strong>
              <Bi fa="مهندسی نرم‌افزار ParsLinks" en="ParsLinks Software Eng." />
            </strong>
            <span className="eq-meta">
              <Bi fa="Control Plane، اتوماسیون، تجربه توسعه‌دهنده" en="Control plane, automation, DX" />
            </span>
          </>
        }
        result={
          <>
            <strong>
              <Bi fa="محصولات ابری تازه" en="New Cloud Products" />
            </strong>
          </>
        }
      />
    </>
  )
}

/* ---------------- 02 · Complementary capabilities ---------------- */

export function CapabilitiesSplit() {
  return (
    <>
      <SlideHead
        eyebrow="// together"
        title={
          <BiN
            fa={
              <>
                دو تخصص متفاوت، یک مسیر <Hl>مشترک</Hl>
              </>
            }
            en={
              <>
                Two sides, <Hl>complementary capabilities</Hl>
              </>
            }
          />
        }
      />
      <Split
        left={{
          brand: { fa: "NovinHost", en: "NovinHost" },
          side: "infra",
          items: [
            { fa: "Compute (محاسبات)", en: "Compute" },
            { fa: "شبکه و ارتباطات", en: "Network & connectivity" },
            { fa: "ذخیره‌سازی و دیتاسنتر", en: "Storage & datacenter" },
            { fa: "ظرفیت سخت‌افزاری و تأمین", en: "Hardware capacity & procurement" },
            { fa: "عملیات زیرساخت", en: "Infrastructure operations" },
            { fa: "مشتریان فعلی", en: "Existing customer base" },
            { fa: "دسترسی تجاری و بازار", en: "Commercial reach & market" },
            { fa: "تجربه میزبانی و ابر", en: "Hosting/cloud experience" },
          ],
        }}
        right={{
          brand: { fa: "ParsLinks", en: "ParsLinks" },
          side: "soft",
          items: [
            { fa: "مهندسی نرم‌افزار", en: "Software engineering" },
            { fa: "مهندسی محصول ابری", en: "Cloud product engineering" },
            { fa: "مهندسی Control Plane", en: "Control-plane engineering" },
            { fa: "اتوماسیون و Orchestration", en: "Automation & orchestration" },
            { fa: "طراحی API و پلتفرم", en: "API & platform design" },
            { fa: "تجربه توسعه‌دهنده (DX)", en: "Developer experience" },
            { fa: "Observability و Metering", en: "Observability & metering" },
            { fa: "یکپارچه‌سازی هوش مصنوعی", en: "AI integration" },
          ],
        }}
      />
      <Callout center>
        <Bi
          fa="توانمندی‌های مکمل — نه کسب‌وکارهای هم‌پوشان."
          en="Complementary capabilities, not overlapping businesses."
        />
      </Callout>
    </>
  )
}

/* ---------------- 03 · From infrastructure to products ---------------- */

export function InfraToProducts() {
  return (
    <>
      <SlideHead
        eyebrow="// the shift"
        title={
          <BiN
            fa={
              <>
                مشتری منابع نمی‌خواهد؛ <Hl>نتیجه</Hl> می‌خواهد
              </>
            }
            en={
              <>
                From selling resources to <Hl>cloud products</Hl>
              </>
            }
          />
        }
      />
      <Compare
        before={{
          title: { fa: "فروش منابع خام", en: "Raw resource sales" },
          items: ["CPU", "RAM", "Disk", "Bandwidth", "VM / VPS", "Dedicated"],
        }}
        after={{
          title: { fa: "سرویس‌های ابری محصول‌شده", en: "Productized cloud services" },
          items: [
            { fa: "Deploy اپلیکیشن", en: "Deploy an application" },
            { fa: "PostgreSQL مدیریت‌شده", en: "Managed PostgreSQL" },
            { fa: "Redis مدیریت‌شده", en: "Managed Redis" },
            { fa: "Object Storage", en: "Object storage" },
            { fa: "Developer Platform", en: "Developer platform" },
            { fa: "AI workloads", en: "AI workloads" },
            { fa: "One-click apps", en: "One-click apps" },
            { fa: "API و اتوماسیون", en: "APIs & automation" },
          ],
        }}
      />
      <Lede muted>
        <Bi
          fa="مشتریان لزوماً نمی‌خواهند خودشان زیرساخت را مدیریت کنند؛ بیشتر ترجیح می‌دهند زیرساخت به سرویس تبدیل شود. منابع خام همچنان پایه‌اند — محصول‌سازی ارزش بیشتری می‌آورد."
          en="Customers do not always want to manage infrastructure — often they want infrastructure converted into an outcome. Raw resources remain the foundation; productization adds value on top."
        />
      </Lede>
    </>
  )
}

/* ---------------- 04 · The opportunity (outcome message) ---------------- */

export function OpportunityMsg() {
  return (
    <>
      <Phase n="02" label={{ fa: "فرصت", en: "Opportunity" }} />
      <Statement
        center
        lead={
          <BiN
            fa={
              <>
                زیرساخت وقتی <Hl>محصول</Hl> شود، ارزشمندتر است.
              </>
            }
            en={
              <>
                Infrastructure becomes more valuable when it is <Hl>productized</Hl>.
              </>
            }
          />
        }
        sub={
          <Bi
            fa="مشتریان فعلی می‌توانند نقطه شروع طبیعی برای سرویس‌های ابری با ارزش افزوده بیشتر باشند."
            en="The existing customer base can provide a natural starting point for higher-value cloud services."
          />
        }
      />
    </>
  )
}

/* ---------------- 05 · Opportunity map ---------------- */

export function OpportunityMap() {
  return (
    <>
      <SlideHead
        eyebrow="// possible directions"
        title={
          <BiN
            fa={
              <>
                خانواده‌های محصول <Hl>مشترک ممکن</Hl>
              </>
            }
            en={
              <>
                Possible <Hl>joint product</Hl> families
              </>
            }
          />
        }
      />
      <OppMap
        families={[
          {
            name: { fa: "Application Platform", en: "Application Platform" },
            items: [
              { fa: "Git-to-deploy", en: "Git-to-deploy" },
              { fa: "میزبانی اپلیکیشن", en: "App hosting" },
              { fa: "سرویس‌ها و محیط‌ها", en: "Services & environments" },
              { fa: "دامنه‌ها", en: "Domains" },
              { fa: "گردش‌کارهای توسعه‌دهنده", en: "Dev workflows" },
            ],
          },
          {
            name: { fa: "Managed Data", en: "Managed Data" },
            items: [
              { fa: "PostgreSQL", en: "PostgreSQL" },
              { fa: "Redis", en: "Redis" },
              { fa: "ذخیره‌سازی ابجکت", en: "Object storage" },
              { fa: "Backup", en: "Backups" },
            ],
          },
          {
            name: { fa: "Developer Cloud", en: "Developer Cloud" },
            items: [
              { fa: "API", en: "APIs" },
              { fa: "CLI", en: "CLI" },
              { fa: "اتوماسیون", en: "Automation" },
              { fa: "Managed runtimes", en: "Managed runtimes" },
            ],
          },
          {
            name: { fa: "Enterprise / Private", en: "Enterprise / Private" },
            items: [
              { fa: "پلتفرم‌های اختصاصی", en: "Private platforms" },
              { fa: "محیط‌های ایزوله", en: "Isolated environments" },
              { fa: "استقرارهای مدیریت‌شده", en: "Managed deployments" },
            ],
          },
          {
            name: { fa: "AI Infrastructure", en: "AI Infrastructure" },
            items: [
              { fa: "GPU workloads", en: "GPU workloads" },
              { fa: "سرویس‌های Inference", en: "Inference services" },
              { fa: "AI Gateway", en: "AI gateway" },
              { fa: "مسیریابی مدل", en: "Model routing" },
              { fa: "Metering", en: "Metering" },
            ],
          },
          {
            name: { fa: "Marketplace", en: "Marketplace" },
            items: [
              { fa: "WordPress", en: "WordPress" },
              { fa: "n8n", en: "n8n" },
              { fa: "GitLab", en: "GitLab" },
              { fa: "الگوهای سرویس", en: "Service templates" },
            ],
          },
        ]}
      />
      <Lede muted>
        <Bi
          fa="جهت‌های محصول؛ نه تعهد نقشه‌راه. هر مورد یک امکان همکاری‌ست — نه ادعای پیاده‌سازی امروز."
          en="Product directions, not a roadmap commitment. Each is a possible collaboration — not a claim of today's implementation."
        />
      </Lede>
    </>
  )
}

/* ---------------- 06 · Layered architecture (bridge) ---------------- */

export function LayeredDiagram() {
  return (
    <>
      <SlideHead
        eyebrow="// how it fits"
        title={
          <BiN
            fa={
              <>
                فاصله Infrastructure تا Product، یک <Hl>Software Layer</Hl> است
              </>
            }
            en={
              <>
                How the <Hl>layers</Hl> stack
              </>
            }
          />
        }
      />
      <LayerStack
        layers={[
          {
            label: { fa: "مشتریان، توسعه‌دهندگان، سازمان‌ها", en: "Customers · Developers · Enterprises" },
            tone: "cust",
          },
          {
            label: { fa: "محصولات ابری", en: "Cloud Products" },
            tone: "prod",
          },
          {
            label: { fa: "لایه نرم‌افزار / محصول ParsLinks", en: "ParsLinks Software / Product Layer" },
            tone: "soft",
          },
          {
            label: { fa: "Control Plane · اتوماسیون · API", en: "Control Plane · Automation · API" },
            tone: "soft",
          },
          {
            label: { fa: "Infrastructure نوین هاست", en: "NovinHost Infrastructure" },
            tone: "infra",
          },
          {
            label: { fa: "محاسبات · شبکه · ذخیره‌سازی · ظرفیت", en: "Compute · Network · Storage · Capacity" },
            tone: "infra",
          },
        ]}
      />
    </>
  )
}

/* ---------------- 07 · Joint use-case scenarios ---------------- */

export function Scenarios() {
  const items = [
    { title: { fa: "Startup Cloud", en: "Startup Cloud" }, steps: ["Git", "Deploy", "Database", "Domain"] },
    {
      title: { fa: "Managed Data", en: "Managed Data" },
      steps: ["PostgreSQL", "Redis", "Storage", "Backup"],
    },
    {
      title: { fa: "Enterprise Private Platform", en: "Enterprise Private Platform" },
      steps: ["Dedicated infra", "Software layer", "Isolated workloads"],
    },
    {
      title: { fa: "AI Cloud", en: "AI Cloud" },
      steps: ["Compute / GPU", "Inference", "AI Gateway", "Metering"],
    },
  ]
  return (
    <>
      <SlideHead
        eyebrow="// concrete scenarios"
        title={
          <BiN
            fa={
              <>
                سناریوهای <Hl>محصول مشترک</Hl>
              </>
            }
            en={
              <>
                Concrete <Hl>joint-use cases</Hl>
              </>
            }
          />
        }
      />
      <div className="scenarios">
        {items.map((s, i) => (
          <Scenario key={i} title={s.title} steps={s.steps} />
        ))}
      </div>
    </>
  )
}

/* ---------------- 08 · Existing technology foundation ---------------- */

export function Foundation() {
  return (
    <>
      <Phase n="04" label={{ fa: "پایه فناوری", en: "Existing Foundation" }} />
      <SlideHead
        eyebrow="// not from zero"
        title={
          <BiN
            fa={
              <>
                ما از <Hl>صفر</Hl> شروع نمی‌کنیم
              </>
            }
            en={
              <>
                We are <Hl>not starting from zero</Hl>
              </>
            }
          />
        }
      />
      <div className="two">
        <div className="card">
          <div className="ct">
            <Bi fa="ParsLinks — تیم مهندسی" en="ParsLinks — Engineering Team" />
          </div>
          <div className="cd">
            <Bi
              fa="تیم نرم‌افزار و مهندسی محصول؛ مسئول طراحی و ساخت لایه نرم‌افزاری."
              en="The software & product engineering team — designs and builds the software layer."
            />
          </div>
        </div>
        <div className="card accent">
          <div className="ct">
            <Bi fa="ParsLinks Platform — فناوری موجود" en="ParsLinks Platform — existing tech" />
          </div>
          <div className="cd">
            <Bi
              fa="پلتفرم ابری موجودی که بخشی از لایه نرم‌افزار را پیشاپیش پیاده‌سازی کرده است."
              en="An existing cloud platform that already implements part of the software layer."
            />
          </div>
        </div>
      </div>
      <Callout>
        <Bi fa="ParsLinks سرمایه قابل‌توجهی در لایه نرم‌افزاری گذاشته که زیرساخت را به محصولات توسعه‌دهنده‌محور تبدیل می‌کند — از جمله:" en="ParsLinks has already invested significantly in the software layer that turns infrastructure into developer-facing products — including:" />
      </Callout>
      <div className="chips">
        <span className="chip">
          <Bi fa="Projects / Services" en="Projects / Services" />
        </span>
        <span className="chip">
          <Bi fa="Deploy مبتنی بر Git" en="Git-based deploy" />
        </span>
        <span className="chip">
          <Bi fa="محیط‌ها (Preview / Prod)" en="Environments" />
        </span>
        <span className="chip">
          <Bi fa="Managed services" en="Managed services" />
        </span>
        <span className="chip">
          <Bi fa="Networking (دامنه، HTTPS، مسیریابی)" en="Networking" />
        </span>
        <span className="chip">
          <Bi fa="Volumes / ذخیره‌سازی" en="Volumes / storage" />
        </span>
        <span className="chip">
          <Bi fa="مشاهده‌پذیری" en="Observability" />
        </span>
        <span className="chip">
          <Bi fa="متغیرها / رازها" en="Variables / secrets" />
        </span>
        <span className="chip">
          <Bi fa="الگوها (Templates)" en="Templates" />
        </span>
        <span className="chip">
          <Bi fa="معماری Metering / Billing" en="Metering / billing" />
        </span>
        <span className="chip">
          <Bi fa="مفاهیم Region / Replica" en="Region / replica" />
        </span>
        <span className="chip">
          <Bi fa="اتوماسیون Control Plane" en="Control-plane automation" />
        </span>
      </div>
    </>
  )
}

/* ---------------- 09 · What ParsLinks brings (non-defensive) ---------------- */

export function WhatBrings() {
  return (
    <>
      <SlideHead
        eyebrow="// what ParsLinks brings"
        title={
          <BiN
            fa={
              <>
                آنچه <Hl>ParsLinks</Hl> می‌آورد
              </>
            }
            en={
              <>
                What <Hl>ParsLinks</Hl> brings
              </>
            }
          />
        }
      />
      <div className="g3">
        {[
          { fa: "مهندسی نرم‌افزار ابری", en: "Cloud software engineering" },
          { fa: "مهندسی Control Plane", en: "Control-plane engineering" },
          { fa: "معماری محصول", en: "Product architecture" },
          { fa: "تجربه توسعه‌دهنده", en: "Developer experience" },
          { fa: "اتوماسیون", en: "Automation" },
          { fa: "مشاهده‌پذیری", en: "Observability" },
          { fa: "Metering / Billing", en: "Metering / billing" },
          { fa: "یکپارچه‌سازی", en: "Integration capability" },
          { fa: "پلتفرم موجود", en: "An existing platform" },
        ].map((c, i) => (
          <div className="card" key={i}>
            <div className="ct">
              <Bi {...c} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------- 10 · Partnership models ---------------- */

export function PartnershipModels() {
  return (
    <>
      <Phase n="05" label={{ fa: "مشارکت", en: "Partnership" }} />
      <SlideHead
        eyebrow="// open models"
        title={
          <BiN
            fa={
              <>
                مدل‌های <Hl>مشارکت ممکن</Hl>
              </>
            }
            en={
              <>
                Possible <Hl>partnership models</Hl>
              </>
            }
          />
        }
      />
      <Matrix
        models={[
          {
            name: { fa: "محصول زیرساخت‌محور", en: "Infra-backed product" },
            desc: {
              fa: "محصولات روی Infrastructure نوین هاست اجرا می‌شوند و با نرم‌افزار ParsLinks مدیریت می‌شوند.",
              en: "Products run on NovinHost infra, operated through ParsLinks software.",
            },
          },
          {
            name: { fa: "توسعه‌ی مشترک محصول", en: "Joint product dev" },
            desc: {
              fa: "هر دو طرف سرویس‌های جدید را تعریف و ارائه می‌کنند.",
              en: "Both sides define and launch new services.",
            },
          },
          {
            name: { fa: "White-label", en: "White-label" },
            desc: {
              fa: "نرم‌افزار ParsLinks، سرویس‌ها را با برند نوین هاست ارائه می‌دهد.",
              en: "ParsLinks software powers services under NovinHost branding.",
            },
          },
          {
            name: { fa: "مدل درآمد مشترک", en: "Revenue-sharing" },
            desc: {
              fa: "ساختار تجاری برای هر سرویس تعیین می‌شود.",
              en: "Commercial model decided per service.",
            },
          },
          {
            name: { fa: "ظرفیت اختصاصی", en: "Dedicated capacity" },
            desc: {
              fa: "ظرفیت مشخصی به محصولات منتخب اختصاص می‌یابد.",
              en: "Specific capacity allocated to selected products.",
            },
          },
          {
            name: { fa: "راهکارهای سازمانی", en: "Enterprise solutions" },
            desc: {
              fa: "زیرساخت + نرم‌افزار برای مشتریان بزرگ.",
              en: "Infra + software for larger customers.",
            },
          },
        ]}
      />
      <Callout center>
        <Bi
          fa="ساختار تجاری عمداً باز می‌ماند تا در جلسه بررسی شود."
          en="The commercial structure is deliberately left open for discussion."
        />
      </Callout>
    </>
  )
}

/* ---------------- 11 · Pilot proposal ---------------- */

export function Pilot() {
  return (
    <>
      <Phase n="06" label={{ fa: "پایلوت", en: "Pilot" }} />
      <SlideHead
        eyebrow="// low-risk first step"
        title={
          <BiN
            fa={
              <>
                کوچک شروع کنیم، واقعی <Hl>بسنجیم</Hl>
              </>
            }
            en={
              <>
                A <Hl>small pilot</Hl> first
              </>
            }
          />
        }
      />
      <Timeline
        steps={[
          {
            k: "01",
            label: { fa: "انتخاب یک استخر زیرساخت", en: "Select an infra pool" },
            note: { fa: "محدود و کنترل‌شده", en: "Limited, contained" },
          },
          {
            k: "02",
            label: { fa: "اتصال لایه نرم‌افزار", en: "Connect the software layer" },
          },
          {
            k: "03",
            label: { fa: "انتخاب ۱–۲ سرویس", en: "Choose 1–2 services" },
            note: { fa: "مثلاً Deploy یا PostgreSQL", en: "e.g. deploy or PostgreSQL" },
          },
          {
            k: "04",
            label: { fa: "اجرای پایلوت", en: "Run the pilot" },
          },
          {
            k: "05",
            label: { fa: "اندازه‌گیری فنی + تجاری", en: "Measure tech + commercial" },
          },
          {
            k: "06",
            label: { fa: "تصمیم برای مقیاس", en: "Decide how to scale" },
          },
        ]}
      />
      <Callout>
        <Bi
          fa="می‌توانیم کوچک شروع کنیم، مدل را اعتبارسنجی کنیم و بر اساس شواهد گسترش دهیم."
          en="We can start small, validate the model, and expand based on evidence."
        />
      </Callout>
    </>
  )
}

/* ---------------- 12 · Discussion ---------------- */

export function Discussion() {
  return (
    <>
      <Phase n="07" label={{ fa: "بحث", en: "Discussion" }} />
      <SlideHead
        eyebrow="// where to start"
        title={
          <BiN
            fa={
              <>
                از کجا <Hl>شروع کنیم؟</Hl>
              </>
            }
            en={
              <>
                Where should we <Hl>start?</Hl>
              </>
            }
          />
        }
      />
      <Questions
        items={[
          {
            fa: "کدام استخر زیرساخت برای پایلوت اولیه مناسب‌تر است؟",
            en: "Which infrastructure pool is most suitable for an initial pilot?",
          },
          {
            fa: "کدام خانواده محصول برای بازار فعلی نوین هاست جذاب‌تر است؟",
            en: "Which product category is most attractive for NovinHost's current market?",
          },
          {
            fa: "کدام مدل مشارکت برای فاز یک منطقی‌ست؟",
            en: "Which partnership model makes sense for phase one?",
          },
          {
            fa: "پیش از گسترش، چه مواردی فنی و تجاری باید اعتبارسنجی شوند؟",
            en: "What should be validated technically and commercially before expansion?",
          },
        ]}
      />
    </>
  )
}
