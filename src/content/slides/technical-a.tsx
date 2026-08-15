"use client"

import { Bi } from "@/app/providers"
import {
  BiN,
  Callout,
  Card,
  Defs,
  Flow,
  Hl,
  Lede,
  Plane,
  PConn,
  SlideHead,
} from "@/components/kit"

/* ============================ wheresits ============================ */

export function WhereSits() {
  return (
    <>
      <SlideHead
        eyebrow="// architecture"
        sm
        title={
          <BiN
            fa={
              <>
                <Hl>ParsLinks</Hl> در کجای معماری قرار می‌گیرد
              </>
            }
            en={
              <>
                Where <Hl>ParsLinks</Hl> Sits in the Architecture
              </>
            }
          />
        }
      />
      <div>
        <Plane
          code="Developer / Git"
          sub={{ fa: "توسعه‌دهنده", en: "Developer" }}
          items={["Push", "CLI", "API"]}
        />
        <PConn />
        <Plane
          hero
          accentSub
          code="Control Plane"
          sub={{ fa: "صفحه‌ی کنترل", en: "Platform brain" }}
          items={["Build System", "Runtime Layer", "Platform Services"]}
        />
        <PConn />
        <Plane
          code="Orchestration"
          sub={{ fa: "هماهنگ‌سازی", en: "Orchestration" }}
          items={["Scheduling", "Placement", "Routing"]}
        />
        <PConn />
        <Plane
          infra
          code="Partner Cloud"
          sub={{ fa: "زیرساختِ شریک", en: "Partner infrastructure" }}
          items={["Compute", "Storage", "Network"]}
        />
      </div>
      <Lede muted>
        <Bi
          fa="هدف این نیست که هر زیرسیستم را توضیح دهیم — بلکه نشان می‌دهیم که نحوه‌ی ساختِ پلتفرم را می‌فهمیم و آن روی زیرساختِ شریک می‌نشیند."
          en="The goal isn't to explain every subsystem — it's to show that we understand how the platform is built, and that it sits on the partner's infrastructure."
        />
      </Lede>
    </>
  )
}

/* ============================ platformarch ============================ */

export function PlatformArch() {
  return (
    <>
      <SlideHead
        eyebrow="// architecture"
        title={
          <BiN
            fa={
              <>
                معماریِ پلتفرمِ <Hl>ParsLinks</Hl>
              </>
            }
            en={
              <>
                <Hl>ParsLinks</Hl> Platform Architecture
              </>
            }
          />
        }
      />
      <div>
        <Plane
          code="Developer Plane"
          sub={{ fa: "صفحه‌ی توسعه‌دهنده", en: "" }}
          items={["Git integration", "CLI", "API", "Dashboard"]}
        />
        <PConn />
        <Plane
          hero
          accentSub
          code="Control Plane"
          sub={{ fa: "صفحه‌ی کنترل", en: "" }}
          items={["Projects", "Deployments", "Scheduler", "Config", "Secrets", "Domains"]}
        />
        <PConn />
        <Plane
          code="Execution Plane"
          sub={{ fa: "صفحه‌ی اجرا", en: "" }}
          items={["Build workers", "App runtime", "Containers / Functions", "Autoscaling"]}
        />
        <PConn />
        <Plane
          infra
          code="Infrastructure Plane"
          sub={{ fa: "صفحه‌ی زیرساخت", en: "" }}
          items={["Compute", "Storage", "Network", "DNS", "Load Balancing"]}
        />
      </div>
    </>
  )
}

/* ============================ lifecycle ============================ */

export function Lifecycle() {
  return (
    <>
      <SlideHead
        eyebrow="// lifecycle"
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
          fa=" — هر تغییری در کد، مسیرِ کاملِ اعتبارسنجی، ساخت و مسیریابیِ ترافیک را طی می‌کند."
          en=" — every code change runs the full path of validation, build and traffic routing."
        />
      </Callout>
      <Lede muted>
        <Bi
          fa="این‌جا پیچیدگیِ مهندسیِ پلتفرم دیده می‌شود — بدونِ نیاز به بیستْ اصطلاحِ فنی برای درکِ ارزش آن."
          en="This is where the platform's engineering shows — without needing twenty acronyms to grasp its value."
        />
      </Lede>
    </>
  )
}

/* ============================ a1 ============================ */

export function A1() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 01"
        title={
          <BiN
            fa={
              <>
                معماریِ <Hl>تفصیلیِ سیستم</Hl>
              </>
            }
            en={
              <>
                Detailed <Hl>System Architecture</Hl>
              </>
            }
          />
        }
      />
      <div>
        <Plane
          code="Ingress / API"
          sub={{ fa: "ورودی", en: "Ingress" }}
          items={["API Gateway", "Auth", "Rate limit", "Webhooks (Git)"]}
        />
        <PConn />
        <Plane
          hero
          accentSub
          code="Control Plane"
          sub={{ fa: "مغز پلتفرم", en: "Platform brain" }}
          items={[
            "Project registry",
            "Deployment engine",
            "Scheduler",
            "Config / Secrets",
            "Domain manager",
          ]}
        />
        <PConn />
        <Plane
          code="Data Plane"
          sub={{ fa: "اجرا", en: "Execution" }}
          items={["Build fleet", "Runtime pods", "Edge routers", "Metrics agents"]}
        />
        <PConn />
        <Plane
          infra
          code="Partner Infra"
          sub={{ fa: "زیرساخت", en: "Infrastructure" }}
          items={["Compute", "Block / Object storage", "SDN", "DNS"]}
        />
      </div>
      <Lede muted>
        <Bi
          fa="جداسازیِ مسیرِ کنترل از مسیرِ داده اجازه می‌دهد پلتفرم مستقل از بارِ کاربران، پایدار و قابل‌ارتقا بماند."
          en="Separating the control path from the data path lets the platform stay stable and upgradable independent of user load."
        />
      </Lede>
    </>
  )
}

