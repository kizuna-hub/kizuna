# Phase 1.5B Geist Typography Audit

**Repository:** `D:\saves\Startup\Project\kizuna`  
**Branch:** `feat/venture_evidence`  
**Package manager:** npm (`package-lock.json`)  
**Audit date:** 2026-07-24  
**Implementation boundary:** repository-wide font foundation, Founder workspace typography/spacing compaction, Vietnamese glyph coverage, and canonical documentation tracking.

## 1. Audit-first gate

This audit was created before Phase 1.5B runtime source changes.

The worktree already contains uncommitted Phase 1 and Phase 1.5 implementation work plus user-owned changes to `.gitignore`, `AGENTS.md`, and `CLAUDE.md`. Those changes are protected. Phase 1.5B will be layered on top without reset, staging, broad route refactors, dependency changes, or Phase 2 behavior.

Required baseline validation:

| Command | Result |
|---|---|
| `npm run build` | Passed. Next.js 16.2.4 compiled every role and compatibility route; the build explicitly skipped type validation. |
| Focused TypeScript compile + `node --test` | Passed 14/14 canonical repository, route resolver, and concise CTA tests. |

The first focused-test harness invocation used stale assumed output paths and found no files. The corrected harness enumerated the emitted `*.test.js` files and passed all 14 tests. This was a harness-path issue, not a product or test failure.

## 2. Current font ownership

`app/[locale]/layout.tsx` is the only application font-loader owner found by the repository scan.

Current loading:

- `Geist` is loaded into `--font-heading-system`.
- `Inter` is loaded into `--font-body-system`.
- no `Geist_Mono` loader is active;
- both loaders request only the `latin` subset;
- the root `<html>` receives both generated variables;
- `<body>` consumes `font-body`.

Current token mapping:

- `app/globals.css` maps `--font-display` to the heading Geist variable;
- `app/globals.css` maps `--font-body` to the Inter variable;
- `app/globals.css` names Geist Mono only as an unloaded fallback string;
- `tailwind.config.ts` maps `font-body` and `font-sans` to Inter;
- `tailwind.config.ts` retains `inter`, `outfit`, and `geist` convenience aliases;
- the `geist` convenience alias currently points to the mono stack even though most call sites use it for buttons and UI labels.

The installed Next.js 16.2.4 loader types support `latin` and `latin-ext` for both `Geist` and `Geist_Mono`. They do not expose a literal `vietnamese` subset. Phase 1.5B will therefore use the valid `['latin', 'latin-ext']` configuration for Vietnamese diacritics.

## 3. Repository font inventory

The pre-implementation scan excluded `node_modules`, `.next`, `tsconfig.tsbuildinfo`, and `package-lock.json`.

| Reference | Files | Matches | Classification | Action |
|---|---:|---:|---|---|
| `font-inter` | 24 | 148 | REPLACE | Replace with canonical `font-sans`. |
| `font-outfit` | 28 | 113 | REPLACE | Replace with canonical `font-heading`. |
| `font-geist` | 29 | 401 | REPLACE | Replace UI uses with `font-sans`; reserve `font-mono` for actual metadata/code. |
| Root `Inter` loader | 1 | 1 | REMOVE | Replace with `Geist_Mono` and use one Geist Sans foundation. |
| Inter/Outfit Tailwind fallbacks and aliases | 1 | multiple | REMOVE | Remove competing family names and legacy aliases. |
| Inter-specific CSS comments/features | 1 | multiple | REMOVE | Replace with Geist-appropriate foundation language and standard shaping features. |
| `font-sans`, `font-body`, `font-heading`, `font-display` | distributed | multiple | KEEP | Canonical semantic utilities once all point to Geist Sans. |
| `font-mono` | distributed | multiple | KEEP | Canonical Geist Mono utility for code, IDs, timestamps, and tabular evidence. |
| SVG `fontFamily="monospace"` | 1 | 2 | KEEP | Specialized inline SVG fallback; not an Inter dependency. |
| `app/global-error.tsx` system monospace | 1 | 1 | KEEP | Isolated emergency error document that cannot rely on the normal loaded layout. |

Runtime ownership by area:

