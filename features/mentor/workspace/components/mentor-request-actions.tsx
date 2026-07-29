"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { canonicalMentorPersona } from "../demo/mentor-workspace-demo-data";
import { useMentorWorkspace } from "../state/mentor-workspace-provider";
import type {
  MentorConnectionRequest,
  MentorContactMethod,
  MentorDeclineReason,
  MentorMeetingPreference,
  MentorMoreContextTopic,
} from "../types/mentor-workspace.types";


const bottomSheetClass =
  "max-sm:bottom-0 max-sm:left-0 max-sm:top-auto max-sm:max-h-[92dvh] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:rounded-t-2xl";

export function MentorAcceptanceDialog({
  request,
  open,
  onOpenChange,
}: {
  request: MentorConnectionRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    accept,
    mutationPending,
  } = useMentorWorkspace();
  const [message, setMessage] = React.useState("");
  const [submitError, setSubmitError] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setMessage("");
    setSubmitError(null);
  }, [open]);

  const canSubmit =
    message.trim().length > 0 &&
    message.length <= 500 &&
    !mutationPending &&
    request.status !== "cancelled" &&
    request.status !== "accepted";

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitError(null);
    try {
      await accept({
        requestId: request.id,
        mentorId: canonicalMentorPersona.id,
        message,
        contactMethod: "mentor_will_contact",
        contactValue: "",
        meetingPreference: "coordinate_later",
        saveAsDefault: false,
      });
      toast.success("Đã chấp nhận yêu cầu kết nối.");
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Chưa thể chấp nhận yêu cầu.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90dvh] gap-0 overflow-y-auto border-workspace-border bg-workspace-panel p-0 sm:max-w-2xl",
          bottomSheetClass,
        )}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-workspace-border px-6 py-5 pr-12">
            <DialogTitle>Chấp nhận yêu cầu kết nối</DialogTitle>
            <DialogDescription>
              Gửi lời nhắn và chọn cách founder có thể liên hệ
              với bạn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-5">
            <div className="grid gap-3 rounded-xl border border-workspace-border bg-workspace-elevated p-4 sm:grid-cols-2">
              <div>
                <p className="workspace-meta text-workspace-muted-text">
                  Founder
                </p>
                <p className="workspace-card-title mt-1">
                  {request.founder.name}
                </p>
              </div>
              <div>
                <p className="workspace-meta text-workspace-muted-text">
                  Venture
                </p>
                <p className="workspace-card-title mt-1">
                  {request.venture.name}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="mentor-acceptance-message">
                  Lời nhắn cho founder
                </Label>
                <span
                  className={cn(
                    "workspace-meta text-workspace-muted-text",
                    message.length > 500 &&
                      "text-workspace-danger",
                  )}
                >
                  {message.length}/500
                </span>
              </div>
              <Textarea
                id="mentor-acceptance-message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                rows={5}
                maxLength={520}
                className="min-h-28 mt-4 border-workspace-border bg-workspace-background"
                placeholder="Nhập lời nhắn cho founder..."
              />
            </div>

            {submitError ? (
              <p
                role="alert"
                className="rounded-lg bg-workspace-danger-soft px-3 py-2 workspace-supporting text-workspace-danger"
              >
                {submitError}
              </p>
            ) : null}
          </div>

          <DialogFooter className="border-t border-workspace-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Quay lại
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {mutationPending ? (
                "Đang chấp nhận…"
              ) : (
                <>
                  <Check />
                  Chấp nhận và gửi lời nhắn
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const moreContextOptions: Array<{
  value: MentorMoreContextTopic;
  label: string;
}> = [
  {
    value: "product_summary",
    label: "Tóm tắt product rõ hơn",
  },
  {
    value: "current_challenge",
    label: "Khó khăn hiện tại",
  },
  {
    value: "founder_question",
    label: "Câu hỏi founder muốn chốt",
  },
  { value: "evidence", label: "Evidence hiện có" },
  { value: "documents", label: "Tài liệu liên quan" },
  { value: "other", label: "Nội dung khác" },
];

export function MentorMoreContextDialog({
  request,
  open,
  onOpenChange,
}: {
  request: MentorConnectionRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { requestMoreContext, mutationPending } =
    useMentorWorkspace();
  const [topics, setTopics] = React.useState<
    MentorMoreContextTopic[]
  >([]);
  const [note, setNote] = React.useState("");
  const [submitError, setSubmitError] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setTopics([]);
    setNote("");
    setSubmitError(null);
  }, [open]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (topics.length === 0 || mutationPending) return;
    try {
      await requestMoreContext({
        requestId: request.id,
        selectedTopics: topics,
        note,
      });
      toast.success("Đã gửi yêu cầu bổ sung context.");
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Chưa thể gửi yêu cầu.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "border-workspace-border bg-workspace-panel sm:max-w-lg",
          bottomSheetClass,
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Cần thêm thông tin</DialogTitle>
            <DialogDescription>
              Chọn những phần {request.founder.name} cần bổ
              sung. Đây là mock handoff, chưa gửi thông báo thật.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-2">
            {moreContextOptions.map((option) => {
              const checked = topics.includes(option.value);
              return (
                <Label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border border-workspace-border bg-workspace-background px-3 py-3 text-sm",
                    checked &&
                      "border-primary-border bg-primary-soft",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(nextChecked) =>
                      setTopics((current) =>
                        nextChecked
                          ? [...current, option.value]
                          : current.filter(
                              (item) => item !== option.value,
                            ),
                      )
                    }
                  />
                  {option.label}
                </Label>
              );
            })}
          </div>
          <div className="space-y-2">
            <Label htmlFor="more-context-note">
              Ghi chú thêm (không bắt buộc)
            </Label>
            <Textarea
              id="more-context-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={300}
              placeholder="Nêu rõ điều bạn cần founder bổ sung…"
              className="border-workspace-border bg-workspace-background"
            />
          </div>
          {submitError ? (
            <p role="alert" className="text-sm text-workspace-danger">
              {submitError}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={topics.length === 0 || mutationPending}
            >
              {mutationPending
                ? "Đang gửi…"
                : "Gửi yêu cầu bổ sung"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const declineOptions: Array<{
  value: MentorDeclineReason;
  label: string;
}> = [
  {
    value: "expertise_mismatch",
    label: "Không đúng chuyên môn",
  },
  { value: "no_time", label: "Không có thời gian" },
  {
    value: "insufficient_context",
    label: "Context chưa đủ rõ",
  },
  {
    value: "conflict_of_interest",
    label: "Xung đột lợi ích",
  },
  { value: "other", label: "Khác" },
];

export function MentorDeclineDialog({
  request,
  open,
  onOpenChange,
}: {
  request: MentorConnectionRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { decline, mutationPending } = useMentorWorkspace();
  const [reason, setReason] =
    React.useState<MentorDeclineReason>("no_time");
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setReason("no_time");
    setNote("");
  }, [open]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    try {
      await decline({
        requestId: request.id,
        reason,
        note,
      });
      toast.success("Đã lưu quyết định từ chối.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Chưa thể từ chối yêu cầu.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-workspace-border bg-workspace-panel sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu?</DialogTitle>
            <DialogDescription>
              Yêu cầu của {request.venture.name} sẽ được giữ
              trong lịch sử, không bị xóa.
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            value={reason}
            onValueChange={(value) =>
              setReason(value as MentorDeclineReason)
            }
          >
            {declineOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`decline-${option.value}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-workspace-border bg-workspace-background px-3 py-2 text-sm"
              >
                <RadioGroupItem
                  id={`decline-${option.value}`}
                  value={option.value}
                />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="decline-note">
              Ghi chú (không bắt buộc)
            </Label>
            <Textarea
              id="decline-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="border-workspace-border bg-workspace-background"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={mutationPending}
            >
              {mutationPending
                ? "Đang xử lý…"
                : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
