import { notFound } from "next/navigation";

import { LecturerMentorDetailPageContent } from "@/features/university-admin/lecturer-mentors/mentor-detail-page-content";
import { getUniversityLecturerMentor } from "@/features/university-admin/lecturer-mentors/repository/lecturer-mentor-repository";

export default async function UniversityAdminLecturerMentorDetailPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;
  const mentor = getUniversityLecturerMentor(mentorId);

  if (!mentor) notFound();

  return <LecturerMentorDetailPageContent mentor={mentor} />;
}
