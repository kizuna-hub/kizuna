"use client";

import React from "react";
import {
  Activity,
  BookOpenCheck,
  FileText,
  Gift,
  Home,
  PieChart,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WorkspaceActionModal } from "@/features/founder/founder-workspace/workspace-ui";

type NavItemConfig = {
  icon: React.ElementType;
  label: string;
  href: string;
  note?: string;
  exact?: boolean;
};

const projectNames: Record<string, string> = {
  p1: "Kizuna Hub",
  p2: "SnapMoney",
  p3: "Dietfit AI",
};

function normalizePath(value: string) {
  if (value.length > 1 && value.endsWith("/")) return value.slice(0, -1);
  return value;
}

function NavItem({ icon: Icon, label, href, note, exact, onNavigate }: NavItemConfig & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const currentPath = normalizePath(pathname);
  const targetPath = normalizePath(href);
  const isActive = exact ? currentPath === targetPath : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-body-framer-sm transition-all",
        isActive
          ? "border-accent-blue/40 bg-accent-blue/10 text-ink shadow-framer-focus"
          : "border-transparent text-ink-muted hover:border-hairline hover:bg-surface-2/70 hover:text-ink"
      )}
    >
      {isActive ? <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent-blue" /> : null}
      <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-accent-blue" : "text-ink-muted group-hover:text-ink")} />
      <span className="min-w-0 flex-1 truncate font-bold">{label}</span>
      {note ? <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-ink-muted">{note}</span> : null}
    </Link>
  );
}

export default function WorkspaceSidebar({
  projectId,
  mobile = false,
  onClose,
}: {
  projectId: string;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const [projectOpen, setProjectOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const name = projectNames[projectId] ?? "New project";
  const base = `/founder/founder-workspace/${projectId}`;

  const v1NavItems: NavItemConfig[] = [
    { icon: Home, label: "Overview", href: base, exact: true },
    { icon: FileText, label: "AI Pitch Deck", href: `${base}/ai-pitch-deck` },
    { icon: Shield, label: "Secure Data Room", href: `${base}/data-room` },
    { icon: Users, label: "Venture Connect", href: `${base}/venture-connect` },
  ];

  const secondaryNavItems: NavItemConfig[] = [
    { icon: Activity, label: "Survival Matrix", href: `${base}/metrics`, note: "Future" },
    { icon: BookOpenCheck, label: "IP Ledger", href: `${base}/ip-ledger`, note: "Future" },
    { icon: Sparkles, label: "Stakeholders Studio", href: `${base}/stakeholders-studio`, note: "Future" },
    { icon: PieChart, label: "Cap Table & Equity", href: `${base}/cap-table`, note: "Future" },
    { icon: Gift, label: "SaaS Perks", href: `${base}/saas-perks`, note: "6" },
  ];

  return (
    <aside
      className={cn(
        "flex h-full w-[280px] flex-col border-r border-hairline bg-surface-1 shadow-framer-edge",
        mobile ? "w-full border-r-0" : "fixed left-0 top-0 z-header hidden h-screen md:flex"
      )}
    >
      <div className="border-b border-hairline p-4">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/founder/founder-dashboard/products"
            onClick={onClose}
            className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink"
          >
            Back to products
          </Link>
          {mobile ? (
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close navigation">
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="relative">
          <button
            onClick={() => setProjectOpen((value) => !value)}
            className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface-2 px-3 py-3 text-left transition-all hover:border-hairline-soft"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink font-display text-sm font-bold text-on-primary">
                {name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-body-framer-sm font-bold text-ink">{name}</p>
                <p className="truncate text-caption text-ink-muted">Founder Workspace</p>
              </div>
            </div>
            <Settings className="size-4 text-ink-muted" />
          </button>

          {projectOpen ? (
            <div className="absolute left-0 top-full z-dropdown mt-2 w-full rounded-xl border border-hairline bg-surface-1 p-2 shadow-2xl">
              {Object.entries(projectNames).map(([id, projectName]) => (
                <Link
                  key={id}
                  href={`/founder/founder-workspace/${id}`}
                  onClick={() => {
                    setProjectOpen(false);
                    onClose?.();
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-body-framer-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <span className="flex size-6 items-center justify-center rounded-md border border-hairline bg-surface-2 text-[10px] font-bold">
                    {projectName.charAt(0)}
                  </span>
                  {projectName}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mb-3 px-3 text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Demo flow</div>
        <div className="flex flex-col gap-1">
          {v1NavItems.map((item) => (
            <NavItem key={item.href} {...item} onNavigate={onClose} />
          ))}
        </div>
        <div className="mb-3 mt-5 px-3 text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">More tools</div>
        <div className="flex flex-col gap-1 opacity-80">
          {secondaryNavItems.map((item) => (
            <NavItem key={item.href} {...item} onNavigate={onClose} />
          ))}
        </div>
      </nav>

      <div className="border-t border-hairline p-4">
        <button
          onClick={() => setProfileOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3 text-left transition-colors hover:bg-surface-1"
        >
          <img
            src="https://i.pravatar.cc/150?u=kizuna-founder"
            alt="Nguyen Tuan Ngoc"
            className="size-10 shrink-0 rounded-full border border-hairline"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-framer-sm font-bold text-ink">Nguyen Tuan Ngoc</p>
            <p className="truncate text-caption text-ink-muted">Founder</p>
          </div>
          <ScrollText className="size-4 text-ink-muted" />
        </button>
      </div>

      <WorkspaceActionModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Founder profile"
        description="Demo account status for the current workspace."
        footer={<Button onClick={() => setProfileOpen(false)}>Done</Button>}
      >
        <div className="space-y-3">
          {[
            ["Role", "Student founder"],
            ["Workspace", name],
            ["Plan", "Demo founder seat"],
            ["Status", "Ready for SRS v1 walkthrough"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-surface-2 p-3">
              <span className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{label}</span>
              <span className="text-body-framer-sm font-bold text-ink">{value}</span>
            </div>
          ))}
        </div>
      </WorkspaceActionModal>
    </aside>
  );
}
