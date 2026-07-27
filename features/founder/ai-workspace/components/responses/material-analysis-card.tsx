import { CheckCircle2, Files, MessageSquareWarning } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { MaterialAnalysis } from "../../types/ai-workspace.types";
import { StatusBadge } from "../shared/status-badge";
import { ResponseCardShell } from "./response-card-shell";

export function MaterialAnalysisCard({
  analysis,
  copy,
  onConfirm,
  onChallenge,
  onCreateCycle,
}: {
  analysis: MaterialAnalysis;
  copy: AiWorkspaceCopy;
  onConfirm: () => void;
  onChallenge: () => void;
  onCreateCycle: () => void;
}) {
  return (
    <ResponseCardShell
      eyebrow={copy.response.materialAnalysis}
      title={analysis.summary}
      icon={<Files className="size-4" />}
      actions={
        <>
          <Button size="sm" onClick={onConfirm}>
            <CheckCircle2 className="size-3.5" />
            {copy.response.confirmInterpretation}
          </Button>
          <Button size="sm" variant="ghost" onClick={onChallenge}>
            <MessageSquareWarning className="size-3.5" />
            {copy.response.challengeInterpretation}
          </Button>
          <Button size="sm" variant="ghost" onClick={onCreateCycle}>
            {copy.response.createCycle}
          </Button>
        </>
      }
    >
      {analysis.interpretationStatus !== "pending" ? (
        <p className="mb-3 rounded-lg border border-primary-border bg-primary-soft px-3 py-2 workspace-meta font-medium text-primary">
          {analysis.interpretationStatus === "confirmed"
            ? copy.response.interpretationConfirmed
            : copy.response.interpretationDisputed}
        </p>
      ) : null}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {analysis.fileNames.map((fileName) => (
          <span
            key={fileName}
            className="max-w-full truncate rounded-md border border-workspace-border bg-workspace-elevated px-2 py-1 workspace-meta text-workspace-muted-text"
          >
            {fileName}
          </span>
        ))}
      </div>
      <ul className="divide-y divide-workspace-border">
        {analysis.findings.map((finding) => (
          <li
            key={finding.id}
            className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="workspace-card-title text-ink">
                {finding.label}
              </p>
              <p className="mt-0.5 workspace-meta text-workspace-muted-text">
                {finding.detail}
              </p>
            </div>
            <StatusBadge
              status={finding.status}
              copy={copy.statuses}
            />
          </li>
        ))}
      </ul>
    </ResponseCardShell>
  );
}
