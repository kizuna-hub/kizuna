# Kizuna Workspace Engineering Rules

## Repository role

This repository is the Kizuna application workspace. The sibling `kizuna-landing` repository is a **read-only reference** for shared brand, design-token, typography, interaction, and UI primitive standards.

Adapt those foundations for application UX. Do not copy landing-page sections, marketing layouts, SEO logic, conversion tracking, public navigation, or conversion-specific behavior into Founder, Mentor, or Investor workspaces.

Founder, Mentor, and Investor may differ in information architecture, permissions, terminology, density, and task flow, but they share one visual system and one canonical primitive layer.

## Required context

- Read [docs/design/README.md](docs/design/README.md) and the task-specific design documents before UI work.
- Follow [docs/architecture/kizuna-feature-first-architecture.md](docs/architecture/kizuna-feature-first-architecture.md) for placement and dependency direction.
- For Founder v1 work, preserve the flow and scope in `docs/context/founder-workspace-context-pack.md` and `docs/srs-v1.md`.
- For venture-first Founder work, follow `docs/product/kizuna-core-thesis.md`, `docs/product/venture-domain-model.md`, `docs/design/workspace-information-architecture.md`, and `docs/implementation/phase-1-foundation-contract.md`.
- Current implementation and accessible behavior take precedence over stale design notes.

## Architecture

- `app/` is the localized Next.js App Router and stays thin: routes, layouts, metadata, loading/error boundaries, and composition.
- `features/` owns role/domain behavior and feature-specific UI.
- `components/ui/` is the role-neutral design-system primitive layer.
- `components/` may contain shared non-domain application compositions and existing compatibility components.
- `hooks/`, `lib/`, and `types/` contain global role-neutral utilities only.
- Feature modules may import shared primitives; shared primitives must never import a role feature.
- Preserve Server Component boundaries. Add `"use client"` only for hooks, browser APIs, events, or interactive library requirements.

## UI implementation

- Use semantic tokens from `app/globals.css` and Tailwind mappings; avoid new hardcoded brand colors, arbitrary shadows, and page-named tokens.
- Use `cn()` from `lib/utils.ts` for conditional/merged class names.
- Extend a compatible `components/ui` primitive before adding a duplicate.
- Preserve public component APIs and accessibility behavior where practical.
- Keep visible focus, labels, keyboard behavior, disabled/loading behavior, and reduced-motion support.
- Treat `accent-blue` as a legacy compatibility alias; new code uses `primary`, `ring`, or `workspace-*` tokens.
- Do not create role-specific primitive forks.

## Coding conventions

- TypeScript is strict. Do not add `any`; improve existing `any` only when it is in the task's scope.
- Prefer `@/` imports for cross-folder modules and follow existing local conventions for same-feature relative imports.
- Do not refactor unrelated routes, product flows, auth, authorization, API contracts, models, or backend behavior during UI work.
- Visible actions navigate, change state, open functional UI, submit work, or explain why unavailable. Do not add dead controls.

## Safety and ownership

- Preserve uncommitted and untracked user work. Never use destructive Git commands to discard it.
- Do not edit `.env*`, `node_modules/`, `.next/`, `dist/`, `build/`, `coverage/`, generated output, or secrets.
- Do not edit the `kizuna-landing` repository.
- Do not stage, commit, push, or open a pull request unless explicitly requested.

## Validation

Inspect `package.json` before choosing commands. At minimum, run available lint, type, test, and production-build equivalents plus `git diff --check`.

Current known tooling facts are recorded in `docs/design/landing-to-workspace-migration-audit.md`: the target has no test script, its lint script requires an ESLint binary that may not be installed, and production build currently skips type validation. Never report a skipped or baseline-failing check as passing.

For UI completion, follow `docs/design/visual-qa-baseline.md` and verify representative role routes at mobile and desktop widths when runtime inspection is available.
