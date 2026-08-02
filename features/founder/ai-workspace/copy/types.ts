import type {
  AiWorkspaceScenarioId,
  DecisionCycleStepId,
  EvidenceSignalStatus,
  MentorDismissReason,
} from "../types/ai-workspace.types";
import type {
  ConversationCategory,
  VentureMemoryStatus,
  VentureSearchContentType,
} from "../types/long-run-workspace.types";

export interface AiWorkspaceCopy {
  workspace: {
    eyebrow: string;
    title: string;
    description: string;
    demoLabel: string;
    scenarioLabel: string;
    reset: string;
    openPulse: string;
    backToConversation: string;
    loading: string;
    noVentureTitle: string;
    createProject: string;
  };
  scenarios: Record<AiWorkspaceScenarioId, string>;
  chat: {
    regionLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    composerLabel: string;
    composerPlaceholder: string;
    send: string;
    sending: string;
    voiceInput: string;
    voiceListening: string;
    voiceUnsupported: string;
    voiceError: string;
    voiceNoSpeech: string;
    attach: string;
    attachmentMenuLabel: string;
    sampleMaterials: string;
    selectedMaterials: string;
    removeAttachment: string;
    attachmentLimit: string;
    typing: string;
    thinkingTitle: string;
    thoughtFor: string;
    thinkingTasks: {
      understandRequest: string;
      reviewContext: string;
      reviewEvidence: string;
      reviewMaterials: string;
      evaluateMentorNeed: string;
      planNextAction: string;
      composeResponse: string;
    };
    retry: string;
    messageSendFailed: string;
    incompleteResponse: string;
    errorFallback: string;
    founderLabel: string;
    assistantLabel: string;
    suggestedPromptsLabel: string;
    analyzeSelected: string;
  };
  response: {
    insightDetected: string;
    viewEvidence: string;
    actionProposal: string;
    editProposal: string;
    cycleCreated: string;
    currentStep: string;
    artifactCompleted: string;
    openAnalysis: string;
    superseded: string;
    dismissed: string;
    sourceSummary: (total: number, verified: number) => string;
    mentorBooked: (name: string) => string;
    ownMentorPreparation: string;
    currentFocus: string;
    bottleneck: string;
    whyItMatters: string;
    nextAction: string;
    sources: string;
    openCycle: string;
    explainConclusion: string;
    viewSources: string;
    materialAnalysis: string;
    confirmInterpretation: string;
    challengeInterpretation: string;
    createCycle: string;
    readiness: string;
    currentScore: string;
    cycleChange: string;
    pointsFromEvidence: string;
    breakdown: string;
    supportedBy: string;
    missingEvidence: string;
    unlockAction: string;
    evidenceReview: string;
    mentorRecommendation: string;
    whyHumanNow: string;
    whyThisMentor: string;
    expectedOutcome: string;
    viewFit: string;
    defer: string;
    noMentorNeeded: string;
    mentorDeferred: string;
    interpretationConfirmed: string;
    interpretationDisputed: string;
  };
  pulse: {
    title: string;
    readiness: string;
    explain: string;
    currentFocus: string;
    evidenceHealth: string;
    humanInput: string;
    noMentor: string;
    cycleProgress: string;
    focusUnknown: string;
    noActiveCycle: string;
    activeCycle: string;
    cycleStep: string;
    action: string;
  };
  mentor: {
    panelTitle: string;
    backToPulse: string;
    recommendationStatus: string;
    savedStatus: string;
    bookedStatus: string;
    externalStatus: string;
    staleStatus: string;
    matchRationale: string;
    whyNow: string;
    expectedOutcomes: string;
    preparation: string;
    availability: string;
    decisionScope: string;
    bookSession: string;
    saveForLater: string;
    savedForLater: string;
    notSuitable: string;
    useOwnMentor: string;
    continueWithAi: string;
    compareAlternatives: string;
    alternativeStrength: string;
    alternativeTradeOff: string;
    sessionPreparation: string;
    preparationProgress: string;
    bookingConfirmed: string;
    bookingTime: string;
    sessionGoal: string;
    openSessionBrief: string;
    externalPreparation: string;
    refreshRecommendation: string;
    staleExplanation: string;
    dismissReasons: Record<MentorDismissReason, string>;
  };
  cycle: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Record<
      DecisionCycleStepId,
      { label: string; description: string }
    >;
    goal: string;
    chosenAction: string;
    expectedOutcome: string;
    primaryMetric: string;
    checklist: string;
    evidence: string;
    continue: string;
    submitEvidence: string;
    evidenceSubmitted: string;
    requestReview: string;
    reviewComplete: string;
    reviewing: string;
    completeChecklistHint: string;
    evidenceHint: string;
    completed: string;
    current: string;
    locked: string;
  };
  statuses: Record<EvidenceSignalStatus, string>;
  prompts: {
    explainBottleneck: string;
    challengeInterpretation: string;
    explainReadiness: string;
    recommendMentor: string;
  };
  longRun: {
    common: {
      close: string;
      cancel: string;
      save: string;
      edit: string;
      delete: string;
      retry: string;
      openSource: string;
      viewContext: string;
      askKizuna: string;
      pin: string;
      unpin: string;
      more: string;
    };
    sidebar: {
      backToProjects: string;
      newConversation: string;
      searchVenture: string;
      today: string;
      recent: string;
      older: string;
      decisionCycles: string;
      pinned: string;
      materials: string;
      network: string;
      conversationOptions: string;
      rename: string;
      deleteConversation: string;
      archive: string;
      noConversations: string;
      expand: string;
      collapse: string;
    };
    conversation: {
      scope: string;
      search: string;
      summarize: string;
      memory: string;
      timeline: string;
      noMatches: string;
      resultCount: (current: number, total: number) => string;
      previousMatch: string;
      nextMatch: string;
      closeSearch: string;
      loadOlder: string;
      topicDriftTitle: string;
      topicDriftDescription: string;
      splitTopic: string;
      continueHere: string;
      contextSources: string;
      draftSaved: string;
      categories: Record<ConversationCategory, string>;
    };
    search: {
      title: string;
      description: string;
      placeholder: string;
      empty: string;
      loading: string;
      failed: string;
      all: string;
      contentType: string;
      dateRange: string;
      decisionCycle: string;
      status: string;
      contributor: string;
      pinnedOnly: string;
      resultCount: (count: number) => string;
      types: Record<VentureSearchContentType, string>;
      groups: Record<VentureSearchContentType, string>;
      dates: {
        all: string;
        sevenDays: string;
        thirtyDays: string;
        older: string;
      };
      contributors: {
        all: string;
        founder: string;
        ai: string;
        mentor: string;
        system: string;
      };
      cycles: {
        onboarding: string;
        pricing: string;
      };
    };
    memory: {
      title: string;
      description: string;
      verified: string;
      assumptions: string;
      decisions: string;
      evidence: string;
      outcomes: string;
      disputed: string;
      outdated: string;
      sources: (count: number) => string;
      updated: string;
      relatedCycle: string;
      createdBy: string;
      confirm: string;
      dispute: string;
      markOutdated: string;
      viewHistory: string;
      freshnessWarning: string;
      updateValue: string;
      keepValue: string;
      noHistory: string;
      confirmUpdate: string;
      cancelUpdate: string;
      versionConflict: string;
      reloadContext: string;
      compareChanges: string;
      versionComparison: (
        expectedVersion: number,
        currentVersion: number,
      ) => string;
      creators: {
        founder: string;
        ai: string;
        mentor: string;
        system: string;
      };
      statuses: Record<VentureMemoryStatus, string>;
    };
    conflict: {
      title: string;
      description: string;
      setCurrent: string;
      futureDirection: string;
      parallelHypotheses: string;
      resolved: string;
      current: string;
      older: string;
      outdated: string;
    };
    summary: {
      title: string;
      description: string;
      confirm: string;
      updateMemory: string;
      skip: string;
      draft: string;
      confirmed: string;
      memoryUpdated: string;
      editItem: string;
      saved: string;
    };
    timeline: {
      title: string;
      description: string;
      compare: string;
      openCycle: string;
      openEvidence: string;
      readinessHistory: string;
      previousScore: string;
      nextScore: string;
      evidenceAdded: string;
      evidenceRemoved: string;
      rubric: string;
      rubricWarning: string;
      changeLabel: (delta: number) => string;
    };
    documents: {
      title: string;
      description: string;
      canonical: string;
      current: string;
      superseded: string;
      archived: string;
      compare: string;
      markCanonical: string;
      archive: string;
      delete: string;
      deleteTitle: string;
      deleteDescription: string;
      deleteAndMarkMissing: string;
      chooseReplacement: string;
      dependencyMemory: (count: number) => string;
      dependencyReadiness: (count: number) => string;
      dependencyCycles: (count: number) => string;
    };
    saved: {
      title: string;
      description: string;
      openOriginal: string;
      empty: string;
    };
    surfaces: {
      pulse: string;
      memory: string;
      summary: string;
      timeline: string;
      documents: string;
      pinned: string;
    };
  };
}
