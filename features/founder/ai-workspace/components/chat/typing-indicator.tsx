"use client";

import React from "react";
import { Check, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";

const THINKING_STEP_DELAYS = [850, 1750, 2600];

function normalizePrompt(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");
}

function getThinkingSteps({
  prompt,
  hasReadyAttachments,
  copy,
}: {
  prompt: string;
  hasReadyAttachments: boolean;
  copy: AiWorkspaceCopy["chat"];
}) {
  const normalizedPrompt = normalizePrompt(prompt);
  if (hasReadyAttachments) {
    return [
      copy.thinkingTasks.reviewMaterials,
      copy.thinkingTasks.reviewContext,
      copy.thinkingTasks.composeResponse,
    ];
  }
  if (
    normalizedPrompt.includes("co van") ||
    normalizedPrompt.includes("mentor") ||
    normalizedPrompt.includes("ai co the giup") ||
    normalizedPrompt.includes("product validation") ||
    normalizedPrompt.includes("student startup")
  ) {
    return [
      "Đang đối chiếu nhu cầu hiện tại với chuyên môn của mentor…",
      copy.thinkingTasks.evaluateMentorNeed,
      copy.thinkingTasks.composeResponse,
    ];
  }
  if (
    normalizedPrompt.includes("hanh dong") ||
    normalizedPrompt.includes("buoc tiep") ||
    normalizedPrompt.includes("chu ky")
  ) {
    return [
      copy.thinkingTasks.reviewContext,
      copy.thinkingTasks.planNextAction,
      copy.thinkingTasks.composeResponse,
    ];
  }
  return [
    copy.thinkingTasks.understandRequest,
    copy.thinkingTasks.reviewContext,
    copy.thinkingTasks.composeResponse,
  ];
}

export function TypingIndicator({
  copy,
  prompt,
  hasReadyAttachments,
}: {
  copy: AiWorkspaceCopy["chat"];
  prompt: string;
  hasReadyAttachments: boolean;
}) {
  const [completedSteps, setCompletedSteps] = React.useState(0);
  const steps = React.useMemo(
    () =>
      getThinkingSteps({
        prompt,
        hasReadyAttachments,
        copy,
      }),
    [copy, hasReadyAttachments, prompt],
  );

  React.useEffect(() => {
    const timers = THINKING_STEP_DELAYS.map((delay, index) =>
      window.setTimeout(
        () => setCompletedSteps(index + 1),
        delay,
      ),
    );
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div
      className="ml-9 px-1 py-2"
      role="status"
      aria-live="polite"
    >
      <p className="workspace-supporting font-medium text-ink">
        {copy.thinkingTitle}
      </p>
      <ol className="mt-2 space-y-1.5">
        {steps.map((step, index) => {
          const completed = index < completedSteps;
          const active = index === completedSteps;
          return (
            <li
              key={step}
              className={cn(
                "flex min-h-5 items-center gap-2 workspace-meta transition-colors",
                completed
                  ? "text-workspace-muted-text"
                  : active
                    ? "text-ink"
                    : "text-workspace-muted-text/60",
              )}
            >
              <span
                className="flex size-3.5 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                {completed ? (
                  <Check className="size-3.5 text-workspace-success" />
                ) : (
                  <Circle
                    className={cn(
                      "size-2 fill-current",
                      active &&
                        "animate-pulse text-primary motion-reduce:animate-none",
                    )}
                  />
                )}
              </span>
              <span>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
