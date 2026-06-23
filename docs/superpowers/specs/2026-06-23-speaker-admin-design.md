# Speaker Admin — Design

**Date:** 2026-06-23
**Status:** Approved (pending spec review)

## Goal

Give a non-technical editor a simple web form to manage the conference
speakers — edit names/bios/colors, upload photos, add/remove/reorder — without
touching code, R2 tooling, or JSON. Hosted as a separate Cloudflare Pages app
on the default `*.pages.dev` domain, gated by Cloudflare Access.

## Background

The live site renders speakers client-side from `speakers.json` in the `media`
R2 bucket, served via `functions/api/speakers.js` (see
`2026-06-23-dynamic-speakers-r2-design.md`). Today, editing speakers means
hand-editing `speakers.json` and uploading it with `wrangler` — fine for a
developer, not for a non-techy friend. This admin puts a friendly UI in front
of that same file and the same bucket.

`speakers.json` schema (array; order = display order):

```json
{
  "name": "Hosanna Wong",
  "bio": "...",
  "img": "speaker-hosanna-wong.webp",
  "alt": "Hosanna Wong speaking on stage",
  "focus": "center top",
  "cardBg": "#e0dd90",
  "pillBg": "#fde6d3",
  "pillText": "#f26ba4"
}
```

Brand palette (the only colors offered): yellow-green `#e0dd90`,
sage `#b7ceca`, coral `#ff8d53`, hot-pink `#f26ba4`, peach `#fde6d3`,
rose `#f0a398`.

## Decisions

1. **Auth:** Cloudflare Access (email one-time-PIN) protecting the entire
   `abide-admin.pages.dev` project, including `/api/*`. Allow-list contains the
   owner's and the friend's email. Free tier.
2. **Photo upload:** the admin uploads image files to R2 and links them
   automatically. No manual filename handling by the editor.
3. **Colors:** brand-swatch pickers only (6 fixed colors) — no free hex entry.

## Architecture

A standalone Cloudflare Pages project, `abide-admin`, separate from the main
site, sharing the `media` R2 bucket via a `MEDIA_BUCKET` binding.

```
admin/
  index.html              # the whole admin UI (vanilla HTML/CSS/JS)
  functions/api/
    speakers.js           # GET (load) + PUT (save) speakers.json
    upload.js             # POST an image -> store in R2 -> return filename
  wrangler.toml           # name=abide-admin, pages_build_output_dir=".",
                          # [[r2_buckets]] MEDIA_BUCKET -> media
```

### Functions

All three are implicitly protected by Cloudflare Access (edge-level); no
in-app password logic.

- **`GET /api/speakers`** — read `speakers.json` from R2 and return it raw
  (bare `img` filenames preserved, so the form round-trips exactly what's
  stored). Missing/empty object → return `[]`. Malformed → 500 with message.
- **`PUT /api/speakers`** — body is the full speakers array. Validate:
  - body is an array;
  - each entry has non-empty `name`, `bio`, `img` (strings);
  - `cardBg`/`pillBg`/`pillText`, if present, are one of the 6 brand hexes;
  - `focus` is a string if present.
  On success, write `speakers.json` to R2 with
  `content-type: application/json` and return `{ ok: true }`. On validation
  failure, return 400 with a per-field message; do not write.
- **`POST /api/upload`** — `multipart/form-data` with fields `file` (the image)
  and `name` (the speaker name, for slugging). Validate content-type is an
  image and size ≤ 8 MB. Compute `slug = lowercase(name)`, spaces→`-`,
  strip non-`[a-z0-9-]`, collapse repeats. Key = `speaker-<slug>.<ext>` where
  `<ext>` derives from the upload's MIME/extension (`webp|png|jpe?g|avif`).
  Store via `MEDIA_BUCKET.put(key, file.stream(), { httpMetadata })`. Return
  `{ filename: key }`. If `name` is blank, fall back to a timestamp-free slug
  derived from the original filename. (No image conversion; stored as-is.)

### UI (`admin/index.html`)

Single self-contained page. On load: `GET /api/speakers`, render an editable
vertical list. Each speaker is a row pairing a **live mini-preview** (the real
styled card markup reused from the site) with its edit fields:

- **Name** — text.
- **Bio** — textarea.
- **Alt text** — text; defaults to name if left blank.
- **Image crop** — dropdown of friendly presets mapping to `focus` values
  (e.g. "Center" → `center 20%`, "Face near top" → `center top`,
  "Centered" → `center center`).
- **Photo** — thumbnail of the current image + "Upload photo" button. On
  file-pick, immediately `POST /api/upload`; on success set that speaker's
  `img` to the returned filename and refresh the thumbnail/preview.
- **Colors** — three rows of 6 brand swatches (card / pill / pill-text); the
  selected swatch is ringed.

List-level actions:

- **＋ Add speaker** — append a blank card with sensible default brand colors.
- **🗑 Remove** (per card) — with a confirm.
- **▲ / ▼** reorder buttons (chosen over drag for mobile reliability).
- **Save changes** — one button, disabled until a change is made; states
  "Saving… / Saved ✓ / Error". Calls `PUT /api/speakers` with the full array.
- A persistent note: "Changes appear on the live site within ~5 minutes."

### Data flow

1. Friend opens `abide-admin.pages.dev` → Cloudflare Access email login.
2. App `GET /api/speakers` → renders form.
3. Edits; each photo pick → `POST /api/upload` (photo lands in R2 immediately).
4. **Save** → `PUT /api/speakers` → R2 `speakers.json` overwritten.
5. Main site reflects changes within the existing ~5-minute R2 cache window.

## Error handling

- Upload: reject non-images and files > 8 MB with an inline message; the
  speaker keeps its previous image.
- Save: client blocks save if any speaker lacks name/bio/image, highlighting
  the offending card; server re-validates and returns 400 on bad input
  without writing.
- Load failure / network error: show a non-destructive banner; never silently
  discard the editor's in-progress changes.
- Concurrent edits are out of scope (single-editor assumption); last Save wins.

## Hosting & setup (one-time, manual where noted)

1. Create Pages project and deploy:
   `wrangler pages deploy admin --project-name abide-admin`.
2. Bind R2: `MEDIA_BUCKET` → `media` (via `admin/wrangler.toml` on deploy, or
   the dashboard: Settings → Functions → R2 bindings).
3. **Cloudflare Access (manual, dashboard):** create an Access application over
   `abide-admin.pages.dev`, policy = allow {owner email, friend email}, login
   method = email one-time PIN. (Cannot be scripted here; click-path provided
   at setup time.)

Inputs needed at setup: the friend's email (Access allow-list) and
confirmation of the project name `abide-admin`.

## Testing

- Local: `wrangler pages dev admin` with a local R2 seeded with `speakers.json`;
  verify load → edit → save round-trips, and upload writes a new object.
- Browser: confirm previews match the live card styling; confirm Save
  validation blocks incomplete speakers; confirm an uploaded photo appears and
  is linked.
- Production smoke test (after Access setup): log in, make a trivial edit, Save,
  confirm the main site updates after cache expiry.

## Out of scope

- Editing the Worship Leaders section (separate, still hardcoded).
- Multi-user editing / conflict resolution / edit history.
- Image cropping/resizing/conversion in the browser or Worker.
- Any change to the main site beyond what it already does (it just reads R2).
