# Content architecture & Edit Mode

How presentation copy is stored, edited, and promoted back into the repository.

## Content architecture

All audience-visible copy lives in **one canonical file**:

```
src/content/presentation.json
```

- Flat map: `"<semantic.dotted.id>": { "fa": "...", "en": "..." }`
- Typed access: `src/content/store.ts` derives `ContentId` from the JSON, so a
  typo in a key is a compile error.
- Slide components never hard-code copy — they render content-bound text with:

  ```tsx
  <CT k="hero.title" />        // plain bilingual text
  <CT k="shift.title" rich />  // parses **highlight** markers (slide titles)
  ```

- Rich titles use `**...**` to mark the turquoise `<Hl>` highlight span.

## Editing (Edit Mode)

Append `?edit=1` to any deck URL:

```
/?edit=1          /main?edit=1#3          /technical?edit=1
```

- Click any outlined text → compact editor opens with **فارسی** and **English**
  fields, **Save / Cancel**, and ↺ (reset this field to repository default).
- `**text**` in a value renders as a highlight; keep it when editing titles.
- A bottom-right toolbar shows override count with Export / Import /
  Reset All / Exit.

Edit Mode is an **editing convenience, not access control**. On a public static
deployment anyone can append the parameter. It writes nothing to the server.

## Persistence

Saved edits are **local browser overrides only** (localStorage key
`parslinks-deck-content-overrides-v1`). Resolution order:

```
canonical presentation.json  ←  localStorage overrides  →  rendered slide
```

They survive reloads on that browser but are invisible to other visitors and
are NOT repository writes. The store is re-validated on every read; a corrupted
or hand-edited entry is ignored rather than crashing the deck.

## Export / Import

- **Export** downloads `presentation-content-overrides.json`:

  ```json
  {
    "schemaVersion": 1,
    "overrides": {
      "hero.title.fa": { "fa": "…" },
      "pilot.title":   { "fa": "…", "en": "…" }
    }
  }
  ```

  Only changed values are included; each entry carries stable content IDs and
  per-language values.
- **Import** validates schemaVersion, known IDs, and string types. Unknown keys
  are reported and skipped — malformed files never reach application state.

## Promoting edits to repository defaults

```bash
pnpm run content:apply -- path/to/presentation-content-overrides.json
```

Validates the export and merges it into `src/content/presentation.json`
(atomic write). Then review the diff, run `pnpm run lint && pnpm run typecheck
&& pnpm run build`, and commit. After promotion, remove the local browser
overrides via the toolbar's **Reset All** so defaults show through.

## Deliberately NOT migrated

Kept out of the content model on purpose:

- Technical/protocol tokens rendered LTR (`Git Push`, `Control Plane`,
  `cgroups · seccomp · netns`, `CPU/RAM`, chip tokens like `Compute`) — these
  are code-like identifiers, identical in both languages.
- Brand constants (`ParsLinks` wordmark), structural labels (`// together`
  eyebrows are editable but arrows/operators are not), and layout-only strings.
- Keyboard/aria operational labels that mirror visible HUD text.
