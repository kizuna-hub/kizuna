"use client";

import React from "react";
import {
  ArrowRight,
  FileSearch,
  MessageSquareText,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import type {
  VentureCreationIntent,
} from "@/features/founder/venture-foundation/types";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const methods: Array<{
  id: VentureCreationIntent;
  title: string;
  description: string;
  icon: typeof FileSearch;
}> = [
  {
    id: "analyze-materials",
    title: "Phân tích tài liệu startup",
    description:
      "Bắt đầu từ pitch deck, business plan hoặc brief hiện có.",
    icon: FileSearch,
  },
  {
    id: "conversational-setup",
    title: "Mô tả ý tưởng bằng hội thoại",
    description:
      "Kizuna hỏi ngắn gọn về vấn đề, người dùng và mục tiêu.",
    icon: MessageSquareText,
  },
  {
    id: "empty-venture",
    title: "Tạo venture trống",
    description:
      "Tạo khung tối thiểu và bổ sung context theo từng bước.",
    icon: Plus,
  },
];

export function VentureStartScreen() {
  const router = useRouter();
  const { createDemoVenture, updateVentureSetup } =
    useDemoWorkspace();
  const [intent, setIntent] =
    React.useState<VentureCreationIntent>(
      "conversational-setup",
    );
  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState<File>();
  const [error, setError] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const requestIdRef = React.useRef(
    `create-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  const createDraft = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Nhập tên venture để tạo draft.");
      return;
    }
    if (creating) return;
    setCreating(true);

    const ventureId = createDemoVenture({
      requestId: requestIdRef.current,
      creationIntent: intent,
      name: trimmedName,
      oneLineDescription:
        "Context đang được hoàn thiện trong Kizuna.",
      stage: "idea",
      currentPhase: "venture-context",
      initialSetupStepId:
        intent === "analyze-materials" ? "materials" : "problem",
    });

    if (file) {
      updateVentureSetup(ventureId, {
        materials: [
          {
            id: `material-${file.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
          },
        ],
      });
    }

    router.push(`/founder/projects/${ventureId}/setup`);
  };

  return (
    <FounderShell contentWidth="focused">
      <div className="space-y-5">
        <header className="border-b border-workspace-border pb-4">
          <p className="workspace-eyebrow text-primary">
            Venture mới
          </p>
          <h1 className="mt-1.5 workspace-page-title text-ink">
            Bạn muốn bắt đầu như thế nào?
          </h1>
          <p className="mt-1.5 max-w-2xl workspace-body text-workspace-muted-text">
            Chọn một cách để Kizuna tạo đúng context ban đầu. Bạn có
            thể chỉnh lại mọi thông tin trước khi xác nhận.
          </p>
        </header>

        <section
          aria-label="Cách bắt đầu venture"
          className="grid gap-3 md:grid-cols-3"
        >
          {methods.map((method) => {
            const Icon = method.icon;
            const selected = intent === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => {
                  setIntent(method.id);
                  setError("");
                }}
                aria-pressed={selected}
                className={cn(
                  "min-h-44 rounded-xl border bg-workspace-panel p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40",
                  selected
                    ? "border-primary bg-workspace-selected"
                    : "border-workspace-border hover:bg-workspace-row-hover",
                )}
              >
                <span className="flex size-10 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="mt-4 block workspace-card-title text-ink">
                  {method.title}
                </span>
                <span className="mt-1.5 block workspace-supporting text-workspace-muted-text">
                  {method.description}
                </span>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
          <label className="block">
            <span className="workspace-supporting font-medium text-ink">
              Tên venture
            </span>
            <Input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              maxLength={80}
              placeholder="Ví dụ: Nova Labs"
              className="mt-2 h-11 border-workspace-border bg-workspace-elevated"
              aria-invalid={Boolean(error)}
            />
          </label>

          {intent === "analyze-materials" ? (
            <label className="mt-4 block">
              <span className="workspace-supporting font-medium text-ink">
                Tài liệu đầu tiên (tuỳ chọn)
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={(event) =>
                  setFile(event.target.files?.[0])
                }
                className="mt-2 block w-full workspace-supporting text-workspace-muted-text file:mr-3 file:rounded-md file:border file:border-workspace-border file:bg-workspace-elevated file:px-3 file:py-2 file:text-ink"
              />
            </label>
          ) : null}

          {error ? (
            <p className="mt-2 workspace-meta text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button
              asChild
              variant="ghost"
              className="h-11 workspace-control-text"
            >
              <Link href="/founder/home">Huỷ</Link>
            </Button>
            <Button
              type="button"
              onClick={createDraft}
              disabled={creating}
              className="h-11 px-5 workspace-control-text"
            >
              {creating ? "Đang tạo…" : "Tạo venture draft"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>

        <p className="workspace-meta text-workspace-muted-text">
          Đây là flow demo. Tên file được lưu cục bộ; nội dung file
          không được tải lên backend.
        </p>
      </div>
    </FounderShell>
  );
}

