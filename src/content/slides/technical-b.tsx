"use client"

import { Bi } from "@/app/providers"
import { BiN, Callout, Card, Defs, Flow, Hl, Lede, SlideHead } from "@/components/kit"

/* ============================ a5 ============================ */

export function A5() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 05"
        title={
          <BiN
            fa={
              <>
                شبکه و <Hl>مسیریابی</Hl>
              </>
            }
            en={
              <>
                Networking &amp; <Hl>Routing</Hl>
              </>
            }
          />
        }
      />
      <Flow
        nodes={[
          { code: "User" },
          { code: "Edge / Anycast" },
          { code: "TLS termination" },
          { code: "Router" },
          { code: "App instance", hero: true },
        ]}
      />
      <div className="g3">
        <Card
          title={{ fa: "مسیریابیِ نگاشتی", en: "Mapping-based routing" }}
          desc={{
            fa: "نگاشتِ دامنه → استقرار در لحظه، برای انتشارِ بی‌وقفه.",
            en: "Domain → deployment mapping updated instantly for zero-downtime releases.",
          }}
        />
        <Card
          k="Blue / Green"
          desc={{
            fa: "جابه‌جاییِ ترافیک پس از سلامتِ نسخه‌ی جدید.",
            en: "Traffic switches only after the new version is healthy.",
          }}
        />
        <Card
          title={{ fa: "گواهیِ خودکار", en: "Automatic certificates" }}
          desc={{
            fa: "صدور و تمدیدِ TLS به‌صورتِ خودکار.",
            en: "TLS issued and renewed automatically.",
          }}
        />
      </div>
    </>
  )
}

/* ============================ a6 ============================ */

export function A6() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 06"
        title={
          <BiN
            fa={
              <>
                مقیاس‌پذیریِ <Hl>خودکار</Hl>
              </>
            }
            en={
              <>
                <Hl>Autoscaling</Hl> Architecture
              </>
            }
          />
        }
      />
      <div className="two">
        <Flow
          vert
          nodes={[
            { code: "Metrics (RPS / CPU / latency)" },
            { code: "Autoscaler", hero: true },
            { code: "Scale ↑ / ↓ · Scale-to-zero" },
          ]}
        />
        <Defs
          rows={[
            {
              k: "signals",
              v: {
                fa: "نرخِ درخواست، مصرفِ منابع و تأخیر، ورودیِ تصمیم‌گیری‌اند.",
                en: "Request rate, resource use and latency drive the decision.",
              },
            },
            {
              k: "horizontal",
              v: {
                fa: "افزایشِ نمونه‌ها زیرِ بار و کاهش هنگامِ سکون.",
                en: "Add instances under load, shed them when idle.",
              },
            },
            {
              k: "to-zero",
              v: {
                fa: "بارهای کم‌تردد تا صفر جمع می‌شوند تا هزینه بهینه بماند.",
                en: "Low-traffic workloads scale to zero to keep cost efficient.",
              },
            },
          ]}
        />
      </div>
      <Lede muted>
        <Bi
          fa="هدف: کیفیتِ سرویسِ پایدار زیرِ بار، بدونِ over-provisioning دائمی."
          en="Goal: steady service quality under load, without permanent over-provisioning."
        />
      </Lede>
    </>
  )
}

/* ============================ a7 ============================ */

export function A7() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 07"
        title={
          <BiN
            fa={
              <>
                معماریِ <Hl>ذخیره‌سازی</Hl>
              </>
            }
            en={
              <>
                <Hl>Storage</Hl> Architecture
              </>
            }
          />
        }
      />
      <div className="g3">
        <Card
          k="Object"
          title={{ fa: "آبجکت", en: "Object" }}
          desc={{
            fa: "آرتیفکت‌های Build، دارایی‌های ایستا و بکاپ‌ها.",
            en: "Build artifacts, static assets and backups.",
          }}
        />
        <Card
          k="Block"
          title={{ fa: "بلاک", en: "Block" }}
          desc={{
            fa: "دیسکِ پایدار برای بارهای کاریِ نیازمندِ حالت.",
            en: "Persistent disk for stateful workloads.",
          }}
        />
        <Card
          k="Ephemeral"
          title={{ fa: "گذرا", en: "Ephemeral" }}
          desc={{
            fa: "فضای موقتِ اجرا و کشِ Build.",
            en: "Temporary runtime space and build cache.",
          }}
        />
      </div>
      <Callout>
        <Bi
          fa="حالتِ پایدار روی ذخیره‌سازیِ شریک می‌نشیند؛ لایه‌ی اجرا تا حدِ ممکن "
          en="Persistent state sits on the partner's storage; the execution layer stays as "
        />
        <strong>
          <Bi fa="بدونِ‌حالت" en="stateless" />
        </strong>
        <Bi fa=" می‌ماند تا مقیاس‌پذیر بماند." en=" as possible to remain scalable." />
      </Callout>
    </>
  )
}

/* ============================ a8 ============================ */

