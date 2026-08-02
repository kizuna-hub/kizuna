import { DataRoomScreen } from "@/features/founder/founder-workspace/data-room/data-room-screen";

export default async function DataRoomPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <DataRoomScreen projectId={projectId} />;
}
