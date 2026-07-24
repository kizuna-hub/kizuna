# Phase 1.5 Visual Density Audit

**Repository:** `D:\saves\Startup\Project\kizuna`  
**Branch:** `feat/venture_evidence`  
**Package manager:** npm (`package-lock.json`)  
**Audit date:** 2026-07-24  
**Implementation boundary:** Founder Workspace visual density, shell polish, responsive behavior, and runtime QA only.

## 1. Baseline and ownership

The worktree already contains the uncommitted Phase 1 venture-first foundation, route adapters, intake integration, and documentation. It also contains an existing `.gitignore` change. All pre-existing changes are protected; Phase 1.5 will be layered on top without reset, staging, broad reformatting, or unrelated edits.

Baseline Git results:

| Command | Result |
|---|---|
| `git status --short` | Existing Phase 1 modified/untracked files plus `.gitignore`; recorded before Phase 1.5 source changes. |
| `git branch --show-current` | `feat/venture_evidence` |
| `git diff --stat` | 13 tracked files, 82 insertions, 94 deletions; untracked Phase 1 files are not represented by this stat. |
| `git diff --check` | Passed; only Git line-ending conversion warnings were printed. |

Baseline validation:

| Command | Result |
|---|---|
| `npm run lint` | Failed because the repository has no installed `eslint` binary. |
| `npx tsc --noEmit --incremental false` | Failed with the same 10 known errors in Investor, Mentor, shared sidebar, and paywall files; no Founder Phase 1 errors were reported. |
| `npm test` | Failed because `package.json` has no `test` script. |
| Focused Phase 1 compile + `node --test` | Passed 12/12 canonical repository and route-resolver tests. |
| `npm run build` | Passed; Next.js explicitly skipped type validation. |

## 2. Current shell geometry

`features/founder/shell/founder-shell.tsx` owns both canonical Founder pages and legacy AI Pitch/Data Room layout through the compatibility `WorkspaceLayout`.

Current desktop geometry:

- Sidebar is fixed to the top, bottom, and left viewport edges.
- Sidebar width is `272px`.
- A full-height right border visually divides the viewport.
- Main content is offset by `272px`.
- A sticky `64px` horizontal topbar repeats role and route context.
- Main content uses `max-w-7xl` with up to `32px` horizontal padding.
- There is no outer shell gap or rounded sidebar surface.

This creates an edge-locked enterprise shell rather than the calm floating workspace shown by the supplied density reference.

## 3. Current sidebar behavior

The shell correctly provides:

- route-aware `aria-current`;
- visible selected background, border, text, icon, and left indicator;
- localized links;
- a Radix Sheet mobile drawer;
- project switching with equivalent-route preservation;
- a compact account identity area;
- legacy Outputs compatibility through the same shell.

Density and hierarchy problems:

- navigation items use a minimum height of `44px`;
- the logo header and footer each add separate bordered regions;
- global deferred destinations appear at the same hierarchy as Home and Projects;
- venture placeholders appear with the same prominence as Overview and Current Cycle;
- the project switcher is `56px` minimum height;
- a separate Project status card duplicates status already available in the switcher;
- the account role reads “Founder · Demo workspace,” which is useful but can be rendered more quietly.

## 4. Current topbar ownership

`FounderShell` owns a sticky topbar on every canonical Founder page and every legacy Founder Workspace compatibility route. It renders:

- “Founder workspace” or “Project workspace”;
- the current section label;
- the mobile navigation trigger.

The role/section copy is already represented by active navigation, the project switcher, page title, and route. The topbar should be removed on desktop and replaced on mobile by a compact in-flow navigation row containing only the drawer trigger and concise product/project identity.

## 5. Current typography scale

The global Quiet Conviction typography tokens are mostly compatible with the target:

- body token: `15px`;
- supporting body: `14px`;
- caption: `13px`;
- metadata: `12px`;
- button: `14px`;
- eyebrow: `11px`;
- display-md: `32px`.

Canonical Founder pages currently use:

- page titles: Tailwind `text-3xl` (`30px`);
- decision title: `text-2xl` (`24px`);
- project/card identity: `text-xl` (`20px`);
- section titles: `text-lg` (`18px`);
- routine body copy: often the `15px` body token;
- navigation: `14px`.

