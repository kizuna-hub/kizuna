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
4.1. Workspace Structure
Sidebar: Fixed width (w-[260px]), sticky left.

Main Content: MUST use ml-[260px] to offset the sidebar, wrapping the content in a flex container. Add breathing room using p-6 md:p-8 lg:p-10.

Container Sizing: Restrict width using max-w-5xl or max-w-[1200px] mx-auto to prevent excessive stretching.

4.2. Asymmetrical Bento Grid (Standard Dashboard Layout)
Use 12-column grids: grid grid-cols-1 md:grid-cols-12 gap-6.

Mix blocks of different spans (e.g., md:col-span-8 for primary tasks/charts, md:col-span-4 for quick shortcuts or radar).

Avoid stacking full-width sections continuously. Strive for asymmetrical, puzzle-like interlocking blocks.

5. UI Component Rules
5.1. The "White Bento" Card
Styling: rounded-2xl or rounded-3xl, bg-white, border border-[#102c1e]/10, shadow-sm.

Hover States: Slightly increase shadow and border opacity: hover:shadow-md hover:border-[#102c1e]/30 transition-all duration-200.

5.2. Buttons & CTAs
Primary: bg-[#102c1e] text-[#fafafa] font-geist font-bold rounded-xl hover:bg-[#102c1e]/90.

Secondary / Subtle: bg-[#fafafa] text-[#102c1e] font-geist font-bold rounded-xl border border-[#102c1e]/10 hover:bg-[#102c1e]/5.

5.3. Tags & Badges
Style: bg-[#102c1e]/5 text-[#102c1e] border border-[#102c1e]/10.

Typography: font-geist text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md.

5.4. Timelines & Traction Logs
Vertical subtle line: absolute w-px bg-[#102c1e]/10.

Timeline dot: bg-[#102c1e]/20 ring-4 ring-[#fafafa] hover:bg-[#102c1e].

Date labels: Small, uppercase, tracked-out font (text-[11px] font-black font-geist text-slate-400 uppercase tracking-widest).

6. Advanced SaaS UI Patterns (Implement when required)
Command Palette (Ctrl+K): Always use a dark overlay with a White Bento Modal (bg-[#fafafa]). Focus on keyboard navigation.

Sparklines: For metrics/traction, use minimalist SVG line charts (stroke="#a1e2b6", no axes, no grids) embedded directly into Bento cards.

Agentic Workflows: If building AI configurations, use Infinite Canvas, Dot-grid backgrounds (bg-[#102c1e]/5), and Node-based drag-and-drop UI.

Data Rooms / Tables: Ultra-clean tables. No vertical borders. Horizontal borders must be border-[#102c1e]/5.

CRITICAL AGENT DIRECTIVE: Before generating any React component, verify your code against these rules. If you use text-gray-500, bg-blue-500, border-zinc-200, heavy shadow-lg, or fail to apply font-geist to UI elements, you have FAILED the directive. Stick exclusively to #102c1e, #a1e2b6, #fafafa and their opacity variants.