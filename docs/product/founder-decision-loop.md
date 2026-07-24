# Founder Decision Loop

## Product contract

Phase 2 turns source-backed venture context into one critical decision and one evidence-seeking action cycle:

```text
Context sources
  -> confirmed venture baseline
  -> Review claims, assumptions, contradictions, and unknowns
  -> Compare up to three decision candidates
  -> Explore competing hypotheses and decision-changing evidence
  -> Plan one focused experiment
  -> committed Active Cycle
```

The loop is venture-scoped, deterministic, founder-controlled, and stored in the canonical Founder workspace state.

## Context and provenance

Every context source records origin, author where available, imported time, freshness, review status, visibility, and AI contribution. Document sources may also record artifact purpose, page count, evidence-strength classifications, and a private personal-data notice. Import does not equal truth. Duplicate titles within a venture are rejected. Excluded, stale/unconfirmed, or cross-venture sources do not qualify as reviewed scan input.

The baseline keeps field-level source identifiers, confidence, review status, and founder confirmation. Its minimum rule is problem, solution, current goal, customer or buyer, and one confirmed source. Optional omissions require acknowledgement.

## Deterministic review

The mock scan calls no external AI service and uses no randomness. A venture scenario plus a baseline version always yields the same:

- facts;
- founder claims;
- assumptions;
- AI inferences;
- contradictions;
- unknowns;
- priority order;
- decision candidates.

Internal priority combines impact, uncertainty, urgency, and controllability, with stable identifier ordering for ties. The founder sees human-readable `critical`, `important`, and `supporting` queues rather than raw scores. Critical findings must be reviewed before decision comparison. A source losing confirmation downgrades dependent analysis to an unknown or AI inference. Founder responses and notes remain canonical and do not rewrite provenance.

## Compare and Explore

The review returns at most three candidates with traceable supporting, contradicting, unknown, and deferred-risk references. Recommendation labels are `Recommended now`, `Useful next`, and `Can wait`. Recommendation is advisory. Every selection persists a founder rationale; selecting a non-recommended candidate is blocked until that rationale exists.

Only one decision may be selected for the active cycle. Selecting another supersedes the previous selection while still in draft. A committed or in-progress cycle prevents silent replacement.

Explore is deliberately broad but derived: it compares genuinely competing hypotheses, including a null hypothesis where the scenario supports one, plus strengths, risks, distinguishing evidence, and editable change-my-mind criteria.

## Plan and Active Cycle

Commit narrows the work to one experiment. A valid plan requires:

- title, falsifiable hypothesis, and observable method;
- expected and failure signals;
- owner;
- a 1–42 day timebox;
- at least one evidence requirement;
- at least one exit criterion;
- at least one explicit “what not to do” scope guard.

Tasks and evidence requirements belong to the experiment and venture. Duplicate tasks are rejected. Commit links the founder rationale, decision, experiment, requirements, tasks, and existing action-cycle pointer. Start changes the cycle from `committed` to `in-progress`.

After commitment, Active Cycle becomes the dominant state. It exposes the next action, task progress, signals, evidence targets, and exit/scope rules. Pre-commit reasoning remains available as a quiet, read-only history.

## Phase boundary

Phase 2 defines evidence requirements but does not collect or review real evidence. It does not capture outcomes, recommend repeat/pivot, or increase readiness. Those transitions belong to Phase 3.

## Continuity

Next action is derived from workflow state:

- context review;
- review ready/in progress;
- decision comparison/selection;
- hypothesis exploration;
- plan draft/commit;
- cycle committed/start;
- cycle in progress/continue.

The same selector feeds Venture Overview, Founder Home, and Projects. Browser persistence uses schema version 2, defensively migrates valid version 1 workspace state, and adds missing canonical demo ventures without overwriting saved venture work.