The largest issue is not a single title; it is inconsistent use of `30px`, `24px`, `20px`, and the `15px` body token across operational surfaces. Phase 1.5 should introduce workspace-scoped typography compositions:

- page title: `28px / 1.2`, weight 600;
- decision title: `24px / 1.25`, weight 600;
- section title: `18px / 1.3`, weight 600;
- card/project title: `16px / 1.35`, weight 600;
- body: `14px / 1.5`, weight 400;
- supporting text: `13px / 1.5`;
- metadata: `12px / 1.4`;
- eyebrow: `11px / 1.2`, weight 600;
- controls and navigation: `14px`.

These compositions must be scoped to Founder/application workspace surfaces so marketing and unrelated role typography are unchanged.

## 6. Current content-width behavior

All canonical Founder screens inherit one `max-w-7xl` rail. This is too wide for the current information density and produces long lines or unused internal canvas at wide desktop widths.

Required canonical rails:

- wide operational rail: `max-w-6xl` for Home, Projects, Venture Overview, and global previews;
- focused work rail: `max-w-5xl` for Context, Current Cycle, Evidence, Sessions, Outputs, Timeline, and recovery/detail states.

Page gutters should be `16px` mobile, `20px` tablet, and `24px` desktop. Vertical page padding should be approximately `20px`, `24px`, and `28px` respectively.

## 7. Current card spacing and density

The Phase 1 screens generally avoid nested cards, but several surfaces still feel tall:

- standard card padding is commonly `20–28px`;
- section gaps are commonly `24px`, with some large header/action gaps layered inside;
- Projects rows include three large vertical bands and a sentence-length button;
- Venture Overview uses a `28px` decision panel at desktop and a standalone support card;
- placeholder/recovery cards use `28–32px` padding despite limited content;
- intake uses `30px` radii, a large sticky header, a `32px` grid gap, and a `340px` companion rail.

The intended Phase 1.5 rhythm is:

- section gap: `24px`;
- card gap: `12–16px`;
- card padding: `16–20px`;
- compact row padding: `14–16px`;
- control height: `40px` desktop, while preserving a `44px` effective touch target on mobile;
- one level of card containment.

## 8. Current CTA patterns

Projects and Venture Overview render the selector-derived `NextAction.label` as both explanatory copy and the primary button. For Kizuna Hub this produces “Review and commit the buyer-validation cycle” inside the button.

Phase 1.5 will preserve the selector-derived description and destination while mapping action intent to a concise visible button label:

- cycle/context targets: “Continue cycle” or “Add context”;
- evidence: “Review evidence”;
- sessions: “Prepare session”;
- outputs: “View output”;
- default decision target: “Open decision”;
- project secondary destination: “Open overview.”

The full next action remains visible as supporting content, so meaning is not lost and route logic is unchanged.

## 9. Current page findings

### Home

- Exposes implementation language: “Cross-project home” and “without duplicating a project Overview.”
- Correctly limits itself to last-active continuity, sessions, and deadlines.
- Uses three card-sized regions where compact rows and one restrained continuation panel are sufficient.
- Does not currently show an explicit evidence-awaiting-review summary.

### Projects

- Preserves the correct canonical hierarchy.
- Project rows are visually tall because identity, decision, next action, and actions each occupy separate generous bands.
- Search and select are explicitly forced to `44px`.
- Primary CTA repeats the full next-action sentence.
- Secondary action is “Open workspace” rather than the requested “Open overview.”

### Venture Overview

- Preserves the correct decision-first hierarchy.
- Critical decision remains dominant but the panel uses generous padding and separators.
- Support is a separate full card with avatar and multiple stacked regions; it can become a compact strip without losing support provenance or session context.
- Three lower cards have equal geometry and weight.
- No readiness metric grid has been reintroduced.

### Focused sections

- Use the same wide rail as Overview.
- Preview disclosures are honest and routes are functional.
- Headers, notice banners, and simple cards can be tightened.

### Intake and legacy Outputs

