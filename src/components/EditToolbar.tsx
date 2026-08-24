"use client"

import { useEffect, useRef, useState } from "react"

import {
  SCHEMA_VERSION,
  overrideStore,
  validateOverrides,
  type ContentId,
} from "@/content/store"
import { CT, useEditMode } from "@/content/edit"

/* ==================================================================
   Edit Mode toolbar — rendered only when ?edit=1.
   Export / Import / Reset / Exit. Compact, bottom-right.
   ================================================================== */

export function EditToolbar() {
  const editing = useEditMode()
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // keep the override count fresh
  useEffect(() => {
    const update = () => setCount(overrideStore.count())
    update()
    const unsub = overrideStore.subscribe(update)
    return () => {
      unsub()
    }
  }, [])

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

  return (
    <div className="editbar" dir="ltr" role="toolbar" aria-label="Edit mode toolbar">
      <span className="eb-status">
        EDIT MODE{count > 0 && <b> · {count} override{count === 1 ? "" : "s"}</b>}
      </span>
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
      <button className="eb-btn exit" onClick={() => {
        const u = new URL(window.location.href)
        u.searchParams.delete("edit")
        window.location.href = u.toString()
      }}>
        Exit
      </button>
      {msg && <span className={msg.kind === "ok" ? "eb-msg ok" : "eb-msg err"}>{msg.text}</span>}
      {/* schema version surfaced for support; also forces SCHEMA_VERSION usage */}
      <span hidden data-schema-version={SCHEMA_VERSION} />
    </div>
  )
}

