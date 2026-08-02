import { DemoRoleGuard } from "@/features/auth/components/demo-role-guard";
import { DemoWorkspaceProvider } from "@/features/founder/venture-foundation/demo-workspace-provider";

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoRoleGuard role="founder">
      <DemoWorkspaceProvider>
        {children}
      </DemoWorkspaceProvider>
    </DemoRoleGuard>
  );
}
