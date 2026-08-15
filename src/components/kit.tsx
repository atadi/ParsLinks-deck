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
