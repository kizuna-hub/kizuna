"use client";

import React from "react";
import { ArrowRight, Briefcase, CalendarDays, CheckCircle2, Filter, Lock, MessageSquareText, Send, Users, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceActionModal,
  WorkspaceCard,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import {
  getMentorReadinessGate,
  markMentorReviewRequestSent,
  useFounderWorkspaceDemoState,
} from "@/features/founder/founder-workspace/demo-state";
import { PaywallModal } from "@/features/founder/founder-workspace/ai-pitch-deck/paywall-modal";

const mentors = [
  { id: 1, name: "Dr. Alex Chen", role: "SaaS Growth Expert / ex-YC", match: 96, tags: ["B2B SaaS", "Growth"], initials: "AC", reason: "Strong fit for your enterprise pilot and pricing roadmap." },
  { id: 2, name: "Linh Mori", role: "Fintech Product Lead", match: 92, tags: ["Fintech", "Risk"], initials: "LM", reason: "Can review onboarding friction and compliance signals." },
  { id: 3, name: "David Vu", role: "Founder, CloudX", match: 88, tags: ["Cloud", "Seed"], initials: "DV", reason: "Recently raised seed and can coach fundraising sequence." },
];

const events = [
  {
    title: "Mentor office hours",
    time: "Friday, 10:00 AM",
    detail: "A 30-minute review block focused on pitch clarity, mentor ask, and next milestone.",
  },
  {
    title: "Investor dry-run",
    time: "Next Tuesday, 2:30 PM",
    detail: "Practice the deck narrative with a Kizuna reviewer before sharing it outside the workspace.",
  },
  {
    title: "University demo day",
    time: "June cohort showcase",
    detail: "A staged presentation slot for teams that complete profile, AI review, and data room readiness.",
  },
];

export function VentureConnectScreen({ projectId }: { projectId?: string }) {
  const { state, setState, loaded, projectFound } = useFounderWorkspaceDemoState(projectId);
  const [activeTab, setActiveTab] = React.useState<"mentor" | "investor">("mentor");
  const [connectionTokens, setConnectionTokens] = React.useState(1);
  const [requestOpen, setRequestOpen] = React.useState(false);
  const [selectedMentor, setSelectedMentor] = React.useState<(typeof mentors)[number] | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<(typeof events)[number] | null>(null);
  const [toast, setToast] = React.useState<DemoToastState>(null);
  const [paywall, setPaywall] = React.useState({ isOpen: false, title: "", desc: "" });
  const mentorGate = getMentorReadinessGate(state);
  const base = `/founder/founder-workspace/${projectId ?? "p1"}`;

  const connect = (mentor: (typeof mentors)[number]) => {
    if (mentorGate.status === "sent") {
      setToast({ tone: "success", title: "Request already sent", description: "Mentor review status is saved in the shared workspace state." });
      return;
    }
    if (!mentorGate.canRequest) {
      setToast({ title: "Readiness gate is locked", description: `${mentorGate.blockers.length} readiness actions remain before mentor review.` });
      return;
    }

    setSelectedMentor(mentor);
    setRequestOpen(true);
  };

  const sendRequest = () => {
    if (!selectedMentor) return;
    if (!mentorGate.canRequest) {
      setToast({ title: "Readiness gate is locked", description: "Complete the listed blockers before sending a mentor review request." });
      return;
    }
    setConnectionTokens((value) => Math.max(0, value - 1));
    setState((current) => markMentorReviewRequestSent(current, selectedMentor.name));
    setRequestOpen(false);
    setToast({ tone: "success", title: "Connection request sent", description: `${selectedMentor.name} now appears in the warm intro pipeline.` });
  };

  const investorPaywall = () => {
    setPaywall({
      isOpen: true,
      title: "Investor Match is locked",
      desc: "Investor matching opens after the pitch deck and data room reach the readiness threshold. This demo state explains the upgrade path without making a fake backend call.",
    });
  };

  if (loaded && !projectFound) {
    return (
      <div className="pb-20">
        <WorkspacePageHeader
          eyebrow="Venture connect"
          title="Project workspace not found."
          description="Create a startup intake or return to the dashboard before requesting mentor review."
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
    <div className="pb-20">
      <WorkspacePageHeader
        eyebrow="Venture connect"
        title="Find the right human next, not just more contacts."
        description="AI matching ranks mentors by the founder's current bottleneck and keeps every visible action demo-safe."
        actions={
          <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Connection tokens</p>
            <p className="mt-1 font-mono text-2xl font-bold text-ink">{connectionTokens}/3</p>
            <p className="mt-1 text-caption text-ink-muted">Secondary demo limit</p>
          </div>
        }
      />

      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-hairline pb-3">
        <Button variant={activeTab === "mentor" ? "default" : "secondary"} onClick={() => setActiveTab("mentor")}>
          <Users className="size-4" />
          Mentor Match
        </Button>
        <Button variant="secondary" onClick={investorPaywall}>
          <Briefcase className="size-4" />
          Investor Match
          <Lock className="size-3.5" />
        </Button>
        <Button variant="ghost" onClick={() => setToast({ title: "Filter applied", description: "Goal set to Seed fundraising." })}>
          <Filter className="size-4" />
          Seed fundraising
        </Button>
      </div>

      {activeTab === "mentor" ? (
        <div className="space-y-5">
          <WorkspaceCard
            className="bg-surface-2"
            title="Mentor readiness gate"
            description="Mentor review is gated by profile, AI score, Data Room, generated/shared deck, and a clear mentor ask."
          >
            {mentorGate.status === "sent" ? (
              <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 text-semantic-success" />
                  <div>
                    <p className="text-body-framer-sm font-bold text-ink">Mentor review request sent</p>
                    <p className="mt-1 text-caption text-ink-muted">The shared workspace state now tracks this package as sent.</p>
                  </div>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href={base}>Back Overview</Link>
                </Button>
              </div>
            ) : mentorGate.canRequest ? (
              <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-body-framer-sm font-bold text-ink">Ready for mentor review</p>
                  <p className="mt-1 text-caption text-ink-muted">Choose the best mentor and send a deterministic demo request.</p>
                </div>
                <span className="rounded-pill bg-ink px-3 py-1 text-caption font-bold text-on-primary">Ready</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-body-framer-sm text-ink-muted">
                  You are {mentorGate.blockers.length} {mentorGate.blockers.length === 1 ? "action" : "actions"} away from mentor review.
                </p>
                {mentorGate.blockers.map((blocker) => (
                  <div key={blocker.id} className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-body-framer-sm font-bold text-ink">{blocker.label}</p>
                      <p className="mt-1 text-caption text-ink-muted">Current: {blocker.current}. Required: {blocker.required}.</p>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={blocker.route ? `${base}/${blocker.route}` : base}>
                        {blocker.actionLabel}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </WorkspaceCard>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <WorkspaceCard key={mentor.id} className="flex flex-col">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl border border-hairline bg-surface-2 font-display text-sm font-bold text-ink">
                      {mentor.initials}
                    </div>
                    <div>
                      <h2 className="text-body-framer font-bold text-ink">{mentor.name}</h2>
                      <p className="mt-1 text-caption text-ink-muted">{mentor.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-caption font-bold text-on-primary">{mentor.match}%</span>
                </div>
                <p className="min-h-[56px] text-body-framer-sm text-ink-muted">{mentor.reason}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {mentor.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-hairline bg-surface-2 px-3 py-1 text-caption font-bold text-ink-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setToast({ title: "Profile preview opened", description: `${mentor.name} has 4 relevant reviews.` })}>
                    <MessageSquareText className="size-4" />
                    Preview
                  </Button>
                  <Button className="flex-1" onClick={() => connect(mentor)} disabled={!mentorGate.canRequest || mentorGate.status === "sent"}>
                    <Send className="size-4" />
                    {mentorGate.status === "sent" ? "Request sent" : mentorGate.canRequest ? "Request review" : "Resolve blockers"}
                  </Button>
                </div>
              </WorkspaceCard>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <WorkspaceCard className="lg:col-span-2" title="Warm intro pipeline">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {["Drafting request", "Mentor reviewing", "Intro scheduled"].map((stage, index) => (
                  <div key={stage} className="rounded-xl border border-hairline bg-surface-2 p-4">
                    <p className="font-mono text-2xl font-bold text-ink">{index + 1}</p>
                    <p className="mt-3 text-body-framer-sm font-bold text-ink">{stage}</p>
                    <p className="mt-1 text-caption text-ink-muted">{index === 0 ? "Local demo state" : "No backend call"}</p>
                  </div>
                ))}
              </div>
            </WorkspaceCard>
            <WorkspaceCard title="Upcoming events">
              <div className="space-y-3">
                {events.map((event) => (
                  <button
                    key={event.title}
                    onClick={() => {
                      setSelectedEvent(event);
                      setToast({ title: "Event details opened", description: `${event.title} is ready for the live demo.` });
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3 text-left transition-colors hover:bg-surface-1"
                  >
                    <CalendarDays className="size-4 text-ink-muted" />
                    <span className="text-body-framer-sm font-bold text-ink">{event.title}</span>
                  </button>
                ))}
              </div>
            </WorkspaceCard>
          </div>
        </div>
      ) : null}

      <WorkspaceActionModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Send warm intro request"
        description={selectedMentor ? `This sends the mentor-review packet to ${selectedMentor.name} in shared demo state.` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRequestOpen(false)}>Cancel</Button>
            <Button onClick={sendRequest} disabled={!mentorGate.canRequest || mentorGate.status === "sent"}>
              <Zap className="size-4" />
              Send request
            </Button>
          </>
        }
      >
        <textarea
          defaultValue={state.profile.supportNeed || `Hi, I am preparing ${state.profile.name || "this startup"} for mentor review and would value your feedback on our pitch narrative and early traction model.`}
          className="min-h-32 w-full resize-none rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink outline-none focus:shadow-framer-focus"
        />
      </WorkspaceActionModal>

      <WorkspaceActionModal
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title ?? "Event details"}
        description={selectedEvent?.time}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedEvent(null)}>Close</Button>
            <Button
              onClick={() => {
                setToast({ tone: "success", title: "Demo reminder set", description: selectedEvent ? `${selectedEvent.title} added to local demo state.` : undefined });
                setSelectedEvent(null);
              }}
            >
              Save reminder
            </Button>
          </>
        }
      >
        <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink-muted">
          {selectedEvent?.detail}
        </div>
      </WorkspaceActionModal>

      <PaywallModal isOpen={paywall.isOpen} onClose={() => setPaywall({ ...paywall, isOpen: false })} title={paywall.title} description={paywall.desc} />
      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
