> **Historical reference:** Forest-green palette rules in this file are superseded by `docs/design/README.md` and `docs/design/foundations.md`. Preserve useful UI structure guidance only when it does not conflict with the canonical Quiet Conviction tokens.

# KIZUNA HUB - UI/UX DESIGN SYSTEM & GUIDELINES

This document is the ultimate source of truth for all UI/UX design. All AI agents MUST strictly adhere to these rules when generating frontend code.

## 1. Core Aesthetic
- **Vibe:** Premium SaaS B2B, Minimalist, Unikorn.vn mix with Editorial Spotlight.
- **Principle:** Maximize negative space, use sharp typography, and layer colors logically instead of relying on heavy CSS drop-shadows.

## 2. Color Palette (Strictly Enforced)
- **Primary Forest Black:** `bg-[#0a1c13]` or `text-[#0a1c13]`. This is the absolute core brand color. Use it for heavy emphasis, main headings, or primary active states.
- **Accent Forest Green:** `bg-[#16452a]` or `text-[#16452a]`. Use for primary CTA buttons or subtle highlights.
- **Surface & Background:** Use `bg-zinc-50` or `#FAFAFA` for the main app background. Use `bg-white` for cards/containers sitting on top of the background.
- **Borders:** Ultra-thin and subtle. Use `border-zinc-200`. Do not use dark gray borders.
- **Prohibition:** DO NOT use default Tailwind colors like `emerald`, `green`, or `blue` for brand elements.

## 3. Layout & Sizing Constraints
- **Main Container:** The central content area MUST be constrained. Use `max-w-5xl mx-auto px-6 lg:px-8` as the standard wrapper.
- **Asymmetric Grids:** For feeds, use asymmetric columns (e.g., Timeline on the left `1fr`, Widgets on the right `320px`). Example: `grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]`.

## 4. Typography Rules
- **Sans-serif:** Default for all general UI text.
- **Serif:** Use `font-serif` strategically for massive spotlight headings to create an editorial feel.
- **Monospace:** Use `font-mono` exclusively for data points, metrics (e.g., +14.2%, $1.2M), and ticker symbols to mimic a Bloomberg Terminal.

## 5. UI Components
- **Cards:** `rounded-2xl`, `bg-white`, `border border-zinc-200`, `shadow-sm`. Hover state: `hover:shadow-md hover:border-zinc-300`.
- **Primary Buttons:** `bg-[#16452a] text-white hover:bg-[#0a1c13] transition-colors rounded-full`.
