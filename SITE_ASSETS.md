# ABIDE 2026 - Complete Site Asset Reference

Extracted from: https://livingtruthco.com/pages/abide2026
Page Title: "Women in Truth: Abide 2026"

---

## 1. TYPOGRAPHY

### Font Families

| Role | Font | Weight | Style | Fallback |
|------|------|--------|-------|----------|
| Body | Assistant | 400 (regular), 700 (bold) | normal | sans-serif |
| Headings | Cormorant | 400 (regular) | normal | serif |

### Font Files (saved to `assets/fonts/`)
- `assistant-regular.woff2` / `.woff` (weight 400)
- `assistant-bold.woff2` / `.woff` (weight 700)
- `cormorant-regular.woff2` / `.woff` (weight 400)

### Font-Face Declarations
```css
@font-face {
  font-family: 'Assistant';
  src: url('./assets/fonts/assistant-regular.woff2') format('woff2'),
       url('./assets/fonts/assistant-regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Assistant';
  src: url('./assets/fonts/assistant-bold.woff2') format('woff2'),
       url('./assets/fonts/assistant-bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Cormorant';
  src: url('./assets/fonts/cormorant-regular.woff2') format('woff2'),
       url('./assets/fonts/cormorant-regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
```

### Typography Scale

| Element | Font | Size | Weight | Line Height | Letter Spacing | Color |
|---------|------|------|--------|-------------|----------------|-------|
| Body text | Assistant | 16px (1.0rem scale) | 400 | normal | 0.06rem | rgba(18,18,18, 0.75) |
| H1 (page title) | Cormorant | 40px | 400 | 52px | 0.6px | varies by section |
| H2 (section title large) | Cormorant | 52px | 400 | 67.6px | 0.6px | varies by section |
| H2 (section title small) | Cormorant | 24px | 400 | 31.2px | 0.6px | varies by section |
| H3 (schedule items) | Cormorant | 18px | 400 | 23.4px | 0.6px | varies by section |
| Button text | Assistant | 15px | 400 | normal | 1px | #FEFEFE |
| Nav links | Assistant | 16px | 400 | normal | normal | rgba(14,14,14, 0.75) |

---

## 2. COLOR PALETTE

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Cream / Background | #FAF8F4 | rgb(250, 248, 244) | Main page background, header, footer |
| Peach | #FDE6D3 | rgb(253, 230, 211) | Hero text section, schedule section bg |
| Rose / Pink | #F0A398 | rgb(240, 163, 152) | Speaker lineup section bg |
| Coral / Orange | #FF8D53 | rgb(255, 141, 83) | Worship section bg, CTA buttons |
| Hot Pink (text) | #F26BA4 | rgb(242, 107, 164) | Heading text on peach/rose sections |
| Yellow-Green (text) | #E0DD90 | rgb(224, 221, 144) | Heading text on orange/worship section |
| Near Black | #121212 | rgb(18, 18, 18) | Body text, announcement bar bg |
| Off White | #FEFEFE | rgb(254, 254, 254) | Button text |
| Sage Green | #7F8F86 | rgb(127, 143, 134) | Default button bg |
| Dark charcoal | #0E0E0E | rgb(14, 14, 14) | Footer text |

### Section Color Schemes

| Section | Background | Text Color | Heading Color |
|---------|-----------|------------|---------------|
| Announcement Bar (top) | #121212 (near black) | rgba(255,255,255, 0.75) | - |
| Announcement Bar (ticket) | #FDE6D3 (peach) | rgba(242,107,164, 0.75) | #F26BA4 |
| Header | #FAF8F4 (cream) | rgba(14,14,14, 0.75) | - |
| Hero Banner | Image background | White overlaid text | - |
| Text Section (intro) | #FDE6D3 (peach) | rgba(242,107,164, 0.75) | #F26BA4 |
| Speaker Lineup | #F0A398 (rose) | rgba(242,107,164, 0.75) | #F26BA4 |
| Worship Section | #FF8D53 (coral/orange) | rgba(224,221,144, 0.75) | #E0DD90 |
| Schedule Section | #FDE6D3 (peach) | rgba(242,107,164, 0.75) | #F26BA4 |
| Welcome Banner | Image background | - | - |
| Footer | #FAF8F4 (cream) | rgba(14,14,14, 0.75) | #0E0E0E |

### Background Gradients
- Speaker cards: `linear-gradient(rgba(242, 107, 164, 0.04), rgba(242, 107, 164, 0.04))`
- Worship cards: `linear-gradient(rgba(224, 221, 144, 0.04), rgba(224, 221, 144, 0.04))`

