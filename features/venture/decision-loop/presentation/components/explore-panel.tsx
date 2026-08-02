"use client";

import React from "react";
import {
  ArrowRight,
  CircleDot,
  Compass,
  FlaskConical,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import type { VentureId } from "../../../core";
import type { DecisionChangeCriterion } from "../../domain";
import {
  getChangeMyMindCriteria,
  getExploreModeViewModel,
  getSelectedCriticalDecision,
  type VentureWorkspaceState,
} from "../../application";

function TextList({
  title,
  items,
  empty,
}: {
  title: string;
  items?: string[];
  empty: string;
}) {
  return (
    <div>
      <p className="workspace-meta font-semibold text-ink">{title}</p>
      {items?.length ? (
        <ul className="mt-1.5 space-y-1 workspace-meta text-workspace-muted-text">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 workspace-meta text-workspace-muted-text">
          {empty}
        </p>
      )}
    </div>
  );
}

export function ExplorePanel({
  state,
  ventureId,
  decisionId,
  onSaveCriteria,
  onContinue,
}: {
  state: VentureWorkspaceState;
  ventureId: VentureId;
  decisionId?: string;
  onSaveCriteria: (
    decisionId: string,
    criteria: DecisionChangeCriterion[],
  ) => Promise<boolean>;
  onContinue: (
    decisionId: string,
    criteria: DecisionChangeCriterion[],
  ) => Promise<boolean>;
}) {
  const selected = getSelectedCriticalDecision(state, ventureId);
  const model = getExploreModeViewModel(
    state,
    ventureId,
    decisionId ?? selected?.id,
  );
  const [criteria, setCriteria] = React.useState<
    DecisionChangeCriterion[]
  >(() =>
    model ? getChangeMyMindCriteria(model.decision) : [],
  );
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (model) {
      setCriteria(getChangeMyMindCriteria(model.decision));
    }
  }, [model?.decision.id, model?.decision.updatedAt]);

  if (!model || !selected || model.decision.id !== selected.id) {
    return (
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <Compass className="size-5 text-workspace-warning" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Choose one decision before exploring
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Explore tests a founder choice against genuinely competing
          explanations and decision-changing evidence.
        </p>
      </section>
    );
  }
  const activeDecisionId = model.decision.id;

  async function save() {
    setBusy(true);
    const ok = await onSaveCriteria(activeDecisionId, criteria);
    setBusy(false);
    return ok;
  }

  async function continueToPlan() {
    setBusy(true);
    const ok = await onContinue(activeDecisionId, criteria);
    setBusy(false);
    return ok;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <p className="workspace-eyebrow text-primary">
          Decision under exploration
        </p>
        <h2 className="mt-2 workspace-decision-title text-ink">
          {model.decision.title}
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          {model.decision.founderRationale}
        </p>
      </section>

      <section aria-labelledby="hypotheses-title">
        <div className="flex items-center gap-2">
          <Compass className="size-5 text-primary" aria-hidden="true" />
          <h2
            id="hypotheses-title"
            className="workspace-section-title text-ink"
          >
            {model.hypotheses.length > 1
              ? "Competing hypotheses"
              : "Working hypothesis"}
          </h2>
        </div>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Compare explanations that could produce different evidence,
          including the possibility that no current segment has enough
          urgency.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {model.hypotheses.map((hypothesis) => (
            <article
              key={hypothesis.id}
              className="rounded-xl border border-workspace-border bg-workspace-panel p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="workspace-body font-semibold text-ink">
                  {hypothesis.title}
                </h3>
                {hypothesis.isNull ? (
                  <Badge variant="outline">Null hypothesis</Badge>
                ) : null}
              </div>
              <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
                {hypothesis.summary}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <TextList
                  title="Strengths"
                  items={
                    hypothesis.strengths?.length
                      ? hypothesis.strengths
                      : hypothesis.assumptions
                  }
                  empty="No strength is recorded."
                />
                <TextList
                  title="Risks and trade-offs"
                  items={
                    hypothesis.risks?.length
                      ? hypothesis.risks
                      : hypothesis.tradeOffs
                  }
                  empty="No risk is recorded."
                />
              </div>
              <div className="mt-3 border-t border-workspace-border pt-3">
                <TextList
                  title="Evidence needed"
                  items={hypothesis.evidenceNeeded}
                  empty="Use the distinguishing-evidence list below."
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <div className="flex items-center gap-2">
          <FlaskConical
            className="size-5 text-primary"
            aria-hidden="true"
          />
          <h2 className="workspace-section-title text-ink">
            Distinguishing evidence
          </h2>
        </div>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Look for evidence that separates the hypotheses instead of
          merely confirming the preferred story.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {(model.decision.distinguishingEvidence ?? []).map(
            (item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg bg-workspace-elevated px-3 py-2.5 workspace-supporting text-ink"
              >
                <CircleDot
                  className="mt-1 size-3 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {item}
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft p-4">
        <h2 className="workspace-section-title text-ink">
          What would change my mind?
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Select and edit the criteria that should remain visible when
          this decision becomes an active cycle.
        </p>
        <div className="mt-3 space-y-2">
          {criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              className="flex items-start gap-2 rounded-lg border border-workspace-warning/20 bg-workspace-panel p-2.5"
            >
              <Checkbox
                className="mt-2"
                checked={criterion.selected}
                aria-label={`Use change-my-mind criterion ${index + 1}`}
                onCheckedChange={(checked) =>
                  setCriteria((current) =>
                    current.map((item) =>
                      item.id === criterion.id
                        ? { ...item, selected: checked === true }
                        : item,
                    ),
                  )
                }
              />
              <Input
                value={criterion.text}
                aria-label={`Change-my-mind criterion ${index + 1}`}
                onChange={(event) =>
                  setCriteria((current) =>
                    current.map((item) =>
                      item.id === criterion.id
                        ? { ...item, text: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              setCriteria((current) => [
                ...current,
                {
                  id: `${model.decision.id}-founder-criterion-${current.length + 1}`,
                  text: "",
                  selected: true,
                  founderCreated: true,
                },
              ])
            }
            disabled={criteria.length >= 8}
          >
            <Plus className="size-4" />
            Add criterion
          </Button>
          <Button
            variant="secondary"
            onClick={save}
            disabled={
              busy ||
              !criteria.some(
                (criterion) =>
                  criterion.selected && criterion.text.trim(),
              )
            }
          >
            Save criteria
          </Button>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          onClick={continueToPlan}
          disabled={
            busy ||
            !criteria.some(
              (criterion) =>
                criterion.selected && criterion.text.trim(),
            )
          }
        >
          Build the experiment plan
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
