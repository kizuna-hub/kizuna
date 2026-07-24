"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileUp,
  HelpCircle,
  Loader2,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createFounderWorkspaceStateFromSubmission,
  createSubmitProjectId,
  type SubmitProjectSubmission,
  type SubmitProjectTeamMember,
  upsertFounderDemoProject,
} from "@/features/founder/founder-workspace/demo-state";
import { cn } from "@/lib/utils";

type TeamMemberDraft = SubmitProjectTeamMember;

type PitchDraftMetadata = {
  name: string;
  type: string;
  size: number;
};

type StepId = 1 | 2 | 3 | 4;

type RailContent = {
  title: string;
  items: string[];
  preview: string;
};

type SubmitProjectFormData = {
  projectName: string;
  slogan: string;
  status: string;
  categories: string[];
  problem: string;
  solution: string;
  targetAudience: string;
  businessModel: string;
  evidenceSignals: string[];
  traction: string;
  currentMilestone: string;
  supportNeeds: string[];
  mentorAsk: string;
  demoLink: string;
  pitchDraft?: PitchDraftMetadata;
  team: TeamMemberDraft[];
  isCommitted: boolean;
  role: string;
  logoUrl: string;
  gallery: string[];
};

const steps = [
  { id: 1, title: "Startup Snapshot", shortLabel: "Snapshot", eyebrow: "Minimum context" },
  { id: 2, title: "Problem, Solution & Customer", shortLabel: "Pitch Logic", eyebrow: "Pitch logic" },
  { id: 3, title: "Evidence, Team & Mentor Need", shortLabel: "Readiness", eyebrow: "Readiness signals" },
  { id: 4, title: "Review & Create Workspace", shortLabel: "Review", eyebrow: "Confirm handoff" },
];

const stageOptions = [
  { id: "Idea", label: "Idea", description: "You are validating the problem." },
  { id: "Prototype / MVP", label: "Prototype / MVP", description: "Users can try something." },
  { id: "Pilot / Early users", label: "Pilot / Early users", description: "You are testing with real users." },
  { id: "Launched", label: "Launched", description: "The product is publicly available." },
];
const categoryOptions = ["AI / DeepTech", "EdTech", "FinTech", "Health", "Climate", "Commerce", "Productivity", "Social Impact"];
const businessModelOptions = ["Free / community first", "Subscription", "Marketplace", "Commission", "B2B SaaS", "Service / consulting", "Not sure yet"];
const evidenceOptions = ["User interviews", "Waitlist", "Prototype testers", "Pilot feedback", "Survey results", "Revenue", "Competition result", "Mentor feedback", "No evidence yet"];
const milestoneOptions = [
  { id: "idea_validation", label: "Idea validation" },
  { id: "customer_discovery", label: "Customer discovery" },
  { id: "prototype", label: "Prototype / MVP" },
  { id: "pilot", label: "Pilot / early users" },
  { id: "mentor_review", label: "Mentor review prep" },
];
const supportNeedOptions = [
  { group: "Pitch & Story", items: ["Pitch review", "Business model feedback"] },
  { group: "Market & Growth", items: ["Customer discovery", "Go-to-market strategy"] },
  { group: "Build & Team", items: ["Technical architecture", "Team building"] },
  { group: "Fundraising & Legal", items: ["Fundraising preparation", "Legal/IP guidance", "Not sure yet"] },
];

const creationSteps = [
  "Creating your Founder Workspace...",
  "Mapping project data into AI Pitch Readiness...",
  "Preparing Data Room checklist...",
  "Setting mentor-readiness gate...",
];

const initialFormData: SubmitProjectFormData = {
  projectName: "",
  slogan: "",
  status: "",
  categories: [],
  problem: "",
  solution: "",
  targetAudience: "",
  businessModel: "",
  evidenceSignals: [],
  traction: "",
  currentMilestone: "",
  supportNeeds: [],
  mentorAsk: "",
  demoLink: "",
  team: [{ name: "", role: "", email: "", phone: "", org: "", social: "" }],
  isCommitted: false,
  role: "founder",
  logoUrl: "",
  gallery: [],
};

