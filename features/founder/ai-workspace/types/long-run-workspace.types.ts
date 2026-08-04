import type {
  AiWorkspaceMessage,
  MockAttachment,
} from "./ai-workspace.types";
import type {
  ConversationContextSnapshot,
  FounderConversationSessionType,
  MentorConversationSource,
} from "../conversation-history/types/conversation-session.types";

export type ConversationCategory =
  | "general"
  | "material_analysis"
  | "decision_cycle"
  | "readiness_review"
  | "mentor_preparation"
  | "opportunity_review";

export type ConversationSummaryStatus =
  | "none"
  | "draft"
  | "confirmed"
  | "memory_updated";

export interface ConversationSession {
  id: string;
  ventureId: string;
  title: string;
  category: ConversationCategory;
  relatedDecisionCycleId?: string;
  relatedMaterialIds?: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  summaryStatus: ConversationSummaryStatus;
  unreadUpdateCount?: number;
  historyType?: FounderConversationSessionType;
  preview?: string;
  mentorIds?: string[];
  sourceIds?: string[];
  contextSnapshot?: ConversationContextSnapshot;
}

export type VentureMemoryStatus =
  | "verified"
  | "inferred"
  | "assumed"
  | "disputed"
  | "missing"
  | "outdated"
  | "superseded";

export type VentureMemoryType =
  | "fact"
  | "assumption"
  | "decision"
  | "action"
  | "evidence"
  | "outcome"
  | "mentor_advice"
  | "opportunity";

export type VentureMemoryCreator =
  | "founder"
  | "ai"
  | "mentor"
  | "system";

export interface VentureMemoryHistoryEntry {
  id: string;
  status: VentureMemoryStatus;
  value: string;
  actor: string;
  createdAt: string;
  reason: string;
}

export interface VentureMemoryItem {
  id: string;
  ventureId: string;
  type: VentureMemoryType;
  status: VentureMemoryStatus;
  title: string;
  summary: string;
  sourceIds: string[];
  createdAt: string;
  updatedAt: string;
  observedAt?: string;
  validUntil?: string;
  supersededById?: string;
  relatedDecisionCycleId?: string;
  createdBy: VentureMemoryCreator;
  history: VentureMemoryHistoryEntry[];
}

export type VentureSearchContentType =
  | "decision"
  | "evidence"
  | "conversation"
  | "document"
  | "mentor_session"
  | "readiness"
  | "memory"
  | "opportunity"
  | "report";

export interface VentureSearchFilters {
  contentType: VentureSearchContentType | "all";
  dateRange: "all" | "7_days" | "30_days" | "older";
  decisionCycleId: string | "all";
  status: VentureMemoryStatus | "all";
  contributor: "all" | "founder" | "ai" | "mentor" | "system";
  pinnedOnly: boolean;
}

export interface VentureSearchInput {
  ventureId: string;
  query: string;
  filters: VentureSearchFilters;
}

export interface VentureSearchResult {
  id: string;
  ventureId: string;
  contentType: VentureSearchContentType;
  title: string;
  snippet: string;
  searchText: string;
  createdAt: string;
  sourceLabel: string;
  contributor: "founder" | "ai" | "mentor" | "system";
  status?: VentureMemoryStatus;
  relatedDecisionCycleId?: string;
  conversationId?: string;
  messageId?: string;
  sourceId: string;
  isPinned: boolean;
}

export interface VentureSearchService {
  search(
    input: VentureSearchInput,
  ): Promise<VentureSearchResult[]>;
}

export type TimelineEventType =
  | "context_confirmed"
  | "assumption_created"
  | "assumption_disputed"
  | "decision_confirmed"
  | "action_started"
  | "evidence_submitted"
  | "evidence_verified"
  | "readiness_changed"
  | "mentor_session_completed"
  | "opportunity_applied"
  | "context_superseded";

export interface TimelineEvent {
  id: string;
  ventureId: string;
  type: TimelineEventType;
  title: string;
  createdAt: string;
  actor: string;
  reason: string;
  sourceIds: string[];
  relatedDecisionCycleId?: string;
  readinessChangeId?: string;
}

export interface ReadinessDimensionChange {
  id: string;
  label: string;
  previousScore: number;
  nextScore: number;
  reason: string;
}

export interface ReadinessChange {
  id: string;
  ventureId: string;
  previousScore: number;
  nextScore: number;
  dimensionChanges: ReadinessDimensionChange[];
  evidenceAddedIds: string[];
  evidenceRemovedIds: string[];
  reason: string;
  rubricVersion: string;
  createdAt: string;
}

export type PinnedItemType =
  | "message"
  | "recommendation"
  | "decision"
  | "evidence"
  | "document"
  | "mentor_advice"
  | "search_result";

export interface PinnedItemReference {
  id: string;
  ventureId: string;
  itemType: PinnedItemType;
  sourceId: string;
  title: string;
  sourceLabel: string;
  createdAt: string;
}

