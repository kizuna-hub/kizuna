import { VentureSectionScreen } from "@/features/founder/projects/venture-section-screen";

export default async function VentureEvidencePage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return (
    <VentureSectionScreen
      ventureId={ventureId}
      section="evidence"
    />
  );
}

