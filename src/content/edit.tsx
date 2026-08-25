"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react"
import { createPortal } from "react-dom"
import {
  DEFAULT_CONTENT,
  SCHEMA_VERSION,
  overrideStore,
  validateOverrides,
  type ContentId,
  type Lang,
  type LocalizedText,
} from "@/content/store"
import { useLang } from "@/app/providers"

/* ==================================================================
   Edit Mode — enabled ONLY via ?edit=1 in the URL.
   This is an editing convenience for presenters/developers, NOT
   access control: any visitor can append the parameter on a public
   static deployment. Edits are localStorage overrides only; they
   never touch repository source. Promote via Export + content:apply.
   ================================================================== */

/* ---------------- edit-aware routing ---------------- */

/**
 * True when Edit Mode is requested. Canonical form is ?edit=1 in the
 * query string, but a misplaced parameter inside the hash fragment
 * (e.g. /main/#5/?edit=1) is also accepted so hand-typed URLs work.
 */
function readEditFromUrl(): boolean {
  if (typeof window === "undefined") return false
  try {
    if (new URLSearchParams(window.location.search).get("edit") === "1") return true
    // tolerate edit=1 inside the hash fragment
    const h = window.location.hash
    const q = h.indexOf("?")
    return q !== -1 && new URLSearchParams(h.slice(q + 1)).get("edit") === "1"
  } catch {
    return false
  }
}

/**
 * Centralized edit-aware internal routing.
 *
 * Returns `href` untouched when Edit Mode is off. When active, appends
 * (or preserves) edit=1 on INTERNAL paths only — external URLs pass
 * through unchanged so partner links never receive the parameter.
 * Existing destination query params are merged correctly:
 *   "/main/4?foo=bar"  ->  "/main/4?foo=bar&edit=1"
 *
 * Use via the useEditHref() hook inside client components.
 */