function toggleValue(values: string[], value: string, max?: number) {
  if (values.includes(value)) return values.filter((item) => item !== value);
  if (max && values.length >= max) return values;
  return [...values, value];
}

function fileSizeLabel(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-body-framer-sm font-semibold text-ink">
      {children} {required ? <span className="text-accent-blue">*</span> : null}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-hairline bg-surface-2 px-4 text-body-framer-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent-blue focus:shadow-framer-focus",
        props.className
      )}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-32 w-full resize-y rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent-blue focus:shadow-framer-focus",
        props.className
      )}
    />
  );
}

function SelectableChip({
  active,
  children,
  onClick,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center rounded-pill border border-hairline bg-surface-2 px-3 py-2 text-left text-caption font-semibold leading-snug text-ink-muted transition-all hover:border-hairline-soft hover:bg-surface-1 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30",
        "whitespace-normal break-words",
        active && "border-accent-blue/60 bg-accent-blue/10 text-ink shadow-framer-edge",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SubmitProjectWizard() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<SubmitProjectFormData>(initialFormData);
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [creationStep, setCreationStep] = React.useState("");

  const updateFormData = <K extends keyof SubmitProjectFormData>(field: K, value: SubmitProjectFormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const updateTeamMember = (index: number, field: keyof TeamMemberDraft, value: string) => {
    setFormData((current) => {
      const team = [...current.team];
      team[index] = { ...team[index], [field]: value };
      return { ...current, team };
    });
  };

  const addTeamMember = () => {
    updateFormData("team", [...formData.team, { name: "", role: "", email: "", phone: "", org: "", social: "" }]);
  };

  const removeTeamMember = (index: number) => {
    if (formData.team.length <= 1) return;
    updateFormData("team", formData.team.filter((_, memberIndex) => memberIndex !== index));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.projectName.trim()) return "Add your startup name so Kizuna can create the workspace.";
      if (!formData.slogan.trim()) return "Add a one-line description. Good enough for a first draft is okay.";
      if (!formData.status) return "Choose the stage that best matches where you are now.";
      if (formData.categories.length === 0) return "Pick at least one category so mentor matching has context.";
    }
    if (step === 2) {
      if (!formData.problem.trim()) return "Add the problem so Kizuna can generate a stronger AI Pitch Review.";
      if (!formData.solution.trim()) return "Add the solution so your pitch has a clear before-and-after story.";
      if (!formData.targetAudience.trim()) return "Add the first customer group you can realistically reach.";
      if (!formData.businessModel) return "Choose a business model assumption. Not sure yet is acceptable.";
    }
    if (step === 3) {
      if (!formData.team.some((member) => member.name.trim() && member.role.trim())) return "Add at least one team member with a name and role.";
      if (formData.supportNeeds.length === 0 && !formData.mentorAsk.trim()) return "Add what you need from a mentor right now.";
    }
    if (step === 4) {
      if (!formData.isCommitted) return "Confirm the founder commitment before creating the workspace.";
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      showToast(error, "error");
      return;
    }
    setCurrentStep((step) => Math.min(4, step + 1));
  };

  const createSubmission = (): SubmitProjectSubmission => {
    const id = createSubmitProjectId(formData.projectName);
    return {
      id,
      createdAt: new Date().toISOString(),
      projectName: formData.projectName.trim(),
      slogan: formData.slogan.trim(),
      categories: formData.categories,
      stage: formData.status,
      problem: formData.problem.trim(),
      solution: formData.solution.trim(),
      targetAudience: formData.targetAudience.trim(),
      businessModel: formData.businessModel,
      team: formData.team
        .filter((member) => member.name.trim() || member.role.trim())
        .map((member) => ({
          name: member.name.trim(),
          role: member.role.trim(),
          email: member.email?.trim(),
          phone: member.phone?.trim(),
          org: member.org?.trim(),
          social: member.social?.trim(),
        })),
      evidenceSignals: formData.evidenceSignals,
      traction: formData.traction.trim(),
      currentMilestone: formData.currentMilestone,
      supportNeeds: formData.supportNeeds,
      supportNeed: formData.supportNeeds.join("; "),
      mentorAsk: formData.mentorAsk.trim(),
      demoLink: formData.demoLink.trim(),
      pitchDraft: formData.pitchDraft,
      gallery: [],
      logoUrl: "",
    };
  };

  const handleCreateWorkspace = async () => {
    const error = validateStep(4);
    if (error) {
      showToast(error, "error");
      return;
    }

    setIsSaving(true);
    for (const step of creationSteps) {
      setCreationStep(step);
      await new Promise((resolve) => window.setTimeout(resolve, 520));
    }

    const submission = createSubmission();
    const workspaceState = createFounderWorkspaceStateFromSubmission(submission);
    upsertFounderDemoProject({
      id: submission.id,
      createdAt: submission.createdAt,
      submission,
      workspaceState,
    });

    showToast("Founder Workspace created. Opening Overview...", "success");
    window.setTimeout(() => {
      router.push(`/${locale}/founder/founder-workspace/${submission.id}`);
    }, 650);
  };

  const stepProgress = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      <div className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))]">
        {toast ? (
          <div
            className={cn(
              "flex items-start gap-3 rounded-xl border border-hairline bg-surface-1 p-4 shadow-framer-edge",
              toast.type === "error" && "border-destructive/40"
            )}
          >
            {toast.type === "success" ? <CheckCircle2 className="mt-0.5 size-4 text-accent-blue" /> : <X className="mt-0.5 size-4 text-destructive" />}
            <p className="text-body-framer-sm text-ink">{toast.message}</p>
          </div>
        ) : null}
      </div>

      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="inline-flex items-center gap-2 text-body-framer-sm font-semibold text-ink-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4" />
            Back to Kizuna
          </Link>
          <div className="hidden items-center gap-2 text-caption text-ink-muted sm:flex">
            <ShieldCheck className="size-4" />
            Demo-safe local workspace creation
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0">
          <div className="mb-7">
            <p className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-muted">Founder Startup Intake</p>
            <h1 className="mt-3 max-w-3xl font-display text-display-sm font-semibold text-ink md:text-display-md">
              Create the workspace your mentor can actually review.
            </h1>
            <p className="mt-3 max-w-2xl text-body-framer text-ink-muted">
              Tell us the minimum context Kizuna needs. You can improve the pitch, deck, and data room after the workspace is created.
            </p>
          </div>

          <StepProgress currentStep={currentStep} progress={stepProgress} />

          <div className="mt-6 rounded-xxl border border-hairline bg-surface-1 p-5 shadow-framer-edge md:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">{steps[currentStep - 1].eyebrow}</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{steps[currentStep - 1].title}</h2>
              </div>
              <span className="rounded-pill border border-hairline bg-surface-2 px-3 py-1 text-caption text-ink-muted">
                Step {currentStep} / 4
              </span>
            </div>

            {currentStep === 1 ? <StartupSnapshotStep formData={formData} updateFormData={updateFormData} /> : null}
            {currentStep === 2 ? <ProblemSolutionStep formData={formData} updateFormData={updateFormData} /> : null}
            {currentStep === 3 ? (
              <EvidenceTeamStep
                formData={formData}
                updateFormData={updateFormData}
                updateTeamMember={updateTeamMember}
                addTeamMember={addTeamMember}
                removeTeamMember={removeTeamMember}
              />
            ) : null}
            {currentStep === 4 ? <ReviewStep formData={formData} updateFormData={updateFormData} isSaving={isSaving} creationStep={creationStep} /> : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary" onClick={() => setCurrentStep((step) => Math.max(1, step - 1))} disabled={currentStep === 1 || isSaving}>
                <ArrowLeft className="size-4" />
                Back to edit
              </Button>
              {currentStep < 4 ? (
                <Button onClick={goNext}>
                  {currentStep === 1 ? "Continue to startup clarity" : currentStep === 2 ? "Continue to evidence & mentor need" : "Review workspace seed"}
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={handleCreateWorkspace} disabled={isSaving}>
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
                  {isSaving ? "Creating workspace..." : "Create Founder Workspace"}
                </Button>
              )}
            </div>
          </div>
        </section>

        <RightRail currentStep={currentStep} formData={formData} />
      </main>
    </div>
  );
}

