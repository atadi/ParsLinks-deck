"use client"

import type { ReactNode } from "react"

import { Bi, useLang, type T } from "@/app/providers"

/* ------------------------------------------------------------------
   kit.tsx — the shared slide primitives.
   Slides compose ONLY these; the Deck supplies the .slide frame.
   ------------------------------------------------------------------ */

export function SlideHead({
  eyebrow,
  title,
  sm,
}: {
  eyebrow: string
  title: ReactNode
  sm?: boolean
}) {
  return (
    <header className="stack" style={{ gap: 10 }}>
      <span className="eyebrow">{eyebrow}</span>
      <h1 className={sm ? "title sm" : "title"}>{title}</h1>
    </header>
  )
}

/** Title highlight span (turquoise). */
export function Hl({ children }: { children: ReactNode }) {
  return <span className="hl">{children}</span>
}

/** Bilingual JSX (for titles that contain <Hl> / <span className="tk">). */
export function BiN({ fa, en }: { fa: ReactNode; en: ReactNode }) {
  const { lang } = useLang()
  return <>{lang === "fa" ? fa : en}</>
}

export function Lede({
  children,
  muted,
  center,
}: {
  children: ReactNode
  muted?: boolean
  center?: boolean
}) {
  return (
    <p
      className={muted ? "lede muted" : "lede"}
      style={center ? { textAlign: "center", marginInline: "auto" } : undefined}
    >
      {children}
    </p>
  )
}

export function Callout({
  children,
  saf,
  center,
}: {
  children: ReactNode
  saf?: boolean
  center?: boolean
}) {
  return (
    <div className={["callout", saf && "saf", center && "center"].filter(Boolean).join(" ")}>
      <p>{children}</p>
    </div>
  )
}

/* ---------------- plane ---------------- */

export function Plane({
  code,
  sub,
  items,
  hero,
  infra,
  accentSub,
}: {
  code: string
  sub?: T
  /** Plain string = language-neutral token; T pair = bilingual label. */
  items: (string | T)[]
  hero?: boolean
  infra?: boolean
  accentSub?: boolean
}) {
  return (
    <div className={["plane", hero && "hero", infra && "infra"].filter(Boolean).join(" ")}>
      <div className="plabel">
        <span className="tk">{code}</span>
        {sub && (
          <span className={accentSub ? "sub accent" : "sub"}>
            <Bi {...sub} />
          </span>
        )}
      </div>
      <div className="pbody">
        {items.map((it, i) =>
          typeof it === "string" ? (
            <span className="chip tk" key={i}>
              {it}
            </span>
          ) : (
            <span className="chip" key={i}>
              <Bi {...it} />
            </span>
          ),
        )}
      </div>
    </div>
  )
}

/** Plane connector. */
export function PConn({ up }: { up?: boolean }) {
  return <div className={up ? "pconn up" : "pconn"} aria-hidden />
}

/* ---------------- flow ---------------- */

export function Fnode({
  code,
  sub,
  hero,
}: {
  code?: string
  sub?: T
  hero?: boolean
}) {
  return (
    <div className={hero ? "fnode hero" : "fnode"}>
      {code && <span className="tk">{code}</span>}
      {sub && (
        <span className="sub">
          <Bi {...sub} />
        </span>
      )}
    </div>
  )
}

export function Arrow({ down }: { down?: boolean }) {
  return <span className={down ? "farr down" : "farr"} aria-hidden />
}

/** Joins nodes with direction-aware arrows. */
export function Flow({
  nodes,
  vert,
}: {
  nodes: { code?: string; sub?: T; hero?: boolean }[]
  vert?: boolean
}) {
  return (
    <div className={vert ? "flow vert" : "flow"}>
      {nodes.map((n, i) => (
        <Fragmentish key={i}>
          {i > 0 && <Arrow down={vert} />}
          <Fnode {...n} />
        </Fragmentish>
      ))}
    </div>
  )
}

