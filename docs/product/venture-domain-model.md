# Canonical Venture Domain Model

## Purpose and ownership

This document defines the Phase 1 foundation and Phase 2 Founder Decision Loop domain shared by Founder product surfaces. Domain types contain no UI imports and use stable identifiers, normalized collections, ISO date strings, and display-label mappers outside the stored entities.

User-facing **Project** maps one-to-one to the domain entity **Venture**.

## Identity

The demo domain uses string aliases for `UserId`, `VentureId`, `SourceId`, `ChallengeScanId`, `ChallengeItemId`, `DecisionId`, `ExperimentId`, `CycleTaskId`, `ActionCycleId`, `EvidenceId`, `SessionId`, `ProgramId`, and `OpportunityId`. Branded identifiers are deferred because the repository does not currently use that convention.

## FounderUser

The founder identity owns active and continuity preferences:

- `activeVentureId`
- `lastVisitedVentureId`
- `lastVisitedPathByVenture`

These values are validated against accessible, non-archived ventures before use.

## Venture

A Venture stores durable identity and current pointers:

- name, slug, description, tags;
- stage and status;
- current phase;
- active decision and action-cycle identifiers;
- optional restrained progress summary;
- support-coverage summary;
- created and updated timestamps.

Stage identifiers are data values such as `idea`, `concept`, `prototype`, `mvp`, `pilot`, `early-users`, and `launched`. Display labels are derived.

Status distinguishes setup, active, paused, and archived ventures. Archived ventures never resolve as active entry targets.

## VentureDecision and NextAction

A decision captures:

- the blocked or open decision;
- why it matters;
- priority and status;
- blockers and what the decision unlocks;
- exactly one state-derived `NextAction`.

`NextAction.targetPath` is stored as a venture-relative section path where practical and is resolved through route helpers. Components do not infer destinations by parsing button copy.

## VentureSource and VentureBaseline

A `VentureSource` records kind, origin, author, safe preview, import time, freshness, review status, visibility, AI contribution, and tags. Optional provenance records artifact purpose, page count, currency, personal-data detection, a private handling notice, and separate product, technical, market, and commercial evidence-strength classifications. A source is never treated as true merely because it was imported. Excluded and unreviewed sources do not qualify as reviewed scan input.

A `VentureBaseline` is the founder-editable, source-traceable summary of problem, customer, buyer, solution, stage, business model, evidence summary, current goal, support, program context, and open assumptions. Every field retains source identifiers, confidence, review status, and founder confirmation. Confirmation versions the baseline. Editing a confirmed baseline marks it for review and supersedes its current scan.

Minimum scan context requires problem, solution, current goal, customer or buyer, and at least one confirmed source. Optional omissions require explicit acknowledgement.

## ChallengeScan and ChallengeItem

The deterministic Challenge Scan is tied to one venture and one baseline version. It classifies supported facts, founder claims, assumptions, AI inferences, contradictions, and unknowns. Each item stores source traceability, impact, uncertainty, urgency, controllability, a deterministic priority score, confidence, founder response, optional human-readable review priority, and optional support/missing-evidence explanations. Raw scores remain an internal ordering mechanism rather than the presentation hierarchy.

AI-generated content cannot become a verified fact. If a seeded analysis loses its confirmed source trace, it is downgraded to an unknown or AI inference. Running a scan twice for the same baseline is idempotent.

## VentureDecision and Explore mode

Phase 2 extends decisions with recommendation rank, why-now rationale, supporting/contradicting/unknown/deferred challenge references, confidence, alternative hypotheses, trade-offs, distinguishing evidence, founder-editable change-my-mind criteria, and a persisted founder selection rationale. At most three candidates are exposed, and exactly one may be selected for an active cycle. A non-recommended choice requires its rationale before selection. A committed cycle prevents silent selection of another decision.

Explore mode is a selector-derived view of those canonical records. It owns no separate state.