function StepProgress({ currentStep, progress }: { currentStep: number; progress: number }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-4">
      <div className="mb-3 h-1.5 overflow-hidden rounded-pill bg-surface-2">
        <div className="h-full rounded-pill bg-inverse-canvas transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {steps.map((step) => {
          const complete = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center gap-2">
              <span className={cn("flex size-6 items-center justify-center rounded-full border border-hairline text-caption", active && "bg-inverse-canvas text-inverse-ink", complete && "bg-accent-blue text-ink")}>
                {complete ? <CheckCircle2 className="size-3.5" /> : step.id}
              </span>
              <span className={cn("text-caption font-semibold leading-snug", active ? "text-ink" : "text-ink-muted")} title={step.title}>
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StartupSnapshotStep({
  formData,
  updateFormData,
}: {
  formData: SubmitProjectFormData;
  updateFormData: <K extends keyof SubmitProjectFormData>(field: K, value: SubmitProjectFormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink-muted">
        Tell us the minimum context Kizuna needs to create your startup workspace.
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>Project name</FieldLabel>
          <TextInput value={formData.projectName} onChange={(event) => updateFormData("projectName", event.target.value)} placeholder="Example: Kizuna Hub" />
        </div>
        <div className="space-y-2 md:col-span-1">
          <FieldLabel required>One-line description</FieldLabel>
          <TextArea
            value={formData.slogan}
            onChange={(event) => updateFormData("slogan", event.target.value)}
            placeholder="A mentor-readiness workspace for student founders"
            className="min-h-20"
            rows={2}
          />
        </div>
      </div>
      <div className="space-y-3">
        <FieldLabel required>Stage</FieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stageOptions.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => updateFormData("status", stage.id)}
              className={cn(
                "min-h-24 rounded-xl border border-hairline bg-surface-2 p-4 text-left transition-all hover:border-hairline-soft hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30",
                formData.status === stage.id && "border-accent-blue/60 bg-surface-1 shadow-framer-edge"
              )}
            >
              <span className="block text-body-framer-sm font-semibold leading-snug text-ink">{stage.label}</span>
              <span className="mt-1 block text-caption leading-snug text-ink-muted">{stage.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <FieldLabel required>Industry/category</FieldLabel>
          <span className="text-caption text-ink-muted">{formData.categories.length}/3 selected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <SelectableChip key={category} active={formData.categories.includes(category)} onClick={() => updateFormData("categories", toggleValue(formData.categories, category, 3))}>
              {category}
            </SelectableChip>
          ))}
        </div>
        <p className="text-caption text-ink-muted">Choose up to 3. This helps mentor matching and workspace context.</p>
      </div>
    </div>
  );
}

