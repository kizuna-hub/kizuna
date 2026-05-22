# KIZUNA HUB - UI/UX DESIGN SYSTEM & GUIDELINES

This document serves as the absolute source of truth for all UI/UX design decisions, styling, and layout structuring within the Kizuna Hub project. All AI agents MUST strictly adhere to these rules when generating or refactoring frontend code.

## 1. Core Aesthetic & Vibe
- **Style:** Premium SaaS B2B, Minimalist, Bloomberg Terminal mixed with Editorial Spotlight (Unikorn.vn inspired).
- **Core Principle:** Maximize whitespace (negative space), prioritize sharp typography, and use subtle layering instead of heavy shadows.
- **Strict Prohibition:** DO NOT use default Tailwind colors like `emerald`, `green`, or `blue` for primary branding unless specifically instructed. DO NOT build cluttered sidebars for main feed pages.

## 2. Color Palette
The color palette relies on a high-contrast mix of pure white, sophisticated zinc/slate, and a specific custom dark forest green.

### 2.1. Primary Brand Colors
- **Kizuna Primary Dark (Forest Black):** `bg-[#0a1c13]` or `text-[#0a1c13]`. This is the absolute core brand color. Use it for critical emphasis, primary active states, and dominant dark backgrounds.
- **Kizuna Accent (Forest Green):** `bg-[#16452a]` or `text-[#16452a]`. Use for primary CTA buttons, important badges, or secondary emphasis.

### 2.2. Surface & Background Colors (Light Mode Focus)
- **App Background:** `bg-zinc-50` or `#FAFAFA`. Never use pure white for the entire application background.
- **Card/Container Surface:** `bg-white`. Cards must sit on the `zinc-50` background to create natural depth.
- **Borders:** `border-zinc-200` (or `border-slate-200`). Borders must be ultra-thin and subtle. Never use dark gray borders.

### 2.3. Typography Colors
- **Main Headings/Titles:** `text-[#081810]` (A near-black forest tint) or `text-slate-900`. DO NOT use `#000000`.
- **Secondary Text/Descriptions:** `text-slate-500` or `text-zinc-500`.
- **Muted/Meta Text:** `text-zinc-400`.

## 3. Layout & Structure Guidelines

### 3.1. Container Sizing (The "Bóp Thụt" Rule)
- The central content area MUST be constrained to prevent excessive stretching on wide screens.
- **Standard Main Feed Container:** Use `max-w-5xl mx-auto px-6 lg:px-8` for the main wrapper. This ensures generous breathing room on the left and right.
- **Hero/Spotlight Container:** Can occasionally use `max-w-4xl` for highly focused editorial content.

### 3.2. Two-Column Layout (Main Feed Standard)
When building feeds (e.g., `main-feed.tsx`), use an asymmetric CSS Grid layout:
- **Left Column (Main Content):** Takes up the majority of space (`1fr`). Used for timelines, project lists, or editorial logs.
- **Right Column (Widgets):** Fixed width or restricted width (e.g., `320px`). Used for secondary information like Activity Streaks, Reviews, or Top Users.
- **Grid Syntax Example:** `grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]`.

### 3.3. Component Styles
- **Cards:** Rounded generously (`rounded-2xl` or `rounded-xl`), `bg-white`, `border border-zinc-200`, and `shadow-sm`. On hover, slightly increase the shadow and darken the border (`hover:shadow-md hover:border-zinc-300`).
- **CTAs/Buttons:** - Primary: `bg-[#16452a] text-white hover:bg-[#0a1c13] transition-all`.
  - Secondary: `bg-zinc-50 text-slate-700 border border-zinc-200 hover:border-[#16452a] hover:bg-[#16452a]/5`.
- **Badges/Tags:** `rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600`.

## 4. Typography Rules
- **Font Families:** Use the default Tailwind `font-sans` for general UI text. Use `font-serif` strategically for large, impactful headings (e.g., Spotlight titles or Brand names) to create an editorial feel.
- **Data/Metrics:** When displaying specific metrics (e.g., +14.2%, 128 claps, $1.2M), strongly consider using `font-mono` to simulate a Bloomberg Terminal or professional dashboard aesthetic.
- **Line Height & Tracking:** Keep headings tight (`tracking-tight`, `leading-tight` or `leading-snug`). Give descriptions breathing room (`leading-relaxed`).

## 5. Timeline / Editorial Feed (Specific UI Pattern)
When presenting a list of updates or projects (Traction Log), prefer a Timeline structure over boxed cards:
- Use a vertical subtle line (`w-px bg-zinc-200`).
- Left side: Meta information (Date/Time) using uppercase, bold, tracked-out text.
- Center: A small node/dot on the timeline line.
- Right side: The main content block (can be a subtle white card or flat text).

## 6. Iconography
- Use `lucide-react` icons.
- Standard icon size: `w-4 h-4` or `w-5 h-5`.
- Icon colors should generally match the text hierarchy (e.g., `text-zinc-400` for meta icons, `text-[#16452a]` for active/accent icons).

---
**AGENT DIRECTIVE:** Before generating any React component, verify that your proposed classes align with the constraints defined in this document, especially regarding the usage of `max-w-5xl`, `#0a1c13`, `#16452a`, and the `bg-zinc-50`/`bg-white` layering technique.