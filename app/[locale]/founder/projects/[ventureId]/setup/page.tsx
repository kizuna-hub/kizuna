import { VentureSetupScreen } from "@/features/founder/ventures/setup/screens/venture-setup-screen";

export default async function VentureSetupPage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return <VentureSetupScreen ventureId={ventureId} />;
}