function ProblemSolutionStep({
  formData,
  updateFormData,
}: {
  formData: SubmitProjectFormData;
  updateFormData: <K extends keyof SubmitProjectFormData>(field: K, value: SubmitProjectFormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>Problem</FieldLabel>
          <p className="text-caption text-ink-muted">What painful problem are you solving? Be specific about who feels it and when it happens.</p>
          <TextArea value={formData.problem} onChange={(event) => updateFormData("problem", event.target.value)} placeholder="Student founders do not know what is missing before asking a mentor to review their startup." />
        </div>
        <div className="space-y-2">
          <FieldLabel required>Solution</FieldLabel>
          <p className="text-caption text-ink-muted">How does your product solve the problem in a simpler, faster, or better way?</p>
          <TextArea value={formData.solution} onChange={(event) => updateFormData("solution", event.target.value)} placeholder="A guided workspace turns profile gaps, pitch diagnosis, and data room prep into mentor-ready actions." />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>Target customer</FieldLabel>
          <p className="text-caption text-ink-muted">Who is the first group of users you can realistically reach?</p>
          <TextArea
            value={formData.targetAudience}
            onChange={(event) => updateFormData("targetAudience", event.target.value)}
            placeholder="University startup club founders preparing for mentor office hours"
            className="min-h-24"
            rows={3}
          />
        </div>
        <div className="space-y-3">
          <FieldLabel required>Business model</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {businessModelOptions.map((model) => (
              <SelectableChip key={model} active={formData.businessModel === model} onClick={() => updateFormData("businessModel", model)}>
                {model}
              </SelectableChip>
            ))}
          </div>
          <p className="text-caption text-ink-muted">It is okay if this is still an assumption.</p>
        </div>
      </div>
    </div>
  );
}

function EvidenceTeamStep({
  formData,
  updateFormData,
  updateTeamMember,
  addTeamMember,
  removeTeamMember,
}: {
  formData: SubmitProjectFormData;
  updateFormData: <K extends keyof SubmitProjectFormData>(field: K, value: SubmitProjectFormData[K]) => void;
  updateTeamMember: (index: number, field: keyof TeamMemberDraft, value: string) => void;
  addTeamMember: () => void;
  removeTeamMember: (index: number) => void;
}) {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <FieldLabel>Evidence signals</FieldLabel>
        <p className="text-caption text-ink-muted">Small signals are enough. Revenue is not required.</p>
        <div className="flex flex-wrap gap-2">
          {evidenceOptions.map((signal) => (
            <SelectableChip key={signal} active={formData.evidenceSignals.includes(signal)} onClick={() => updateFormData("evidenceSignals", toggleValue(formData.evidenceSignals, signal))}>
              {signal}
            </SelectableChip>
          ))}
        </div>
        <TextArea value={formData.traction} onChange={(event) => updateFormData("traction", event.target.value)} placeholder="Describe your strongest evidence so far. Example: 12 founder interviews, 40 waitlist signups, or feedback from a prototype test." />
      </div>

      <div className="space-y-3">
        <FieldLabel>Current milestone</FieldLabel>
        <div className="rounded-xl border border-hairline bg-surface-2 p-3">
          <div className="flex flex-wrap items-center gap-2">
            {milestoneOptions.map((milestone, index) => (
              <React.Fragment key={milestone.id}>
                <button
                  type="button"
                  onClick={() => updateFormData("currentMilestone", milestone.id)}
                  className={cn(
                    "min-h-9 rounded-pill border border-hairline px-3 py-2 text-caption font-semibold leading-snug text-ink-muted transition-all hover:border-hairline-soft hover:bg-surface-1 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30",
                    formData.currentMilestone === milestone.id && "border-accent-blue/60 bg-accent-blue/10 text-ink shadow-framer-edge"
                  )}
                >
                  {milestone.label}
                </button>
                {index < milestoneOptions.length - 1 ? <ArrowRight className="hidden size-3 text-ink-muted sm:block" /> : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <FieldLabel required>What do you need from a mentor right now?</FieldLabel>
          <span className="text-caption text-ink-muted">{formData.supportNeeds.length}/3 selected</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {supportNeedOptions.map((group) => (
            <div key={group.group} className="rounded-xl border border-hairline bg-surface-2 p-4">
              <p className="mb-3 text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">{group.group}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((need) => (
                  <SelectableChip key={need} active={formData.supportNeeds.includes(need)} onClick={() => updateFormData("supportNeeds", toggleValue(formData.supportNeeds, need, 3))}>
                    {need}
                  </SelectableChip>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-caption text-ink-muted">Choose up to 3. Not sure yet is acceptable.</p>
      </div>

      <div className="space-y-2">
        <FieldLabel>Mentor question</FieldLabel>
        <TextArea value={formData.mentorAsk} onChange={(event) => updateFormData("mentorAsk", event.target.value)} placeholder="What is the most important question you want a mentor to help with?" />
      </div>

      <div className="space-y-4 rounded-xl border border-hairline bg-surface-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-accent-blue" />
              <FieldLabel required>Team</FieldLabel>
            </div>
            <p className="mt-1 text-caption text-ink-muted">Name and role are enough to start. Optional contact details help later handoff.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={addTeamMember}>
            <Plus className="size-4" />
            Add member
          </Button>
        </div>
        <div className="space-y-3">
          {formData.team.map((member, index) => (
            <div key={index} className="rounded-xl border border-hairline bg-surface-1 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">Member {index + 1}</p>
                <Button variant="ghost" size="icon" onClick={() => removeTeamMember(index)} disabled={formData.team.length === 1} aria-label="Remove team member">
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <FieldLabel required>Name</FieldLabel>
                  <TextInput value={member.name} onChange={(event) => updateTeamMember(index, "name", event.target.value)} placeholder="Founder name" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel required>Role</FieldLabel>
                  <TextInput value={member.role} onChange={(event) => updateTeamMember(index, "role", event.target.value)} placeholder="Product, engineering, growth..." />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Email</FieldLabel>
                  <TextInput value={member.email ?? ""} onChange={(event) => updateTeamMember(index, "email", event.target.value)} placeholder="founder@example.com" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Phone</FieldLabel>
                  <TextInput value={member.phone ?? ""} onChange={(event) => updateTeamMember(index, "phone", event.target.value)} placeholder="+84..." />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>School / organization</FieldLabel>
                  <TextInput value={member.org ?? ""} onChange={(event) => updateTeamMember(index, "org", event.target.value)} placeholder="University, lab, startup club..." />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Social link</FieldLabel>
                  <TextInput value={member.social ?? ""} onChange={(event) => updateTeamMember(index, "social", event.target.value)} placeholder="LinkedIn, GitHub, portfolio..." />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-hairline bg-surface-2/60 p-4">
        <p className="text-body-framer-sm font-semibold text-ink">Optional details</p>
        <p className="mt-1 text-caption text-ink-muted">These can help later, but they should not block your first workspace.</p>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>Demo link</FieldLabel>
            <TextInput value={formData.demoLink} onChange={(event) => updateFormData("demoLink", event.target.value)} placeholder="https://prototype-or-demo-link" />
          </div>
          <div className="space-y-2">
            <FieldLabel>Pitch draft</FieldLabel>
            <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-hairline bg-surface-1 px-4 py-2 text-body-framer-sm leading-snug text-ink-muted transition-colors hover:bg-surface-2">
              <span className="inline-flex min-w-0 items-center gap-2">
                <FileUp className="size-4 shrink-0" />
                <span className="min-w-0 break-words">
                  {formData.pitchDraft ? `${formData.pitchDraft.name} (${fileSizeLabel(formData.pitchDraft.size)})` : "Upload metadata only"}
                </span>
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  updateFormData("pitchDraft", { name: file.name, type: file.type || "draft", size: file.size });
                }}
              />
            </label>
            <p className="text-caption text-ink-muted">No file contents are stored in this demo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  formData,
  updateFormData,
  isSaving,
  creationStep,
}: {
  formData: SubmitProjectFormData;
  updateFormData: <K extends keyof SubmitProjectFormData>(field: K, value: SubmitProjectFormData[K]) => void;
  isSaving: boolean;
  creationStep: string;
}) {
  const summaryItems = [
    ["Startup", `${formData.projectName || "Missing"} - ${formData.status || "stage not set"}`],
    ["Problem", formData.problem || "Missing"],
    ["Solution", formData.solution || "Missing"],
    ["Customer", formData.targetAudience || "Missing"],
    ["Evidence", [...formData.evidenceSignals, formData.traction].filter(Boolean).join("; ") || "Can be added later"],
    ["Mentor need", [...formData.supportNeeds, formData.mentorAsk].filter(Boolean).join("; ") || "Missing"],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {summaryItems.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-hairline bg-surface-2 p-4">
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
            <p className="mt-2 text-body-framer-sm text-ink">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-hairline bg-surface-2 p-5">
        <p className="text-body-framer-sm font-semibold text-ink">Kizuna will create:</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {["Founder Workspace Overview", "AI Pitch Readiness draft", "Data Room checklist", "Mentor Review readiness gate"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-body-framer-sm text-ink-muted">
              <CheckCircle2 className="size-4 text-accent-blue" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-surface-2 p-4">
        <input
          type="checkbox"
          checked={formData.isCommitted}
          onChange={(event) => updateFormData("isCommitted", event.target.checked)}
          className="mt-1 size-4 rounded border-hairline bg-surface-1 text-accent-blue focus:ring-accent-blue"
        />
        <span>
          <span className="block text-body-framer-sm font-semibold text-ink">Founder commitment</span>
          <span className="mt-1 block text-caption text-ink-muted">
            I confirm this is a good-faith startup intake. Kizuna will use local demo state to prepare the workspace.
          </span>
        </span>
      </label>
      {isSaving ? (
        <div className="rounded-xl border border-accent-blue/30 bg-surface-2 p-4 text-body-framer-sm text-ink">
          <Loader2 className="mr-2 inline size-4 animate-spin" />
          {creationStep}
        </div>
      ) : null}
    </div>
  );
}

function RightRail({ currentStep, formData }: { currentStep: number; formData: SubmitProjectFormData }) {
  const railByStep: Record<StepId, RailContent> = {
    1: {
      title: "Snapshot context",
      items: ["Creates the workspace identity", "Sets the current startup stage", "Gives mentor matching a first category"],
      preview: `${formData.projectName || "Your startup"} workspace`,
    },
    2: {
      title: "Pitch logic",
      items: ["Generate your first pitch draft", "Score problem-solution clarity", "Detect missing customer evidence"],
      preview: "AI Pitch Readiness source",
    },
    3: {
      title: "Readiness signals",
      items: ["Prepare mentor matching context", "Build your Data Room checklist", "Unlock mentor review when ready"],
      preview: "Mentor-readiness gate",
    },
    4: {
      title: "Workspace handoff",
      items: ["Open Founder Workspace Overview", "Run AI Pitch Readiness", "Prepare Data Room and mentor review"],
      preview: "Ready for workspace handoff",
    },
  };
  const safeStep = (currentStep >= 1 && currentStep <= 4 ? currentStep : 1) as StepId;
  const railContent = railByStep[safeStep];

  const completed = [
    Boolean(formData.projectName && formData.slogan && formData.status && formData.categories.length),
    Boolean(formData.problem && formData.solution && formData.targetAudience && formData.businessModel),
    Boolean(formData.team.some((member) => member.name && member.role) && (formData.supportNeeds.length || formData.mentorAsk)),
    formData.isCommitted,
  ];

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xxl border border-hairline bg-surface-1 p-5 shadow-framer-edge">
        <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.16em] text-ink-muted">
          <HelpCircle className="size-4" />
          Intake Companion
        </div>
        <h3 className="mt-4 text-xl font-semibold text-ink">{railContent.title}</h3>
        <p className="mt-2 text-body-framer-sm leading-relaxed text-ink-muted">
          Kizuna uses this intake to prepare a mentor-review workspace, not a public product listing.
        </p>

        <div className="mt-5 rounded-xl border border-hairline bg-surface-2 p-4">
          <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">
            <Target className="size-4" />
            What this powers
          </div>
          <div className="mt-3 space-y-2">
          {railContent.items.map((item) => (
            <div key={item} className="flex items-start gap-2 text-body-framer-sm leading-snug text-ink-muted">
              <CheckCircle2 className="mt-0.5 size-4 text-accent-blue" />
              {item}
            </div>
          ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-hairline bg-surface-2 p-4">
          <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-ink-muted">
            <Circle className="size-4" />
            Workspace preview
          </div>
          <p className="mt-3 break-words text-body-framer-sm font-semibold text-ink">{railContent.preview}</p>
          <div className="mt-4 space-y-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 text-caption leading-snug text-ink-muted">
              {completed[index] ? <CheckCircle2 className="size-4 shrink-0 text-accent-blue" /> : <Circle className="size-4 shrink-0" />}
              <span className="break-words">{step.title}</span>
            </div>
          ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-hairline bg-surface-2 p-4">
          <Sparkles className="mt-0.5 size-4 text-accent-blue" />
          <p className="text-caption leading-relaxed text-ink-muted">
            Good enough for a first draft is okay. You can improve this later in AI Pitch Readiness.
          </p>
        </div>
      </div>
    </aside>
  );
}
