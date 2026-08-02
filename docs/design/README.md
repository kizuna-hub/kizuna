# Kizuna Design OS

**Direction:** Quiet Conviction  
**Scope:** Kizuna authenticated workspaces and shared application UI  
**Status:** As-built foundation plus workspace adaptation contract

## Purpose

This directory is the canonical design reference for the Kizuna workspace. It carries the approved brand foundation from the landing experience into Founder, Mentor, and Investor application surfaces without copying landing-page composition, conversion behavior, or route assumptions.

The Kizuna landing repository is a read-only reference for shared brand, design-token, typography, interaction, and primitive standards. Workspace code adapts those standards for task completion, permissions, dense information, and long-lived application states.

## One system, three experiences

All roles share:

- Warm near-black surfaces and warm off-white text.
- Kizuna Clay as the primary signal for intent, selection, focus, and progress.
- Geist Sans headings/body/UI text and Geist Mono metadata/code.
- One canonical primitive layer under `components/ui/`.
- The same focus, disabled, loading, reduced-motion, radius, border, and elevation rules.

Roles may differ in information architecture, permissions, density, terminology, and task flow. See [role-based-experience.md](role-based-experience.md).

## Source-of-truth priority

1. Functional behavior and accessibility in the current workspace implementation.
2. `app/globals.css` for canonical CSS and Tailwind v4 tokens.
3. `tailwind.config.ts` for compatibility mappings and non-CSS theme extensions.
4. `components/ui/` for role-neutral primitive APIs.
5. This `docs/design/` directory.
6. Older green/Framer design notes under `.skills/` and `.cursor/rules/` are historical reference only when they conflict with this Design OS.

## Documentation map

| File | Use |
|---|---|
| [foundations.md](foundations.md) | Brand, semantic tokens, typography, spacing, radii, borders, and elevation. |
| [components-and-patterns.md](components-and-patterns.md) | Canonical primitive APIs and interaction rules. |
| [workspace-components.md](workspace-components.md) | Application compositions above primitives. |
| [workspace-shell.md](workspace-shell.md) | Sidebar, topbar, page frame, and shell behavior. |
| [workspace-states.md](workspace-states.md) | Loading, empty, error, disabled, gated, and demo states. |
| [role-based-experience.md](role-based-experience.md) | Founder, Mentor, and Investor experience boundaries. |
| [responsive-and-motion.md](responsive-and-motion.md) | Shared breakpoint and motion principles. |
| [responsive-workspace-behavior.md](responsive-workspace-behavior.md) | Dense application reflow patterns. |
| [routes-and-actions.md](routes-and-actions.md) | Localized route and action integrity contract. |
| [narrative-and-voice.md](narrative-and-voice.md) | Credible product language and role terminology. |
| [visual-qa-baseline.md](visual-qa-baseline.md) | Required visual/runtime review checklist. |
| [landing-to-workspace-migration-audit.md](landing-to-workspace-migration-audit.md) | Migration evidence, mapping, conflicts, and baseline failures. |

## Required reading

| Task | Read first |
|---|---|
| Any UI change | This file and `foundations.md`. |
| Shared primitive change | `components-and-patterns.md`. |
| Workspace page composition | `workspace-components.md` and `workspace-shell.md`. |
| Responsive or animation work | Both responsive documents. |
| User-facing state or gated workflow | `workspace-states.md`. |
| Role flow or terminology | `role-based-experience.md` and `narrative-and-voice.md`. |
| Route, CTA, or navigation change | `routes-and-actions.md`. |
| Completion claim | `visual-qa-baseline.md`. |

## Landing-only exclusions

Do not import landing hero sections, marketing navigation, testimonial/pricing compositions, story shelves, logo clouds, conversion tracking, SEO wrappers, decorative scrollytelling, or public-site CTA limits as workspace components. Their brand primitives may be adapted; their page composition and behavior may not.

## Change discipline

When code intentionally changes a documented design rule, update the canonical document in the same change. Do not create a competing rule in feature code or a role-specific design system.
