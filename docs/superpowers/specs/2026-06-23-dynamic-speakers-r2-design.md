# Dynamic Speakers backed by R2 — Design

**Date:** 2026-06-23
**Status:** Approved (pending spec review)

## Goal

Make the Speakers section data-driven the same way the sponsor marquee is
(commit `e7bffc2`): editing speakers becomes "update one file in R2," with no
HTML edit and no code deploy. Speakers appear/update live within the R2 cache
window (~5 min).

## Background

The sponsor marquee renders client-side from `/api/partners`, a Cloudflare
Pages Function that lists `partner-*` images in the `MEDIA_BUCKET` R2 bucket.
Adding a sponsor = drop a file in R2. This works because a sponsor is *only* a
logo + an alt string auto-derived from the filename.

Speakers are richer. Each card today (index.html lines 245–381) carries data a
filename cannot encode:

- `name`, `bio` (full paragraph shown in a modal), `alt`, `focus` (image crop)
- a color trio: card background, pill background, pill text
- decorative SVG blobs in varied positions/colors
- a click-to-open modal driven by the `speakers` JS array (lines 1193–1250) and
  the parallel `cardBgColors` / `pillColors` / `pillTextColors` arrays
  (lines 1268–1272)

Because of this metadata, pure filename convention is insufficient; we need a
metadata document. Per decisions below, that document is `speakers.json` in R2,
and rendering is fully client-side (true parity with sponsors).

## Decisions

1. **Metadata source:** a single `speakers.json` object in the `MEDIA_BUCKET`
   R2 bucket. Single source of truth for all speaker data.
2. **Color theming:** specified per-speaker in the JSON, with optional fields —
   when a color is omitted, the frontend falls back to rotating a curated brand
   palette by card position, so a missing color never breaks a card.
3. **Render timing:** client-side fetch on page load (sponsor parity). Live,
   no deploy needed. Accepted trade-offs: speakers are not in the initial HTML
   (weaker SEO than the current static markup) and there is a brief empty
   section before JS runs.

## Architecture

Mirrors the sponsor pattern.

### 1. `functions/api/speakers.js` (new)

Cloudflare Pages Function, sibling to `functions/api/partners.js`.

- Reads the `speakers.json` object from `env.MEDIA_BUCKET`.
- Parses it and returns the array as JSON with
  `cache-control: public, max-age=300, s-maxage=300` (matches partners).
- For each speaker, if `img` is a bare filename (not an absolute `http(s)://`
  URL), prefix `https://media.abide2026.com/`. Full URLs pass through
  unchanged. This keeps the JSON terse while staying flexible.
- If `MEDIA_BUCKET` is unbound → 500 with an error body (matches partners).
- If the object is missing or unparseable → return `[]` (empty array), not a
  500, so the page degrades to an empty section rather than an error.

### 2. `speakers.json` in R2 (new data)

Array of speaker objects. Order in the array = display order.

```json
[
  {
    "name": "Hosanna Wong",
    "bio": "Hosanna Wong is a speaker, author, and spoken word artist...",
    "img": "speaker-hosanna-wong.webp",
    "alt": "Hosanna Wong speaking on stage",
    "focus": "center top",
    "cardBg": "#e0dd90",
    "pillBg": "#fde6d3",
    "pillText": "#f26ba4"
  }
]
```

Field reference:

| Field      | Required | Fallback                                   |
|------------|----------|--------------------------------------------|
| `name`     | yes      | —                                          |
| `bio`      | yes      | —                                          |
| `img`      | yes      | —                                          |
| `alt`      | no       | `name`                                     |
| `focus`    | no       | `center 20%`                               |
| `cardBg`   | no       | curated palette, rotated by index          |
| `pillBg`   | no       | curated palette, rotated by index          |
| `pillText` | no       | curated palette, rotated by index          |

### 3. Frontend (`index.html`)

- Replace the 8 hardcoded speaker cards (lines 245–381) with an empty
  `<div id="speakers-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"></div>`.
- On load, fetch `/api/speakers`, then:
  - Build each card's HTML (button + image + name pill + decorative blobs) into
    the grid. Reuse existing classes (`.speaker-card`, `.card-body`,
    `.name-pill`, `.speaker-deco`, `.speaker-deco-alt`, `.tap-hint`) — no new
    CSS.
  - Rotate through a small set of decorative-blob presets by index to preserve
    the current playful varied look without adding a JSON field.
  - Populate the existing `speakers` array the modal consumes, plus the per-index
    color values the modal reads (`cardBg`/`pillBg`/`pillText`), replacing the
    hardcoded `speakers` / `cardBgColors` / `pillColors` / `pillTextColors`
    arrays.
  - Apply color fallback (curated palette rotated by index) for any speaker
    missing color fields.
- Modal click-handling switches to **event delegation** on `#speakers-grid`,
  since cards now appear after the fetch resolves. Modal open/close, FLIP
  animation, focus management, and keyboard handling are otherwise unchanged.
- On fetch failure: `console.warn` and leave the section empty — same graceful
  degradation as the marquee.

## Migration (one-time)

1. Generate `speakers.json` from the 8 speakers currently in the HTML,
   preserving each one's exact `bio`, `img`, `alt`, `focus`, and the
   hand-picked colors from `cardBgColors` / `pillColors` / `pillTextColors`
   (index.html lines 1268–1272).
2. Upload to R2:
   `wrangler r2 object put media/speakers.json --file=speakers.json --remote`
3. Remove the static cards + hardcoded data arrays from `index.html`.

After migration, editing speakers = editing the R2 `speakers.json`.

## Edge cases

- Empty / malformed JSON → function returns `[]`; frontend renders nothing.
- Missing color fields → curated-palette fallback by index.
- Missing `focus` → `center 20%`.
- Missing `alt` → use `name`.
- Fetch failure (network/500) → `console.warn`, empty section.

## Testing

- Run the dev build; seed a local/staging `/api/speakers` response.
- Confirm cards render from the data in array order.
- Confirm the modal opens with the correct bio and colors via delegation.
- Confirm keyboard navigation and focus return still work.
- Confirm a speaker entry with omitted color fields renders with palette
  fallback rather than broken styling.

## Out of scope

- The Worship Leaders section (index.html ~line 438) stays hardcoded. The same
  pattern could be applied to it later if desired.
- No new CSS; no changes to the build/inline pipeline.
