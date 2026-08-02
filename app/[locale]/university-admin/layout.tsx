import type { ReactNode } from "react";

import { DemoRoleGuard } from "@/features/auth/components/demo-role-guard";
import { UniversityAdminShell } from "@/features/university-admin/components/university-admin-shell";

export default function UniversityAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DemoRoleGuard role="university-admin">
      <UniversityAdminShell>{children}</UniversityAdminShell>
    </DemoRoleGuard>
  );
}
