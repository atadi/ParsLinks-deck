#!/usr/bin/env node
/**
 * content:apply — promote Edit-Mode overrides into the canonical content source.
 *
 *   pnpm run content:apply -- path/to/presentation-content-overrides.json
 *
 * Validates the export (schemaVersion, known ids, string values), then writes
 * each override into src/content/presentation.json. Unknown keys are reported
 * and skipped; the file is never left half-written (write is atomic via temp).
 */
import { readFileSync, writeFileSync, renameSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const CANONICAL = resolve(here, "../src/content/presentation.json")

const argv = process.argv.slice(2).filter((a) => a !== "--")
const inputPath = argv[0]
if (!inputPath) {
  console.error("Usage: pnpm run content:apply -- <overrides.json>")
  process.exit(1)
}

let doc
try {
  doc = JSON.parse(readFileSync(resolve(inputPath), "utf8"))
} catch (e) {
  console.error(`Cannot read/parse ${inputPath}: ${e.message}`)
  process.exit(1)
}

const problems = []
if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
  console.error("Root must be a JSON object.")
  process.exit(1)
}
if (!doc.overrides || typeof doc.overrides !== "object") {
  console.error('Missing "overrides" object.')
  process.exit(1)
}
if (doc.schemaVersion !== 1 && doc.schemaVersion !== 2) {
  console.error(`schemaVersion mismatch (file: ${doc.schemaVersion}, app: 1|2).`)
  process.exit(1)
}

const canonical = JSON.parse(readFileSync(CANONICAL, "utf8"))
let applied = 0
for (const [id, patch] of Object.entries(doc.overrides)) {
  if (!(id in canonical)) {
    problems.push(`unknown id "${id}" — skipped`)
    continue
  }
  // Locale-generic: accept any known locale key, skip unknown ones.
  const known = Object.keys(canonical[id]) // e.g. fa, en
  const next = { ...canonical[id] }
  let changed = false
  for (const [loc, val] of Object.entries(patch || {})) {
    if (!known.includes(loc)) {
      problems.push(`unknown locale "${loc}" in "${id}" — skipped`)
      continue
    }
    if (typeof val !== "string") {
      problems.push(`"${id}.${loc}" is not a string — skipped`)
      continue
    }
    if (val !== "") next[loc] = val
    changed = true
  }
  if (!changed) {
    problems.push(`"${id}" had no valid locale values — skipped`)
    continue
  }
  canonical[id] = next
  applied++
}

if (applied === 0) {
  console.error("Nothing to apply.")
  for (const p of problems) console.error("  -", p)
  process.exit(1)
}

// atomic write: temp file + rename
const tmp = `${CANONICAL}.tmp`
writeFileSync(tmp, JSON.stringify(canonical, null, 2) + "\n", "utf8")
renameSync(tmp, CANONICAL)

console.log(`Applied ${applied} override(s) to ${CANONICAL}`)
if (problems.length) {
  console.log("Skipped:")
  for (const p of problems) console.log("  -", p)
}
console.log("Review the diff, run lint/typecheck/build, then commit.")
