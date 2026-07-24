"use client";

import React from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  LockKeyhole,
  PenLine,
  Rocket,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
  WorkspaceCard,
  WorkspaceMetric,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import {
  addActivity,
  addUniqueActivity,
  calculateDataRoomReadiness,
  calculateProfileCompletion,
  getMentorReadinessGate,
  getMissingProfileFields,
  markMentorReviewRequestSent,
  type StartupProfile,
  useFounderWorkspaceDemoState,
} from "@/features/founder/founder-workspace/demo-state";
import { cn } from "@/lib/utils";

const reviewSteps = [
  "Analyzing problem-solution clarity...",
  "Checking pitch completeness...",
  "Finding missing mentor-review requirements...",
  "Generating readiness summary...",
];

const aiStrengths = [
  "The student-founder persona and incubation use case are specific.",
  "The product path connects profile, pitch, data room, and mentor matching.",
  "Early university-club traction gives the story a credible first channel.",
];

const aiMissing = [
  "Clarify the paid customer for the first revenue motion.",
  "Add one concrete support need for the mentor to review.",
  "Attach updated financial snapshot before sharing the data room.",
];

const aiNextSteps = [
  "Complete business model and support need in the profile.",
  "Prepare Financial Snapshot and Founder Team Profile documents.",
  "Request mentor review after readiness gates turn green.",
];

const mentorMatch = {
  name: "Dr. Alex Chen",
  role: "SaaS growth mentor / former accelerator partner",
  expertise: "SaaS positioning, university pilots, fundraising narrative",
  score: 92,
  reason: "Strong match for turning an early student-founder platform into a mentor-review-ready incubation story.",
};

