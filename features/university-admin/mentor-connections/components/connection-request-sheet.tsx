"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { UniversityMentorConnectionSummary } from "../model/mentor-connection";
import { ConnectionRequestDetail } from "./connection-request-detail";

export function ConnectionRequestSheet({
  request,
  open,
  onOpenChange,
}: {
  request: UniversityMentorConnectionSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="university-admin-theme w-full overflow-y-auto border-[var(--admin-border)] bg-[var(--admin-surface)] p-0 text-[var(--admin-text)] sm:max-w-xl">
        <SheetHeader className="border-b border-[var(--admin-border)] px-5 py-4">
          <SheetTitle className="text-[var(--admin-text)]">
            Chi tiết yêu cầu kết nối
          </SheetTitle>
          <SheetDescription className="text-xs text-[var(--admin-muted)]">
            Theo dõi tiến trình và hành động quản trị được đề xuất.
          </SheetDescription>
        </SheetHeader>
        {request ? (
          <div className="p-5">
            <ConnectionRequestDetail request={request} />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

