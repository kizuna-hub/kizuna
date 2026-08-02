import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { Link } from "@/i18n/routing";

const content = {
  programs: {
    title: "Programs",
    description:
      "Program context will connect external modules, assigned mentors, deliverables, and deadlines without replacing the venture workspace.",
    phase: "Planned for Phase 4",
  },
  opportunities: {
    title: "Opportunities",
    description:
      "Relevant programs, grants, pilots, and specialist support will appear only when project context supports the recommendation.",
    phase: "Planned for Phase 4",
  },
  library: {
    title: "Library",
    description:
      "Reusable founder resources will live here after the decision and evidence workflows establish what context they need.",
    phase: "Preview",
  },
} as const;

export function GlobalPlaceholderScreen({
  section,
}: {
  section: keyof typeof content;
}) {
  const item = content[section];

  return (
    <FounderShell contentWidth="focused">
      <section className="mx-auto max-w-3xl rounded-xl border border-workspace-border bg-workspace-panel p-4">
        <span className="rounded-pill border border-primary-border bg-primary-soft px-2.5 py-1 workspace-meta font-medium text-primary">
          {item.phase}
        </span>
        <h1 className="mt-4 workspace-page-title text-ink">
          {item.title}
        </h1>
        <p className="mt-2 max-w-2xl workspace-body text-workspace-muted-text">
          {item.description}
        </p>
        <p className="mt-4 border-t border-workspace-border pt-4 workspace-supporting text-workspace-muted-text">
          This preview keeps future matching, enrollment, and content
          workflows clearly separate from today’s project work.
        </p>
        <Button
          asChild
          variant="ghost"
          className="workspace-control-text mt-4 h-11 px-3 lg:h-9"
        >
          <Link href="/founder/projects">
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </Button>
      </section>
    </FounderShell>
  );
}
