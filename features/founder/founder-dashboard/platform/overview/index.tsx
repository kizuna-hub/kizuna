"use client";

import React from "react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  MessageSquareText,
  Plus,
  Rocket,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "../../../dashboard-sidebar";
import {
  founderProjectDemoStoreKey,
  getMentorReadinessGate,
  type FounderProjectDemoStore,
  type FounderWorkspaceDemoState,
} from "@/features/founder/founder-workspace/demo-state";
import { myProductsData } from "../products/data";
import { cn } from "@/lib/utils";

type LaunchpadProject = {
  id: string;
  name: string;
  tagline: string;
  stage: string;
  profileCompletion: number;
  aiReadinessScore: number;
  dataRoomReadiness: number;
  mentorRequestStatus: FounderWorkspaceDemoState["mentorRequestStatus"];
  nextBestAction: string;
  lastActivity: string;
  source: "submitted" | "static";
};

type ToastState = {
  title: string;
  description?: string;
};

const staticReadiness: Record<string, Pick<LaunchpadProject, "profileCompletion" | "aiReadinessScore" | "dataRoomReadiness" | "mentorRequestStatus" | "nextBestAction">> = {
  p1: { profileCompletion: 82, aiReadinessScore: 78, dataRoomReadiness: 60, mentorRequestStatus: "locked", nextBestAction: "Run AI Pitch Review" },
  p2: { profileCompletion: 68, aiReadinessScore: 64, dataRoomReadiness: 45, mentorRequestStatus: "locked", nextBestAction: "Complete startup profile" },
  p3: { profileCompletion: 74, aiReadinessScore: 58, dataRoomReadiness: 35, mentorRequestStatus: "locked", nextBestAction: "Prepare Data Room" },
};

const feedItems = [
  {
    id: "office-hours",
    type: "Mentor office hours",
    title: "Friday mentor review block is open",
    description: "Best for teams that have a clear mentor ask and a draft pitch.",
    action: "Prepare Pitch",
    icon: MessageSquareText,
    route: "ai",
  },
  {
    id: "competition",
    type: "Startup program",
    title: "University demo day applications close soon",
    description: "Use your workspace readiness score to decide whether to submit this week.",
    action: "View Program",
    icon: CalendarDays,
    route: "program",
  },
  {
    id: "data-room-tip",
    type: "Data room tip",
    title: "Mentors review faster when screenshots and team profile are ready",
    description: "Prepare the basic documents before sending a review request.",
    action: "Prepare Data Room",
    icon: Database,
    route: "data-room",
  },
  {
    id: "readiness-reminder",
    type: "AI readiness",
    title: "Fix top 3 pitch gaps before asking for mentor review",
    description: "The AI Pitch Readiness page can turn gaps into quick wins.",
    action: "Open Workspace",
    icon: Sparkles,
    route: "workspace",
  },
];

type FeedItem = (typeof feedItems)[number];

const deadlines = [
  { label: "Mentor office hours", date: "Friday 10:00" },
  { label: "Demo day application", date: "Next Tuesday" },
  { label: "Pitch deck checkpoint", date: "This week" },
];

function readProjectStore(): FounderProjectDemoStore | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(founderProjectDemoStoreKey);
    if (!stored) return null;
    return JSON.parse(stored) as FounderProjectDemoStore;
  } catch {
    return null;
  }
}

function projectFromWorkspace(project: FounderProjectDemoStore["projects"][number]): LaunchpadProject {
  const state = project.workspaceState;
  const mentorGate = getMentorReadinessGate(state);
  const pitchReady = state.pitchReadiness.deckSentToDataRoom
    ? "Request Mentor Review"
    : state.pitchReadiness.deckGenerated
      ? "Send deck to Data Room"
      : state.pitchReadiness.reviewHasRun
        ? "Fix top 3 pitch gaps"
        : "Run AI Pitch Review";

  return {
    id: project.id,
    name: state.profile.name,
    tagline: state.profile.tagline,
    stage: state.profile.stage,
    profileCompletion: state.profileCompletion,
    aiReadinessScore: state.aiReadinessScore,
    dataRoomReadiness: state.dataRoomReadiness,
    mentorRequestStatus: mentorGate.status,
    nextBestAction: mentorGate.status === "sent" ? "Review request sent" : mentorGate.canRequest ? "Request Mentor Review" : pitchReady,
    lastActivity: state.recentActivity[0]
      ? `Latest: ${state.recentActivity[0].message} · ${state.recentActivity[0].timestamp}`
      : "Latest: Workspace created",
    source: "submitted",
  };
}

