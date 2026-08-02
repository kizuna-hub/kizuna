"use client";

import type { VentureId } from "../../../core";
import type { VentureSourceKind } from "../../domain";
import { ClipboardCheck, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { getActiveActionCycle, getDraftExperiment, getSelectedCriticalDecision, type DecisionLoopOperationResult, type DecisionLoopRepository } from "../../application";
import { CommittedCycleSummary } from "./committed-cycle-summary";
import { ExperimentEditor } from "./experiment-editor";

const acceptedSourceKinds: VentureSourceKind[] = [
  "customer-interview",
  "founder-note",
  "mentor-note",
  "research",
  "document",
  "prototype-link",
];

export function CommitPanel({
  state,
  ventureId,
  repository,
  run,
}: {
  state: ReturnType<typeof useDemoWorkspace>["state"];
  ventureId: VentureId;
  repository: DecisionLoopRepository;
  run: (
    operation: Promise<DecisionLoopOperationResult>,
    message: string,
  ) => Promise<boolean>;
}) {
  const selected = getSelectedCriticalDecision(state, ventureId);
  const activeCycle = getActiveActionCycle(state, ventureId);
  const draft = selected
    ? getDraftExperiment(state, ventureId)
    : undefined;

  if (
    activeCycle?.status === "committed" ||
    activeCycle?.status === "in-progress"
  ) {
    return (
      <CommittedCycleSummary
        state={state}
        ventureId={ventureId}
        onStart={() =>
          run(
            repository.startActionCycle(ventureId),
            "Action cycle started. Readiness remains unchanged.",
          )
        }
      />
    );
  }

  if (!selected) {
    return (
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <Target className="size-5 text-workspace-warning" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Select one critical decision first
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          A plan cannot start as a generic task list. Every experiment
          must be anchored to one explicit decision.
        </p>
      </section>
    );
  }

  if (!draft) {
    return (
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <ClipboardCheck className="size-5 text-primary" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Turn the decision into a focused experiment
        </h2>
        <p className="mt-1.5 max-w-2xl workspace-supporting text-workspace-muted-text">
          Kizuna will create a deterministic draft with a falsifiable
          hypothesis, evidence target, tasks, and scope guard. You remain
          responsible for reviewing every field.
        </p>
        <Button
          className="mt-4"
          onClick={() =>
            run(
              repository.createExperimentDraft(ventureId),
              "Experiment draft created.",
            )
          }
        >
          <Sparkles className="size-4" />
          Create focused plan
        </Button>
      </section>
    );
  }

  return (
    <ExperimentEditor
      state={state}
      ventureId={ventureId}
      experiment={draft}
      onUpdate={(patch) =>
        run(
          repository.updateExperimentPlan(
            ventureId,
            draft.id,
            patch,
          ),
          "Draft saved automatically.",
        )
      }
      onAddRequirement={(label, description) =>
        run(
          repository.addEvidenceRequirement(
            ventureId,
            draft.id,
            {
              label,
              description,
              acceptedSourceKinds,
              requiredForExit: true,
            },
          ),
          "Evidence requirement added.",
        )
      }
      onUpdateRequirement={(id, requiredForExit) =>
        run(
          repository.updateEvidenceRequirement(
            ventureId,
            id,
            { requiredForExit },
          ),
          "Evidence requirement updated.",
        )
      }
      onAddTask={(title) =>
        run(
          repository.addCycleTask(ventureId, draft.id, {
            title,
            ownerId: state.currentUser.id,
          }),
          "Task added.",
        )
      }
      onUpdateTaskStatus={(id, status) =>
        run(
          repository.updateCycleTask(ventureId, id, {
            status,
          }),
          "Task updated.",
        )
      }
      onCommit={() =>
        run(
          repository.commitActionCycle(ventureId),
          "Action cycle committed. Evidence readiness is unchanged.",
        )
      }
    />
  );
}
