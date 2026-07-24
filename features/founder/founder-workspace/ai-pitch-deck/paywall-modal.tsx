"use client";

import React from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceActionModal } from "@/features/founder/founder-workspace/workspace-ui";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function PaywallModal({ isOpen, onClose, title, description }: PaywallModalProps) {
  return (
    <WorkspaceActionModal
      open={isOpen}
      onClose={onClose}
      title={title}
      description="This premium gate is demo-safe and does not start a checkout flow."
      footer={<Button onClick={onClose}>Đã hiểu</Button>}
    >
      <div className="rounded-xl border border-hairline bg-surface-2 p-5 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-hairline bg-surface-1 text-ink">
          <Crown className="size-7" />
        </div>
        <p className="text-body-framer-sm leading-relaxed text-ink-muted" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </WorkspaceActionModal>
  );
}
