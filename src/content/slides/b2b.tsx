"use client"

import { Bi } from "@/app/providers"
import {
  BiN,
  BRow,
  Callout,
  Card,
  Chips,
  Hl,
  Lede,
  Plane,
  PConn,
  SlideHead,
} from "@/components/kit"

/* ============================ partner ============================ */

export function Partner() {
  return (
    <>
      <SlideHead
        eyebrow="// for the partner"
        sm
        title={
          <BiN
            fa={
              <>
                از <Hl>ارائه‌دهنده‌ی زیرساخت</Hl> به پلتفرمِ توسعه‌دهنده
              </>
            }
            en={
              <>
                From <Hl>Infrastructure Provider</Hl> to Developer Platform
              </>
            }
          />
        }
      />
      <div className="two">
        <div>
          <Plane
            hero
            code="ParsLinks"
            sub={{ fa: "لایه‌ی مصرفِ جدید", en: "A new consumption layer" }}
            accentSub
            items={["Deploy", "Build", "Runtime", "Edge"]}
          />
          <PConn up />
          <Plane
            infra
            code="Partner services"
            sub={{ fa: "سرویس‌های شریک", en: "The partner's services" }}
            items={[
              { fa: "دامنه", en: "Domains" },
              "SSL",
              "VM",
              "Cloud",
              "Storage",
              "Network",
              { fa: "کولوکیشن", en: "Colocation" },
            ]}
          />
        </div>
        <div>
          <BRow
            icon="↑"
            title={{ fa: "بهره‌وریِ بالاترِ زیرساخت", en: "Higher utilization" }}
            sub={{ fa: "مصرفِ بیشترِ ظرفیتِ موجود", en: "More of existing capacity used" }}
          />
          <BRow
            icon="+"
            title={{ fa: "مشتریانِ توسعه‌دهنده‌ی جدید", en: "New developer customers" }}
            sub={{ fa: "ورود به بازارِ دِوها", en: "Entry into the developer market" }}
          />
          <BRow
            icon="★"
            title={{ fa: "سرویس‌های باارزش‌تر", en: "Higher-value services" }}
            sub={{ fa: "حرکت به بالای زنجیره‌ی ارزش", en: "Moving up the value chain" }}
          />
          <BRow
            icon="∞"
            title={{ fa: "چرخه‌ی عمرِ طولانی‌تر", en: "Longer customer lifecycle" }}
            sub={{ fa: "وابستگیِ سالمِ محصولی", en: "Healthy product stickiness" }}
          />
          <BRow
            icon="⇄"
            title={{ fa: "فروشِ مکمل", en: "Cross-selling" }}
            sub={{ fa: "روی سرویس‌های موجود", en: "On existing services" }}
          />
          <BRow
            icon="◆"
            title={{ fa: "پیشنهادِ ابریِ متمایز", en: "A differentiated cloud" }}
            sub={{ fa: "تمایز در بازار رقابتی", en: "Standing out competitively" }}
          />
        </div>
      </div>
      <Callout saf>
        <Bi fa="ParsLinks با پرتفویِ زیرساختِ شریک " en="ParsLinks " />
        <strong>
          <Bi fa="رقابت نمی‌کند" en="does not compete" />
        </strong>
        <Bi
          fa=" — یک لایه‌ی مصرفِ جدید برای آن می‌سازد."
          en=" with the partner's infrastructure portfolio — it creates a new consumption layer for it."
        />
      </Callout>
    </>
  )
}

/* ============================ strategic ============================ */

const STRATEGIC = [
  {
    k: "01",
    title: { fa: "زیرساختِ اپلیکیشنِ محلی", en: "Local application infrastructure" },
    desc: {
      fa: "لایه‌ی اپلیکیشن روی ظرفیتِ داخلی مستقر می‌شود.",
      en: "The application layer runs on domestic capacity.",
    },
  },
  {
    k: "02",
    title: { fa: "کاهشِ وابستگی", en: "Reduced dependency" },
    desc: {
      fa: "اتکای کمتر به پلتفرم‌های خارجی.",
      en: "Less reliance on foreign developer platforms.",
    },
  },
  {
    k: "03",
    title: { fa: "ترافیک و بهره‌وریِ داخلی", en: "Domestic traffic & utilization" },
    desc: {
      fa: "گردشِ ترافیک و مصرفِ زیرساخت در داخل.",
      en: "Traffic and infrastructure use stay inside.",
    },
  },
  {
    k: "04",
    title: { fa: "اقامتِ داده", en: "Data residency" },
    desc: {
      fa: "Data residency روی زیرساختِ کشور.",
      en: "Data residency on national infrastructure.",
    },
  },
  {
    k: "05",
    title: { fa: "تأخیرِ کمتر", en: "Lower latency" },
    desc: { fa: "Latency پایین‌تر برای کاربرانِ داخلی.", en: "Lower latency for local users." },
  },
  {
    k: "06",
    title: { fa: "تاب‌آوری", en: "Resilience" },
    desc: {
      fa: "پایداری در برابرِ محدودیت‌های خارجی.",
      en: "Stability against restrictions on foreign services.",
    },
    accent: true,
  },
]

