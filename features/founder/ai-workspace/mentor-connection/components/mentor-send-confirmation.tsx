"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { mentorContextLabels } from "../state/mentor-connection-selectors";
import type { MentorConnectionBrief } from "../types/mentor-connection.types";

export function MentorSendConfirmation({
  open,
  brief,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  brief: MentorConnectionBrief;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const firstName =
    brief.mentorSnapshot.name.split(" ").at(-1) ??
    brief.mentorSnapshot.name;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-workspace-border bg-workspace-panel">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-ink">
            Gửi yêu cầu kết nối tới anh {firstName}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-workspace-muted-text">
            Đây là mô phỏng gửi trong live demo. Kizuna sẽ không gửi
            email hay thông báo thật.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <p className="workspace-meta font-medium text-ink">
            Bạn đang chia sẻ:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 workspace-supporting text-workspace-muted-text">
            {brief.selectedContext.map((item) => (
              <li key={item}>
                {item === "selected_evidence"
                  ? `${brief.selectedEvidenceIds.length} evidence quan trọng`
                  : mentorContextLabels[item]}
              </li>
            ))}
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Gửi yêu cầu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
