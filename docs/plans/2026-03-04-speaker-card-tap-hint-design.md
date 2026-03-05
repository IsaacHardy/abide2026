# Speaker Card Tap Hint

## Problem
Desktop user testing revealed that speaker cards are not obviously clickable. The existing hover effect (rotate + scale) reads as decorative rather than interactive.

## Solution
Add a "Tap for bio" text label below each speaker's name pill.

### Behavior
- **Desktop:** Hidden by default, fades in on card hover alongside the existing rotate/scale effect
- **Mobile/touch:** Always visible, since there is no hover state to discover

### Styling
- `font-sub font-bold text-xs`, using the card's pill text color at reduced opacity (~0.7)
- No background or pill shape — just floating text
- Small top margin (`mt-1`) below the name pill
- Fade-in transition on hover (desktop)
- Breakpoint: use Tailwind `md:` to distinguish desktop from mobile (hidden by default on md+, visible on smaller screens)

### Implementation
1. Add a `<span>` with "Tap for bio" below each name pill `<div>`
2. Add CSS: hidden + opacity-0 by default on `md:`, opacity-1 on `.speaker-card-wrap:hover`
3. Always visible below `md:` breakpoint
