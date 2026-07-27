"use client";

import React from "react";
import {
  ArrowLeft,
  CalendarCheck2,
  Check,
  ChevronDown,
  Clock3,
  RefreshCw,
  Save,
  UserRoundCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  MentorDismissReason,
  MentorRecommendation,
  MentorSessionState,
} from "../../types/ai-workspace.types";

function getStatusLabel(
  mentor: MentorRecommendation,
  copy: AiWorkspaceCopy["mentor"],
) {
  switch (mentor.status) {
    case "saved":
      return copy.savedStatus;
    case "booked":
      return copy.bookedStatus;
    case "external":
      return copy.externalStatus;
    case "stale":
      return copy.staleStatus;
    default:
      return copy.recommendationStatus;
  }
}

export function MentorMatchDetailPanel({
  mentor,
  session,
  copy,
  onBack,
  onBook,
  onSave,
  onDismiss,
  onUseOwnMentor,
  onTogglePreparation,
  onRefresh,
}: {
  mentor: MentorRecommendation;
  session?: MentorSessionState;
  copy: AiWorkspaceCopy;
  onBack: () => void;
  onBook: () => void;
  onSave: () => void;
  onDismiss: (reason: MentorDismissReason) => void;
  onUseOwnMentor: () => void;
  onTogglePreparation: (itemId: string) => void;
  onRefresh: () => void;
}) {
  const [alternativesOpen, setAlternativesOpen] =
    React.useState(false);
  const [briefExpanded, setBriefExpanded] =
    React.useState(false);
  const preparation = mentor.preparation ?? [];
  const completedPreparation = preparation.filter(
    (item) => item.completed,
  ).length;
  const preparationProgress =
    preparation.length === 0
      ? 0
      : Math.round(
          (completedPreparation / preparation.length) * 100,
        );
  const preparationMode =
    mentor.status === "booked" || mentor.status === "external";
  const stale = mentor.status === "stale";
  const matchRationale = mentor.matchRationale ?? [
    mentor.whyThisMentor,
  ];
  const expectedOutcomes = mentor.expectedOutcomes ?? [
    mentor.expectedOutcome,
  ];
  const alternatives = mentor.alternatives ?? [];

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-workspace-panel"
      aria-label={copy.mentor.panelTitle}
    >
      <div className="flex items-center gap-2 border-b border-workspace-border px-3 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label={copy.mentor.backToPulse}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0">
          <p className="workspace-eyebrow text-primary">
            {preparationMode
              ? copy.mentor.sessionPreparation
              : copy.mentor.panelTitle}
          </p>
          <p className="truncate workspace-meta text-workspace-muted-text">
            {getStatusLabel(mentor, copy.mentor)}
          </p>
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <section className="border-b border-workspace-border p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary-border bg-primary-soft font-heading text-sm font-semibold text-primary">
              {mentor.name
                .split(" ")
                .map((part) => part.charAt(0))
                .slice(0, 2)
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="workspace-section-title text-ink">
                {mentor.name}
              </h2>
              <p className="mt-0.5 workspace-meta text-workspace-muted-text">
                {mentor.role}
              </p>
              <p className="mt-1 workspace-meta text-primary">
                {mentor.expertise}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 workspace-meta text-workspace-muted-text">
            <Clock3 className="size-3.5 text-primary" />
            {mentor.availability}
          </div>
        </section>

        {stale ? (
          <section className="border-b border-workspace-border bg-workspace-warning-soft p-4">
            <p className="workspace-card-title text-ink">
              {copy.mentor.staleStatus}
            </p>
            <p className="mt-1.5 workspace-meta text-workspace-muted-text">
              {copy.mentor.staleExplanation}
            </p>
            <Button
              type="button"
              size="sm"
              className="mt-3 w-full"
              onClick={onRefresh}
            >
              <RefreshCw className="size-3.5" />
              {copy.mentor.refreshRecommendation}
            </Button>
          </section>
        ) : null}

        {preparationMode ? (
          <section className="border-b border-workspace-border bg-primary-soft/50 p-4">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="size-4 text-primary" />
              <p className="workspace-card-title text-ink">
                {mentor.status === "booked"
                  ? copy.mentor.bookingConfirmed
                  : copy.mentor.externalPreparation}
              </p>
            </div>
            <dl className="mt-3 space-y-2">
              <div>
                <dt className="workspace-eyebrow text-workspace-muted-text">
                  {copy.mentor.bookingTime}
                </dt>
                <dd className="mt-0.5 workspace-meta text-ink">
                  {session?.displayTime ??
                    mentor.availability}
                </dd>
              </div>
              <div>
                <dt className="workspace-eyebrow text-workspace-muted-text">
                  {copy.mentor.sessionGoal}
                </dt>
                <dd className="mt-0.5 workspace-meta text-ink">
                  {session?.goal ?? mentor.expectedOutcome}
                </dd>
              </div>
            </dl>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() =>
                setBriefExpanded((current) => !current)
              }
              aria-expanded={briefExpanded}
            >
              {copy.mentor.openSessionBrief}
            </Button>
            {briefExpanded ? (
              <ul className="mt-3 space-y-1.5 border-t border-workspace-border pt-3 workspace-meta text-ink">
                {expectedOutcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-workspace-success" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {!stale ? (
          <>
            <section className="border-b border-workspace-border p-4">
              <h3 className="workspace-eyebrow text-workspace-muted-text">
                {copy.mentor.matchRationale}
              </h3>
              <ul className="mt-2.5 space-y-2">
                {matchRationale.map((reason) => (
                  <li
                    key={reason}
                    className="flex gap-2 workspace-meta text-ink"
                  >
                    <Check className="mt-0.5 size-3.5 shrink-0 text-workspace-success" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-workspace-border p-4">
              <h3 className="workspace-eyebrow text-workspace-muted-text">
                {copy.mentor.whyNow}
              </h3>
              <p className="mt-2 workspace-supporting text-ink">
                {mentor.whyHumanNow}
              </p>
            </section>

            <section className="border-b border-workspace-border p-4">
              <h3 className="workspace-eyebrow text-workspace-muted-text">
                {copy.mentor.expectedOutcomes}
              </h3>
              <ul className="mt-2.5 space-y-2">
                {expectedOutcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex gap-2 workspace-meta text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-workspace-border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="workspace-eyebrow text-workspace-muted-text">
                  {copy.mentor.preparation}
                </h3>
                <span className="font-tabular workspace-meta text-ink">
                  {completedPreparation}/{preparation.length}{" "}
                  {copy.mentor.preparationProgress}
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-workspace-elevated"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={preparationProgress}
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
                  style={{ width: `${preparationProgress}%` }}
                />
              </div>
              <ul className="mt-3 space-y-1">
                {preparation.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        onTogglePreparation(item.id)
                      }
                      className="flex w-full items-start gap-2 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
                      aria-pressed={item.completed}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                          item.completed
                            ? "border-primary bg-primary text-on-primary"
                            : "border-workspace-border bg-workspace-elevated",
                        )}
                      >
                        {item.completed ? (
                          <Check className="size-3" />
                        ) : null}
                      </span>
                      <span className="workspace-meta text-ink">
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-workspace-border p-4">
              <h3 className="workspace-eyebrow text-workspace-muted-text">
                {copy.mentor.decisionScope}
              </h3>
              <p className="mt-2 workspace-meta text-ink">
                {mentor.scopeLabel} · v
                {mentor.recommendationVersion ?? 1}
              </p>
            </section>

            {alternatives.length > 0 ? (
              <Collapsible
                open={alternativesOpen}
                onOpenChange={setAlternativesOpen}
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 border-b border-workspace-border p-4 text-left transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-workspace-focus-ring/40"
                  >
                    <span className="workspace-card-title text-ink">
                      {copy.mentor.compareAlternatives}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-workspace-muted-text transition-transform",
                        alternativesOpen && "rotate-180",
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="divide-y divide-workspace-border border-b border-workspace-border px-4">
                    {alternatives.map((alternative) => (
                      <div
                        key={alternative.id}
                        className="py-3"
                      >
                        <p className="workspace-card-title text-ink">
                          {alternative.name}
                        </p>
                        <dl className="mt-2 grid gap-2">
                          <div>
                            <dt className="workspace-eyebrow text-workspace-muted-text">
                              {copy.mentor.alternativeStrength}
                            </dt>
                            <dd className="mt-0.5 workspace-meta text-ink">
                              {alternative.strength}
                            </dd>
                          </div>
                          <div>
                            <dt className="workspace-eyebrow text-workspace-muted-text">
                              {copy.mentor.alternativeTradeOff}
                            </dt>
                            <dd className="mt-0.5 workspace-meta text-workspace-muted-text">
                              {alternative.tradeOff}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : null}
          </>
        ) : null}
      </div>

      {!stale && !preparationMode ? (
        <div className="space-y-2 border-t border-workspace-border p-3">
          <Button
            type="button"
            size="sm"
            className="w-full"
            onClick={onBook}
          >
            <CalendarCheck2 className="size-3.5" />
            {copy.mentor.bookSession}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onSave}
              disabled={mentor.status === "saved"}
            >
              <Save className="size-3.5" />
              {mentor.status === "saved"
                ? copy.mentor.savedForLater
                : copy.mentor.saveForLater}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                >
                  {copy.mentor.notSuitable}
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 border-workspace-border bg-workspace-elevated text-ink"
              >
                <DropdownMenuLabel className="workspace-meta text-workspace-muted-text">
                  {copy.mentor.notSuitable}
                </DropdownMenuLabel>
                {(
                  [
                    "not_now",
                    "not_fit",
                    "try_first",
                  ] as const
                ).map((reason) => (
                  <DropdownMenuItem
                    key={reason}
                    className="workspace-supporting focus:bg-workspace-row-hover focus:text-ink"
                    onSelect={() => onDismiss(reason)}
                  >
                    {copy.mentor.dismissReasons[reason]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-workspace-border" />
                <DropdownMenuItem
                  className="workspace-supporting focus:bg-workspace-row-hover focus:text-ink"
                  onSelect={onUseOwnMentor}
                >
                  <UserRoundCheck className="size-4" />
                  {copy.mentor.useOwnMentor}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
