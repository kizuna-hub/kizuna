import React from 'react';
import WorkspaceLayout from '@/components/founder-workspace/dashboard/workspace-layout';

export default function Layout({
  children,
  params, // Next.js tự động truyền params chứa projectId vào đây
}: {
  children: React.ReactNode;
  params: { projectId: string }; // Khai báo type
}) {
  // Ném projectId xuống cho WorkspaceLayout xử lý tiếp
  return (
    <WorkspaceLayout projectId={params.projectId}>
      {children}
    </WorkspaceLayout>
  );
}