# Component Base Architecture + Centralized JSON Content — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Move every human-language string out of `.tsx` into centralized per-track JSON files, and introduce a component base layer that renders slides declaratively from that data — so a non-developer can edit copy without touching React.

**Architecture:** Three layers. (1) **Content** — `src/content/data/*.json`, pure bilingual data, no JSX. (2) **Base** — a `Slide` renderer that maps a typed block union (`head`, `flow`, `plane`, `callout`, `cards`, `chips`, `table`, `terminal`, `defs`, `brows`, `intro`) onto the existing kit primitives. (3) **Registry** — `slides.tsx` becomes a thin lookup that pairs a slide id with its JSON block list. Existing kit components (`Plane`, `Flow`, `Callout`, `Card`, `Chips`, `Pill`, `Defs`, `BRow`, `SlideHead`) are the render targets and do **not** change their public props.

**Tech Stack:** Next.js 16.2.6 (App Router, static export), React 19, TypeScript strict, Tailwind v4. No new runtime dependencies.

---

## Current context

Verified against the tree at commit `25e548f` (branch `hermes/hermes-336cc2d2`, PR #1):

| File | Lines | Role today |
|---|---|---|
| `src/content/slides/b2c.tsx` | 432 | 6 slide components, copy inline |
| `src/content/slides/b2b.tsx` | 328 | 4 slide components, copy inline |
| `src/content/slides/investment.tsx` | 249 | 4 slide components, copy inline |
| `src/content/slides/technical-a.tsx` | 466 | a1–a4 + 3 arch slides |
| `src/content/slides/technical-b.tsx` | 379 | a5–a10 |
| `src/content/slides.tsx` | 209 | registry: id → section/title/Comp |
| `src/content/categories.ts` | 92 | 4 tracks, slide id arrays |
| `src/components/kit.tsx` | 291 | 17 primitives — the render targets |

`pnpm run lint`, `pnpm run typecheck`, `pnpm run build` all pass today; the build prerenders `/`, `/b2c`, `/b2b`, `/investment`, `/technical`.

### The blocking constraint (read this before writing any JSON)

Copy is **not** flat strings. Measured counts of inline JSX inside sentences:

```
<Hl> (title highlight):   b2b 8 · b2c 12 · investment 4 · technical-a 18 · technical-b 12  = 54
<strong> (callout emphasis): b2b 3 · b2c 5 · investment 4 · technical-a 2 · technical-b 2  = 16
```

A title today looks like this — the highlight sits mid-sentence and differs per language:

```tsx
fa={<>تحول در <Hl>زیرساختِ ابری</Hl></>}
en={<>The Shift in <Hl>Cloud Infrastructure</Hl></>}
```

So JSON **must** carry an inline-markup convention, not plain text. **Decision: `*asterisk pairs*`** mark emphasis inside a bilingual string. In a `head.title` an emphasis span renders as `<Hl>` (turquoise); in `callout.text` it renders as `<strong>`. Asterisks are chosen because they never appear in the Persian or English copy (verify in Task 2). A tiny parser converts `"تحول در *زیرساختِ ابری*"` into `["تحول در ", <Hl>زیرساختِ ابری</Hl>]`.

This parser is the single riskiest piece of the change, so it is built first, under test, before any content moves.

### Assumptions

- The JSON is authored/edited by hand and bundled at build time via static `import` — no fetch, no CMS, static export stays intact.
- `.tk` monospace technical tokens (`git push`, `Control Plane`, `Node.js`) stay language-neutral: in JSON they are plain strings, exactly as `Plane.items` / `Flow.nodes[].code` already accept.
- Section labels (`Strategy`, `Product`, `Appendix · 01`) move into JSON too; the `appendix()` helper in `slides.tsx:28` is replaced by literal pairs in data.
- No visual change is intended. Any pixel difference is a bug.
- Slide **order** and track membership stay in `categories.ts` (per the original spec: moving a slide between tracks is a one-line edit).

### Non-goals (YAGNI)

- No CMS, no markdown pipeline, no i18n library, no runtime content fetching.
- No redesign of `kit.tsx` primitives' props.
- No new slides, no copy rewrites — this is a pure refactor.

---

## Proposed approach

Strangler-fig, one track at a time, with a green build after every task:

1. Build the inline-emphasis parser + block types + `Slide` renderer (Tasks 1–8).
2. Convert **one slide** (`shift`) end-to-end as the proof (Tasks 9–11).
3. Convert the remaining slides track by track, deleting each old component as its JSON lands (Tasks 12–20).
4. Delete the now-empty per-track `.tsx` files, add a content-integrity test, document the editing workflow (Tasks 21–25).

**Verification spine:** every task ends with `pnpm run typecheck` + `pnpm run lint`, and every track conversion additionally runs a DOM-snapshot diff (Task 7) proving the rendered output is byte-identical before vs after.

---

## Files likely to change

**Create:**
- `src/content/types.ts` — block union + `SlideData` types
- `src/content/inline.tsx` — emphasis parser (`renderInline`)
- `src/content/inline.test.ts` — parser tests
- `src/components/Slide.tsx` — block → kit renderer
- `src/content/data/b2c.json`, `b2b.json`, `investment.json`, `technical.json`, `common.json`
- `src/content/registry.ts` — JSON → `DeckSlide` assembly
- `tests/snapshot-slides.mjs` — pre/post DOM snapshot harness
- `tests/content-integrity.test.ts` — data invariants
- `docs/EDITING-CONTENT.md` — the non-developer workflow

**Modify:**
- `src/content/slides.tsx` — becomes a thin re-export of the registry
- `src/components/CategoryDeck.tsx:9-38` — intro slide reads `common.json`
- `src/app/page.tsx` — landing hero/footer strings from `common.json`
- `package.json` — add `test` script + `vitest`

**Delete (at the end, once empty):**
- `src/content/slides/b2c.tsx`, `b2b.tsx`, `investment.tsx`, `technical-a.tsx`, `technical-b.tsx`

---

## Phase 1 — Test harness and the parser

### Task 1: Add vitest so the parser can be tested

**Objective:** Get a test runner in place; no content changes yet.

**Files:**
- Modify: `package.json` (devDependencies + scripts)
- Create: `vitest.config.ts`

**Step 1: Install**

```bash
cd C:/codespace/ParsLinks-deck/.worktrees/hermes-336cc2d2
pnpm add -D vitest@^3 @vitejs/plugin-react@^5
```

**Step 2: Add the script**

In `package.json`, inside `"scripts"`, after the `"typecheck"` line:

```json
    "test": "vitest run"
```

**Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: { environment: "node", include: ["src/**/*.test.ts", "tests/**/*.test.ts"] },
})
```

**Step 4: Verify the runner starts**

Run: `pnpm test`
Expected: exits 0 with "No test files found" (or similar) — the runner works, there are simply no tests yet.

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "chore: add vitest for content refactor"
```

