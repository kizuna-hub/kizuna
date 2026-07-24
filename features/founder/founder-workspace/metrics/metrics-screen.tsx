"use client";

import React from "react";
import { Filter, Minus, Plus, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
  WorkspaceCard,
  WorkspaceMetric,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";

export function MetricsScreen() {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [widgetVisible, setWidgetVisible] = React.useState(false);
  const [burnDelta, setBurnDelta] = React.useState(8400);
  const [toast, setToast] = React.useState<DemoToastState>(null);
  const runway = Math.max(4.1, 10.8 - burnDelta / 4000);

  const addWidget = () => {
    setWidgetVisible(true);
    setToast({ tone: "success", title: "Widget added", description: "Investor readiness now appears in the dashboard." });
  };

  return (
    <div>
      <WorkspacePageHeader
        eyebrow="Survival matrix"
        title="Runway, traction, and risk in one operating view."
        description="A deterministic demo model for founders to explain where the startup stands and what changes if spending shifts."
        actions={
          <>
            <Button variant="secondary" onClick={() => setFilterOpen(true)}>
              <Filter className="size-4" />
              Filter
            </Button>
            <Button onClick={addWidget}>
              <Plus className="size-4" />
              Add Widget
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <WorkspaceMetric label="Current cash" value="$96.4k" detail="Connected to demo bank balance" icon={WalletCards} />
        <WorkspaceMetric label="Monthly burn" value={`$${(18900 + burnDelta).toLocaleString()}`} detail="Includes simulated campaign spend" icon={TrendingDown} accent />
        <WorkspaceMetric label="MRR growth" value="+17.4%" detail="Rolling 30 day growth" icon={TrendingUp} />
        <WorkspaceMetric label="Runway" value={`${runway.toFixed(1)} mo`} detail="Projected cash depletion" icon={Filter} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard className="xl:col-span-8" title="Runway simulator" description="Adjust additional monthly spend to show the founder tradeoff live.">
          <div className="rounded-xl border border-hairline bg-surface-2 p-5">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Estimated runway</p>
                <p className="mt-2 font-mono text-6xl font-bold leading-none text-ink md:text-8xl">{runway.toFixed(1)}</p>
                <p className="mt-2 text-body-framer-sm text-ink-muted">months after the current spend scenario</p>
              </div>
              <div className="rounded-xl border border-hairline bg-surface-1 p-4 text-right">
                <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Added burn</p>
                <p className="mt-1 font-mono text-2xl font-bold text-ink">${burnDelta.toLocaleString()}/mo</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="1200"
              value={burnDelta}
              onChange={(event) => setBurnDelta(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-1 accent-ink"
            />
            <div className="mt-4 flex items-center justify-between text-caption text-ink-muted">
              <span>Lean pilot</span>
              <span>Growth push</span>
            </div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="xl:col-span-4" title="Metric controls">
          <div className="space-y-3">
            {[
              ["CAC", "$18.40", "Stable after mentor feedback"],
              ["Activation", "42.8%", "Up 6.1 points"],
              ["Churn", "3.7%", "Below danger threshold"],
            ].map(([label, value, detail]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-hairline bg-surface-2 p-4">
                <div>
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
                  <p className="mt-1 font-mono text-xl font-bold text-ink">{value}</p>
                  <p className="mt-1 text-caption text-ink-muted">{detail}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => setToast({ title: `${label} decreased`, description: "Demo adjustment only." })}>
                    <Minus className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setToast({ title: `${label} increased`, description: "Demo adjustment only." })}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      {widgetVisible ? (
        <WorkspaceCard className="mt-5 border-accent-blue/30" title="Investor readiness widget" description="Added during the demo via the Add Widget action.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              ["Narrative clarity", "78%"],
              ["Legal readiness", "91%"],
              ["Mentor proof", "63%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-hairline bg-surface-2 p-4">
                <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
                <p className="mt-2 font-mono text-3xl font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </WorkspaceCard>
      ) : null}

      <WorkspaceActionModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Metric filters"
        description="These filters are local demo controls. They update the story without touching backend data."
        footer={<Button onClick={() => setFilterOpen(false)}>Apply filters</Button>}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {["Last 30 days", "Pilot cohort", "Investor view", "Mentor notes"].map((label) => (
            <label key={label} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3 text-body-framer-sm text-ink">
              <input type="checkbox" defaultChecked={label !== "Mentor notes"} className="size-4 accent-ink" />
              {label}
            </label>
          ))}
        </div>
      </WorkspaceActionModal>

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