---

## 3. IMAGES (saved to `assets/images/`)

| File | Description | Original Dimensions | Source URL |
|------|-------------|-------------------|-----------|
| `hero-banner.png` | Hero banner "Women in Truth ABIDE 2026" | 3840w | cdn/shop/files/Women_in_Truth_Abide_2026_Hero_Banner.png |
| `logo.png` | Living Truth Collective logo | 600w (displays ~190x69) | cdn/shop/files/Modern_Square_Typographic_Fashion_Brand_Logo_2000_x_2000_px.png |
| `speaker-hosanna-wong.png` | Hosanna Wong headshot | 3200w | cdn/shop/files/Untitled_design_14.png |
| `speaker-chrystal-evans-hurst.jpg` | Chrystal Evans Hurst headshot | 3200w | cdn/shop/files/Chrystal_Evans_Hurst.jpg |
| `speaker-annie-f-downs.jpg` | Annie F. Downs headshot | 3200w | cdn/shop/files/078223ec-8841-4015-9786-ada38750a640.jpg |
| `speaker-courtney-smallbone.jpg` | Courtney Smallbone headshot | 3200w | cdn/shop/files/ffaec74a-559e-48cc-8f6d-32f674a88bb6.jpg |
| `speaker-natalie-runion.jpg` | Natalie Runion headshot | 3200w | cdn/shop/files/Natalie_Runion.jpg |
| `speaker-jess-connolly.jpg` | Jess Connolly headshot | 3200w | cdn/shop/files/Jess_Connolly.jpg |
| `worship-leeland.jpg` | Leeland (worship leader) | 3200w | cdn/shop/files/1_-_Main_Press_Image-2.jpg |
| `worship-hope-darst.jpg` | Hope Darst (worship leader) | 3200w | cdn/shop/files/Hope_Darst_2025_promo_photo1.jpg |
| `welcome-banner.png` | Welcome/closing banner image | 3840w | cdn/shop/files/welcome_7.png |

---

## 4. LAYOUT STRUCTURE

### Page Sections (top to bottom)
1. **Announcement Bar** - "Equipping and Encouraging You to KNOW, EXPERIENCE, SHARE Truth - Collectively"
2. **Social Links Bar** + "ABIDE 2026 EARLY BIRD TICKETS ON SALE NOW" banner
3. **Sticky Header** - Logo + Navigation + Search/Login/Cart
4. **Hero Image Banner** - Full-width "Women in Truth ABIDE 2026" graphic
5. **Rich Text Section** (peach bg) - Event intro, scripture quote, "Buy Tickets" CTA
6. **Multicolumn Section** (rose bg) - "Our Speaker Lineup" - 6-column carousel
7. **Multicolumn Section** (orange bg) - "Worship Led By" - 2-column carousel
8. **Rich Text Section** (peach bg) - "Schedule" with day/time details + "Buy Tickets" CTA
9. **Image Banner** - Welcome/closing image
10. **Footer** - Links, newsletter signup, social, payment icons

### Grid & Spacing
- Page max-width: 120rem (1920px)
- Grid gap (desktop): 8px
- Grid gap (mobile): 4px
- Section spacing: 0px (sections are flush)
- Responsive breakpoint: 750px

### Layout System
```css
body {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-columns: 100%;
}
```

---

## 5. BUTTON STYLES

### Primary CTA ("Buy Tickets")
```css
.button {
  background-color: #FF8D53;        /* coral/orange */
  color: #FEFEFE;                    /* off-white */
  border: none;
  border-radius: 0px;               /* sharp corners */
  padding: 0px 30px;
  font-family: Assistant, sans-serif;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: none;
  line-height: 45px;                 /* implied from height */
}
```

### Default Button
```css
.button--default {
  background-color: #7F8F86;        /* sage green */
  color: #FEFEFE;
  /* same structure as above */
}
```

---

## 6. TEXT CONTENT

### Hero Section
- **Tagline (H2):** "Bring Your People, Let's Abide Together!"
- **Subtitle (H1):** "Join Us For a Two-Day Women's Conference Rooted in God's Truth as We Learn What it Means to Abide in Jesus"
- **Date/Location (H1, bold):** "July 31-August 1 | Macon, GA"
- **Scripture (H2, italic):** "Abide in me, and I in you. As the branch cannot bear fruit by itself, unless it abides in the vine, neither can you, unless you abide in me."
- **Reference (H2, bold):** "John 15:4"
- **CTA:** "Buy Tickets" -> https://www.ticketmaster.com/event/0E00643EBA28A733

