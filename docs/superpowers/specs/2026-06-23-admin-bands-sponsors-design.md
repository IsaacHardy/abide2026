# Admin: Bands + Sponsors — Design

**Date:** 2026-06-23
**Status:** Approved (pending spec review)

## Goal

Extend the existing `abide-admin` app so a non-technical editor can manage two
more sections of the site, alongside Speakers:

- **Bands** (the Worship Leaders section) — currently hardcoded; must be made
  data-driven first.
- **Sponsors** (the partner-logo marquee) — already filename-driven from R2;
  add upload + delete.

All three sections live under tabs in the one Access-protected admin app.

## Background

- Speakers are data-driven: `speakers.json` in the `media` R2 bucket, served by
  `functions/api/speakers.js`, edited via the admin's `/api/speakers`
  (GET raw / PUT validated) and `/api/upload`.
- **Sponsors/partners** have **no manifest**. `functions/api/partners.js` lists
  `partner-*` objects in R2 and derives `{ src, alt }` per logo; `alt` comes
  from the filename (title-cased, or an explicit `__alt` suffix). The marquee in
  `index.html` fetches `/api/partners` and renders client-side. Cached 5 min.
- **Bands/worship leaders** are **hardcoded HTML** (2 entries: Leeland, Hope
  Darst). Each carries: name, role line ("Worship Leader & Songwriter"),
  image (`https://media.abide2026.com/worship-<slug>.webp`), alt, and three
  brand colors (cardBg / pillBg / pillText). No bios, modal, or links. There is
  no `/api/worship` and no `worship.json`.

Brand palette (only colors offered): `#e0dd90` `#b7ceca` `#ff8d53` `#f26ba4`
`#fde6d3` `#f0a398`.

## Decisions

1. **Bands fields:** keep exactly the current fields — name, role, photo, alt,
   3 colors. No bio, modal, or link. (Matches the live look.)
2. **Sponsors control:** upload + delete only; keep the filename-based system.
   No reordering, no manifest, no click-through link. No main-site change for
   sponsors.
3. **Admin layout:** tabs (Speakers | Bands | Sponsors) in the existing
   `abide-admin` app — one login, one place.

## Part A — Bands migration (main site, prerequisite)

Make worship leaders data-driven, mirroring the speakers pattern.

### A1. `worship.json` in R2
Seeded from the 2 current bands. Array; order = display order. Per entry:

```json
{
  "name": "Leeland",
  "role": "Worship Leader & Songwriter",
  "img": "worship-leeland.webp",
  "alt": "Leeland, Grammy-nominated worship leader and songwriter",
  "cardBg": "#e0dd90",
  "pillBg": "#fde6d3",
  "pillText": "#f26ba4"
}
```

| Field | Required | Fallback |
|-------|----------|----------|
| `name` | yes | — |
| `role` | yes | — |
| `img` | yes | — |
| `alt` | no | `name` |
| `cardBg`/`pillBg`/`pillText` | no | curated palette, rotated by index |

### A2. `functions/api/worship.js` (main site)
Copy of `speakers.js`: read `worship.json`, resolve bare `img` filenames to
`https://media.abide2026.com/...`, return the array with
`cache-control: public, max-age=300`. Missing/malformed → `[]`.

### A3. `index.html` (main site)
Replace the hardcoded worship cards with an empty `#worship-grid` (same grid
classes as today). On load, fetch `/api/worship` and render cards client-side,
reusing the existing worship card markup and CSS classes (`worship-card-wrap`,
`card-body`, `name-pill`, role `<p>`). Decorative shapes rotate through presets
by index, as the speakers grid does. Colors come from each entry, with the
palette fallback. No modal. On fetch failure: `console.warn`, empty section.
Requires a main-site redeploy (git push → Cloudflare Pages).

## Part B — Admin endpoints (`abide-admin` project)

All writes already gated by Cloudflare Access (edge) + the `ADMIN_WRITE_ENABLED`
kill switch. New/changed Functions:

### B1. `admin/functions/api/worship.js`
Near-copy of the admin `speakers.js`:
- `GET` → return raw `worship.json` (bare filenames) or `[]`.
- `PUT` → validate and write. Validation: array; each entry has non-empty
  `name`, `role`, `img`; `alt`/colors optional; colors (if present) must be a
  brand hex. Fail-closed unless `ADMIN_WRITE_ENABLED === "true"`.

