> **Historical reference:** Forest-green palette rules in this file are superseded by `docs/design/README.md` and `docs/design/foundations.md`. Preserve useful workspace layout and interaction guidance only when it does not conflict with the canonical Quiet Conviction tokens.

KIZUNA HUB - UI/UX DESIGN SYSTEM & GUIDELINES v2.0
This document serves as the absolute source of truth for all UI/UX design decisions, styling, and layout structuring within the Kizuna Hub project. All AI agents MUST strictly adhere to these rules when generating or refactoring frontend code.

1. Core Aesthetic & Vibe
Style: Premium B2B SaaS, Action-Oriented Dashboard, Strict Minimalist White Bento (Eden.so & Vercel inspired).

Core Principle: High data density but zero clutter. Maximize whitespace, use Asymmetrical Bento Grids, prioritize sharp typography, and use ultra-subtle tinted borders instead of heavy drop shadows or glassmorphism.

The "Dual Layer" Concept: - Global Navigation (Sidebar): Deep dark mode (#081810 or #102c1e).

Project Workspace / Main Canvas: Pure light mode (#fafafa).

STRICT PROHIBITION: - DO NOT use the color ORANGE (#e88b5c or orange-*) unless strictly for tiny warning icons. It is BANNED from general UI.

DO NOT use default Tailwind colors like blue, purple, emerald for branding.

DO NOT use generic gray borders (border-gray-200, border-zinc-200); always use tinted borders (e.g., border-[#102c1e]/10).

2. Strict Color Palette
The color palette relies on a monochromatic high-contrast mix of off-white, sophisticated tinted grays, and the core Kizuna Forest colors.

2.1. Brand & Accent Colors
Kizuna Primary (Forest Black/Deep Green): bg-[#102c1e] or text-[#102c1e]. This is the absolute core brand color. Used for headings, active tabs, primary buttons, and dark sidebars.

Kizuna Highlight (Mint/Light Green): bg-[#a1e2b6] or text-[#a1e2b6]. Used strictly for visual anchors (e.g., "New" badges, Sparkline charts, tiny notification dots). Do not overuse.

2.2. Surface & Background Colors
App Background (Main Canvas): bg-[#fafafa]. Never use pure white for the main app background.

Card/Bento Surface: bg-white or bg-[#fafafa]. Cards must sit on the #fafafa background.

Subtle Fills / Hover States: Use opacity of the primary color: bg-[#102c1e]/5 or bg-[#102c1e]/10.

2.3. Typography Colors
Headings/Main Titles: text-[#102c1e]. NEVER use #000000.

Secondary Text (Body): text-slate-600 or text-slate-700.

Muted/Meta Text (Timestamps, Labels): text-slate-400 or text-[#102c1e]/50.

3. Typography System
Always use the specific fonts assigned to their roles.

Headings & Logos: font-outfit. Use font-black or font-bold for large, impactful section titles and the brand logo. Keep tracking-tight.

UI Elements & Data: font-geist. Use for buttons, badges, navigation items, metrics, numbers, and inputs.

Body Text: font-inter. Use strictly for long-form reading, paragraphs, descriptions, or chat messages. Keep leading-relaxed.

4. Layout & Grid Guidelines

4.1. Main Container & Workspace Structure
- Main Wrapper: `mx-auto flex flex-col max-w-5xl h-full bg-[#fafafa]` (Centered, max-width 5xl, main background `#fafafa`). For wider dashboards, `max-w-5xl` is acceptable.
- Sidebar: Fixed width (`w-[260px]`), sticky left. Main canvas must use `ml-[260px]` offset.
- Header: DO NOT use sticky headers or backdrop-blur tricks in the main workspace. Add standard spacing (`pt-6 pb-4 border-b border-[#102c1e]/10 mb-6`) to create a clear separation. Align header titles/tabs using `flex items-baseline gap-6`.

4.2. Grid Systems (Two Primary Approaches)
- Asymmetrical Bento Grid (Dashboard Analytics): 12-column grid using `grid grid-cols-1 md:grid-cols-12 gap-6`. Mix blocks of `md:col-span-8` and `md:col-span-4` to create interlocking puzzle layouts. 
- Masonry Feed Grid (Discover/Timeline): Use CSS multi-columns to create fluid Pinterest-like feeds: `columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6`. Cards inside MUST have `break-inside-avoid`.

5. UI Component Rules

5.1. The "White Bento" Card (Standard Implementation)
- Base Styling: `bg-white rounded-2xl border border-[#102c1e]/10 shadow-sm hover:shadow-md transition-shadow overflow-hidden group`.
- For Masonry Grids: Add `break-inside-avoid flex flex-col`.
- Internal Spacing: Base padding `p-5`, or `px-5 pb-4`. Footer/metrics sections use `px-5 py-4 border-t border-[#102c1e]/5 bg-[#fafafa]/50`.
- Text & Typography Hierarchy inside Cards:
  - Primary Label/Name: `font-geist text-sm font-bold text-[#102c1e]`.
  - Body Paragraphs: `font-inter text-sm text-slate-700 leading-relaxed` (allow `whitespace-pre-wrap` for feeds).
  - Time/Meta: `font-geist text-xs text-slate-400`.
  - Micro Data (Handles): `font-geist text-[11px] text-slate-500`.

5.2. Search Inputs & Forms
- Standard Large Input: `h-12 w-full rounded-xl border border-[#102c1e]/10 bg-white pl-12 pr-12 text-sm font-geist text-[#102c1e] shadow-sm outline-none placeholder:text-slate-400 transition-all focus:border-[#102c1e]/30 focus:ring-4 focus:ring-[#102c1e]/5`.
- Inner Icons: Position absolute, `text-slate-400 group-focus-within:text-[#102c1e] transition-colors`.

5.3. Filter Pills, Tags, and Visual Anchors
- Active Pill: `bg-[#102c1e] text-[#fafafa] rounded-full px-4 py-1.5 font-geist text-xs font-bold transition-colors shadow-sm whitespace-nowrap`.
- Inactive Pill: `bg-white border border-[#102c1e]/10 text-[#102c1e]/70 hover:border-[#102c1e]/30 hover:text-[#102c1e] rounded-full px-4 py-1.5 font-geist text-xs font-bold transition-colors shadow-sm whitespace-nowrap`.
- Dashed Button (e.g., "Add Filter"): `border border-dashed border-[#102c1e]/30 bg-transparent px-3 py-1.5 font-geist text-xs font-bold text-[#102c1e]/50 hover:border-[#102c1e]/50 hover:text-[#102c1e] rounded-full flex items-center gap-1`.
- Text Visual Anchor (Highlight): `bg-[#a1e2b6]/20 border border-[#a1e2b6]/50 px-2.5 py-1 font-geist text-[10px] font-black text-[#102c1e] rounded-full inline-block`.

5.4. Icon Buttons & Interactions
- General Icon Wrappers: `p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors`.
- Social / Metrics Interaction (Likes, Comments): `flex items-center gap-1.5 text-slate-500 hover:text-[#102c1e] transition-colors group/btn`.
- Fill Transitions: Nested SVGs should creatively use `group-hover/btn:fill-[#102c1e]/10` to fill SVG paths on hover instead of generic background color switches.

6. Advanced SaaS UI Patterns (Implement when required)
Command Palette (Ctrl+K): Always use a dark overlay with a White Bento Modal (bg-[#fafafa]). Focus on keyboard navigation.

Sparklines: For metrics/traction, use minimalist SVG line charts (stroke="#a1e2b6", no axes, no grids) embedded directly into Bento cards.

Agentic Workflows: If building AI configurations, use Infinite Canvas, Dot-grid backgrounds (bg-[#102c1e]/5), and Node-based drag-and-drop UI.

Data Rooms / Tables: Ultra-clean tables. No vertical borders. Horizontal borders must be border-[#102c1e]/5.

CRITICAL AGENT DIRECTIVE: Before generating any React component, verify your code against these rules. If you use text-gray-500, bg-blue-500, border-zinc-200, heavy shadow-lg, or fail to apply font-geist to UI elements, you have FAILED the directive. Stick exclusively to #102c1e, #a1e2b6, #fafafa and their opacity variants.
