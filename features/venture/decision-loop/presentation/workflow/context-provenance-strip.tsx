import { ArrowRight, FileCheck2, ShieldAlert } from "lucide-react";

import { Link } from "@/i18n/routing";

import type { VentureId } from "../../../core";
import {
  getContextProvenance,
  type VentureWorkspaceState,
} from "../../application";

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function ContextProvenanceStrip({
  state,
  ventureId,
}: {
  state: VentureWorkspaceState;
  ventureId: VentureId;
}) {
  const context = getContextProvenance(state, ventureId);
  const sourceDescription = context.artifactType
    ? context.artifactType
    : context.aiAssistedSourceCount
      ? pluralize(context.aiAssistedSourceCount, "AI-assisted source")
      : pluralize(context.sourceCount, "context source");

  return (
    <aside
      aria-label="Context provenance"
      className="rounded-lg border border-workspace-border bg-workspace-elevated px-3.5 py-3"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileCheck2
              className="size-4 shrink-0 text-workspace-muted-text"
              aria-hidden="true"
            />
            <p className="workspace-meta font-semibold uppercase tracking-wide text-ink">
              Context used
            </p>
          </div>
          <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
            {context.reviewedSourceCount}/{context.sourceCount} reviewed
            {" · "}
            {context.pageCount
              ? `${context.pageCount}-page PDF · `
              : ""}
            {sourceDescription}
            {" · "}
            {context.customerEvidenceSourceCount} customer-evidence
            sources
            {" · "}
            {context.pilotEvidenceSourceCount} pilot-evidence sources
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            Source coverage describes the available context, not the
            strength of market evidence.
          </p>
          {context.personalDataDetected ? (
            <p className="mt-1.5 flex items-center gap-1.5 workspace-meta text-workspace-warning">
              <ShieldAlert className="size-3.5" aria-hidden="true" />
              Personal data detected; private contact details are hidden.
            </p>
          ) : null}
        </div>
        <Link
          href={`/founder/projects/${ventureId}/context`}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 workspace-supporting font-semibold text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          Review context
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
