"use client";

import React from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderKanban,
  LockKeyhole,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import {
  getActiveDecisionForVenture,
  getActivitiesForVenture,
  getSupportRelationshipsForVenture,
  getVentureById,
  supportRoleLabel,
} from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import type { VentureId } from "@/features/founder/venture-foundation/types";
import { Link, usePathname } from "@/i18n/routing";

export type VentureSection =
  | "evidence"
  | "sessions"
  | "outputs"
  | "timeline";

const sectionMeta: Record<
  VentureSection,
  { eyebrow: string; title: string; description: string; availability: string }
> = {
  evidence: {
    eyebrow: "Decision support",
    title: "Evidence",
    description:
      "See what the current decision is based on and which proof is still missing.",
    availability:
      "Evidence submission and review are not available in this demo.",
  },
  sessions: {
    eyebrow: "Human support",
    title: "Sessions",
    description:
      "Coordinate the support relationships that already exist for this project.",
    availability:
      "Session preparation and feedback capture are not available in this demo.",
  },
  outputs: {
    eyebrow: "Project artifacts",
    title: "Outputs",
    description:
      "Open preserved founder tools without treating artifacts as proof by default.",
    availability:
      "These compatibility tools remain separate from decision evidence.",
  },
  timeline: {
    eyebrow: "Venture history",
    title: "Timeline",
    description:
      "Review a lightweight record of decisions, evidence, support, and project changes.",
    availability:
      "This demo shows a lightweight activity summary.",
  },
};

