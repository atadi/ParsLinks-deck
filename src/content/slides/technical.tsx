"use client"

import { Bi } from "@/app/providers"
import { BiN, Callout, Card, Defs, Flow, Hl, Lede, Plane, PConn, SlideHead, StateTag } from "@/components/kit"

/* ==================================================================
   TECHNICAL DEEP DIVE — optional branch (presenter may skip)
   Uses a "Current" vs "Target" discipline: planned subsystems are
   explicitly labelled, never shown as production-ready.
   ================================================================== */

/* ---------------- T1 · Architecture overview ---------------- */

export function TechOverview() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 01"
        title={
          <BiN
            fa={
              <>
                نمای کلیِ <Hl>معماری</Hl>
              </>
            }
            en={
              <>
                Architecture <Hl>Overview</Hl>
              </>
            }
          />
        }
      />
      <div>
        <Plane code="Developer / Git" sub={{ fa: "توسعه‌دهنده", en: "Developer" }} items={["Push", "CLI", "API"]} />
        <PConn />
        <Plane hero accentSub code="Control Plane" sub={{ fa: "مغز پلتفرم", en: "Platform brain" }} items={["Build System", "Runtime Layer", "Platform Services"]} />
        <PConn />
        <Plane code="Orchestration" sub={{ fa: "Orchestration", en: "Orchestration" }} items={["Scheduling", "Placement", "Routing"]} />
        <PConn />
        <Plane infra code="NovinHost Infrastructure" sub={{ fa: "زیرساخت", en: "Infrastructure" }} items={["Compute", "Storage", "Network"]} />
      </div>
      <Lede muted>
        <Bi
          fa="هدف، توضیحِ هر زیرسیستم نیست — نشان دادنِ این است که پلتفرم روی زیرساختِ NovinHost می‌نشیند و بخشِ قابل‌توجهی از پایه‌ی نرم‌افزاریِ موردنیاز از قبل توسعه داده شده است."
          en="Not to explain every subsystem — but to show the platform sits on NovinHost infrastructure, and a substantial part of the required software foundation already exists."
        />
      </Lede>
    </>
  )
}

/* ---------------- T2 · Planes ---------------- */

export function TechPlanes() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 02"
        title={
          <BiN
            fa={
              <>
                صفحه‌های <Hl>Developer / Control / Execution / Infra</Hl>
              </>
            }
            en={
              <>
                <Hl>Developer / Control / Execution / Infra</Hl> Planes
              </>
            }
          />
        }
      />
      <div>
        <Plane code="Developer Plane" sub={{ fa: "ورودی", en: "Entry" }} items={["Git integration", "CLI", "API", "Dashboard"]} />
        <PConn />
        <Plane hero accentSub code="Control Plane" sub={{ fa: "وضعیتِ مطلوب", en: "Desired state" }} items={["Projects", "Deployments", "Scheduler", "Config", "Secrets", "Domains"]} />
        <PConn />
        <Plane code="Execution Plane" sub={{ fa: "اجرا", en: "Run" }} items={["Build workers", "App runtime", "Containers", "Health checks"]} />
        <PConn />
        <Plane infra code="Infrastructure Plane" sub={{ fa: "زیرساخت", en: "Infra" }} items={["Compute", "Storage", "Network", "DNS"]} />
      </div>
      <Callout>
        <Bi
          fa="تفکیکِ مسیرِ کنترل از اجرا، پایداری و ارتقای مستقلِ پلتفرم را ممکن می‌کند."
          en="Separating the control path from execution enables independent stability and upgrades."
        />
      </Callout>
    </>
  )
}

/* ---------------- T3 · Deployment lifecycle ---------------- */

