# Option J Design — Merged Conference Landing Page

## Overview
Option J merges the best elements from Options B, C, D, and E into a single cohesive landing page for the Abide 2026 Women's Conference. Key changes: peach (#fde6d3) background throughout (no white), brand-guide fonts, curved SVG dividers between every section, and new sponsor marquee.

## Brand Guide Compliance
- **Colors:** #ff8d53 (coral), #f0a398 (rose), #fde6d3 (peach), #f26ba4 (hot-pink), #b7ceca (sage), #e0dd90 (yellow-green)
- **Fonts:** Amarego Regular (headings), Soulway (subheadings), Helvetica Bold (body)
- **Elements:** 4-point stars, gradient shapes as decorative accents
- **Background:** #fde6d3 everywhere except scrolled navbar (rgba(250,248,244,0.92))

## Sections

### 1. Navbar (from Option D)
- Fixed, transparent over hero
- Logo left, nav links center/right: Speakers, Worship, Schedule, FAQ
- CTA button: "Buy Tickets" with glass effect
- Scrolled state: cream backdrop blur
- Mobile: hamburger with staggered overlay

### 2. Hero Banner
- Full-viewport, "Women in Truth Abide 2026 Title Graphic Alternate.png"
- object-fit: cover
- Bottom vignette fading to #fde6d3
- Scroll indicator

### 3. Three-Column Intro (inspired by Option B)
- Left: intimate photo placeholder (portrait, rounded, shadow)
- Center: Bible verse with decorative quotes and gradient lines
- Right: event details text
- Animations: slide-in-left, slide-in-right, slide-in-up via IntersectionObserver

### 4. Speakers (Option E cards)
- 8 cards: 6 existing + Brittany Tate + Alexis Brown (placeholder)
- 3/4 aspect ratio, rounded-2xl, frosted glass name bar
- Hover: scale(1.03) + shadow
- Click: bio modal with backdrop blur
- Grid: 4col desktop, 2col tablet, 1col mobile

### 5. Worship
- Leeland + Hope Darst featured cards
- Larger layout than speakers

### 6. Schedule (Two-Column)
- Left: Option C schedule with Friday/Saturday time blocks
- Right: "Add to Calendar" CTA with supporting text

### 7. Sponsor Marquee (NEW)
- Auto-scrolling horizontal marquee
- Chick-fil-A Middle Georgia + Esther Press
- Infinite CSS animation, duplicated for seamless loop

### 8. FAQ
- Accordion expand/collapse
- Brand-colored backgrounds

### 9. Final CTA / Footer
- Warm gradient (coral → hot-pink)
- "Buy Tickets" CTA + event details

### Curved Dividers
- SVG wave paths between every section
- Rose-to-hot-pink gradient
- Creates curvy, fun aesthetic

### Technical
- Tailwind CSS via CDN
- Vanilla JS: IntersectionObserver, hamburger, FAQ accordion, modals
- prefers-reduced-motion support
- Semantic HTML5, ARIA labels, focus management
