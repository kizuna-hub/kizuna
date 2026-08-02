"use client";

import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { Link } from "@/i18n/routing";

export function UnavailableProject() {
  return (
    <FounderShell contentWidth="focused">
      <section className="mx-auto max-w-xl rounded-xl border border-workspace-border bg-workspace-panel p-5">
        <h1 className="workspace-decision-title text-ink">
          Project unavailable
        </h1>
        <p className="mt-2 workspace-supporting text-workspace-muted-text">
          This project is missing or archived.
        </p>
        <Button asChild className="mt-4 h-11 px-4 lg:h-9">
          <Link href="/founder/projects">
            <FolderKanban className="size-4" />
            View projects
          </Link>
        </Button>
      </section>
    </FounderShell>
  );
}

