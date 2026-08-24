"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import {
  SCHEMA_VERSION,
  overrideStore,
  validateOverrides,
  type ContentId,
} from "@/content/store"
import { exitEditMode, useEditMode } from "@/content/edit"

/* ==================================================================
   Edit Mode toolbar — rendered only while ?edit=1 is active.
   Docked top-center, collapsible, so it never covers the deck's
   bottom HUD (prev/next arrows), language toggle or slide content.

   Exit performs a hard navigation to the same URL minus ?edit=1.
   A full reload guarantees every consumer (provider context, open
   popovers) resets to normal presentation state — no stale editing
   UI can survive. Saved localStorage overrides are untouched.
   ================================================================== */

export function EditToolbar() {
  const editing = useEditMode()
  const count = useSyncExternalStore(
    (cb) => overrideStore.subscribe(cb),
    () => overrideStore.count(),
    () => 0,
  )
  const [expanded, setExpanded] = useState(false)
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!editing) return null

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text })
    window.setTimeout(() => setMsg(null), 4000)
  }

  const onExport = () => {
    try {
      const doc = JSON.stringify(overrideStore.exportDoc(), null, 2)
      const blob = new Blob([doc], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "presentation-content-overrides.json"
      a.click()
      URL.revokeObjectURL(url)
      flash("ok", "presentation-content-overrides.json exported")
    } catch {
      flash("err", "Export failed")
    }
  }

  const onImportFile = async (file: File) => {
    try {
      const text = await file.text()
      const parsed: unknown = JSON.parse(text)
      const res = validateOverrides(parsed)
      if (!res.ok || Object.keys(res.overrides).length === 0) {
        flash("err", `Invalid file: ${res.problems[0] ?? "no valid overrides"}`)
        return
      }
      let applied = 0
      for (const [id, patch] of Object.entries(res.overrides)) {
        overrideStore.set(id as ContentId, patch)
        applied++
      }
      flash(
        "ok",
        `${applied} override(s) imported${res.problems.length ? ` · ${res.problems.length} skipped` : ""}`,
      )
    } catch {
      flash("err", "Import failed: not valid JSON")
    }
  }

  /** Hard-exit: same path + hash (slide) + other params, without edit=1. */
  const onExit = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("edit")
    window.location.replace(url.toString())
  }

  return (
    <div className="editbar-wrap" dir="ltr">
      <div className="editbar" role="toolbar" aria-label="Edit mode toolbar" data-expanded={expanded || undefined}>
        <button
          className="eb-trigger"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          title="Edit Mode"
        >
          ✎ EDIT{count > 0 && <b> · {count}</b>}
        </button>
        {(expanded || undefined) && (
          <>
            <button className="eb-btn" onClick={onExport}>
              Export
            </button>
            <button className="eb-btn" onClick={() => fileRef.current?.click()}>
              Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void onImportFile(f)
                e.target.value = ""
              }}
            />
            <button
              className="eb-btn"
              onClick={() => {
                if (count === 0) return
                if (window.confirm(`Remove all ${count} local override(s)? Repository defaults will show again.`)) {
                  overrideStore.resetAll()
                  flash("ok", "All overrides removed")
                }
              }}
              disabled={count === 0}
            >
              Reset All
            </button>
            <button className="eb-btn exit" onClick={onExit}>
              Exit
            </button>
          </>
        )}
        {msg && <span className={msg.kind === "ok" ? "eb-msg ok" : "eb-msg err"}>{msg.text}</span>}
        <span hidden data-schema-version={SCHEMA_VERSION} />
      </div>
    </div>
  )
}
