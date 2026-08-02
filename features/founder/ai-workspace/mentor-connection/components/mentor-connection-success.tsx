"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  MessageSquareText,
  UserRoundCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackProductEvent } from "@/features/demo-domain/services/product-analytics";

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
  const accepted = request.status === "accepted";
  const acceptance = request.acceptance;
  const trackedAcceptanceRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (
      !acceptance ||
      trackedAcceptanceRef.current === acceptance.id
    ) {
      return;
    }
    trackedAcceptanceRef.current = acceptance.id;
    trackProductEvent("founder_acceptance_viewed", {
      requestId: request.id,
      acceptanceId: acceptance.id,
    });
  }, [acceptance, request.id]);

  const copyContact = async () => {
    if (!acceptance?.contactValue) return;
    await navigator.clipboard.writeText(acceptance.contactValue);
  };

  const openContact = () => {
    if (
      acceptance?.contactMethod !== "zalo" ||
      !acceptance.contactValue
    ) {
      return;
    }
    window.open(
      `https://zalo.me/${acceptance.contactValue.replace(/[^\d]/g, "")}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

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
            {accepted
              ? "Mentor đã chấp nhận"
              : "Đã gửi yêu cầu kết nối"}
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
                  {accepted
                    ? "Đã chấp nhận"
                    : "Đang chờ phản hồi"}
                </dd>
                <p className="mt-1 workspace-meta text-workspace-muted-text">
                  {accepted
                    ? "Đồng bộ từ Mentor Workspace"
                    : "Yêu cầu được lưu trong bản demo cục bộ"}
                </p>
              </div>
            </div>
            {accepted && acceptance ? (
              <div className="flex gap-3 py-4">
                <MessageSquareText className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <dt className="workspace-eyebrow text-workspace-muted-text">
                    Lời nhắn từ mentor
                  </dt>
                  <dd className="mt-1 workspace-supporting text-ink">
                    {acceptance.message}
                  </dd>
                  {acceptance.contactValue ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-workspace-border bg-workspace-panel px-2.5 py-1.5 workspace-meta text-ink">
                        {acceptance.contactMethod.toUpperCase()} ·{" "}
                        {acceptance.contactValue}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyContact}
                      >
                        <Copy className="size-3.5" />
                        Sao chép
                      </Button>
                      {acceptance.contactMethod === "zalo" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={openContact}
                        >
                          <ExternalLink className="size-3.5" />
                          Mở Zalo
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
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
