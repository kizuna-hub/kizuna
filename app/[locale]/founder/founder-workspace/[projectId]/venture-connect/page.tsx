import { VentureConnectScreen } from "@/features/founder/founder-workspace/venture-connect/venture-connect-screen";

export default async function VentureConnectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <VentureConnectScreen projectId={projectId} />;
}
