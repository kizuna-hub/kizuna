import {
  createDemoWorkspaceSeed,
  DEMO_WORKSPACE_STORAGE_VERSION,
} from "./demo-seed";
import {
  getExperimentForVenture,
  getEvidenceRequirementsForExperiment,
  getCycleTasksForExperiment,
  getDecisionLoopNextAction,
  getReviewSummary,
  isDecisionLoopCollectionItem,
} from "../../venture/decision-loop/application";
import type {
  ActionCycle,
  BaselineField,
  CreateDemoVentureInput,
  DemoWorkspaceState,
  FounderUser,
  NextAction,
  Program,
  SupportCoverageSummary,
  SupportRelationship,
  Venture,
  VentureActivity,
  VentureDecision,
  VentureFeedback,
  VentureId,
  VenturePhase,
  VentureStage,
  VentureStatus,
  VentureSetupDraft,
  VentureSetupStepId,
} from "./types";

type PersistedWorkspaceEnvelope = {
  version: number;
  state: DemoWorkspaceState;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasArray(value: Record<string, unknown>, key: string) {
  return Array.isArray(value[key]);
}

const legacyArrayKeys = [
  "ventures",
  "decisions",
  "actionCycles",
  "supportRelationships",
  "programs",
  "evidence",
  "feedback",
  "outcomes",
  "readinessDeltas",
  "opportunities",
  "activities",
] as const;

const decisionLoopArrayKeys = [
  "sources",
  "baselines",
  "challengeScans",
  "challengeItems",
  "experiments",
  "evidenceRequirements",
  "cycleTasks",
] as const;

function isLegacyDemoWorkspaceState(
  value: unknown,
): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    isRecord(value.currentUser) &&
    typeof value.currentUser.id === "string" &&
    typeof value.currentUser.name === "string" &&
    legacyArrayKeys.every((key) => hasArray(value, key)) &&
    isRecord(value.uiPreferences)
  );
}

export function isDemoWorkspaceState(
  value: unknown,
): value is DemoWorkspaceState {
  if (!isRecord(value) || !isRecord(value.currentUser)) return false;
  if (
    typeof value.currentUser.id !== "string" ||
    typeof value.currentUser.name !== "string"
  ) {
    return false;
  }

  return (
    legacyArrayKeys.every((key) => hasArray(value, key)) &&
    decisionLoopArrayKeys.every(
      (key) =>
        hasArray(value, key) &&
        (value[key] as unknown[]).every(isDecisionLoopCollectionItem),
    ) &&
    isRecord(value.uiPreferences) &&
    value.uiPreferences.storageVersion === DEMO_WORKSPACE_STORAGE_VERSION
  );
}

function migrateLegacyDemoWorkspaceState(
  value: Record<string, unknown>,
): DemoWorkspaceState {
  const seed = createDemoWorkspaceSeed();
  const legacy = value as unknown as Omit<
    DemoWorkspaceState,
    | "sources"
    | "baselines"
    | "challengeScans"
    | "challengeItems"
    | "experiments"
    | "evidenceRequirements"
    | "cycleTasks"
  >;
  const ventureIds = new Set(
    legacy.ventures.map((venture) => venture.id),
  );

  return {
    ...legacy,
    sources: seed.sources.filter((source) =>
      ventureIds.has(source.ventureId),
    ),
    baselines: seed.baselines.filter((baseline) =>
      ventureIds.has(baseline.ventureId),
    ),
    challengeScans: [],
    challengeItems: [],
    experiments: seed.experiments.filter((experiment) =>
      ventureIds.has(experiment.ventureId),
    ),
    evidenceRequirements: seed.evidenceRequirements.filter(
      (requirement) => ventureIds.has(requirement.ventureId),
    ),
    cycleTasks: seed.cycleTasks.filter((task) =>
      ventureIds.has(task.ventureId),
    ),
    uiPreferences: {
      ...legacy.uiPreferences,
      storageVersion: DEMO_WORKSPACE_STORAGE_VERSION,
    },
  };
}

