"use client";

import React from "react";
import { Medal, Pin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceCard } from "@/features/founder/founder-workspace/workspace-ui";

interface EndorsementManagerProps {
  endorsements: any[];
  onOpenRequestModal: () => void;
  onTriggerPaywall: () => void;
}

export function EndorsementManager({ endorsements, onOpenRequestModal, onTriggerPaywall }: EndorsementManagerProps) {
  return (
    <WorkspaceCard
      title="Mentor endorsement"
      description="Request a credible review so the pitch does not feel like an isolated founder claim."
      action={<Medal className="size-5 text-ink-muted" />}
    >
      {endorsements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-hairline bg-surface-2 p-8 text-center">
          <p className="mx-auto mb-5 max-w-md text-body-framer-sm text-ink-muted">
            No mentor endorsement attached yet. For the demo, request one and the review appears immediately.
          </p>
          <Button onClick={onOpenRequestModal}>
            <Users className="size-4" />
            Xin bảo chứng từ mentor
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {endorsements.map((endorsement, index) => (
            <div key={`${endorsement.name}-${index}`} className="flex gap-4 rounded-xl border border-hairline bg-surface-2 p-4">
              <img src={endorsement.avatar} className="size-11 rounded-full border border-hairline" alt={endorsement.name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-body-framer-sm font-bold text-ink">{endorsement.name}</h4>
                    <p className="mt-1 text-caption font-semibold uppercase tracking-[0.12em] text-ink-muted">{endorsement.role}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={onTriggerPaywall}>
                    <Pin className="size-3.5" />
                    Ghim ưu tiên
                  </Button>
                </div>
                <p className="mt-4 rounded-xl border border-hairline bg-surface-1 p-3 text-body-framer-sm italic text-ink-muted">
                  “{endorsement.content}”
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </WorkspaceCard>
  );
}
