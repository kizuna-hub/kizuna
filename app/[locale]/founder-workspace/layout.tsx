import React from 'react';
import DashboardLayout from '@/components/founder-workspace/dashboard/dashboard-layout';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