- Founder legacy dashboard: explicit Inter, Outfit, and misnamed Geist utilities.
- Mentor: explicit Inter, Outfit, and misnamed Geist utilities across dashboard, requests, calendar, intelligence, reputation, ledger, and warm intro surfaces.
- Investor: explicit Inter, Outfit, and misnamed Geist utilities across sourcing, diligence, mentor network, portfolio, pro-rata, deal flow, and warm intro surfaces.
- Shared/pricing/paywall: the same legacy aliases appear in role-neutral compatibility UI.
- Auth/intake/canonical Founder: mainly semantic utilities and inherited root typography; they change through the central loader and token mapping.

## 4. Migration decision

Phase 1.5B will establish:

```text
Geist Sans
  -> body
  -> UI controls
  -> navigation
  -> headings/display

Geist Mono
  -> code
  -> IDs
  -> timestamps
  -> compact metadata where explicitly requested
```

Planned variables:

- `--font-geist-sans`
- `--font-geist-mono`
- `--font-display` -> Geist Sans
- `--font-body` -> Geist Sans
- `--font-mono` -> Geist Mono

Both display and body roles remain semantic aliases so existing primitive APIs do not change. They intentionally share Geist Sans after this migration.

## 5. Current Founder workspace scale

Phase 1.5 introduced an application-scoped scale:

| Role | Current |
|---|---|
| Page title | 28px |
| Critical decision | 24px |
| Section title | 18px |
| Card/project title | 16px |
| Body | 14px |
| Supporting | 13px |
| Metadata | 12px |
| Eyebrow | 11px |

The Phase 1.5B brief requires a second compaction while preserving mobile readability.

Target desktop scale:

| Role | Target |
|---|---|
| Page title | 24px |
| Critical decision | 20px |
| Section title | 16px |
| Card/project title | 14px |
| Body | 13px |
| Supporting | 12px |
| Metadata | 11px |
| Eyebrow | 10px |
| Buttons/navigation/inputs | 13px |
| Project identity | 14px |

Target mobile scale:

| Role | Target |
|---|---|
| Page title | 23px |
| Critical decision | 19px |
| Section title | 16px |
| Card/project title | 14px |
| Body | 14px |
| Supporting | 13px |
| Metadata | 12px |
| Button | 14px |
| Input | 16px minimum to avoid mobile browser zoom |

The implementation will use mobile-first readable sizes and apply the denser values at the desktop breakpoint. This keeps the compaction scoped inside `.workspace-density`.

## 6. Current spacing and control rhythm

Phase 1.5 still uses:

- `space-y-6` for most page stacks;
- `p-4 md:p-5` on primary panels;
- `gap-4` in key action/header groups;
- 40px desktop and 44px mobile controls;
- 256px floating desktop sidebar with a 272px main offset.

Phase 1.5B targets:

- 20px page-region gaps;
- 10–12px card/row gaps;
- 14–16px panel padding;
- 12–14px compact row padding;
- 3–5px title-to-description gaps;
- 4–6px label-to-control gaps;
- 34–36px desktop buttons/navigation;
- 40–44px mobile touch controls;
- 36–40px desktop inputs;
- 248px floating desktop sidebar only if the content remains safe.

The sidebar can safely move from 256px to 248px because labels already truncate, the project switcher is compact, and the desktop main offset can remain an explicit 8px outer inset plus 8px gap. Mobile drawer width and touch targets will not be reduced.

## 7. Page-level findings

### Home

- Header and continuation panel use 24px region spacing.
- The three-column continuity surface uses 16–20px padding.
- Target: 20px region spacing, 14–16px panel padding, 10–12px internal gaps.

### Projects

- Phase 1.5 already shortened CTA labels and reduced row height.
- Remaining density comes from 24px page gaps, generous identity/decision spacing, and 40px desktop controls.
- Target: 20px page gaps, 14px project identity, 13px body/control text, 36–40px desktop controls.

### Venture Overview

- Decision remains intentionally dominant at 24px.
- Support and lower summary panels can retain hierarchy at 20px decision type, 16px section type, and 14–16px padding.

### Focused project sections

- Existing focused rail is correct.
- Header, disclosure, and preview surfaces can move from 24px page rhythm to 20px and reduce internal padding/gaps.

### Intake

- Intake already opts into `.workspace-density`, but legacy token classes such as `text-body-framer-sm` and `text-caption` remain.
- Desktop fields must use the compact rhythm while mobile text inputs remain 16px.
- Workflow, validation, state handoff, and four-step behavior remain unchanged.

