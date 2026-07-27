"use client";

import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import { canOpenCycleStep } from "../../state/ai-workspace-selectors";
import type {
  AiWorkspaceState,
  DecisionCycleStepId,
} from "../../types/ai-workspace.types";
import { DecisionCycleStepContent } from "./decision-cycle-step-content";

const orderedSteps: DecisionCycleStepId[] = [
  "understand",
  "decide",
  "act",
  "evidence",
  "review",
];

export function DecisionCycleCanvas({
  state,
  copy,
  onBack,
  onSelectStep,
  onToggleTask,
  onSubmitEvidence,
  onCompleteReview,
  reviewing,
}: {
  state: AiWorkspaceState;
  copy: AiWorkspaceCopy;
  onBack: () => void;
  onSelectStep: (step: DecisionCycleStepId) => void;
  onToggleTask: (taskId: string) => void;
  onSubmitEvidence: () => void;
  onCompleteReview: () => void | Promise<void>;
  reviewing: boolean;
}) {
  const cycle = state.decisionCycle;
  const allTasksComplete = cycle.checklist.every(
    (item) => item.completed,
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-1 py-4 sm:px-2">
      <div className="mx-auto w-full max-w-3xl">
        <Button
          size="sm"
          variant="ghost"
          onClick={onBack}
          className="-ml-2 mb-3"
        >
          <ArrowLeft className="size-3.5" />
          {copy.workspace.backToConversation}
        </Button>
        <header className="border-b border-workspace-border pb-4">
          <p className="workspace-eyebrow text-primary">
            {copy.cycle.eyebrow}
          </p>
          <h2 className="mt-1.5 workspace-page-title text-ink">
            {copy.cycle.title}
          </h2>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            {copy.cycle.description}
          </p>
        </header>

        <ol
          className="my-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar"
          aria-label={copy.cycle.eyebrow}
        >
          {orderedSteps.map((step, index) => {
            const isCurrent = cycle.currentStep === step;
            const isCompleted =
              cycle.completedSteps.includes(step);
            const enabled = canOpenCycleStep(state, step);
            const status = isCurrent
              ? copy.cycle.current
              : isCompleted
                ? copy.cycle.completed
                : copy.cycle.locked;

            return (
              <li key={step} className="min-w-[150px] flex-1">
                <button
                  type="button"
                  disabled={!enabled}
                  onClick={() => onSelectStep(step)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
                    isCurrent
                      ? "border-primary-border bg-workspace-selected"
                      : "border-workspace-border bg-workspace-panel hover:bg-workspace-row-hover",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border font-mono text-xs",
                        isCompleted
                          ? "border-workspace-success bg-workspace-success-soft text-workspace-success"
                          : isCurrent
                            ? "border-primary text-primary"
                            : "border-workspace-border text-workspace-muted-text",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="size-3" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="workspace-card-title text-ink">
                      {copy.cycle.steps[step].label}
                    </span>
                  </span>
                  <span className="mt-1.5 block workspace-meta text-workspace-muted-text">
                    {status}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <DecisionCycleStepContent
          state={state}
          copy={copy}
          allTasksComplete={allTasksComplete}
          reviewing={reviewing}
          onSelectStep={onSelectStep}
          onToggleTask={onToggleTask}
          onSubmitEvidence={onSubmitEvidence}
          onCompleteReview={onCompleteReview}
        />
      </div>
    </div>
  );
}
