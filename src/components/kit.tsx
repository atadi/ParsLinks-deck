"use client"

import type { ReactNode } from "react"

import { CT } from "@/content/edit"

/* ------------------------------------------------------------------
   kit.tsx — the shared slide primitives.
   Slides compose ONLY these; the Deck supplies the .slide frame.
   Labels are plain ReactNode: slides pass <CT k="id"/> content
   bindings (see src/content/edit.tsx) or literal technical tokens.
   ------------------------------------------------------------------ */

export function SlideHead({
  eyebrow,
  title,
  sm,
}: {
  eyebrow: ReactNode
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

/** Title highlight span (turquoise). Kept for ad-hoc JSX titles. */
export function Hl({ children }: { children: ReactNode }) {
  return <span className="hl">{children}</span>
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
  code?: ReactNode
  /** Bilingual/bound label rendered in the plane header. */
  sub?: ReactNode
  items?: ReactNode[]
  hero?: boolean
  infra?: boolean
  accentSub?: boolean
}) {
  return (
    <div className={["plane", hero && "hero", infra && "infra"].filter(Boolean).join(" ")}>
      <div className="plabel">
        {code !== undefined && <span className="tk">{code}</span>}
        {sub && <span className={accentSub ? "sub accent" : "sub"}>{sub}</span>}
      </div>
      {items && items.length > 0 && (
        <div className="pbody">
          {items.map((it, i) => (
            <span className="chip tk" key={i}>
              {it}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Plane connector. */
export function PConn({ up }: { up?: boolean }) {
  return <div className={up ? "pconn up" : "pconn"} aria-hidden />
}

/* ---------------- flow ---------------- */

export interface FlowNodeSpec {
  code?: ReactNode
  sub?: ReactNode
  hero?: boolean
}

export function Fnode({ code, sub, hero }: FlowNodeSpec) {
  return (
    <div className={hero ? "fnode hero" : "fnode"}>
      {code && <span className="tk">{code}</span>}
      {sub && <span className="sub">{sub}</span>}
    </div>
  )
}

export function Arrow({ down }: { down?: boolean }) {
  return <span className={down ? "farr down" : "farr"} aria-hidden />
}

/** Joins nodes with direction-aware arrows. */
export function Flow({ nodes, vert }: { nodes: FlowNodeSpec[]; vert?: boolean }) {
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
  k?: ReactNode
  title?: ReactNode
  desc?: ReactNode
  accent?: boolean
  children?: ReactNode
}) {
  return (
    <div className={accent ? "card accent" : "card"}>
      {k !== undefined && <span className="k">{k}</span>}
      {title && <h3 className="ct">{title}</h3>}
      {desc && <p className="cd">{desc}</p>}
      {children}
    </div>
  )
}

export function Chip({ children, on }: { children: ReactNode; on?: boolean }) {
  return <span className={on ? "chip on" : "chip"}>{children}</span>
}

/** Chip list of language-neutral technical tokens. */
export function Chips({ items, on }: { items: string[]; on?: boolean }) {
  return (
    <div className="flow" style={{ gap: 8 }}>
      {items.map((it, i) => (
        <Chip on={on} key={i}>
          <span className="tk">{it}</span>
        </Chip>
      ))}
    </div>
  )
}

export type Status = "ok" | "dev" | "plan"

const STATUS_KEY: Record<Status, string> = {
  ok: "state.ok",
  dev: "state.dev",
  plan: "state.plan",
}

export function Pill({ s }: { s: Status }) {
  return (
    <span className={`pill ${s}`}>
      <CT k={STATUS_KEY[s] as "state.ok"} />
    </span>
  )
}

/* ---------------- def list ---------------- */

export function Defs({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <div className="defs">
      {rows.map((r, i) => (
        <div className="row" key={i}>
          <span className="dk">{r.k}</span>
          <span className="dv">{r.v}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- benefit row ---------------- */

export function BRow({ icon, title, sub }: { icon: ReactNode; title: ReactNode; sub: ReactNode }) {
  return (
    <div className="brow">
      <span className="bic" aria-hidden>
        {icon}
      </span>
      <div>
        <div className="bt">{title}</div>
        <div className="bs">{sub}</div>
      </div>
    </div>
  )
}

/* ==================================================================
   STRATEGIC COMPOSITIONS (ParsLinks × NovinHost deck)
   ================================================================== */

/** Big editorial statement — a section that is mostly a conclusion. */
export function Statement({
  kicker,
  lead,
  sub,
  center,
}: {
  kicker?: ReactNode
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
  left: { brand: ReactNode; items: ReactNode[]; side: "infra" | "soft" }
  right: { brand: ReactNode; items: ReactNode[]; side: "infra" | "soft" }
}) {
  const col = (c: { brand: ReactNode; items: ReactNode[]; side: "infra" | "soft" }, i: number) => (
    <div className={`split-col ${c.side}`} key={i}>
      <div className="split-head">
        <span className="split-brand">{c.brand}</span>
        <span className="split-tag">{c.side === "infra" ? "Infrastructure" : "Software"}</span>
      </div>
      <ul className="split-list">
        {c.items.map((it, j) => (
          <li key={j}>{it}</li>
        ))}
      </ul>
    </div>
  )
  return (
    <div className="split">
      {col(left, 0)}
      {col(right, 1)}
    </div>
  )
}

/** Layered architecture diagram — vertical stack of labelled layers. */
export function LayerStack({
  layers,
}: {
  layers: { label: ReactNode; tone?: "infra" | "soft" | "prod" | "cust" }[]
}) {
  return (
    <div className="layers">
      {layers.map((l, i) => (
        <div
          key={i}
          className={`layer ${l.tone ?? "cust"} ${i === layers.length - 1 ? "base" : ""}`}
        >
          <span className="layer-label">{l.label}</span>
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
  before: { title: ReactNode; items: string[] }
  after: { title: ReactNode; items: ReactNode[] }
}) {
  return (
    <div className="compare">
      <div className="compare-col before">
        <div className="compare-title">{before.title}</div>
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
        <div className="compare-title">{after.title}</div>
        <div className="compare-items">
          {after.items.map((it, i) => (
            <span className="chip on" key={i}>
              {it}
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
  families: { name: ReactNode; items: ReactNode[] }[]
}) {
  return (
    <div className="oppmap">
      {families.map((f, i) => (
        <div className="opp-fam" key={i}>
          <div className="opp-name">
            <span className="fidx">{String(i + 1).padStart(2, "0")}</span>
            {f.name}
          </div>
          <div className="opp-items">
            {f.items.map((it, j) => (
              <span className="chip" key={j}>
                {it}
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
  title: ReactNode
  steps: string[]
}) {
  return (
    <div className="scenario">
      <div className="sc-title">{title}</div>
      <div className="sc-flow">
        {steps.map((s, i) => (
          <span className="sc-step" key={i}>
            {i > 0 && (
              <span className="sc-conn" aria-hidden>
                →
              </span>
            )}
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
  models: { name: ReactNode; desc: ReactNode }[]
}) {
  return (
    <div className="matrix">
      {models.map((m, i) => (
        <div className="matrix-cell" key={i}>
          <div className="matrix-name">{m.name}</div>
          <div className="matrix-desc">{m.desc}</div>
        </div>
      ))}
    </div>
  )
}

/** Pilot timeline — staged, low-risk path. */
export function Timeline({
  steps,
}: {
  steps: { k: ReactNode; label: ReactNode; note?: ReactNode }[]
}) {
  return (
    <div className="timeline">
      {steps.map((s, i) => (
        <div className="tl-step" key={i}>
          <span className="tl-dot" aria-hidden />
          <span className="tl-k tk">{s.k}</span>
          <span className="tl-label">{s.label}</span>
          {s.note && <span className="tl-note">{s.note}</span>}
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
  n: ReactNode
  label: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="phase">
      <span className="phase-n tk">{n}</span>
      <span className="phase-label">{label}</span>
      {children}
    </div>
  )
}

/** Discussion prompt list — closing questions. */
export function Questions({ items }: { items: ReactNode[] }) {
  return (
    <ul className="questions">
      {items.map((it, i) => (
        <li key={i}>
          <span className="q-mark" aria-hidden>
            ?
          </span>
          {it}
        </li>
      ))}
    </ul>
  )
}

/** Target/current state tag used in the technical deep-dive. */
export function StateTag({ kind }: { kind: "current" | "target" }) {
  return (
    <span className={`statetag ${kind}`}>
      <CT k={kind === "current" ? "state.current" : "state.target"} />
    </span>
  )
}
