import raw from "./presentation.json"

/* ==================================================================
   Content layer — canonical defaults + local override resolution.
   Canonical source: src/content/presentation.json (schemaVersion 1).
   Overrides: localStorage["parslinks-deck-content-overrides-v1"],
   written only by Edit Mode (/​?edit=1). No backend.
   ================================================================== */

export type Lang = "fa" | "en"

export interface LocalizedText {
  fa: string
  en: string
}

/** Every stable semantic content id in the deck. */
export type ContentId = keyof typeof raw

export const SCHEMA_VERSION: number = raw.schemaVersion

/** The immutable repository defaults. */
export const DEFAULT_CONTENT = raw as unknown as Record<ContentId, LocalizedText>

export const CONTENT_IDS = Object.keys(DEFAULT_CONTENT).filter(
  (k) => !k.startsWith("$") && k !== "schemaVersion",
) as ContentId[]

export const OVERRIDE_STORAGE_KEY = "parslinks-deck-content-overrides-v1"

export interface OverridesFile {
  schemaVersion: number
  overrides: Partial<Record<string, { fa?: string; en?: string }>>
}

/* ---------------- runtime-validated import/export ---------------- */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

/**
 * Validate an untrusted parsed JSON document against the content schema.
 * Unknown keys are reported and skipped; never merged blindly.
 * Returns the safe subset plus a list of problems.
 */
export function validateOverrides(input: unknown): {
  ok: boolean
  overrides: Partial<Record<ContentId, Partial<LocalizedText>>>
  problems: string[]
} {
  const problems: string[] = []
  if (!isRecord(input)) return { ok: false, overrides: {}, problems: ["Root must be a JSON object."] }

  const version = input.schemaVersion
  if (!isRecord(input.overrides)) return { ok: false, overrides: {}, problems: ['Missing "overrides" object.'] }
  if (typeof version !== "number" || version !== SCHEMA_VERSION) {
    problems.push(`schemaVersion mismatch (file: ${String(version)}, app: ${SCHEMA_VERSION}).`)
    return { ok: false, overrides: {}, problems }
  }

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
    const fa = val.fa
    const en = val.en
    if (fa !== undefined && typeof fa !== "string") {
      problems.push(`"${key}.fa" is not a string — skipped.`)
      continue
    }
    if (en !== undefined && typeof en !== "string") {
      problems.push(`"${key}.en" is not a string — skipped.`)
      continue
    }
    if (fa === undefined && en === undefined) continue
    const patch: Partial<LocalizedText> = {}
    if (typeof fa === "string") patch.fa = fa
    if (typeof en === "string") patch.en = en
    out[key as ContentId] = patch
  }
  return { ok: true, overrides: out, problems }
}

/* ---------------- localStorage override store ---------------- */
type Listener = () => void

function readStore(): Record<string, Partial<LocalizedText>> {
  if (typeof window === "undefined") return {}
  try {
    const s = window.localStorage.getItem(OVERRIDE_STORAGE_KEY)
    if (!s) return {}
    const parsed: unknown = JSON.parse(s)
    // Re-validate on every read so a corrupted/hand-edited store can never crash the deck.
    const res = validateOverrides(parsed)
    return res.ok ? (res.overrides as Record<string, Partial<LocalizedText>>) : {}
  } catch {
    return {}
  }
}

function writeStore(v: Record<string, Partial<LocalizedText>>) {
  try {
    window.localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, overrides: v }))
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
  /** Set or clear (value undefined/null/"" for both langs deletes) one id. */
  set(id: ContentId, patch: Partial<LocalizedText>) {
    const cur = { ...overrideStore.get() }
    const nextFa = "fa" in patch ? patch.fa : cur[id]?.fa
    const nextEn = "en" in patch ? patch.en : cur[id]?.en
    if (!nextFa && !nextEn) delete cur[id]
    else cur[id] = { fa: nextFa ?? "", en: nextEn ?? "" }
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
  /** Export document: schemaVersion + only changed values. */
  exportDoc(): OverridesFile {
    return { schemaVersion: SCHEMA_VERSION, overrides: overrideStore.get() }
  },
}