export function withEditMode(href: string, active: boolean): string {
  // External links never carry the editing parameter.
  if (/^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return href
  if (!active) return href
  try {
    const url = new URL(href, window.location.origin)
    if (!url.searchParams.has("edit")) url.searchParams.set("edit", "1")
    return url.pathname + url.search + url.hash
  } catch {
    return href
  }
}

/** Hook form: resolves current Edit Mode state automatically. */
export function useEditHref(href: string): string {
  const active = useContext(EditCtx)
  return withEditMode(href, active)
}

const EditCtx = createContext<boolean>(false)

/**
 * Single source of truth: the URL's ?edit=1 parameter.
 * Subscribed to popstate so Back/Forward keeps UI and URL in sync.
 */
export function EditModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(readEditFromUrl)

  useEffect(() => {
    const sync = () => setActive(readEditFromUrl())
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [])

  /* ----------------------------------------------------------------
     Interaction guard (capture phase).

     While Edit Mode is active, any activation (click / Enter / Space)
     targeting an interactive element that CONTAINS editable content
     ([data-ck]) is intercepted before it reaches React or the browser:
       - preventDefault() kills link navigation, anchors, target=_blank
         and implicit button activation;
       - stopPropagation() keeps React's synthetic handlers (routing,
         button onClicks) from ever firing;
       - the associated field editor opens via the module-level opener
         registry (deterministic, no event-order dependence).

     Events inside the editor popover (.edit-pop) or toolbar (.editbar)
     are left alone so editing itself works — EXCEPT when they would
     bubble up into an interactive element OUTSIDE that container
     (e.g. the CTA link wrapping an open popover): those are cut off
     at the boundary. The boundary check stops at the editor container
     itself, so the popover's own Save/Cancel/Reset buttons always run.

     Interactive elements WITHOUT editable copy (HUD prev/next arrows,
     language toggle) are left untouched, so the presenter can still
     move through the deck deliberately while editing.
     ---------------------------------------------------------------- */
  useEffect(() => {
    if (!active) return

    const guard = (e: Event) => {
      const target = e.target
      if (!(target instanceof Element)) return

      const tag = target.tagName
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT" || (target as HTMLElement).isContentEditable)
        return

      // Interactions inside the editing UI or toolbar belong to them.
      // Only suppress if they'd bubble into a guarded interactive element
      // OUTSIDE that container (the CTA link wrapping an open popover).
      const inEditor = target.closest(".edit-pop") || target.closest(".editbar")
      if (inEditor) {
        let n: Element | null = inEditor.parentElement
        while (n && !n.matches(".edit-pop, .editbar")) {
          n = n.parentElement
        }
        // n is now the outermost .edit-pop/.editbar (or null)
        let outer: Element | null = n?.parentElement ?? null
        while (outer) {
          if (outer.matches("a, button, [role='button']")) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          outer = outer.parentElement
        }
        return
      }

      // Explicit navigation controls are never suppressed, regardless of
      // whether their labels are editable: presenters must be able to move
      // through the deck while editing.
      if (target.closest('[data-edit-behavior="navigation"]')) return

      // Only guard interactive elements that carry editable copy.
      const interactive = target.closest<HTMLElement>("a, button, [role='button'], input[type='submit']")
      if (!interactive) return
      const editable = interactive.hasAttribute("data-ck")
        ? interactive
        : interactive.querySelector<HTMLElement>("[data-ck]")
      if (!editable) return

      // Suppress the underlying action entirely…
      e.preventDefault()
      e.stopPropagation()

      // …then open the associated editor (clicks only).
      if (e.type === "click") {
        openEditor(editable as HTMLElement)
      }
    }

    // Capture phase runs before React's root listeners and before default action.
    document.addEventListener("click", guard, true)
    document.addEventListener("keydown", guard, true)
    return () => {
      document.removeEventListener("click", guard, true)
      document.removeEventListener("keydown", guard, true)
    }
  }, [active])

  return <EditCtx.Provider value={active}>{children}</EditCtx.Provider>
}

export function useEditMode(): boolean {
  return useContext(EditCtx)
}

/* ---------------- module-level editor-opener registry ---------------- */

const openers = new Map<ContentId, () => void>()

function openEditor(el: HTMLElement) {
  const id = el.getAttribute("data-ck") as ContentId | null
  if (!id) return
  openers.get(id)?.()
}

/* ---------------- resolved content hook ---------------- */

function subscribeOverrides(cb: () => void) {
  return overrideStore.subscribe(cb)
}

/** Resolved value for one content id: override wins over canonical default. */
export function useResolved(id: ContentId): LocalizedText {
  const overrides = useSyncExternalStore(
    subscribeOverrides,
    overrideStore.get,
    () => ({}) as Record<string, Partial<LocalizedText>>,
  )
  const def = DEFAULT_CONTENT[id]
  const ov = overrides[id]
  return useMemo(
    () => ({
      fa: ov?.fa !== undefined && ov.fa !== "" ? ov.fa : def.fa,
      en: ov?.en !== undefined && ov.en !== "" ? ov.en : def.en,
    }),
    [def, ov],
  )
}

/* ---------------- inline rich text (**highlight**) ---------------- */

export function renderRich(text: string, hlClass = "hl"): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span className={hlClass} key={i}>
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

/* ---------------- per-field editor popover ---------------- */

/**
 * Collision-aware placement for the field editor.
 *
 * Computes a fixed position near `anchor` (the clicked editable element)
 * that keeps the popover fully inside the viewport, never covers the
 * anchor, and avoids the slide heading when another placement works.
 * Returns {left, top, width} in viewport coordinates.
 */
function placePopover(anchor: HTMLElement, pop: HTMLElement): {
  left: number
  top: number
  width: number
} {
  const MARGIN = 10 // separation from the anchor element
  const EDGE = 12 // viewport padding
  const a = anchor.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  /* Content-aware width: eyebrows/tags are compact, headlines medium,
     body copy wider. Capped so it never dominates the slide. */
  const isShort = a.height <= 34
  const width = Math.min(isShort ? 340 : a.width > 560 ? 560 : 420, vw - EDGE * 2)

  // measure actual popover height at the chosen width
  pop.style.width = `${width}px`
  const ph = pop.offsetHeight || 240

  // vertical: below if it fits (with margin), else above, else clamp
  const below = a.bottom + MARGIN
  const above = a.top - MARGIN - ph
  let top: number
  if (below + ph <= vh - EDGE) top = below
  else if (above >= EDGE) top = above
  else top = Math.max(EDGE, Math.min(vh - EDGE - ph, below))

  // horizontal: align to the anchor's inline edge, clamped to viewport
  const isRtl = document.documentElement.dir === "rtl"
  let left: number
  if (isRtl) {
    left = a.right - width // right-align to the anchor (natural RTL)
    if (left < EDGE) left = EDGE
    if (left + width > vw - EDGE) left = vw - EDGE - width
  } else {
    left = a.left
    if (left + width > vw - EDGE) left = vw - EDGE - width
    if (left < EDGE) left = EDGE
  }
  return { left, top, width }
}

function FieldEditor({
  id,
  initial,
  lang,
  getAnchor,
  onClose,
}: {
  id: ContentId
  initial: LocalizedText
  lang: Lang
  getAnchor: () => HTMLElement | null
  onClose: () => void
}) {
  const [fa, setFa] = useState(initial.fa)
  const [en, setEn] = useState(initial.en)
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null)

  /* Position on mount and re-position on resize/scroll/slide change. */
  useEffect(() => {
    const el = ref.current
    const anchor = getAnchor()
    if (!el || !anchor) return
    const place = () => setPos(placePopover(anchor, el))
    place()
    const ro = new ResizeObserver(place)
    ro.observe(anchor)
    window.addEventListener("resize", place)
    window.addEventListener("scroll", place, true)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", place, true)
    }
  }, [getAnchor])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const anchor = getAnchor()
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !(anchor && anchor.contains(e.target as Node))
      )
        onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation()
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey, true)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey, true)
    }
  }, [onClose, getAnchor])

  const dirty = fa !== initial.fa || en !== initial.en

  const markup = (
    <div
      className="edit-pop fixed"
      ref={ref}
      dir="ltr"
      style={
        pos
          ? { left: pos.left, top: pos.top, width: pos.width, visibility: "visible" }
          : { visibility: "hidden" } // hidden until first placement (no flash)
      }
    >
      <div className="edit-pop-id">{id}</div>
      <label>
        <span>فارسی</span>
        <textarea dir="rtl" value={fa} onChange={(e) => setFa(e.target.value)} rows={2} />
      </label>
      <label>
        <span>English</span>
        <textarea dir="ltr" value={en} onChange={(e) => setEn(e.target.value)} rows={2} />
      </label>
      <div className="edit-pop-actions">
        <button
          className={dirty ? "ep-btn primary" : "ep-btn"}
          disabled={!dirty}
          onClick={() => {
            overrideStore.set(id, { fa, en })
            onClose()
          }}
        >
          ذخیره / Save
        </button>
        <button className="ep-btn" onClick={onClose}>
          انصراف / Cancel
        </button>
        {(initial.fa !== DEFAULT_CONTENT[id].fa || initial.en !== DEFAULT_CONTENT[id].en) && (
          <button
            className="ep-btn"
            title="Reset to repository default"
            onClick={() => {
              overrideStore.set(id, { fa: "", en: "" })
              onClose()
            }}
          >
            ↺
          </button>
        )}
      </div>
      <p className="edit-pop-hint">**متن** برای هایلایت · saved locally only</p>
      {/* keep lang referenced so the popover re-renders per language */}
      <span hidden>{lang}</span>
    </div>
  )
  /* Portal to <body>: the popover must paint above ALL slide content.
     Inside the editable span it would be trapped by ancestor stacking
     contexts (animated blocks create transforms) and render underneath. */
  return typeof document !== "undefined" ? createPortal(markup, document.body) : markup
}