function documentReadyForReview(status: string) {
  return status === "ready" || status === "generated" || status === "shared";
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function FounderWorkspaceOverviewScreen({ projectId }: { projectId: string }) {
  const { state, setState, loaded, projectFound } = useFounderWorkspaceDemoState(projectId);
  const [toast, setToast] = React.useState<DemoToastState>(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [profileDraft, setProfileDraft] = React.useState<StartupProfile>(state.profile);
  const [mentorOpen, setMentorOpen] = React.useState(false);
  const [milestoneOpen, setMilestoneOpen] = React.useState<string | null>(null);
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [reviewStep, setReviewStep] = React.useState(reviewSteps[0]);
  const base = `/founder/founder-workspace/${projectId}`;

  React.useEffect(() => {
    if (profileOpen) setProfileDraft(state.profile);
  }, [profileOpen, state.profile]);

  const missingFields = getMissingProfileFields(state.profile);
  const mentorGate = getMentorReadinessGate(state);
  const readyForMentor = mentorGate.canRequest;
  const completedChecklist = state.checklistItems.filter((item) => item.status === "completed").length;
  const activeMilestone = state.milestones.find((milestone) => milestone.status === "active") ?? state.milestones[0];
  const missingDocuments = state.documents.filter((document) => document.required !== false && !documentReadyForReview(document.status));
  const requiredDocuments = state.documents.filter((document) => document.required !== false);

  const saveProfile = () => {
    const nextCompletion = calculateProfileCompletion(profileDraft);
    const newMissing = getMissingProfileFields(profileDraft);
    setState((current) => ({
      ...current,
      profile: profileDraft,
      profileCompletion: nextCompletion,
      recentActivity: addActivity(
        current,
        "profile",
        `Startup profile saved. Completion is now ${nextCompletion}%.`
      ),
    }));
    setProfileOpen(false);
    setToast({
      tone: "success",
      title: "Profile updated",
      description: newMissing.length ? `${newMissing.length} fields still need attention.` : "All required profile fields are complete.",
    });
  };

  const runAiReview = async () => {
    if (isReviewing) return;
    setIsReviewing(true);
    for (const step of reviewSteps) {
      setReviewStep(step);
      await wait(550);
    }
    setState((current) => ({
      ...current,
      aiReadinessScore: 88,
      recentActivity: addActivity(current, "ai", "AI readiness review completed with a mentor-prep score of 88%."),
    }));
    setIsReviewing(false);
    setToast({
      tone: "success",
      title: "AI review complete",
      description: "Readiness score updated and next mentor-prep actions refreshed.",
    });
  };

  const prepareDocument = (documentId: string) => {
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
        recentActivity: addUniqueActivity(current, "document_updated", `${documents.find((document) => document.id === documentId)?.name} marked ready.`),
      };
    });
    setToast({ tone: "success", title: "Document prepared", description: "Data room readiness updated locally." });
  };

  const markMilestoneProgress = (milestoneId: string) => {
    setState((current) => {
      const milestones = current.milestones.map((milestone, index, all) => {
        if (milestone.id !== milestoneId) return milestone;
        const nextProgress = Math.min(100, milestone.progress + 20);
        if (nextProgress < 100) return { ...milestone, progress: nextProgress };
        const updated = { ...milestone, progress: 100, status: "completed" as const, nextAction: "Completed in demo mode." };
        const next = all[index + 1];
        if (!next || next.status !== "locked") return updated;
        return updated;
      });
      const activeIndex = milestones.findIndex((milestone) => milestone.id === milestoneId);
      const nextMilestones = milestones.map((milestone, index) => {
        if (index === activeIndex + 1 && milestone.status === "locked" && milestones[activeIndex]?.progress === 100) {
          return { ...milestone, status: "active" as const, progress: Math.max(milestone.progress, 10) };
        }
        return milestone;
      });
      return {
        ...current,
        milestones: nextMilestones,
        recentActivity: addActivity(current, "milestone", `${current.milestones.find((milestone) => milestone.id === milestoneId)?.name} progress updated.`),
      };
    });
    setMilestoneOpen(null);
    setToast({ tone: "success", title: "Milestone updated", description: "Incubation progress moved forward in demo mode." });
  };

  const requestMentorReview = () => {
    if (mentorGate.status === "sent") {
      setToast({ tone: "success", title: "Request already sent", description: "The mentor review request is saved in local demo state." });
      return;
    }
    if (!mentorGate.canRequest) {
      setMentorOpen(true);
      return;
    }
    setState((current) => markMentorReviewRequestSent(current, mentorMatch.name));
    setMentorOpen(false);
    setToast({ tone: "success", title: "Mentor request sent", description: `${mentorMatch.name} now has your review packet.` });
  };

  const readinessGaps = mentorGate.blockers;
  const nextBlocker = readinessGaps[0];

  if (loaded && !projectFound) {
    return <MissingProjectState projectId={projectId} />;
  }

  return (
    <div>
      <WorkspacePageHeader
        eyebrow="Founder command center"
        title="Is Kizuna Hub ready for mentor review?"
        description="The dashboard focuses on the v1 founder question: profile completeness, AI readiness, data room readiness, milestone progress, and the next action before requesting mentor feedback."
        actions={
          <>
            <Button variant="secondary" onClick={() => setProfileOpen(true)}>
              <PenLine className="size-4" />
              Edit profile
            </Button>
            <Button onClick={requestMentorReview}>
              <Users className="size-4" />
              {mentorGate.status === "sent" ? "Request sent" : mentorGate.canRequest ? "Request mentor review" : "View readiness gate"}
            </Button>
          </>
        }
      />

      <WorkspaceCard className={cn("mb-5 bg-surface-2", readyForMentor && "shadow-framer-focus")}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Readiness answer</p>
            <h2 className="mt-2 text-display-md text-ink">
              {mentorGate.status === "sent"
                ? "Mentor review request is already sent."
                : readyForMentor
                  ? "Ready to request mentor review."
                  : "Almost ready, but a few review gates are still open."}
            </h2>
            <p className="mt-3 max-w-2xl text-body-framer text-ink-muted">
              Next best action: {mentorGate.status === "sent" ? "track the mentor review status." : nextBlocker ? nextBlocker.label.toLowerCase() + "." : "send the mentor review request."}
            </p>
            {!mentorGate.canRequest && mentorGate.status !== "sent" ? (
              <p className="mt-2 text-body-framer-sm text-ink-muted">
                You are {mentorGate.blockers.length} {mentorGate.blockers.length === 1 ? "action" : "actions"} away from mentor review.
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Profile", `${state.profileCompletion}%`],
              ["AI review", `${state.aiReadinessScore}%`],
              ["Data room", `${state.dataRoomReadiness}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-hairline bg-surface-1 p-4 text-center">
                <p className="font-mono text-2xl font-bold text-ink">{value}</p>
                <p className="mt-1 text-caption text-ink-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </WorkspaceCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <WorkspaceMetric label="Runway" value="6.8 mo" detail="Enough for MVP and mentor review sprint" icon={Clock3} accent />
        <WorkspaceMetric label="Early adopters" value="120" detail="From three university startup clubs" icon={Users} />
        <WorkspaceMetric label="Data room docs" value={`${requiredDocuments.length - missingDocuments.length}/${requiredDocuments.length}`} detail="Required v1 documents prepared" icon={Database} />
        <WorkspaceMetric label="Current milestone" value={`${activeMilestone.progress}%`} detail={activeMilestone.name} icon={Rocket} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard
          className="xl:col-span-5"
          title="Startup profile"
          description="Required fields for mentor-review readiness."
          action={<Button variant="secondary" size="sm" onClick={() => setProfileOpen(true)}>Edit</Button>}
        >
          <div className="rounded-xl border border-hairline bg-surface-2 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-headline text-ink">{state.profile.name}</h3>
                <p className="mt-2 text-body-framer-sm text-ink-muted">{state.profile.tagline}</p>
              </div>
              <span className="rounded-full bg-ink px-3 py-1 font-mono text-caption font-bold text-on-primary">{state.profileCompletion}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-1">
              <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${state.profileCompletion}%` }} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Missing fields</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingFields.length ? missingFields.map((field) => (
                <span key={field} className="rounded-full border border-hairline bg-surface-2 px-3 py-1 text-caption font-bold text-ink-muted">{field}</span>
              )) : <span className="text-body-framer-sm text-semantic-success">All required fields are complete.</span>}
            </div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard
          className="xl:col-span-7"
          title="AI pitch readiness review"
          description="Advisory review for human mentor preparation, not an investment decision."
          action={
            <Button variant="secondary" size="sm" onClick={runAiReview} disabled={isReviewing}>
              <Bot className="size-4" />
              {isReviewing ? "Reviewing..." : "Run AI Review"}
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[160px_1fr]">
            <div className="rounded-xl border border-hairline bg-surface-2 p-5 text-center">
              <p className="font-mono text-5xl font-bold text-ink">{state.aiReadinessScore}%</p>
              <p className="mt-2 text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Readiness</p>
            </div>
            <div className="space-y-4">
              {isReviewing ? (
                <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink">
                  {reviewStep}
                </div>
              ) : null}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  ["Strengths", aiStrengths],
                  ["Missing information", aiMissing],
                  ["Suggested next steps", aiNextSteps],
                ].map(([title, items]) => (
                  <div key={title as string} className="rounded-xl border border-hairline bg-surface-2 p-4">
                    <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{title as string}</p>
                    <ul className="mt-3 space-y-2">
                      {(items as string[]).slice(0, 3).map((item) => (
                        <li key={item} className="text-caption text-ink-muted">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </WorkspaceCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard className="xl:col-span-5" title="Founder journey checklist" description={`${completedChecklist}/${state.checklistItems.length} journey items complete.`}>
          <div className="space-y-3">
            {state.checklistItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-hairline bg-surface-2 p-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={cn("mt-0.5 size-4 shrink-0", item.status === "completed" ? "text-semantic-success" : item.status === "active" ? "text-ink" : "text-ink-muted")} />
                  <div>
                    <p className="text-body-framer-sm font-bold text-ink">{item.label}</p>
                    {item.reason ? <p className="mt-1 text-caption text-ink-muted">{item.reason}</p> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="xl:col-span-7" title="Milestone tracker" description="A lightweight incubation path for student founders.">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {state.milestones.map((milestone) => (
              <button
                key={milestone.id}
                onClick={() => setMilestoneOpen(milestone.id)}
                className="rounded-xl border border-hairline bg-surface-2 p-4 text-left transition-colors hover:bg-surface-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-body-framer-sm font-bold text-ink">{milestone.name}</p>
                    <p className="mt-1 text-caption text-ink-muted">{milestone.targetPeriod}</p>
                  </div>
                  <span className="rounded-full border border-hairline bg-surface-1 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">{milestone.status}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-1">
                  <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${milestone.progress}%` }} />
                </div>
                <p className="mt-3 text-caption text-ink-muted">{milestone.nextAction}</p>
              </button>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard className="xl:col-span-4" title="Data room readiness" description="Required v1 documents before a mentor reviews the packet.">
          <div className="space-y-3">
            {state.documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
                <div>
                  <p className="text-body-framer-sm font-bold text-ink">{document.name}</p>
                  <p className="mt-1 text-caption text-ink-muted">{document.status.replace("_", " ")}</p>
                </div>
                {documentReadyForReview(document.status) ? (
                  <CheckCircle2 className="size-4 text-semantic-success" />
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => prepareDocument(document.id)}>
                    <UploadCloud className="size-3.5" />
                    Prepare
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href={`${base}/data-room`}>
              <LockKeyhole className="size-4" />
              Open data room
            </Link>
          </Button>
        </WorkspaceCard>

        <WorkspaceCard className="xl:col-span-4" title="Mentor match preview" description="Request is gated by profile, AI, and data room readiness.">
          <div className="rounded-xl border border-hairline bg-surface-2 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-body-framer font-bold text-ink">{mentorMatch.name}</h3>
                <p className="mt-1 text-caption text-ink-muted">{mentorMatch.role}</p>
              </div>
              <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-caption font-bold text-on-primary">{mentorMatch.score}%</span>
            </div>
            <p className="mt-4 text-body-framer-sm text-ink-muted">{mentorMatch.reason}</p>
            <p className="mt-3 text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{mentorMatch.expertise}</p>
          </div>
          <Button className="mt-4 w-full" onClick={requestMentorReview} disabled={mentorGate.status === "sent"}>
            <Users className="size-4" />
            {mentorGate.status === "sent" ? "Request sent" : readyForMentor ? "Request mentor review" : "View readiness gate"}
          </Button>
        </WorkspaceCard>

        <WorkspaceCard className="xl:col-span-4" title="Recent activity">
          <div className="space-y-3">
            {state.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="rounded-xl border border-hairline bg-surface-2 p-3">
                <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{activity.timestamp}</p>
                <p className="mt-1 text-body-framer-sm text-ink">{activity.message}</p>
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      <WorkspaceCard className="mt-5 bg-surface-2" title="Live demo path" description="Every step navigates, opens a modal, updates state, or shows feedback.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {[
            ["1", "Profile modal", "#profile"],
            ["2", "AI Pitch Deck", `${base}/ai-pitch-deck`],
            ["3", "Data Room", `${base}/data-room`],
            ["4", "Venture Connect", `${base}/venture-connect`],
          ].map(([step, label, href]) => href === "#profile" ? (
            <button key={step} onClick={() => setProfileOpen(true)} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-1 p-3 text-left text-body-framer-sm font-bold text-ink transition-colors hover:bg-surface-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-ink text-caption font-bold text-on-primary">{step}</span>
              <span className="flex-1">{label}</span>
              <ArrowRight className="size-4 text-ink-muted" />
            </button>
          ) : (
            <Link key={step} href={href} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-1 p-3 text-body-framer-sm font-bold text-ink transition-colors hover:bg-surface-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-ink text-caption font-bold text-on-primary">{step}</span>
              <span className="flex-1">{label}</span>
              <ArrowRight className="size-4 text-ink-muted" />
            </Link>
          ))}
        </div>
      </WorkspaceCard>

      <WorkspaceActionModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Edit startup profile"
        description="Demo-safe local edits update completion, checklist, and activity instantly."
        footer={
          <>
            <Button variant="secondary" onClick={() => setProfileOpen(false)}>Cancel</Button>
            <Button onClick={saveProfile}>Save profile</Button>
          </>
        }
      >
        <div className="grid max-h-[58vh] grid-cols-1 gap-4 overflow-y-auto pr-1 md:grid-cols-2">
          {([
            ["name", "Startup name"],
            ["tagline", "One-line description"],
            ["industry", "Industry"],
            ["stage", "Stage"],
            ["problem", "Problem statement"],
            ["solution", "Solution summary"],
            ["targetCustomer", "Target customer"],
            ["businessModel", "Business model"],
            ["team", "Team summary"],
            ["traction", "Current traction"],
            ["supportNeed", "Support need"],
          ] as Array<[keyof StartupProfile, string]>).map(([key, label]) => (
            <label key={key} className={cn("space-y-2", ["problem", "solution", "team", "traction", "supportNeed"].includes(key) && "md:col-span-2")}>
              <span className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{label}</span>
              <textarea
                value={profileDraft[key]}
                onChange={(event) => setProfileDraft((draft) => ({ ...draft, [key]: event.target.value }))}
                rows={["problem", "solution", "team", "traction", "supportNeed"].includes(key) ? 3 : 1}
                className="w-full resize-none rounded-xl border border-hairline bg-surface-2 p-3 text-body-framer-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:shadow-framer-focus"
              />
            </label>
          ))}
        </div>
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={mentorOpen}
        onClose={() => setMentorOpen(false)}
        title={readyForMentor ? "Send mentor review request" : "Mentor review is not ready yet"}
        description={readyForMentor ? `Send the packet to ${mentorMatch.name}.` : "Complete the readiness gates below before requesting human review."}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMentorOpen(false)}>Close</Button>
            {readyForMentor ? <Button onClick={requestMentorReview}>Send request</Button> : null}
          </>
        }
      >
        {readyForMentor ? (
          <p className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink-muted">
            This demo request includes the completed startup profile, latest AI review, prepared data room documents, and current milestone summary.
          </p>
        ) : (
          <div className="space-y-3">
            {readinessGaps.map((gap) => (
              <div key={gap.id} className="rounded-xl border border-hairline bg-surface-2 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-body-framer-sm font-bold text-ink">{gap.label}</p>
                    <p className="mt-1 text-caption text-ink-muted">
                      Current: {gap.current}. Required: {gap.required}.
                    </p>
                  </div>
                  {gap.route ? (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`${base}/${gap.route}`}>{gap.actionLabel}</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setMentorOpen(false);
                        setProfileOpen(true);
                      }}
                    >
                      {gap.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={Boolean(milestoneOpen)}
        onClose={() => setMilestoneOpen(null)}
        title={state.milestones.find((milestone) => milestone.id === milestoneOpen)?.name ?? "Milestone"}
        description={state.milestones.find((milestone) => milestone.id === milestoneOpen)?.nextAction}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMilestoneOpen(null)}>Close</Button>
            <Button onClick={() => milestoneOpen ? markMilestoneProgress(milestoneOpen) : undefined}>
              Mark progress
            </Button>
          </>
        }
      >
        <div className="rounded-xl border border-hairline bg-surface-2 p-4">
          <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Demo action</p>
          <p className="mt-2 text-body-framer-sm text-ink-muted">Marking progress increases this milestone by 20 points and unlocks the next step when complete.</p>
        </div>
      </WorkspaceActionModal>

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function MissingProjectState({ projectId }: { projectId: string }) {
  return (
    <div>
      <WorkspacePageHeader
        eyebrow="Workspace not found"
        title="This project workspace does not exist yet."
        description={`Kizuna could not find local demo state for "${projectId}". Create a startup intake or return to the Founder Dashboard to open an existing workspace.`}
        actions={
          <>
            <Button asChild>
              <Link href="/submit-project">
                <Rocket className="size-4" />
                Submit Project
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/founder/founder-dashboard">
                <ArrowRight className="size-4" />
                Back Dashboard
              </Link>
            </Button>
          </>
        }
      />
      <WorkspaceCard className="bg-surface-2">
        <p className="text-body-framer text-ink">
          No unrelated fallback data is shown for unknown project IDs. This keeps the live demo honest and prevents a missing project from silently becoming the default Kizuna workspace.
        </p>
      </WorkspaceCard>
    </div>
  );
}