### Mentor, Investor, auth, and legacy outputs

- Font family migration is repository-wide.
- Phase 1.5B does not redesign their information architecture or hardcoded legacy palette.
- Typography compaction is scoped to workspace density surfaces; distributed family overrides are normalized without changing route behavior.

## 8. Vietnamese validation plan

Required specimen:

```text
Đà Nẵng · người dùng · bằng chứng · quyết định · khởi nghiệp · cố vấn · tiến độ
```

Validation must cover:

- at least one canonical Founder route;
- at least one shared/auth or cross-role route;
- uppercase/lowercase diacritics;
- headings, body text, controls, and metadata where present;
- no missing-glyph boxes, fallback mismatch, clipping, or line-height collision.

Source-level coverage will verify valid `latin-ext` loading and repository UTF-8 strings. Browser-rendered glyph validation remains mandatory for a full implementation status.

## 9. Documentation tracking audit

The current user-owned `.gitignore` change adds a broad `docs` rule.

Consequences:

- tracked design files remain visible to Git because they are already tracked;
- untracked canonical `docs/product/**` and `docs/implementation/**` files are ignored;
- the Phase 1 and Phase 1.5 implementation records can therefore exist locally without appearing in normal status;
- `docs/reports` is also intentionally ignored by a later rule.

Phase 1.5B will preserve the broad ignore intent while replacing it with parent-aware narrow rules:

```gitignore
docs/*
!docs/design/
!docs/design/**
!docs/product/
!docs/product/**
!docs/implementation/
!docs/implementation/**
```

The existing `docs/reports` ignore remains in place. Final validation will use `git check-ignore -v --no-index` and `git status --short` to prove canonical design, product, and implementation docs are trackable without exposing unrelated documentation.

## 10. Planned files and mechanical replacements

Direct foundation changes:

- `app/[locale]/layout.tsx`
- `app/globals.css`
- `tailwind.config.ts`
- `.gitignore`
- `CLAUDE.md`
- active design and migration documentation

Founder compaction changes:

- `features/founder/shell/founder-shell.tsx`
- `features/founder/shell/venture-switcher.tsx`
- canonical Founder Home, Projects, Overview, and focused-section screens
- `components/submit-project/index.tsx`

Repository-wide mechanical normalization:

- `font-inter` -> `font-sans`
- `font-outfit` -> `font-heading`
- `font-geist` -> `font-sans`

The mechanical pass changes family ownership only. It does not restructure the legacy Mentor/Investor pages or alter their state and interactions.

## 11. Runtime QA plan

Representative routes:

- Founder: Home, Projects, Kizuna Hub Overview, SnapMoney Overview, one focused section, intake, legacy AI Pitch, legacy Data Room.
- Mentor: dashboard or requests.
- Investor: sourcing, deal flow, or portfolio.
- Shared/auth: login or signup.

Widths:

- 375px
- 768px
- 1024px
- 1440px

Checks:

- Geist Sans/Mono variables are present and no Inter request remains;
- Vietnamese specimen renders without fallback or clipping;
- no horizontal overflow;
- desktop sidebar and mobile drawer remain usable;
- 200% zoom preserves controls and headings;
- inputs remain at least 16px on narrow screens;
- keyboard focus, active navigation, drawer Escape/focus return, and reduced motion remain intact;
- no new console or hydration errors.

If the required in-app browser is unavailable, runtime visual evidence cannot be claimed and the final Phase 1.5B status must remain `PARTIALLY_IMPLEMENTED`.

## 12. Implemented font migration

Executed changes:

- replaced the root Inter loader with `Geist_Mono`;
- retained one `Geist` loader as the repository-wide sans family;
- loaded both families with `latin` and `latin-ext`;
- connected `--font-geist-sans` and `--font-geist-mono` at the root `<html>`;
- mapped `font-display`, `font-heading`, `font-body`, and `font-sans` to Geist Sans;
- mapped `font-mono` to loaded Geist Mono;
- removed the Inter, Outfit, and misnamed Geist Tailwind convenience aliases;
- removed Inter-specific OpenType feature settings;
- normalized 148 `font-inter`, 113 `font-outfit`, and 401 `font-geist` utility occurrences across Founder, Mentor, Investor, pricing, paywall, and shared compatibility source.

Final runtime-source search:

```text
PASS: no Inter/Outfit loader, variable, fallback, or legacy family utility remains.
```