- Intake is independent of `FounderShell`, but uses the same design tokens and canonical state.
- Intake has a standalone topbar and larger typography/radii; it should adopt Phase 1.5 workspace typography, controls, and width without changing the four-step workflow.
- Legacy AI Pitch and Data Room already inherit `FounderShell`, so shell changes must preserve their internal runtime behavior and use the focused rail.

## 10. Responsive risks

- Removing the topbar must not remove the only mobile drawer trigger.
- The floating desktop sidebar must begin only at the desktop breakpoint; it must not be forced onto tablet/mobile.
- A `256px` sidebar plus `8px` shell gaps must leave a fluid main region at 1024px.
- Projects metadata/actions need stacking rules that avoid 300px+ rows on tablet and clipping on mobile.
- Venture Overview’s decision/support split must stack before either column becomes cramped.
- Dropdown width must stay within the mobile viewport.
- Intake’s two-column grid and companion rail must collapse cleanly.
- Page titles and secondary actions must wrap without horizontal overflow at 375px and 200% zoom.

## 11. Accessibility risks

- Mobile navigation focus trap and return depend on the existing Radix Sheet and must be preserved.
- The drawer close button must remain visible after removing the topbar.
- Active navigation must retain non-color cues and correct `aria-current`.
- Project rows must not become nested interactive containers.
- A concise CTA must remain understandable from its adjacent next-action label and accessible link context.
- The switcher must preserve keyboard menu operation and an explicit trigger label.
- Desktop 36–40px controls require 44px touch treatment on mobile or adequate surrounding hit area.
- Runtime checks are required for focus order, Escape/return focus, invalid nesting, console warnings, contrast, zoom, and reduced motion.

## 12. Reusable components and styles

Existing primitives to retain:

- `Button`, `Input`, `Badge`, `Progress`;
- Radix `Sheet` and `DropdownMenu`;
- `FounderShell` and `VentureSwitcher`;
- feature-first project screens and canonical state selectors.

Planned shared refinements:

- workspace-scoped typography and density utility classes in `app/globals.css`;
- explicit `wide` and `focused` content-width behavior owned by `FounderShell`;
- a small feature-scoped CTA-label mapper derived from `NextAction.targetPath`, not button copy;
- reusable compact shell/navigation treatments inside the existing shell rather than a parallel sidebar system.

## 13. Proposed file changes

| Path | Planned change |
|---|---|
| `app/globals.css` | Add workspace-scoped typography/density compositions without changing public/marketing defaults. |
| `docs/design/foundations.md` | Record the application-only Phase 1.5 typography, rail, and density rules. |
| `docs/design/workspace-shell.md` | Replace the Founder topbar assumption with the floating-sidebar and mobile-trigger contract. |
| `features/founder/shell/founder-shell.tsx` | Remove redundant desktop topbar, add floating 256px sidebar, compact/group navigation, remove status card, preserve mobile Sheet. |
| `features/founder/shell/venture-switcher.tsx` | Reduce height and metadata density while preserving switching behavior. |
| `features/founder/projects/founder-home-screen.tsx` | Remove architecture copy and use compact continuation/session/deadline/evidence rows. |
| `features/founder/projects/projects-screen.tsx` | Compact rows and filters, shorten CTA labels, rename secondary destination. |
| `features/founder/projects/venture-overview-screen.tsx` | Tighten decision panel, convert support to a strip, differentiate secondary hierarchy. |
| `features/founder/projects/venture-section-screen.tsx` | Use focused rail and compact preview/content geometry. |
| `features/founder/projects/global-placeholder-screen.tsx` | Use compact focused preview treatment. |
| `components/submit-project/index.tsx` | Align intake rail, typography, radii, controls, and CTA copy with workspace density without changing state or workflow. |
| `docs/implementation/phase-1-5-visual-density-audit.md` | Record this audit and later append executed QA evidence if needed. |

No changes are planned to domain entities, seed data, selectors, repository ownership, venture IDs, entry logic, route semantics, persisted state, Mentor/Investor features, dependencies, or lockfiles.

## 14. Visual and runtime QA plan

Required browser routes:

