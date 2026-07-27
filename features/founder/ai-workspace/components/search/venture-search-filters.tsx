import React from "react";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { VentureSearchFilters } from "../../types/long-run-workspace.types";

function SearchFilter({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 max-w-full rounded-lg border border-workspace-border bg-workspace-elevated px-2 workspace-meta text-ink outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
      >
        {children}
      </select>
    </label>
  );
}

export function VentureSearchFiltersPanel({
  filters,
  copy,
  onChange,
}: {
  filters: VentureSearchFilters;
  copy: AiWorkspaceCopy["longRun"];
  onChange: <Key extends keyof VentureSearchFilters>(
    key: Key,
    value: VentureSearchFilters[Key],
  ) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-workspace-border px-3 py-2">
      <SearchFilter
        label={copy.search.contentType}
        value={filters.contentType}
        onChange={(value) =>
          onChange(
            "contentType",
            value as VentureSearchFilters["contentType"],
          )
        }
      >
        <option value="all">{copy.search.all}</option>
        {Object.entries(copy.search.types).map(
          ([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ),
        )}
      </SearchFilter>
      <SearchFilter
        label={copy.search.dateRange}
        value={filters.dateRange}
        onChange={(value) =>
          onChange(
            "dateRange",
            value as VentureSearchFilters["dateRange"],
          )
        }
      >
        <option value="all">{copy.search.dates.all}</option>
        <option value="7_days">{copy.search.dates.sevenDays}</option>
        <option value="30_days">
          {copy.search.dates.thirtyDays}
        </option>
        <option value="older">{copy.search.dates.older}</option>
      </SearchFilter>
      <SearchFilter
        label={copy.search.decisionCycle}
        value={filters.decisionCycleId}
        onChange={(value) =>
          onChange("decisionCycleId", value)
        }
      >
        <option value="all">{copy.search.all}</option>
        <option value="cycle-onboarding-activation">
          {copy.search.cycles.onboarding}
        </option>
        <option value="cycle-pricing">
          {copy.search.cycles.pricing}
        </option>
      </SearchFilter>
      <SearchFilter
        label={copy.search.status}
        value={filters.status}
        onChange={(value) =>
          onChange(
            "status",
            value as VentureSearchFilters["status"],
          )
        }
      >
        <option value="all">{copy.search.all}</option>
        {Object.entries(copy.memory.statuses).map(
          ([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ),
        )}
      </SearchFilter>
      <SearchFilter
        label={copy.search.contributor}
        value={filters.contributor}
        onChange={(value) =>
          onChange(
            "contributor",
            value as VentureSearchFilters["contributor"],
          )
        }
      >
        {Object.entries(copy.search.contributors).map(
          ([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ),
        )}
      </SearchFilter>
      <label className="flex h-9 items-center gap-2 rounded-lg border border-workspace-border bg-workspace-elevated px-2 workspace-meta text-ink">
        <input
          type="checkbox"
          checked={filters.pinnedOnly}
          onChange={(event) =>
            onChange("pinnedOnly", event.target.checked)
          }
        />
        {copy.search.pinnedOnly}
      </label>
    </div>
  );
}
