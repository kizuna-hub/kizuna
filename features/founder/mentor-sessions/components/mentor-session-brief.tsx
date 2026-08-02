"use client";

import {
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";

import type {
  MentorPreparationSession,
} from "../demo/mentor-session-data";

function itemId(group: "question" | "evidence", index: number) {
  return `${group}-${index}`;
}

export function MentorSessionBrief({
  session,
  open,
  onOpenChange,
  onAskKizuna,
  onOpenCycle,
}: {
  session: MentorPreparationSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAskKizuna: () => void;
  onOpenCycle: () => void;
}) {
  const { state, updateUiPreferences } = useDemoWorkspace();
  const completed =
    state.uiPreferences.mentorPreparationBySession?.[
      session.id
    ] ?? [];
  const total =
    session.questions.length + session.evidenceToPrepare.length;
  const progress = Math.round((completed.length / total) * 100);

  const toggle = (id: string, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...completed, id]))
      : completed.filter((item) => item !== id);
    updateUiPreferences({
      mentorPreparationBySession: {
        ...(state.uiPreferences.mentorPreparationBySession ?? {}),
        [session.id]: next,
      },
    });
  };

  const dismiss = () => {
    updateUiPreferences({
      dismissedMentorSessionIds: Array.from(
        new Set([
          ...(state.uiPreferences.dismissedMentorSessionIds ?? []),
          session.id,
        ]),
      ),
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto border-workspace-border bg-workspace-background p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b border-workspace-border px-4 py-4 pr-12 text-left sm:px-5">
          <p className="workspace-eyebrow text-workspace-warning">
            Sắp diễn ra · 30 phút nữa
          </p>
          <SheetTitle className="workspace-page-title text-ink">
            Chuẩn bị phiên với {session.mentorName}
          </SheetTitle>
          <SheetDescription className="workspace-supporting text-workspace-muted-text">
            {session.expertise.join(" · ")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-4 sm:p-5">
          <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
                <Target className="size-4" />
              </span>
              <div>
                <h2 className="workspace-section-title text-ink">
                  Mục tiêu phiên
                </h2>
                <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
                  {session.goal}
                </p>
              </div>
            </div>
            <p className="mt-3 border-t border-workspace-border pt-3 workspace-supporting text-workspace-muted-text">
              {session.currentContext}
            </p>
          </section>

          <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="workspace-section-title text-ink">
                Mức độ chuẩn bị
              </h2>
              <span className="workspace-meta text-primary">
                {completed.length}/{total}
              </span>
            </div>
            <Progress value={progress} className="mt-3 h-1.5" />
          </section>

          <PreparationList
            title="Câu hỏi nên hỏi"
            items={session.questions}
            group="question"
            completed={completed}
            onToggle={toggle}
          />
          <PreparationList
            title="Bằng chứng cần mang theo"
            items={session.evidenceToPrepare}
            group="evidence"
            completed={completed}
            onToggle={toggle}
          />

          <section className="rounded-xl border border-primary-border bg-primary-soft p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <h2 className="workspace-section-title text-ink">
                  Kết quả mong đợi
                </h2>
                <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
                  {session.expectedOutcome}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              onClick={onAskKizuna}
              className="h-11 workspace-control-text"
            >
              <Sparkles className="size-4" />
              Gợi ý thêm câu hỏi
            </Button>
            <Button
              variant="secondary"
              onClick={onOpenCycle}
              className="h-11 workspace-control-text"
            >
              <ExternalLink className="size-4" />
              Mở Decision Cycle
            </Button>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="inline-flex min-h-10 items-center gap-2 workspace-supporting text-workspace-muted-text hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40"
          >
            <CalendarClock className="size-4" />
            Ẩn nhắc nhở, vẫn giữ phiên trong workspace
          </button>

          <p className="border-t border-workspace-border pt-3 workspace-meta text-workspace-muted-text">
            Lời khuyên của mentor được lưu riêng với quyết định của
            founder và không tự động thay đổi Venture Memory.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PreparationList({
  title,
  items,
  group,
  completed,
  onToggle,
}: {
  title: string;
  items: string[];
  group: "question" | "evidence";
  completed: string[];
  onToggle: (id: string, checked: boolean) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-workspace-border bg-workspace-panel">
      <h2 className="border-b border-workspace-border px-4 py-3 workspace-section-title text-ink">
        {title}
      </h2>
      <div className="divide-y divide-workspace-border">
        {items.map((item, index) => {
          const id = itemId(group, index);
          const checked = completed.includes(id);
          return (
            <label
              key={id}
              className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-3 workspace-supporting text-ink"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(value) =>
                  onToggle(id, value === true)
                }
                aria-label={`Đánh dấu đã chuẩn bị: ${item}`}
              />
              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