function normalizePersistedVentureSetup(
  venture: Venture,
): Venture {
  if (!venture.setup) return venture;
  const raw = venture.setup as unknown;
  if (!isRecord(raw)) {
    return { ...venture, setup: undefined };
  }

  const rawDraft = isRecord(raw.draft) ? raw.draft : {};
  const materials = Array.isArray(rawDraft.materials)
    ? rawDraft.materials.filter(
        (
          item,
        ): item is VentureSetupDraft["materials"][number] =>
          isRecord(item) &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.size === "number" &&
          typeof item.type === "string",
      )
    : [];
  const draft: VentureSetupDraft = {
    problem:
      typeof rawDraft.problem === "string"
        ? rawDraft.problem
        : "",
    targetUser:
      typeof rawDraft.targetUser === "string"
        ? rawDraft.targetUser
        : "",
    initialGoal:
      typeof rawDraft.initialGoal === "string"
        ? rawDraft.initialGoal
        : "",
    materials,
  };
  const validCompleted = Array.isArray(raw.completedStepIds)
    ? raw.completedStepIds.filter(
        (step): step is VentureSetupStepId =>
          typeof step === "string" &&
          setupStepIds.includes(step as VentureSetupStepId),
      )
    : [];
  const missingRequiredFields = getMissingSetupFields(
    venture,
    draft,
  );
  const earliestIncomplete = missingRequiredFields.includes(
    "Vấn đề",
  )
    ? "problem"
    : missingRequiredFields.includes("Người dùng mục tiêu") ||
        missingRequiredFields.includes("Mục tiêu ban đầu")
      ? "target-user"
      : "confirm-context";
  const currentStepId =
    typeof raw.currentStepId === "string" &&
    setupStepIds.includes(
      raw.currentStepId as VentureSetupStepId,
    )
      ? (raw.currentStepId as VentureSetupStepId)
      : earliestIncomplete;
  const creationIntent =
    raw.creationIntent === "analyze-materials" ||
    raw.creationIntent === "empty-venture"
      ? raw.creationIntent
      : "conversational-setup";
  const status =
    raw.status === "draft" ||
    raw.status === "ready-for-confirmation" ||
    raw.status === "completed"
      ? raw.status
      : "in-progress";

  return {
    ...venture,
    setup: {
      status,
      creationIntent,
      currentStepId,
      completedStepIds: validCompleted,
      missingRequiredFields,
      draft,
      lastUpdatedAt:
        typeof raw.lastUpdatedAt === "string"
          ? raw.lastUpdatedAt
          : venture.lastUpdatedAt,
    },
  };
}

