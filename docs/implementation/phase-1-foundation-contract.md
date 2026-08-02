# Phase 1 Foundation Contract

## Scope

Phase 1 delivers Product Foundation and Venture Entry:

- canonical product thesis and domain;
- deterministic canonical demo workspace state;
- state-aware founder entry;
- canonical Projects and project Overview routes;
- one responsive global/venture shell;
- project switching and last-visited continuity;
- four coherent venture scenarios;
- New Project integration;
- legacy AI Pitch/Data Room compatibility.

## Out of scope

Phase 1 does not deliver context import, source review, challenge scan, action-cycle authoring, experiments, feedback reconciliation, evidence submission/review, outcome review, readiness-delta explanation, Program Mode, opportunity or specialist matching, mentor marketplace, Mentor/Investor refactors, production backend, auth redesign, file/email/calendar/AI services, or analytics expansion.

## Domain ownership

Canonical Phase 1 domain types live in `features/founder/venture-foundation/types.ts`. They are UI-independent and may later move to a cross-role domain package if actual reuse appears.

## State ownership

`DemoWorkspaceProvider` is the single owner of Phase 1 venture identity, active venture, decisions, cycle summaries, support, programs, evidence, feedback, outcomes, readiness deltas, opportunities, activities, and continuity preferences.

Pages use exported selectors and actions. They do not read localStorage, merge seed objects, infer next actions from copy, or mutate seed records.

The existing Founder Workspace readiness store remains an explicitly isolated compatibility store for AI Pitch/Data Room interactions. Intake writes a legacy adapter record only so those preserved routes continue to work. It does not own Phase 1 project identity or routing.

## Route ownership

- `/founder` owns entry resolution.
- `/founder/projects` owns the portfolio.
- `/founder/projects/[ventureId]` owns Overview.
- project subsection routes own honest summaries/placeholders.
- `/submit-project` owns minimum intake.
- old dashboard/workspace paths are compatibility routes, not parallel product IA.

## Acceptance criteria

Phase 1 is accepted when:

- all Phase 1 founder screens read one canonical state;
- four deterministic scenarios exist;
- active venture, decision, action, support, program, and continuity selectors are covered;
- reset and corrupt-persistence recovery are deterministic;
- entry routing handles zero, one, many, invalid, and archived cases;
- project switching updates state and preserves valid equivalent routes;
- Projects is compact and action-led;
- Overview exposes phase, critical decision, rationale, one primary action, and support status above the fold;
- no-support copy does not advertise mentor discovery;
- intake creates and activates a canonical venture and opens its Overview;
- AI Pitch/Data Room and Mentor/Investor routes still compile;
- responsive and accessibility basics pass runtime review;
- validation results distinguish baseline failures from regressions.

## Known limitations

- Persistence is browser-local demo continuity, not production storage.
- Entry resolution occurs after client hydration because browser persistence is client-only.
- Cycle, Evidence, Sessions, Timeline, Programs, Opportunities, and Library are deliberately restrained Phase previews.
- AI Pitch and Data Room retain their legacy workflow model behind the canonical Outputs boundary.
- The repository has no installed ESLint binary or configured test script, and the production build skips type validation at baseline.