export function TechLifecycle() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 03"
        title={
          <BiN
            fa={
              <>
                چرخه‌ی حیاتِ <Hl>استقرار</Hl>
              </>
            }
            en={
              <>
                Deployment <Hl>Lifecycle</Hl>
              </>
            }
          />
        }
      />
      <Flow
        nodes={[
          { code: "Git Push" },
          { code: "Source Detect" },
          { code: "Build" },
          { code: "Artifact" },
          { code: "Isolated Deploy" },
          { code: "Health Check" },
          { code: "Traffic Route" },
          { code: "Production", hero: true },
        ]}
      />
      <Callout>
        <strong>
          <span className="tk">Commit → Deployment</span>
        </strong>
        <Bi
          fa=" — هر تغییرِ کد، مسیرِ کاملِ اعتبارسنجی، ساخت و مسیریابی را طی می‌کند."
          en=" — every code change runs the full validation, build and routing path."
        />
      </Callout>
    </>
  )
}

/* ---------------- T4 · Service runtime model ---------------- */

export function TechRuntime() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 04"
        title={
          <BiN
            fa={
              <>
                مدلِ اجرای <Hl>سرویس</Hl>
              </>
            }
            en={
              <>
                Service <Hl>Runtime</Hl> Model
              </>
            }
          />
        }
      />
      <div className="two">
        <Flow vert nodes={[
          { code: "Tenant", sub: { fa: "مستأجر", en: "Tenant" } },
          { code: "Namespace / Sandbox", sub: { fa: "محدوده‌ی جدا", en: "Isolated scope" } },
          { code: "Container / microVM", sub: { fa: "مرزِ اجرا", en: "Execution boundary" }, hero: true },
          { code: "cgroups · seccomp · netns" },
        ]} />
        <div className="stack">
          <Card title={{ fa: "مرزِ منابع", en: "Resource boundary" }} desc={{ fa: "سهمیه‌ی CPU/RAM برای هر بار کاری.", en: "CPU/RAM quotas per workload." }} />
          <Card title={{ fa: "مرزِ شبکه", en: "Network boundary" }} desc={{ fa: "هر مستأجر در فضای شبکه‌ی مجزا.", en: "Each tenant in its own network space." }} />
          <Card title={{ fa: "مرزِ سیستم‌عامل", en: "OS boundary" }} desc={{ fa: "محدودسازیِ syscall و سطحِ دسترسی.", en: "Constrained syscalls and privileges." }} />
        </div>
      </div>
    </>
  )
}

/* ---------------- T5 · Networking ---------------- */

export function TechNetworking() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 05"
        title={
          <BiN
            fa={
              <>
                <Hl>شبکه</Hl> و مسیریابی
              </>
            }
            en={
              <>
                <Hl>Networking</Hl> & Routing
              </>
            }
          />
        }
      />
      <div className="two">
        <Card accent k="Current">
          <Defs rows={[
            { k: "ingress", v: { fa: "ورودیِ HTTP(S) برای هر سرویس.", en: "HTTP(S) ingress per service." } },
            { k: "domains", v: { fa: "مدیریتِ خودکارِ دامنه و HTTPS.", en: "Automatic domain & HTTPS." } },
            { k: "routing", v: { fa: "مسیریابیِ ترافیک به نمونه‌های سالم.", en: "Routing to healthy instances." } },
          ]} />
        </Card>
        <Card k="Target">
          <Defs rows={[
            { k: "anycast", v: { fa: "توزیعِ لبه‌ایِ ترافیک (هدف).", en: "Edge traffic distribution (target)." } },
            { k: "edge routers", v: { fa: "روترهای لبه برای کاهشِ تأخیر (هدف).", en: "Edge routers to cut latency (target)." } },
            { k: "multi-site", v: { fa: "مسیریابیِ چند-سایت (هدف).", en: "Multi-site routing (target)." } },
          ]} />
        </Card>
      </div>
      <Callout>
        <StateTag kind="current" /> <Bi fa=" امروز پیاده‌سازی شده؛ " en=" shipped today — " /> <StateTag kind="target" /> <Bi fa=" جهتِ توسعه‌ست، نه وضعیتِ فعلی." en=" is a direction, not current state." />
      </Callout>
    </>
  )
}

/* ---------------- T6 · Storage / volumes ---------------- */

