import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { MentorConnectionRequestStatus } from "../types/mentor-workspace.types";
import { statusLabels } from "./mentor-workspace-labels";

export function MentorRequestStatus({
  status,
}: {
  status: MentorConnectionRequestStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-workspace-border bg-workspace-elevated text-workspace-muted-text",
        status === "new" &&
          "border-workspace-warning/30 bg-workspace-warning-soft text-workspace-warning",
        status === "accepted" &&
          "border-workspace-success/30 bg-workspace-success-soft text-workspace-success",
        status === "needs_more_context" &&
          "border-primary-border bg-primary-soft text-primary",
        status === "declined" &&
          "border-workspace-danger/30 bg-workspace-danger-soft text-workspace-danger",
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}
