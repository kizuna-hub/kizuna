import { DemoRoleGuard } from "@/features/auth/components/demo-role-guard";
import { MentorWorkspaceShell } from "@/features/mentor/workspace/components/mentor-workspace-shell";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoRoleGuard role="mentor">
      <MentorWorkspaceShell>{children}</MentorWorkspaceShell>
    </DemoRoleGuard>
  );
}
