import { redirect } from "next/navigation";

export default async function MentorDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/mentor/dashboard/requests`);
}
