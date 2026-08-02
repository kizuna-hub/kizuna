# Current Product State

## Active Founder foundation

The Founder workspace has one canonical, browser-persisted demo aggregate and one selector/action repository. Active surfaces are:

- state-aware Founder entry;
- Home continuity;
- Projects portfolio;
- Venture Overview;
- Venture Context;
- Founder Decision Loop / Current Cycle;
- responsive Founder shell and venture switcher;
- New Project intake;
- AI Pitch and Data Room compatibility outputs.

## Phase 2 behavior

Context supports deterministic mock-source capture, provenance and review state, field-level baseline editing, incomplete-context acknowledgement, and explicit confirmation.

Current Cycle uses a guided Review → Compare → Explore → Plan stepper. It supports human-readable review queues, founder responses and notes, rationale-backed decision selection/defer/reject, competing hypotheses, editable change-my-mind criteria, experiment planning, evidence requirements, cycle tasks, commit, and start. After commitment, Active Cycle replaces the editable workflow and keeps reasoning available read-only.

Overview, Home, and Projects use the same next-action derivation. Home excludes evidence-review and mentor-feedback quick actions. Cycle commitment does not mutate readiness.

The canonical demo aggregate contains five ventures. Call-to-Cash Risk Copilot is the fifth generic scenario and uses the same routes, selectors, repository, workflow UI, persistence, and reset behavior as the established four ventures. Its private founder artifact carries a personal-data detection flag without exposing contact details.

## Phase 2 architecture

The Decision Loop is a role-neutral venture capability under
`features/venture/decision-loop`, split into domain, application,
infrastructure, and presentation layers. Canonical venture identity,
collaboration, and workspace contracts live under
`features/venture/core/domain`.

Application commands and queries operate on one aggregate and are
exposed through an async `DecisionLoopRepository` port. The current
adapter is deterministic in-memory/mock infrastructure. Browser
storage is isolated behind a core infrastructure adapter, while the
Founder provider remains the compatibility composition root for the
existing browser demo.

The localized Context and Cycle route files remain thin and render the
feature's public presentation entry points.

## Persistence

`DemoWorkspaceProvider` stores schema version 2 under `kizuna-founder-demo-workspace-v2`. It can migrate a valid version 1 aggregate, supplements a valid older version 2 aggregate with missing canonical ventures without overwriting saved work, falls back safely on corrupted data, and removes both keys on reset.

## Known repository baseline

- `npm run test:decision-loop` compiles and runs the focused
  characterization, domain, application, adapter, and integration
  suites with Node's built-in test runner;
- the lint script cannot run because the ESLint binary is not installed;
- full TypeScript validation has ten known errors outside the Founder Phase 2 scope;
- the production build is configured to skip type validation.
