"use client";

import React from "react";
import { AlertCircle, History, LineChart, Plus, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
  WorkspaceCard,
  WorkspaceMetric,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import { cn } from "@/lib/utils";

const stakeholders = [
  { initials: "NT", name: "Nguyen Tuan Ngoc", role: "Founder / CEO", shareClass: "Common", issued: "4,500,000", diluted: "41.4%", value: "$5,625,000" },
  { initials: "KV", name: "Kizuna Ventures", role: "Lead investor", shareClass: "Series A", issued: "2,000,000", diluted: "18.4%", value: "$2,500,000" },
  { initials: "ML", name: "Mai Linh", role: "Product lead", shareClass: "Options", issued: "720,000", diluted: "6.6%", value: "$900,000" },
  { initials: "OP", name: "Option Pool", role: "Unallocated", shareClass: "Pool", issued: "1,250,000", diluted: "11.5%", value: "$1,562,500" },
];

export function CapTableScreen() {
  const [view, setView] = React.useState<"issued" | "diluted">("issued");
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [toast, setToast] = React.useState<DemoToastState>(null);
  const [targetRaise, setTargetRaise] = React.useState(3000000);
  const dilution = ((targetRaise / 18000000) * 100).toFixed(1);

  const sync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setToast({ tone: "success", title: "Cap table synced", description: "Demo equity ledger refreshed from local mock state." });
    }, 900);
  };

  return (
    <div>
      <WorkspacePageHeader
        eyebrow="Cap table"
        title="Explain ownership without opening a spreadsheet."
        description="A demo-safe equity ledger with enough interaction to show dilution, history, and stakeholder structure."
        actions={
          <>
            <Button variant="secondary" onClick={() => setHistoryOpen(true)}>
              <History className="size-4" />
              Lịch sử
            </Button>
            <Button onClick={sync} disabled={syncing}>
              <RefreshCw className={cn("size-4", syncing && "animate-spin")} />
              {syncing ? "Đang đồng bộ" : "Đồng bộ dữ liệu"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <WorkspaceMetric label="Post-money valuation" value="$12.5M" detail="Series A scenario" icon={TrendingUp} accent />
        <WorkspaceMetric label="Price per share" value="$1.25" detail="+$0.40 from seed" icon={LineChart} />
        <WorkspaceMetric label="Total raised" value="$2.5M" detail="Committed capital" icon={Plus} />
        <WorkspaceMetric label="Option pool" value="12.5%" detail="18-24 month hiring plan" icon={History} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard
          className="xl:col-span-8"
          title="Stakeholder ledger"
          action={
            <div className="flex rounded-pill border border-hairline bg-surface-2 p-1">
              <button
                className={cn("rounded-pill px-3 py-1 text-caption font-bold", view === "issued" ? "bg-ink text-on-primary" : "text-ink-muted")}
                onClick={() => setView("issued")}
              >
                Issued
              </button>
              <button
                className={cn("rounded-pill px-3 py-1 text-caption font-bold", view === "diluted" ? "bg-ink text-on-primary" : "text-ink-muted")}
                onClick={() => setView("diluted")}
              >
                Fully diluted
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-hairline text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">
                  <th className="pb-3">Name / Role</th>
                  <th className="pb-3">Share class</th>
                  <th className="pb-3 text-right">{view === "issued" ? "Shares" : "Ownership"}</th>
                  <th className="pb-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {stakeholders.map((row) => (
                  <tr key={row.name} className="transition-colors hover:bg-surface-2">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg border border-hairline bg-surface-2 font-display text-caption font-bold text-ink">{row.initials}</div>
                        <div>
                          <p className="text-body-framer-sm font-bold text-ink">{row.name}</p>
                          <p className="text-caption text-ink-muted">{row.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full border border-hairline bg-surface-2 px-3 py-1 text-caption font-bold uppercase tracking-[0.12em] text-ink-muted">
                        {row.shareClass}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono text-body-framer-sm font-bold text-ink">{view === "issued" ? row.issued : row.diluted}</td>
                    <td className="py-4 text-right font-mono text-body-framer-sm text-ink-muted">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="xl:col-span-4" title="Ownership overview">
          <div className="mx-auto mb-6 flex size-40 items-center justify-center rounded-full border-[18px] border-ink bg-surface-2 shadow-framer-edge">
            <div className="text-center">
              <p className="font-mono text-3xl font-bold text-ink">10M</p>
              <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">shares</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ["Founders", "60.0%"],
              ["Investors", "27.5%"],
              ["Option Pool", "12.5%"],
            ].map(([label, pct]) => (
              <div key={label} className="flex justify-between rounded-xl border border-hairline bg-surface-2 px-3 py-2">
                <span className="text-body-framer-sm text-ink-muted">{label}</span>
                <span className="font-mono text-body-framer-sm font-bold text-ink">{pct}</span>
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WorkspaceCard title="Scenario modeling" description="Change target raise to explain founder dilution live.">
          <label className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Target raise</label>
          <input
            type="range"
            min="1000000"
            max="6000000"
            step="250000"
            value={targetRaise}
            onChange={(event) => setTargetRaise(Number(event.target.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-ink"
          />
          <div className="mt-5 rounded-xl border border-hairline bg-surface-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-body-framer-sm text-ink-muted">Raise amount</span>
              <span className="font-mono text-xl font-bold text-ink">${targetRaise.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-body-framer-sm text-ink-muted">New investor ownership</span>
              <span className="font-mono text-xl font-bold text-ink">{dilution}%</span>
            </div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard title="Legal note">
          <div className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-2 p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-ink-muted" />
            <p className="text-body-framer-sm leading-relaxed text-ink-muted">
              Cap table này là công cụ theo dõi nội bộ cho demo, không phải tài liệu pháp lý có hiệu lực. Mọi thay đổi equity thật cần được xác nhận bằng hợp đồng chính thức.
            </p>
          </div>
        </WorkspaceCard>
      </div>

      <WorkspaceActionModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Equity history"
        description="Recent deterministic events in the demo ledger."
      >
        <div className="space-y-3">
          {["Series A scenario imported", "Option pool refreshed", "Founder vesting cliff reviewed"].map((event) => (
            <div key={event} className="rounded-xl border border-hairline bg-surface-2 p-3 text-body-framer-sm text-ink">{event}</div>
          ))}
        </div>
      </WorkspaceActionModal>

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