The only `next/font` ownership is `app/[locale]/layout.tsx`.

## 13. Implemented typography and spacing

The Founder workspace composition now uses:

- page title: 23px mobile / 24px desktop;
- critical decision: 19px mobile / 20px desktop;
- section title: 16px;
- card and project identity: 14px;
- body: 14px mobile / 13px desktop;
- supporting: 13px mobile / 12px desktop;
- metadata: 12px mobile / 11px desktop;
- eyebrow: 10px;
- controls: 14px mobile / 13px desktop;
- inputs: 16px mobile / 13px desktop.

Home, Projects, Venture Overview, focused project sections, global placeholders, the floating shell, the project switcher, and intake now use the denser 20px page rhythm, 10–12px internal gaps where practical, 14–16px panel padding, 36px desktop controls, and 40–44px mobile targets.

The desktop floating sidebar is 248px wide with the original 8px outer inset and 8px main-region gap. The mobile drawer width and touch behavior are unchanged.

## 14. Vietnamese font evidence

Rendered HTTP/CSS inspection from the local runtime confirmed:

- the root HTML contains generated Geist Sans and Geist Mono variable classes;
- compiled CSS contains `--font-geist-sans` and `--font-geist-mono`;
- compiled CSS contains no Inter family or legacy variable;
- Geist Sans and Geist Mono emit Latin Extended font faces;
- the emitted Geist font face includes the Vietnamese range `U+1EA0-1EF9`;
- the emitted Latin Extended range includes `U+0100-02BA`;
- mobile `.workspace-input-text` compiles to 16px;
- desktop workspace controls compile to 13px.

The required specimen characters are covered by those emitted ranges, including `Đ` (`U+0110`) and Vietnamese precomposed characters in `U+1EA0-1EF9`.

This is strong source/runtime font-file evidence, but it is not a visual glyph inspection. Missing-glyph boxes, fallback appearance, clipping, and line-height collision cannot be marked passed without an attached browser.

## 15. Documentation tracking evidence

The broad user-owned `docs` ignore was replaced with parent-aware exceptions for:

- `docs/design/**`;
- `docs/product/**`;
- `docs/implementation/**`.

`git check-ignore -v` identifies the expected negating rules for product and implementation paths. `git status --short --ignored --untracked-files=all` proves the result:

- canonical design changes are visible as `M`;
- canonical product and implementation documents are visible as `??`;
- `docs/reports/**` remains `!!` ignored.

Unrelated context/workflow documentation remains covered by `docs/*`.

## 16. Executed route evidence

The existing local runtime returned HTTP 200 for:

- `/en/founder/home`;
- `/en/founder/projects`;
- `/en/founder/projects/kizuna-hub`;
- `/en/submit-project`;
- `/vi/auth/login`;
- `/vi/mentor/dashboard`;
- `/vi/investor/sourcing`.

This verifies route rendering and shared root font ownership across Founder, auth, Mentor, and Investor. It does not replace browser visual or interaction QA.

## 17. Browser availability

The required in-app Browser workflow was initialized after implementation. Discovery returned no attached targets (`[]`).

The Browser skill prohibits substituting an unrelated browser-control backend. Therefore no screenshots, computed-font inspection, viewport review, 200% zoom review, keyboard focus-return test, reduced-motion test, or browser-console claim is recorded.

Phase 1.5B remains `PARTIALLY_IMPLEMENTED`.

## 18. Final validation

| Command | Result | Baseline comparison |
|---|---|---|
| Runtime legacy font search | Passed; no Inter/Outfit/legacy family utilities in application source. | Migration-specific new check. |
| `npm run lint` | Failed because `eslint` is not installed. | Same baseline tooling failure. |
| `npx tsc --noEmit --incremental false` | Failed with the same 10 Investor, Mentor, shared-sidebar, and paywall errors. | No new Phase 1.5B error. |
| `npm test` | Failed because `package.json` has no `test` script. | Same baseline tooling gap. |
| Focused TypeScript compile + `node --test` | Passed 14/14. | Same focused suite as the Phase 1.5 baseline. |
| `npm run build` | Passed after the final root-variable correction; Next.js skipped type validation. | Same build behavior as baseline. |
| `git diff --check` | Passed with line-ending warnings only. | No whitespace regression. |

The production build regenerated `next-env.d.ts`. It was not edited manually.
