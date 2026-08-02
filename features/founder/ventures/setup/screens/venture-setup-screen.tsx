"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { getVentureById } from "@/features/founder/venture-foundation/demo-repository";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import type {
  VentureSetupMaterial,
  VentureSetupStepId,
} from "@/features/founder/venture-foundation/types";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const steps: Array<{
  id: VentureSetupStepId;
  label: string;
}> = [
  { id: "venture-name", label: "Tên venture" },
  { id: "problem", label: "Vấn đề" },
  { id: "target-user", label: "Người dùng mục tiêu" },
  { id: "materials", label: "Tài liệu" },
  { id: "confirm-context", label: "Xác nhận context" },
];

export function VentureSetupScreen({
  ventureId,
}: {
  ventureId: string;
}) {
  const router = useRouter();
  const {
    state,
    hydrated,
    updateVentureSetup,
    confirmVentureSetup,
  } = useDemoWorkspace();
  const venture = getVentureById(state, ventureId);
  const setup = venture?.setup;
  const [name, setName] = React.useState("");
  const [stage, setStage] = React.useState("idea");
  const [problem, setProblem] = React.useState("");
  const [targetUser, setTargetUser] = React.useState("");
  const [initialGoal, setInitialGoal] = React.useState("");
  const [materials, setMaterials] = React.useState<
    VentureSetupMaterial[]
  >([]);
  const [error, setError] = React.useState("");
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (!venture || initializedRef.current) return;
    initializedRef.current = true;
    setName(venture.name);
    setStage(venture.stage);
    setProblem(setup?.draft.problem ?? "");
    setTargetUser(setup?.draft.targetUser ?? "");
    setInitialGoal(setup?.draft.initialGoal ?? "");
    setMaterials(setup?.draft.materials ?? []);
  }, [setup, venture]);

  if (!hydrated) {
    return (
      <FounderShell contentWidth="focused">
        <div
          role="status"
          className="flex min-h-[60dvh] items-center justify-center gap-3 workspace-supporting text-workspace-muted-text"
        >
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          Đang khôi phục setup…
        </div>
      </FounderShell>
    );
  }

  if (!venture || venture.status === "archived") {
    return (
      <FounderShell contentWidth="focused">
        <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
          <h1 className="workspace-page-title text-ink">
            Không thể mở venture này lúc này.
          </h1>
          <Button asChild className="mt-4">
            <Link href="/founder/projects">Quay về Projects</Link>
          </Button>
        </section>
      </FounderShell>
    );
  }

  const currentStepId =
    setup?.currentStepId ?? "venture-name";
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStepId),
  );
  const completed = setup?.completedStepIds ?? [];
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100);
  const hasMeaningfulData = Boolean(
    problem || targetUser || initialGoal || materials.length,
  );
  const localMissing = [
    !name.trim() ? "Tên venture" : "",
    !problem.trim() ? "Vấn đề" : "",
    !targetUser.trim() ? "Người dùng mục tiêu" : "",
    !initialGoal.trim() ? "Mục tiêu ban đầu" : "",
  ].filter(Boolean);
  const canConfirm = localMissing.length === 0;

  const persist = (
    nextStepId: VentureSetupStepId,
    completedStepIds = completed,
  ) => {
    updateVentureSetup(ventureId, {
      currentStepId: nextStepId,
      completedStepIds,
      name,
      stage: stage as typeof venture.stage,
      problem,
      targetUser,
      initialGoal,
      materials,
    });
  };

  const validateCurrent = () => {
    if (currentStepId === "venture-name" && !name.trim()) {
      return "Tên venture không được để trống.";
    }
    if (currentStepId === "problem" && !problem.trim()) {
      return "Mô tả ngắn vấn đề cần giải quyết.";
    }
    if (
      currentStepId === "target-user" &&
      (!targetUser.trim() || !initialGoal.trim())
    ) {
      return "Bổ sung người dùng mục tiêu và mục tiêu ban đầu.";
    }
    return "";
  };

  const next = () => {
    const validation = validateCurrent();
    if (validation) {
      setError(validation);
      return;
    }
    const nextStep = steps[Math.min(currentIndex + 1, 4)].id;
    const nextCompleted = Array.from(
      new Set<VentureSetupStepId>([
        ...completed,
        currentStepId,
      ]),
    );
    setError("");
    persist(nextStep, nextCompleted);
  };

  const back = () => {
    if (currentIndex === 0) return;
    const previous = steps[currentIndex - 1].id;
    setError("");
    persist(previous);
  };

  const confirm = () => {
    persist(
      "confirm-context",
      Array.from(
        new Set<VentureSetupStepId>([
          ...completed,
          "materials",
        ]),
      ),
    );
    const confirmed = confirmVentureSetup(ventureId);
    if (!confirmed) {
      setError(
        "Context còn thiếu trường bắt buộc. Hãy quay lại bước được đánh dấu.",
      );
      return;
    }
    router.replace(
      `/founder/projects/${ventureId}/workspace?conversation=conversation-activation`,
    );
  };

  const leaveSetup = () => {
    if (
      hasMeaningfulData &&
      !window.confirm(
        "Dữ liệu setup đã được lưu. Bạn muốn rời flow và tiếp tục sau?",
      )
    ) {
      return;
    }
    persist(currentStepId);
    router.push("/founder/home");
  };

  return (
    <FounderShell ventureId={ventureId} contentWidth="focused">
      <div className="space-y-5">
        <header className="border-b border-workspace-border pb-4">
          <p className="workspace-eyebrow text-primary">
            Thiết lập venture
          </p>
          <h1 className="mt-1.5 workspace-page-title text-ink">
            Hoàn thiện context cho {venture.name}
          </h1>
          <p className="mt-1.5 workspace-body text-workspace-muted-text">
            Kizuna khôi phục đúng bước đang làm và lưu tiến độ cục bộ.
          </p>
        </header>

        <section className="overflow-x-auto rounded-xl border border-workspace-border bg-workspace-panel p-3">
          <ol className="flex min-w-[720px] items-center gap-2">
            {steps.map((step, index) => {
              const isCurrent = step.id === currentStepId;
              const isCompleted = completed.includes(step.id);
              const canOpen = index <= currentIndex || isCompleted;
              return (
                <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
                  <button
                    type="button"
                    disabled={!canOpen}
                    onClick={() => persist(step.id)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "flex min-h-10 flex-1 items-center gap-2 rounded-lg px-2.5 text-left workspace-supporting focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40",
                      isCurrent && "bg-workspace-selected text-ink",
                      !isCurrent && "text-workspace-muted-text",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border workspace-meta",
                        isCompleted
                          ? "border-primary-border bg-primary-soft text-primary"
                          : isCurrent
                            ? "border-primary bg-primary text-on-primary"
                            : "border-workspace-border",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="size-3.5" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="truncate">{step.label}</span>
                  </button>
                  {index < steps.length - 1 ? (
                    <span className="h-px w-3 bg-workspace-border" />
                  ) : null}
                </li>
              );
            })}
          </ol>
          <Progress value={progress} className="mt-3 h-1" />
        </section>

        <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4 sm:p-5">
          <StepContent
            stepId={currentStepId}
            name={name}
            stage={stage}
            problem={problem}
            targetUser={targetUser}
            initialGoal={initialGoal}
            materials={materials}
            missing={localMissing}
            onNameChange={setName}
            onStageChange={setStage}
            onProblemChange={setProblem}
            onTargetUserChange={setTargetUser}
            onInitialGoalChange={setInitialGoal}
            onAddFiles={(files) =>
              setMaterials((current) => [
                ...current,
                ...files.map((file, index) => ({
                  id: `setup-material-${Date.now()}-${index}`,
                  name: file.name,
                  size: file.size,
                  type:
                    file.type || "application/octet-stream",
                })),
              ])
            }
            onRemoveMaterial={(id) =>
              setMaterials((current) =>
                current.filter((item) => item.id !== id),
              )
            }
          />

          {error ? (
            <p className="mt-4 workspace-supporting text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-workspace-border pt-4 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={leaveSetup}
              className="h-11 workspace-control-text sm:mr-auto"
            >
              Lưu và rời setup
            </Button>
            {currentIndex > 0 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={back}
                className="h-11 workspace-control-text"
              >
                <ArrowLeft className="size-4" />
                Quay lại
              </Button>
            ) : null}
            {currentStepId === "confirm-context" ? (
              <Button
                type="button"
                onClick={confirm}
                disabled={!canConfirm}
                className="h-11 workspace-control-text"
              >
                <Check className="size-4" />
                Xác nhận context
              </Button>
            ) : (
              <Button
                type="button"
                onClick={next}
                className="h-11 workspace-control-text"
              >
                Tiếp tục
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </section>
      </div>
    </FounderShell>
  );
}

function StepContent({
  stepId,
  name,
  stage,
  problem,
  targetUser,
  initialGoal,
  materials,
  missing,
  onNameChange,
  onStageChange,
  onProblemChange,
  onTargetUserChange,
  onInitialGoalChange,
  onAddFiles,
  onRemoveMaterial,
}: {
  stepId: VentureSetupStepId;
  name: string;
  stage: string;
  problem: string;
  targetUser: string;
  initialGoal: string;
  materials: VentureSetupMaterial[];
  missing: string[];
  onNameChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onProblemChange: (value: string) => void;
  onTargetUserChange: (value: string) => void;
  onInitialGoalChange: (value: string) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveMaterial: (id: string) => void;
}) {
  if (stepId === "venture-name") {
    return (
      <div>
        <h2 className="workspace-section-title text-ink">
          Tên và giai đoạn venture
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="workspace-supporting text-ink">
              Tên venture
            </span>
            <Input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={80}
              className="mt-2 h-11 border-workspace-border bg-workspace-elevated"
            />
          </label>
          <label>
            <span className="workspace-supporting text-ink">
              Giai đoạn
            </span>
            <select
              value={stage}
              onChange={(event) => onStageChange(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-workspace-border bg-workspace-elevated px-3 workspace-input-text text-ink"
            >
              <option value="idea">Idea</option>
              <option value="concept">Concept</option>
              <option value="prototype">Prototype</option>
              <option value="mvp">MVP</option>
              <option value="pilot">Pilot</option>
              <option value="launched">Launched</option>
            </select>
          </label>
        </div>
      </div>
    );
  }

  if (stepId === "problem") {
    return (
      <label className="block">
        <span className="workspace-section-title text-ink">
          Venture đang giải quyết vấn đề gì?
        </span>
        <span className="mt-1.5 block workspace-supporting text-workspace-muted-text">
          Viết đủ ngắn để founder, mentor và Kizuna cùng hiểu một
          vấn đề.
        </span>
        <Textarea
          value={problem}
          onChange={(event) => onProblemChange(event.target.value)}
          rows={6}
          placeholder="Ai đang gặp vấn đề gì, trong hoàn cảnh nào?"
          className="mt-4 border-workspace-border bg-workspace-elevated"
        />
      </label>
    );
  }

  if (stepId === "target-user") {
    return (
      <div>
        <h2 className="workspace-section-title text-ink">
          Người dùng và mục tiêu ban đầu
        </h2>
        <div className="mt-4 grid gap-4">
          <label>
            <span className="workspace-supporting text-ink">
              Người dùng mục tiêu
            </span>
            <Textarea
              value={targetUser}
              onChange={(event) =>
                onTargetUserChange(event.target.value)
              }
              rows={3}
              placeholder="Nhóm người dùng cụ thể nhất hiện tại"
              className="mt-2 border-workspace-border bg-workspace-elevated"
            />
          </label>
          <label>
            <span className="workspace-supporting text-ink">
              Mục tiêu cần làm rõ trước tiên
            </span>
            <Input
              value={initialGoal}
              onChange={(event) =>
                onInitialGoalChange(event.target.value)
              }
              placeholder="Ví dụ: Xác định activation moment"
              className="mt-2 h-11 border-workspace-border bg-workspace-elevated"
            />
          </label>
        </div>
      </div>
    );
  }

  if (stepId === "materials") {
    return (
      <div>
        <h2 className="workspace-section-title text-ink">
          Tài liệu hiện có
        </h2>
        <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
          Tuỳ chọn. Demo chỉ lưu metadata file cục bộ.
        </p>
        <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-workspace-border bg-workspace-elevated px-4 workspace-control-text text-ink hover:bg-workspace-row-hover">
          <Plus className="size-4" />
          Chọn tài liệu
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            className="sr-only"
            onChange={(event) =>
              onAddFiles(Array.from(event.target.files ?? []))
            }
          />
        </label>
        {materials.length ? (
          <ul className="mt-4 divide-y divide-workspace-border rounded-lg border border-workspace-border">
            {materials.map((material) => (
              <li
                key={material.id}
                className="flex min-h-12 items-center gap-3 px-3 py-2"
              >
                <FileText className="size-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate workspace-supporting text-ink">
                  {material.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveMaterial(material.id)}
                  aria-label={`Bỏ ${material.name}`}
                  className="flex size-9 items-center justify-center rounded-md text-workspace-muted-text hover:bg-workspace-row-hover hover:text-ink"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  const summaryRows = [
    ["Venture", name],
    ["Vấn đề", problem],
    ["Người dùng mục tiêu", targetUser],
    ["Mục tiêu ban đầu", initialGoal],
    [
      "Tài liệu",
      materials.length
        ? `${materials.length} tài liệu đã chọn`
        : "Chưa có — có thể bổ sung sau",
    ],
  ];

  return (
    <div>
      <h2 className="workspace-section-title text-ink">
        Xác nhận context ban đầu
      </h2>
      <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
        Context này tạo nền cho Venture Memory, cuộc trò chuyện đầu
        tiên và readiness baseline.
      </p>
      <dl className="mt-4 divide-y divide-workspace-border rounded-lg border border-workspace-border">
        {summaryRows.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 px-3.5 py-3 sm:grid-cols-[160px_minmax(0,1fr)]"
          >
            <dt className="workspace-eyebrow text-workspace-muted-text">
              {label}
            </dt>
            <dd className="workspace-supporting text-ink">
              {value || "Còn thiếu"}
            </dd>
          </div>
        ))}
      </dl>
      {missing.length ? (
        <div className="mt-4 rounded-lg border border-workspace-warning/30 bg-workspace-warning-soft px-3.5 py-3">
          <p className="workspace-supporting font-medium text-ink">
            Context còn thiếu
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {missing.join(" · ")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
