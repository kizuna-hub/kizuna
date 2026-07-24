"use client";

import React from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  ChallengeFounderResponse,
  ChallengeItem,
  ChallengeItemType,
} from "../../domain";

const challengeTypeLabels: Record<ChallengeItemType, string> = {
  fact: "Supported fact",
  "founder-claim": "Founder claim",
  assumption: "Assumption",
  "ai-inference": "AI inference",
  contradiction: "Contradiction",
  unknown: "Unknown",
};

const responseLabels: Record<ChallengeFounderResponse, string> = {
  unreviewed: "Not reviewed",
  agree: "Agree",
  challenge: "Challenge",
  edit: "Needs correction",
  defer: "Can wait",
  "needs-evidence": "Needs evidence",
};

function BulletList({
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

function ReviewItemContent({
  item,
  sourceTitles,
  onResponse,
  onNote,
}: {
  item: ChallengeItem;
  sourceTitles: string[];
  onResponse: (response: ChallengeFounderResponse) => void;
  onNote: (note: string) => void;
}) {
  const [note, setNote] = React.useState(item.founderNote ?? "");

  React.useEffect(() => {
    setNote(item.founderNote ?? "");
  }, [item.founderNote]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge
          variant="outline"
          className={
            item.type === "contradiction" ||
            item.type === "unknown"
              ? "border-workspace-warning/30 bg-workspace-warning-soft text-workspace-warning"
              : "border-workspace-border bg-workspace-elevated text-workspace-muted-text"
          }
        >
          {challengeTypeLabels[item.type]}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {item.confidence} confidence
        </Badge>
        {item.founderResponse !== "unreviewed" ? (
          <Badge
            variant="outline"
            className="border-workspace-success/30 bg-workspace-success-soft text-workspace-success"
          >
            <CheckCircle2 className="size-3" aria-hidden="true" />
            Reviewed
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-2 workspace-body font-semibold text-ink">
        {item.title}
      </h3>
      <p className="mt-1 workspace-supporting text-workspace-muted-text">
        {item.explanation}
      </p>

      <div className="mt-3 grid gap-3 border-t border-workspace-border pt-3 sm:grid-cols-3">
        <div>
          <p className="workspace-meta font-semibold text-ink">
            Why this matters
          </p>
          <p className="mt-1.5 workspace-meta text-workspace-muted-text">
            {item.whyItMatters ??
              "This uncertainty could change the next useful decision."}
          </p>
        </div>
        <BulletList
          title="What supports it"
          items={item.whatSupportsIt}
          empty="No direct support is recorded."
        />
        <BulletList
          title="What is missing"
          items={item.whatIsMissing}
          empty="No missing evidence is recorded."
        />
      </div>

      <p className="mt-3 workspace-meta text-workspace-muted-text">
        Related sources:{" "}
        {sourceTitles.length
          ? sourceTitles.join(" · ")
          : "No confirmed direct source; treat this as an explicit unknown."}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${item.id}-response`}>
            Founder response
          </Label>
          <select
            id={`${item.id}-response`}
            value={item.founderResponse}
            onChange={(event) =>
              onResponse(
                event.target.value as ChallengeFounderResponse,
              )
            }
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {Object.entries(responseLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${item.id}-note`}>Founder note</Label>
          <Input
            id={`${item.id}-note`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onBlur={() => {
              if (note !== (item.founderNote ?? "")) onNote(note);
            }}
            placeholder="Add a correction or question"
          />
        </div>
      </div>
    </>
  );
}

export function ReviewItemCard({
  item,
  sourceTitles,
  onResponse,
  onNote,
}: {
  item: ChallengeItem;
  sourceTitles: string[];
  onResponse: (response: ChallengeFounderResponse) => void;
  onNote: (note: string) => void;
}) {
  return (
    <article className="rounded-xl border border-workspace-warning/30 bg-workspace-panel p-4">
      <ReviewItemContent
        item={item}
        sourceTitles={sourceTitles}
        onResponse={onResponse}
        onNote={onNote}
      />
    </article>
  );
}

export function ReviewDisclosure({
  title,
  description,
  items,
  sourceById,
  onResponse,
  onNote,
}: {
  title: string;
  description: string;
  items: ChallengeItem[];
  sourceById: Map<string, string>;
  onResponse: (
    itemId: string,
    response: ChallengeFounderResponse,
  ) => void;
  onNote: (itemId: string, note: string) => void;
}) {
  return (
    <details className="group rounded-xl border border-workspace-border bg-workspace-panel">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40">
        <span>
          <span className="workspace-body font-semibold text-ink">
            {title}
          </span>
          <span className="mt-0.5 block workspace-meta text-workspace-muted-text">
            {description}
          </span>
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-workspace-muted-text transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="divide-y divide-workspace-border border-t border-workspace-border">
        {items.map((item) => (
          <article key={item.id} className="p-4">
            <ReviewItemContent
              item={item}
              sourceTitles={item.sourceIds
                .map((id) => sourceById.get(id))
                .filter((title): title is string => Boolean(title))}
              onResponse={(response) => onResponse(item.id, response)}
              onNote={(note) => onNote(item.id, note)}
            />
          </article>
        ))}
      </div>
    </details>
  );
}
