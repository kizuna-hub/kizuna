import { VentureSectionScreen } from "@/features/founder/projects/venture-section-screen";

export default async function VentureOutputsPage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return (
    <VentureSectionScreen
      ventureId={ventureId}
      section="outputs"
    />
  );
}

