import { notFound } from "next/navigation";

import { MentorConnectionRequestDetailPageContent } from "@/features/university-admin/mentor-connections/request-detail-page-content";
import { getMentorConnectionRequest } from "@/features/university-admin/mentor-connections/repository/mentor-connection-repository";

export default async function UniversityAdminMentorConnectionDetailPage({
  params,
}: {
  params: Promise<{ connectionId: string }>;
}) {
  const { connectionId } = await params;
  const request = getMentorConnectionRequest(connectionId);

  if (!request) notFound();

  return (
    <MentorConnectionRequestDetailPageContent request={request} />
  );
}
