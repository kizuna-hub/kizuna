import { MentorProfileScreen } from "@/features/mentor/mentor-profile/mentor-profile-screen";

export default function MentorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return <MentorProfileScreen params={params} />;
}