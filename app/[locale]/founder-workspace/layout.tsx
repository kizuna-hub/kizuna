import React from 'react';
import WorkspaceLayout from '@/components/founder-workspace/dashboard/workspace-layout';

// ĐỔI TÊN function local thành Layout (hoặc tên gì khác tùy mày, miễn là khác WorkspaceLayout)
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lúc này nó sẽ hiểu WorkspaceLayout ở đây là cái component mày vừa import ở trên
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}