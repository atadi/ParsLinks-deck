import raw from "./presentation.json"
import { locales, type Locale } from "@/i18n/config"

/* ==================================================================
   Content layer — canonical defaults + local override resolution.
   Canonical source: src/content/presentation.json (schemaVersion 2).
   Overrides: localStorage, written only by Edit Mode (?edit=1). No backend.

   Locale-generic: every string is keyed by Locale (fa/en/…), not by a
   hardcoded .fa/.en pair. Adding a locale means extending the Locale
   union + populating every ID — the type system enforces completeness.
   ================================================================== */

export type Lang = "fa" | "en"

/** Locale-keyed string. Partial<Locale> allows optional content with an
 *  explicit fallback policy (see validateContent / resolve). */
export type LocalizedText = Partial<Record<Locale, string>>

/** Every stable semantic content id in the deck. */
export type ContentId = keyof typeof raw

export const SCHEMA_VERSION: number = raw.schemaVersion

/** The immutable repository defaults. */
export const DEFAULT_CONTENT = raw as unknown as Record<ContentId, LocalizedText>

export const CONTENT_IDS = Object.keys(DEFAULT_CONTENT).filter(
  (k) => !k.startsWith("$") && k !== "schemaVersion",
) as ContentId[]

export const OVERRIDE_STORAGE_KEY = "parslinks-deck-content-overrides-v2"

export interface OverridesFile {
  schemaVersion: number
  /** locale list the export was produced against (generic, not hardcoded) */
  locales: Locale[]
  overrides: Partial<Record<string, Partial<LocalizedText>>>
}

/* ---------------- runtime-validated import/export ---------------- */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

const isLocaleKey = (k: string): k is Locale => (locales as readonly string[]).includes(k)

/**
 * Validate an untrusted parsed JSON document against the content schema.
 * Locale-generic: accepts any key from the central Locale registry, rejects
 * unknown locales explicitly. Unknown content ids are reported and skipped;
 * never merged blindly. Returns the safe subset plus a list of problems.
 */
export function validateOverrides(input: unknown): {
  ok: boolean
  overrides: Partial<Record<ContentId, Partial<LocalizedText>>>
  problems: string[]
} {
  const problems: string[] = []
  if (!isRecord(input)) return { ok: false, overrides: {}, problems: ["Root must be a JSON object."] }

  const version = input.schemaVersion
  // Accept the current schema version; v1 lacks the `locales` array.
  const isV1 = version === 1
  if (version !== SCHEMA_VERSION && !isV1) {
    problems.push(`schemaVersion mismatch (file: ${String(version)}, app: ${SCHEMA_VERSION}).`)
    return { ok: false, overrides: {}, problems }
  }
  if (!isRecord(input.overrides)) return { ok: false, overrides: {}, problems: ['Missing "overrides" object.'] }

  const out: Partial<Record<ContentId, Partial<LocalizedText>>> = {}
  for (const [key, val] of Object.entries(input.overrides)) {
    if (!(key in DEFAULT_CONTENT)) {
      problems.push(`Unknown content id "${key}" — skipped.`)
      continue
    }
    if (!isRecord(val)) {
      problems.push(`"${key}" is not an object — skipped.`)
      continue
    }
    const patch: Partial<LocalizedText> = {}
    for (const [lk, lv] of Object.entries(val)) {
      if (!isLocaleKey(lk)) {
        problems.push(`Unknown locale "${lk}" in "${key}" — skipped.`)
        continue
      }
      if (typeof lv !== "string") {
        problems.push(`"${key}.${lk}" is not a string — skipped.`)
        continue
      }
      patch[lk] = lv
    }
    if (Object.keys(patch).length === 0) continue
    out[key as ContentId] = patch
  }
  return { ok: true, overrides: out, problems }
}

/**
 * Build-time/check-time validation that every supported locale has an
 * explicit value for every production content id. Reports missing
 * translations by semantic id + locale so they are caught before a
 * presentation — not discovered live. Optional content (IDs listed in
 * OPTIONAL_IDS) may be empty in some locales without failing.
 */
export const OPTIONAL_IDS = new Set<ContentId>([])

