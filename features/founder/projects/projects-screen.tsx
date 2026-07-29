"use client";

import React from "react";
import {
  Grid2X2,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  SortDesc,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { ProjectCard } from "@/features/founder/projects/components/project-card";
import {
  formatProjectActivity,
  getProjectPortfolioReferenceTime,
  groupProjectVenturesByActivity,
  sortProjectVentures,
} from "@/features/founder/projects/project-portfolio";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import {
  getAllVentures,
  getFilteredVentures,
  ventureStageLabels,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import type {
  ProjectsSort,
  ProjectsViewMode,
  VentureStage,
  VentureStatus,
} from "@/features/founder/venture-foundation/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const projectStatusLabels: Record<VentureStatus, string> = {
  setup: "Khởi tạo",
  active: "Đang hoạt động",
  paused: "Tạm dừng",
  archived: "Đã lưu trữ",
};

const selectContentClassName =
  "w-[var(--radix-select-trigger-width)] border-workspace-border bg-workspace-elevated text-ink shadow-framer-edge";
const selectItemClassName =
  "workspace-input-text cursor-pointer text-workspace-muted-text focus:bg-workspace-row-hover focus:text-ink data-[state=checked]:bg-workspace-selected data-[state=checked]:text-primary";

export function ProjectsScreen() {
  const searchParams = useSearchParams();
  const { state, updateUiPreferences } = useDemoWorkspace();
  const ventures = getAllVentures(state);
  const query = state.uiPreferences.projectsQuery;
  const stage = state.uiPreferences.projectsStageFilter;
  const status =
    state.uiPreferences.projectsStatusFilter ?? "all";
  const sort = state.uiPreferences.projectsSort ?? "last-edited";
  const view = state.uiPreferences.projectsView ?? "grid";
  const notice = searchParams.get("notice");

  const stages = React.useMemo(
    () =>
      Array.from(new Set(ventures.map((venture) => venture.stage))).sort(
        (left, right) =>
          ventureStageLabels[left].localeCompare(
            ventureStageLabels[right],
          ),
      ),
    [ventures],
  );

  const statuses = React.useMemo(
    () =>
      Array.from(
        new Set(ventures.map((venture) => venture.status)),
      ),
    [ventures],
  );

  const referenceTime = React.useMemo(
    () => getProjectPortfolioReferenceTime(ventures),
    [ventures],
  );

  const visibleVentures = React.useMemo(() => {
    const filtered = getFilteredVentures(state, {
      query,
      stage,
      status,
    });
    return sortProjectVentures(filtered, sort);
  }, [query, sort, stage, state, status]);

  const activityGroups = React.useMemo(
    () =>
      groupProjectVenturesByActivity(
        visibleVentures,
        referenceTime,
      ),
    [referenceTime, visibleVentures],
  );

  const activeFilterCount =
    Number(Boolean(query.trim())) +
    Number(stage !== "all") +
    Number(status !== "all");

  const clearFilters = () => {
    updateUiPreferences({
      projectsQuery: "",
      projectsStageFilter: "all",
      projectsStatusFilter: "all",
    });
  };

  const updateView = (value: string) => {
    if (value === "grid" || value === "list") {
      updateUiPreferences({
        projectsView: value as ProjectsViewMode,
      });
    }
  };

  return (
    <FounderShell
      contentWidth="fluid"
      contentClassName="max-w-[1240px]"
    >
      <div className="space-y-5">
        <header className="flex flex-col gap-3 border-b border-workspace-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="workspace-eyebrow text-primary">
              Danh mục dự án
            </p>
            <h1 className="mt-1.5 workspace-page-title text-ink">
              Dự án
            </h1>
            <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
              Tìm dự án và tiếp tục công việc của bạn.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-8 self-start rounded-lg px-3.5 text-xs font-semibold shadow-none sm:self-auto"
          >
            <Link href="/founder/projects/new">
              <Plus className="size-3.5" />
              Tạo dự án
            </Link>
          </Button>
        </header>

        {notice === "archived" ? (
          <div
            role="status"
            className="rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft px-4 py-3 text-body-framer-sm text-ink"
          >
            Dự án trước đó đã được lưu trữ. Vui lòng chọn một dự án đang hoạt động để tiếp tục.
          </div>
        ) : null}

        <section
          aria-label="Project controls"
          className="space-y-3"
        >
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_160px_160px_142px_auto]">
            <label className="relative min-w-0 sm:col-span-2 xl:col-span-1">
              <span className="sr-only">Tìm kiếm dự án</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-workspace-muted-text" />
              <Input
                value={query}
                onChange={(event) =>
                  updateUiPreferences({
                    projectsQuery: event.target.value,
                  })
                }
                placeholder="Tìm kiếm dự án..."
                className="workspace-input-text h-11 border-workspace-border bg-workspace-panel pl-10 pr-10 lg:h-9"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Xóa tìm kiếm dự án"
                  onClick={() =>
                    updateUiPreferences({ projectsQuery: "" })
                  }
                  className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-workspace-muted-text outline-none transition-colors hover:bg-workspace-row-hover hover:text-ink focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50 lg:size-8"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>

            <Select
              value={sort}
              onValueChange={(value) =>
                updateUiPreferences({
                  projectsSort: value as ProjectsSort,
                })
              }
            >
              <SelectTrigger
                aria-label="Sắp xếp dự án"
                className="workspace-input-text h-11 w-full border-workspace-border bg-workspace-panel px-3 text-ink shadow-none hover:bg-workspace-row-hover lg:h-9"
              >
                <SortDesc className="size-4 text-workspace-muted-text" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className={selectContentClassName}
              >
                <SelectItem
                  value="last-edited"
                  className={selectItemClassName}
                >
                  Chỉnh sửa gần nhất
                </SelectItem>
                <SelectItem
                  value="name"
                  className={selectItemClassName}
                >
                  Tên A–Z
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={stage}
              onValueChange={(value) =>
                updateUiPreferences({
                  projectsStageFilter: value as
                    | VentureStage
                    | "all",
                })
              }
            >
              <SelectTrigger
                aria-label="Lọc dự án theo giai đoạn"
                className="workspace-input-text h-11 w-full border-workspace-border bg-workspace-panel px-3 text-ink shadow-none hover:bg-workspace-row-hover lg:h-9"
              >
                <SlidersHorizontal className="size-4 text-workspace-muted-text" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className={selectContentClassName}
              >
                <SelectItem
                  value="all"
                  className={selectItemClassName}
                >
                  Tất cả giai đoạn
                </SelectItem>
                {stages.map((stageValue) => (
                  <SelectItem
                    key={stageValue}
                    value={stageValue}
                    className={selectItemClassName}
                  >
                    {ventureStageLabels[stageValue]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(value) =>
                updateUiPreferences({
                  projectsStatusFilter: value as
                    | VentureStatus
                    | "all",
                })
              }
            >
              <SelectTrigger
                aria-label="Lọc dự án theo trạng thái"
                className="workspace-input-text h-11 w-full border-workspace-border bg-workspace-panel px-3 text-ink shadow-none hover:bg-workspace-row-hover lg:h-9"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className={selectContentClassName}
              >
                <SelectItem
                  value="all"
                  className={selectItemClassName}
                >
                  Mọi trạng thái
                </SelectItem>
                {statuses.map((statusValue) => (
                  <SelectItem
                    key={statusValue}
                    value={statusValue}
                    className={selectItemClassName}
                  >
                    {projectStatusLabels[statusValue]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={view}
              onValueChange={updateView}
              aria-label="Giao diện dự án"
              variant="outline"
              className="h-11 w-full border-workspace-border bg-workspace-panel p-0.5 shadow-none sm:w-auto lg:h-9"
            >
              <ToggleGroupItem
                value="grid"
                aria-label="Chế độ xem lưới"
                title="Chế độ xem lưới"
                className="h-full min-w-11 border-0 text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink data-[state=on]:bg-workspace-selected data-[state=on]:text-primary lg:min-w-9"
              >
                <Grid2X2 className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="list"
                aria-label="Chế độ xem danh sách"
                title="Chế độ xem danh sách"
                className="h-full min-w-11 border-0 text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink data-[state=on]:bg-workspace-selected data-[state=on]:text-primary lg:min-w-9"
              >
                <List className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
            <p
              className="workspace-meta text-workspace-muted-text"
              aria-live="polite"
            >
              {visibleVentures.length} dự án
              {activeFilterCount
                ? ` · ${activeFilterCount} bộ lọc đang bật`
                : ""}
            </p>
            {activeFilterCount ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-3 workspace-control-text"
              >
                <X className="size-3.5" />
                Xóa bộ lọc
              </Button>
            ) : null}
          </div>
        </section>

        {visibleVentures.length ? (
          <div className="space-y-6">
            {activityGroups.map((group) => (
              <section
                key={group.id}
                aria-labelledby={`project-group-${group.id}`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2
                    id={`project-group-${group.id}`}
                    className="workspace-section-title text-ink"
                  >
                    {group.label}
                  </h2>
                  <span className="workspace-meta tabular-nums text-workspace-muted-text">
                    {group.ventures.length}
                  </span>
                </div>
                <div
                  className={cn(
                    view === "grid"
                      ? "grid gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "space-y-3",
                  )}
                >
                  {group.ventures.map((venture) => (
                    <ProjectCard
                      key={venture.id}
                      venture={venture}
                      view={view}
                      activityLabel={formatProjectActivity(
                        venture.lastUpdatedAt,
                        referenceTime,
                      )}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="rounded-xl border border-workspace-border bg-workspace-panel p-6 text-center">
            <h2 className="workspace-card-title text-ink">
              {ventures.length
                ? "Không có dự án nào phù hợp với bộ lọc"
                : "Tạo dự án đầu tiên của bạn"}
            </h2>
            <p className="mx-auto mt-2 max-w-lg workspace-supporting text-workspace-muted-text">
              {ventures.length
                ? "Xóa các bộ lọc hoặc thử tìm kiếm với từ khóa khác."
                : "Cung cấp một số thông tin cơ bản về dự án để bắt đầu làm việc."}
            </p>
            {ventures.length ? (
              <Button
                variant="secondary"
                className="mt-5"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </Button>
            ) : (
              <Button asChild className="mt-5">
                <Link href="/founder/projects/new">
                  Tạo dự án
                </Link>
              </Button>
            )}
          </section>
        )}
      </div>
    </FounderShell>
  );
}