---

### Task 2: Prove the `*` delimiter is safe

**Objective:** Confirm no existing copy contains a literal `*`, so it is free to use as emphasis markup.

**Files:** none (read-only check)

**Step 1: Search the current copy**

```bash
cd C:/codespace/ParsLinks-deck/.worktrees/hermes-336cc2d2
grep -n '\*' src/content/slides/*.tsx src/content/categories.ts | grep -v '/\*' | grep -v '\*/' | grep -v '^\s*\*'
```

Expected: **no output** (the only `*` in these files are comment markers, which the greps strip).

**Step 2: If output appears — STOP**

A literal `*` exists in copy. Do not proceed with the asterisk convention; switch the delimiter to `«…»`-free `[[…]]` and update Task 3's parser and every JSON accordingly. Record the decision in the commit message.

**Step 3: No commit** (verification only).

---

### Task 3: Write the failing test for `renderInline`

**Objective:** Define parser behaviour before implementing it.

**Files:**
- Create: `src/content/inline.test.ts`

**Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest"
import { splitInline } from "./inline"

describe("splitInline", () => {
  it("returns a single plain segment when there is no emphasis", () => {
    expect(splitInline("hello world")).toEqual([{ text: "hello world", em: false }])
  })

  it("marks an emphasis span at the end", () => {
    expect(splitInline("The Shift in *Cloud Infrastructure*")).toEqual([
      { text: "The Shift in ", em: false },
      { text: "Cloud Infrastructure", em: true },
    ])
  })

  it("marks an emphasis span in the middle", () => {
    expect(splitInline("a *b* c")).toEqual([
      { text: "a ", em: false },
      { text: "b", em: true },
      { text: " c", em: false },
    ])
  })

  it("handles Persian copy with a mid-sentence highlight", () => {
    expect(splitInline("تحول در *زیرساختِ ابری*")).toEqual([
      { text: "تحول در ", em: false },
      { text: "زیرساختِ ابری", em: true },
    ])
  })

  it("supports two emphasis spans in one string", () => {
    expect(splitInline("*Control* vs *Data Plane*")).toEqual([
      { text: "Control", em: true },
      { text: " vs ", em: false },
      { text: "Data Plane", em: true },
    ])
  })

  it("drops empty segments", () => {
    expect(splitInline("*all*")).toEqual([{ text: "all", em: true }])
  })

  it("throws on an unclosed delimiter so bad copy fails loudly at build time", () => {
    expect(() => splitInline("broken *copy")).toThrow(/unbalanced/i)
  })
})
```

**Step 2: Run it to verify failure**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./inline`.

**Step 3: No commit yet** (red state).

---

### Task 4: Implement `splitInline` + `renderInline`

**Objective:** Make Task 3 green and provide the React-facing helper.

**Files:**
- Create: `src/content/inline.tsx`

**Step 1: Write the implementation**

```tsx
"use client"

import type { ReactNode } from "react"

import { Hl } from "@/components/kit"

export interface Segment {
  text: string
  em: boolean
}

/**
 * Splits a copy string on *asterisk pairs* into plain/emphasised segments.
 * Throws on an unbalanced delimiter so malformed copy fails at build time
 * rather than silently rendering a stray asterisk.
 */
export function splitInline(s: string): Segment[] {
  const parts = s.split("*")
  if (parts.length % 2 === 0) {
    throw new Error(`unbalanced emphasis delimiter in copy: ${JSON.stringify(s)}`)
  }
  return parts
    .map((text, i) => ({ text, em: i % 2 === 1 }))
    .filter((seg) => seg.text.length > 0)
}

/** Renders segments, wrapping emphasis in `Hl` (titles) or `strong` (prose). */
export function renderInline(s: string, as: "hl" | "strong" = "hl"): ReactNode {
  return splitInline(s).map((seg, i) => {
    if (!seg.em) return seg.text
    return as === "hl" ? <Hl key={i}>{seg.text}</Hl> : <strong key={i}>{seg.text}</strong>
  })
}
```

**Step 2: Rename the test file so it can import from `.tsx`**

No rename needed — `./inline` resolves to `inline.tsx`. Keep `inline.test.ts`.

**Step 3: Run the tests**

Run: `pnpm test`
Expected: PASS — 7 passed.

**Step 4: Typecheck**

Run: `pnpm run typecheck`
Expected: no output (clean).

**Step 5: Commit**

```bash
git add src/content/inline.tsx src/content/inline.test.ts
git commit -m "feat: add inline emphasis parser for JSON copy"
```

---

## Phase 2 — Block types, snapshot guard, and the Slide renderer

### Task 5: Define the block union

**Objective:** One typed vocabulary describing every layout the 27 slides use.

**Files:**
- Create: `src/content/types.ts`

**Step 1: Write the types**