/** Tiny helper so Flow can emit arrow+node pairs without extra DOM. */
function Fragmentish({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/* ---------------- card / chips / pills ---------------- */

export function Card({
  k,
  title,
  desc,
  accent,
  children,
}: {
  k?: string | T
  title?: T
  desc?: T
  accent?: boolean
  children?: ReactNode
}) {
  return (
    <div className={accent ? "card accent" : "card"}>
      {k !== undefined &&
        (typeof k === "string" ? (
          <span className="k tk">{k}</span>
        ) : (
          <span className="k">
            <Bi {...k} />
          </span>
        ))}
      {title && (
        <h3 className="ct">
          <Bi {...title} />
        </h3>
      )}
      {desc && (
        <p className="cd">
          <Bi {...desc} />
        </p>
      )}
      {children}
    </div>
  )
}

export function Chip({ children, on }: { children: ReactNode; on?: boolean }) {
  return <span className={on ? "chip on" : "chip"}>{children}</span>
}

/** Bilingual/neutral chip list. */
export function Chips({ items, on }: { items: (string | T)[]; on?: boolean }) {
  return (
    <div className="flow" style={{ gap: 8 }}>
      {items.map((it, i) =>
        typeof it === "string" ? (
          <Chip on={on} key={i}>
            <span className="tk">{it}</span>
          </Chip>
        ) : (
          <Chip on={on} key={i}>
            <Bi {...it} />
          </Chip>
        ),
      )}
    </div>
  )
}

export type Status = "ok" | "dev" | "plan"

const STATUS_LABEL: Record<Status, T> = {
  ok: { fa: "موجود", en: "Available" },
  dev: { fa: "در توسعه", en: "In dev" },
  plan: { fa: "برنامه", en: "Planned" },
}

export function Pill({ s }: { s: Status }) {
  return (
    <span className={`pill ${s}`}>
      <Bi {...STATUS_LABEL[s]} />
    </span>
  )
}

/* ---------------- def list ---------------- */

export function Defs({ rows }: { rows: { k: string; v: T }[] }) {
  return (
    <div className="defs">
      {rows.map((r, i) => (
        <div className="row" key={i}>
          <span className="dk">{r.k}</span>
          <span className="dv">
            <Bi {...r.v} />
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- benefit row ---------------- */

export function BRow({ icon, title, sub }: { icon: string; title: T; sub: T }) {
  return (
    <div className="brow">
      <span className="bic" aria-hidden>
        {icon}
      </span>
      <div>
        <div className="bt">
          <Bi {...title} />
        </div>
        <div className="bs">
          <Bi {...sub} />
        </div>
      </div>
    </div>
  )
}

/* ==================================================================
   NEW STRATEGIC COMPOSITIONS (ParsLinks × NovinHost deck)
   These give each major section its own visual rhythm rather than
   the repeated heading+cards+chips+callout template.
   ================================================================== */

/** Big editorial statement — a section that is mostly a conclusion. */
export function Statement({
  kicker,
  lead,
  sub,
  center,
}: {
  kicker?: string
  lead: ReactNode
  sub?: ReactNode
  center?: boolean
}) {
  return (
    <div className={center ? "statement center" : "statement"}>
      {kicker && <span className="eyebrow">{kicker}</span>}
      <p className="statement-lead">{lead}</p>
      {sub && <p className="statement-sub">{sub}</p>}
    </div>
  )
}

/** Capability-equation: A + B → C, used for the strategic thesis. */
export function Equation({
  left,
  plus,
  right,
  arrow,
  result,
}: {
  left: ReactNode
  plus?: string
  right: ReactNode
  arrow?: string
  result: ReactNode
}) {
  return (
    <div className="equation" role="img" aria-label="capability equation">
      <div className="eq-side eq-a">{left}</div>
      <span className="eq-op" aria-hidden>
        {plus ?? "+"}
      </span>
      <div className="eq-side eq-b">{right}</div>
      <span className="eq-op eq-arrow" aria-hidden>
        {arrow ?? "→"}
      </span>
      <div className="eq-side eq-r">{result}</div>
    </div>
  )
}

/** Split-screen: two complementary capability columns (NovinHost | ParsLinks). */
export function Split({
  left,
  right,
}: {
  left: { brand: T; items: T[]; side: "infra" | "soft" }
  right: { brand: T; items: T[]; side: "infra" | "soft" }
}) {
  return (
    <div className="split">
      <div className={`split-col ${left.side}`}>
        <div className="split-head">
          <span className="split-brand">
            <Bi {...left.brand} />
          </span>
          <span className="split-tag">{left.side === "infra" ? "Infrastructure" : "Software"}</span>
        </div>
        <ul className="split-list">
          {left.items.map((it, i) => (
            <li key={i}>
              <Bi {...it} />
            </li>
          ))}
        </ul>
      </div>
      <div className={`split-col ${right.side}`}>
        <div className="split-head">
          <span className="split-brand">
            <Bi {...right.brand} />
          </span>
          <span className="split-tag">{right.side === "infra" ? "Infrastructure" : "Software"}</span>
        </div>
        <ul className="split-list">
          {right.items.map((it, i) => (
            <li key={i}>
              <Bi {...it} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Layered architecture diagram — vertical stack of labelled layers. */
export function LayerStack({
  layers,
}: {
  layers: { label: T; sub?: T; tone?: "infra" | "soft" | "prod" | "cust" }[]
}) {
  return (
    <div className="layers">
      {layers.map((l, i) => (
        <div
          key={i}
          className={`layer ${l.tone ?? "cust"} ${i === layers.length - 1 ? "base" : ""}`}
        >
          <span className="layer-label">
            <Bi {...l.label} />
          </span>
          {l.sub && (
            <span className="layer-sub">
              <Bi {...l.sub} />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/** Before / after comparison (raw resources → productized services). */
export function Compare({
  before,
  after,
}: {
  before: { title: T; items: string[] }
  after: { title: T; items: T[] }
}) {
  return (
    <div className="compare">
      <div className="compare-col before">
        <div className="compare-title">
          <Bi {...before.title} />
        </div>
        <div className="compare-items">
          {before.items.map((it, i) => (
            <span className="tk chip" key={i}>
              {it}
            </span>
          ))}
        </div>
      </div>
      <span className="compare-arrow" aria-hidden>
        →
      </span>
      <div className="compare-col after">
        <div className="compare-title">
          <Bi {...after.title} />
        </div>
        <div className="compare-items">
          {after.items.map((it, i) => (
            <span className="chip on" key={i}>
              <Bi {...it} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Opportunity / product-family map — labelled cluster of chips. */
export function OppMap({
  families,
}: {
  families: { name: T; items: T[] }[]
}) {
  return (
    <div className="oppmap">
      {families.map((f, i) => (
        <div className="opp-fam" key={i}>
          <div className="opp-name">
            <Bi {...f.name} />
          </div>
          <div className="opp-items">
            {f.items.map((it, j) => (
              <span className="chip" key={j}>
                <Bi {...it} />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Product-scenario flow — a concrete joint-use case. */
export function Scenario({
  title,
  steps,
}: {
  title: T
  steps: string[]
}) {
  return (
    <div className="scenario">
      <div className="sc-title">
        <Bi {...title} />
      </div>
      <div className="sc-flow">
        {steps.map((s, i) => (
          <span className="sc-step" key={i}>
            {i > 0 && <span className="sc-conn" aria-hidden>→</span>}
            <span className="tk">{s}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Partnership-model matrix — label grid. */
export function Matrix({
  models,
}: {
  models: { name: T; desc: T }[]
}) {
  return (
    <div className="matrix">
      {models.map((m, i) => (
        <div className="matrix-cell" key={i}>
          <div className="matrix-name">
            <Bi {...m.name} />
          </div>
          <div className="matrix-desc">
            <Bi {...m.desc} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Pilot timeline — staged, low-risk path. */
export function Timeline({
  steps,
}: {
  steps: { k: string; label: T; note?: T }[]
}) {
  return (
    <div className="timeline">
      {steps.map((s, i) => (
        <div className="tl-step" key={i}>
          <span className="tl-dot" aria-hidden />
          <span className="tl-k tk">{s.k}</span>
          <span className="tl-label">
            <Bi {...s.label} />
          </span>
          {s.note && (
            <span className="tl-note">
              <Bi {...s.note} />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/** Phase marker — a section opener that names the phase, no claims. */
export function Phase({
  n,
  label,
  children,
}: {
  n: string
  label: T
  children?: ReactNode
}) {
  return (
    <div className="phase">
      <span className="phase-n tk">{n}</span>
      <span className="phase-label">
        <Bi {...label} />
      </span>
      {children}
    </div>
  )
}

/** Discussion prompt list — closing questions. */
export function Questions({ items }: { items: T[] }) {
  return (
    <ul className="questions">
      {items.map((it, i) => (
        <li key={i}>
          <span className="q-mark" aria-hidden>
            ?
          </span>
          <Bi {...it} />
        </li>
      ))}
    </ul>
  )
}

/** Target/current state tag used in the technical deep-dive. */
export function StateTag({ kind }: { kind: "current" | "target" }) {
  return (
    <span className={`statetag ${kind}`}>
      <Bi
        fa={kind === "current" ? "وضعیت فعلی" : "معماری هدف"}
        en={kind === "current" ? "Current" : "Target"}
      />
    </span>
  )
}
