import { VentureSectionScreen } from "@/features/founder/projects/venture-section-screen";

export default async function VentureSessionsPage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  return (
    <VentureSectionScreen
      ventureId={ventureId}
      section="sessions"
    />
  );
}

