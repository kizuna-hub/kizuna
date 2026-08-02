import { redirect } from "next/navigation";

export default async function LegacyMentorPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/mentor/dashboard/requests`);
}
