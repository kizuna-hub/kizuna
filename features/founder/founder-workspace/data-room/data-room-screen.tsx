"use client";

import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  FolderCheck,
  Link as LinkIcon,
  LockKeyhole,
  RefreshCw,
  UploadCloud,
  XOctagon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import AnalyticsChart from "@/features/founder/founder-workspace/data-room/analytics-chart";
import AnalyticsFunnel from "@/features/founder/founder-workspace/data-room/analytics-funnel";
import SecurityPresets from "@/features/founder/founder-workspace/data-room/security-presets";
import LiveActivityTakeover from "@/features/founder/founder-workspace/data-room/live-activity-takeover";
import AccessLedgerExpanded from "@/features/founder/founder-workspace/data-room/access-ledger-expanded";
import {
  CopyField,
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
  WorkspaceCard,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import {
  addUniqueActivity,
  calculateDataRoomReadiness,
  getMentorReadinessGate,
  normalizeDataRoomDocuments,
  type DocumentSource,
  type DocumentStatus,
  useFounderWorkspaceDemoState,
} from "@/features/founder/founder-workspace/demo-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const durationOptions = [
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
];

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusLabel(status: DocumentStatus) {
  const labels: Record<DocumentStatus, string> = {
    missing: "Missing",
    draft: "Draft",
    needs_update: "Draft",
    ready: "Ready",
    generated: "Generated",
    shared: "Shared",
  };
  return labels[status];
}

function sourceLabel(source?: DocumentSource) {
  const labels: Record<DocumentSource, string> = {
    submit_project: "Submit Project",
    ai_pitch: "AI Pitch",
    workspace_data: "Workspace Data",
    manual_mock: "Mock Upload",
    missing: "Missing",
  };
  return source ? labels[source] : "Workspace";
}

function statusClassName(status: DocumentStatus) {
  if (status === "shared" || status === "generated") return "border-accent-blue/30 bg-accent-blue/10 text-accent-blue";
  if (status === "ready") return "border-semantic-success/30 bg-surface-1 text-semantic-success";
  if (status === "draft" || status === "needs_update") return "border-hairline bg-surface-1 text-ink";
  return "border-hairline bg-surface-1 text-ink-muted";
}

function sourceClassName(source?: DocumentSource) {
  if (source === "ai_pitch") return "border-accent-blue/30 text-accent-blue";
  if (source === "submit_project") return "border-semantic-success/30 text-semantic-success";
  return "border-hairline text-ink-muted";
}

function isReadyLike(status: DocumentStatus) {
  return status === "ready" || status === "generated" || status === "shared";
}