function EvidenceContent({
  ventureId,
}: {
  ventureId: VentureId;
}) {
  const { state } = useDemoWorkspace();
  const evidence = state.evidence.filter(
    (item) => item.ventureId === ventureId,
  );
  const decision = getActiveDecisionForVenture(state, ventureId);

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <h2 className="workspace-section-title text-ink">
        Evidence for the current decision
      </h2>
      <p className="mt-1.5 workspace-meta text-workspace-muted-text">
        {decision?.title}
      </p>
      {evidence.length ? (
        <div className="mt-4 divide-y divide-workspace-border">
          {evidence.map((item) => (
            <article key={item.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-workspace-success" />
                <h3 className="workspace-body font-medium text-ink">
                  {item.title}
                </h3>
              </div>
              <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-workspace-elevated px-3.5 py-3 workspace-supporting text-workspace-muted-text">
          No reviewed evidence is attached yet. This does not change
          project readiness.
        </p>
      )}
    </section>
  );
}

function SessionsContent({
  ventureId,
}: {
  ventureId: VentureId;
}) {
  const { state } = useDemoWorkspace();
  const relationships = getSupportRelationshipsForVenture(
    state,
    ventureId,
  );

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <h2 className="workspace-section-title text-ink">
        Active support
      </h2>
      {relationships.length ? (
        <div className="mt-4 divide-y divide-workspace-border">
          {relationships.map((relationship) => (
            <div
              key={relationship.id}
              className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="workspace-body font-medium text-ink">
                  {relationship.personName}
                </p>
                <p className="mt-0.5 workspace-meta text-workspace-muted-text">
                  {supportRoleLabel(relationship.role)} ·{" "}
                  {relationship.expertise.join(", ")}
                </p>
              </div>
              {relationship.nextSessionAt ? (
                <span className="inline-flex items-center gap-2 workspace-meta text-workspace-muted-text">
                  <CalendarDays className="size-3.5" />
                  Session scheduled
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <p className="workspace-body font-medium text-ink">
            No active support relationship
          </p>
          <p className="mt-1.5 max-w-2xl workspace-supporting text-workspace-muted-text">
            Keep working from the current decision. Kizuna will only
            suggest external support after a specific expertise gap is
            clear.
          </p>
        </div>
      )}
    </section>
  );
}

function OutputsContent({
  ventureId,
}: {
  ventureId: VentureId;
}) {
  const base = `/founder/founder-workspace/${ventureId}`;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <FileText className="size-5 text-primary" />
        <h2 className="mt-3 workspace-section-title text-ink">
          AI Pitch
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Preserved pitch-readiness workspace. Copy improvements do not
          count as venture evidence.
        </p>
        <Button
          asChild
          variant="secondary"
          className="workspace-control-text mt-4 h-11 px-4 lg:h-9"
        >
          <Link href={`${base}/ai-pitch-deck`}>
            Open AI Pitch
          </Link>
        </Button>
      </section>
      <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <LockKeyhole className="size-5 text-primary" />
        <h2 className="mt-3 workspace-section-title text-ink">
          Data Room
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Preserved demo document workspace. File presence alone does not
          increase decision confidence.
        </p>
        <Button
          asChild
          variant="secondary"
          className="workspace-control-text mt-4 h-11 px-4 lg:h-9"
        >
          <Link href={`${base}/data-room`}>Open Data Room</Link>
        </Button>
      </section>
    </div>
  );
}

function TimelineContent({
  ventureId,
}: {
  ventureId: VentureId;
}) {
  const { state } = useDemoWorkspace();
  const activities = getActivitiesForVenture(state, ventureId);

  return (
    <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
      <h2 className="workspace-section-title text-ink">
        Recent activity
      </h2>
      {activities.length ? (
        <ol className="mt-4 border-l border-workspace-border pl-5">
          {activities.map((activity) => (
            <li key={activity.id} className="relative pb-5 last:pb-0">
              <span className="absolute -left-[25px] top-1.5 size-2 rounded-full border border-primary bg-workspace-panel" />
              <p className="workspace-supporting text-ink">
                {activity.message}
              </p>
              <p className="mt-1 workspace-meta text-workspace-muted-text">
                {new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                }).format(new Date(activity.occurredAt))}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 workspace-supporting text-workspace-muted-text">
          No activity recorded.
        </p>
      )}
    </section>
  );
}

function SectionContent({
  ventureId,
  section,
}: {
  ventureId: VentureId;
  section: VentureSection;
}) {
  if (section === "evidence") {
    return <EvidenceContent ventureId={ventureId} />;
  }
  if (section === "sessions") {
    return <SessionsContent ventureId={ventureId} />;
  }
  if (section === "outputs") {
    return <OutputsContent ventureId={ventureId} />;
  }
  return <TimelineContent ventureId={ventureId} />;
}

export function VentureSectionScreen({
  ventureId,
  section,
}: {
  ventureId: VentureId;
  section: VentureSection;
}) {
  const pathname = usePathname();
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const venture = getVentureById(state, ventureId);
  const meta = sectionMeta[section];

  React.useEffect(() => {
    if (!venture || venture.status === "archived") return;
    setActiveVenture(venture.id);
    setLastVisitedVenturePath(venture.id, pathname);
  }, [
    pathname,
    setActiveVenture,
    setLastVisitedVenturePath,
    venture?.id,
    venture?.status,
  ]);

  if (!venture || venture.status === "archived") {
    return (
      <FounderShell contentWidth="focused">
        <section className="mx-auto max-w-xl rounded-xl border border-workspace-border bg-workspace-panel p-5">
          <h1 className="workspace-decision-title text-ink">
            Project unavailable
          </h1>
          <p className="mt-2 workspace-supporting text-workspace-muted-text">
            This project is missing or archived.
          </p>
          <Button asChild className="workspace-control-text mt-4 h-11 px-4 lg:h-9">
            <Link href="/founder/projects">
              <FolderKanban className="size-4" />
              View projects
            </Link>
          </Button>
        </section>
      </FounderShell>
    );
  }

  return (
    <FounderShell
      ventureId={venture.id}
      contentWidth="focused"
    >
      <div className="space-y-5">
        <header className="flex flex-col gap-3 border-b border-workspace-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="workspace-eyebrow text-primary">
              {meta.eyebrow}
            </p>
            <h1 className="mt-1.5 workspace-page-title text-ink">
              {meta.title}
            </h1>
            <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
              {meta.description}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="workspace-control-text h-11 px-3 lg:h-9"
          >
            <Link href={`/founder/projects/${venture.id}`}>
              <ArrowLeft className="size-4" />
              Back to overview
            </Link>
          </Button>
        </header>

        <div
          className="flex items-start gap-3 rounded-lg border border-workspace-border bg-workspace-elevated px-3.5 py-3"
          role="note"
        >
          <MessageSquareText className="mt-0.5 size-4 shrink-0 text-workspace-muted-text" />
          <p className="workspace-supporting text-workspace-muted-text">
            {meta.availability}
          </p>
        </div>

        <SectionContent
          ventureId={venture.id}
          section={section}
        />
      </div>
    </FounderShell>
  );
}