export function Strategic() {
  return (
    <>
      <SlideHead
        eyebrow="// strategic"
        sm
        title={
          <BiN
            fa={
              <>
                پلتفرمِ اپلیکیشنِ <Hl>بومی</Hl>، روی زیرساختِ داخلی
              </>
            }
            en={
              <>
                A <Hl>Native</Hl> Application Platform, on Domestic Infrastructure
              </>
            }
          />
        }
      />
      <div className="g3">
        {STRATEGIC.map((s) => (
          <Card key={s.k} k={s.k} title={s.title} desc={s.desc} accent={s.accent} />
        ))}
      </div>
      <Lede muted>
        <Bi
          fa="این لایه، بستری برای اکوسیستمِ توسعه‌دهندگانِ ایران فراهم می‌کند — بدونِ بزرگ‌نماییِ مفاهیمی که پلتفرم واقعاً آن‌ها را ارائه نمی‌دهد."
          en="This layer gives Iran's developer ecosystem a foundation — without overselling properties the platform doesn't truly deliver."
        />
      </Lede>
    </>
  )
}

/* ============================ partnership ============================ */

export function Partnership() {
  return (
    <>
      <SlideHead
        eyebrow="// partnership"
        title={
          <BiN
            fa={
              <>
                مدلِ <Hl>مشارکت</Hl>
              </>
            }
            en={
              <>
                Partnership <Hl>Model</Hl>
              </>
            }
          />
        }
      />
      <div className="two">
        <Card accent k="ParsLinks">
          <Chips
            items={[
              { fa: "مهندسیِ پلتفرم", en: "Platform engineering" },
              { fa: "توسعه‌ی محصول", en: "Product development" },
              { fa: "تجربه‌ی توسعه‌دهنده", en: "Developer experience" },
              { fa: "رانتایم", en: "Runtime" },
              { fa: "هماهنگ‌سازی", en: "Orchestration" },
              { fa: "عملیاتِ پلتفرم", en: "Platform operations" },
              { fa: "اکوسیستمِ توسعه‌دهنده", en: "Developer ecosystem" },
            ]}
            on
          />
        </Card>
        <Card k={{ fa: "شریکِ زیرساخت", en: "Infrastructure Partner" }}>
          <Chips
            items={[
              "Compute",
              { fa: "شبکه", en: "Network" },
              { fa: "ذخیره‌سازی", en: "Storage" },
              { fa: "ظرفیتِ دیتاسنتر", en: "Datacenter capacity" },
              { fa: "یکپارچگیِ ابری", en: "Cloud integration" },
              { fa: "دسترسیِ تجاری", en: "Commercial reach" },
              { fa: "پایگاهِ مشتریانِ موجود", en: "Existing customer base" },
            ]}
          />
        </Card>
      </div>
      <Callout center>
        <Bi fa="با هم: " en="Together: " />
        <strong>
          <Bi
            fa="یک پلتفرمِ ابریِ توسعه‌دهنده با قابلیتِ مقیاس در سطحِ ملی."
            en="a developer cloud platform that can scale nationally."
          />
        </strong>
      </Callout>
    </>
  )
}

/* ============================ moat ============================ */

export function Moat() {
  return (
    <>
      <SlideHead
        eyebrow="// moat"
        title={
          <BiN
            fa={
              <>
                چرا ساختنِ <Hl>ParsLinks</Hl> دشوار است
              </>
            }
            en={
              <>
                Why <Hl>ParsLinks</Hl> Is Hard to Build
              </>
            }
          />
        }
      />
      <Lede>
        <Bi
          fa="یک پلتفرمِ توسعه‌دهنده صرفاً یک پنلِ وب دورِ Kubernetes نیست. ترکیبی‌ست از ده‌ها مؤلفه که باید کنارِ هم قابل‌اعتماد کار کنند:"
          en="A developer platform isn't just a web panel around Kubernetes. It's dozens of components that must work together reliably:"
        />
      </Lede>
      <Chips
        on
        items={[
          { fa: "تجربه‌ی توسعه‌دهنده", en: "Developer experience" },
          { fa: "زیرساختِ Build", en: "Build infrastructure" },
          { fa: "زمان‌بندی", en: "Scheduling" },
          { fa: "ایزولاسیونِ رانتایم", en: "Runtime isolation" },
          { fa: "شبکه", en: "Networking" },
          "DNS",
          { fa: "گواهی‌ها", en: "Certificates" },
          { fa: "هماهنگیِ استقرار", en: "Deployment orchestration" },
          { fa: "مشاهده‌پذیری", en: "Observability" },
          { fa: "مدیریتِ منابع", en: "Resource management" },
          { fa: "امنیت", en: "Security" },
          { fa: "اتوماسیونِ پلتفرم", en: "Platform automation" },
        ]}
      />
      <Callout>
        <Bi
          fa="مزیتِ رقابتی یک فناوریِ واحد نیست — "
          en="The competitive advantage isn't a single technology — it's "
        />
        <strong>
          <Bi
            fa="یکپارچه‌سازیِ ده‌ها مؤلفه‌ی زیرساختی در یک تجربه‌ی توسعه‌ی قابل‌اعتماد است."
            en="integrating dozens of infrastructure components into one reliable developer experience."
          />
        </strong>
      </Callout>
      <Lede muted>
        <Bi
          fa="این همان چیزی‌ست که پنج مهندس در چند ماه بازتولید نمی‌کنند؛ ارزشِ واقعی در دانشِ ادغام است."
          en="This is what five engineers don't reproduce in a few months; the real value is the integration knowledge."
        />
      </Lede>
    </>
  )
}
