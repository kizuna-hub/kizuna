"use client";

import React from "react";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Database,
  GraduationCap,
  MessageSquareText,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Opportunity = {
  id: string;
  type: "Mentor" | "Program" | "Resource" | "Reminder" | "Community";
  title: string;
  description: string;
  why: string;
  action: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const opportunities: Opportunity[] = [
  {
    id: "mentor-office-hours",
    type: "Mentor",
    title: "Mentor office hours for early-stage founders",
    description: "A 25-minute review block for teams with a clear mentor ask and a draft pitch.",
    why: "Best after running AI Pitch Readiness.",
    action: "Prepare pitch",
    href: "/founder/founder-workspace/p1/ai-pitch-deck",
    icon: MessageSquareText,
  },
  {
    id: "demo-day",
    type: "Program",
    title: "University demo day applications",
    description: "Applications favor teams with a clean problem, customer evidence, and a shareable deck.",
    why: "Use your workspace readiness score before applying.",
    action: "Open workspace",
    href: "/founder/founder-workspace/p1",
    icon: GraduationCap,
  },
  {
    id: "data-room-checklist",
    type: "Reminder",
    title: "Data Room basics before mentor review",
    description: "Pitch deck, team profile, screenshots, and financial snapshot should be easy to share.",
    why: "Mentors review faster when core documents are ready.",
    action: "Prepare Data Room",
    href: "/founder/founder-workspace/p1/data-room",
    icon: Database,
  },
  {
    id: "customer-discovery",
    type: "Resource",
    title: "Customer discovery question bank",
    description: "Use this before adding evidence signals or updating your startup profile.",
    why: "Small evidence is still useful if it is specific.",
    action: "Save resource",
    href: "/founder/founder-dashboard",
    icon: Sparkles,
  },
  {
    id: "peer-feedback",
    type: "Community",
    title: "Peer pitch review circle",
    description: "Swap one deck review with another founder team before asking a mentor.",
    why: "A quick peer review can expose unclear claims.",
    action: "View details",
    href: "/founder/founder-dashboard/products",
    icon: Users,
  },
];

const filters = ["All", "Mentor", "Program", "Resource", "Reminder", "Community"] as const;

export function DiscoverMain() {
  const [activeFilter, setActiveFilter] = React.useState<(typeof filters)[number]>("All");
  const [query, setQuery] = React.useState("");
  const [saved, setSaved] = React.useState<string[]>([]);
  const [dismissed, setDismissed] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const visibleOpportunities = opportunities.filter((item) => {
    if (dismissed.includes(item.id)) return false;
    if (activeFilter !== "All" && item.type !== activeFilter) return false;
    const searchable = `${item.title} ${item.description} ${item.type}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {toast ? (
        <div className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-hairline bg-surface-1 p-4 shadow-framer-edge">
          <p className="text-body-framer-sm font-semibold text-ink">{toast}</p>
        </div>
      ) : null}

      <section className="rounded-xxl border border-hairline bg-surface-1 p-6 shadow-framer-edge md:p-8">
        <p className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-muted">Discover</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-3xl font-display text-display-sm font-semibold text-ink md:text-display-md">
              Opportunities that move your startup forward.
            </h1>
            <p className="mt-3 max-w-2xl text-body-framer text-ink-muted">
              Mentor blocks, programs, and resources are filtered around the readiness pipeline.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/submit-project">
              Submit New Project
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mentor opportunities, programs, resources..."
              className="h-11 w-full rounded-xl border border-hairline bg-surface-2 pl-10 pr-4 text-body-framer-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent-blue focus:shadow-framer-focus"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "h-10 rounded-pill border border-hairline bg-surface-2 px-4 text-caption font-semibold text-ink-muted transition-colors hover:bg-surface-1 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30",
                  activeFilter === filter && "border-accent-blue/60 bg-accent-blue/10 text-ink"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleOpportunities.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.id} className="rounded-xxl border border-hairline bg-surface-1 p-5 shadow-framer-edge">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-surface-2">
                    <Icon className="size-5 text-ink-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">{item.type}</p>
                    <h2 className="mt-2 break-words text-xl font-semibold text-ink">{item.title}</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDismissed((items) => [...items, item.id]);
                    showToast("Opportunity dismissed for this demo session.");
                  }}
                  className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30"
                  aria-label={`Dismiss ${item.title}`}
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-4 text-body-framer-sm leading-relaxed text-ink-muted">{item.description}</p>
              <div className="mt-4 rounded-xl border border-hairline bg-surface-2 p-4">
                <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">Why it matters</p>
                <p className="mt-2 text-body-framer-sm text-ink">{item.why}</p>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button asChild>
                  <Link href={item.href}>
                    {item.action}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSaved((items) => (items.includes(item.id) ? items.filter((id) => id !== item.id) : [...items, item.id]));
                    showToast(saved.includes(item.id) ? "Removed from saved items." : "Saved to Launchpad.");
                  }}
                >
                  <Bookmark className="size-4" />
                  {saved.includes(item.id) ? "Saved" : "Save"}
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      {visibleOpportunities.length === 0 ? (
        <section className="rounded-xxl border border-hairline bg-surface-1 p-8 text-body-framer-sm text-ink-muted">
          No opportunities match this filter. Clear the search or switch back to All.
        </section>
      ) : null}

      <section className="rounded-xxl border border-hairline bg-surface-1 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">Upcoming</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">Demo day checkpoint</h2>
            <p className="mt-1 text-body-framer-sm text-ink-muted">Use Founder Workspace to decide whether you are ready to apply.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-body-framer-sm text-ink">
            <CalendarDays className="size-4 text-ink-muted" />
            Next Tuesday
          </div>
        </div>
      </section>
    </div>
  );
}

export * from "./discover-header";
export * from "./discover-feed";
export * from "./discover-card";
