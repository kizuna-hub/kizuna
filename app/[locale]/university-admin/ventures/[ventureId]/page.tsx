import { notFound } from "next/navigation";

import { universityVentures } from "@/features/university-admin/lib/university-admin-mock-data";
import { UniversityAdminVentureDetailScreen } from "@/features/university-admin/screens/university-admin-venture-detail-screen";

export default async function UniversityAdminVentureDetailPage({
  params,
}: {
  params: Promise<{ ventureId: string }>;
}) {
  const { ventureId } = await params;
  const venture = universityVentures.find(
    (item) => item.id === ventureId,
  );

  if (!venture) notFound();

  return <UniversityAdminVentureDetailScreen venture={venture} />;
}
