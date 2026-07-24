import React from "react";
import { FounderShell } from "@/features/founder/shell/founder-shell";

export default function WorkspaceLayout({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  return (
    <FounderShell
      ventureId={projectId}
      contentWidth="focused"
    >
      {children}
    </FounderShell>
  );
}
