"use client";

import * as React from "react";
import {
  Check,
  Mail,
  MessageCircleMore,
  Phone,
  Send,
  UserRoundCheck,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { canonicalMentorPersona } from "../demo/mentor-workspace-demo-data";
import { validateMentorContact } from "../services/mentor-workspace-repository";
import { useMentorWorkspace } from "../state/mentor-workspace-provider";
import type {
  MentorConnectionRequest,
  MentorContactMethod,
  MentorDeclineReason,
  MentorMeetingPreference,
  MentorMoreContextTopic,
} from "../types/mentor-workspace.types";
import {
  contactMethodLabels,
  meetingPreferenceLabels,
} from "./mentor-workspace-labels";

const contactOptions: Array<{
  value: MentorContactMethod;
  icon: typeof Phone;
}> = [
  { value: "zalo", icon: MessageCircleMore },
  { value: "phone", icon: Phone },
  { value: "email", icon: Mail },
  { value: "messenger", icon: Send },
  { value: "mentor_will_contact", icon: UserRoundCheck },
];

const meetingOptions: MentorMeetingPreference[] = [
  "google_meet",
  "in_person",
  "coordinate_later",
];

const messageTemplates = {
  friendly: (ventureName: string) =>
    `Anh đã xem brief của ${ventureName}. Em liên hệ với anh qua Zalo để mình thống nhất lịch và cùng trao đổi kỹ hơn nhé.`,
  professional: (ventureName: string) =>
    `Tôi đã xem yêu cầu hỗ trợ của ${ventureName} và đồng ý kết nối. Bạn có thể liên hệ với tôi qua kênh bên dưới để thống nhất thời gian trao đổi.`,
  proactive: () =>
    "Anh đã xem context của team và đồng ý hỗ trợ. Anh sẽ chủ động liên hệ với em để thống nhất lịch trao đổi nhé.",
};

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
    contactPreference,
    mutationPending,
  } = useMentorWorkspace();
  const [message, setMessage] = React.useState(
    messageTemplates.friendly(request.venture.name),
  );
  const [contactMethod, setContactMethod] =
    React.useState<MentorContactMethod>(
      contactPreference?.preferredChannel ?? "zalo",
    );
  const [contactValue, setContactValue] = React.useState(
    contactPreference?.contactValue ?? "",
  );
  const [meetingPreference, setMeetingPreference] =
    React.useState<MentorMeetingPreference>(
      "coordinate_later",
    );
  const [saveAsDefault, setSaveAsDefault] =
    React.useState(true);
  const [submitError, setSubmitError] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setMessage(
      contactPreference?.defaultAcceptanceMessage ??
        messageTemplates.friendly(request.venture.name),
    );
    setContactMethod(
      contactPreference?.preferredChannel ?? "zalo",
    );
    setContactValue(contactPreference?.contactValue ?? "");
    setMeetingPreference("coordinate_later");
    setSubmitError(null);
  }, [contactPreference, open, request.venture.name]);

  const validation = validateMentorContact(
    contactMethod,
    contactValue,
  );
  const canSubmit =
    message.trim().length > 0 &&
    message.length <= 500 &&
    validation.valid &&
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
        contactMethod,
        contactValue,
        meetingPreference,
        saveAsDefault,
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
              <div
                className="flex flex-wrap gap-2"
                aria-label="Mẫu lời nhắn"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setMessage(
                      messageTemplates.friendly(
                        request.venture.name,
                      ),
                    )
                  }
                >
                  Thân thiện
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setMessage(
                      messageTemplates.professional(
                        request.venture.name,
                      ),
                    )
                  }
                >
                  Chuyên nghiệp
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMessage(messageTemplates.proactive());
                    setContactMethod("mentor_will_contact");
                    setContactValue("");
                  }}
                >
                  Tôi sẽ chủ động liên hệ
                </Button>
              </div>
              <Textarea
                id="mentor-acceptance-message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                rows={5}
                maxLength={520}
                className="min-h-28 border-workspace-border bg-workspace-background"
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="workspace-card-title">
                Founder có thể liên hệ với tôi qua
              </legend>
              <RadioGroup
                value={contactMethod}
                onValueChange={(value) => {
                  const nextMethod =
                    value as MentorContactMethod;
                  setContactMethod(nextMethod);
                  if (nextMethod === "mentor_will_contact") {
                    setContactValue("");
                    setMessage(messageTemplates.proactive());
                  }
                }}
                className="grid gap-2 sm:grid-cols-2"
              >
                {contactOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`contact-${option.value}`}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-workspace-border bg-workspace-background px-3 py-2 text-sm",
                        contactMethod === option.value &&
                          "border-primary-border bg-primary-soft",
                      )}
                    >
                      <RadioGroupItem
                        id={`contact-${option.value}`}
                        value={option.value}
                      />
                      <Icon
                        className="size-4 text-workspace-muted-text"
                        aria-hidden="true"
                      />
                      {contactMethodLabels[option.value]}
                    </Label>
                  );
                })}
              </RadioGroup>
              {contactMethod !== "mentor_will_contact" ? (
                <div className="space-y-2">
                  <Label htmlFor="mentor-contact-value">
                    {contactMethodLabels[contactMethod]}
                  </Label>
                  <Input
                    id="mentor-contact-value"
                    value={contactValue}
                    onChange={(event) =>
                      setContactValue(event.target.value)
                    }
                    placeholder={
                      contactMethod === "email"
                        ? "mentor@example.com"
                        : contactMethod === "messenger"
                          ? "facebook.com/minhquan"
                          : "09xxxxxxxx"
                    }
                    aria-invalid={!validation.valid}
                    className="border-workspace-border bg-workspace-background"
                  />
                  {!validation.valid && contactValue ? (
                    <p className="workspace-meta text-workspace-danger">
                      {validation.message}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <Label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox
                  checked={saveAsDefault}
                  onCheckedChange={(checked) =>
                    setSaveAsDefault(checked === true)
                  }
                />
                <span>
                  Dùng kênh này cho các request sau
                  <span className="mt-1 block workspace-meta text-workspace-muted-text">
                    Chỉ lưu sau khi bạn chấp nhận thành công.
                  </span>
                </span>
              </Label>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="workspace-card-title">
                Hình thức ưu tiên
              </legend>
              <RadioGroup
                value={meetingPreference}
                onValueChange={(value) =>
                  setMeetingPreference(
                    value as MentorMeetingPreference,
                  )
                }
                className="grid gap-2 sm:grid-cols-3"
              >
                {meetingOptions.map((option) => (
                  <Label
                    key={option}
                    htmlFor={`meeting-${option}`}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-workspace-border bg-workspace-background px-3 py-2 text-sm",
                      meetingPreference === option &&
                        "border-primary-border bg-primary-soft",
                    )}
                  >
                    <RadioGroupItem
                      id={`meeting-${option}`}
                      value={option}
                    />
                    {meetingPreferenceLabels[option]}
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>

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
