import { redirect } from "next/navigation";

export default async function FounderWorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>;
}) {
  const { locale, projectId } = await params;
  const legacyProjectMap: Record<string, string> = {
    p1: "venture-kizuna-hub",
    p2: "venture-snapmoney",
  };
  const ventureId = legacyProjectMap[projectId] ?? projectId;

  redirect(`/${locale}/founder/projects/${ventureId}`);
}