function mergeCanonicalDemoAdditions(
  state: DemoWorkspaceState,
): DemoWorkspaceState {
  const seed = createDemoWorkspaceSeed();
  const normalizedState: DemoWorkspaceState = {
    ...state,
    ventures: state.ventures.map(normalizePersistedVentureSetup),
    uiPreferences: {
      ...seed.uiPreferences,
      ...state.uiPreferences,
    },
    evidence: [
      ...state.evidence,
      ...seed.evidence.filter(
        (seeded) =>
          state.ventures.some(
            (venture) => venture.id === seeded.ventureId,
          ) &&
          !state.evidence.some(
            (existing) => existing.id === seeded.id,
          ),
      ),
    ],
    opportunities: [
      ...state.opportunities,
      ...seed.opportunities.filter(
        (seeded) =>
          (!seeded.ventureId ||
            state.ventures.some(
              (venture) => venture.id === seeded.ventureId,
            )) &&
          !state.opportunities.some(
            (existing) => existing.id === seeded.id,
          ),
      ),
    ],
  };
  const existingVentureIds = new Set(
    normalizedState.ventures.map((venture) => venture.id),
  );
  const missingVentureIds = new Set(
    seed.ventures
      .filter((venture) => !existingVentureIds.has(venture.id))
      .map((venture) => venture.id),
  );

  if (missingVentureIds.size === 0) return normalizedState;

  const appendForMissingVentures = <T extends { ventureId: VentureId }>(
    existing: T[],
    seeded: T[],
  ) => [
    ...existing,
    ...seeded.filter((item) => missingVentureIds.has(item.ventureId)),
  ];

  return {
    ...normalizedState,
    ventures: [
      ...normalizedState.ventures,
      ...seed.ventures.filter((venture) =>
        missingVentureIds.has(venture.id),
      ),
    ],
    sources: appendForMissingVentures(normalizedState.sources, seed.sources),
    baselines: appendForMissingVentures(normalizedState.baselines, seed.baselines),
    challengeScans: appendForMissingVentures(
      normalizedState.challengeScans,
      seed.challengeScans,
    ),
    challengeItems: appendForMissingVentures(
      normalizedState.challengeItems,
      seed.challengeItems,
    ),
    decisions: appendForMissingVentures(
      normalizedState.decisions,
      seed.decisions,
    ),
    experiments: appendForMissingVentures(
      normalizedState.experiments,
      seed.experiments,
    ),
    evidenceRequirements: appendForMissingVentures(
      normalizedState.evidenceRequirements,
      seed.evidenceRequirements,
    ),
    cycleTasks: appendForMissingVentures(
      normalizedState.cycleTasks,
      seed.cycleTasks,
    ),
    actionCycles: appendForMissingVentures(
      normalizedState.actionCycles,
      seed.actionCycles,
    ),
    supportRelationships: appendForMissingVentures(
      normalizedState.supportRelationships,
      seed.supportRelationships,
    ),
    programs: appendForMissingVentures(normalizedState.programs, seed.programs),
    evidence: appendForMissingVentures(normalizedState.evidence, seed.evidence),
    feedback: appendForMissingVentures(normalizedState.feedback, seed.feedback),
    outcomes: appendForMissingVentures(normalizedState.outcomes, seed.outcomes),
    readinessDeltas: appendForMissingVentures(
      normalizedState.readinessDeltas,
      seed.readinessDeltas,
    ),
    opportunities: normalizedState.opportunities,
    activities: appendForMissingVentures(
      normalizedState.activities,
      seed.activities,
    ),
  };
}

export function serializeDemoWorkspaceState(state: DemoWorkspaceState) {
  const envelope: PersistedWorkspaceEnvelope = {
    version: DEMO_WORKSPACE_STORAGE_VERSION,
    state,
  };
  return JSON.stringify(envelope);
}

export function restoreDemoState(rawValue?: string | null) {
  if (!rawValue) return createDemoWorkspaceSeed();

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isRecord(parsed)) return createDemoWorkspaceSeed();
    if (
      parsed.version === DEMO_WORKSPACE_STORAGE_VERSION &&
      isDemoWorkspaceState(parsed.state)
    ) {
      return mergeCanonicalDemoAdditions(parsed.state);
    }
    if (
      parsed.version === 1 &&
      isLegacyDemoWorkspaceState(parsed.state)
    ) {
      return mergeCanonicalDemoAdditions(
        migrateLegacyDemoWorkspaceState(parsed.state),
      );
    }
    return createDemoWorkspaceSeed();
  } catch {
    return createDemoWorkspaceSeed();
  }
}

export function resetDemoState() {
  return createDemoWorkspaceSeed();
}

export function getCurrentUser(state: DemoWorkspaceState): FounderUser {
  return state.currentUser;
}

export function getAllVentures(
  state: DemoWorkspaceState,
  options: { includeArchived?: boolean } = {},
) {
  return options.includeArchived
    ? state.ventures
    : state.ventures.filter((venture) => venture.status !== "archived");
}

export function getVentureById(
  state: DemoWorkspaceState,
  ventureId?: VentureId,
) {
  return state.ventures.find((venture) => venture.id === ventureId);
}

function isAccessibleVenture(venture?: Venture) {
  return Boolean(venture && venture.status !== "archived");
}

export function getActiveVenture(state: DemoWorkspaceState) {
  const active = getVentureById(
    state,
    state.currentUser.activeVentureId,
  );
  if (isAccessibleVenture(active)) return active;

  const lastVisited = getVentureById(
    state,
    state.currentUser.lastVisitedVentureId,
  );
  if (isAccessibleVenture(lastVisited)) return lastVisited;

  return getAllVentures(state)[0];
}

