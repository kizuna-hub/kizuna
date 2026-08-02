import { MentorRequestDetailScreen } from "@/features/mentor/workspace/screens/mentor-request-detail-screen";

export default async function MentorRequestDetailPage({
  params,
}: {
  params: Promise<{
    locale: string;
    requestId: string;
  }>;
}) {
  const { requestId } = await params;
  return (
    <MentorRequestDetailScreen requestId={requestId} />
  );
}
