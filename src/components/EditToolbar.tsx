"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"

import {
  SCHEMA_VERSION,
  overrideStore,
  validateOverrides,
  type ContentId,
} from "@/content/store"
import { useEditMode } from "@/content/edit"

/* ==================================================================
   Edit Mode toolbar — rendered only while ?edit=1 is active.
   Docked top-center, collapsible, so it never covers the deck's
   bottom HUD (prev/next arrows), language toggle or slide content.

   WHY NATIVE LISTENERS: the interaction guard runs on `document` in
   the CAPTURE phase and calls stopPropagation() for any click that
   would bubble into an interactive ancestor carrying editable copy —
   including clicks on THIS toolbar's buttons when the guard's
   editor-boundary check misclassifies them (the popover sits inside
   a guarded CTA link). Capture-phase suppression happens BEFORE
   React 19's root-level delegated listeners run, so onClick props
   would never fire. Listeners attached directly to each button are
   immune: they receive the event at target even when React does not.

   Exit performs a hard navigation to the same URL minus edit=1 so
   every Edit Mode consumer resets cleanly; saved overrides persist.
   ================================================================== */

export function EditToolbar() {
  const editing = useEditMode()
  const t = useTranslations("ui")
  const count = useSyncExternalStore(
    (cb) => overrideStore.subscribe(cb),
    () => overrideStore.count(),
    () => 0,
  )
  const [expanded, setExpanded] = useState(false)
  const [flashMsg, setFlashMsg] = useState<{ text: string; kind: "ok" | "err" } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  /* All actions are wired with native listeners through event delegation
     on the toolbar root — one listener covers collapsed + expanded states,
     and fires regardless of what stopPropagation did higher up the tree. */
  useEffect(() => {
    if (!editing || !rootRef.current) return
    const root = rootRef.current

    const flash = (text: string, kind: "ok" | "err" = "ok") =>
      setFlashMsg({ text, kind })

    const actions: Record<string, () => void> = {
      toggle: () => setExpanded((v) => !v),
      export: () => {
        try {
          const doc = JSON.stringify(overrideStore.exportDoc(), null, 2)
          const blob = new Blob([doc], { type: "application/json" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "presentation-content-overrides.json"
          a.click()
          URL.revokeObjectURL(url)
          flash(t("exported"))
        } catch {
          flash(t("invalidFile"), "err")
        }
      },
      import: () => root.querySelector<HTMLInputElement>(".eb-file")?.click(),
      reset: () => {
        if (overrideStore.count() === 0) return
        if (
          window.confirm(
            `${t("resetConfirm")} (${overrideStore.count()}) — ${t("resetConfirmBody")}`,
          )
        ) {
          overrideStore.resetAll()
          flash(t("resetAll"))
        }
      },
      exit: () => {
        const url = new URL(window.location.href)
        url.searchParams.delete("edit")
        window.location.replace(url.toString())
      },
    }

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("[data-eb-action]")
      if (!el) return
      const fn = actions[el.getAttribute("data-eb-action") ?? ""]
      if (fn) fn()
    }
    const onFileChange = () => {
      const input = root.querySelector<HTMLInputElement>(".eb-file")
      const f = input?.files?.[0]
      if (!f || !input) return
      void (async () => {
        try {
          const parsed: unknown = JSON.parse(await f.text())
          const res = validateOverrides(parsed)
          if (!res.ok || Object.keys(res.overrides).length === 0) {
            flash(`${t("invalidFile")}: ${res.problems[0] ?? t("noValidOverrides")}`, "err")
            return
          }
          let applied = 0
          for (const [id, patch] of Object.entries(res.overrides)) {
            overrideStore.set(id as ContentId, patch)
            applied++
          }
          flash(`${applied} ${t("overridesCount")}`)
        } catch {
          flash(t("notJson"), "err")
        }
        input.value = ""
      })()
    }

    root.addEventListener("click", onClick)
    root.querySelector<HTMLInputElement>(".eb-file")
      ?.addEventListener("change", onFileChange)
    return () => {
      root.removeEventListener("click", onClick)
      root.querySelector<HTMLInputElement>(".eb-file")
        ?.removeEventListener("change", onFileChange)
    }
  }, [editing, t])

  // auto-dismiss status flashes
  useEffect(() => {
    if (!flashMsg) return
    const tm = window.setTimeout(() => setFlashMsg(null), 4000)
    return () => window.clearTimeout(tm)
  }, [flashMsg])

  if (!editing) return null

  return (
    <div className="editbar-wrap" dir="ltr" ref={rootRef}>
      <div className="editbar" role="toolbar" aria-label={t("editMode")}>
        <button className="eb-trigger" data-eb-action="toggle" aria-expanded={expanded}>
          ✎ {t("editMode").toUpperCase()}
          {count > 0 && <b> · {count}</b>}
        </button>
        {expanded && (
          <>
            <button className="eb-btn" data-eb-action="export">
              {t("export")}
            </button>
            <button className="eb-btn" data-eb-action="import">
              {t("import")}
            </button>
            <input type="file" accept="application/json,.json" hidden className="eb-file" />
            <button className="eb-btn" data-eb-action="reset" disabled={count === 0}>
              {t("reset")}
            </button>
            <button className="eb-btn exit" data-eb-action="exit">
              {t("exit")}
            </button>
          </>
        )}
        {flashMsg && (
          <span className={flashMsg.kind === "ok" ? "eb-msg ok" : "eb-msg err"} aria-live="polite">
            {flashMsg.text}
          </span>
        )}
        <span hidden data-schema-version={SCHEMA_VERSION} />
      </div>
    </div>
  )
}
