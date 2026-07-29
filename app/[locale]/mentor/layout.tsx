import { MentorWorkspaceShell } from "@/features/mentor/workspace/components/mentor-workspace-shell";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MentorWorkspaceShell>{children}</MentorWorkspaceShell>;
}
