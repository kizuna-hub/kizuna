"use client";

import { Check, LockKeyhole } from "lucide-react";

import { cn } from "@/lib/utils";

export type DecisionLoopStepId =
  | "review"
  | "compare"
  | "explore"
  | "plan";

export type DecisionLoopStep = {
  id: DecisionLoopStepId;
  label: string;
  description: string;
  status: "completed" | "current" | "future" | "blocked";
  blockedReason?: string;
};

export function DecisionLoopStepper({
  steps,
  onSelect,
}: {
  steps: DecisionLoopStep[];
  onSelect: (step: DecisionLoopStepId) => void;
}) {
  return (
    <nav aria-label="Decision workflow">
      <ol className="grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => {
          const interactive =
            step.status === "completed" ||
            step.status === "current" ||
            step.status === "future";
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => interactive && onSelect(step.id)}
                disabled={!interactive}
                aria-current={
                  step.status === "current" ? "step" : undefined
                }
                className={cn(
                  "h-full min-h-20 w-full rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  step.status === "current" &&
                    "border-primary-border bg-primary-soft",
                  step.status === "completed" &&
                    "border-workspace-success/30 bg-workspace-success-soft hover:border-workspace-success/50",
                  step.status === "future" &&
                    "border-workspace-border bg-workspace-elevated opacity-70",
                  step.status === "blocked" &&
                    "border-workspace-border bg-workspace-elevated opacity-80",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border workspace-meta font-semibold",
                      step.status === "current" &&
                        "border-primary bg-primary text-primary-foreground",
                      step.status === "completed" &&
                        "border-workspace-success bg-workspace-success text-primary-foreground",
                      (step.status === "future" ||
                        step.status === "blocked") &&
                        "border-workspace-border text-workspace-muted-text",
                    )}
                  >
                    {step.status === "completed" ? (
                      <Check className="size-3" aria-hidden="true" />
                    ) : step.status === "blocked" ? (
                      <LockKeyhole
                        className="size-3"
                        aria-hidden="true"
                      />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="workspace-body font-semibold text-ink">
                    {step.label}
                  </span>
                </span>
                <span className="mt-1.5 block workspace-meta text-workspace-muted-text">
                  {step.blockedReason ?? step.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
