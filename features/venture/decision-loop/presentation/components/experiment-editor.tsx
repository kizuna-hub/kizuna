"use client";

import type { VentureId } from "../../../core";
import type { ExperimentPlan } from "../../domain";
import React from "react";
import { CheckCircle2, CircleDot, ClipboardCheck, FileSearch, ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupportRelationshipsForVenture } from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { getCycleTasksForExperiment, getEvidenceRequirementsForExperiment, getSelectedCriticalDecision, validateExperimentPlan, type ExperimentPlanPatch } from "../../application";
import { PlanField } from "./plan-field";

export function ExperimentEditor({
  state,
  ventureId,
  experiment,
  onUpdate,
  onAddRequirement,
  onUpdateRequirement,
  onAddTask,
  onUpdateTaskStatus,
  onCommit,
}: {
  state: ReturnType<typeof useDemoWorkspace>["state"];
  ventureId: VentureId;
  experiment: ExperimentPlan;
  onUpdate: (patch: ExperimentPlanPatch) => void;
  onAddRequirement: (label: string, description: string) => void;
  onUpdateRequirement: (
    id: string,
    requiredForExit: boolean,
  ) => void;
  onAddTask: (title: string) => void;
  onUpdateTaskStatus: (
    id: string,
    status: "not-started" | "in-progress" | "blocked" | "done",
  ) => void;
  onCommit: () => void;
}) {
  const [requirementLabel, setRequirementLabel] =
    React.useState("");
  const [requirementDescription, setRequirementDescription] =
    React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const relationships = getSupportRelationshipsForVenture(
    state,
    ventureId,
  );
  const selectedDecision = getSelectedCriticalDecision(
    state,
    ventureId,
  );
  const requirements = getEvidenceRequirementsForExperiment(
    state,
    experiment.id,
  );
  const tasks = getCycleTasksForExperiment(
    state,
    experiment.id,
  );
  const validationErrors = validateExperimentPlan(
    state,
    ventureId,
    experiment,
  );

  function updateLines(
    key: "exitCriteria" | "stopConditions" | "whatNotToDo",
    value: string,
  ) {
    onUpdate({
      [key]: value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-4">
        <p className="workspace-eyebrow text-primary">
          Decision anchor
        </p>
        <h2 className="mt-2 workspace-section-title text-ink">
          {selectedDecision?.title}
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          {selectedDecision?.founderRationale}
        </p>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="size-5 text-primary" />
          <h2 className="workspace-section-title text-ink">
            Focused experiment plan
          </h2>
        </div>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Drafts save automatically. Commit explicitly only when the
          owner, test, evidence target, and stopping rules are clear.
        </p>
        <div className="mt-4 grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="experiment-title">Cycle title</Label>
            <Input
              id="experiment-title"
              value={experiment.title}
              onChange={(event) =>
                onUpdate({ title: event.target.value })
              }
            />
          </div>
          <PlanField
            id="experiment-hypothesis"
            label="Falsifiable hypothesis"
            value={experiment.hypothesis}
            onChange={(value) => onUpdate({ hypothesis: value })}
          />
          <PlanField
            id="experiment-method"
            label="Method"
            value={experiment.method}
            onChange={(value) => onUpdate({ method: value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <PlanField
              id="experiment-expected"
              label="Expected signal"
              value={experiment.expectedSignal}
              onChange={(value) =>
                onUpdate({ expectedSignal: value })
              }
            />
            <PlanField
              id="experiment-failure"
              label="Failure signal"
              value={experiment.failureSignal}
              onChange={(value) =>
                onUpdate({ failureSignal: value })
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="experiment-owner">Owner</Label>
              <select
                id="experiment-owner"
                value={experiment.ownerId}
                onChange={(event) =>
                  onUpdate({ ownerId: event.target.value })
                }
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value={state.currentUser.id}>
                  {state.currentUser.name}
                </option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experiment-timebox">
                Timebox (days)
              </Label>
              <Input
                id="experiment-timebox"
                type="number"
                min={1}
                max={42}
                value={experiment.timeboxDays}
                onChange={(event) =>
                  onUpdate({
                    timeboxDays: Number(event.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experiment-reviewer">
                Optional reviewer
              </Label>
              <select
                id="experiment-reviewer"
                value={experiment.reviewerRelationshipId ?? ""}
                onChange={(event) =>
                  onUpdate({
                    reviewerRelationshipId:
                      event.target.value || undefined,
                  })
                }
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="">No reviewer</option>
                {relationships.map((relationship) => (
                  <option
                    key={relationship.id}
                    value={relationship.id}
                  >
                    {relationship.personName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <PlanField
              id="experiment-exit"
              label="Exit criteria (one per line)"
              value={experiment.exitCriteria.join("\n")}
              onChange={(value) =>
                updateLines("exitCriteria", value)
              }
              rows={4}
            />
            <PlanField
              id="experiment-stop"
              label="Stop conditions (one per line)"
              value={experiment.stopConditions.join("\n")}
              onChange={(value) =>
                updateLines("stopConditions", value)
              }
              rows={4}
            />
            <PlanField
              id="experiment-scope"
              label="What not to do (one per line)"
              value={experiment.whatNotToDo.join("\n")}
              onChange={(value) =>
                updateLines("whatNotToDo", value)
              }
              rows={4}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <div className="flex items-center gap-2">
          <FileSearch className="size-5 text-primary" />
          <h2 className="workspace-section-title text-ink">
            Evidence requirements
          </h2>
        </div>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          These are targets for the cycle, not submitted or reviewed
          evidence.
        </p>
        <div className="mt-3 space-y-2">
          {requirements.map((requirement) => (
            <div
              key={requirement.id}
              className="flex flex-col gap-2 rounded-lg bg-workspace-elevated p-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="workspace-body font-semibold text-ink">
                  {requirement.label}
                </p>
                <p className="mt-1 workspace-meta text-workspace-muted-text">
                  {requirement.description}
                </p>
              </div>
              <label className="flex min-h-8 shrink-0 items-center gap-2 workspace-meta text-workspace-muted-text">
                <Checkbox
                  checked={requirement.requiredForExit}
                  onCheckedChange={(checked) =>
                    onUpdateRequirement(
                      requirement.id,
                      checked === true,
                    )
                  }
                />
                Required for exit
              </label>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 border-t border-workspace-border pt-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto]">
          <Input
            aria-label="New evidence requirement label"
            value={requirementLabel}
            onChange={(event) =>
              setRequirementLabel(event.target.value)
            }
            placeholder="Requirement label"
          />
          <Input
            aria-label="New evidence requirement description"
            value={requirementDescription}
            onChange={(event) =>
              setRequirementDescription(event.target.value)
            }
            placeholder="What must be observed"
          />
          <Button
            variant="secondary"
            onClick={() => {
              onAddRequirement(
                requirementLabel,
                requirementDescription,
              );
              setRequirementLabel("");
              setRequirementDescription("");
            }}
            disabled={!requirementLabel.trim()}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="size-5 text-primary" />
          <h2 className="workspace-section-title text-ink">
            Cycle tasks
          </h2>
        </div>
        <div className="mt-3 divide-y divide-workspace-border">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-2">
                <CircleDot className="mt-1 size-3.5 shrink-0 text-primary" />
                <div>
                  <p className="workspace-supporting font-medium text-ink">
                    {task.title}
                  </p>
                  <p className="mt-0.5 workspace-meta text-workspace-muted-text">
                    Owner: {state.currentUser.name}
                  </p>
                </div>
              </div>
              <select
                aria-label={`Status for ${task.title}`}
                value={task.status}
                onChange={(event) =>
                  onUpdateTaskStatus(
                    task.id,
                    event.target.value as
                      | "not-started"
                      | "in-progress"
                      | "blocked"
                      | "done",
                  )
                }
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 border-t border-workspace-border pt-3 sm:flex-row">
          <Input
            aria-label="New cycle task"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Add a focused task"
          />
          <Button
            variant="secondary"
            onClick={() => {
              onAddTask(taskTitle);
              setTaskTitle("");
            }}
            disabled={!taskTitle.trim()}
          >
            <Plus className="size-4" />
            Add task
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-primary-border bg-primary-soft p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="workspace-section-title text-ink">
              Commit this action cycle
            </h2>
            <p className="mt-1.5 max-w-2xl workspace-supporting text-workspace-muted-text">
              Commitment locks the selected decision and turns this draft
              into one focused cycle. It does not create evidence,
              outcomes, or readiness gains.
            </p>
            {validationErrors.length ? (
              <ul
                role="alert"
                className="mt-3 space-y-1 workspace-meta text-workspace-warning"
              >
                {validationErrors.map((error) => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 flex items-center gap-2 workspace-supporting text-workspace-success">
                <CheckCircle2 className="size-4" />
                The plan is ready to commit.
              </p>
            )}
          </div>
          <Button
            onClick={onCommit}
            disabled={validationErrors.length > 0}
          >
            <ClipboardCheck className="size-4" />
            Commit cycle
          </Button>
        </div>
      </section>
    </div>
  );
}
