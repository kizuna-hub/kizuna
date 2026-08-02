"use client";

import React from "react";
import type { SourceOrigin, VentureSource, VentureSourceKind } from "../../domain";
import { Check, FilePlus2, Link2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export const sourceKindLabels: Record<VentureSourceKind, string> = {
  "ai-conversation": "AI conversation",
  "pitch-deck": "Pitch deck",
  document: "Document",
  "prototype-link": "Prototype link",
  research: "Research",
  "customer-interview": "Customer interview",
  "mentor-note": "Mentor note",
  "program-deliverable": "Program deliverable",
  "founder-note": "Founder note",
  other: "Other",
};

export const originLabels: Record<SourceOrigin, string> = {
  "founder-authored": "Founder-authored",
  "team-authored": "Team-authored",
  "ai-generated": "AI-generated",
  "ai-assisted": "AI-assisted",
  "mentor-feedback": "Mentor feedback",
  "customer-evidence": "Customer evidence",
  "external-research": "External research",
  "program-material": "Program material",
  unknown: "Unknown",
};

export function sourceStatusClass(status: VentureSource["reviewStatus"]) {
  if (status === "confirmed") {
    return "border-workspace-success/30 bg-workspace-success-soft text-workspace-success";
  }
  if (status === "needs-update") {
    return "border-workspace-warning/30 bg-workspace-warning-soft text-workspace-warning";
  }
  return "border-workspace-border bg-workspace-elevated text-workspace-muted-text";
}

export function SourceDetailSheet({
  source,
  open,
  onOpenChange,
  onReview,
  onExclude,
}: {
  source?: VentureSource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReview: (status: "confirmed" | "needs-update") => void;
  onExclude: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-workspace-border bg-workspace-panel sm:max-w-lg">
        {source ? (
          <>
            <SheetHeader className="border-b border-workspace-border">
              <SheetTitle className="workspace-card-title text-ink">
                {source.title}
              </SheetTitle>
              <SheetDescription className="workspace-supporting text-workspace-muted-text">
                Imported {new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(source.importedAt))}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <dl className="grid grid-cols-2 gap-3 workspace-meta">
                <div>
                  <dt className="text-workspace-muted-text">Origin</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {originLabels[source.origin]}
                  </dd>
                </div>
                <div>
                  <dt className="text-workspace-muted-text">
                    AI contribution
                  </dt>
                  <dd className="mt-1 font-medium capitalize text-ink">
                    {source.aiContribution}
                  </dd>
                </div>
                <div>
                  <dt className="text-workspace-muted-text">
                    Freshness
                  </dt>
                  <dd className="mt-1 font-medium capitalize text-ink">
                    {source.freshness.replace("-", " ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-workspace-muted-text">
                    Visibility
                  </dt>
                  <dd className="mt-1 font-medium capitalize text-ink">
                    {source.visibility.replace("-", " ")}
                  </dd>
                </div>
              </dl>
              {source.provenance ? (
                <>
                  <div className="rounded-lg border border-workspace-border bg-workspace-elevated p-3">
                    <p className="workspace-meta font-semibold text-ink">
                      Source provenance
                    </p>
                    <dl className="mt-2 grid grid-cols-2 gap-3 workspace-meta">
                      <div>
                        <dt className="text-workspace-muted-text">
                          Artifact
                        </dt>
                        <dd className="mt-1 font-medium text-ink">
                          {source.provenance.artifactType ??
                            sourceKindLabels[source.kind]}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-workspace-muted-text">
                          Document
                        </dt>
                        <dd className="mt-1 font-medium text-ink">
                          {source.provenance.pageCount
                            ? `${source.provenance.pageCount} pages`
                            : "Page count unavailable"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-workspace-muted-text">
                          Purpose
                        </dt>
                        <dd className="mt-1 font-medium text-ink">
                          {source.provenance.purpose ?? "Not recorded"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-workspace-muted-text">
                          Current as of
                        </dt>
                        <dd className="mt-1 font-medium text-ink">
                          {source.provenance.currentAsOf ??
                            "Not recorded"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <p className="workspace-meta font-semibold text-ink">
                      Context value, not proof
                    </p>
                    <dl className="mt-2 grid grid-cols-2 gap-2 workspace-meta">
                      {[
                        [
                          "Product context",
                          source.provenance.productContext,
                        ],
                        [
                          "Technical context",
                          source.provenance.technicalContext,
                        ],
                        [
                          "Market evidence",
                          source.provenance.marketEvidence,
                        ],
                        [
                          "Commercial evidence",
                          source.provenance.commercialEvidence,
                        ],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-md bg-workspace-elevated p-2.5"
                        >
                          <dt className="text-workspace-muted-text">
                            {label}
                          </dt>
                          <dd className="mt-1 font-semibold capitalize text-ink">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {source.provenance.personalDataDetected ? (
                    <div
                      role="note"
                      className="flex items-start gap-2 rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft p-3"
                    >
                      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
                      <p className="workspace-supporting text-ink">
                        {source.provenance.personalDataNotice ??
                          "Personal data was detected and remains private."}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : null}
              <div>
                <p className="workspace-meta text-workspace-muted-text">
                  Safe preview
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-lg border border-workspace-border bg-workspace-elevated p-3 workspace-supporting text-ink">
                  {source.content ||
                    source.summary ||
                    "No preview content was captured for this source."}
                </p>
              </div>
              {source.externalUrl ? (
                <a
                  href={source.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center gap-2 workspace-supporting font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <Link2 className="size-4" />
                  Open original link
                </a>
              ) : null}
            </div>
            <SheetFooter className="border-t border-workspace-border sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => onReview("needs-update")}
              >
                Needs update
              </Button>
              <Button variant="secondary" onClick={onExclude}>
                Exclude
              </Button>
              <Button onClick={() => onReview("confirmed")}>
                <Check className="size-4" />
                Confirm source
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export function AddSourceSheet({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: {
    title: string;
    kind: VentureSourceKind;
    origin: SourceOrigin;
    summary: string;
  }) => Promise<boolean>;
}) {
  const [title, setTitle] = React.useState("");
  const [kind, setKind] =
    React.useState<VentureSourceKind>("founder-note");
  const [origin, setOrigin] =
    React.useState<SourceOrigin>("founder-authored");
  const [summary, setSummary] = React.useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (await onSubmit({ title, kind, origin, summary })) {
      setTitle("");
      setKind("founder-note");
      setOrigin("founder-authored");
      setSummary("");
      onOpenChange(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-workspace-border bg-workspace-panel sm:max-w-lg">
        <form onSubmit={submit} className="flex min-h-full flex-col">
          <SheetHeader className="border-b border-workspace-border">
            <SheetTitle className="workspace-card-title text-ink">
              Add a demo context source
            </SheetTitle>
            <SheetDescription className="workspace-supporting text-workspace-muted-text">
              This demo records source metadata and a safe text summary.
              File upload is not available in this workspace.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4">
            <div className="space-y-1.5">
              <Label htmlFor="source-title">Source title</Label>
              <Input
                id="source-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Founder interview notes"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="source-kind">Source type</Label>
                <select
                  id="source-kind"
                  value={kind}
                  onChange={(event) =>
                    setKind(event.target.value as VentureSourceKind)
                  }
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {Object.entries(sourceKindLabels).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="source-origin">Origin</Label>
                <select
                  id="source-origin"
                  value={origin}
                  onChange={(event) =>
                    setOrigin(event.target.value as SourceOrigin)
                  }
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {Object.entries(originLabels).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="source-summary">Safe summary</Label>
              <Textarea
                id="source-summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Capture only the context needed for this decision."
                rows={6}
              />
            </div>
          </div>
          <SheetFooter className="border-t border-workspace-border">
            <Button type="submit">
              <FilePlus2 className="size-4" />
              Add source
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
