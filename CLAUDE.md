# Kizuna Workspace Context

Kizuna is a localized Next.js 16 application for Founder, Mentor, and Investor workflows. Preserve existing routes, role permissions, demo-state behavior, and the feature-first architecture while implementing scoped changes.

## Canonical references

- Design entry point: `docs/design/README.md`.
- Tokens: `app/globals.css`.
- Tailwind v4 compatibility mapping: `tailwind.config.ts`.
- Shared primitives: `components/ui/`.
- Architecture: `docs/architecture/kizuna-feature-first-architecture.md`.
- Founder scope/context: `docs/context/founder-workspace-context-pack.md` and `docs/srs-v1.md`.
- Migration baseline and known failures: `docs/design/landing-to-workspace-migration-audit.md`.

The landing repository is read-only brand reference. Import its visual foundation, not its marketing composition, public routes, SEO, copy, or conversion behavior.

## Working rules

1. Read the relevant files and their imports before editing.
2. Keep `app/` thin, business modules in `features/`, and role-neutral primitives in `components/ui/`.
3. Prefer Server Components; introduce client boundaries only for actual interactivity.
4. Use semantic tokens and `cn()`; do not add a new role palette or duplicate primitive.
5. Preserve component APIs, accessibility, focus, disabled/loading behavior, and responsive behavior.
6. Do not alter unrelated role flows, routing, auth, permissions, data contracts, or user-owned work.
7. Update canonical design documentation when intentionally changing a design rule.

## Design summary

Quiet Conviction uses warm dark surfaces (`canvas #0B0A09`), warm ink (`#F7F5F2`), and Kizuna Clay (`#CC785C`) as the primary signal. Filled Clay actions use white text. Geist is the heading face, Inter is the body/UI face, and the primitive layer is shared across all roles.

Older forest-green and Framer-blue guidance is historical where it conflicts with `docs/design/`.

## Validation

Use npm because `package-lock.json` is present. Inspect scripts before running them. Run focused formatting/checks, a direct no-emit TypeScript check when needed, the production build, `git diff --check`, and runtime/visual QA proportional to the change. Report baseline failures separately from new failures.