export function getActiveDecisionForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): VentureDecision | undefined {
  const venture = getVentureById(state, ventureId);
  if (!venture?.activeDecisionId) return undefined;
  return state.decisions.find(
    (decision) =>
      decision.id === venture.activeDecisionId &&
      decision.ventureId === ventureId,
  );
}

export function getActiveCycleForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): ActionCycle | undefined {
  const venture = getVentureById(state, ventureId);
  if (!venture?.activeCycleId) return undefined;
  return state.actionCycles.find(
    (cycle) =>
      cycle.id === venture.activeCycleId &&
      cycle.ventureId === ventureId,
  );
}

export function getSupportRelationshipsForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): SupportRelationship[] {
  return state.supportRelationships.filter(
    (relationship) =>
      relationship.ventureId === ventureId &&
      relationship.status === "active",
  );
}

export function getSupportCoverageForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): SupportCoverageSummary {
  const venture = getVentureById(state, ventureId);
  const relationships = getSupportRelationshipsForVenture(
    state,
    ventureId,
  );

  if (relationships.length === 0) {
    return {
      status: "uncovered",
      activeRelationshipCount: 0,
      summary: "No active support relationship",
      gap: venture?.supportSummary.gap,
    };
  }

  return {
    status: venture?.supportSummary.status ?? "covered",
    activeRelationshipCount: relationships.length,
    summary:
      venture?.supportSummary.summary ??
      `${relationships.length} active support relationship${
        relationships.length === 1 ? "" : "s"
      }`,
    gap: venture?.supportSummary.gap,
  };
}

export function getProgramForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): Program | undefined {
  return (
    state.programs.find(
      (program) =>
        program.ventureId === ventureId &&
        program.status === "active",
    ) ??
    state.programs.find((program) => program.ventureId === ventureId)
  );
}

export function getNextActionForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): NextAction {
  const venture = getVentureById(state, ventureId);
  if (
    venture?.status === "setup" &&
    venture.setup?.status !== "completed"
  ) {
    return {
      id: `next-${ventureId}-setup`,
      label: "Continue venture setup",
      description: `Resume ${venture.setup?.currentStepId ?? "venture context"}.`,
      targetPath: venture.setup
        ? `/founder/projects/${ventureId}/setup`
        : `/founder/projects/${ventureId}/context`,
      kind: "continue-setup",
    };
  }

  const decisionLoopAction = getDecisionLoopNextAction(state, ventureId);
  if (decisionLoopAction) return decisionLoopAction;

  const decision = getActiveDecisionForVenture(state, ventureId);
  if (decision) return decision.nextAction;

  return {
    id: `next-${ventureId}-workspace`,
    label: "Open workspace",
    description: "Review the current project context.",
    targetPath: `/founder/projects/${ventureId}`,
    kind: "open-workspace",
  };
}

function isValidVenturePath(path: string, ventureId: VentureId) {
  return (
    path === `/founder/projects/${ventureId}` ||
    path.startsWith(`/founder/projects/${ventureId}/`) ||
    path === `/founder/founder-workspace/${ventureId}` ||
    path.startsWith(`/founder/founder-workspace/${ventureId}/`)
  );
}

export function getLastVisitedPathForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVentureById(state, ventureId);
  if (!isAccessibleVenture(venture)) return undefined;
  const path = state.currentUser.lastVisitedPathByVenture?.[ventureId];
  return path && isValidVenturePath(path, ventureId) ? path : undefined;
}

export function getActivitiesForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): VentureActivity[] {
  return state.activities
    .filter((activity) => activity.ventureId === ventureId)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}

export function getFeedbackForVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
): VentureFeedback[] {
  return state.feedback.filter(
    (feedback) => feedback.ventureId === ventureId,
  );
}

