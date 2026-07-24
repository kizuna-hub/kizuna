# Landing-to-Workspace Migration Audit

**Audit date:** 2026-07-22  
**Migration rule:** `kizuna-landing` is read-only; `kizuna` is the only writable repository.

## 1. Source repository path

`D:\saves\Startup\Project\kizuna-landing`

The path resolves to a Git repository. The source branch is `chore/polish_v1` and its baseline working tree is clean.

## 2. Target repository path

`D:\saves\Startup\Project\kizuna`

The path resolves to a separate Git repository. The target branch is `feat/investor-stats`.

## 3. Source files inspected

- Governance: `AGENTS.md`, `CLAUDE.md`.
- Design documentation: every file under `docs/design/` (`README.md`, `foundations.md`, `components-and-patterns.md`, `narrative-and-voice.md`, `responsive-and-motion.md`, `routes-and-cta-contract.md`, and `visual-qa-baseline.md`).
- Styling and configuration: `app/globals.css`, `styles/globals.css`, `tailwind.config.ts`, `postcss.config.mjs`, `package.json`, and `tsconfig.json`.
- Shared implementation: `components/ui/**`, `components/marketing/ui/**`, `lib/utils.ts`, `hooks/use-mobile.ts`, and `hooks/use-toast.ts`.
- Landing-only implementation inventory: `components/landing/**`, `components/marketing/**`, `components/sections/**`, `components/story/**`, `components/ecosystem/**`, `components/pricing/**`, `components/help/**`, `components/about-us/**`, `components/project/**`, and `components/features/**`.
- Asset inventory: `public/**`, including landing story imagery and generic Next/Vercel scaffold assets.

Only existing paths were inspected. The source has no `src/` tree and no alternate Tailwind or PostCSS configuration.

## 4. Target files inspected

- Repository state and configuration: `package.json`, `package-lock.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`, and `styles/globals.css`.
- Existing policy and architecture: `.cursor/rules/frontend-design.md`, `.skills/frontend-architecture.md`, `.skills/ui-guidelines.md`, `.skills/ui-ux-design-system.md`, `.skills/ui-performance-animations.md`, `docs/architecture/kizuna-feature-first-architecture.md`, and `docs/context/founder-workspace-context-pack.md`.
- Shared implementation: `components/ui/**`, `components/theme-provider.tsx`, `lib/**`, and `hooks/**`.
- Role boundaries and shells: `features/founder/**`, `components/mentor/**`, `features/mentor/**`, `components/investor/**`, `features/investor/**`, and their route entries under `app/[locale]/**`.
- Existing product and workflow documentation under `docs/architecture`, `docs/context`, `docs/reports`, `docs/workflow`, and `docs/srs-v1.md`.

The target had no root `AGENTS.md`, no root `CLAUDE.md`, and no pre-existing `docs/design/` directory at baseline.

## 5. Existing target state

The target began with a large user-owned worktree. It contained 122 tracked changes plus untracked documentation, feature modules, and auth routes. Important groups include:

- A feature-first move from `components/founder/**` and `components/auth/**` into `features/founder/**` and `features/auth/**`.
- Modified route adapters under `app/[locale]/**`.
- Modified `app/globals.css`, `tailwind.config.ts`, `package.json`, `package-lock.json`, `components/ui/button.tsx`, and `components/ui/card.tsx`.
- Target-only shared/application primitives: `paywall-gate.tsx`, `role-card.tsx`, `selectable-pill.tsx`, and `upgrade-modal.tsx`.
- Untracked `docs/**` and `features/**` content that belongs to the existing refactor.

These changes are user-owned. They must not be reverted, staged, reformatted wholesale, or replaced with source copies.

Package manager discovery: `package-lock.json` is present, so the target package manager is npm.

## 6. Source design foundations discovered

- Direction: **Quiet Conviction** - warm dark, calm, credible, editorial, and founder-first.
- Core surfaces: canvas `#0B0A09`, surface 1 `#151311`, surface 2 `#1E1B18`, surface 3 `#262320`.
- Text: ink `#F7F5F2`, muted ink `#A39D96`.
- Primary signal: Kizuna Clay `#CC785C`, with explicit hover, active, soft, border, and filled-action values.
- Filled coral actions use white text through `on-primary`.
- Typography: Geist for headings, Inter for body/UI, and Geist Mono for metadata/code.
- Radius, spacing, elevation, z-index, focus, selection, motion, and reduced-motion guidance are documented.
- Tailwind v4 is used through CSS-first `@theme` tokens plus a compatibility `tailwind.config.ts`.
- `styles/globals.css` is explicitly stale and is not the active style entry.
- There is no active light-mode design in the landing foundation.

