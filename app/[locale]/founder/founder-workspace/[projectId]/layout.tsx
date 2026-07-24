import React from 'react';
import WorkspaceLayout from '@/features/founder/founder-workspace/dashboard/workspace-layout';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  // Next.js 15: params is a Promise and must be awaited before access.
  const { projectId } = await params;
  return (
    <WorkspaceLayout projectId={projectId}>
      {children}
    </WorkspaceLayout>
  );
}