export interface MissingReport {
  missing: { id: ContentId; locale: Locale }[]
}

export function validateContent(
  content: Record<ContentId, LocalizedText> = DEFAULT_CONTENT,
): MissingReport {
  const missing: { id: ContentId; locale: Locale }[] = []
  for (const id of CONTENT_IDS) {
    if (OPTIONAL_IDS.has(id)) continue
    const entry = content[id] ?? {}
    for (const loc of locales) {
      const v = entry[loc]
      if (v === undefined || v === "") missing.push({ id, locale: loc })
    }
  }
  return { missing }
}

/* ---------------- localStorage override store ---------------- */
type Listener = () => void

/**
 * Safe migration from the legacy v1 override shape (schemaVersion 1,
 * hardcoded .fa/.en) to the current locale-generic v2 store. Never
 * discards user edits: a v1 key `fa`/`en` maps to the same locale key.
 */
function migrateV1(parsed: Record<string, unknown>): Record<string, Partial<LocalizedText>> {
  const out: Record<string, Partial<LocalizedText>> = {}
  const ov = (parsed.overrides ?? {}) as Record<string, { fa?: string; en?: string }>
  for (const [key, val] of Object.entries(ov)) {
    if (!isRecord(val)) continue
    const patch: Partial<LocalizedText> = {}
    if (typeof val.fa === "string") patch.fa = val.fa
    if (typeof val.en === "string") patch.en = val.en
    if (Object.keys(patch).length) out[key] = patch
  }
  return out
}

function readStore(): Record<string, Partial<LocalizedText>> {
  if (typeof window === "undefined") return {}
  try {
    const s = window.localStorage.getItem(OVERRIDE_STORAGE_KEY)
    if (!s) return {}
    const parsed: unknown = JSON.parse(s)
    // Already v2 shape?
    if (isRecord(parsed) && parsed.schemaVersion === SCHEMA_VERSION) {
      const res = validateOverrides(parsed)
      return res.ok ? (res.overrides as Record<string, Partial<LocalizedText>>) : {}
    }
    // Legacy v1 store: migrate, then persist as v2 so reloads are clean.
    if (isRecord(parsed) && parsed.schemaVersion === 1) {
      const migrated = migrateV1(parsed)
      writeStore(migrated)
      return migrated
    }
    return {}
  } catch {
    return {}
  }
}

function writeStore(v: Record<string, Partial<LocalizedText>>) {
  try {
    window.localStorage.setItem(
      OVERRIDE_STORAGE_KEY,
      JSON.stringify({ schemaVersion: SCHEMA_VERSION, locales: [...locales], overrides: v }),
    )
  } catch {
    /* storage unavailable — keep memory only */
  }
  listeners.forEach((l) => l())
}

let cache: Record<string, Partial<LocalizedText>> | null = null
const listeners = new Set<Listener>()

export const overrideStore = {
  subscribe(cb: Listener) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },
  get(): Record<string, Partial<LocalizedText>> {
    if (cache === null) cache = readStore()
    return cache
  },
  /** Merge a per-locale patch for one id. Unset locales keep their
   *  current value; empty string clears that locale. Deleting all locales
   *  removes the id entirely. Locale-generic (no fa/en hardcoding). */
  set(id: ContentId, patch: Partial<LocalizedText>) {
    const cur = { ...overrideStore.get() }
    const merged: LocalizedText = { ...(cur[id] ?? {}) }
    let hasAny = false
    for (const loc of locales) {
      const v = patch[loc]
      if (v === undefined) {
        if (merged[loc]) hasAny = true
        continue
      }
      if (v === "") delete merged[loc]
      else {
        merged[loc] = v
        hasAny = true
      }
    }
    if (hasAny) cur[id] = merged
    else delete cur[id]
    cache = cur
    writeStore(cur)
  },
  resetAll() {
    cache = {}
    writeStore({})
  },
  count(): number {
    return Object.keys(overrideStore.get()).length
  },
  /** Export document: schemaVersion + locale list + only changed values. */
  exportDoc(): OverridesFile {
    return {
      schemaVersion: SCHEMA_VERSION,
      locales: [...locales],
      overrides: overrideStore.get(),
    }
  },
}
