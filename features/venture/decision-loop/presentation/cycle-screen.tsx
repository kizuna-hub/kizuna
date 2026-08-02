"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { getVentureById } from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { useDemoDecisionLoopRepository } from "@/features/founder/venture-foundation/use-demo-decision-loop-repository";
import { Link, usePathname } from "@/i18n/routing";

import type { VentureId } from "../../core";
import type {
  ChallengeFounderResponse,
  DecisionChangeCriterion,
} from "../domain";
import {
  getActiveActionCycle,
  getDraftExperiment,
  getReviewSummary,
  getSelectedCriticalDecision,
  type DecisionLoopOperationResult,
} from "../application";
import { ActiveCycleSummary } from "./active-cycle/active-cycle-summary";
import { ReasoningHistory } from "./active-cycle/reasoning-history";
import { ChallengePanel } from "./components/challenge-panel";
import { CommitPanel } from "./components/commit-panel";
import { DecisionPanel } from "./components/decision-panel";
import { ExplorePanel } from "./components/explore-panel";
import { UnavailableProject } from "./components/unavailable-project";
import { ContextProvenanceStrip } from "./workflow/context-provenance-strip";
import {
  DecisionLoopStepper,
  type DecisionLoopStep,
  type DecisionLoopStepId,
} from "./workflow/decision-loop-stepper";

function getCurrentStep(
  state: ReturnType<typeof useDemoWorkspace>["state"],
  ventureId: VentureId,
): DecisionLoopStepId {
  const review = getReviewSummary(state, ventureId);
  const selected = getSelectedCriticalDecision(state, ventureId);
  const draft = getDraftExperiment(state, ventureId);
  if (!review.criticalReviewComplete) return "review";
  if (!selected) return "compare";
  if (!draft) return "explore";
  return "plan";
}

