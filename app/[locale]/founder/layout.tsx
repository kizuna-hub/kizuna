import { DemoWorkspaceProvider } from "@/features/founder/venture-foundation/demo-workspace-provider";

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoWorkspaceProvider>
      {children}
    </DemoWorkspaceProvider>
  );
}