export function getFilteredVentures(
  state: DemoWorkspaceState,
  options: {
    query?: string;
    stage?: VentureStage | "all";
    status?: VentureStatus | "all";
  } = {},
) {
  const query = options.query?.trim().toLowerCase() ?? "";
  const stage = options.stage ?? "all";
  const status = options.status ?? "all";

  return getAllVentures(state).filter((venture) => {
    if (stage !== "all" && venture.stage !== stage) return false;
    if (status !== "all" && venture.status !== status) return false;
    if (!query) return true;
    const decision = getActiveDecisionForVenture(state, venture.id);
    return [
      venture.name,
      venture.oneLineDescription,
      venture.tags.join(" "),
      venturePhaseLabels[venture.currentPhase],
      decision?.title ?? "",
      decision?.nextAction.label ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export function getVentureOverviewData(
  state: DemoWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVentureById(state, ventureId);
  if (!venture || venture.status === "archived") return undefined;

  return {
    venture,
    decision: getActiveDecisionForVenture(state, ventureId),
    action: getNextActionForVenture(state, ventureId),
    cycle: getActiveCycleForVenture(state, ventureId),
    relationships: getSupportRelationshipsForVenture(
      state,
      ventureId,
    ),
    supportCoverage: getSupportCoverageForVenture(
      state,
      ventureId,
    ),
    program: getProgramForVenture(state, ventureId),
    activities: getActivitiesForVenture(state, ventureId),
    feedback: getFeedbackForVenture(state, ventureId),
    evidence: state.evidence.filter(
      (item) => item.ventureId === ventureId,
    ),
    experiment: getExperimentForVenture(state, ventureId),
    evidenceRequirements: (() => {
      const experiment = getExperimentForVenture(state, ventureId);
      return experiment
        ? getEvidenceRequirementsForExperiment(state, experiment.id)
        : [];
    })(),
    cycleTasks: (() => {
      const experiment = getExperimentForVenture(state, ventureId);
      return experiment
        ? getCycleTasksForExperiment(state, experiment.id)
        : [];
    })(),
    reviewSummary: getReviewSummary(state, ventureId),
  };
}

export function setActiveVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVentureById(state, ventureId);
  if (!isAccessibleVenture(venture)) return state;

  return {
    ...state,
    currentUser: {
      ...state.currentUser,
      activeVentureId: ventureId,
      lastVisitedVentureId: ventureId,
    },
  };
}

export function setLastVisitedVenturePath(
  state: DemoWorkspaceState,
  ventureId: VentureId,
  path: string,
) {
  const venture = getVentureById(state, ventureId);
  if (!isAccessibleVenture(venture)) return state;
  if (!isValidVenturePath(path, ventureId)) return state;

  return {
    ...state,
    currentUser: {
      ...state.currentUser,
      activeVentureId: ventureId,
      lastVisitedVentureId: ventureId,
      lastVisitedPathByVenture: {
        ...(state.currentUser.lastVisitedPathByVenture ?? {}),
        [ventureId]: path,
      },
    },
  };
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "new-project"
  );
}

function createEmptyBaselineField(
  value = "",
  sourceIds: string[] = [],
): BaselineField {
  return {
    value,
    sourceIds,
    confidence: value ? "developing" : "low",
    status: value ? "needs-review" : "missing",
    founderConfirmed: false,
  };
}

const setupStepIds: VentureSetupStepId[] = [
  "venture-name",
  "problem",
  "target-user",
  "materials",
  "confirm-context",
];

function getMissingSetupFields(
  venture: Pick<Venture, "name" | "stage">,
  draft: VentureSetupDraft,
) {
  const missing: string[] = [];
  if (!venture.name.trim()) missing.push("Tên venture");
  if (!draft.problem.trim()) missing.push("Vấn đề");
  if (!draft.targetUser.trim()) missing.push("Người dùng mục tiêu");
  if (!venture.stage) missing.push("Giai đoạn");
  if (!draft.initialGoal.trim()) missing.push("Mục tiêu ban đầu");
  return missing;
}

function getSetupStepIndex(stepId: VentureSetupStepId) {
  return setupStepIds.indexOf(stepId);
}

function uniqueVentureId(
  state: DemoWorkspaceState,
  preferredId: string,
) {
  if (!state.ventures.some((venture) => venture.id === preferredId)) {
    return preferredId;
  }

  let suffix = 2;
  while (
    state.ventures.some(
      (venture) => venture.id === `${preferredId}-${suffix}`,
    )
  ) {
    suffix += 1;
  }
  return `${preferredId}-${suffix}`;
}

export function createDemoVenture(
  state: DemoWorkspaceState,
  input: CreateDemoVentureInput,
) {
  const requestId = input.requestId?.trim();
  const existingVentureId = requestId
    ? state.uiPreferences.ventureCreationRequestMap?.[requestId]
    : undefined;
  if (
    existingVentureId &&
    getVentureById(state, existingVentureId)
  ) {
    return { ventureId: existingVentureId, state };
  }

  const slug = slugify(input.name);
  const id = uniqueVentureId(
    state,
    input.id?.trim() || `venture-${slug}`,
  );
  const createdAt = input.createdAt ?? new Date().toISOString();
  const decisionId = `decision-${id}-context`;
  const currentPhase = input.currentPhase ?? "venture-context";
  const setupDraft: VentureSetupDraft = {
    problem: "",
    targetUser: "",
    initialGoal: input.initialDecisionTitle ?? "",
    materials: [],
  };
  const initialSetupStepId =
    input.initialSetupStepId ?? "problem";
  const decision: VentureDecision = {
    id: decisionId,
    ventureId: id,
    title:
      input.initialDecisionTitle ??
      "What must be clarified before the first action cycle?",
    whyItMatters:
      input.initialDecisionRationale ??
      "A clear decision keeps early work focused on evidence that can change the plan.",
    status: "open",
    priority: "high",
    nextAction: {
      id: `next-${id}-context`,
      label: "Review venture context",
      description:
        "Check the minimum project context before choosing a critical decision.",
      targetPath: `/founder/projects/${id}/context`,
      kind: "review-context",
    },
    createdAt,
    updatedAt: createdAt,
  };
  const venture: Venture = {
    id,
    name: input.name.trim(),
    slug,
    oneLineDescription: input.oneLineDescription.trim(),
    stage: input.stage,
    status:
      currentPhase === "venture-context" ? "setup" : "active",
    tags: input.tags ?? [],
    currentPhase,
    setup: {
      status: "in-progress",
      creationIntent:
        input.creationIntent ?? "conversational-setup",
      currentStepId: initialSetupStepId,
      completedStepIds: ["venture-name"],
      missingRequiredFields: getMissingSetupFields(
        { name: input.name, stage: input.stage },
        setupDraft,
      ),
      draft: setupDraft,
      lastUpdatedAt: createdAt,
    },
    activeDecisionId: decisionId,
    supportSummary: {
      status: "uncovered",
      activeRelationshipCount: 0,
      summary: "No active support relationship",
    },
    overallProgress: {
      confidence: "low",
      recentChange: "Project context was created.",
      unresolvedGap:
        "The first critical decision has not been committed.",
    },
    lastUpdatedAt: createdAt,
    createdAt,
  };

  const nextState: DemoWorkspaceState = {
    ...state,
    ventures: [venture, ...state.ventures],
    baselines: [
      {
        id: `baseline-${id.replace(/^venture-/, "")}`,
        ventureId: id,
        version: "1",
        problem: createEmptyBaselineField(),
        customer: createEmptyBaselineField(),
        buyer: createEmptyBaselineField(),
        solution: createEmptyBaselineField(
          venture.oneLineDescription,
        ),
        stage: createEmptyBaselineField(ventureStageLabels[venture.stage]),
        businessModel: createEmptyBaselineField(),
        evidenceSummary: createEmptyBaselineField(),
        currentGoal: createEmptyBaselineField(
          decision.title,
        ),
        supportSummary: createEmptyBaselineField(
          "No active support relationship",
        ),
        programSummary: createEmptyBaselineField(),
        openAssumptions: createEmptyBaselineField(),
        updatedAt: createdAt,
        acknowledgedIncomplete: false,
        status: "draft",
      },
      ...state.baselines,
    ],
    decisions: [decision, ...state.decisions],
    activities: [
      {
        id: `activity-${id}-created`,
        ventureId: id,
        type: "project",
        message: "Project created from minimum venture context.",
        occurredAt: createdAt,
      },
      ...state.activities,
    ],
    uiPreferences: {
      ...state.uiPreferences,
      ventureCreationRequestMap: requestId
        ? {
            ...(state.uiPreferences.ventureCreationRequestMap ?? {}),
            [requestId]: id,
          }
        : state.uiPreferences.ventureCreationRequestMap,
    },
  };

  return {
    ventureId: id,
    state: setLastVisitedVenturePath(
      setActiveVenture(nextState, id),
      id,
      `/founder/projects/${id}`,
    ),
  };
}

export interface UpdateVentureSetupInput {
  currentStepId?: VentureSetupStepId;
  completedStepIds?: VentureSetupStepId[];
  name?: string;
  stage?: VentureStage;
  problem?: string;
  targetUser?: string;
  initialGoal?: string;
  materials?: VentureSetupDraft["materials"];
  updatedAt?: string;
}

export function updateDemoVentureSetup(
  state: DemoWorkspaceState,
  ventureId: VentureId,
  input: UpdateVentureSetupInput,
) {
  const venture = getVentureById(state, ventureId);
  if (!venture || venture.status === "archived") return state;

  const updatedAt = input.updatedAt ?? new Date().toISOString();
  const currentSetup = venture.setup ?? {
    status: "in-progress" as const,
    creationIntent: "conversational-setup" as const,
    currentStepId: "problem" as const,
    completedStepIds: ["venture-name" as const],
    missingRequiredFields: [],
    draft: {
      problem: "",
      targetUser: "",
      initialGoal: "",
      materials: [],
    },
    lastUpdatedAt: updatedAt,
  };
  const nextDraft: VentureSetupDraft = {
    problem: input.problem ?? currentSetup.draft.problem,
    targetUser: input.targetUser ?? currentSetup.draft.targetUser,
    initialGoal:
      input.initialGoal ?? currentSetup.draft.initialGoal,
    materials: input.materials ?? currentSetup.draft.materials,
  };
  const nextVenture = {
    ...venture,
    name: input.name?.trim() || venture.name,
    slug: input.name ? slugify(input.name) : venture.slug,
    stage: input.stage ?? venture.stage,
    oneLineDescription:
      nextDraft.problem || venture.oneLineDescription,
    lastUpdatedAt: updatedAt,
  };
  const completedStepIds = Array.from(
    new Set(
      input.completedStepIds ?? currentSetup.completedStepIds,
    ),
  ).filter((stepId): stepId is VentureSetupStepId =>
    setupStepIds.includes(stepId),
  );
  const currentStepId =
    input.currentStepId ?? currentSetup.currentStepId;
  const missingRequiredFields = getMissingSetupFields(
    nextVenture,
    nextDraft,
  );

  return {
    ...state,
    ventures: state.ventures.map((item) =>
      item.id === ventureId
        ? {
            ...nextVenture,
            setup: {
              ...currentSetup,
              status:
                currentStepId === "confirm-context" &&
                missingRequiredFields.length === 0
                  ? ("ready-for-confirmation" as const)
                  : ("in-progress" as const),
              currentStepId,
              completedStepIds,
              missingRequiredFields,
              draft: nextDraft,
              lastUpdatedAt: updatedAt,
            },
          }
        : item,
    ),
  };
}

export function confirmDemoVentureSetup(
  state: DemoWorkspaceState,
  ventureId: VentureId,
  confirmedAt = new Date().toISOString(),
) {
  const venture = getVentureById(state, ventureId);
  if (!venture?.setup || venture.status === "archived") {
    return { confirmed: false, state };
  }
  const setup = venture.setup;
  const missingRequiredFields = getMissingSetupFields(
    venture,
    setup.draft,
  );
  if (missingRequiredFields.length > 0) {
    return {
      confirmed: false,
      state: updateDemoVentureSetup(state, ventureId, {
        currentStepId: "confirm-context",
        updatedAt: confirmedAt,
      }),
    };
  }

  const nextState: DemoWorkspaceState = {
    ...state,
    ventures: state.ventures.map((item) =>
      item.id === ventureId
        ? {
            ...item,
            status: "active" as const,
            currentPhase: "decision-framing" as const,
            setup: {
              ...setup,
              status: "completed" as const,
              currentStepId: "confirm-context" as const,
              completedStepIds: [...setupStepIds],
              missingRequiredFields: [],
              lastUpdatedAt: confirmedAt,
            },
            overallProgress: {
              confidence: "developing" as const,
              recentChange:
                "Founder confirmed the initial venture context.",
              unresolvedGap:
                "The first validation cycle still needs evidence.",
            },
            lastUpdatedAt: confirmedAt,
          }
        : item,
    ),
    baselines: state.baselines.map((baseline) =>
      baseline.ventureId === ventureId
        ? {
            ...baseline,
            problem: createEmptyBaselineField(
              setup.draft.problem,
            ),
            customer: createEmptyBaselineField(
              setup.draft.targetUser,
            ),
            currentGoal: createEmptyBaselineField(
              setup.draft.initialGoal,
            ),
            acknowledgedIncomplete: true,
            status: "confirmed" as const,
            updatedAt: confirmedAt,
          }
        : baseline,
    ),
    decisions: state.decisions.map((decision) =>
      decision.ventureId === ventureId
        ? {
            ...decision,
            title:
              setup.draft.initialGoal || decision.title,
            nextAction: {
              ...decision.nextAction,
              label: "Open Founder AI Workspace",
              description:
                "Continue with the first conversation and validation focus.",
              targetPath: `/founder/projects/${ventureId}/workspace`,
              kind: "open-workspace" as const,
            },
            updatedAt: confirmedAt,
          }
        : decision,
    ),
    activities: [
      {
        id: `activity-${ventureId}-context-confirmed`,
        ventureId,
        type: "project",
        message:
          "Initial venture context confirmed and AI workspace activated.",
        occurredAt: confirmedAt,
      },
      ...state.activities,
    ],
  };

  return {
    confirmed: true,
    state: setLastVisitedVenturePath(
      setActiveVenture(nextState, ventureId),
      ventureId,
      `/founder/projects/${ventureId}/workspace`,
    ),
  };
}

export function archiveDemoVenture(
  state: DemoWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVentureById(state, ventureId);
  if (!venture || venture.status === "archived") return state;

  const ventures = state.ventures.map((item) =>
    item.id === ventureId
      ? {
          ...item,
          status: "archived" as const,
          lastUpdatedAt: new Date().toISOString(),
        }
      : item,
  );
  const nextActive = ventures.find(
    (item) => item.status !== "archived",
  );
  const currentUser =
    state.currentUser.activeVentureId === ventureId
      ? {
          ...state.currentUser,
          activeVentureId: nextActive?.id,
          lastVisitedVentureId: nextActive?.id,
        }
      : state.currentUser;

  return { ...state, ventures, currentUser };
}

export const ventureStageLabels: Record<VentureStage, string> = {
  idea: "Idea",
  concept: "Concept",
  prototype: "Prototype",
  mvp: "Prototype / MVP",
  "functional-demo": "Functional Demo",
  pilot: "Pilot / Early users",
  "early-users": "Early users",
  launched: "Launched",
};

export function getVentureStageLabel(venture: Venture) {
  return venture.displayStage ?? ventureStageLabels[venture.stage];
}

export const venturePhaseLabels: Record<VenturePhase, string> = {
  "venture-context": "Venture Context",
  "buyer-validation": "Buyer Validation",
  "decision-framing": "Decision Framing",
  "feasibility-review": "Feasibility Review",
  "evidence-review": "Evidence Review",
  "action-cycle": "Action Cycle",
};

export function supportRoleLabel(
  role: SupportRelationship["role"],
) {
  const labels: Record<SupportRelationship["role"], string> = {
    "primary-mentor": "Primary mentor",
    "secondary-mentor": "Secondary mentor",
    "program-mentor": "Program mentor",
    advisor: "Advisor",
    specialist: "Specialist",
    "guest-reviewer": "Guest reviewer",
  };
  return labels[role];
}
