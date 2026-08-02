"use client";

import React from "react";
import {
  Archive,
  GitCompare,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  MaterialVersion,
  MaterialVersionStatus,
} from "../../types/long-run-workspace.types";

export function MaterialVersionsPanel({
  materials,
  copy,
  onSetStatus,
  onRemove,
}: {
  materials: MaterialVersion[];
  copy: AiWorkspaceCopy["longRun"];
  onSetStatus: (
    materialId: string,
    status: MaterialVersionStatus,
  ) => void;
  onRemove: (materialId: string) => void;
}) {
  const [compareFamilyId, setCompareFamilyId] =
    React.useState<string>();
  const [deleteTarget, setDeleteTarget] =
    React.useState<MaterialVersion>();
  const replacement = deleteTarget
    ? materials.find(
        (material) =>
          material.id !== deleteTarget.id &&
          material.familyId === deleteTarget.familyId &&
          material.status !== "archived",
      )
    : undefined;

  return (
    <>
      <div className="space-y-3">
        {materials.map((material) => (
          <article
            key={material.id}
            className="rounded-xl border border-workspace-border bg-workspace-panel p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate workspace-supporting font-medium text-ink">
                  {material.name}
                </h3>
                <p className="mt-1 workspace-meta text-workspace-muted-text">
                  {material.versionLabel} ·{" "}
                  {new Intl.DateTimeFormat("vi-VN").format(
                    new Date(material.createdAt),
                  )}
                </p>
              </div>
              <span className="rounded-pill border border-workspace-border bg-workspace-elevated px-2 py-0.5 workspace-meta text-workspace-muted-text">
                {copy.documents[material.status]}
              </span>
            </div>
            <p className="mt-2 workspace-meta leading-5 text-workspace-muted-text">
              {material.summary}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setCompareFamilyId((current) =>
                    current === material.familyId
                      ? undefined
                      : material.familyId,
                  )
                }
              >
                <GitCompare className="size-3.5" />
                {copy.documents.compare}
              </Button>
              {material.status !== "canonical" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onSetStatus(material.id, "canonical")
                  }
                >
                  <ShieldCheck className="size-3.5" />
                  {copy.documents.markCanonical}
                </Button>
              ) : null}
              {material.status !== "archived" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onSetStatus(material.id, "archived")
                  }
                >
                  <Archive className="size-3.5" />
                  {copy.documents.archive}
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setDeleteTarget(material)}
              >
                <Trash2 className="size-3.5" />
                {copy.documents.delete}
              </Button>
            </div>

            {compareFamilyId === material.familyId ? (
              <div className="mt-2 rounded-lg border border-workspace-border bg-workspace-elevated p-2.5">
                <p className="workspace-supporting font-medium text-ink">
                  {copy.documents.compare}
                </p>
                <ul className="mt-1 space-y-1">
                  {materials
                    .filter(
                      (candidate) =>
                        candidate.familyId === material.familyId,
                    )
                    .flatMap((candidate) =>
                      candidate.comparisonNotes.map((note) => (
                        <li
                          key={`${candidate.id}-${note}`}
                          className="workspace-meta text-workspace-muted-text"
                        >
                          <span className="font-medium text-ink">
                            {candidate.versionLabel}:
                          </span>{" "}
                          {note}
                        </li>
                      )),
                    )}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(undefined);
        }}
      >
        <AlertDialogContent className="border-workspace-border bg-workspace-panel">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {copy.documents.deleteTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {copy.documents.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTarget ? (
            <ul className="space-y-1 rounded-lg border border-workspace-border bg-workspace-elevated p-3 workspace-supporting text-ink">
              <li>
                {copy.documents.dependencyMemory(
                  deleteTarget.dependencies.memoryItems,
                )}
              </li>
              <li>
                {copy.documents.dependencyReadiness(
                  deleteTarget.dependencies.readinessDimensions,
                )}
              </li>
              <li>
                {copy.documents.dependencyCycles(
                  deleteTarget.dependencies.activeDecisionCycles,
                )}
              </li>
            </ul>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel>
              {copy.common.cancel}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              disabled={!replacement}
              onClick={() => {
                if (!replacement) return;
                onSetStatus(replacement.id, "canonical");
                setDeleteTarget(undefined);
              }}
            >
              {copy.documents.chooseReplacement}
            </Button>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) onRemove(deleteTarget.id);
                setDeleteTarget(undefined);
              }}
            >
              {copy.documents.deleteAndMarkMissing}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
