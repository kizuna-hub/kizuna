"use client";

import {
  BrainCircuit,
  Clock3,
  FileText,
  Pin,
  Sparkles,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type { AiWorkspaceCopy } from "../copy/types";
import type {
  ConversationSummaryStatus,
  LongRunWorkspaceState,
  MaterialVersionStatus,
  PinnedItemReference,
  SessionSummary,
  TimelineEvent,
  VentureMemoryItem,
  VentureMemoryStatus,
} from "../types/long-run-workspace.types";
import { MaterialVersionsPanel } from "./documents/material-versions-panel";
import { VentureMemoryPanel } from "./memory/venture-memory-panel";
import { PinnedItemsPanel } from "./saved/pinned-items-panel";
import { SessionSummaryCard } from "./summary/session-summary-card";
import { DecisionTimeline } from "./timeline/decision-timeline";

export type LongRunSurface =
  | "memory"
  | "summary"
  | "timeline"
  | "documents"
  | "pinned";

const surfaceIcons = {
  memory: BrainCircuit,
  summary: Sparkles,
  timeline: Clock3,
  documents: FileText,
  pinned: Pin,
} satisfies Record<LongRunSurface, typeof BrainCircuit>;

export function LongRunArtifactSheet({
  open,
  surface,
  state,
  activeSummary,
  copy,
  onOpenChange,
  onSurfaceChange,
  onSetMemoryStatus,
  onResolveConflict,
  onEditSummaryItem,
  onSetSummaryStatus,
  onSetMaterialStatus,
  onRemoveMaterial,
  onTogglePin,
  onAsk,
  onOpenCycle,
}: {
  open: boolean;
  surface: LongRunSurface;
  state: LongRunWorkspaceState;
  activeSummary?: SessionSummary;
  copy: AiWorkspaceCopy["longRun"];
  onOpenChange: (open: boolean) => void;
  onSurfaceChange: (surface: LongRunSurface) => void;
  onSetMemoryStatus: (
    memoryId: string,
    status: VentureMemoryStatus,
  ) => void;
  onResolveConflict: (
    conflictId: string,
    resolution:
      | "set_current"
      | "future_direction"
      | "parallel_hypotheses",
    valueId: string,
  ) => void;
  onEditSummaryItem: (
    summaryId: string,
    sectionId: string,
    itemIndex: number,
    value: string,
  ) => void;
  onSetSummaryStatus: (
    summaryId: string,
    status: ConversationSummaryStatus,
  ) => void;
  onSetMaterialStatus: (
    materialId: string,
    status: MaterialVersionStatus,
  ) => void;
  onRemoveMaterial: (materialId: string) => void;
  onTogglePin: (item: PinnedItemReference) => void;
  onAsk: (sourceId: string, title: string) => void;
  onOpenCycle: () => void;
}) {
  const titleBySurface: Record<LongRunSurface, string> = {
    memory: copy.memory.title,
    summary: copy.summary.title,
    timeline: copy.timeline.title,
    documents: copy.documents.title,
    pinned: copy.saved.title,
  };
  const descriptionBySurface: Record<LongRunSurface, string> = {
    memory: copy.memory.description,
    summary: copy.summary.description,
    timeline: copy.timeline.description,
    documents: copy.documents.description,
    pinned: copy.saved.description,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-workspace-border bg-workspace-background p-0 sm:max-w-3xl"
      >
        <SheetHeader className="border-b border-workspace-border px-4 py-3 pr-12 text-left">
          <SheetTitle className="workspace-section-title text-ink">
            {titleBySurface[surface]}
          </SheetTitle>
          <SheetDescription className="workspace-meta text-workspace-muted-text">
            {descriptionBySurface[surface]}
          </SheetDescription>
        </SheetHeader>

        <Tabs
          value={surface}
          onValueChange={(value) =>
            onSurfaceChange(value as LongRunSurface)
          }
          className="min-h-0 flex-1"
        >
          <div className="overflow-x-auto border-b border-workspace-border px-3 py-2">
            <TabsList className="h-10 w-max bg-workspace-elevated">
              {(
                Object.keys(surfaceIcons) as LongRunSurface[]
              ).map((value) => {
                const Icon = surfaceIcons[value];
                return (
                  <TabsTrigger key={value} value={value}>
                    <Icon className="size-3.5" />
                    {copy.surfaces[value]}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="h-[calc(100dvh-8.5rem)] overflow-y-auto p-3 sm:p-4">
            <TabsContent value="memory" className="mt-0">
              <VentureMemoryPanel
                memory={state.memory}
                conflicts={state.conflicts}
                stateVersion={state.stateVersion}
                copy={copy}
                onSetStatus={onSetMemoryStatus}
                onResolveConflict={onResolveConflict}
                onAsk={(item: VentureMemoryItem) =>
                  onAsk(item.id, item.title)
                }
                onOpenSource={(item) => {
                  if (
                    item.sourceIds.some((sourceId) =>
                      sourceId.startsWith("material-"),
                    )
                  ) {
                    onSurfaceChange("documents");
                  } else if (
                    item.type === "decision" ||
                    item.type === "evidence" ||
                    item.type === "outcome"
                  ) {
                    onSurfaceChange("timeline");
                  } else {
                    onSurfaceChange("pinned");
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="summary" className="mt-0">
              {activeSummary ? (
                <SessionSummaryCard
                  summary={activeSummary}
                  copy={copy}
                  onEditItem={(sectionId, index, value) =>
                    onEditSummaryItem(
                      activeSummary.id,
                      sectionId,
                      index,
                      value,
                    )
                  }
                  onConfirm={() =>
                    onSetSummaryStatus(
                      activeSummary.id,
                      "confirmed",
                    )
                  }
                  onUpdateMemory={() =>
                    onSetSummaryStatus(
                      activeSummary.id,
                      "memory_updated",
                    )
                  }
                  onSkip={() => onOpenChange(false)}
                />
              ) : (
                <p className="py-12 text-center workspace-supporting text-workspace-muted-text">
                  {copy.summary.description}
                </p>
              )}
            </TabsContent>
            <TabsContent value="timeline" className="mt-0">
              <DecisionTimeline
                events={state.timeline}
                readinessHistory={state.readinessHistory}
                copy={copy}
                onAsk={(event: TimelineEvent) =>
                  onAsk(event.id, event.title)
                }
                onOpenCycle={() => {
                  onOpenChange(false);
                  onOpenCycle();
                }}
              />
            </TabsContent>
            <TabsContent value="documents" className="mt-0">
              <MaterialVersionsPanel
                materials={state.materialVersions}
                copy={copy}
                onSetStatus={onSetMaterialStatus}
                onRemove={onRemoveMaterial}
              />
            </TabsContent>
            <TabsContent value="pinned" className="mt-0">
              <PinnedItemsPanel
                items={state.pinnedItems}
                copy={copy}
                onUnpin={onTogglePin}
                onAsk={(item) => onAsk(item.sourceId, item.title)}
                onOpenOriginal={(item) =>
                  onSurfaceChange(
                    item.itemType === "document"
                      ? "documents"
                      : "memory",
                  )
                }
              />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
