import { AiPitchDeckScreen } from "@/features/founder/founder-workspace/ai-pitch-deck/ai-pitch-deck-screen";

export default async function AiPitchDeckPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <AiPitchDeckScreen projectId={projectId} />;
}
