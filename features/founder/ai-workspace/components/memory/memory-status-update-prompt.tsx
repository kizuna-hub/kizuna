import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { VentureMemoryStatus } from "../../types/long-run-workspace.types";

export function MemoryStatusUpdatePrompt({
  currentStatus,
  pendingStatus,
  expectedVersion,
  currentVersion,
  versionConflict,
  comparisonOpen,
  copy,
  onApply,
  onReload,
  onCompare,
  onCancel,
}: {
  currentStatus: VentureMemoryStatus;
  pendingStatus: VentureMemoryStatus;
  expectedVersion: number;
  currentVersion: number;
  versionConflict: boolean;
  comparisonOpen: boolean;
  copy: AiWorkspaceCopy["longRun"];
  onApply: () => void;
  onReload: () => void;
  onCompare: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-2 rounded-lg border border-workspace-border bg-workspace-elevated p-2">
      {versionConflict ? (
        <div role="alert" className="flex gap-2">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-workspace-warning" />
          <div>
            <p className="workspace-meta text-ink">
              {copy.memory.versionConflict}
            </p>
            {comparisonOpen ? (
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                {copy.memory.versionComparison(
                  expectedVersion,
                  currentVersion,
                )}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="workspace-meta text-workspace-muted-text">
          {copy.memory.statuses[currentStatus]} →{" "}
          {copy.memory.statuses[pendingStatus]}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        {versionConflict ? (
          <>
            <Button type="button" size="sm" onClick={onReload}>
              {copy.memory.reloadContext}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onCompare}
            >
              {copy.memory.compareChanges}
            </Button>
          </>
        ) : (
          <Button type="button" size="sm" onClick={onApply}>
            {copy.memory.confirmUpdate}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
        >
          {copy.memory.cancelUpdate}
        </Button>
      </div>
    </div>
  );
}