function staticProject(project: (typeof myProductsData)[number]): LaunchpadProject {
  const readiness = staticReadiness[project.id] ?? staticReadiness.p1;
  return {
    id: project.id,
    name: project.name,
    tagline: project.tagline,
    stage: project.traction.status === "Funded" ? "Pilot / Early users" : project.traction.status === "Seeking" ? "Prototype / MVP" : "Idea",
    lastActivity: `Updated ${project.updatedAt}`,
    source: "static",
    ...readiness,
  };
}

function statusLabel(status: LaunchpadProject["mentorRequestStatus"]) {
  if (status === "sent") return "Request sent";
  if (status === "ready") return "Ready to request";
  return "Locked";
}

function readinessTone(value: number) {
  if (value >= 85) return "text-accent-blue";
  if (value >= 70) return "text-ink";
  return "text-ink-muted";
}

function workspaceHref(projectId: string) {
  return `/founder/founder-workspace/${projectId}`;
}

export function FounderDashboard() {
  const [storedProjects, setStoredProjects] = React.useState<LaunchpadProject[]>([]);
  const [activeProjectId, setActiveProjectId] = React.useState<string | undefined>();
  const [dismissedFeed, setDismissedFeed] = React.useState<string[]>([]);
  const [savedFeed, setSavedFeed] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<ToastState | null>(null);

  React.useEffect(() => {
    const store = readProjectStore();
    if (!store) return;
    setStoredProjects(store.projects.map(projectFromWorkspace));
    setActiveProjectId(store.activeProjectId);
  }, []);

  const projects = React.useMemo(() => {
    const submittedIds = new Set(storedProjects.map((project) => project.id));
    return [
      ...storedProjects,
      ...myProductsData.filter((project) => !submittedIds.has(project.id)).map(staticProject),
    ];
  }, [storedProjects]);

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];
  const hasProject = Boolean(activeProject);
  const visibleFeedItems = feedItems.filter((item) => !dismissedFeed.includes(item.id));

  const showToast = (toastState: ToastState) => {
    setToast(toastState);
    window.setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {toast ? (
        <div className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-hairline bg-surface-1 p-4 shadow-framer-edge">
          <p className="text-body-framer-sm font-semibold text-ink">{toast.title}</p>
          {toast.description ? <p className="mt-1 text-caption text-ink-muted">{toast.description}</p> : null}
        </div>
      ) : null}

      <main className="min-w-0 px-4 py-5 md:ml-[260px] md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <LaunchpadHeader activeProject={activeProject} hasProject={hasProject} />

          {hasProject ? (
            <ReadinessStrip project={activeProject} />
          ) : (
            <EmptyProjectState />
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-6">
              <QuickActions project={activeProject} hasProject={hasProject} />
              <FounderFeed
                project={activeProject}
                feedItems={visibleFeedItems}
                savedFeed={savedFeed}
                onSave={(id) => {
                  setSavedFeed((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
                  showToast({ title: "Feed item updated", description: "Saved state changed for this demo session." });
                }}
                onDismiss={(id) => {
                  setDismissedFeed((items) => [...items, id]);
                  showToast({ title: "Feed item dismissed", description: "This item is hidden locally for the demo." });
                }}
              />
            </section>

            <RightRail project={activeProject} projects={projects} onToast={showToast} />
          </div>
        </div>
      </main>
    </div>
  );
}

function LaunchpadHeader({ activeProject, hasProject }: { activeProject?: LaunchpadProject; hasProject: boolean }) {
  return (
    <section className="overflow-hidden rounded-xxl border border-hairline bg-surface-1 shadow-framer-edge">
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:p-8">
        <div>
          <p className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-muted">Founder Launchpad</p>
          <h1 className="mt-3 max-w-3xl font-display text-display-sm font-semibold text-ink md:text-display-md">
            Your next founder move, without digging through the workspace.
          </h1>
          <p className="mt-3 max-w-2xl text-body-framer text-ink-muted">
            Continue the readiness pipeline, prepare mentor review, or start a new startup intake.
          </p>
          {activeProject ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-body-framer-sm text-ink-muted">
              <span className="rounded-pill border border-hairline bg-surface-2 px-3 py-1">{activeProject.name}</span>
              <span>{activeProject.stage}</span>
              <span>{activeProject.nextBestAction}</span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:justify-end">
          {hasProject && activeProject ? (
            <Button asChild size="lg">
              <Link href={workspaceHref(activeProject.id)}>
                <Rocket className="size-4" />
                Open Founder Workspace
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/submit-project">
                <Plus className="size-4" />
                Submit your first project
              </Link>
            </Button>
          )}
          <Button asChild variant="secondary" size="lg">
            <Link href="/submit-project">
              <Plus className="size-4" />
              Create new project
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ReadinessStrip({ project }: { project: LaunchpadProject }) {
  const metrics = [
    { label: "Profile", value: `${project.profileCompletion}%`, icon: Target },
    { label: "AI Pitch", value: `${project.aiReadinessScore}%`, icon: Sparkles },
    { label: "Data Room", value: `${project.dataRoomReadiness}%`, icon: Database },
    { label: "Mentor Review", value: statusLabel(project.mentorRequestStatus), icon: Users },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.2fr]">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const numeric = Number.parseInt(metric.value, 10);
        return (
          <div key={metric.label} className="rounded-xl border border-hairline bg-surface-1 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">{metric.label}</p>
              <Icon className="size-4 text-ink-muted" />
            </div>
            <p className={cn("mt-3 font-mono text-2xl font-semibold text-ink", Number.isFinite(numeric) && readinessTone(numeric))}>{metric.value}</p>
          </div>
        );
      })}
      <div className="rounded-xl border border-hairline bg-surface-1 p-4">
        <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">Next best action</p>
        <p className="mt-3 text-body-framer-sm font-semibold text-ink">{project.nextBestAction}</p>
        <Button asChild variant="secondary" size="sm" className="mt-4">
          <Link href={project.nextBestAction.toLowerCase().includes("data") ? `${workspaceHref(project.id)}/data-room` : `${workspaceHref(project.id)}/ai-pitch-deck`}>
            Continue
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function EmptyProjectState() {
  return (
    <section className="rounded-xxl border border-hairline bg-surface-1 p-6 shadow-framer-edge">
      <p className="text-xl font-semibold text-ink">Start by submitting your first startup idea.</p>
      <p className="mt-2 max-w-2xl text-body-framer-sm text-ink-muted">
        The Founder Dashboard becomes useful once Kizuna can create a workspace, AI pitch seed, data room checklist, and mentor-readiness gate.
      </p>
      <Button asChild className="mt-5">
        <Link href="/submit-project">
          Submit Project
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
}

function QuickActions({ project, hasProject }: { project?: LaunchpadProject; hasProject: boolean }) {
  const lockedText = "Submit a project first";
  const actions = [
    { label: "Submit New Project", href: "/submit-project", icon: Plus, enabled: true },
    { label: "Open Workspace", href: project ? workspaceHref(project.id) : "", icon: Rocket, enabled: hasProject },
    { label: "Run AI Pitch Review", href: project ? `${workspaceHref(project.id)}/ai-pitch-deck` : "", icon: Sparkles, enabled: hasProject },
    { label: "Prepare Data Room", href: project ? `${workspaceHref(project.id)}/data-room` : "", icon: Database, enabled: hasProject },
    { label: "Request Mentor Review", href: project ? `${workspaceHref(project.id)}/venture-connect` : "", icon: MessageSquareText, enabled: hasProject },
  ];

  return (
    <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">Quick actions</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">Move the pipeline forward</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;
          if (!action.enabled) {
            return (
              <button
                key={action.label}
                type="button"
                disabled
                className="rounded-xl border border-hairline bg-surface-2 p-4 text-left opacity-50"
                title={lockedText}
              >
                <Icon className="size-4 text-ink-muted" />
                <p className="mt-3 text-body-framer-sm font-semibold text-ink">{action.label}</p>
                <p className="mt-1 text-caption text-ink-muted">{lockedText}</p>
              </button>
            );
          }
          return (
            <Link key={action.label} href={action.href} className="rounded-xl border border-hairline bg-surface-2 p-4 text-left transition-colors hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30">
              <Icon className="size-4 text-ink-muted" />
              <p className="mt-3 text-body-framer-sm font-semibold text-ink">{action.label}</p>
              <p className="mt-1 text-caption text-ink-muted">Open</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FounderFeed({
  project,
  feedItems,
  savedFeed,
  onSave,
  onDismiss,
}: {
  project?: LaunchpadProject;
  feedItems: FeedItem[];
  savedFeed: string[];
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const resolveHref = (route: string) => {
    if (!project) return "/submit-project";
    if (route === "ai") return `${workspaceHref(project.id)}/ai-pitch-deck`;
    if (route === "data-room") return `${workspaceHref(project.id)}/data-room`;
    if (route === "program") return "/founder/founder-dashboard/discover";
    return workspaceHref(project.id);
  };

  return (
    <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
      <div className="mb-5">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">Founder feed</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">Useful now, not random noise</h2>
      </div>
      <div className="space-y-3">
        {feedItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.id} className="rounded-xl border border-hairline bg-surface-2 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    <Icon className="size-4" />
                    {item.type}
                  </div>
                  <h3 className="mt-3 text-body-framer font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-body-framer-sm text-ink-muted">{item.description}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={resolveHref(item.route)}>
                      {item.action}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onSave(item.id)}>
                    <Bookmark className="size-4" />
                    {savedFeed.includes(item.id) ? "Saved" : "Save"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDismiss(item.id)} aria-label={`Dismiss ${item.title}`}>
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
        {feedItems.length === 0 ? (
          <div className="rounded-xl border border-hairline bg-surface-2 p-5 text-body-framer-sm text-ink-muted">
            Feed cleared for this demo session. New opportunities will appear after more workspace activity.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RightRail({
  project,
  projects,
  onToast,
}: {
  project?: LaunchpadProject;
  projects: LaunchpadProject[];
  onToast: (toast: ToastState) => void;
}) {
  return (
    <aside className="space-y-6">
      <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">My projects</p>
        <div className="mt-4 space-y-3">
          {projects.slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-xl border border-hairline bg-surface-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-body-framer-sm font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 text-caption text-ink-muted">{item.stage}</p>
                </div>
                <span className="rounded-pill border border-hairline bg-surface-1 px-2 py-1 text-caption text-ink-muted">{item.aiReadinessScore}% AI</span>
              </div>
              <p className="mt-3 line-clamp-2 text-caption text-ink-muted">{item.lastActivity}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href={workspaceHref(item.id)}>Open Workspace</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`${workspaceHref(item.id)}/ai-pitch-deck`}>AI Review</Link>
                </Button>
              </div>
            </div>
          ))}
          {projects.length === 0 ? (
            <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink-muted">
              No projects yet. Submit your first startup idea to create a workspace.
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">Next best action</p>
        <p className="mt-3 text-body-framer-sm font-semibold text-ink">
          {project ? `${project.name}: ${project.nextBestAction}.` : "Submit a project to unlock readiness guidance."}
        </p>
        <p className="mt-2 text-caption text-ink-muted">
          {project ? "Founder Workspace owns the deep readiness work; this dashboard only points you there." : "Kizuna will create the pipeline after intake."}
        </p>
      </section>

      <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">Suggested mentors & programs</p>
        <div className="mt-4 space-y-3">
          {["Dr. Alex Chen - SaaS positioning", "Linh Mori - Customer discovery", "University demo day"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onToast({ title: "Opportunity saved", description: `${item} saved to the launchpad demo state.` })}
              className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface-2 p-3 text-left text-body-framer-sm text-ink transition-colors hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30"
            >
              <span>{item}</span>
              <Bell className="size-4 text-ink-muted" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
        <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">Upcoming deadlines</p>
        <div className="mt-4 space-y-3">
          {deadlines.map((deadline) => (
            <div key={deadline.label} className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
              <span className="text-body-framer-sm text-ink">{deadline.label}</span>
              <span className="inline-flex items-center gap-1 text-caption text-ink-muted">
                <Clock3 className="size-3.5" />
                {deadline.date}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