```ts
import type { Bilingual } from "./categories"
import type { Status } from "@/components/kit"

/** A bilingual copy string; may contain *emphasis* markers. */
export type Copy = Bilingual

export interface HeadBlock {
  kind: "head"
  eyebrow: string
  title: Copy
  /** smaller title variant (.sm) */
  sm?: boolean
}

export interface FlowBlock {
  kind: "flow"
  vert?: boolean
  nodes: { code?: string; sub?: Copy; hero?: boolean }[]
}

export interface PlaneBlock {
  kind: "plane"
  code: string
  sub?: Copy
  accentSub?: boolean
  hero?: boolean
  infra?: boolean
  /** string = language-neutral .tk token; Copy = bilingual chip */
  items: (string | Copy)[]
  /** draw a connector after this plane */
  conn?: "down" | "up"
}

export interface CalloutBlock {
  kind: "callout"
  text: Copy
  saf?: boolean
  center?: boolean
}

export interface LedeBlock {
  kind: "lede"
  text: Copy
  muted?: boolean
}

export interface CardsBlock {
  kind: "cards"
  cards: {
    k?: string
    title: Copy
    desc?: Copy
    accent?: boolean
    chips?: (string | Copy)[]
    flow?: { code?: string; sub?: Copy; hero?: boolean }[]
  }[]
}

export interface ChipsBlock {
  kind: "chips"
  on?: boolean
  items: (string | Copy)[]
}

export interface TableBlock {
  kind: "table"
  columns: string[]
  /** row-major: rows[r][c] = [feature token, status] */
  rows: [string, Status][][]
  legend?: boolean
}

export interface TerminalBlock {
  kind: "terminal"
  repo: string
  status: string
  meta: string[]
  /** log lines stay LTR and language-neutral */
  log: string[]
}

export interface DefsBlock {
  kind: "defs"
  rows: { k: string; v: Copy }[]
}

export interface BRowsBlock {
  kind: "brows"
  rows: { icon: string; title: Copy; sub: Copy }[]
}

/** Two-column wrapper: renders children side by side, stacking on narrow screens. */
export interface ColsBlock {
  kind: "cols"
  left: Block[]
  right: Block[]
}

export interface VisionBlock {
  kind: "vision"
  word: string
  line: Copy
}

export type Block =
  | HeadBlock
  | FlowBlock
  | PlaneBlock
  | CalloutBlock
  | LedeBlock
  | CardsBlock
  | ChipsBlock
  | TableBlock
  | TerminalBlock
  | DefsBlock
  | BRowsBlock
  | ColsBlock
  | VisionBlock

export interface SlideData {
  id: string
  section: Copy
  /** overview label — plain text, no emphasis markers */
  title: Copy
  blocks: Block[]
}

export interface TrackData {
  slides: SlideData[]
}
```

**Step 2: Typecheck**

Run: `pnpm run typecheck`
Expected: clean (types are unused so far, which is fine).

**Step 3: Commit**

```bash
git add src/content/types.ts
git commit -m "feat: add slide block type vocabulary"
```

---

### Task 6: Capture the "before" DOM snapshot

**Objective:** Record today's rendered HTML for all 31 slides so the refactor can be proven visually lossless. **This must run before any slide is converted.**

**Files:**
- Create: `tests/snapshot-slides.mjs`

**Step 1: Write the harness**

It drives the built static export over CDP (the approach already proven in this repo) and writes one HTML file per slide per language.

```js
/**
 * Usage:
 *   node tests/snapshot-slides.mjs before
 *   node tests/snapshot-slides.mjs after
 *   node tests/snapshot-slides.mjs diff
 *
 * Requires: `pnpm run build`, a static server on :4321, and Chrome started with
 *   --remote-debugging-port=9222 --headless=new
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const MODE = process.argv[2]
const OUT = join("tests", "snapshots", MODE === "diff" ? "" : MODE)
const TRACKS = { b2c: 7, b2b: 5, investment: 5, technical: 14 }

async function cdp() {
  const list = await fetch("http://127.0.0.1:9222/json").then((r) => r.json())
  const page = list.find((t) => t.type === "page")
  const { default: WebSocket } = await import("ws")
  const ws = new WebSocket(page.webSocketDebuggerUrl, { maxPayload: 64 * 1024 * 1024 })
  await new Promise((res) => ws.once("open", res))
  let id = 0
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const myId = ++id
      const onMsg = (raw) => {
        const msg = JSON.parse(raw)
        if (msg.id === myId) {
          ws.off("message", onMsg)
          resolve(msg.result)
        }
      }
      ws.on("message", onMsg)
      ws.send(JSON.stringify({ id: myId, method, params }))
    })
  return { send, close: () => ws.close() }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function capture() {
  mkdirSync(OUT, { recursive: true })
  const { send, close } = await cdp()
  const js = async (expression) =>
    (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }))
      ?.result?.value

  for (const [slug, n] of Object.entries(TRACKS)) {
    for (let i = 1; i <= n; i++) {
      for (const lang of ["fa", "en"]) {
        await send("Page.navigate", { url: `http://localhost:4321/${slug}/#${i}` })
        await sleep(700)
        // force language deterministically
        await js(`window.localStorage.setItem('pl-lang','${lang}')`)
        await send("Page.reload")
        await sleep(700)
        const html = await js("document.querySelector('.slide-body').outerHTML")
        writeFileSync(join(OUT, `${slug}-${i}-${lang}.html`), html ?? "MISSING", "utf8")
      }
    }
  }
  close()
  console.log("captured", MODE)
}

function diff() {
  let bad = 0
  for (const [slug, n] of Object.entries(TRACKS)) {
    for (let i = 1; i <= n; i++) {
      for (const lang of ["fa", "en"]) {
        const f = `${slug}-${i}-${lang}.html`
        const a = join("tests", "snapshots", "before", f)
        const b = join("tests", "snapshots", "after", f)
        if (!existsSync(a) || !existsSync(b)) {
          console.log("MISSING", f)
          bad++
          continue
        }
        if (readFileSync(a, "utf8") !== readFileSync(b, "utf8")) {
          console.log("DIFF", f)
          bad++
        }
      }
    }
  }
  console.log(bad === 0 ? "IDENTICAL — refactor is lossless" : `${bad} differing slide(s)`)
  process.exit(bad === 0 ? 0 : 1)
}

if (MODE === "diff") diff()
else await capture()
```

**Step 2: Install the ws dependency**

```bash
pnpm add -D ws@^8
```

**Step 3: Build, serve, start Chrome, capture**

```bash
pnpm run build
# terminal A:
cd out && python -m http.server 4321
# terminal B (native Windows path for --user-data-dir):
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port=9222 \
  "--user-data-dir=C:\Users\alire\AppData\Local\Temp\pl-chrome-profile" \
  --no-first-run --no-default-browser-check --no-sandbox --headless=new about:blank
# terminal C:
node tests/snapshot-slides.mjs before
```

Expected: `captured before`, and `tests/snapshots/before/` contains **62** files (31 slides × 2 languages).

**Step 4: Verify the count**

```bash
ls tests/snapshots/before | wc -l
```
Expected: `62`

**Step 5: Commit**

```bash
git add tests/snapshot-slides.mjs tests/snapshots/before package.json pnpm-lock.yaml
git commit -m "test: capture pre-refactor slide DOM snapshots"
```

---

### Task 7: Build the `Slide` block renderer

**Objective:** Map every `Block` variant onto existing kit primitives.

**Files:**
- Create: `src/components/Slide.tsx`

**Step 1: Write the renderer**

```tsx
"use client"

