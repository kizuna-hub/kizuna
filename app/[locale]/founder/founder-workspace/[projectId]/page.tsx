import { FounderWorkspaceOverviewScreen } from "@/features/founder/founder-workspace/overview-screen";

export default async function FounderWorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <FounderWorkspaceOverviewScreen projectId={projectId} />;
}