export function DataRoomScreen({ projectId }: { projectId?: string }) {
  const { state, setState, loaded, projectFound } = useFounderWorkspaceDemoState(projectId);
  const [toast, setToast] = React.useState<DemoToastState>(null);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [revokeOpen, setRevokeOpen] = React.useState(false);
  const [duration, setDuration] = React.useState("7d");
  const [accessMode, setAccessMode] = React.useState("mentor-review");
  const [preparingId, setPreparingId] = React.useState<string | null>(null);
  const shareLink = state.dataRoomShareLink?.enabled ? state.dataRoomShareLink.url : null;
  const documents = React.useMemo(() => normalizeDataRoomDocuments(state), [state]);
  const requiredDocuments = documents.filter((document) => document.required !== false);
  const optionalDocuments = documents.filter((document) => document.required === false);
  const readyRequired = requiredDocuments.filter((document) => isReadyLike(document.status)).length;
  const missingRequired = requiredDocuments.filter((document) => !isReadyLike(document.status));
  const mentorGate = getMentorReadinessGate({ ...state, documents, dataRoomReadiness: calculateDataRoomReadiness(documents) });
  const base = `/founder/founder-workspace/${projectId ?? "p1"}`;
  const ideaStage = state.profile.stage.toLowerCase().includes("idea");
  const sourceCounts = documents.reduce<Record<string, number>>((counts, document) => {
    const key = sourceLabel(document.source);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

  React.useEffect(() => {
    if (!state.dataRoomShareLink) return;
    setDuration(state.dataRoomShareLink.expiresIn);
    setAccessMode(state.dataRoomShareLink.accessLevel);
  }, [state.dataRoomShareLink]);

  const prepareDocument = async (documentId: string) => {
    if (preparingId) return;
    setPreparingId(documentId);
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    setState((current) => {
      const documents = current.documents.map((document) =>
        document.id === documentId
          ? {
              ...document,
              status: "ready" as const,
              source: document.source === "missing" ? "manual_mock" as const : document.source,
              sourceLabel: document.source === "missing" ? "Added manually / mock upload" : document.sourceLabel,
              lastUpdated: new Date().toISOString(),
            }
          : document
      );
      return {
        ...current,
        documents,
        dataRoomReadiness: calculateDataRoomReadiness(documents),
        recentActivity: addUniqueActivity(current, "document_updated", `${documents.find((document) => document.id === documentId)?.name} prepared for mentor review.`),
      };
    });
    setPreparingId(null);
    setToast({ tone: "success", title: "Document ready", description: "Data room readiness updated for this demo session." });
  };

  const generateShareLink = () => {
    const safeProjectId = projectId ?? "p1";
    const nextLink = `https://kizuna.app/demo-room/${safeProjectId}?ttl=${duration}&access=${accessMode}`;
    setState((current) => {
      const documents = current.documents.map((document) =>
        document.status === "ready" || document.status === "generated" ? { ...document, status: "shared" as const, lastUpdated: new Date().toISOString() } : document
      );
      return {
        ...current,
        documents,
        dataRoomReadiness: calculateDataRoomReadiness(documents),
        dataRoomShareLink: {
          enabled: true,
          url: nextLink,
          accessLevel: accessMode,
          expiresIn: duration,
          lastUpdated: new Date().toISOString(),
        },
        recentActivity: addUniqueActivity(current, "data_room_shared", `Data Room share link created for ${duration}.`),
      };
    });
    setLinkOpen(false);
    setToast({ tone: "success", title: "Share link generated", description: "The mock link is ready to copy and can be revoked." });
  };

  const revokeShareLink = () => {
    setRevokeOpen(false);
    setState((current) => {
      const documents = current.documents.map((document) =>
        document.status === "shared" ? { ...document, status: "ready" as const } : document
      );
      return {
        ...current,
        documents,
        dataRoomReadiness: calculateDataRoomReadiness(documents),
        dataRoomShareLink: current.dataRoomShareLink
          ? { ...current.dataRoomShareLink, enabled: false, lastUpdated: new Date().toISOString() }
          : undefined,
        recentActivity: addUniqueActivity(current, "data_room_shared", "Data Room share link revoked."),
      };
    });
    setToast({ tone: "success", title: "Share link revoked", description: "Access has been disabled in local demo state." });
  };

  const primaryVaultAction = () => {
    if (shareLink) {
      void navigator.clipboard?.writeText(shareLink);
      setToast({ tone: "success", title: "Share link copied", description: "Current mentor link copied for the demo." });
      return;
    }
    if (missingRequired.length > 0) {
      prepareDocument(missingRequired[0].id);
      return;
    }
    if (mentorGate.canRequest) {
      setToast({ tone: "success", title: "Ready for mentor review", description: "Open Venture Connect to send the request." });
      return;
    }
    setLinkOpen(true);
  };

  if (loaded && !projectFound) {
    return (
      <div className="w-full pb-20">
        <WorkspacePageHeader
          eyebrow="Secure data room"
          title="Project workspace not found."
          description="Create a startup intake or return to the dashboard before preparing Data Room documents."
          actions={
            <>
              <Button asChild>
                <Link href="/submit-project">Submit Project</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/founder/founder-dashboard">Back Dashboard</Link>
              </Button>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      <WorkspacePageHeader
        eyebrow="Founder output vault"
        title="Prepare the mentor review packet."
        description="A demo-safe output vault showing what Kizuna generated, what came from Submit Project, what is missing, and what is ready to share."
        actions={
          <>
            <Button onClick={primaryVaultAction}>
              <FolderCheck className="size-4" />
              {shareLink
                ? "Copy current link"
                : missingRequired.length
                  ? "Prepare missing docs"
                  : mentorGate.canRequest
                    ? "Ready for mentor review"
                    : "Create share link"}
            </Button>
            <Button variant="secondary" onClick={() => setLinkOpen(true)}>
              <LinkIcon className="size-4" />
              {shareLink ? "Manage share link" : "Generate share link"}
            </Button>
            {shareLink ? (
              <Button variant="ghost" onClick={() => setRevokeOpen(true)}>
                <XOctagon className="size-4" />
                Revoke link
              </Button>
            ) : null}
          </>
        }
      />

      <WorkspaceCard className="mb-5 bg-surface-2">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr_280px] lg:items-center">
          <div className="rounded-xl border border-hairline bg-surface-1 p-5 text-center">
            <p className="font-mono text-6xl font-bold text-ink">{state.dataRoomReadiness}%</p>
            <p className="mt-2 text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Vault readiness</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${state.dataRoomReadiness}%` }} />
            </div>
          </div>
          <div>
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Mentor gate</p>
            <h2 className="mt-2 text-display-sm text-ink">
              {mentorGate.status === "sent"
                ? "Mentor packet was sent."
                : mentorGate.canRequest
                  ? "Your Data Room is mentor-review ready."
                  : "Data Room is not ready for mentor review yet."}
            </h2>
            <p className="mt-3 max-w-2xl text-body-framer-sm text-ink-muted">
              {ideaStage
                ? "Idea-stage projects do not need revenue or polished screenshots immediately. The required packet still needs enough context for a mentor to review the startup."
                : "Prototype, pilot, and launched projects should include demo evidence, screenshots, and clear document sources before mentor review."}
            </p>
            {!mentorGate.canRequest && mentorGate.status !== "sent" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {mentorGate.blockers.map((blocker) => (
                  <span key={blocker.id} className="rounded-full border border-hairline bg-surface-1 px-3 py-1 text-caption font-bold text-ink-muted">
                    {blocker.label}: {blocker.current}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-4">
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Share link</p>
            <p className="mt-2 text-body-framer-sm font-bold text-ink">{shareLink ? "Active mentor link" : "No active link"}</p>
            <p className="mt-1 text-caption text-ink-muted">
              {shareLink
                ? `${state.dataRoomShareLink?.accessLevel} / ${state.dataRoomShareLink?.expiresIn}`
                : "Create a demo-safe mentor share link when your documents are ready."}
            </p>
          </div>
        </div>
      </WorkspaceCard>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard
          className="xl:col-span-8"
          title="Required documents"
          description={`${readyRequired}/${requiredDocuments.length} required documents are ready for mentor review.`}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {requiredDocuments.map((document) => (
              <div key={document.id} className="flex min-h-[190px] flex-col justify-between rounded-xl border border-hairline bg-surface-2 p-4">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]", statusClassName(document.status))}>
                      {statusLabel(document.status)}
                    </span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]", sourceClassName(document.source))}>
                      {sourceLabel(document.source)}
                    </span>
                  </div>
                  <p className="text-body-framer-sm font-bold text-ink">{document.name}</p>
                  <p className="mt-2 text-caption text-ink-muted">{document.description}</p>
                  {document.metadata?.detail ? <p className="mt-2 break-words text-caption text-ink">{document.metadata.detail}</p> : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {document.route ? (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`${base}/${document.route}`}>
                        {document.actionLabel ?? "Open"}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  ) : null}
                  {!isReadyLike(document.status) ? (
                    <Button variant="secondary" size="sm" onClick={() => prepareDocument(document.id)} disabled={preparingId === document.id}>
                      {preparingId === document.id ? <RefreshCw className="size-3.5 animate-spin" /> : <UploadCloud className="size-3.5" />}
                      {preparingId === document.id ? "Preparing..." : document.actionLabel ?? "Mock upload"}
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-caption font-bold text-semantic-success">
                      <CheckCircle2 className="size-4" />
                      Included in packet
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </WorkspaceCard>

        <div className="space-y-5 xl:col-span-4">
          <WorkspaceCard className="bg-surface-2" title="Access / share link" description="Local state only. No real files leave the browser.">
            {shareLink ? (
              <div className="space-y-3">
                <CopyField value={shareLink} onCopy={() => setToast({ tone: "success", title: "Link copied", description: "Copied to clipboard for the demo." })} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-hairline bg-surface-1 p-3">
                    <p className="text-caption text-ink-muted">Access</p>
                    <p className="mt-1 text-body-framer-sm font-bold text-ink">{state.dataRoomShareLink?.accessLevel}</p>
                  </div>
                  <div className="rounded-xl border border-hairline bg-surface-1 p-3">
                    <p className="text-caption text-ink-muted">Expires</p>
                    <p className="mt-1 text-body-framer-sm font-bold text-ink">{state.dataRoomShareLink?.expiresIn}</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => setRevokeOpen(true)}>
                  <XOctagon className="size-4" />
                  Revoke current link
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-hairline bg-surface-1 p-4">
                <p className="text-body-framer-sm font-bold text-ink">No active share link</p>
                <p className="mt-1 text-caption text-ink-muted">Create a demo-safe mentor share link when your documents are ready.</p>
                <Button className="mt-4 w-full" onClick={() => setLinkOpen(true)}>
                  <LockKeyhole className="size-4" />
                  Create share link
                </Button>
              </div>
            )}
          </WorkspaceCard>

          <WorkspaceCard title="Source trace" description="Where the vault content came from.">
            <div className="space-y-2">
              {Object.entries(sourceCounts).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between rounded-xl border border-hairline bg-surface-2 p-3">
                  <span className="text-body-framer-sm font-bold text-ink">{source}</span>
                  <span className="font-mono text-body-framer-sm font-bold text-ink-muted">{count}</span>
                </div>
              ))}
            </div>
          </WorkspaceCard>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard className="xl:col-span-8" title="Optional / nice-to-have documents" description="Useful for richer mentor context, but not required to unlock the v1 review gate.">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {optionalDocuments.map((document) => (
              <div key={document.id} className="rounded-xl border border-hairline bg-surface-2 p-4">
                <div className="flex flex-wrap gap-2">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]", statusClassName(document.status))}>
                    {statusLabel(document.status)}
                  </span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]", sourceClassName(document.source))}>
                    {sourceLabel(document.source)}
                  </span>
                </div>
                <p className="mt-3 text-body-framer-sm font-bold text-ink">{document.name}</p>
                <p className="mt-2 text-caption text-ink-muted">{document.description}</p>
                {document.metadata?.fileName ? (
                  <p className="mt-2 break-words text-caption text-ink">
                    {document.metadata.fileName}
                    {document.metadata.fileSize ? ` - ${formatFileSize(document.metadata.fileSize)}` : ""}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="xl:col-span-4" title="Recent vault activity">
          <div className="space-y-3">
            {state.recentActivity
              .filter((activity) => ["data_room_shared", "document_updated", "data-room", "pitch_deck", "mentor_request"].includes(activity.type))
              .slice(0, 5)
              .map((activity) => (
                <div key={activity.id} className="rounded-xl border border-hairline bg-surface-2 p-3">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{activity.timestamp}</p>
                  <p className="mt-1 text-body-framer-sm text-ink">{activity.message}</p>
                </div>
              ))}
            {state.recentActivity.filter((activity) => ["data_room_shared", "document_updated", "data-room", "pitch_deck", "mentor_request"].includes(activity.type)).length === 0 ? (
              <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink-muted">
                Vault activity will appear after a deck is sent, a document is prepared, or a share link is created.
              </div>
            ) : null}
          </div>
        </WorkspaceCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AnalyticsFunnel />
        </div>
        <div className="lg:col-span-4">
          <SecurityPresets />
        </div>
        <div className="lg:col-span-7">
          <AnalyticsChart />
        </div>
        <div className="lg:col-span-5">
          <LiveActivityTakeover />
        </div>
        <div className="lg:col-span-12">
          <AccessLedgerExpanded />
        </div>
      </div>

      <WorkspaceActionModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Generate secure share link"
        description="Choose demo access settings. The generated URL includes the selected duration and access mode."
        footer={
          <>
            <Button variant="secondary" onClick={() => setLinkOpen(false)}>Close</Button>
            <Button onClick={generateShareLink}>
              <LockKeyhole className="size-4" />
              {shareLink ? "Regenerate link" : "Generate link"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Duration</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDuration(option.value)}
                  className={`rounded-xl border p-3 text-body-framer-sm font-bold transition-colors ${duration === option.value ? "border-ink bg-ink text-on-primary" : "border-hairline bg-surface-2 text-ink-muted hover:text-ink"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <label className="block space-y-2">
            <span className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Access setting</span>
            <select
              value={accessMode}
              onChange={(event) => setAccessMode(event.target.value)}
              className="w-full rounded-xl border border-hairline bg-surface-2 p-3 text-body-framer-sm text-ink outline-none focus:shadow-framer-focus"
            >
              <option value="mentor-review">Mentor review only</option>
              <option value="nda-required">NDA required</option>
              <option value="view-only">View only</option>
            </select>
          </label>
          {shareLink ? <CopyField value={shareLink} onCopy={() => setToast({ tone: "success", title: "Link copied", description: "Copied to clipboard for the demo." })} /> : null}
        </div>
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={revokeOpen}
        onClose={() => setRevokeOpen(false)}
        title="Revoke data room link?"
        description="This disables the current mock share link and returns shared documents to ready state."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRevokeOpen(false)}>Cancel</Button>
            <Button onClick={revokeShareLink}>
              <RefreshCw className="size-4" />
              Revoke link
            </Button>
          </>
        }
      >
        <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink-muted">
          Existing viewers lose access in the demo ledger. You can generate a new link immediately after revoking.
        </div>
      </WorkspaceActionModal>

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