export type MaterialVersionStatus =
  | "canonical"
  | "current"
  | "superseded"
  | "archived";

export interface MaterialDependencySummary {
  memoryItems: number;
  readinessDimensions: number;
  activeDecisionCycles: number;
}

export interface MaterialVersion {
  id: string;
  ventureId: string;
  familyId: string;
  name: string;
  versionLabel: string;
  createdAt: string;
  status: MaterialVersionStatus;
  summary: string;
  comparisonNotes: string[];
  dependencies: MaterialDependencySummary;
}

export interface SessionSummarySection {
  id: string;
  label: string;
  items: string[];
}

export interface SessionSummary {
  id: string;
  ventureId: string;
  conversationId: string;
  status: ConversationSummaryStatus;
  createdAt: string;
  updatedAt: string;
  sections: SessionSummarySection[];
  proposedMemoryItemIds: string[];
}

export interface ContextConflictValue {
  id: string;
  value: string;
  sourceId: string;
  sourceLabel: string;
  observedAt: string;
  status: VentureMemoryStatus;
  freshness: "current" | "older" | "outdated";
}

export interface ContextConflict {
  id: string;
  ventureId: string;
  title: string;
  description: string;
  values: ContextConflictValue[];
  status: "open" | "resolved";
  resolvedValueId?: string;
}

export interface ScopedAiRequest {
  requestId: string;
  ventureId: string;
  conversationId: string;
  stateVersion: number;
  surface: "main" | "panel";
}

export interface ContextAssemblyInput {
  ventureId: string;
  conversationId: string;
  query: string;
  selectedSourceIds: string[];
}

export interface ContextAssemblyResult {
  recentMessages: AiWorkspaceMessage[];
  confirmedMemory: VentureMemoryItem[];
  assumptions: VentureMemoryItem[];
  evidence: VentureMemoryItem[];
  selectedDocuments: MaterialVersion[];
  historicalSummary?: SessionSummary;
  excludedItems: Array<{
    id: string;
    reason: "outdated" | "unrelated" | "different_venture";
  }>;
  humanReadableSources: string[];
}

export interface LongRunWorkspaceState {
  ventureId: string;
  stateVersion: number;
  sessions: ConversationSession[];
  activeConversationId: string;
  lastConversationId: string;
  messagesByConversation: Record<string, AiWorkspaceMessage[]>;
  draftsByConversation: Record<string, string>;
  attachmentsByConversation: Record<string, MockAttachment[]>;
  visibleMessageCountByConversation: Record<string, number>;
  scrollTopByConversation: Record<string, number>;
  memory: VentureMemoryItem[];
  timeline: TimelineEvent[];
  readinessHistory: ReadinessChange[];
  pinnedItems: PinnedItemReference[];
  materialVersions: MaterialVersion[];
  summaries: SessionSummary[];
  conflicts: ContextConflict[];
  conversationSources: MentorConversationSource[];
}

export type LongRunWorkspaceAction =
  | { type: "hydrate"; state: LongRunWorkspaceState }
  | { type: "select-conversation"; conversationId: string }
  | {
      type: "create-conversation";
      session: ConversationSession;
      messages: AiWorkspaceMessage[];
      activate?: boolean;
    }
  | {
      type: "rename-conversation";
      conversationId: string;
      title: string;
    }
  | { type: "delete-conversation"; conversationId: string }
  | { type: "toggle-conversation-pin"; conversationId: string }
  | { type: "archive-conversation"; conversationId: string }
  | {
      type: "set-draft";
      conversationId: string;
      draft: string;
    }
  | {
      type: "sync-messages";
      conversationId: string;
      messages: AiWorkspaceMessage[];
    }
  | {
      type: "set-attachments";
      conversationId: string;
      attachments: MockAttachment[];
    }
  | { type: "load-older"; conversationId: string }
  | {
      type: "reveal-message";
      conversationId: string;
      messageId: string;
    }
  | {
      type: "save-scroll";
      conversationId: string;
      scrollTop: number;
    }
  | {
      type: "toggle-pin";
      item: PinnedItemReference;
    }
  | {
      type: "set-memory-status";
      memoryId: string;
      status: VentureMemoryStatus;
      reason: string;
    }
  | {
      type: "resolve-conflict";
      conflictId: string;
      resolution:
        | "set_current"
        | "future_direction"
        | "parallel_hypotheses";
      valueId: string;
    }
  | {
      type: "edit-summary-item";
      summaryId: string;
      sectionId: string;
      itemIndex: number;
      value: string;
    }
  | {
      type: "set-summary-status";
      summaryId: string;
      status: ConversationSummaryStatus;
    }
  | {
      type: "set-material-status";
      materialId: string;
      status: MaterialVersionStatus;
    }
  | {
      type: "remove-material";
      materialId: string;
    }
  | {
      type: "append-readiness-change";
      change: ReadinessChange;
    };
