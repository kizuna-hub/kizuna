import { Database } from "lucide-react";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { SourceReference } from "../../types/ai-workspace.types";
import { StatusBadge } from "./status-badge";

export function SourceIndicator({
  sources,
  copy,
}: {
  sources: SourceReference[];
  copy: AiWorkspaceCopy;
}) {
  if (sources.length === 0) return null;

  return (
    <details className="border-t border-workspace-border px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 workspace-meta font-medium text-workspace-muted-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40">
        <Database className="size-3.5" />
        {copy.response.sources}
      </summary>
      <ul className="mt-2.5 space-y-2">
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

