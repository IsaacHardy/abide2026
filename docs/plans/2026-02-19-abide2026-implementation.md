# ABIDE 2026 Landing Pages — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 3 distinct static HTML + Tailwind landing pages for the ABIDE 2026 conference, each using the frontend-design skill, sharing identical brand identity/SEO/accessibility but differing in layout and interactions.

**Architecture:** Each option is a self-contained `index.html` in its own directory, referencing shared `../assets/` for images and fonts. Tailwind CSS via CDN play script. Vanilla JS for interactions. Mobile-first responsive design.

**Tech Stack:** HTML5, Tailwind CSS (CDN), vanilla JavaScript, self-hosted fonts (Assistant + Cormorant)

**Design Doc:** `docs/plans/2026-02-19-abide2026-design.md`

---

## Task 1: Project Setup — Shared Tailwind Config & Font Loading

**Files:**
- Create: `option-a/index.html` (scaffold only)
- Create: `option-b/index.html` (scaffold only)
- Create: `option-c/index.html` (scaffold only)

**Step 1: Create the 3 directories**

```bash
mkdir -p option-a option-b option-c
```

**Step 2: Create a minimal HTML scaffold for Option A to validate Tailwind + fonts**

Create `option-a/index.html` with:
- Tailwind CDN play script with custom theme config (brand colors, fonts)
- `@font-face` declarations for Assistant (400, 700) and Cormorant (400)
- A test heading + paragraph to confirm fonts load
- `<meta charset>`, `<meta viewport>`, `lang="en"`

