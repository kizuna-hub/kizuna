import { Database } from "lucide-react";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { SourceReference } from "../../types/ai-workspace.types";
import { StatusBadge } from "../shared/status-badge";

export function ResponseSourceFooter({
  sources,
  copy,
}: {
  sources: SourceReference[];
  copy: AiWorkspaceCopy;
}) {
  if (sources.length === 0) return null;

  const verified = sources.filter(
    (source) => source.status === "verified",
  ).length;

  return (
    <details className="mt-2 max-w-2xl">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md py-1 workspace-meta text-workspace-muted-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40">
        <Database className="size-3.5" aria-hidden="true" />
        {copy.response.sourceSummary(
          sources.length,
          verified,
        )}
      </summary>
      <ul className="mt-2 max-w-xl space-y-1.5 border-l border-workspace-border pl-3">
        {sources.map((source) => (
          <li
            key={source.id}
            className="flex items-center justify-between gap-3"
          >
            <span className="workspace-meta text-ink">
              {source.label}
            </span>
            <StatusBadge
              status={source.status}
              copy={copy.statuses}
            />
          </li>
        ))}
      </ul>
    </details>
  );
}
