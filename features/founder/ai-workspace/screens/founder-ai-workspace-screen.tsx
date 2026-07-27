"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { getVentureById } from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { Link, usePathname } from "@/i18n/routing";

import { aiWorkspaceVi } from "../copy/vi";
import { FounderAiWorkspaceWithVenture } from "./founder-ai-workspace-with-venture";

export function FounderAiWorkspaceScreen({
  ventureId,
}: {
  ventureId: string;
}) {
  const pathname = usePathname();
  const {
    state,
    setActiveVenture,
    setLastVisitedVenturePath,
  } = useDemoWorkspace();
  const venture = getVentureById(state, ventureId);

  React.useEffect(() => {
    if (!venture || venture.status === "archived") return;
    setActiveVenture(venture.id);
    setLastVisitedVenturePath(venture.id, pathname);
  }, [
    pathname,
    setActiveVenture,
    setLastVisitedVenturePath,
    venture,
  ]);

  if (!venture || venture.status === "archived") {
    return (
      <FounderShell contentWidth="focused">
        <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
          <h1 className="workspace-page-title text-ink">
            {aiWorkspaceVi.workspace.noVentureTitle}
          </h1>
          <Button asChild className="mt-4">
            <Link href="/founder/projects">
              Quay về Projects
            </Link>
          </Button>
        </div>
      </FounderShell>
    );
  }

  return (
    <FounderAiWorkspaceWithVenture
      key={venture.id}
      ventureId={venture.id}
    />
  );
}