/* ---------------- editable text primitive ---------------- */

/**
 * Content-bound bilingual text.
 *  - Normal mode: renders the active language of the resolved value.
 *  - Edit Mode (?edit=1): subtle outline; click opens the field editor.
 * `rich` enables **highlight** parsing (for slide titles).
 */
export function CT({
  k,
  rich = false,
  className,
}: {
  k: ContentId
  rich?: boolean
  className?: string
}) {
  const editing = useEditMode()
  const { lang } = useLang()
  const value = useResolved(k)
  const [open, setOpen] = useState(false)
  const elRef = useRef<HTMLSpanElement>(null)
  const text = lang === "fa" ? value.fa : value.en
  const overridden =
    value.fa !== DEFAULT_CONTENT[k].fa || value.en !== DEFAULT_CONTENT[k].en

  const body = rich ? renderRich(text) : text

  /* The interaction guard intercepts clicks on interactive ancestors
     before React sees them; it calls the opener from this registry so
     the editor still opens. */
  useEffect(() => {
    if (!editing) return
    openers.set(k, () => setOpen(true))
    return () => {
      openers.delete(k)
    }
  }, [editing, k])

  if (!editing) {
    return <span className={className}>{body}</span>
  }

  return (
    <span
      className={[className, "editable", open && "open", overridden && "overridden"].filter(Boolean).join(" ")}
      data-ck={k}
      ref={elRef}
      onClick={(e) => {
        e.stopPropagation()
        setOpen(true)
      }}
      role="button"
      title={`${k} — click to edit`}
    >
      {body}
      {open && (
        <FieldEditor
          id={k}
          initial={value}
          lang={lang}
          getAnchor={() => elRef.current}
          onClose={() => setOpen(false)}
        />
      )}
    </span>
  )
}

/* ---------------- exit edit mode ---------------- */

/**
 * Exit Edit Mode cleanly:
 *  - removes edit=1 preserving path, hash (slide) and other params
 *  - hard navigation guarantees every consumer resets cleanly
 *  - saved localStorage overrides persist untouched
 */
export function exitEditMode() {
  if (typeof window === "undefined") return
  try {
    const url = new URL(window.location.href)
    if (url.searchParams.has("edit")) {
      url.searchParams.delete("edit")
      window.location.replace(url.toString())
    }
  } catch {
    /* leave URL as-is */
  }
}

/* re-export SCHEMA_VERSION so the toolbar can surface it without extra imports */
export { SCHEMA_VERSION }
