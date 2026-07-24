import { VentureOverviewScreen } from "@/features/founder/projects/venture-overview-screen";

export default async function VentureOverviewPage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return <VentureOverviewScreen ventureId={ventureId} />;
}