/* ============================ a2 ============================ */

export function A2() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 02"
        title={
          <BiN
            fa={
              <>
                <span className="tk">Control</span> در برابرِ{" "}
                <Hl>
                  <span className="tk">Data Plane</span>
                </Hl>
              </>
            }
            en={
              <>
                <span className="tk">Control</span> vs{" "}
                <Hl>
                  <span className="tk">Data Plane</span>
                </Hl>
              </>
            }
          />
        }
      />
      <div className="two">
        <Card accent k="Control Plane">
          <Defs
            rows={[
              {
                k: "state",
                v: {
                  fa: "منبعِ حقیقتِ پروژه‌ها، استقرارها و پیکربندی.",
                  en: "Source of truth for projects, deployments and config.",
                },
              },
              {
                k: "scheduling",
                v: {
                  fa: "تصمیم درباره‌ی محلِ اجرای هر بار کاری.",
                  en: "Decides where each workload runs.",
                },
              },
              {
                k: "reconcile",
                v: {
                  fa: "هم‌گراییِ وضعیتِ مطلوب و واقعی.",
                  en: "Converges desired and actual state.",
                },
              },
            ]}
          />
        </Card>
        <Card k="Data Plane">
          <Defs
            rows={[
              {
                k: "execute",
                v: {
                  fa: "اجرای واقعیِ Build و اپلیکیشن.",
                  en: "The actual running of builds and apps.",
                },
              },
              {
                k: "route",
                v: { fa: "مسیریابیِ ترافیکِ کاربرانِ نهایی.", en: "Routes end-user traffic." },
              },
              {
                k: "stateless",
                v: {
                  fa: "قابلِ جایگزینی و مقیاسِ افقی.",
                  en: "Replaceable and horizontally scalable.",
                },
              },
            ]}
          />
        </Card>
      </div>
      <Callout>
        <Bi
          fa="خرابیِ Data Plane نباید Control Plane را از کار بیندازد — و برعکس. "
          en="A Data Plane failure must not take down the Control Plane — and vice versa. "
        />
        <strong>
          <Bi fa="ایزولاسیونِ شکست" en="Failure isolation" />
        </strong>
        <Bi fa=" اصلِ طراحی است." en=" is a design principle." />
      </Callout>
    </>
  )
}

/* ============================ a3 ============================ */

export function A3() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 03"
        title={
          <BiN
            fa={
              <>
                چگونه اپلیکیشن‌ها را <Hl>ایزوله</Hl> اجرا می‌کنیم
              </>
            }
            en={
              <>
                How We Run Applications in <Hl>Isolation</Hl>
              </>
            }
          />
        }
      />
      <div className="two">
        <Flow
          vert
          nodes={[
            { code: "Tenant", sub: { fa: "مستأجر", en: "Tenant" } },
            { code: "Namespace / Sandbox", sub: { fa: "محدوده‌ی جدا", en: "Isolated scope" } },
            {
              code: "Container / microVM",
              sub: { fa: "مرزِ اجرا", en: "Execution boundary" },
              hero: true,
            },
            { code: "cgroups · seccomp · netns" },
          ]}
        />
        <div className="stack">
          <Card
            title={{ fa: "مرزِ منابع", en: "Resource boundary" }}
            desc={{
              fa: "سهمیه‌ی CPU/RAM برای هر بار کاری.",
              en: "CPU/RAM quotas per workload.",
            }}
          />
          <Card
            title={{ fa: "مرزِ شبکه", en: "Network boundary" }}
            desc={{
              fa: "هر مستأجر در فضای شبکه‌ی مجزا.",
              en: "Each tenant in its own network space.",
            }}
          />
          <Card
            title={{ fa: "مرزِ سیستم‌عامل", en: "OS boundary" }}
            desc={{
              fa: "محدودسازیِ syscall و سطحِ دسترسی.",
              en: "Constrained syscalls and privileges.",
            }}
          />
        </div>
      </div>
    </>
  )
}

/* ============================ a4 ============================ */

export function A4() {
  return (
    <>
      <SlideHead
        eyebrow="// appendix · 04"
        title={
          <BiN
            fa={
              <>
                معماریِ خطِ لوله‌ی{" "}
                <Hl>
                  <span className="tk">Build</span>
                </Hl>
              </>
            }
            en={
              <>
                <Hl>
                  <span className="tk">Build</span>
                </Hl>{" "}
                Pipeline Architecture
              </>
            }
          />
        }
      />
      <Flow
        nodes={[
          { code: "Source" },
          { code: "Detect stack" },
          { code: "Isolated builder" },
          { code: "Cache layers" },
          { code: "Artifact" },
          { code: "Registry", hero: true },
        ]}
      />
      <div className="g2">
        <Card
          title={{ fa: "Builderهای یک‌بارمصرف", en: "Ephemeral builders" }}
          desc={{
            fa: "هر Build در محیطِ تازه و ایزوله اجرا می‌شود؛ بدونِ نشتِ حالت بین مستأجرها.",
            en: "Each build runs in a fresh, isolated environment — no state leaks between tenants.",
          }}
        />
        <Card
          title={{ fa: "کشِ لایه‌ای", en: "Layer caching" }}
          desc={{
            fa: "وابستگی‌ها و لایه‌های تکراری کش می‌شوند تا زمانِ Build کوتاه بماند.",
            en: "Dependencies and repeated layers are cached to keep build times short.",
          }}
        />
      </div>
    </>
  )
}