## 7. Source UI primitives discovered

The source contains 55 files under `components/ui/`, plus six marketing helpers under `components/marketing/ui/`.

Primitive comparison result:

- 51 source UI files are byte-identical to the target equivalents.
- `button.tsx`, `badge.tsx`, `card.tsx`, and `chart.tsx` differ.
- `card.tsx` differs only in formatting.
- The target `chart.tsx` has stricter Recharts typing than the source and must be retained.
- The target `badge.tsx` is the more general application primitive; the source adds hardcoded emerald/orange variants that conflict with semantic-token rules.
- `button.tsx` has the same public variant and size API in both repositories, but the source uses the Kizuna Clay foundation while the target still describes and implements the old Framer blue/white-primary system.

Marketing helpers are not canonical workspace primitives as-is:

- `PrimaryCta`, `SecondaryCta`, and `MarketingSection` are conversion/marketing abstractions.
- `ProductFrame` is a marketing mockup frame.
- `SectionEyebrow` is a landing composition helper.
- `ProofChip` contains potentially reusable status semantics, but should be folded into the target badge/status pattern only when a workspace call site requires it; adding an unused duplicate is rejected.

## 8. Source dependencies discovered

Shared primitives rely on React 19, Radix UI packages, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `cmdk`, `date-fns`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`, `react-hook-form`, and `zod`.

The target already contains equivalents for every dependency used by the approved shared primitives. Versions differ for some packages, notably `lucide-react`, `recharts`, `react-hook-form`, `react-resizable-panels`, `sonner`, and `zod`; the current target versions and target-compatible implementations are preserved. No dependency addition is justified.

No source image or public asset is required by the approved primitive layer.

## 9. Target equivalents discovered

- Canonical global style entry: `app/globals.css`.
- Stale alternate scaffold: `styles/globals.css` (not imported by the locale root layout).
- Canonical primitive root: `components/ui/`.
- Canonical utility: `lib/utils.ts` with `cn()`.
- Canonical global hooks: `hooks/`.
- Routing: localized Next.js App Router under `app/[locale]/`.
- Domain modules: feature-first `features/<role>/**`.
- Founder shared workspace compositions currently live in `features/founder/founder-workspace/workspace-ui.tsx`; they are domain-shared components, not role-neutral primitives.
- Font loading currently uses Inter plus Outfit through `app/[locale]/layout.tsx`.
- A `next-themes` wrapper exists but is not mounted by the root layout; the active application is effectively dark for the migrated Founder surfaces while older Mentor and Investor screens still contain light/forest hardcoded styling.

## 10. File-by-file source-to-target mapping

| Source | Target | Decision |
|---|---|---|
| `docs/design/README.md` | `docs/design/README.md` | Adapt as workspace design entry point. |
| `docs/design/foundations.md` | `docs/design/foundations.md` | Migrate brand values and add workspace semantic mappings. |
| `docs/design/components-and-patterns.md` | `docs/design/components-and-patterns.md` | Adapt to canonical `components/ui` primitives; remove marketing composition as workspace rules. |
| `docs/design/narrative-and-voice.md` | `docs/design/narrative-and-voice.md` | Preserve role promises and credible language; mark public-page structure as landing-only context. |
| `docs/design/responsive-and-motion.md` | `docs/design/responsive-and-motion.md` | Preserve general rules; replace landing section contracts with workspace behavior. |
| `docs/design/routes-and-cta-contract.md` | `docs/design/routes-and-actions.md` | Reimplement for localized workspace routes and action integrity. |
| `docs/design/visual-qa-baseline.md` | `docs/design/visual-qa-baseline.md` | Adapt to Founder, Mentor, and Investor runtime coverage. |
| None | `docs/design/workspace-shell.md` | Create because all three roles have shells with distinct legacy implementations. |
| None | `docs/design/workspace-components.md` | Create because primitives and domain-shared workspace compositions need an explicit boundary. |
| None | `docs/design/workspace-states.md` | Create because loading, empty, error, disabled, and demo states recur across role workflows. |
| None | `docs/design/role-based-experience.md` | Create to preserve role-specific IA while enforcing one visual system. |
| None | `docs/design/responsive-workspace-behavior.md` | Create for sidebar, table, form, and dense application recomposition. |
| `AGENTS.md` | `AGENTS.md` | Create a merged target policy; retain target feature-first rules and exclude landing-only marketing rules. |
| `CLAUDE.md` | `CLAUDE.md` | Create concise target coding-agent context linked to canonical docs. |
| `app/globals.css` | `app/globals.css` | Merge Quiet Conviction tokens and shared utilities into the existing target entry. |
| `tailwind.config.ts` | `tailwind.config.ts` | Merge Kizuna token mappings while preserving target content paths, Tailwind v4, and compatibility names. |
| `components/ui/button.tsx` | `components/ui/button.tsx` | Merge Kizuna focus/link/action styling without removing the target API. |
| Other `components/ui/**` | Existing target equivalents | Keep identical or more-compatible target implementations. |
| `components/marketing/ui/**` | No direct target copy | Landing-only or deferred application reimplementation. |
| `public/**` | No target copy | No approved primitive requires these assets. |

## 11. Components approved for migration

- Existing canonical `components/ui/**` remains the single shared primitive layer.
- `Button`: `MERGE_WITH_EXISTING` because the API matches but visual semantics conflict.
- `Badge`: `REIMPLEMENT_USING_TARGET_PATTERN` only when status variants are needed; keep current target implementation in this slice.
- `Card`: `MERGE_WITH_EXISTING` is already satisfied functionally; no source copy is required.
- `Chart`: `MERGE_WITH_EXISTING` by retaining the stricter target implementation.
- The 51 identical components: `MERGE_WITH_EXISTING`/already synchronized; no file churn.

## 12. Components rejected as landing-specific

- All hero, CTA section, pricing section, testimonial/storytelling, navigation, footer, scrollytelling, ecosystem, story, and decorative landing compositions.
- `MarketingSection`, `PrimaryCta`, `SecondaryCta`, `ProductFrame`, and `SectionEyebrow` as direct copies.
- `ProofChip` as a second badge system; its useful semantics are documented for future integration instead.
- Landing route helpers, SEO wrappers, navigation destinations, marketing analytics assumptions, and story imagery.

## 13. Token conflicts

- Target canvas/surfaces are neutral Framer blacks; source values are warmer Kizuna near-blacks.
- Target primary is a white inverse surface and target `accent-blue` is `#0099FF`; source primary is Kizuna Clay and maps the legacy `accent-blue` name to Clay for compatibility.
- Target on-primary is black; source on-primary is white for coral contrast.
- Target success is saturated green; source success is muted `#78B69A`.
- Target lacks `surface-3` and primary hover/active/soft/border/action tokens.
- Existing target classes use `accent-blue` extensively. Replacing call sites would be high-risk; the compatibility alias will map them to Kizuna Clay centrally.
- Older Mentor/Investor screens use hardcoded forest/light values. They are documented legacy debt and are not mass-rewritten in this foundation migration.

## 14. Tailwind configuration conflicts

- Both repositories use Tailwind CSS 4 with `@tailwindcss/postcss` and an `@config` bridge.
- Content paths and z-index mappings already match and must be preserved.
- The target lacks `surface-3`, primary state mappings, and `primary-action` mappings.
- Typography values differ: source uses slightly heavier/tighter editorial display values than the old Framer target.
- Source shadows use warm off-white/coral values; target shadows use pure white/blue.
- Source and target retain gradient compatibility tokens, but these are legacy and must not define the workspace brand.
- No version change or config-model change is required.

## 15. Dependency conflicts

- The target and source share the same dependency categories but some versions differ.
- The target's existing versions are compatible with its current primitives and production build.
- No package installation, lockfile change, or dependency upgrade is planned.
- `eslint` is declared by the source but not by the target package, and the target `node_modules` has no ESLint binary. This is a baseline validation/tooling gap, not a migration dependency.

## 16. Import alias conflicts

There is no alias conflict. Both repositories map `@/*` to the repository root and provide matching aliases for `app`, `components`, `features`, `hooks`, `lib`, `styles`, and `types`.

The target feature-first policy is authoritative: role/domain modules remain under `features/**`; shared primitives remain under `components/ui/**`.

## 17. Existing user-owned changes

Baseline `git status --short` includes:

- Modified root/config files: `.gitignore`, `.skills/frontend-architecture.md`, `app/globals.css`, `package.json`, `package-lock.json`, `tailwind.config.ts`, and `tsconfig.tsbuildinfo`.
- Modified route adapters across Founder, Mentor, Investor, Auth, Project, Profile Setup, and University Admin routes.
- Deleted historical `components/auth/**` and `components/founder/**` feature files as part of the feature-first move.
- Modified shared/component files including `components/ui/button.tsx`, `components/ui/card.tsx`, project/profile/submit-project files, and a Mentor profile component.
- Untracked `app/[locale]/auth/{forgot-password,reset-password,verify-email}/`, `docs/**`, and `features/**`.

Migration edits must be additive or surgically merged around this state. No existing deletion or move may be reversed.

## 18. Migration risks

- Global token changes intentionally alter the appearance of every class that uses `canvas`, `surface-*`, `ink`, `primary`, `ring`, or `accent-blue`; this is the main regression risk.
- The target has mixed visual systems: Founder is dark/tokenized, while Mentor and Investor still use hardcoded light/forest classes. A foundation migration cannot make all pages visually identical without violating the no-redesign scope.
- Changing the default `Button` appearance could create multiple coral actions in dense application views; preserving API and documenting deliberate primary-action usage is safer than changing role flows.
- The target's large pre-existing worktree makes file attribution and generated-file preservation important.
- Type checking fails before migration, and the production build deliberately skips type validation.
- ESLint cannot run until the target installs/configures an ESLint dependency.
- Source design docs include unlocalized marketing routes and conversion rules that must not be copied into the localized workspace.

## 19. Planned implementation sequence

1. Create this audit before any implementation edit.
2. Create the reconciled `docs/design/` system with landing-only guidance clearly scoped.
3. Create target `AGENTS.md` and `CLAUDE.md`; mark older green/Framer design guidance as historical while preserving architecture rules.
4. Merge warm Kizuna tokens, workspace semantic aliases, typography, focus, selection, and reduced-motion support into `app/globals.css`.
5. Merge the corresponding Tailwind mappings without changing Tailwind version or target scanning paths.
6. Merge the Button styling conflict while preserving its public API and all target-only primitives.
7. Run diff checks, source safety checks, lint/type/build equivalents, and searches for stale paths and legacy source-only patterns.
8. If the application starts, inspect representative Founder, Mentor, and Investor routes without redesigning them.

## 20. Validation plan

### Baseline results

| Command | Baseline result |
|---|---|
| `git status --short` | Pass; large user-owned state recorded. |
| `git branch --show-current` | `feat/investor-stats`. |
| `git diff --stat` | 122 tracked files changed before migration. |
| `npm ls --depth=0` | Completed; installed tree is usable, with one extraneous transitive package reported. |
| `npm run lint` | Failed before migration because `eslint` is not installed in `node_modules`. |
| `.\node_modules\.bin\tsc.cmd --noEmit --incremental false` | Failed before migration with 10 existing errors in Investor props, Mentor metrics props, left-sidebar data typing, and paywall typing. |
| `npm test` | Skipped; no `test` script exists. |
| `npm run build` | Passed; Next.js 16.2.4 compiled all listed routes and explicitly skipped type validation. |
| `npm install` | Skipped; no dependency change is planned and the existing installation builds successfully. |

### Post-change checks

- Re-run lint, direct type check, and production build, comparing failures with the baseline above.
- Run `git diff --check`, `git diff --stat`, and focused diffs for every migration file.
- Search for absolute `kizuna-landing` paths, unresolved internal imports, duplicate primitive names, source-only marketing classes, and stale `#0099FF` token definitions.
- Confirm the source `git status --short` remains identical to its clean baseline.
- Launch the target when possible and inspect representative Founder, Mentor, and Investor routes at desktop and mobile widths, recording console/runtime limitations accurately.
