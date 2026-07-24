"use client";

import React from "react";
import Header from "./header";
import WorkspaceSidebar from "./sidebar";

export default function WorkspaceLayout({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-canvas font-body text-ink antialiased">
      <WorkspaceSidebar projectId={projectId} />

      {mobileOpen ? (
        <div className="fixed inset-0 z-overlay md:hidden">
          <button
            aria-label="Close navigation backdrop"
            className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(340px,calc(100vw-2rem))]">
            <WorkspaceSidebar projectId={projectId} mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-[100dvh] flex-col md:pl-[280px]">
        <Header onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 bg-canvas px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
