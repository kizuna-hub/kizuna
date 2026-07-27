import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  ClipboardCheck,
  FileCheck2,
  FolderKanban,
  FolderPlus,
  GraduationCap,
  Lightbulb,
  MessagesSquare,
  Plus,
  Repeat2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import type {
  FounderHomeState,
  HomeAttentionItem,
  HomeContinuation,
  HomeOtherProject,
  HomeQuickAction,
  HomeRecentActivity,
  HomeSetupJourney,
} from "../lib/home-view-model";

const quickActionIcons: Record<
  HomeQuickAction["kind"],
  LucideIcon
> = {
  context: ClipboardCheck,
  cycle: Repeat2,
  decision: Lightbulb,
};

const attentionIcons: Record<
  HomeAttentionItem["kind"],
  LucideIcon
> = {
  setup: ClipboardCheck,
  session: CalendarClock,
  program: GraduationCap,
};

const activityIcons: Record<
  HomeRecentActivity["type"],
  LucideIcon
> = {
  decision: Lightbulb,
  cycle: Repeat2,
  evidence: FileCheck2,
  support: MessagesSquare,
  program: GraduationCap,
  project: FolderKanban,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatMeta(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : formatDateTime(value);
}

export function HomePageHeader({
  userName,
  state,
}: {
  userName: string;
  state: FounderHomeState;
  entryPreference?: "continue-last-work" | "hub-home";
  onEntryPreferenceChange?: (
    value: "continue-last-work" | "hub-home",
  ) => void;
}) {
  const isFirstProject = state === "no-venture";

  return (
    <header className="flex flex-col gap-4 border-b border-workspace-border pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="workspace-eyebrow text-primary">
          Kizuna Home
        </p>
        <h1 className="mt-1.5 workspace-page-title text-ink">
          {isFirstProject
            ? `Chào mừng đến với Kizuna, ${userName}`
            : `Chào mừng trở lại, ${userName}`}
        </h1>
        <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
          {isFirstProject
            ? "Kizuna đồng hành để bạn tạo venture đầu tiên."
            : "Tiếp tục công việc quan trọng trên các venture đang hoạt động."}
        </p>
      </div>
      <div className="flex shrink-0 sm:items-end">
        <Button
          asChild
          size="sm"
          className="h-8 rounded-lg px-3.5 text-xs font-semibold shadow-none"
        >
          <Link href="/founder/projects/new">
            <Plus className="size-3.5" />
            Tạo venture mới
          </Link>
        </Button>
      </div>
    </header>
  );
}

export function NoVentureHome() {
  return (
    <section
      aria-labelledby="start-first-project"
      className="rounded-xl border border-workspace-border bg-workspace-panel p-5"
    >
      <span className="flex size-10 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
        <FolderPlus className="size-5" aria-hidden="true" />
      </span>
      <h2
        id="start-first-project"
        className="mt-4 workspace-section-title text-ink"
      >
        Tạo venture đầu tiên
      </h2>
      <p className="mt-1.5 max-w-xl workspace-supporting text-workspace-muted-text">
        Bắt đầu từ tài liệu, hội thoại hoặc một venture trống. Kizuna
        sẽ giúp bạn tạo context và mở workspace đầu tiên.
      </p>
      <ul className="mt-4 grid gap-2 workspace-supporting text-workspace-muted-text sm:grid-cols-3">
        {[
          "Tạo context ban đầu",
          "Xác định điểm nghẽn",
          "Theo dõi mức độ sẵn sàng",
        ].map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <Check
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className="mt-5 workspace-control-text h-11 px-4 lg:h-9"
      >
        <Link href="/founder/projects/new">
          Bắt đầu
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </section>
  );
}

export function GettingStartedJourney({
  journey,
}: {
  journey: HomeSetupJourney;
}) {
  return (
    <section
      aria-labelledby="getting-started-title"
      className="overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel"
    >
      <div className="border-b border-workspace-border px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="workspace-eyebrow text-primary">
            Getting started
          </p>
          <span className="workspace-meta text-workspace-muted-text">
            Step {journey.currentStep} of {journey.totalSteps}
          </span>
        </div>
        <h2
          id="getting-started-title"
          className="mt-1.5 workspace-section-title text-ink"
        >
          Set up {journey.ventureName}
        </h2>
      </div>

      <ol className="divide-y divide-workspace-border">
        {journey.steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = step.status === "current";
          const isCompleted = step.status === "completed";

          return (
            <li
              key={step.label}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex gap-3 px-4 py-3",
                isCurrent && "bg-workspace-elevated py-4",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border workspace-meta font-semibold",
                  isCompleted &&
                    "border-primary-border bg-primary-soft text-primary",
                  isCurrent &&
                    "border-primary bg-primary text-on-primary",
                  step.status === "upcoming" &&
                    "border-workspace-border text-workspace-muted-text",
                )}
                aria-hidden="true"
              >
                {isCompleted ? (
                  <Check className="size-3.5" />
                ) : (
                  stepNumber
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "workspace-supporting font-medium",
                    isCurrent || isCompleted
                      ? "text-ink"
                      : "text-workspace-muted-text",
                  )}
                >
                  {step.label}
                </p>
                {isCurrent ? (
                  <>
                    <p className="mt-1 max-w-2xl workspace-supporting text-workspace-muted-text">
                      {journey.description}
                    </p>
                    <Button
                      asChild
                      className="mt-3 workspace-control-text h-11 px-4 lg:h-9"
                    >
                      <Link href={journey.actionHref}>
                        {journey.actionLabel}
                        <ArrowRight
                          className="size-4"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ContinueVenturePanel({
  continuation,
}: {
  continuation: HomeContinuation;
}) {
  return (
    <section aria-labelledby="continue-work-title">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h2
          id="continue-work-title"
          className="workspace-section-title text-ink"
        >
          Tiếp tục làm việc
        </h2>
        <span className="hidden workspace-meta text-workspace-muted-text sm:block">
          Updated {formatDate(continuation.lastUpdatedAt)}
        </span>
      </div>

      <div className="rounded-xl border border-primary-border bg-workspace-panel p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 workspace-meta text-workspace-muted-text">
          <span className="font-medium text-primary">
            {continuation.stageLabel}
          </span>
          <span aria-hidden="true">/</span>
          <span>{continuation.phaseLabel}</span>
          {continuation.cycleLabel ? (
            <>
              <span aria-hidden="true">/</span>
              <span>{continuation.cycleLabel}</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-2 workspace-card-title text-ink">
          {continuation.ventureName}
        </h3>

        <dl className="mt-3 grid gap-3 border-t border-workspace-border pt-3 md:grid-cols-2 md:gap-5">
          <div>
            <dt className="workspace-eyebrow text-workspace-muted-text">
              Current decision
            </dt>
            <dd className="mt-1 workspace-body font-medium text-ink">
              {continuation.decisionTitle}
            </dd>
          </div>
          <div>
            <dt className="workspace-eyebrow text-workspace-muted-text">
              Next action
            </dt>
            <dd className="mt-1 workspace-supporting text-workspace-muted-text">
              {continuation.nextActionDescription}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            asChild
            className="workspace-control-text h-11 px-4 lg:h-9"
          >
            <Link
              href={`/founder/projects/${continuation.ventureId}/workspace`}
              aria-label={`Tiếp tục ${continuation.ventureName}`}
            >
              Tiếp tục
              <ArrowRight
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="workspace-control-text h-11 px-3 lg:h-9"
          >
            <Link href={continuation.overviewHref}>
              Mở tổng quan
            </Link>
          </Button>
          <span className="ml-auto workspace-meta text-workspace-muted-text sm:hidden">
            Updated {formatDate(continuation.lastUpdatedAt)}
          </span>
        </div>
      </div>
    </section>
  );
}

export function HomeQuickActions({
  actions,
  ventureName,
}: {
  actions: HomeQuickAction[];
  ventureName: string;
}) {
  if (actions.length === 0) return null;

  return (
    <section aria-labelledby="quick-actions-title">
      <h2
        id="quick-actions-title"
        className="workspace-section-title text-ink"
      >
        Hành động nhanh
      </h2>
      <div
        className={cn(
          "mt-2.5 grid overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel sm:divide-x sm:divide-workspace-border",
          actions.length === 2 && "sm:grid-cols-2",
          actions.length === 3 && "sm:grid-cols-3",
        )}
      >
        {actions.map((action, index) => {
          const Icon = quickActionIcons[action.kind];
          return (
            <Link
              key={action.id}
              href={action.href}
              aria-label={`${action.title} for ${ventureName}`}
              className={cn(
                "group flex min-h-20 items-start gap-3 px-3.5 py-3 transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-workspace-focus-ring/40",
                index > 0 &&
                  "border-t border-workspace-border sm:border-t-0",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-workspace-border bg-workspace-elevated text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 workspace-supporting font-medium text-ink">
                  {action.title}
                  <ArrowUpRight
                    className="size-3.5 text-workspace-muted-text transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block workspace-meta text-workspace-muted-text">
                  {action.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function NeedsAttentionList({
  items,
}: {
  items: HomeAttentionItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="attention-title">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="attention-title"
          className="workspace-section-title text-ink"
        >
          Cần bạn chú ý
        </h2>
        <span className="workspace-meta text-workspace-muted-text">
          {items.length} mục
        </span>
      </div>
      <div className="mt-2.5 divide-y divide-workspace-border overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel">
        {items.map((item) => {
          const Icon = attentionIcons[item.kind];
          const meta = formatMeta(item.meta);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex min-h-14 items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-workspace-focus-ring/40"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-workspace-elevated text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate workspace-supporting font-medium text-ink">
                  {item.title}
                </span>
                <span className="mt-0.5 block truncate workspace-meta text-workspace-muted-text">
                  {item.context}
                </span>
              </span>
              {meta ? (
                <span className="hidden shrink-0 workspace-meta text-workspace-muted-text sm:block">
                  {meta}
                </span>
              ) : null}
              <ArrowRight
                className="size-4 shrink-0 text-workspace-muted-text transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function RecentActivityList({
  activities,
}: {
  activities: HomeRecentActivity[];
}) {
  if (activities.length === 0) return null;

  return (
    <section aria-labelledby="recent-activity-title">
      <h2
        id="recent-activity-title"
        className="workspace-section-title text-ink"
      >
        Hoạt động gần đây
      </h2>
      <div className="mt-2.5 divide-y divide-workspace-border border-y border-workspace-border">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          return (
            <Link
              key={activity.id}
              href={activity.href}
              className="group flex min-h-14 items-center gap-3 px-1 py-2.5 transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-workspace-focus-ring/40 sm:px-2"
            >
              <Icon
                className="size-4 shrink-0 text-workspace-muted-text"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block workspace-supporting text-ink">
                  {activity.message}
                </span>
                <span className="mt-0.5 block workspace-meta text-workspace-muted-text">
                  {activity.ventureName}
                </span>
              </span>
              <span className="hidden shrink-0 workspace-meta text-workspace-muted-text sm:block">
                {formatDate(activity.occurredAt)}
              </span>
              <ArrowUpRight
                className="size-3.5 shrink-0 text-workspace-muted-text transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function OtherActiveProjects({
  projects,
}: {
  projects: HomeOtherProject[];
}) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="other-projects-title">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="other-projects-title"
          className="workspace-section-title text-ink"
        >
          Các venture khác
        </h2>
        <Link
          href="/founder/projects"
          className="inline-flex min-h-9 items-center gap-1 workspace-meta font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
        >
          Xem tất cả
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-2.5 grid gap-2 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={project.href}
            className="group rounded-lg border border-workspace-border bg-workspace-panel px-3.5 py-3 transition-colors hover:bg-workspace-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="truncate workspace-supporting font-medium text-ink">
                {project.name}
              </span>
              <ArrowUpRight
                className="size-3.5 shrink-0 text-workspace-muted-text transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
            <span className="mt-1 block workspace-meta text-workspace-muted-text">
              {project.phaseLabel} / Updated{" "}
              {formatDate(project.updatedAt)}
            </span>
            <span className="mt-1.5 line-clamp-2 block workspace-meta text-workspace-muted-text">
              {project.nextAction}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function NothingUrgentStatus() {
  return (
    <p
      role="status"
      className="flex items-center gap-2 border-y border-workspace-border px-1 py-3 workspace-supporting text-workspace-muted-text"
    >
      <Sparkles
        className="size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      Nothing urgent right now. Continue the current cycle when you
      are ready.
    </p>
  );
}
