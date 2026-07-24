# Phase 1 Founder Foundation Audit

**Audit date:** 2026-07-24  
**Status:** Pre-implementation gate complete

## Repository

- Absolute path: `D:\saves\Startup\Project\kizuna`
- Current branch: `feat/readiness_score`
- Package manager: npm, selected from `package-lock.json`
- Framework: localized Next.js 16 App Router with `next-intl`
- Path alias: `@/*` resolves to the repository root

## Baseline Git state

The worktree was clean before Phase 1 implementation:

| Command | Result |
|---|---|
| `git status --short` | No tracked or untracked changes |
| `git branch --show-current` | `feat/readiness_score` |
| `git diff --stat` | Empty |
| `git diff --check` | Passed |

There are no user-owned uncommitted changes to merge around. Generated `.next/` output and installed `node_modules/` remain protected and are not edited manually.

## Governance and architecture

The applicable instructions are:

- `AGENTS.md` and `CLAUDE.md`
- `docs/design/README.md` and the linked design documents
- `docs/architecture/kizuna-feature-first-architecture.md`
- `docs/context/founder-workspace-context-pack.md`
- `docs/srs-v1.md`

The closest active rules require thin localized route files, feature ownership under `features/`, role-neutral primitives under `components/ui/`, semantic tokens from `app/globals.css`, strict TypeScript, accessible interactions, and preservation of Mentor and Investor behavior. Historical forest-green and Framer-blue rules under `.skills/` and `.cursor/rules/` are explicitly superseded by the Quiet Conviction Design OS.

## Validation baseline

| Command | Result |
|---|---|
| `npm run lint` | Failed before implementation: the repository has a lint script but no installed ESLint binary. |
| `.\node_modules\.bin\tsc.cmd --noEmit --incremental false` | Failed before implementation with 10 errors in Investor route/feature props, `components/left-sidebar.tsx`, Mentor metrics props, and `lib/paywall-gate.tsx`. None are in the Phase 1 founder target. |
| `npm test` | Skipped: `package.json` has no test script. |
| `npm run build` | Passed. Next.js compiled all current routes but explicitly skipped type validation because `next.config.mjs` sets `typescript.ignoreBuildErrors`. |

The production build is therefore the only passing baseline product command. Phase 1 will add focused tests without introducing a test framework and will compare final TypeScript output with the exact baseline errors.

## Existing founder routes

| Current URL | Current component/state | Primary job | Classification | Phase 1 destination |
|---|---|---|---|---|
| `/[locale]` | `HomeFeedScreen` -> readiness Launchpad | Generic founder feed | REWRITE | Keep public/root compatibility; authenticated entry becomes `/founder` |
| `/[locale]/auth/login` | `AuthPage` with hardcoded `/founder/founder-workspace/p1` handoff | Demo sign-in | REUSE | Route successful sign-in to state-aware `/founder` |
| `/[locale]/founder/founder-dashboard` | `FounderDashboard` plus legacy dashboard sidebar | Readiness Launchpad | REWRITE | Compatibility entry to state-aware `/founder` |
| `/[locale]/founder/founder-dashboard/products` | `ProductsPage`, static products plus local submissions | Project continuity board | REWRITE | `/founder/projects` |
| `/[locale]/founder/founder-dashboard/discover` | `DiscoverMain`, page-local opportunity data | Mentor/program/resource discovery | DEFER | `/founder/opportunities`, clearly marked later |
| `/[locale]/submit-project` | `SubmitProjectWizard` and legacy workspace upsert | Four-step startup intake | MOVE/REUSE | Reachable from Projects as New Project; write canonical venture state and open new Overview |
| `/[locale]/founder/founder-workspace/[projectId]` | Readiness-heavy `FounderWorkspaceOverviewScreen` | Startup readiness dashboard | REWRITE | Canonical Overview at `/founder/projects/[ventureId]`; old URL remains compatible |
| `/[locale]/founder/founder-workspace/[projectId]/ai-pitch-deck` | `AiPitchDeckScreen`, legacy demo store | Pitch diagnosis/editor | MOVE | Preserve as temporary Outputs compatibility |
| `/[locale]/founder/founder-workspace/[projectId]/data-room` | `DataRoomScreen`, legacy demo store | Demo document vault | MOVE | Preserve as temporary Outputs compatibility |
| `/[locale]/founder/founder-workspace/[projectId]/venture-connect` | `VentureConnectScreen`, readiness-gated mentor request | Mentor matching/request | DEFER | Remove from active navigation; replace with Sessions/support status |
| `/metrics`, `/ip-ledger`, `/stakeholders-studio`, `/cap-table`, `/saas-perks` under the legacy workspace | Separate future-tool screens | Future workspace tools | REMOVE from active navigation | Source and route compatibility retained, not promoted in Phase 1 |
| Mentor routes | Existing Mentor layouts/features | Mentor workflows | KEEP | Deferred; compile unchanged |
| Investor routes | Existing Investor layouts/features | Investor workflows | KEEP | Deferred; compile unchanged |

