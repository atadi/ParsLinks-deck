"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

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

const EditCtx = createContext<boolean>(false)

export function EditModeProvider({ children }: { children: ReactNode }) {
  // Read once at mount; ?edit=1 is a deliberate navigation, not reactive state.
  const [active] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      return new URLSearchParams(window.location.search).get("edit") === "1"
    } catch {
      return false
    }
  })

  return <EditCtx.Provider value={active}>{children}</EditCtx.Provider>
}

export function useEditMode(): boolean {
  return useContext(EditCtx)
}

/* ---------------- resolved content hook ---------------- */

function subscribeOverrides(cb: () => void) {
  return overrideStore.subscribe(cb)
}

/** Resolved value for one content id: override wins over canonical default. */
export function useResolved(id: ContentId): LocalizedText {
  const overrides = useSyncExternalStore(subscribeOverrides, overrideStore.get, () => ({}) as Record<string, Partial<LocalizedText>>)
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

function FieldEditor({
  id,
  initial,
  lang,
  onClose,
}: {
  id: ContentId
  initial: LocalizedText
  lang: Lang
  onClose: () => void
}) {
  const [fa, setFa] = useState(initial.fa)
  const [en, setEn] = useState(initial.en)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
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
  }, [onClose])

  const dirty = fa !== initial.fa || en !== initial.en

  return (
    <div className="edit-pop" ref={ref} dir="ltr">
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
  as: Tag = "span",
  className,
}: {
  k: ContentId
  rich?: boolean
  as?: keyof HTMLElementTagNameMap
  className?: string
}) {
  const editing = useEditMode()
  const { lang } = useLang()
  const value = useResolved(k)
  const [open, setOpen] = useState(false)
  const text = lang === "fa" ? value.fa : value.en
  const overridden =
    value.fa !== DEFAULT_CONTENT[k].fa || value.en !== DEFAULT_CONTENT[k].en

  const body = rich ? renderRich(text) : text

  if (!editing) {
    return <Tag className={className}>{body}</Tag>
  }

  return (
    <Tag
      className={[className, "editable", open && "open", overridden && "overridden"].filter(Boolean).join(" ")}
      data-ck={k}
      onClick={(e) => {
        e.stopPropagation()
        setOpen(true)
      }}
      role="button"
      title={`${k} — click to edit`}
    >
      {body}
      {open && (
        <FieldEditor id={k} initial={value} lang={lang} onClose={() => setOpen(false)} />
      )}
    </Tag>
  )
}
