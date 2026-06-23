# Admin: Q&A + Hero — Design

**Date:** 2026-06-23
**Status:** Approved

## Goal

Add two more admin-editable areas (the last sections): the **Q&A / FAQ** list
and the **hero banner image**, as new tabs in the existing `abide-admin` app.

## Background

- FAQ is **hardcoded HTML**: 12 accordion items in 2 category groups
  (*Venue & Travel*, *Tickets & Groups*). Some answers contain links and
  multiple paragraphs. Accordion JS toggles `.faq-button` / `.expandable-content`
  / `.faq-icon`. No `/api/faq`, no `faq.json`.
- Hero is a static `<picture>` referencing fixed R2 keys, **preloaded** with
  `fetchpriority="high"`:
  - desktop `https://media.abide2026.com/hero-banner.webp`
  - mobile `hero-banner-mobile-412w.webp?v=2` (412w) and `hero-banner-mobile.webp?v=2` (824w)
  All R2-backed. The unused local `assets/hero-banner-extended.webp` is ignored.

## Decisions

1. **Q&A answers:** plain text where blank lines = paragraphs and `[text](url)`
   = links. Preserves existing links; safe and easy for a non-techy editor.
2. **Q&A grouping:** keep categories — each item has a `category` field; the
   site groups items under category headings as today.
3. **Hero swap:** overwrite the fixed R2 keys with a short cache
   (`max-age=300`). Keeps the fast static/preloaded hero; updates within ~5 min
   (hard refresh shows instantly). No main-site HTML change for the hero.
4. **Hero images:** separate desktop + mobile uploads.

## Part A — Q&A migration (main site, prerequisite)

### A1. `faq.json` in R2
Seeded from the 12 current items. Array; order = display order. Per item:

```json
{ "category": "Venue & Travel", "question": "…", "answer": "Plain text.\n\nSecond paragraph with a [link](https://example.com)." }
```

| Field | Required |
|-------|----------|
| `category` | yes |
| `question` | yes |
| `answer` | yes |

### A2. `functions/api/faq.js` (main site)
Read `faq.json`, return the array verbatim with
`cache-control: public, max-age=300`. Missing/malformed → `[]`.

### A3. `index.html` (main site)
Replace the hardcoded FAQ items with an empty `#faq-list` (keep the section
shell, title, and decorative SVGs). On load, fetch `/api/faq` and render:
- Group items by `category` in order of first appearance; render a category
  heading (matching the current style) before each group's items.
- Each item: the existing colored-box → white-card → `.faq-button` (question +
  `.faq-icon`) → `.expandable-content` (rendered answer), with unique ids
  (`faq-1`, `faq-2`, …) and aria wiring as today.
- **Answer rendering:** escape HTML, split on blank lines into `<p>`, convert
  `[text](url)` to `<a target="_blank" rel="noopener noreferrer">` (URL must be
  `http(s)://` or `/`-relative; otherwise render as plain text).
- **Accordion:** event delegation on `#faq-list` (items are dynamic),
  preserving the current open/close + `max-height` + aria + focus behavior.
- On fetch failure: `console.warn`, empty section. Requires a main-site redeploy.

## Part B — Hero endpoint (admin)

### `admin/functions/api/hero.js`
`POST` multipart: `file` + `slot` (`desktop` | `mobile`). Validate image type
(webp/png/jpg/avif) and size ≤ 8 MB. Then:
- `desktop` → `MEDIA_BUCKET.put("hero-banner.webp", …)`
- `mobile` → put **both** `hero-banner-mobile.webp` and
  `hero-banner-mobile-412w.webp` with the uploaded bytes
All writes use `httpMetadata.cacheControl = "public, max-age=300"` and the
upload's real content-type. Returns `{ ok: true }`. Fail-closed unless
`ADMIN_WRITE_ENABLED === "true"`. No main-site change is needed (static HTML
already references these keys).

## Part C — Admin FAQ endpoint + UI

### C1. `admin/functions/api/faq.js`
`GET` raw `faq.json` (or `[]`); `PUT` validated write (array; each item has
non-empty `category`, `question`, `answer`). Fail-closed unless enabled.

### C2. UI — two new tabs
Tab bar becomes: Speakers | Bands | Sponsors | **Q&A** | **Hero**.

- **Q&A** — a list editor reusing the existing load/save/dirty/reorder
  machinery (new `faq` entry in the section config, `noPreview` so cards are
  full-width with no preview/photo/colors). Per item:
  - **Category** — a text input backed by a `<datalist>` of existing categories
    (choose an existing one or type a new one).
  - **Question** — text input.
  - **Answer** — textarea with a hint: "Blank line = new paragraph. Link =
    `[text](url)`."
  - Add / remove (confirm) / reorder (▲▼); one **Save changes** → `PUT /api/faq`.
  Client + server validation: category/question/answer required.
- **Hero** — a dedicated panel (not a list): two slots, **Desktop banner** and
  **Mobile banner**, each showing the current image (`<media>/…?t=<now>` to
  bust the preview cache) and an **Upload** button → `POST /api/hero` with the
  matching `slot`. Immediate apply; status "Updated ✓ — appears on the site
  within ~5 minutes." A tip recommends WebP, wide for desktop / taller for
  mobile. No Save button (save bar hidden on this tab, like Sponsors).

## Data flow

- Q&A: edit → `PUT /api/faq` → `faq.json` in R2 → site `/api/faq` reflects in
  ~5 min.
- Hero: upload → overwrite fixed R2 keys (short cache) → site shows new image in
  ~5 min (hard refresh = instant).

## Error handling

- FAQ PUT: client blocks save if any item lacks category/question/answer
  (offending card highlighted); server re-validates → 400 without writing.
- Hero/upload: reject non-images / > 8 MB / bad `slot` with inline messages.
- Answer link conversion ignores non-http(s)/non-relative URLs (no `javascript:`
  etc.); all answer text is HTML-escaped before link/paragraph conversion.

## Hosting / deploy

- Main site: commit + push `main` → Cloudflare Pages (Part A). Seed `faq.json`
  to R2 before/with deploy so the FAQ isn't briefly empty.
- Admin: `wrangler pages deploy admin --project-name abide-admin` (Parts B, C).
- No new bindings/secrets/Access changes.

## Testing

- Local `wrangler pages dev`: FAQ GET/PUT round-trip + validation; answer
  rendering (paragraphs + links + escaping); hero POST writes the right keys
  with short cache.
- Browser: Q&A tab edit/save; accordion still opens/closes; Hero tab upload +
  preview refresh; tab switching unaffected.
- Main site after deploy: FAQ renders grouped by category, links work,
  accordion works; hero swap appears after cache window.

## Out of scope

- Rich text beyond paragraphs + links; per-item FAQ colors (unchanged).
- Editing hero alt text or the `?v=` query (kept as-is).
- The unused `assets/hero-banner-extended.webp`.
