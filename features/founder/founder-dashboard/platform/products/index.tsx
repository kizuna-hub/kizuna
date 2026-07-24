"use client";

import React from "react";
import {
  ArrowRight,
  Database,
  Filter,
  Plus,
  Rocket,
  Search,
  Sparkles,
  Target,
  Users,
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
import { cn } from "@/lib/utils";
import { myProductsData } from "./data";

type ProductProject = {
  id: string;
  name: string;
  tagline: string;
  stage: string;
  categories: string[];
  profileCompletion: number;
  aiReadinessScore: number;
  dataRoomReadiness: number;
  pitchDeckStatus: FounderWorkspaceDemoState["pitchDeckStatus"];
  mentorRequestStatus: FounderWorkspaceDemoState["mentorRequestStatus"];
  nextBestAction: string;
  latestActivity: string;
  source: "submitted" | "static";
};

type SortMode = "readiness" | "recent" | "ai";

const staticReadiness: Record<string, Pick<ProductProject, "profileCompletion" | "aiReadinessScore" | "dataRoomReadiness" | "pitchDeckStatus" | "mentorRequestStatus" | "nextBestAction">> = {
  p1: {
    profileCompletion: 82,
    aiReadinessScore: 78,
    dataRoomReadiness: 60,
    pitchDeckStatus: "draft",
    mentorRequestStatus: "locked",
    nextBestAction: "Run AI Pitch Review",
  },
  p2: {
    profileCompletion: 68,
    aiReadinessScore: 64,
    dataRoomReadiness: 45,
    pitchDeckStatus: "missing",
    mentorRequestStatus: "locked",
    nextBestAction: "Complete startup profile",
  },
  p3: {
    profileCompletion: 74,
    aiReadinessScore: 58,
    dataRoomReadiness: 35,
    pitchDeckStatus: "missing",
    mentorRequestStatus: "locked",
    nextBestAction: "Prepare Data Room",
  },
};

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

function workspaceHref(projectId: string) {
  return `/founder/founder-workspace/${projectId}`;
}

function submittedProject(project: FounderProjectDemoStore["projects"][number]): ProductProject {
  const state = project.workspaceState;
  const mentorGate = getMentorReadinessGate(state);
  const latest = state.recentActivity[0];
  const nextBestAction =
    mentorGate.status === "sent"
      ? "Review request sent"
      : mentorGate.canRequest
        ? "Request Mentor Review"
      : state.pitchReadiness.deckSentToDataRoom
        ? "Prepare mentor request"
        : state.pitchReadiness.deckGenerated
          ? "Send deck to Data Room"
          : state.pitchReadiness.reviewHasRun
            ? "Fix top pitch gaps"
            : "Run AI Pitch Review";

  return {
    id: project.id,
    name: state.profile.name,
    tagline: state.profile.tagline,
    stage: state.profile.stage,
    categories: state.profile.industry ? [state.profile.industry] : project.submission.categories,
    profileCompletion: state.profileCompletion,
    aiReadinessScore: state.aiReadinessScore,
    dataRoomReadiness: state.dataRoomReadiness,
    pitchDeckStatus: state.pitchDeckStatus ?? (state.pitchReadiness.deckSentToDataRoom ? "shared" : state.pitchReadiness.deckGenerated ? "generated" : "draft"),
    mentorRequestStatus: mentorGate.status,
    nextBestAction,
    latestActivity: latest ? `Latest: ${latest.message} · ${latest.timestamp}` : "Latest: Workspace created from startup intake",
    source: "submitted",
  };
}

function staticProject(project: (typeof myProductsData)[number]): ProductProject {
  const readiness = staticReadiness[project.id] ?? staticReadiness.p1;
  return {
    id: project.id,
    name: project.name,
    tagline: project.tagline,
    stage: project.stage,
    categories: project.categories,
    latestActivity: project.updatedAt,
    source: "static",
    ...readiness,
  };
}

function mentorLabel(status: ProductProject["mentorRequestStatus"]) {
  if (status === "sent") return "Request sent";
  if (status === "ready") return "Ready";
  return "Locked";
}

function deckLabel(status: ProductProject["pitchDeckStatus"]) {
  if (status === "shared") return "Shared";
  if (status === "generated") return "Generated";
  if (status === "reviewed") return "Reviewed";
  if (status === "draft") return "Draft";
  return "Missing";
}

function readinessAverage(project: ProductProject) {
  return Math.round((project.profileCompletion + project.aiReadinessScore + project.dataRoomReadiness) / 3);
}

function nextActionHref(project: ProductProject) {
  const action = project.nextBestAction.toLowerCase();
  if (action.includes("data")) return `${workspaceHref(project.id)}/data-room`;
  if (action.includes("mentor") || action.includes("request")) return `${workspaceHref(project.id)}/venture-connect`;
  if (action.includes("profile")) return workspaceHref(project.id);
  return `${workspaceHref(project.id)}/ai-pitch-deck`;
}

export function ProductsPage() {
  const [submittedProjects, setSubmittedProjects] = React.useState<ProductProject[]>([]);
  const [query, setQuery] = React.useState("");
  const [sortMode, setSortMode] = React.useState<SortMode>("readiness");

  React.useEffect(() => {
    const store = readProjectStore();
    if (!store) return;
    setSubmittedProjects(store.projects.map(submittedProject));
  }, []);

  const projects = React.useMemo(() => {
    const submittedIds = new Set(submittedProjects.map((project) => project.id));
    const merged = [
      ...submittedProjects,
      ...myProductsData.filter((project) => !submittedIds.has(project.id)).map(staticProject),
    ];
    const filtered = merged.filter((project) => {
      const text = `${project.name} ${project.tagline} ${project.stage} ${project.categories.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
    return filtered.sort((a, b) => {
      if (sortMode === "ai") return b.aiReadinessScore - a.aiReadinessScore;
      if (sortMode === "recent") return a.source === "submitted" ? -1 : 1;
      return readinessAverage(b) - readinessAverage(a);
    });
  }, [query, sortMode, submittedProjects]);

  const activeProject = projects[0];

  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <main className="min-w-0 px-4 py-5 md:ml-[260px] md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-xxl border border-hairline bg-surface-1 p-6 shadow-framer-edge md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-muted">My Projects</p>
                <h1 className="mt-3 max-w-3xl font-display text-display-sm font-semibold text-ink md:text-display-md">
                  Continue the project that is closest to mentor review.
                </h1>
                <p className="mt-3 max-w-2xl text-body-framer text-ink-muted">
                  This is your project continuity board. Deep readiness work still happens inside Founder Workspace.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {activeProject ? (
                  <Button asChild size="lg">
                    <Link href={workspaceHref(activeProject.id)}>
                      <Rocket className="size-4" />
                      Open active workspace
                    </Link>
                  </Button>
                ) : null}
                <Button asChild variant="secondary" size="lg">
                  <Link href="/submit-project">
                    <Plus className="size-4" />
                    Create new project
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search projects, stages, categories..."
                  className="h-11 w-full rounded-xl border border-hairline bg-surface-2 pl-10 pr-4 text-body-framer-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent-blue focus:shadow-framer-focus"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["readiness", "recent", "ai"] as SortMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSortMode(mode)}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-pill border border-hairline bg-surface-2 px-4 text-caption font-semibold capitalize text-ink-muted transition-colors hover:bg-surface-1 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30",
                      sortMode === mode && "border-accent-blue/60 bg-accent-blue/10 text-ink"
                    )}
                  >
                    <Filter className="size-3.5" />
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {projects.length > 0 ? (
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </section>
          ) : (
            <section className="rounded-xxl border border-hairline bg-surface-1 p-8 shadow-framer-edge">
              <h2 className="text-2xl font-semibold text-ink">Start with one startup idea.</h2>
              <p className="mt-2 max-w-2xl text-body-framer-sm text-ink-muted">
                Submit Project creates the Founder Workspace, AI Pitch seed, Data Room checklist, and mentor-readiness gate.
              </p>
              <Button asChild className="mt-5">
                <Link href="/submit-project">
                  Submit Project
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function ProjectCard({ project }: { project: ProductProject }) {
  const average = readinessAverage(project);
  const metrics = [
    { label: "Profile", value: `${project.profileCompletion}%`, icon: Target },
    { label: "AI Pitch", value: `${project.aiReadinessScore}%`, icon: Sparkles },
    { label: "Data Room", value: `${project.dataRoomReadiness}%`, icon: Database },
    { label: "Mentor", value: mentorLabel(project.mentorRequestStatus), icon: Users },
  ];

  return (
    <article className="rounded-xxl border border-hairline bg-surface-1 p-5 shadow-framer-edge">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-xl font-semibold text-ink">{project.name}</h2>
              <span className="rounded-pill border border-hairline bg-surface-2 px-2.5 py-1 text-caption text-ink-muted">
                {project.source === "submitted" ? "Submitted" : "Demo"}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-body-framer-sm text-ink-muted">{project.tagline}</p>
          </div>
          <div className="shrink-0 rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-right">
            <p className="font-mono text-2xl font-semibold text-ink">{average}%</p>
            <p className="text-caption text-ink-muted">ready</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-pill border border-hairline bg-surface-2 px-3 py-1 text-caption font-semibold text-ink">{project.stage}</span>
          <span className="rounded-pill border border-hairline bg-surface-2 px-3 py-1 text-caption text-ink-muted">Deck: {deckLabel(project.pitchDeckStatus)}</span>
          {project.categories.slice(0, 3).map((category) => (
            <span key={category} className="rounded-pill border border-hairline bg-surface-2 px-3 py-1 text-caption text-ink-muted">
              {category}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-xl border border-hairline bg-surface-2 p-3">
                <div className="flex items-center justify-between gap-2 text-caption text-ink-muted">
                  {metric.label}
                  <Icon className="size-3.5" />
                </div>
                <p className="mt-2 break-words font-mono text-body-framer-sm font-semibold text-ink">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-hairline bg-surface-2 p-4">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">Next best action</p>
          <p className="mt-2 text-body-framer-sm font-semibold text-ink">{project.nextBestAction}</p>
          <p className="mt-1 text-caption text-ink-muted">{project.latestActivity}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button asChild>
            <Link href={workspaceHref(project.id)}>
              Open Workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`${workspaceHref(project.id)}/ai-pitch-deck`}>
              Continue AI Review
              <Sparkles className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={nextActionHref(project)}>
              {project.nextBestAction}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
