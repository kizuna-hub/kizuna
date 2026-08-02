"use client";

import type { ConfidenceLevel } from "../../../core";
import type { BaselineFieldKey } from "../../domain";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { baselineFieldLabels } from "../../application";

export function BaselineFieldEditor({
  fieldKey,
  value,
  status,
  confidence,
  sourceCount,
  founderConfirmed,
  onChange,
}: {
  fieldKey: BaselineFieldKey;
  value: string;
  status: string;
  confidence: ConfidenceLevel;
  sourceCount: number;
  founderConfirmed: boolean;
  onChange: (patch: {
    value?: string;
    confidence?: ConfidenceLevel;
    founderConfirmed?: boolean;
  }) => void;
}) {
  return (
    <div className="rounded-lg border border-workspace-border bg-workspace-panel p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Label
          htmlFor={`baseline-${fieldKey}`}
          className="workspace-body font-semibold text-ink"
        >
          {baselineFieldLabels[fieldKey]}
        </Label>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="capitalize">
            {status.replace("-", " ")}
          </Badge>
          <Badge variant="outline">
            {sourceCount} source{sourceCount === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>
      <Textarea
        id={`baseline-${fieldKey}`}
        className="mt-2 min-h-20"
        value={value}
        onChange={(event) => onChange({ value: event.target.value })}
        aria-describedby={`baseline-${fieldKey}-meta`}
      />
      <div
        id={`baseline-${fieldKey}-meta`}
        className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2">
          <Label
            htmlFor={`baseline-${fieldKey}-confidence`}
            className="workspace-meta text-workspace-muted-text"
          >
            Confidence
          </Label>
          <select
            id={`baseline-${fieldKey}-confidence`}
            value={confidence}
            onChange={(event) =>
              onChange({
                confidence: event.target.value as ConfidenceLevel,
              })
            }
            className="h-8 rounded-md border border-input bg-transparent px-2 workspace-meta text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="low">Low</option>
            <option value="developing">Developing</option>
            <option value="moderate">Moderate</option>
            <option value="strong">Strong</option>
          </select>
        </div>
        <label className="flex min-h-8 items-center gap-2 workspace-meta text-workspace-muted-text">
          <Checkbox
            checked={founderConfirmed}
            onCheckedChange={(checked) =>
              onChange({ founderConfirmed: checked === true })
            }
          />
          Founder-confirmed
        </label>
      </div>
    </div>
  );
}