- `/en/founder`;
- `/en/founder/home`;
- `/en/founder/projects`;
- Kizuna Hub and SnapMoney Overview;
- Current Cycle, Evidence, Sessions, Outputs, Timeline;
- `/en/submit-project`;
- invalid venture recovery;
- legacy AI Pitch and Data Room.

Required viewports:

- `1440 × 900`;
- `1024 × 768`;
- `768 × 1024`;
- `375 × 812`.

Runtime interactions:

- open/close the mobile drawer with keyboard and verify focus return;
- navigate primary and deferred groups;
- open the project switcher, switch projects, and confirm equivalent section behavior;
- refresh and verify active project continuity;
- inspect invalid/corrupt persistence recovery;
- create a project through intake and confirm Projects/active/Overview handoff;
- use browser Back and confirm expected context;
- inspect console for hydration, localStorage, controlled-state, duplicate-key, nesting, Radix, route-loop, asset, and runtime errors;
- test 200% zoom, visible focus, `aria-current`, contrast, and reduced-motion behavior.

If no browser-rendered QA can be executed, Phase 1.5 must remain `PARTIALLY_IMPLEMENTED`.

## 15. Executed QA evidence

### Browser availability

The required in-app Browser workflow was initialized and queried after implementation. No browser targets were attached (`[]`). The Browser skill prohibits substituting an unrelated browser-control backend, so no viewport screenshot, live console, keyboard, focus-return, zoom, or reduced-motion claim is recorded.

Phase 1.5 status therefore remains `PARTIALLY_IMPLEMENTED`.

### Runtime HTTP evidence

The final production build was started locally and returned HTTP 200 with expected rendered content for:

- Founder smart entry;
- Home;
- Projects;
- Kizuna Hub Overview;
- SnapMoney Overview;
- Current Cycle;
- CareMind Evidence;
- Sessions;
- Outputs;
- Timeline;
- New Project intake;
- invalid venture recovery;
- legacy AI Pitch;
- legacy Data Room.

This confirms route rendering and server-side composition, but it is not a substitute for browser visual or interaction QA.

### Source accessibility evidence

- Radix Sheet and DropdownMenu primitives remain responsible for focus trapping, Escape behavior, keyboard menus, and focus return.
- The mobile Sheet keeps a visible labeled close action and a visible Menu trigger.
- Active navigation retains `aria-current`, selected background, border, text/icon treatment, and a left indicator.
- Short project CTAs include project-specific `aria-label` values.
- Project rows remain non-clickable articles with sibling links; no interactive container nesting was introduced.
- Focus rings remain visible on navigation, switcher, links, buttons, selects, and intake controls.
- Mobile controls retain 44px targets where the desktop visual height reduces to 40px.

### State and routing evidence

The focused compile-and-test command passed 14/14 tests covering:

- deterministic fresh seed;
- valid/invalid active venture selection;
- last-visited path validation;
- selector-driven next actions and support;
- Projects filters and Overview joins;
- valid persistence restore and corrupt-state recovery;
- reset;
- create-and-activate;
- archive fallback;
- zero/one/many/archived Founder entry;
- equivalent-section switching including legacy Data Room;
- invalid/archived direct venture checks;
- concise CTA mapping without changing target route intent.

Browser Back, real refresh continuity, project switching through the menu, and intake submission through the rendered UI remain browser-QA limitations.

### Final validation

| Command | Final result | Baseline comparison |
|---|---|---|
| `npm run lint` | Failed: `eslint` is not installed. | Same baseline tooling failure. |
| `npx tsc --noEmit --incremental false` | Failed with 10 errors in Investor, Mentor, shared sidebar, and paywall files. | Same 10 baseline errors; no Phase 1.5 error added. |
| `npm test` | Failed: no `test` script. | Same baseline tooling gap. |
| Focused TypeScript compile + `node --test` | Passed 14/14. | Baseline 12/12 plus 2 CTA presentation tests. |
| `npm run build` | Passed; Next.js skipped type validation. | Same build behavior as baseline. |
| `git diff --check` | Passed with line-ending warnings only. | No whitespace regression. |

The required production build regenerated `next-env.d.ts` from the development route-types reference to the production route-types reference. It was not edited manually.
