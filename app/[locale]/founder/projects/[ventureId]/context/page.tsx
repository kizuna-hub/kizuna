import { ContextScreen } from "@/features/venture/decision-loop";

export default async function VentureContextPage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return <ContextScreen ventureId={ventureId} />;
}