### Speaker Lineup
1. Hosanna Wong
2. Chrystal Evans Hurst
3. Annie F. Downs
4. Courtney Smallbone
5. Natalie Runion
6. Jess Connolly

### Worship Leaders
1. Leeland
2. Hope Darst

### Schedule
**Friday, July 31**
- 5:00pm - Doors Open
- 6:00 - Evening Session

**Saturday, August 1**
- 8:00am - Doors Open
- 9:00am - Morning Session
- 12:00pm - Break for Lunch
- 2:00pm - Afternoon session

### Announcement Bar
- "Equipping and Encouraging You to KNOW, EXPERIENCE, SHARE Truth - Collectively"
- "ABIDE 2026 EARLY BIRD TICKETS ON SALE NOW"

---

## 7. NAVIGATION STRUCTURE

### Main Nav
- HOME (/)
- ABIDE 2026 (/pages/abide2026)
- SHOP BY COLLECTION (dropdown)
- AT THE TABLE (dropdown)
- OUR STORY (/pages/y-our-story)
- Y(OUR) STORY (blogs) (/blogs/news)
- BECOME A BRAND AMBASSADOR (/pages/become-a-brand-ambassador)
- WHOLESALE (/pages/wholesale)
- CONTACT US (/pages/contact-us)
- EVENTS (/pages/events)
- GIVE (/pages/support-living-truth-collective)

### Footer Links
- CONTACT US
- OUR STORY
- SHIPPING & RETURNS
- TELL US {Y}OUR STORY
- WHOLESALE
- STAY CONNECTED
- PRIVACY POLICY

### Social Links
- Facebook: https://m.facebook.com/Livingtruthjewelry/
- Instagram: https://www.instagram.com/livingtruthcollective/

---

## 8. CSS CUSTOM PROPERTIES (key variables)

```css
:root {
  /* Typography */
  --font-body-family: Assistant, sans-serif;
  --font-body-style: normal;
  --font-body-weight: 400;
  --font-body-weight-bold: 700;
  --font-heading-family: Cormorant, serif;
  --font-heading-style: normal;
  --font-heading-weight: 400;
  --font-body-scale: 1.0;
  --font-heading-scale: 1.0;

  /* Layout */
  --page-width: 120rem;
  --page-width-margin: 0rem;
  --grid-desktop-vertical-spacing: 8px;
  --grid-desktop-horizontal-spacing: 8px;
  --grid-mobile-vertical-spacing: 4px;
  --grid-mobile-horizontal-spacing: 4px;
  --spacing-sections-desktop: 0px;
  --spacing-sections-mobile: 0px;

  /* Borders & Radius */
  --buttons-radius: 0px;
  --inputs-radius: 0px;
  --media-radius: 0px;
  --buttons-border-width: 1px;

  /* Shadows (all disabled) */
  --media-shadow-opacity: 0.0;
  --buttons-shadow-opacity: 0.0;

  /* Animation Durations */
  --duration-short: .1s;
  --duration-default: .2s;
  --duration-medium: .3s;
  --duration-long: .5s;
  --duration-extra-long: .6s;
  --duration-extended: 3s;
  --ease-out-slow: cubic-bezier(0, 0, .3, 1);
  --animation-slide-in: slideIn var(--duration-extra-long) var(--ease-out-slow) forwards;
  --animation-fade-in: fadeIn var(--duration-extra-long) var(--ease-out-slow);
}
```

---

## 9. ANIMATIONS & TRANSITIONS

- **Scroll trigger animations** on multicolumn sections (class: `scroll-trigger animate--slide-in`)
- **Slide-in keyframes:** `slideIn` with `--duration-extra-long` (0.6s) and `ease-out-slow`
- **Fade-in keyframes:** `fadeIn` with same duration/easing
- **Announcement bar transition:** 0.25s duration
- **Carousel:** Speaker lineup (6 items) and Worship (2 items) use horizontal scroll/carousel

---

## 10. RESPONSIVE DESIGN

- **Breakpoint:** 750px
- **Mobile:** Single-column layout, 4px grid gap, smaller font sizes
- **Desktop:** Multi-column layouts (6-col speakers, 2-col worship), 8px grid gap
- **Header:** Sticky positioning, collapses to hamburger on mobile

---

## 11. PLATFORM INFO

- **Platform:** Shopify (Dawn theme v12.0.0)
- **Ticket Link:** https://www.ticketmaster.com/event/0E00643EBA28A733
- **Shop domain:** living-truth-designs.myshopify.com
- **Public domain:** livingtruthco.com
