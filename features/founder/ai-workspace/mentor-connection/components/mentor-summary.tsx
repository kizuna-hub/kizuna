import { UserRoundCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { MentorConnectionBrief } from "../types/mentor-connection.types";

export function MentorSummary({
  mentor,
}: {
  mentor: MentorConnectionBrief["mentorSnapshot"];
}) {
  return (
    <section className="rounded-xl border border-primary-border bg-primary-soft p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-workspace-panel text-primary">
          <UserRoundCheck className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="workspace-card-title text-ink">
                {mentor.name}
              </h2>
              <p className="workspace-meta text-workspace-muted-text">
                {mentor.role}
              </p>
            </div>
            <Badge className="bg-workspace-success-soft text-workspace-success">
              Rất phù hợp · {mentor.matchScore}%
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {mentor.expertise.map((expertise) => (
              <Badge
                key={expertise}
                variant="outline"
                className="border-workspace-border bg-workspace-panel text-workspace-muted-text"
              >
                {expertise}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
