import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/routing";

import {
  AdminHeaderControls,
  AdminPanel,
  AdminUpdatedFooter,
} from "../components/admin-ui";
import { ConnectionRequestDetail } from "./components/connection-request-detail";
import type { UniversityMentorConnectionSummary } from "./model/mentor-connection";

export function MentorConnectionRequestDetailPageContent({
  request,
}: {
  request: UniversityMentorConnectionSummary;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/university-admin/mentor-connections"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--admin-muted)] hover:text-[var(--admin-primary)]"
        >
          <span className="flex size-9 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <ArrowLeft className="size-4" />
          </span>
          Kết nối mentor
          <span aria-hidden="true">›</span>
          <strong className="text-[var(--admin-text)]">
            {request.ventureName}
          </strong>
        </Link>
        <AdminHeaderControls />
      </div>

      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-primary)]">
          Chi tiết request
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {request.ventureName} → {request.mentorName}
        </h1>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Theo dõi trạng thái, thời gian chờ và hành động vận hành phù hợp.
        </p>
      </header>

      <AdminPanel className="mx-auto max-w-3xl p-4 sm:p-6">
        <ConnectionRequestDetail request={request} />
      </AdminPanel>

      <AdminUpdatedFooter />
    </div>
  );
}