export function TechStorage() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 06"
        title={
          <BiN
            fa={
              <>
                ذخیره‌سازی و <Hl>Volumes</Hl>
              </>
            }
            en={
              <>
                Storage & <Hl>Volumes</Hl>
              </>
            }
          />
        }
      />
      <div className="g2">
        <Card title={{ fa: "حجم‌های ماندگار", en: "Persistent volumes" }} desc={{ fa: "دیسکِ متصل به هر سرویس برای داده‌های ماندگار.", en: "Disk attached to a service for durable data." }} />
        <Card title={{ fa: "ذخیره‌سازیِ ابجکت", en: "Object storage" }} desc={{ fa: "محلِ Build artifacts و خروجی‌ها.", en: "Build artifacts and outputs." }} />
        <Card title={{ fa: "لایه‌ی زیرساخت", en: "Infra layer" }} desc={{ fa: "روی Block/Object Storageِ NovinHost قرار دارد.", en: "Sits on NovinHost block/object storage." }} />
        <Card title={{ fa: "پشتیبان‌گیری (هدف)", en: "Backups (target)" }} desc={{ fa: "برنامه‌ریزی و بازیابیِ متمرکز — جهت.", en: "Scheduled, centralized recovery — a direction." }} />
      </div>
    </>
  )
}

/* ---------------- T7 · Observability ---------------- */

export function TechObservability() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 07"
        title={
          <BiN
            fa={
              <>
                مشاهده‌پذیری و <Hl>لاگ</Hl>
              </>
            }
            en={
              <>
                Observability & <Hl>Logs</Hl>
              </>
            }
          />
        }
      />
      <div className="g3">
        <Card title={{ fa: "لاگ", en: "Logs" }} desc={{ fa: "گردآوریِ لاگِ هر سرویس به‌صورتِ زنده.", en: "Live per-service log aggregation." }} />
        <Card title={{ fa: "متریک", en: "Metrics" }} desc={{ fa: "زمانِ پاسخ، بار، مصرفِ منابع.", en: "Latency, throughput, resource use." }} />
        <Card title={{ fa: "سلامت", en: "Health" }} desc={{ fa: "بررسیِ سلامت برای مسیریابی.", en: "Health checks drive routing." }} />
      </div>
    </>
  )
}

/* ---------------- T8 · Identity / security ---------------- */

export function TechSecurity() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 08"
        title={
          <BiN
            fa={
              <>
                امنیت و <Hl>هویت</Hl>
              </>
            }
            en={
              <>
                Security & <Hl>Identity</Hl>
              </>
            }
          />
        }
      />
      <div className="g3">
        <Card title={{ fa: "احرازِ هویت", en: "Authentication" }} desc={{ fa: "کاربر و کلیدهای API.", en: "Users and API keys." }} />
        <Card title={{ fa: "کنترلِ دسترس", en: "Access control" }} desc={{ fa: "محدوده‌ی دسترسی بر پایه‌ی پروژه.", en: "Project-scoped access." }} />
        <Card title={{ fa: "رازها", en: "Secrets" }} desc={{ fa: "تزریقِ ایمنِ متغیرهای محرمانه.", en: "Safe injection of secrets." }} />
        <Card title={{ fa: "ایزولاسیون", en: "Isolation" }} desc={{ fa: "مرزهای اجرا بین مستأجرها.", en: "Runtime boundaries between tenants." }} />
        <Card title={{ fa: "TLS", en: "TLS" }} desc={{ fa: "HTTPS خودکار برای دامنه‌ها.", en: "Automatic HTTPS for domains." }} />
        <Card title={{ fa: "Network policy", en: "Network policy" }} desc={{ fa: "محدودسازیِ ترافیکِ درونِ محیط.", en: "Constrains in-environment traffic." }} />
      </div>
    </>
  )
}

/* ---------------- T9 · Metering / billing ---------------- */

