const legacyProjectMap: Record<string, string> = {
  p1: "venture-kizuna-hub",
  p2: "venture-snapmoney",
};

const outputSections = new Set([
  "ai-pitch-deck",
  "cap-table",
  "data-room",
  "ip-ledger",
  "saas-perks",
  "stakeholders-studio",
]);

export function resolveLegacyFounderWorkspaceRoute({
  locale,
  projectId,
  section,
}: {
  locale: string;
  projectId: string;
  section?: string;
}) {
  const ventureId = legacyProjectMap[projectId] ?? projectId;
  const base = `/${locale}/founder/projects/${ventureId}`;

  if (section === "venture-connect") return `${base}/sessions`;
  if (outputSections.has(section ?? "")) return `${base}/outputs`;

  return base;
}