## Existing global shell

`features/founder/dashboard-sidebar.tsx` is a separate, fixed 260px founder dashboard shell. It uses a full-height legacy green/orange-compatible brand surface, hardcoded colors, the terms Launchpad/My Projects/Submit Project, a gamification block, duplicate account UI, and no mobile navigation implementation on the dashboard pages.

`app/[locale]/founder/founder-dashboard/discover/page.tsx`, `ProductsPage`, and `FounderDashboard` each compose their own page offsets around that sidebar. There is no shared global founder layout.

## Existing project shell

`features/founder/founder-workspace/dashboard/workspace-layout.tsx` provides a second 280px shell with a different sidebar and header. It has a functional mobile overlay, but:

- project names are hardcoded to `p1`, `p2`, and `p3`;
- the switcher does not update shared active-project or last-visited state;
- the sidebar says “Back to products”;
- AI Pitch, Data Room, and Venture Connect are top-level feature navigation;
- five future tools are visible;
- account controls are duplicated between sidebar and topbar;
- unknown ventures are only discovered after the feature screen hydrates.

The shell tokens are mostly reusable, but its information architecture and state ownership require rewrite.

## Existing mock-state ownership

There are three overlapping state systems:

1. `features/founder/founder-workspace/demo-state.ts` owns a rich localStorage-backed readiness workflow under `kizuna-founder-workspace-demo-state-v1` and `kizuna-founder-project-demo-store-v1`.
2. Founder Dashboard and Products manually read that storage, merge it with `myProductsData`, and independently derive active project/readiness/next actions.
3. `lib/context/ProjectContext.tsx` creates a random default project during module evaluation and persists `kizuna_project`, but no current feature consumes the context.

Static `p1`, `p2`, and `p3` all resolve to the same default Kizuna workspace state in the legacy hook. Project names are separately hardcoded in the workspace sidebar. Page-local data also exists in Discover and the old Overview.

This is the main Phase 1 state-duplication risk.

## Legacy screen classification

### KEEP

- Auth routes and form behavior, with only the post-auth destination changed
- Mentor and Investor route implementations
- Shared design primitives and semantic tokens
- Existing AI Pitch and Data Room feature implementations as compatibility outputs

### REUSE

- Submit Project fields and four-step interaction
- `Button`, `Card`, `Badge`, `Progress`, `DropdownMenu`, `Sheet`, `Avatar`, `Input`, `Empty`, `Skeleton`, and `Tooltip`
- Existing localized navigation helpers
- The legacy readiness store behind AI Pitch/Data Room only

### REWRITE

- Founder entry
- Founder global shell and navigation
- Project workspace shell and project switcher
- Projects screen
- Venture Overview
- Active project and next-action derivation

### MOVE

- Submit Project into the Projects/New Project journey without moving its compatibility URL
- AI Pitch and Data Room into the user-facing Outputs concept while preserving current deep links

### DEFER

- Discover as full Opportunities
- Venture Connect matching/request flow
- Programs, Current Cycle authoring, Evidence workflow, Sessions workflow, and Timeline workflow
- Mentor and Investor refactors

### REMOVE

- Launchpad as a duplicate primary founder destination
- Submit Project as persistent navigation
- Future tools from active workspace navigation
- “Back to products” terminology
- Readiness-score-first hierarchy on Projects and Overview

“REMOVE” means removal from active Phase 1 navigation or hierarchy. Existing compiling source is retained unless an isolated adapter becomes obsolete.

## Reusable components

