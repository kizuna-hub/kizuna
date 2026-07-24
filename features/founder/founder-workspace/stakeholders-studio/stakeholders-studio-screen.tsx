"use client";

import React from "react";
import { Bold, Download, Italic, Link2, Plus, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
  WorkspaceCard,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import { cn } from "@/lib/utils";

const metricBlocks = [
  { label: "MRR", value: "$124.5k", trend: "+18.2%" },
  { label: "Active pilots", value: "14", trend: "+4" },
  { label: "Investor opens", value: "38", trend: "+11" },
  { label: "Runway", value: "8.7 mo", trend: "-0.6" },
];

export function StakeholdersStudioScreen() {
  const [title, setTitle] = React.useState("April 2026: The expansion phase");
  const [tone, setTone] = React.useState<"plain" | "bold" | "italic">("plain");
  const [shared, setShared] = React.useState(false);
  const [metricCount, setMetricCount] = React.useState(2);
  const [toast, setToast] = React.useState<DemoToastState>(null);

  const addMetric = () => {
    setMetricCount((count) => Math.min(metricBlocks.length, count + 1));
    setToast({ tone: "success", title: "Metric inserted", description: "The update now includes another live metric block." });
  };

  return (
    <div>
      <WorkspacePageHeader
        eyebrow="Stakeholders Studio"
        title="Write one update for mentors, investors, and operators."
        description="A demo editor for polished stakeholder updates with live metric cards, export feedback, and share state."
        actions={
          <>
            <Button onClick={() => setToast({ title: "AI draft improved", description: "The opening paragraph was tightened for investor scanability." })}>
              <Sparkles className="size-4" />
              AI polish
            </Button>
            <Button variant="secondary" onClick={() => setShared(true)}>
              <Share2 className="size-4" />
              Share
            </Button>
            <Button variant="secondary" onClick={() => setToast({ tone: "success", title: "Export ready", description: "PDF export queued for the demo." })}>
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard className="xl:col-span-8">
          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-hairline bg-surface-2 p-2">
            <Button variant={tone === "bold" ? "default" : "ghost"} size="icon-sm" onClick={() => setTone(tone === "bold" ? "plain" : "bold")} aria-label="Bold">
              <Bold className="size-4" />
            </Button>
            <Button variant={tone === "italic" ? "default" : "ghost"} size="icon-sm" onClick={() => setTone(tone === "italic" ? "plain" : "italic")} aria-label="Italic">
              <Italic className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setToast({ title: "Link attached", description: "Data room reference added to the update." })} aria-label="Add link">
              <Link2 className="size-4" />
            </Button>
            <div className="ml-auto text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">
              {shared ? "Shared draft" : "Private draft"}
            </div>
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={cn(
              "w-full border-0 bg-transparent font-display text-display-md text-ink outline-none md:text-display-lg",
              tone === "bold" && "font-bold",
              tone === "italic" && "italic"
            )}
          />

          <div className="mt-6 space-y-5 text-body-framer text-ink-muted">
            <p>
              This month we moved from prototype validation into controlled expansion. The strongest signal is not only revenue growth, but the quality of repeat usage across pilot cohorts.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {metricBlocks.slice(0, metricCount).map((metric) => (
                <div key={metric.label} className="rounded-xl border border-hairline bg-surface-2 p-4">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{metric.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="font-mono text-3xl font-bold text-ink">{metric.value}</p>
                    <span className="rounded-full border border-hairline bg-surface-1 px-2 py-1 font-mono text-caption font-bold text-ink-muted">{metric.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <p>
              Next month, the team will prioritize investor data room readiness, mentor-led positioning, and burn-rate discipline before widening the pilot pipeline.
            </p>
          </div>
        </WorkspaceCard>

        <div className="space-y-5 xl:col-span-4">
          <WorkspaceCard title="Metric palette" description="Insert live blocks into the update.">
            <div className="space-y-3">
              {metricBlocks.map((metric, index) => (
                <button
                  key={metric.label}
                  onClick={() => {
                    setMetricCount(Math.max(metricCount, index + 1));
                    setToast({ title: `${metric.label} inserted`, description: "Metric block visible in the stakeholder update." });
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface-2 p-3 text-left transition-colors hover:bg-surface-1"
                >
                  <span className="text-body-framer-sm font-bold text-ink">{metric.label}</span>
                  <span className="font-mono text-body-framer-sm text-ink-muted">{metric.value}</span>
                </button>
              ))}
            </div>
            <Button variant="secondary" className="mt-4 w-full" onClick={addMetric}>
              <Plus className="size-4" />
              Add metric block
            </Button>
          </WorkspaceCard>

          <WorkspaceCard title="Engagement heatmap">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "aspect-square rounded-md border border-hairline",
                    index % 5 === 0 ? "bg-ink" : index % 3 === 0 ? "bg-ink-muted" : "bg-surface-2"
                  )}
                />
              ))}
            </div>
          </WorkspaceCard>
        </div>
      </div>

      <WorkspaceActionModal
        open={shared}
        onClose={() => setShared(false)}
        title="Stakeholder update shared"
        description="The demo state is marked as shared. No external email is sent."
        footer={<Button onClick={() => setShared(false)}>Done</Button>}
      />

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
