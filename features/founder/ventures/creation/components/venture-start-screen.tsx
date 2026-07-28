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
import type { VentureCreationIntent } from "@/features/founder/venture-foundation/types";
import {
  completeDocumentOnboarding,
  DocumentAnalysisScreen,
  DocumentUploadForm,
  persistDocumentOnboardingTransaction,
  type StartupDocumentInput,
  type VentureAnalysisResult,
} from "@/features/founder/ventures/document-onboarding";
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
      "Bắt đầu từ Pitch Deck hoặc Business Plan hiện có.",
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
  const {
    state,
    createDemoVenture,
    replaceDemoState,
  } = useDemoWorkspace();
  const [intent, setIntent] =
    React.useState<VentureCreationIntent>(
      "conversational-setup",
    );
  const [name, setName] = React.useState("");
  const [documents, setDocuments] = React.useState<
    StartupDocumentInput[]
  >([]);
  const [analysisRunId, setAnalysisRunId] =
    React.useState<string>();
  const [error, setError] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [workspaceError, setWorkspaceError] =
    React.useState<string>();
  const requestIdsRef = React.useRef<
    Partial<Record<VentureCreationIntent, string>>
  >({});
  const analysisActiveRef = React.useRef(false);

  const requestIdFor = (creationIntent: VentureCreationIntent) => {
    if (!requestIdsRef.current[creationIntent]) {
      requestIdsRef.current[creationIntent] =
        `create-${creationIntent}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;
    }
    return requestIdsRef.current[creationIntent]!;
  };

  const createDraft = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Nhập tên venture để tiếp tục.");
      return;
    }
    if (creating) return;
    setCreating(true);
    const ventureId = createDemoVenture({
      requestId: requestIdFor(intent),
      creationIntent: intent,
      name: trimmedName,
      oneLineDescription:
        intent === "empty-venture"
          ? "Context sẽ được bổ sung trong Kizuna."
          : "Kizuna sẽ cùng founder làm rõ context bằng hội thoại.",
      stage: "idea",
      currentPhase: "venture-context",
      initialSetupStepId: "problem",
    });
    router.push(`/founder/projects/${ventureId}/setup`);
  };

  const beginAnalysis = () => {
    if (
      documents.length === 0 ||
      analysisRunId ||
      analysisActiveRef.current
    ) {
      return;
    }
    analysisActiveRef.current = true;
    setWorkspaceError(undefined);
    setError("");
    setAnalysisRunId(
      `analysis-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
    );
  };

  const enterWorkspace = (
    analysisResult: VentureAnalysisResult,
  ) => {
    if (creating) return;
    setCreating(true);
    setWorkspaceError(undefined);

    try {
      const orchestration = completeDocumentOnboarding(
        state,
        {
          analysisRunId: analysisResult.runId,
          ventureContext: analysisResult.detectedContext,
          analysisResult,
          sourceDocuments:
            analysisResult.sourceDocuments,
        },
      );
      persistDocumentOnboardingTransaction(
        window.localStorage,
        orchestration,
      );
      replaceDemoState(orchestration.state);
      router.push(orchestration.workspacePath);
    } catch (initializationError) {
      setCreating(false);
      setWorkspaceError(
        initializationError instanceof Error
          ? initializationError.message
          : "Hãy thử lại sau ít phút.",
      );
    }
  };

  if (analysisRunId) {
    return (
      <FounderShell contentWidth="wide">
        <DocumentAnalysisScreen
          ventureName={name}
          documents={documents}
          initialRunId={analysisRunId}
          enteringWorkspace={creating}
          workspaceError={workspaceError}
          onEnterWorkspace={enterWorkspace}
          onReviewFiles={() => {
            analysisActiveRef.current = false;
            setCreating(false);
            setWorkspaceError(undefined);
            setAnalysisRunId(undefined);
          }}
          onContinueConversation={() => {
            analysisActiveRef.current = false;
            setCreating(false);
            setWorkspaceError(undefined);
            setAnalysisRunId(undefined);
            setIntent("conversational-setup");
            if (!name.trim()) setName("CampusFlow");
          }}
        />
      </FounderShell>
    );
  }

  const modeCopy = {
    "conversational-setup": {
      heading: "Bắt đầu bằng một cuộc hội thoại",
      description:
        "Tạo venture draft, sau đó Kizuna sẽ hỏi lần lượt về vấn đề, người dùng và mục tiêu đầu tiên.",
      cta: "Bắt đầu trò chuyện",
    },
    "empty-venture": {
      heading: "Tạo một workspace trống",
      description:
        "Chỉ cần tên venture. Bạn có thể bổ sung toàn bộ context sau.",
      cta: "Tạo workspace trống",
    },
  } as const;

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
            Chọn một cách để Kizuna tạo đúng context ban đầu.
            Bạn vẫn có thể chỉnh lại mọi thông tin trước khi
            xác nhận.
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
                  "min-h-44 rounded-xl border bg-workspace-panel p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 motion-reduce:transition-none",
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

        {intent === "analyze-materials" ? (
          <DocumentUploadForm
            ventureName={name}
            documents={documents}
            analyzing={false}
            onVentureNameChange={(value) => {
              setName(value);
              setError("");
            }}
            onDocumentsChange={setDocuments}
            onAnalyze={beginAnalysis}
          />
        ) : (
          <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4 sm:p-5">
            <h2 className="workspace-section-title text-ink">
              {modeCopy[intent].heading}
            </h2>
            <p className="mt-1.5 workspace-supporting text-workspace-muted-text">
              {modeCopy[intent].description}
            </p>
            <label className="mt-5 block max-w-2xl">
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
                placeholder="Ví dụ: CampusFlow"
                className="mt-2 h-11 border-workspace-border bg-workspace-elevated"
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? "venture-name-error" : undefined
                }
              />
            </label>

            {error ? (
              <p
                id="venture-name-error"
                className="mt-2 workspace-meta text-workspace-danger"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-workspace-border pt-4 sm:flex-row sm:justify-between">
              <Button
                asChild
                variant="ghost"
                className="h-11 workspace-control-text"
              >
                <Link href="/founder/home">Hủy</Link>
              </Button>
              <Button
                type="button"
                onClick={createDraft}
                disabled={creating}
                className="h-11 px-5 workspace-control-text"
              >
                {creating
                  ? "Đang tạo…"
                  : modeCopy[intent].cta}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>
        )}
      </div>
    </FounderShell>
  );
}