- Role-neutral primitives: `components/ui/button.tsx`, `card.tsx`, `badge.tsx`, `progress.tsx`, `empty.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `avatar.tsx`, `input.tsx`, `skeleton.tsx`, and `tooltip.tsx`
- Layout techniques from the current workspace mobile overlay
- Existing `cn()` helper and localized `Link`, `usePathname`, and `useRouter`
- Submit Project field controls and validation
- Existing legacy workflow state mappers for AI Pitch/Data Room compatibility

No duplicate primitive layer is required.

## Components requiring rewrite

- `features/founder/dashboard-sidebar.tsx`
- `features/founder/founder-workspace/dashboard/workspace-layout.tsx`
- `features/founder/founder-workspace/dashboard/sidebar.tsx`
- `features/founder/founder-workspace/dashboard/header.tsx`
- `features/founder/founder-dashboard/platform/products/index.tsx`
- `features/founder/founder-workspace/overview-screen.tsx`
- founder entry route composition and auth handoff

The old Launchpad and Discover feature source can remain isolated behind compatibility routes or placeholders.

## Routing conflicts

- Login always targets project `p1`.
- Root and `/founder/founder-dashboard` both behave like founder home.
- Products is named “My Projects” and sits under a feature-first dashboard URL.
- No state-aware `/founder` entry resolver exists.
- Valid venture identity is not checked by the shell.
- Project switching ignores the current subroute and last-visited path.
- Invalid legacy static IDs silently share Kizuna state for all supported IDs.
- Legacy future tools contradict the venture-first navigation model.

## State duplication risks

- Static portfolio objects and readiness values are repeated across Products, Launchpad, and workspace sidebar.
- Derived actions are reconstructed from strings rather than selectors.
- The old root Project Context is unused but persists a second project record.
- Local storage parsing is typed with assertions and has no schema/version validation.
- Seed fallback is not a canonical multi-venture seed.
- Legacy workflow state and portfolio state have no explicit adapter boundary.

## Proposed file map

```text
docs/product/
  kizuna-core-thesis.md
  venture-domain-model.md
docs/design/
  workspace-information-architecture.md
docs/implementation/
  phase-1-foundation-audit.md
  phase-1-foundation-contract.md

features/founder/venture-foundation/
  types.ts
  demo-seed.ts
  demo-repository.ts
  demo-workspace-provider.tsx
  route-resolver.ts
  demo-repository.test.ts

features/founder/shell/
  founder-shell.tsx
  founder-sidebar.tsx
  venture-switcher.tsx

features/founder/projects/
  projects-screen.tsx
  venture-overview-screen.tsx
  venture-placeholder-screen.tsx
  founder-entry-screen.tsx

app/[locale]/founder/
  page.tsx
  home/page.tsx
  projects/page.tsx
  projects/[ventureId]/page.tsx
  projects/[ventureId]/{cycle,evidence,sessions,outputs,timeline}/page.tsx
  programs/page.tsx
  opportunities/page.tsx
  library/page.tsx
```

Legacy route files stay thin and either render the canonical screen, render an honest compatibility feature, or redirect to the canonical destination.

## Implementation sequence

1. Write the canonical product thesis, domain model, workspace IA, and Phase 1 contract.
2. Add role-neutral domain types.
3. Add deterministic four-scenario state, pure selectors/actions, safe versioned persistence, and focused tests.
4. Mount one workspace provider and remove the unused root Project Provider.
5. Add the state-aware founder entry and canonical project routes.
6. Implement the unified responsive founder shell and venture switcher.
7. Replace Projects and Overview with venture-first screens.
8. Connect Submit Project to the canonical create action while retaining the legacy workflow adapter.
9. Apply legacy route compatibility and remove contradictory active navigation.
10. Run focused tests, baseline-comparison checks, build, route QA, responsive QA, console review, accessibility checks, and final Git review.

## Validation plan

- Focused pure-state and route-resolver tests using Node’s built-in test runner after TypeScript compilation to a temporary directory; no new framework or dependency.
- `npm run lint`, reported against the missing-ESLint baseline.
- `.\node_modules\.bin\tsc.cmd --noEmit --incremental false`, with exact comparison to the 10 baseline errors.
- `npm run build`.
- `git diff --check`, `git diff --stat`, and focused diff review.
- Runtime inspection of `/en/founder`, `/en/founder/projects`, Kizuna Hub Overview, SnapMoney Overview, invalid venture, project switching, legacy Outputs links, and New Project.
- Responsive review at 375px, 768px, 1024px, and 1440px.
- Keyboard/focus, landmarks, labels, drawer/menu escape behavior, horizontal overflow, hydration, and browser-console review.

