"use client";

import React from "react";
import { Bell, CheckCircle2, Menu, Share2, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CopyField,
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
} from "@/features/founder/founder-workspace/workspace-ui";

const sectionLabels = [
  ["/metrics", "Survival Matrix"],
  ["/ai-pitch-deck", "AI Pitch Deck"],
  ["/data-room", "Secure Data Room"],
  ["/ip-ledger", "IP Ledger"],
  ["/stakeholders-studio", "Stakeholders Studio"],
  ["/venture-connect", "Venture Connect"],
  ["/cap-table", "Cap Table & Equity"],
  ["/saas-perks", "SaaS Perks"],
] as const;

export default function Header({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const pathname = usePathname();
  const [shareOpen, setShareOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [toast, setToast] = React.useState<DemoToastState>(null);

  const section = sectionLabels.find(([slug]) => pathname?.includes(slug))?.[1] ?? "Overview";
  const shareLink = `https://demo.kizuna.local${pathname ?? "/founder/founder-workspace/p1"}`;

  return (
    <>
      <header className="sticky top-0 z-header flex min-h-16 items-center justify-between border-b border-hairline bg-surface-1/95 px-4 backdrop-blur-md md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileNav} aria-label="Open navigation">
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 text-body-framer-sm text-ink-muted">
            <span className="hidden sm:inline">Kizuna Hub</span>
            <span className="hidden px-2 text-hairline sm:inline">/</span>
            <span className="font-bold text-ink">{section}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="secondary" size="sm" onClick={() => setShareOpen(true)}>
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share Project</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setNotificationsOpen(true)} aria-label="Open notifications" className="relative">
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-accent-blue" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setProfileOpen(true)} aria-label="Open profile">
            <UserCircle className="size-5" />
          </Button>
        </div>
      </header>

      <WorkspaceActionModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share demo project"
        description="Use this deterministic link during the live walkthrough. It does not expose real backend data."
      >
        <CopyField
          value={shareLink}
          onCopy={() => setToast({ tone: "success", title: "Project link copied", description: "The demo link is ready to paste." })}
        />
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Founder notifications"
        description="Recent demo events that keep the workspace feeling alive."
      >
        <div className="space-y-3">
          {[
            "Mentor review returned notes on slide 4.",
            "Data Room link viewed by Vertex Scout.",
            "Runway dipped below the 9 month planning threshold.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent-blue" />
              <p className="text-body-framer-sm text-ink">{item}</p>
            </div>
          ))}
        </div>
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Founder account"
        description="Demo-safe account controls for the presenter."
        footer={<Button variant="secondary" onClick={() => setProfileOpen(false)}>Done</Button>}
      >
        <div className="rounded-xl border border-hairline bg-surface-2 p-4">
          <p className="text-body-framer-sm font-bold text-ink">Nguyen Tuan Ngoc</p>
          <p className="mt-1 text-caption text-ink-muted">ngoc@kizuna.demo</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-caption text-ink-muted">
            <span className="rounded-lg bg-surface-1 px-3 py-2">Plan: Founder Pro</span>
            <span className="rounded-lg bg-surface-1 px-3 py-2">Locale: demo</span>
          </div>
        </div>
      </WorkspaceActionModal>

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
