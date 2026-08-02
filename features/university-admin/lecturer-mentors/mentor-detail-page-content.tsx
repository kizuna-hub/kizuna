import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/routing";

import {
  AdminHeaderControls,
  AdminPanel,
  AdminUpdatedFooter,
} from "../components/admin-ui";
import { LecturerMentorDetail } from "./components/lecturer-mentor-detail";
import type { UniversityLecturerMentorSummary } from "./model/lecturer-mentor";

export function LecturerMentorDetailPageContent({
  mentor,
}: {
  mentor: UniversityLecturerMentorSummary;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/university-admin/lecturer-mentors"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--admin-muted)] hover:text-[var(--admin-primary)]"
        >
          <span className="flex size-9 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <ArrowLeft className="size-4" />
          </span>
          Mentor giảng viên
          <span aria-hidden="true">›</span>
          <strong className="text-[var(--admin-text)]">
            {mentor.name}
          </strong>
        </Link>
        <AdminHeaderControls />
      </div>

      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--admin-primary)]">
          Hồ sơ capacity
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {mentor.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Tổng quan chuyên môn, availability và tải request trong chương
          trình.
        </p>
      </header>

      <AdminPanel className="mx-auto max-w-3xl p-4 sm:p-6">
        <LecturerMentorDetail mentor={mentor} />
      </AdminPanel>

      <AdminUpdatedFooter />
    </div>
  );
}
