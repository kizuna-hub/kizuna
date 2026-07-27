import {
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AiWorkspaceState,
  DecisionCycleStepId,
} from "../../types/ai-workspace.types";
import { StatusBadge } from "../shared/status-badge";

export function DecisionCycleStepContent({
  state,
  copy,
  allTasksComplete,
  reviewing,
  onSelectStep,
  onToggleTask,
  onSubmitEvidence,
  onCompleteReview,
}: {
  state: AiWorkspaceState;
  copy: AiWorkspaceCopy;
  allTasksComplete: boolean;
  reviewing: boolean;
  onSelectStep: (step: DecisionCycleStepId) => void;
  onToggleTask: (taskId: string) => void;
  onSubmitEvidence: () => void;
  onCompleteReview: () => void | Promise<void>;
}) {
  const cycle = state.decisionCycle;

  return (
    <section
      className="rounded-xl border border-workspace-border bg-workspace-panel p-4 sm:p-5"
      aria-label={copy.cycle.steps[cycle.currentStep].label}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
          <ClipboardCheck className="size-4" />
        </span>
        <div>
          <p className="workspace-eyebrow text-primary">
            {copy.cycle.current}
          </p>
          <h3 className="mt-1 workspace-section-title text-ink">
            {copy.cycle.steps[cycle.currentStep].label}
          </h3>
          <p className="mt-1 workspace-supporting text-workspace-muted-text">
            {copy.cycle.steps[cycle.currentStep].description}
          </p>
        </div>
      </div>

      {cycle.currentStep === "understand" ? (
        <div className="mt-5">
          <dl className="space-y-4">
            <div>
              <dt className="workspace-eyebrow text-workspace-muted-text">
                {copy.cycle.goal}
              </dt>
              <dd className="mt-1 workspace-body text-ink">
                {cycle.goal}
              </dd>
            </div>
            <div>
              <dt className="workspace-eyebrow text-workspace-muted-text">
                {copy.response.bottleneck}
              </dt>
              <dd className="mt-1 workspace-body text-ink">
                {state.currentFocus.bottleneck}
              </dd>
            </div>
          </dl>
          <Button
            size="sm"
            className="mt-5"
            onClick={() => onSelectStep("decide")}
          >
            {copy.cycle.continue}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      ) : null}

      {cycle.currentStep === "decide" ? (
        <div className="mt-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="workspace-eyebrow text-workspace-muted-text">
                {copy.cycle.chosenAction}
              </dt>
              <dd className="mt-1 workspace-body text-ink">
                {cycle.chosenAction}
              </dd>
            </div>
            <div>
              <dt className="workspace-eyebrow text-workspace-muted-text">
                {copy.cycle.expectedOutcome}
              </dt>
              <dd className="mt-1 workspace-body text-ink">
                {cycle.expectedOutcome}
              </dd>
            </div>
            <div>
              <dt className="workspace-eyebrow text-workspace-muted-text">
                {copy.cycle.primaryMetric}
              </dt>
              <dd className="mt-1 workspace-body text-ink">
                {cycle.primaryMetric}
              </dd>
            </div>
          </dl>
          <Button
            size="sm"
            className="mt-5"
            onClick={() => onSelectStep("act")}
          >
            {copy.cycle.continue}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      ) : null}

      {cycle.currentStep === "act" ? (
        <div className="mt-5">
          <h4 className="workspace-eyebrow text-workspace-muted-text">
            {copy.cycle.checklist}
          </h4>
          <ul className="mt-2 divide-y divide-workspace-border">
            {cycle.checklist.map((item) => (
              <li key={item.id} className="py-2.5">
                <label className="flex cursor-pointer items-center gap-2.5 workspace-supporting text-ink">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => onToggleTask(item.id)}
                    aria-label={item.label}
                  />
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
          {!allTasksComplete ? (
            <p className="mt-3 workspace-meta text-workspace-muted-text">
              {copy.cycle.completeChecklistHint}
            </p>
          ) : null}
          <Button
            size="sm"
            className="mt-4"
            disabled={!allTasksComplete}
            onClick={() => onSelectStep("evidence")}
          >
            {copy.cycle.continue}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      ) : null}

      {cycle.currentStep === "evidence" ? (
        <div className="mt-5">
          <h4 className="workspace-eyebrow text-workspace-muted-text">
            {copy.cycle.evidence}
          </h4>
          <ul className="mt-2 divide-y divide-workspace-border">
            {cycle.evidence.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 py-2.5"
              >
                <div>
                  <p className="workspace-card-title text-ink">
                    {item.label}
                  </p>
                  <p className="mt-0.5 workspace-meta text-workspace-muted-text">
                    {item.detail}
                  </p>
                </div>
                <StatusBadge
                  status={item.status}
                  copy={copy.statuses}
                />
              </li>
            ))}
          </ul>
          <p className="mt-3 workspace-meta text-workspace-muted-text">
            {copy.cycle.evidenceHint}
          </p>
          <Button
            size="sm"
            className="mt-4"
            onClick={onSubmitEvidence}
          >
            {copy.cycle.submitEvidence}
          </Button>
        </div>
      ) : null}

      {cycle.currentStep === "review" ? (
        <div className="mt-5">
          {cycle.evidenceSubmitted ? (
            <div className="rounded-lg border border-workspace-success/30 bg-workspace-success-soft px-3.5 py-3">
              <p className="workspace-card-title text-workspace-success">
                {copy.cycle.evidenceSubmitted}
              </p>
              <p className="mt-1 workspace-meta text-ink">
                +{state.readiness.delta} ·{" "}
                {state.readiness.currentScore}/100
              </p>
            </div>
          ) : null}
          {cycle.reviewSummary ? (
            <p className="mt-3 workspace-supporting text-ink">
              {cycle.reviewSummary}
            </p>
          ) : null}
          <Button
            size="sm"
            className="mt-4"
            disabled={!cycle.evidenceSubmitted || reviewing}
            onClick={onCompleteReview}
          >
            {reviewing
              ? copy.cycle.reviewing
              : cycle.reviewCompleted
                ? copy.cycle.reviewComplete
                : copy.cycle.requestReview}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