## ExperimentPlan, EvidenceRequirement, and CycleTask

An `ExperimentPlan` translates one selected decision into a falsifiable hypothesis, method, expected and failure signals, owner, contributors, optional reviewer, timebox, exit criteria, stop conditions, and explicit scope guards.

An `EvidenceRequirement` is only a target for future collection. Phase 2 does not submit, accept, reject, or review evidence. `CycleTask` provides lightweight, venture-scoped execution planning and rejects duplicate task titles inside an experiment.

## ActionCycle

Phase 2 extends the existing action cycle rather than introducing a competing model. A cycle links its decision, founder rationale, experiment, task identifiers, evidence-requirement identifiers, owner, hypothesis, signals, timebox, optional reviewer, exit criteria, stop conditions, and scope guards.

Phase 2 implements only `draft`, `committed`, and `in-progress`. Later statuses remain type-safe extension points. Committing or starting a cycle never creates evidence, outcomes, or readiness deltas.

## SupportRelationship

A support relationship captures the person, role, source, expertise, status, and optional next session. It supports existing-network, program, competition, warm-introduction, Kizuna, and manual origins.

Support coverage is derived from active relationships plus explicit gaps. A zero-relationship venture reports “No active support relationship”; it does not imply that marketplace discovery is the next action.

## Program and Opportunity

Program is venture-scoped and supports current module, next deliverable, deadline, and an assigned mentor relationship. Opportunity is an extension-ready record with type, status, relevance rationale, and optional deadline.

Phase 1 renders honest placeholders only. Matching logic is out of scope.

## Evidence, Feedback, Outcome, and ReadinessDelta

- Evidence records a claim, source type, status, summary, and collection time.
- Feedback records a support relationship or author, related decision, summary, and optional tension with another feedback item.
- Outcome records the result of a decision/action cycle and a concise learning statement.
- ReadinessDelta records a dimension, change, reason, and evidence references.

These are minimal typed records. The seed contains only evidence or feedback needed to explain an existing scenario; it does not fabricate completed later-phase workflows. Readiness deltas are never inferred from file presence alone.

## Activity

Venture activity is an append-only display summary for Phase 1 continuity. It references a venture, has a semantic type, message, and timestamp. Later event modeling may replace the demo representation without changing page contracts.

## State aggregate

`DemoWorkspaceState` owns:

```text
currentUser
ventures
sources
baselines
challengeScans
challengeItems
decisions
experiments
evidenceRequirements
cycleTasks
actionCycles
supportRelationships
programs
evidence
feedback
outcomes
readinessDeltas
opportunities
activities
uiPreferences
```

Collections are normalized arrays for deterministic serialization and API replacement. Pages consume selectors rather than joining these collections.

## Invariants

1. Active and last-visited ventures must exist and must not be archived.
2. A venture’s active decision/cycle identifier must reference the same venture.
3. The primary next action comes from the active decision, with a restrained workspace fallback.
4. Support summary is derived from active relationships and declared coverage gaps.
5. Archived ventures remain recoverable in state but are excluded from normal Projects and entry routing.
6. Demo seed creation is deterministic and returns fresh objects.
7. Persistence is versioned, parsed defensively, and falls back to the deterministic seed.
8. A Challenge Scan is deterministic for a venture and baseline version.
9. Only confirmed, venture-owned sources qualify as reviewed scan input.
10. One selected critical decision owns one draft or active cycle; committed cycles cannot be replaced silently.
11. Experiment commitment requires an owner, valid timebox, falsifiable plan, evidence requirement, exit criterion, and scope guard.
12. Phase 2 state transitions do not increase evidence readiness.

## Extension boundary

Future APIs may replace the demo repository behind the same selectors/actions. Phase 3 expands evidence submission/review, feedback reconciliation, outcome capture, repeat/pivot decisions, and readiness-delta behavior; Phase 4 expands programs and opportunities. None requires replacing Venture identity or route ownership.
