import { redirect } from "next/navigation";

import { resolveLegacyFounderWorkspaceRoute } from "@/features/founder/venture-foundation/legacy-founder-workspace-route";

export default async function FounderWorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>;
}) {
  const { locale, projectId } = await params;
  redirect(resolveLegacyFounderWorkspaceRoute({ locale, projectId }));
}