### B2. `admin/functions/api/partners.js`
- `GET` → list `partner-*` image objects in R2 (paginated `list`), return
  `[{ key, alt, url }]` where `alt` is derived the same way `partners.js` does
  (so the admin shows what the site shows) and `url` is the full media URL.
- `DELETE` → body `{ key }`; validate the key starts with `partner-` and is an
  image; `MEDIA_BUCKET.delete(key)`; return `{ ok: true }`. Fail-closed unless
  enabled. Reject keys that don't match the `partner-` prefix (no deleting
  speaker/worship/other objects through this endpoint).

### B3. `admin/functions/api/upload.js` (extend)
Add an optional `prefix` form field, allow-listed to
`speaker` | `worship` | `partner` (default `speaker` for backward
compatibility). Key becomes `<prefix>-<slug>.<ext>`. Everything else (image
type/size validation, slug rules) unchanged. Still fail-closed.

## Part C — Admin UI (`admin/index.html`)

Add a top **tab bar**: Speakers | Bands | Sponsors. Switching tabs shows the
relevant panel; each panel manages its own data and dirty state. Shared helpers
(brand-swatch picker, photo upload control, labelled-field builder, escape,
status/save handling) are factored out and reused by all tabs rather than
duplicated. If `index.html` grows unwieldy, split per-tab logic into separate
`admin/js/*.js` files loaded via `<script src>` (static, no build step).

- **Speakers tab** — the existing editor, unchanged.
- **Bands tab** — same editor style, fewer fields per card: name, role, alt,
  photo (uploads with `prefix=worship`), and 3 brand swatches (card / pill /
  name-text). Add / remove (confirm) / reorder (▲▼). One **Save changes**
  button → `PUT /api/worship`. Live mini-preview per card (card bg + photo +
  name pill + role line). Same client + server validation as speakers
  (name/role/photo required).
- **Sponsors tab** — a logo **gallery**: each tile shows the logo image and its
  alt with a **Remove** button (confirm → `DELETE /api/partners`). An **Add
  sponsor** control: pick an image file + type a name → `POST /api/upload` with
  `prefix=partner` (key `partner-<slug>.<ext>`; the marquee title-cases the slug
  into the alt). Uploads and deletes apply **immediately** (no Save button);
  after each, the gallery refreshes from `GET /api/partners`. A note states the
  marquee updates on the site within ~5 minutes.

## Data flow

- Bands: edit in admin → `PUT /api/worship` → `worship.json` in R2 → main site
  `/api/worship` reflects within ~5 min.
- Sponsors: upload/delete in admin → R2 object created/removed → main site
  `/api/partners` (live listing, cached 5 min) reflects within ~5 min.

## Error handling

- Worship PUT: client blocks save if any band lacks name/role/photo
  (offending card highlighted); server re-validates → 400 without writing.
- Upload: reject non-images / > 8 MB / bad `prefix` with an inline message.
- Partner DELETE: reject non-`partner-` keys (403/400); confirm in UI first.
- Load/network errors: non-destructive banner; never silently drop in-progress
  edits. Single-editor assumption; last write wins.

## Hosting / deploy

- Main site: commit + push `main` → Cloudflare Pages auto-deploy (Part A).
- Admin: `wrangler pages deploy admin --project-name abide-admin` (Parts B, C).
- Seed `worship.json` into R2 once (via the admin PUT after deploy, or
  `wrangler r2 object put`).
- No new bindings, secrets, or Access changes — the admin already binds
  `MEDIA_BUCKET`, has `ADMIN_WRITE_ENABLED`, and is Access-protected across all
  routes including the new ones.

## Testing

- Local `wrangler pages dev admin` with a seeded local R2: verify worship
  GET/PUT round-trip and validation; verify partners GET lists objects, upload
  with each prefix writes the right key, DELETE removes only `partner-*`.
- Browser: tab switching; bands editor save + preview; sponsors add/remove
  refreshing the gallery.
- Main site: after Part A deploy, confirm the worship section renders from
  `/api/worship` and matches the previous look; confirm a band edit and a
  sponsor add/remove appear after cache expiry.

## Out of scope

- Bios, modals, or links for bands.
- Reordering or click-through links for sponsors.
- Any change to the speakers feature or to the main site beyond Part A.