export function TechMetering() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 09"
        title={
          <BiN
            fa={
              <>
                <Hl>Metering</Hl> و Billing
              </>
            }
            en={
              <>
                <Hl>Metering</Hl> & Billing
              </>
            }
          />
        }
      />
      <Flow nodes={[
        { code: "Usage events", sub: { fa: "رویدادهای مصرف", en: "Usage" } },
        { code: "Aggregate", sub: { fa: "تجمیع", en: "Aggregate" } },
        { code: "Metered units", sub: { fa: "واحدهای اندازه‌گیری", en: "Units" }, hero: true },
        { code: "Billing adapter", sub: { fa: "آداپتورِ صورتحساب", en: "Adapter" } },
      ]} />
      <Callout>
        <Bi
          fa="معماریِ Metering جدا از پلتفرم طراحی شده تا به سیستم‌های صورتحسابِ متنوع (از جمله مدلِ NovinHost) متصل شود."
          en="The metering architecture is decoupled so it can plug into different billing systems — including NovinHost's."
        />
      </Callout>
    </>
  )
}

/* ---------------- T10 · Region / replica (target) ---------------- */

export function TechRegion() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 10"
        title={
          <BiN
            fa={
              <>
                معماریِ <Hl>Region / Replica</Hl>
              </>
            }
            en={
              <>
                <Hl>Region / Replica</Hl> Architecture
              </>
            }
          />
        }
      />
      <div className="two">
        <Card k="Current">
          <Defs rows={[
            { k: "single pool", v: { fa: "استقرار روی یک استخرِ زیرساخت.", en: "Runs on a single infra pool." } },
            { k: "replica concept", v: { fa: "مفهومِ نمونه‌های تکرار برای سرویس.", en: "Replica concept per service." } },
          ]} />
        </Card>
        <Card k="Target">
          <Defs rows={[
            { k: "multi-region", v: { fa: "توزیع روی چند منطقه (هدف).", en: "Distribute across regions (target)." } },
            { k: "failover", v: { fa: "انتقالِ بار در صورتِ خطا (هدف).", en: "Workload failover (target)." } },
          ]} />
        </Card>
      </div>
      <Callout>
        <StateTag kind="target" /> <Bi fa=" چند-منطقه‌ای و DR از جهت‌های معماری‌اند، نه ادعای آمادگیِ فعلی." en=" Multi-region and DR are architectural directions, not a claim of current readiness." />
      </Callout>
    </>
  )
}

/* ---------------- T11 · Integration with partner infra ---------------- */

export function TechIntegration() {
  return (
    <>
      <SlideHead
        eyebrow="// deep dive · 11"
        title={
          <BiN
            fa={
              <>
                یکپارچگی با زیرساختِ <Hl>NovinHost</Hl>
              </>
            }
            en={
              <>
                Integration with <Hl>NovinHost</Hl> Infrastructure
              </>
            }
          />
        }
      />
      <div className="g3">
        <Card title={{ fa: "Compute", en: "Compute" }} desc={{ fa: "پلتفرم روی ظرفیتِ محاسباتیِ موجود مستقر می‌شود.", en: "Runs on existing compute capacity." }} />
        <Card title={{ fa: "Storage", en: "Storage" }} desc={{ fa: "Block/Object Storage به‌عنوان لایه‌ی ذخیره‌سازی.", en: "Block/object as the storage layer." }} />
        <Card title={{ fa: "Network", en: "Network" }} desc={{ fa: "شبکه و DNS از طریقِ زیرساخت.", en: "Network & DNS via the infrastructure." }} />
        <Card title={{ fa: "Billing", en: "Billing" }} desc={{ fa: "Metering به سیستمِ صورتحساب متصل می‌شود.", en: "Metering links to the billing system." }} />
        <Card title={{ fa: "Capacity", en: "Capacity" }} desc={{ fa: "تخصیصِ ظرفیت به محصولاتِ منتخب.", en: "Capacity allocated to selected products." }} />
        <Card title={{ fa: "Ops", en: "Operations" }} desc={{ fa: "عملیاتِ زیرساخت با NovinHost.", en: "Infra operations with NovinHost." }} />
      </div>
    </>
  )
}
