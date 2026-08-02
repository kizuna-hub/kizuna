import { FounderAiWorkspaceScreen } from "@/features/founder/ai-workspace/screens/founder-ai-workspace-screen";

export default async function FounderAiWorkspacePage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return <FounderAiWorkspaceScreen ventureId={ventureId} />;
}
