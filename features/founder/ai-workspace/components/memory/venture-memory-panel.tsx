"use client";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  ContextConflict,
  VentureMemoryItem,
  VentureMemoryStatus,
} from "../../types/long-run-workspace.types";
import { ContextConflictCard } from "./context-conflict-card";
import { MemoryItemCard } from "./memory-item-card";

export function VentureMemoryPanel({
  memory,
  conflicts,
  stateVersion,
  copy,
  onSetStatus,
  onResolveConflict,
  onAsk,
  onOpenSource,
}: {
  memory: VentureMemoryItem[];
  conflicts: ContextConflict[];
  stateVersion: number;
  copy: AiWorkspaceCopy["longRun"];
  onSetStatus: (
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
  onAsk: (item: VentureMemoryItem) => void;
  onOpenSource: (item: VentureMemoryItem) => void;
}) {
  const groups = [
    {
      label: copy.memory.verified,
      items: memory.filter((item) => item.status === "verified"),
    },
    {
      label: copy.memory.assumptions,
      items: memory.filter(
        (item) =>
          item.status === "assumed" ||
          item.status === "inferred",
      ),
    },
    {
      label: copy.memory.disputed,
      items: memory.filter((item) => item.status === "disputed"),
    },
    {
      label: copy.memory.outdated,
      items: memory.filter(
        (item) =>
          item.status === "outdated" ||
          item.status === "superseded" ||
          item.status === "missing",
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {conflicts.map((conflict) => (
        <ContextConflictCard
          key={conflict.id}
          conflict={conflict}
          copy={copy}
          onResolve={(resolution, valueId) =>
            onResolveConflict(
              conflict.id,
              resolution,
              valueId,
            )
          }
        />
      ))}

      {groups.map((group) =>
        group.items.length > 0 ? (
          <section key={group.label}>
            <h2 className="mb-2 workspace-eyebrow text-workspace-muted-text">
              {group.label} · {group.items.length}
            </h2>
            <div className="space-y-2">
              {group.items.map((item) => (
                <MemoryItemCard
                  key={item.id}
                  item={item}
                  stateVersion={stateVersion}
                  copy={copy}
                  onSetStatus={(status) =>
                    onSetStatus(item.id, status)
                  }
                  onAsk={() => onAsk(item)}
                  onOpenSource={() => onOpenSource(item)}
                />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}
