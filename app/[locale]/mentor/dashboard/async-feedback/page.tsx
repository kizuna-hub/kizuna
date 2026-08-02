import { redirect } from "next/navigation";

export default async function LegacyMentorAsyncFeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/mentor/dashboard/requests`);
}
