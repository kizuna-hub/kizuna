"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const goalOptions = [
  "Thiết kế pilot",
  "Chọn success metric",
  "Review prototype",
  "Xác định user segment",
  "Tôi chưa rõ",
];

export function MentorContextClarification({
  kind,
  prompt,
  working,
  onSubmit,
}: {
  kind: "goal" | "empty_venture";
  prompt: string;
  working: boolean;
  onSubmit: (answer: string) => void;
}) {
  const [answer, setAnswer] = React.useState("");
  return (
    <div className="flex min-h-full items-center justify-center p-5">
      <section className="w-full max-w-md">
        <p className="workspace-eyebrow text-primary">
          Kizuna cần một thông tin
        </p>
        <h2 className="mt-2 workspace-section-title text-ink">
          {prompt}
        </h2>
        {kind === "goal" ? (
          <div className="mt-4 grid gap-2">
            {goalOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant="outline"
                className="justify-start"
                disabled={working}
                onClick={() => onSubmit(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <Textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              aria-label="Mentor cần giúp bạn về việc gì"
              placeholder="Mô tả trong một hoặc hai câu..."
              className="min-h-28 border-workspace-border bg-workspace-elevated"
            />
            <Button
              type="button"
              className="mt-3 w-full"
              disabled={!answer.trim() || working}
              onClick={() => onSubmit(answer.trim())}
            >
              Tạo Connection Brief
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