export function CycleScreen({
  ventureId,
}: {
  ventureId: VentureId;
}) {
  const pathname = usePathname();
  const decisionLoopRepository =
    useDemoDecisionLoopRepository();
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const venture = getVentureById(state, ventureId);
  const activeCycle = getActiveActionCycle(state, ventureId);
  const selected = getSelectedCriticalDecision(state, ventureId);
  const draft = selected
    ? getDraftExperiment(state, ventureId)
    : undefined;
  const review = getReviewSummary(state, ventureId);
  const hasActiveCycle =
    activeCycle?.status === "committed" ||
    activeCycle?.status === "in-progress";
  const [step, setStep] = React.useState<DecisionLoopStepId>(() =>
    getCurrentStep(state, ventureId),
  );
  const [message, setMessage] = React.useState("");
  const [showReasoning, setShowReasoning] = React.useState(false);

  React.useEffect(() => {
    if (!venture || venture.status === "archived") return;
    setActiveVenture(venture.id);
    setLastVisitedVenturePath(venture.id, pathname);
  }, [
    pathname,
    setActiveVenture,
    setLastVisitedVenturePath,
    venture?.id,
    venture?.status,
  ]);

  React.useEffect(() => {
    if (hasActiveCycle) return;
    const current = getCurrentStep(state, ventureId);
    const allowed =
      step === "review" ||
      (step === "compare" && review.criticalReviewComplete) ||
      (step === "explore" && Boolean(selected)) ||
      (step === "plan" && Boolean(draft));
    if (!allowed) setStep(current);
  }, [
    draft,
    hasActiveCycle,
    review.criticalReviewComplete,
    selected,
    state,
    step,
    ventureId,
  ]);

  if (!venture || venture.status === "archived") {
    return <UnavailableProject />;
  }

  async function run(
    operation: Promise<DecisionLoopOperationResult>,
    successMessage: string,
  ) {
    try {
      const result = await operation;
      setMessage(
        result.ok ? successMessage : result.errors.join(" "),
      );
      return result.ok;
    } catch {
      setMessage("The Decision Loop is temporarily unavailable.");
      return false;
    }
  }

  async function chooseDecision(
    decisionId: string,
    rationale: string,
  ) {
    const rationaleSaved = await run(
      decisionLoopRepository.saveFounderDecisionRationale(
        ventureId,
        decisionId,
        rationale,
      ),
      "Founder rationale saved.",
    );
    if (!rationaleSaved) return false;
    const selectedSuccessfully = await run(
      decisionLoopRepository.selectCriticalDecision(
        ventureId,
        decisionId,
      ),
      "Decision selected. Test it against competing hypotheses.",
    );
    if (selectedSuccessfully) setStep("explore");
    return selectedSuccessfully;
  }

  async function saveChangeCriteria(
    decisionId: string,
    criteria: DecisionChangeCriterion[],
  ) {
    return run(
      decisionLoopRepository.updateDecisionChangeCriteria(
        ventureId,
        decisionId,
        criteria,
      ),
      "Change-my-mind criteria saved.",
    );
  }

  async function continueToPlan(
    decisionId: string,
    criteria: DecisionChangeCriterion[],
  ) {
    const saved = await saveChangeCriteria(decisionId, criteria);
    if (!saved) return false;
    const created = await run(
      decisionLoopRepository.createExperimentDraft(ventureId),
      "Focused experiment plan created.",
    );
    if (created) setStep("plan");
    return created;
  }

  const steps: DecisionLoopStep[] = [
    {
      id: "review",
      label: "Review",
      description: "Claims and assumptions",
      status:
        step === "review"
          ? "current"
          : review.criticalReviewComplete
            ? "completed"
            : "future",
    },
    {
      id: "compare",
      label: "Compare",
      description: "Decision candidates",
      status:
        step === "compare"
          ? "current"
          : selected
            ? "completed"
            : review.criticalReviewComplete
              ? "future"
              : "blocked",
      blockedReason: !review.criticalReviewComplete
        ? `Review ${review.criticalCount - review.reviewedCriticalCount} critical ${review.criticalCount - review.reviewedCriticalCount === 1 ? "issue" : "issues"} first.`
        : undefined,
    },
    {
      id: "explore",
      label: "Explore",
      description: "Hypotheses and evidence",
      status:
        step === "explore"
          ? "current"
          : draft
            ? "completed"
            : selected
              ? "future"
              : "blocked",
      blockedReason: !selected
        ? "Choose one decision and save the founder rationale first."
        : undefined,
    },
    {
      id: "plan",
      label: "Plan",
      description: "Experiment and exit criteria",
      status:
        step === "plan"
          ? "current"
          : draft
            ? "future"
            : "blocked",
      blockedReason: !draft
        ? "Set the evidence that could change the decision first."
        : undefined,
    },
  ];

  return (
    <FounderShell ventureId={venture.id} contentWidth="focused">
      <div className="space-y-5">
        <header className="flex flex-col gap-3 border-b border-workspace-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="workspace-eyebrow text-primary">
              Founder decision loop
            </p>
            <h1 className="mt-1.5 workspace-page-title text-ink">
              {hasActiveCycle
                ? "Active Cycle"
                : "Resolve one decision, then run one focused test"}
            </h1>
            <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
              {hasActiveCycle
                ? "Execute the committed tasks and collect the signals required by the plan."
                : "Separate what the context supports from what it assumes, compare the next decisions, and plan the smallest useful test."}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="h-11 px-3 lg:h-9"
          >
            <Link href={`/founder/projects/${venture.id}`}>
              <ArrowLeft className="size-4" />
              Back to overview
            </Link>
          </Button>
        </header>

        <ContextProvenanceStrip
          state={state}
          ventureId={venture.id}
        />

        {message ? (
          <p
            role="status"
            className="rounded-lg border border-workspace-border bg-workspace-elevated px-3.5 py-2.5 workspace-supporting text-ink"
          >
            {message}
          </p>
        ) : null}

        {hasActiveCycle ? (
          <>
            <ActiveCycleSummary
              state={state}
              ventureId={venture.id}
              onStart={() =>
                run(
                  decisionLoopRepository.startActionCycle(
                    venture.id,
                  ),
                  "Action cycle started. Planning alone has not changed readiness.",
                )
              }
              onUpdateTask={(taskId, status) =>
                run(
                  decisionLoopRepository.updateCycleTask(
                    venture.id,
                    taskId,
                    { status },
                  ),
                  "Task progress updated.",
                )
              }
              onReviewReasoning={() =>
                setShowReasoning((current) => !current)
              }
            />
            {showReasoning ? (
              <ReasoningHistory
                state={state}
                ventureId={venture.id}
              />
            ) : null}
          </>
        ) : (
          <>
            <DecisionLoopStepper
              steps={steps}
              onSelect={setStep}
            />

            <section
              aria-live="polite"
              aria-label={`${step} workflow step`}
            >
              {step === "review" ? (
                <ChallengePanel
                  state={state}
                  ventureId={venture.id}
                  onRun={() =>
                    run(
                      decisionLoopRepository.runChallengeScan(
                        venture.id,
                      ),
                      "Review findings are ready.",
                    )
                  }
                  onResponse={(
                    itemId: string,
                    response: ChallengeFounderResponse,
                  ) =>
                    run(
                      decisionLoopRepository.respondToChallengeItem(
                        venture.id,
                        itemId,
                        response,
                      ),
                      "Founder response saved.",
                    )
                  }
                  onNote={(itemId, note) =>
                    run(
                      decisionLoopRepository.updateChallengeItemNote(
                        venture.id,
                        itemId,
                        note,
                      ),
                      "Founder note saved.",
                    )
                  }
                  onContinue={() => setStep("compare")}
                />
              ) : null}

              {step === "compare" ? (
                <DecisionPanel
                  state={state}
                  ventureId={venture.id}
                  onChoose={chooseDecision}
                  onExplore={() => setStep("explore")}
                  onDefer={(decisionId) =>
                    run(
                      decisionLoopRepository.deferDecisionCandidate(
                        venture.id,
                        decisionId,
                      ),
                      "Decision candidate deferred.",
                    )
                  }
                  onReject={(decisionId) =>
                    run(
                      decisionLoopRepository.rejectDecisionCandidate(
                        venture.id,
                        decisionId,
                      ),
                      "Decision candidate rejected.",
                    )
                  }
                />
              ) : null}

              {step === "explore" ? (
                <ExplorePanel
                  state={state}
                  ventureId={venture.id}
                  decisionId={selected?.id}
                  onSaveCriteria={saveChangeCriteria}
                  onContinue={continueToPlan}
                />
              ) : null}

              {step === "plan" ? (
                <CommitPanel
                  state={state}
                  ventureId={venture.id}
                  repository={decisionLoopRepository}
                  run={run}
                />
              ) : null}
            </section>
          </>
        )}
      </div>
    </FounderShell>
  );
}
