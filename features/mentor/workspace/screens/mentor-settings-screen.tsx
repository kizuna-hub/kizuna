"use client";

import * as React from "react";
import { Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { validateMentorContact } from "../services/mentor-workspace-repository";
import { useMentorWorkspace } from "../state/mentor-workspace-provider";
import type { MentorContactMethod } from "../types/mentor-workspace.types";
import { contactMethodLabels } from "../components/mentor-workspace-labels";

export function MentorSettingsScreen() {
  const {
    contactPreference,
    saveContactPreference,
    mutationPending,
  } = useMentorWorkspace();
  const [method, setMethod] =
    React.useState<MentorContactMethod>("zalo");
  const [value, setValue] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!contactPreference) return;
    setMethod(contactPreference.preferredChannel);
    setValue(contactPreference.contactValue ?? "");
    setMessage(
      contactPreference.defaultAcceptanceMessage ?? "",
    );
  }, [contactPreference]);

  const validation = validateMentorContact(method, value);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!validation.valid || mutationPending) return;
    try {
      await saveContactPreference({
        preferredChannel: method,
        contactValue: value,
        defaultAcceptanceMessage: message.trim() || undefined,
      });
      toast.success("Đã lưu cài đặt liên hệ.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Chưa thể lưu cài đặt.",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <header className="border-b border-workspace-border pb-5">
        <h1 className="workspace-page-title">Cài đặt</h1>
        <p className="mt-1 workspace-card-body text-workspace-muted-text">
          Quản lý contact mặc định cho luồng chấp nhận request.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-xl border border-workspace-border bg-workspace-panel"
      >
        <div className="border-b border-workspace-border p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="workspace-section-title">
              Contact handoff mặc định
            </h2>
          </div>
          <p className="mt-2 workspace-supporting text-workspace-muted-text">
            Thông tin này chỉ được chia sẻ sau khi bạn chủ động
            chấp nhận yêu cầu.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="default-contact-method">
              Kênh liên hệ
            </Label>
            <Select
              value={method}
              onValueChange={(next) => {
                const nextMethod = next as MentorContactMethod;
                setMethod(nextMethod);
                if (nextMethod === "mentor_will_contact") {
                  setValue("");
                }
              }}
            >
              <SelectTrigger
                id="default-contact-method"
                className="w-full border-workspace-border bg-workspace-background"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-workspace-border bg-workspace-panel">
                {(
                  Object.keys(
                    contactMethodLabels,
                  ) as MentorContactMethod[]
                ).map((option) => (
                  <SelectItem key={option} value={option}>
                    {contactMethodLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {method !== "mentor_will_contact" ? (
            <div className="space-y-2">
              <Label htmlFor="default-contact-value">
                {contactMethodLabels[method]}
              </Label>
              <Input
                id="default-contact-value"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                aria-invalid={!validation.valid}
                placeholder={
                  method === "email"
                    ? "mentor@example.com"
                    : method === "messenger"
                      ? "facebook.com/minhquan"
                      : "09xxxxxxxx"
                }
                className="border-workspace-border bg-workspace-background"
              />
              {!validation.valid && value ? (
                <p className="workspace-meta text-workspace-danger">
                  {validation.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="default-acceptance-message">
                Lời nhắn mặc định
              </Label>
              <span className="workspace-meta text-workspace-muted-text">
                {message.length}/500
              </span>
            </div>
            <Textarea
              id="default-acceptance-message"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value.slice(0, 500))
              }
              placeholder="Lời nhắn sẽ được điền sẵn khi bạn chấp nhận…"
              className="min-h-28 border-workspace-border bg-workspace-background"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-workspace-border p-4">
          <Button
            type="submit"
            disabled={!validation.valid || mutationPending}
          >
            <Save />
            {mutationPending ? "Đang lưu…" : "Lưu cài đặt"}
          </Button>
        </div>
      </form>
    </div>
  );
}
