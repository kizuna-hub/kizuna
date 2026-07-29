import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  UserRoundCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { MentorConnectionRequest } from "../types/mentor-connection.types";

export function MentorConnectionSuccess({
  request,
  onClose,
}: {
  request: MentorConnectionRequest;
  onClose: () => void;
}) {
  const outcome = request.brief.sections.find(
    (section) => section.id === "expected_outcome",
  );
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-full flex-col"
    >
      <div className="flex flex-1 items-center justify-center p-5">
        <div className="w-full max-w-md">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-workspace-success-soft text-workspace-success">
            <CheckCircle2 className="size-6" />
          </span>
          <p className="mt-4 text-center workspace-eyebrow text-workspace-success">
            Đã gửi yêu cầu kết nối
          </p>
          <h2 className="mt-2 text-center workspace-section-title text-ink">
            {request.brief.mentorSnapshot.name}
          </h2>
          <p className="mt-1 text-center workspace-supporting text-workspace-muted-text">
            {request.brief.mentorSnapshot.role}
          </p>

          <dl className="mt-6 divide-y divide-workspace-border rounded-xl border border-workspace-border bg-workspace-elevated px-4">
            <div className="flex gap-3 py-4">
              <UserRoundCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <dt className="workspace-eyebrow text-workspace-muted-text">
                  Mục tiêu
                </dt>
                <dd className="mt-1 workspace-supporting text-ink">
                  {outcome?.content ??
                    "Thiết kế pilot 14 ngày cho CampusFlow"}
                </dd>
              </div>
            </div>
            <div className="flex gap-3 py-4">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <dt className="workspace-eyebrow text-workspace-muted-text">
                  Trạng thái
                </dt>
                <dd className="mt-1 workspace-supporting text-ink">
                  Đang chờ phản hồi
                </dd>
                <p className="mt-1 workspace-meta text-workspace-muted-text">
                  Demo cục bộ · Chưa gửi tới hệ thống mentor thật
                </p>
              </div>
            </div>
          </dl>
        </div>
      </div>
      <div className="sticky bottom-0 flex gap-2 border-t border-workspace-border bg-workspace-panel p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled
          aria-current="page"
        >
          Xem yêu cầu
          <ArrowRight className="size-4" />
        </Button>
        <Button type="button" className="flex-1" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
  );
}
