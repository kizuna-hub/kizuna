import { CycleScreen } from "@/features/venture/decision-loop";

export default async function VentureCyclePage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return <CycleScreen ventureId={ventureId} />;
}