import { Bi, useLang } from "@/app/providers"
import {
  BiN,
  BRow,
  Callout,
  Card,
  Chips,
  Defs,
  Flow,
  Lede,
  Pill,
  Plane,
  PConn,
  SlideHead,
} from "@/components/kit"
import { renderInline } from "@/content/inline"
import type { Block } from "@/content/types"

/** Bilingual copy that may carry *emphasis* markers. */
function Rich({ text, as }: { text: { fa: string; en: string }; as: "hl" | "strong" }) {
  return <BiN fa={renderInline(text.fa, as)} en={renderInline(text.en, as)} />
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <One key={i} b={b} />
      ))}
    </>
  )
}

function One({ b }: { b: Block }) {
  const { lang } = useLang()

  switch (b.kind) {
    case "head":
      return (
        <SlideHead
          eyebrow={b.eyebrow}
          sm={b.sm}
          title={<Rich text={b.title} as="hl" />}
        />
      )

    case "flow":
      return <Flow vert={b.vert} nodes={b.nodes} />

    case "plane":
      return (
        <>
          <Plane
            code={b.code}
            sub={b.sub}
            items={b.items}
            hero={b.hero}
            infra={b.infra}
            accentSub={b.accentSub}
          />
          {b.conn && <PConn up={b.conn === "up"} />}
        </>
      )

    case "callout":
      return (
        <Callout saf={b.saf} center={b.center}>
          <Rich text={b.text} as="strong" />
        </Callout>
      )

    case "lede":
      return (
        <Lede muted={b.muted}>
          <Rich text={b.text} as="strong" />
        </Lede>
      )

    case "chips":
      return <Chips items={b.items} on={b.on} />

    case "cards":
      return (
        <div className="cards-row">
          {b.cards.map((c, i) => (
            <Card key={i} k={c.k} title={c.title} accent={c.accent}>
              {c.desc && (
                <p>
                  <Bi {...c.desc} />
                </p>
              )}
              {c.chips && <Chips items={c.chips} />}
              {c.flow && <Flow nodes={c.flow} />}
            </Card>
          ))}
        </div>
      )

    case "defs":
      return <Defs rows={b.rows} />

    case "brows":
      return (
        <div className="brows">
          {b.rows.map((r, i) => (
            <BRow key={i} icon={r.icon} title={r.title} sub={r.sub} />
          ))}
        </div>
      )

    case "table":
      return (
        <>
          <div className="tblwrap">
            <table className="tbl">
              <thead>
                <tr>
                  {b.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, i) => (
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
          {b.legend && (
            <div className="flow" style={{ gap: 10 }}>
              <Pill s="ok" />
              <Pill s="dev" />
              <Pill s="plan" />
            </div>
          )}
        </>
      )

    case "terminal":
      return (
        <div className="term">
          <div className="thead">
            <span className="tdot" aria-hidden />
            <span className="tk">{b.repo}</span>
            <span className="pill ok">{b.status}</span>
          </div>
          <div className="tmeta">
            {b.meta.map((m) => (
              <span className="tk" key={m}>
                {m}
              </span>
            ))}
          </div>
          <div className="tlog">
            {b.log.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      )

    case "cols":
      return (
        <div className="two">
          <div>
            <Blocks blocks={b.left} />
          </div>
          <div>
            <Blocks blocks={b.right} />
          </div>
        </div>
      )

    case "vision":
      return (
        <div className="intro">
          <div className="vword">{b.word}</div>
          <h1 className="title sm" lang={lang}>
            <Bi {...b.line} />
          </h1>
        </div>
      )
  }
}
```

**Step 2: Reconcile class names against the real CSS**

The renderer above assumes `.cards-row`, `.brows`, `.two`, `.term`, `.thead`, `.tdot`, `.tmeta`, `.tlog`, `.vword`, `.tblwrap`. Confirm each exists:

```bash
grep -n "cards-row\|\.brows\|\.two\b\|\.term\b\|\.thead\|\.tdot\|\.tmeta\|\.tlog\|\.vword\|\.tblwrap" src/app/globals.css
```

For any that is missing, read the corresponding original slide component (e.g. `src/content/slides/b2c.tsx` for the terminal, `technical-a.tsx` for `Defs` wrappers) and copy the exact wrapper markup it used. **Do not invent class names** — the snapshot diff in Task 11 will fail if the wrapper markup differs.

**Step 3: Typecheck**

Run: `pnpm run typecheck`
Expected: clean.

**Step 4: Commit**

```bash
git add src/components/Slide.tsx
git commit -m "feat: add declarative Slide block renderer"
```

---

## Phase 3 — The pilot slide (prove the whole pipeline on one slide)

### Task 8: Create the JSON loader and registry

**Objective:** Assemble `DeckSlide` records from JSON, falling back to the legacy components for slides not yet converted.

**Files:**
- Create: `src/content/data/b2c.json` (pilot content only)
- Create: `src/content/registry.ts`
- Modify: `src/content/slides.tsx`

**Step 1: Create `src/content/data/b2c.json` with just the pilot slide**

```json
{
  "slides": [
    {
      "id": "shift",
      "section": { "fa": "استراتژی", "en": "Strategy" },
      "title": {
        "fa": "تحول در زیرساختِ ابری",
        "en": "The Shift in Cloud Infrastructure"
      },
      "blocks": [
        {
          "kind": "head",
          "eyebrow": "// context",
          "title": {
            "fa": "تحول در *زیرساختِ ابری*",
            "en": "The Shift in *Cloud Infrastructure*"
          }
        },
        {
          "kind": "flow",
          "nodes": [
            { "code": "Physical", "sub": { "fa": "زیرساخت فیزیکی", "en": "Infrastructure" } },
            { "code": "VMs", "sub": { "fa": "ماشین مجازی", "en": "Virtual machines" } },
            { "code": "Cloud", "sub": { "fa": "ابر", "en": "Cloud" } },
            { "code": "Containers", "sub": { "fa": "کانتینر", "en": "Containers" } },
            {
              "code": "Dev Platforms",
              "sub": { "fa": "پلتفرم توسعه‌دهنده", "en": "Dev platforms" },
              "hero": true
            }
          ]
        },
        {
          "kind": "callout",
          "text": {
            "fa": "زیرساخت به‌تنهایی دیگر *محصولِ نهایی* نیست. توسعه‌دهندگان انتظار پلتفرم‌هایی را دارند که پیچیدگیِ زیرساخت را انتزاع کنند و اجازه دهند اپلیکیشن مستقیماً از روی کد مستقر شود.",
            "en": "Infrastructure alone is no longer the *final product*. Developers expect platforms that abstract infrastructure complexity and let applications deploy directly from code."
          }
        },
        {
          "kind": "lede",
          "muted": true,
          "text": {
            "fa": "هر نسل، لایه‌ی زیرین را به «جزئیاتِ پنهان» تبدیل کرده است. لایه‌ی بعدی، پلتفرمی است که تیم‌ها روی آن می‌سازند — نه سروری که باید مدیریت کنند.",
            "en": "Each generation turned the layer beneath it into hidden detail. The next layer is a platform teams build on — not a server they manage."
          }
        }
      ]
    }
  ]
}
```

> Copy each string **verbatim** from `src/content/slides/b2c.tsx:21-75`, adding only the `*` markers where `<Hl>` / `<strong>` wrapped text. Do not re-translate or re-punctuate — the snapshot diff is byte-exact.

**Step 2: Enable JSON imports**

Check `tsconfig.json` for `resolveJsonModule`:

```bash
grep -n resolveJsonModule tsconfig.json
```

If absent, add `"resolveJsonModule": true` inside `compilerOptions`.

**Step 3: Create `src/content/registry.ts`**

```ts
import type { SlideData, TrackData } from "./types"

import b2c from "./data/b2c.json"
import b2b from "./data/b2b.json"
import investment from "./data/investment.json"
import technical from "./data/technical.json"

const TRACKS = [b2c, b2b, investment, technical] as unknown as TrackData[]

/** id → slide data, assembled from every track JSON. */
export const SLIDE_DATA: Record<string, SlideData> = Object.fromEntries(
  TRACKS.flatMap((t) => t.slides).map((s) => [s.id, s]),
)
```

**Step 4: Create the three remaining JSON files as empty shells**

`src/content/data/b2b.json`, `investment.json`, `technical.json` each:

```json
{ "slides": [] }
```

**Step 5: Wire the registry into `slides.tsx`**

In `src/content/slides.tsx`, add near the top:

```ts
import { Blocks } from "@/components/Slide"
import { SLIDE_DATA } from "./registry"
```

Then, at the end of the file, replace the bare `export const SLIDES = { ... }` object with a merge that prefers JSON:

```ts
/** JSON-backed slides override the legacy component entries as they are converted. */
const JSON_SLIDES: Record<string, DeckSlide> = Object.fromEntries(
  Object.values(SLIDE_DATA).map((s) => [
    s.id,
    {
      id: s.id,
      section: s.section,
      title: s.title,
      Comp: () => <Blocks blocks={s.blocks} />,
    },
  ]),
)

export const SLIDES: Record<string, DeckSlide> = { ...LEGACY_SLIDES, ...JSON_SLIDES }
```

Rename the existing literal from `export const SLIDES` to `const LEGACY_SLIDES` (drop the `export`).

**Step 6: Typecheck + build**

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```
Expected: all clean; build prerenders 5 routes.

**Step 7: Commit**

```bash
git add src/content/data src/content/registry.ts src/content/slides.tsx tsconfig.json
git commit -m "feat: JSON-backed slide registry with legacy fallback"
```

---

### Task 9: Prove the pilot slide is byte-identical

**Objective:** Confirm `shift` renders exactly as before, now from JSON.

**Files:** none (verification)

**Step 1: Rebuild and re-capture**

```bash
pnpm run build
# with server on :4321 and Chrome on :9222 as in Task 6
node tests/snapshot-slides.mjs after
```

**Step 2: Diff only the pilot slide**

`shift` is b2c slide **2** (slide 1 is the generated intro):

```bash
diff tests/snapshots/before/b2c-2-fa.html tests/snapshots/after/b2c-2-fa.html && echo "FA IDENTICAL"
diff tests/snapshots/before/b2c-2-en.html tests/snapshots/after/b2c-2-en.html && echo "EN IDENTICAL"
```

Expected: both print `IDENTICAL`.

**Step 3: If they differ**

Read the diff. Typical causes, in likelihood order:
- whitespace lost around an emphasis span (`"in *X*"` vs `"in*X*"`) — fix the JSON string, not the parser
- a wrapper `<div>`/class in `Slide.tsx` that the original component didn't emit
- `Lede`/`Callout` nesting differences (`<p>` inside `<p>`)

Fix and re-run Step 1. **Do not proceed to Task 10 until identical.**

**Step 4: Delete the legacy pilot component**

Remove the `Shift` function from `src/content/slides/b2c.tsx` and its entry from `LEGACY_SLIDES` in `slides.tsx`, plus the now-unused `B2C.Shift` reference.

**Step 5: Re-verify and commit**

```bash
pnpm run typecheck && pnpm run lint && pnpm run build
node tests/snapshot-slides.mjs after
diff tests/snapshots/before/b2c-2-fa.html tests/snapshots/after/b2c-2-fa.html && echo OK
git add -A
git commit -m "refactor: migrate shift slide to JSON content"
```

---

## Phase 4 — Convert the remaining slides, track by track

Each of Tasks 10–13 follows the **identical recipe**. Do one track per task, and inside a track do **one slide at a time** (convert → diff → delete legacy → commit). Never convert two slides before diffing.

### The per-slide recipe (apply for every slide below)

1. Open the legacy component (e.g. `src/content/slides/b2b.tsx`) and read the target slide top to bottom.
2. Append a `SlideData` entry to the track's JSON, translating JSX → blocks:
   - `SlideHead` → `head` (`<Hl>` → `*…*`)
   - `Flow` / vertical flow → `flow` (`vert: true`)
   - `Plane` + `PConn` → `plane` with `conn: "down" | "up"`
   - `Callout` → `callout` (`<strong>` → `*…*`, `saf`, `center`)
   - `Lede` → `lede` (`muted`)
   - `Card` groups → `cards`
   - `Chips` → `chips` (`on`)
   - `Defs` → `defs`; `BRow` groups → `brows`
   - two-column layouts → `cols` with `left` / `right`
3. Copy every string **verbatim**; only add `*` markers.
4. Delete the legacy component function and its `LEGACY_SLIDES` entry.
5. Run: `pnpm run typecheck && pnpm run lint && pnpm run build`
6. Run: `node tests/snapshot-slides.mjs after` then diff that slide's two files.
7. Commit: `git commit -m "refactor: migrate <id> slide to JSON content"`

**Slide → deck index map** (for locating snapshot files; index 1 is always the generated intro):

| Track | Deck index → slide id |
|---|---|
| `b2c` | 2 shift · 3 missing · 4 whatis · 5 devexp · 6 fordev · 7 capabilities |
| `b2b` | 2 partner · 3 strategic · 4 partnership · 5 moat |
| `investment` | 2 opportunity · 3 needs · 4 roadmap · 5 vision |
| `technical` | 2 wheresits · 3 platformarch · 4 lifecycle · 5–14 a1…a10 |

---

### Task 10: Convert the rest of the B2C track

**Objective:** Move `missing`, `whatis`, `devexp`, `fordev`, `capabilities` into `src/content/data/b2c.json`.

**Files:**
- Modify: `src/content/data/b2c.json`
- Modify/Delete: `src/content/slides/b2c.tsx` (delete the file once empty)
- Modify: `src/content/slides.tsx`

**Notes specific to this track:**
- `devexp` is the two-column slide: `cols` with a vertical `flow` on the left and the `terminal` block on the right. The log lines (`▸ Cloning repository… done` etc.) are **language-neutral** — put them in `terminal.log` unchanged, and keep the `direction: ltr` behaviour that lives in CSS.
- `fordev` uses two `Card`s each wrapping a `Flow` — use `cards[].flow`.
- `capabilities` is the `table` block. Copy `CAP_COLUMNS` (`src/content/slides/b2c.tsx:338`) and `CAP_ROWS` (`:340`) verbatim into `columns` / `rows`, and set `legend: true`.
- The capabilities statuses are **contractual** — they must keep matching the roadmap slide (Task 12). Task 14 adds a test enforcing this.

**Verification for each of the 5 slides:**

```bash
node tests/snapshot-slides.mjs after
for i in 3 4 5 6 7; do
  diff -q tests/snapshots/before/b2c-$i-fa.html tests/snapshots/after/b2c-$i-fa.html || echo "DIFF b2c-$i-fa"
  diff -q tests/snapshots/before/b2c-$i-en.html tests/snapshots/after/b2c-$i-en.html || echo "DIFF b2c-$i-en"
done
echo "sweep done"
```
Expected: `sweep done` with no `DIFF` lines.

**Final step:** once `src/content/slides/b2c.tsx` has no remaining exports, delete it and remove `import * as B2C` from `slides.tsx`.

```bash
git add -A && git commit -m "refactor: migrate b2c track to JSON content"
```

---

### Task 11: Convert the B2B track

**Objective:** `partner`, `strategic`, `partnership`, `moat` → `src/content/data/b2b.json`.

**Notes:**
- `partner` is `cols`: left is a `plane` stack (hero → `conn: "up"` → infra), right is `brows` with the 6 benefit rows (icons `↑ + ★ ∞ ⇄ ◆` are language-neutral strings).
- `strategic` is a 6-card grid (`cards`, kickers `01`–`06`, card 06 `accent: true`).
- `partnership` is 2 cards with `chips`; its callout is `center: true`.
- `moat` uses `chips` with `on: true`.
- The `partner` callout is `saf: true`.

**Verification:** same sweep with `b2b` and indices `2 3 4 5`.

```bash
git add -A && git commit -m "refactor: migrate b2b track to JSON content"
```

---

### Task 12: Convert the Investment track

**Objective:** `opportunity`, `needs`, `roadmap`, `vision` → `src/content/data/investment.json`.

**Notes:**
- `opportunity`'s flow nodes have **`sub` only, no `code`** (segment names are bilingual) — `flow.nodes[].code` is optional in the type for exactly this reason.
- `needs` is 4 cards with mono kickers (`Infrastructure`, `Operational`, `Commercial`, `Strategic`), the last `accent: true`; its callout is `saf: true`.
- `roadmap` is 3 cards (`Now` accent / `Next` / `Later`) with `chips`. Chip values must stay consistent with the capabilities table — see Task 14.
- `vision` uses the `vision` block plus a centered `callout` and a `flow`; its eyebrow is centered (`// vision`). Check how `investment.tsx:214-217` renders the eyebrow — it is a bare `<span className="eyebrow">`, not `SlideHead`, so `vision` may need the eyebrow inlined in the block or a `head` with no title. Match the original markup exactly.

**Verification:** sweep `investment` indices `2 3 4 5`.

```bash
git add -A && git commit -m "refactor: migrate investment track to JSON content"
```

---

### Task 13: Convert the Technical Appendix track

**Objective:** all 13 slides → `src/content/data/technical.json`. This is the largest task — **do it as 13 separate commits**, one slide each.

**Files:**
- Modify: `src/content/data/technical.json`
- Delete (when empty): `src/content/slides/technical-a.tsx`, `src/content/slides/technical-b.tsx`

**Notes:**
- Section labels use the `appendix()` helper (`slides.tsx:28-31`). In JSON write them literally, e.g. `{ "fa": "پیوست · ۰۱", "en": "Appendix · 01" }` — note the Persian digits `۰۱` in the FA side.
- `platformarch` has Persian-only `sub` values (EN relies on the mono label). Keep `sub.en` as the empty string only if the original rendered nothing; otherwise copy what it rendered. Verify against `technical-a.tsx`.
- `a2`, `a6` use `defs`; `a3`, `a4`, `a5`, `a7`–`a10` are flow + cards combinations.
- `a3`'s vertical flow has Persian subs on the first three nodes only.

**Verification:** sweep `technical` indices `2` through `14` (both languages = 26 files).

```bash
git add -A && git commit -m "refactor: migrate technical appendix to JSON content"
```

---

## Phase 5 — Remaining strings, invariants, docs

### Task 14: Extract landing + intro + category strings

**Objective:** No human-language string left in any `.tsx`.

**Files:**
- Create: `src/content/data/common.json`
- Modify: `src/app/page.tsx`, `src/components/CategoryDeck.tsx`, `src/content/categories.ts`

**Step 1: Create `src/content/data/common.json`**

```json
{
  "landing": {
    "eyebrow": "// confidential deck",
    "title": {
      "fa": "پلتفرمِ توسعه‌دهندگان برای ابرِ ایران",
      "en": "The developer platform for Iran's cloud"
    },
    "sub": {
      "fa": "یک ارائه در چهار مسیر — بسته به مخاطب، مسیرِ خود را انتخاب کنید.",
      "en": "One deck, four tracks — choose the path for your audience."
    },
    "pipeline": ["git push", "build", "deploy", "production"],
    "tags": {
      "fa": "PaaS بومی • تحویل اپلیکیشن • Edge • تجربه‌ی توسعه‌دهنده",
      "en": "Native PaaS • Application Delivery • Edge • Developer Experience"
    },
    "slidesWord": { "fa": "اسلاید", "en": "slides" },
    "footer": {
      "fa": "ParsLinks · ارائه‌ی محرمانه",
      "en": "ParsLinks · Confidential deck"
    }
  },
  "deck": {
    "introHint": { "fa": "برای شروع: ← یا Space", "en": "Press → or Space to begin" },
    "slideWord": { "fa": "اسلاید", "en": "Slide" },
    "overview": { "fa": "نمای کلی", "en": "Overview" },
    "help": { "fa": "کلیدهای میان‌بر", "en": "Keyboard shortcuts" },
    "home": { "fa": "خانه", "en": "Home" },
    "prev": { "fa": "قبلی", "en": "Previous" },
    "next": { "fa": "بعدی", "en": "Next" }
  }
}
```

> Copy the `deck` values from the existing `Deck.tsx` aria-labels and modal headings so nothing changes.

**Step 2: Replace the literals in `src/app/page.tsx`**

Import and use:

```tsx
import common from "@/content/data/common.json"

const L = common.landing
```

Then `<Bi {...L.title} />`, `<Bi {...L.sub} />`, `{L.eyebrow}`, `{L.pipeline.map(...)}`, `<Bi {...L.tags} />`, `<Bi {...L.footer} />`, and `<Bi {...L.landing.slidesWord} />` for the card counts.

**Step 3: Replace the intro hint in `src/components/CategoryDeck.tsx:29-31`**

```tsx
import common from "@/content/data/common.json"
// ...
<Bi {...common.deck.introHint} />
```

**Step 4: Verify no bare copy remains**

```bash
grep -rn 'fa="' src/app src/components | grep -v providers.tsx
```
Expected: **no output** (all `fa=`/`en=` pairs now come from JSON spreads). `providers.tsx` is excluded because `Bi` itself declares those prop names.

**Step 5: Verify + commit**

```bash
pnpm run typecheck && pnpm run lint && pnpm run build
node tests/snapshot-slides.mjs after && node tests/snapshot-slides.mjs diff
git add -A && git commit -m "refactor: extract landing and deck chrome strings to JSON"
```

---

### Task 15: Lock the content invariants with tests

**Objective:** Make the two rules that matter enforceable: **capability statuses agree between the table and the roadmap**, and **every slide id referenced by a track exists**.

**Files:**
- Create: `tests/content-integrity.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest"

import { CATEGORIES } from "@/content/categories"
import { SLIDE_DATA } from "@/content/registry"
import { splitInline } from "@/content/inline"
import type { Block, CardsBlock, TableBlock } from "@/content/types"

const all = Object.values(SLIDE_DATA)

function walk(blocks: Block[]): Block[] {
  return blocks.flatMap((b) => (b.kind === "cols" ? [b, ...walk(b.left), ...walk(b.right)] : [b]))
}
const blocks = all.flatMap((s) => walk(s.blocks))

describe("track wiring", () => {
  it("every slide id referenced by a track exists in the data", () => {
    const missing = CATEGORIES.flatMap((c) => c.slides).filter((id) => !SLIDE_DATA[id])
    expect(missing).toEqual([])
  })

  it("every slide in the data is referenced by exactly one track", () => {
    const referenced = CATEGORIES.flatMap((c) => c.slides)
    const orphans = Object.keys(SLIDE_DATA).filter((id) => !referenced.includes(id))
    expect(orphans).toEqual([])
    expect(new Set(referenced).size).toBe(referenced.length)
  })
})

describe("copy hygiene", () => {
  it("every bilingual string has both languages non-empty", () => {
    const bad: string[] = []
    for (const s of all) {
      for (const [k, v] of Object.entries({ section: s.section, title: s.title })) {
        if (!v.fa.trim() || !v.en.trim()) bad.push(`${s.id}.${k}`)
      }
    }
    expect(bad).toEqual([])
  })

  it("every emphasis marker is balanced", () => {
    const bad: string[] = []
    for (const b of blocks) {
      const strings: string[] = []
      if (b.kind === "head") strings.push(b.title.fa, b.title.en)
      if (b.kind === "callout" || b.kind === "lede") strings.push(b.text.fa, b.text.en)
      for (const s of strings) {
        try {
          splitInline(s)
        } catch {
          bad.push(s.slice(0, 40))
        }
      }
    }
    expect(bad).toEqual([])
  })

  it("overview titles contain no emphasis markers", () => {
    const bad = all.filter((s) => s.title.fa.includes("*") || s.title.en.includes("*"))
    expect(bad.map((s) => s.id)).toEqual([])
  })
})

describe("capability status consistency (spec §14.10)", () => {
  const table = blocks.find((b): b is TableBlock => b.kind === "table")
  const roadmap = SLIDE_DATA.roadmap
    ? walk(SLIDE_DATA.roadmap.blocks).find((b): b is CardsBlock => b.kind === "cards")
    : undefined

  const BUCKET: Record<string, string> = { Now: "ok", Next: "dev", Later: "plan" }

  it("has both the capabilities table and the roadmap cards", () => {
    expect(table).toBeDefined()
    expect(roadmap).toBeDefined()
  })

  it("no capability is promised earlier than its table status", () => {
    const status = new Map(table!.rows.flat())
    const conflicts: string[] = []
    for (const card of roadmap!.cards) {
      const want = BUCKET[card.k ?? ""]
      if (!want) continue
      for (const chip of card.chips ?? []) {
        if (typeof chip !== "string") continue
        const actual = status.get(chip)
        if (actual && actual !== want) {
          conflicts.push(`${chip}: table=${actual} roadmap=${card.k}(${want})`)
        }
      }
    }
    expect(conflicts).toEqual([])
  })
})
```

**Step 2: Run**

Run: `pnpm test`
Expected: PASS — all green. A failure here means a real inconsistency; fix the JSON, not the test.

**Step 3: Commit**

```bash
git add tests/content-integrity.test.ts
git commit -m "test: enforce track wiring and capability status invariants"
```

---

### Task 16: Full-deck lossless proof

**Objective:** Prove all 62 snapshots are identical after the entire refactor.

**Step 1: Clean rebuild and capture**

```bash
rm -rf out .next
pnpm run build
# server on :4321, Chrome on :9222
node tests/snapshot-slides.mjs after
node tests/snapshot-slides.mjs diff
```

Expected: `IDENTICAL — refactor is lossless`, exit 0.

**Step 2: Re-run the original acceptance sweep**

Re-verify the §14 items that the block renderer could plausibly break:

```bash
# zero horizontal overflow at three widths, all 31 slides
# (reuse the CDP overflow sweep: 1440 / 768 / 390px)
```
Expected: `overflow: none` at every width.

**Step 3: Full gate**

```bash
pnpm test && pnpm run lint && pnpm run typecheck && pnpm run build
```
Expected: all pass.

**Step 4: Commit**

```bash
git add tests/snapshots/after
git commit -m "test: confirm JSON refactor renders identically across all slides"
```

---

### Task 17: Document the editing workflow

**Objective:** Make the non-developer path explicit — this is the point of the whole refactor.

**Files:**
- Create: `docs/EDITING-CONTENT.md`
- Modify: `README.md` (link to it)

**Step 1: Write `docs/EDITING-CONTENT.md`**

Cover, with copy-pasteable examples:
- Where copy lives: `src/content/data/{b2c,b2b,investment,technical,common}.json`
- Every string is a `{ "fa": "…", "en": "…" }` pair; **both are required**
- `*asterisks*` mark the highlight in a title and the bold span in a callout
- Plain strings inside `plane.items` / `flow.nodes[].code` / `table.columns` are language-neutral technical tokens and stay identical in both languages
- Re-ordering slides or moving one between tracks = edit the `slides` array in `src/content/categories.ts`
- Status pills: `ok` = Available, `dev` = In development, `plan` = Planned — and the table must agree with the roadmap slide
- After editing run `pnpm test` (catches unbalanced `*`, missing language, status conflicts) then `pnpm run build`
- Never edit anything under `out/`

**Step 2: Link it from `README.md`**

Add a `## Editing the deck copy` section pointing to `docs/EDITING-CONTENT.md`.

**Step 3: Commit**

```bash
git add docs/EDITING-CONTENT.md README.md
git commit -m "docs: describe the JSON content editing workflow"
```

---

### Task 18: Add CI so the invariants actually hold

**Objective:** Run the gate on every push; the snapshot harness needs a browser so keep it local-only.

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Write the workflow**

```yaml
name: ci
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm run lint
      - run: pnpm run typecheck
      - run: pnpm run build
```

**Step 2: Verify locally first**

```bash
pnpm install --frozen-lockfile && pnpm test && pnpm run lint && pnpm run typecheck && pnpm run build
```
Expected: all pass.

**Step 3: Commit and push**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run tests, lint, typecheck and build on push"
git push
```

**Step 4: Confirm the run is green**

```bash
gh run list --limit 1
gh run watch
```
Expected: `success`. Report the real conclusion — do not assume.

---

## Tests / validation summary

| Gate | Command | Proves |
|---|---|---|
| Parser | `pnpm test` | emphasis markup parses; unbalanced `*` throws |
| Invariants | `pnpm test` | track wiring, both languages present, table ↔ roadmap agree |
| Types | `pnpm run typecheck` | every JSON block matches the union |
| Lint | `pnpm run lint` | no React/Next violations |
| Build | `pnpm run build` | static export still prerenders 5 routes |
| **Lossless** | `node tests/snapshot-slides.mjs diff` | all 62 slide renders byte-identical |
| Responsive | CDP overflow sweep | no overflow at 1440 / 768 / 390px |

---

## Risks, tradeoffs, open questions

**Risks**

1. **Inline markup is the main hazard.** 54 `<Hl>` + 16 `<strong>` spans must survive the move. Mitigation: parser under test first (Tasks 3–4), byte-exact snapshot diff per slide, and an invariant test for unbalanced markers. A stray `*` in copy would render literally — the parser throws instead.
2. **Silent copy drift while transcribing.** 27 slides × 2 languages hand-copied invites typos. Mitigation: the snapshot diff catches *any* character change; convert one slide at a time and never batch.
3. **Wrapper markup mismatch.** `Slide.tsx` must emit the same `<div>`/class nesting as the original components (Task 7 Step 2). The diff catches it; expect one or two iterations here.
4. **`cols` two-column semantics.** Several slides put a plane stack beside benefit rows; if the original used a bespoke wrapper class rather than `.two`, the generic `cols` block will differ. Read each original before assuming.
5. **Deleting components before diffing** would lose the reference. Order matters: convert → diff → then delete.

**Tradeoffs**

- **JSON over TS data modules:** JSON is unambiguously editable by a non-developer and cannot contain logic, which is the stated goal. Cost: no comments, and type safety only at the `as unknown as TrackData` boundary — mitigated by the integrity tests.
- **`*` over structured segment arrays:** an array of `{text, em}` per string would be type-safe but hostile to hand-editing. Readability for the editor wins.
- **Snapshot harness needs a browser:** kept out of CI deliberately; it is a local pre-merge gate.
- **Block union grows with layout needs:** adding a genuinely new layout still needs a code change in `Slide.tsx`. That is correct — YAGNI over a generic layout engine.

**Open questions**

1. **Should `categories.ts` become JSON too?** It holds track metadata plus `accent` CSS var names (code-ish). Recommendation: leave as TS — it is structure, not copy — but revisit if the user wants track titles editable alongside slide copy.
2. **Where does `vision`'s eyebrow belong?** It renders a bare `.eyebrow` span rather than `SlideHead`. Either extend `head` to allow a title-less eyebrow or give `vision` its own `eyebrow` field. Decide during Task 12 by matching the original DOM.
3. **Keep the legacy `.tsx` files as reference after conversion?** Plan says delete (dead code). If the user wants a rollback path, the git history already provides it.
4. **Is a `pnpm run verify` alias wanted** to chain test+lint+typecheck+build? Small quality-of-life addition; not included to avoid scope creep.

---

## Execution note

Task order is load-bearing: **Task 6 (before-snapshot) must run on unmodified code.** If the tree has already changed, `git stash` or check out `25e548f` to capture the baseline first, otherwise the lossless proof is worthless.

