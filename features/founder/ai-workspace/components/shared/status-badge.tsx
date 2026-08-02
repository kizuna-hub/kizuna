import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { EvidenceSignalStatus } from "../../types/ai-workspace.types";

const statusClasses: Record<EvidenceSignalStatus, string> = {
  verified:
    "border-workspace-success/35 bg-workspace-success-soft text-workspace-success",
  inferred:
    "border-primary-border bg-primary-soft text-primary",
  assumed:
    "border-workspace-warning/35 bg-workspace-warning-soft text-workspace-warning",
  missing:
    "border-workspace-danger/35 bg-workspace-danger-soft text-workspace-danger",
  disputed:
    "border-workspace-warning/35 bg-workspace-warning-soft text-workspace-warning",
  outdated:
    "border-workspace-border bg-workspace-elevated text-workspace-muted-text",
  waiting:
    "border-workspace-border bg-workspace-elevated text-workspace-muted-text",
};

export function StatusBadge({
  status,
  copy,
  className,
}: {
  status: EvidenceSignalStatus;
  copy: AiWorkspaceCopy["statuses"];
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-pill px-2 py-0.5 text-xs font-medium",
        statusClasses[status],
        className,
      )}
    >
      {copy[status]}
    </Badge>
  );
}