The Tailwind config block (inside `<script type="module">`) should extend the theme:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F4',
        peach: '#FDE6D3',
        rose: '#F0A398',
        coral: '#FF8D53',
        'hot-pink': '#F26BA4',
        'yellow-green': '#E0DD90',
        'near-black': '#121212',
        'off-white': '#FEFEFE',
      },
      fontFamily: {
        heading: ['Cormorant', 'serif'],
        body: ['Assistant', 'sans-serif'],
      },
    },
  },
}
```

**Step 3: Open in browser, verify fonts render and colors work**

```bash
open option-a/index.html
```

Expected: Cormorant heading, Assistant body text, correct brand colors visible.

**Step 4: Commit scaffold**

```bash
git add option-a/index.html
git commit -m "feat: scaffold Option A with Tailwind config and font loading"
```

---

## Task 2: Build Option A — "Refined Warmth"

**Files:**
- Modify: `option-a/index.html`

**REQUIRED:** Use the `frontend-design` skill to implement this page.

**Context to provide the frontend-design skill:**

> Build Option A "Refined Warmth" for the ABIDE 2026 conference landing page.
>
> Read the design doc at `docs/plans/2026-02-19-abide2026-design.md` — specifically the "Shared Foundation" section and "Option A: Refined Warmth" section.
>
> Key design principles:
> - Mobile-first (base styles = mobile, scale up with sm:/md:/lg:/xl:)
> - Centered, symmetric layouts with curved SVG wave dividers between sections
> - Generous whitespace, rounded corners on cards
> - Warm, organic, premium invitation feel
>
> Technical requirements:
> - Single self-contained `option-a/index.html`
> - Tailwind CSS via CDN play script with custom theme config (colors + fonts defined in Task 1)
> - Self-hosted fonts from `../assets/fonts/`
> - Images from `../assets/images/`
> - Vanilla JS only for: mobile nav toggle, FAQ accordion, speaker bio expand, nav scroll effect
> - All animations respect `prefers-reduced-motion`
>
> SEO requirements:
> - Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
> - JSON-LD Event structured data
> - Open Graph + Twitter Card meta tags
> - `<title>`: "ABIDE 2026 | Women in Truth Conference — July 31-Aug 1, Macon GA"
> - Descriptive alt attributes on all images
>
> Accessibility requirements:
> - Skip-to-content link
> - Single `<h1>`, sequential heading hierarchy
> - ARIA labels on accordion, mobile nav, expandable bios
> - Keyboard navigation for all interactive elements
> - Focus-visible outlines
> - WCAG 2.1 AA color contrast
> - Touch targets 44x44px minimum
>
> Sections (in order):
> 1. Sticky nav — cream bg, logo left, coral "Buy Tickets" button right, transparent over hero, hamburger on mobile
> 2. Hero — full viewport, hero-banner.png as bg with peach gradient overlay, centered text, CTA, scroll indicator
> 3. Intro — cream bg, centered max-w-3xl, tagline + scripture (John 15:4) in italic with decorative quotes
> 4. Speakers — peach bg, 3-col→2-col→1-col grid, rounded photo cards with expandable bios, rose hover border
>    - Hosanna Wong (speaker-hosanna-wong.png)
>    - Chrystal Evans Hurst (speaker-chrystal-evans-hurst.jpg)
>    - Annie F. Downs (speaker-annie-f-downs.jpg)
>    - Courtney Smallbone (speaker-courtney-smallbone.jpg)
>    - Natalie Runion (speaker-natalie-runion.jpg)
>    - Jess Connolly (speaker-jess-connolly.jpg)
> 5. Worship — rose bg, 2-col→1-col grid, larger photos
>    - Leeland (worship-leeland.jpg)
>    - Hope Darst (worship-hope-darst.jpg)
> 6. Schedule — cream bg, two-col (Fri|Sat) desktop / stacked mobile, coral left border accent
> 7. FAQ — peach bg, accordion with plus/minus icons
> 8. Final CTA — coral bg, "Ready to Abide?" white text, white outline button
> 9. Footer — cream, logo, social links, copyright

**Step 1: Invoke frontend-design skill with the above context**

**Step 2: Verify in browser at mobile (375px) and desktop (1440px)**

```bash
open option-a/index.html
```

Verify:
- All 9 sections render
- Mobile nav hamburger works
- FAQ accordion opens/closes with keyboard
- Speaker bios expand
- Scroll animations play (and are disabled in reduced-motion)
- All images load
- Fonts render correctly

**Step 3: Commit**

```bash
git add option-a/index.html
git commit -m "feat: build Option A 'Refined Warmth' landing page"
```

---

## Task 3: Build Option B — "Bold Editorial"

**Files:**
- Create: `option-b/index.html`

**REQUIRED:** Use the `frontend-design` skill to implement this page.

**Context to provide the frontend-design skill:**

> Build Option B "Bold Editorial" for the ABIDE 2026 conference landing page.
>
> Read the design doc at `docs/plans/2026-02-19-abide2026-design.md` — specifically the "Shared Foundation" section and "Option B: Bold Editorial" section.
>
> Key design principles:
> - Mobile-first (base styles = mobile, scale up with sm:/md:/lg:/xl:)
> - Asymmetric layouts, overlapping elements
> - Hard edges between sections (no curves)
> - Large type used as background watermark texture
> - Photography treated as full-bleed art
> - Magazine spread / editorial feel
>
> Technical requirements:
> - Single self-contained `option-b/index.html`
> - Tailwind CSS via CDN play script with same custom theme config as Option A
> - Self-hosted fonts from `../assets/fonts/`
> - Images from `../assets/images/`
> - Vanilla JS only for: mobile nav full-screen overlay, FAQ accordion, nav scroll effect
> - All animations respect `prefers-reduced-motion`
>
> SEO requirements: (identical to Option A — see design doc "Shared Foundation" section)
>
> Accessibility requirements: (identical to Option A — see design doc "Shared Foundation" section)
>
> Sections (in order):
> 1. Sticky nav — near-black bg, white logo left, coral "Get Tickets" button right, mobile: full-screen overlay menu with large Cormorant links
> 2. Hero — full viewport, dark gradient overlay on hero-banner.png, "ABIDE 2026" massive left-aligned (desktop) / centered (mobile), "Women in Truth" small uppercase label above, CTA
> 3. Intro — cream bg, split layout: left = large italic scripture pull-quote with coral vertical rule, right = mission text. Stacks on mobile.
> 4. Speakers — rose bg, "SPEAKERS" huge semi-transparent watermark text. Each speaker = full-width row with photo (40%) on alternating sides + name/bio. Coral separator lines. Mobile: stacked.
>    - (same 6 speakers and image files as Option A)
> 5. Worship — coral bg, same alternating row layout, "WORSHIP" watermark. 2 entries.
>    - (same 2 worship leaders and image files as Option A)
> 6. Schedule — cream bg, two-column with coral center divider, large Cormorant day names, small uppercase times. Single column on mobile.
> 7. FAQ — cream bg, near-black text, accordion with bold Cormorant questions, coral chevrons, thin rules between items
> 8. Final CTA — rose bg, "Join Us" massive coral text, "Get Tickets" button, faded speaker collage as subtle bg
> 9. Footer — near-black bg, cream text, logo, links, social, copyright

**Step 1: Invoke frontend-design skill with the above context**

**Step 2: Verify in browser at mobile (375px) and desktop (1440px)**

```bash
open option-b/index.html
```

Verify:
- All 9 sections render
- Full-screen mobile nav overlay opens/closes
- Speaker rows alternate photo left/right
- Watermark text visible behind speakers/worship sections
- FAQ accordion works with keyboard
- Parallax on hero (and disabled in reduced-motion)
- All images load, fonts render

**Step 3: Commit**

```bash
git add option-b/index.html
git commit -m "feat: build Option B 'Bold Editorial' landing page"
```

---

## Task 4: Build Option C — "Immersive & Modern"

**Files:**
- Create: `option-c/index.html`

**REQUIRED:** Use the `frontend-design` skill to implement this page.

**Context to provide the frontend-design skill:**

> Build Option C "Immersive & Modern" for the ABIDE 2026 conference landing page.
>
> Read the design doc at `docs/plans/2026-02-19-abide2026-design.md` — specifically the "Shared Foundation" section and "Option C: Immersive & Modern" section.
>
> Key design principles:
> - Mobile-first (base styles = mobile, scale up with sm:/md:/lg:/xl:)
> - One focal element per viewport — every scroll feels intentional
> - Dark-to-light-to-dark rhythm through the page
> - Generous spacing, minimal elements per section
> - Cinematic, immersive, contemplative feel
>
> Technical requirements:
> - Single self-contained `option-c/index.html`
> - Tailwind CSS via CDN play script with same custom theme config as Options A & B
> - Self-hosted fonts from `../assets/fonts/`
> - Images from `../assets/images/`
> - Vanilla JS for: transparent→solid nav on scroll, mobile nav overlay with sequential fade-in, FAQ accordion, horizontal filmstrip speaker carousel with dots/arrows, speaker bio modal with backdrop blur, staggered scripture reveal on scroll, parallax hero
> - All animations respect `prefers-reduced-motion`
>
> SEO requirements: (identical to Options A & B — see design doc "Shared Foundation" section)
>
> Accessibility requirements: (identical to Options A & B — see design doc "Shared Foundation" section)
> - Additional: speaker modal must trap focus, close on Escape, return focus on close
> - Horizontal filmstrip must be navigable via arrow keys
>
> Sections (in order):
> 1. Nav — fully transparent over hero (white logo + coral outline CTA), transitions to cream with backdrop-blur on scroll. Mobile: full-screen cream overlay, Cormorant links fade in sequentially.
> 2. Hero — full viewport, hero-banner.png darkened/desaturated, "ABIDE" in massive Cormorant (clamp 6rem–12rem) centered in peach with text-shadow glow, "Women in Truth" small uppercase above, date below muted, coral-outline CTA, gentle parallax
> 3. Intro — long gradient transition dark→peach, centered max-w-2xl, tagline in coral, scripture lines fade in individually on scroll (staggered intersection observer)
> 4. Speakers — cream bg, "Meet the Speakers" centered. Horizontal filmstrip: tall 3:4 portrait cards, name overlaid on frosted-glass gradient at bottom. Click opens modal (full bio, large photo, close button). Dots + arrows nav. Mobile: ~85vw cards, swipeable. Desktop: 3 visible.
>    - (same 6 speakers and image files)
> 5. Worship — rose bg, two large side-by-side photos (50% each desktop), stacked mobile, names overlaid on frosted bottom edge, zoom on hover (desktop)
>    - (same 2 worship leaders and image files)
> 6. Schedule — cream bg, vertical timeline (thin coral line) down center, Fri entries left / Sat entries right, coral dots. Mobile: single column, timeline on left edge.
> 7. FAQ — peach bg, accordion with Cormorant headings, coral chevrons, smooth expand with content fade-in
> 8. Final CTA — full viewport, hero image reused darkened, "Are You Ready to Abide?" large peach text, coral-filled button, subtle CSS-only floating particle effect (disabled with prefers-reduced-motion)
> 9. Footer — continuation of dark CTA, cream logo, muted text links

**Step 1: Invoke frontend-design skill with the above context**

**Step 2: Verify in browser at mobile (375px) and desktop (1440px)**

```bash
open option-c/index.html
```

Verify:
- All 9 sections render
- Dark→light→dark color rhythm is visible
- Transparent nav transitions on scroll
- Speaker filmstrip scrolls horizontally, arrow/dot navigation works
- Speaker modal opens, traps focus, closes on Escape
- Scripture lines stagger in on scroll
- Timeline layout correct on desktop and mobile
- Floating particles on CTA (and disabled in reduced-motion)
- All images load, fonts render

**Step 3: Commit**

```bash
git add option-c/index.html
git commit -m "feat: build Option C 'Immersive & Modern' landing page"
```

---

## Task 5: Cross-Option Verification & Polish

**Files:**
- Possibly modify: `option-a/index.html`, `option-b/index.html`, `option-c/index.html`

**Step 1: Visual comparison at 3 viewport sizes**

Open all 3 options and compare at each breakpoint:

```bash
open option-a/index.html option-b/index.html option-c/index.html
```

Check each at:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1440px width

Verify:
- [ ] All 3 use identical colors and fonts
- [ ] All 3 have identical content (speakers, schedule, FAQ answers)
- [ ] No horizontal scroll at any viewport
- [ ] All images load correctly
- [ ] Touch targets >= 44x44px on mobile

**Step 2: Accessibility audit**

For each option, check:
- [ ] Skip-to-content link works
- [ ] Tab through all interactive elements — logical order
- [ ] FAQ accordion: Enter/Space opens, keyboard navigable
- [ ] Mobile nav: opens/closes, focus trapped
- [ ] (Option C) Speaker modal: opens/closes, focus trapped, Escape closes
- [ ] Heading hierarchy: single h1, sequential h2-h3
- [ ] All images have descriptive alt text
- [ ] Color contrast passes (use browser devtools)

**Step 3: Reduced motion check**

In browser devtools, enable `prefers-reduced-motion: reduce` and verify all 3 options:
- [ ] No scroll animations play
- [ ] No parallax
- [ ] No hover zoom effects
- [ ] (Option C) No floating particles
- [ ] Page still looks good without animations

**Step 4: SEO validation**

For each option, inspect page source and verify:
- [ ] JSON-LD Event schema present and valid
- [ ] Open Graph meta tags present (og:title, og:description, og:image, og:url)
- [ ] Twitter Card meta tags present
- [ ] `<title>` tag correct
- [ ] `<meta name="description">` present, 150-160 chars
- [ ] `<link rel="canonical">` present

**Step 5: Fix any issues found in steps 1-4**

**Step 6: Final commit**

```bash
git add -A
git commit -m "fix: polish and verify all 3 options for accessibility, SEO, and responsiveness"
```

---

## Task Dependencies

```
Task 1 (Setup) ──→ Task 2 (Option A) ──→ Task 5 (Verification)
                ──→ Task 3 (Option B) ──→ Task 5
                ──→ Task 4 (Option C) ──→ Task 5
```

Tasks 2, 3, and 4 are **independent** and can be built in parallel after Task 1. Task 5 depends on all three completing.

---

## Notes for Implementer

- **Use `frontend-design` skill** for Tasks 2, 3, and 4. This is a hard requirement.
- Each `index.html` is fully self-contained — no shared CSS files, no build step.
- Tailwind CDN play script config must be identical across all 3 files.
- Speaker bios are placeholder text — use 2-3 sentences describing each speaker's ministry/books/podcast. The client will replace with real bios later.
- FAQ answers are placeholder — use reasonable content for: venue details, parking, nearby hotels, what to bring, refund policy, group discounts, childcare, accessibility accommodations.
- The ticket link (https://www.ticketmaster.com/event/0E00643EBA28A733) should open in a new tab.
- Logo image: `../assets/images/logo.png` — use `class="invert"` or CSS filter when displayed on dark backgrounds (Option B nav, Option C dark sections).
