"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { UniversityLecturerMentorSummary } from "../model/lecturer-mentor";
import { LecturerMentorDetail } from "./lecturer-mentor-detail";

export function LecturerMentorSheet({
  mentor,
  open,
  onOpenChange,
}: {
  mentor: UniversityLecturerMentorSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="university-admin-theme w-full overflow-y-auto border-[var(--admin-border)] bg-[var(--admin-surface)] p-0 text-[var(--admin-text)] sm:max-w-xl">
        <SheetHeader className="border-b border-[var(--admin-border)] px-5 py-4">
          <SheetTitle className="text-[var(--admin-text)]">
            Hồ sơ mentor giảng viên
          </SheetTitle>
          <SheetDescription className="text-xs text-[var(--admin-muted)]">
            Tổng quan năng lực, capacity và hoạt động matching.
          </SheetDescription>
        </SheetHeader>
        {mentor ? (
          <div className="p-5">
            <LecturerMentorDetail mentor={mentor} />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