export function A8() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 08"
        title={
          <BiN
            fa={
              <>
                مشاهده‌پذیری و <Hl>لاگ</Hl>
              </>
            }
            en={
              <>
                Observability &amp; <Hl>Logging</Hl>
              </>
            }
          />
        }
      />
      <Flow
        nodes={[
          { code: "App" },
          { code: "Collector" },
          { code: "Pipeline" },
          { code: "Logs · Metrics · Traces", hero: true },
        ]}
      />
      <div className="g3">
        <Card
          title={{ fa: "لاگِ لحظه‌ای", en: "Live logs" }}
          desc={{
            fa: "جریانِ زنده‌ی Build و رانتایم برای توسعه‌دهنده.",
            en: "Live build and runtime streams for the developer.",
          }}
        />
        <Card
          title={{ fa: "متریک", en: "Metrics" }}
          desc={{
            fa: "سلامت، تأخیر و مصرفِ منابع در داشبورد.",
            en: "Health, latency and resource use on the dashboard.",
          }}
        />
        <Card
          title={{ fa: "هشدار", en: "Alerts" }}
          desc={{ fa: "آستانه‌ها و اعلانِ رخدادها.", en: "Thresholds and event notifications." }}
        />
      </div>
    </>
  )
}

/* ============================ a9 ============================ */

export function A9() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 09"
        title={
          <BiN
            fa={
              <>
                مدلِ <Hl>امنیتی</Hl>
              </>
            }
            en={
              <>
                <Hl>Security</Hl> Model
              </>
            }
          />
        }
      />
      <div className="g4">
        <Card
          title={{ fa: "هویت و دسترسی", en: "Identity & access" }}
          desc={{
            fa: "احرازِ هویت، نقش‌ها و مجوزهای دقیق روی پروژه‌ها.",
            en: "Authentication, roles and fine-grained permissions on projects.",
          }}
        />
        <Card
          title={{ fa: "مدیریتِ رازها", en: "Secrets management" }}
          desc={{
            fa: "Secretها رمزنگاری‌شده و جدا از کد نگه‌داری می‌شوند.",
            en: "Secrets are encrypted and kept separate from code.",
          }}
        />
        <Card
          title={{ fa: "ایزولاسیونِ مستأجر", en: "Tenant isolation" }}
          desc={{
            fa: "مرزِ اجرا، شبکه و منابع بین مستأجرها.",
            en: "Execution, network and resource boundaries between tenants.",
          }}
        />
        <Card
          title={{ fa: "زنجیره‌ی تأمینِ Build", en: "Build supply chain" }}
          desc={{
            fa: "Buildِ ایزوله و منشأِ قابلِ‌ردیابیِ آرتیفکت.",
            en: "Isolated builds and traceable artifact provenance.",
          }}
        />
      </div>
      <Callout saf>
        <Bi
          fa="امنیت یک قابلیتِ افزوده نیست — "
          en="Security isn't a bolt-on feature — it's designed "
        />
        <strong>
          <Bi fa="در مرزِ هر لایه" en="into every layer boundary." />
        </strong>
        <Bi fa=" طراحی شده است." en="" />
      </Callout>
    </>
  )
}

/* ============================ a10 ============================ */

export function A10() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 10"
        sm
        title={
          <BiN
            fa={
              <>
                دسترس‌پذیریِ بالا و <Hl>بازیابی از فاجعه</Hl>
              </>
            }
            en={
              <>
                High Availability &amp; <Hl>Disaster Recovery</Hl>
              </>
            }
          />
        }
      />
      <div className="g4">
        <Card
          k="HA"
          title={{ fa: "افزونگی", en: "Redundancy" }}
          desc={{
            fa: "حذفِ نقطه‌ی شکستِ واحد در مسیرهای بحرانی.",
            en: "No single point of failure on critical paths.",
          }}
        />
        <Card
          k="Failover"
          title={{ fa: "جابه‌جایی", en: "Failover" }}
          desc={{
            fa: "هدایتِ خودکارِ ترافیک هنگامِ خرابی.",
            en: "Automatic traffic redirection on failure.",
          }}
        />
        <Card
          k="Backup"
          title={{ fa: "پشتیبان", en: "Backup" }}
          desc={{
            fa: "بکاپِ منظمِ حالت و پیکربندی.",
            en: "Regular backups of state and config.",
          }}
        />
        <Card
          k="RTO / RPO"
          accent
          title={{ fa: "اهداف", en: "Targets" }}
          desc={{
            fa: "هدف‌گذاریِ زمان و نقطه‌ی بازیابی.",
            en: "Defined recovery time and recovery point.",
          }}
        />
      </div>
      <Lede muted>
        <Bi
          fa="دسترس‌پذیری روی افزونگیِ زیرساختِ شریک بنا می‌شود؛ پلتفرم آن را به تضمینِ سطحِ سرویس ترجمه می‌کند."
          en="Availability builds on the partner's infrastructure redundancy; the platform translates it into a service-level guarantee."
        />
      </Lede>
    </>
  )
}
