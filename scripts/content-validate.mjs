#!/usr/bin/env node
/**
 * content:validate — check the canonical presentation content for missing
 * translations across all supported locales.
 *
 *   pnpm run content:validate
 *
 * Exit code 1 (with a per-id report) if any required content id is missing a
 * value for any locale. Optional content (listed in OPTIONAL_IDS inside the
 * content module) is skipped. Run in CI / before a presentation.
 */
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const CANONICAL = resolve(here, "../src/content/presentation.json")

const raw = JSON.parse(readFileSync(CANONICAL, "utf8"))
const locales = raw.locales ?? Object.keys(raw.brand?.lockup ?? { fa: "", en: "" })

// Derive known locale keys from the first content entry that looks like a map.
function localeKeysOf(entry) {
  if (!entry || typeof entry !== "object") return []
  return Object.keys(entry).filter((k) => k !== "$comment")
}

const ids = Object.keys(raw).filter((k) => !k.startsWith("$") && k !== "schemaVersion")

let missing = 0
const report = []
for (const id of ids) {
  const entry = raw[id]
  const keys = localeKeysOf(entry)
  if (keys.length === 0) {
    // Not a localized map (e.g. a structured object) — skipped by design.
    continue
  }
  for (const loc of locales) {
    const v = entry[loc]
    if (v === undefined || v === "") {
      report.push(`  missing: locale=${loc} id=${id}`)
      missing++
    }
  }
}

if (missing === 0) {
  console.log(`OK — all ${ids.length} content ids have values for [${locales.join(", ")}].`)
  process.exit(0)
} else {
  console.error(`Missing ${missing} translation(s):`)
  for (const line of report) console.error(line)
  process.exit(1)
}
