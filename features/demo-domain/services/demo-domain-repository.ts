import {
  createDemoDomainSeed,
  DEMO_DOMAIN_CHANNEL_NAME,
  DEMO_DOMAIN_STORAGE_KEY,
} from "../seed/demo-domain-seed";
import { seedAcceptedMentorshipJourneys } from "../seed/mentorship-continuity-seed";
import type {
  ConnectionBriefSnapshot,
  DemoDomainConnectionRequest,
  DemoDomainEvidence,
  DemoDomainMentorAcceptance,
  DemoDomainRepository,
  DemoDomainState,
  DemoDomainVenture,
  DemoDomainDocument,
} from "../types/demo-domain.types";
import { createMentorshipContinuityRepositoryMethods } from "./mentorship-continuity-repository";

const REQUEST_ID = "request-campusflow";
const ACCEPTED_AT = "2026-07-30T03:20:00.000Z";

export class DuplicateDemoConnectionRequestError extends Error {
  constructor() {
    super("Yêu cầu kết nối này đã được gửi.");
    this.name = "DuplicateDemoConnectionRequestError";
  }
}

export class DemoConnectionRequestNotFoundError extends Error {
  constructor() {
    super("Không tìm thấy yêu cầu kết nối.");
    this.name = "DemoConnectionRequestNotFoundError";
  }
}

function isLegacyState(
  value: unknown,
): value is Omit<
  DemoDomainState,
  | "version"
  | "mentorshipJourneys"
  | "mentorshipCheckpoints"
  | "mentorshipEvidence"
  | "mentorshipPreReads"
> & { version: 1 | 2 } {
  if (!value || typeof value !== "object") return false;
  const state = value as Record<string, unknown>;
  return (
    (state.version === 1 || state.version === 2) &&
    typeof state.revision === "number" &&
    Array.isArray(state.users) &&
    Array.isArray(state.founderProfiles) &&
    Array.isArray(state.mentorProfiles) &&
    Array.isArray(state.ventures) &&
    Array.isArray(state.documents) &&
    Array.isArray(state.evidence) &&
    Array.isArray(state.connectionRequests)
  );
}

export function parseDemoDomainState(
  serialized: string | null,
): DemoDomainState {
  if (!serialized) return createDemoDomainSeed();
  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!isLegacyState(parsed)) return createDemoDomainSeed();
    const candidate = parsed as Partial<DemoDomainState>;
    return {
      ...structuredClone(parsed),
      version: 2,
      mentorshipJourneys: Array.isArray(
        candidate.mentorshipJourneys,
      )
        ? structuredClone(candidate.mentorshipJourneys)
        : [],
      mentorshipCheckpoints: Array.isArray(
        candidate.mentorshipCheckpoints,
      )
        ? structuredClone(candidate.mentorshipCheckpoints)
        : [],
      mentorshipEvidence: Array.isArray(
        candidate.mentorshipEvidence,
      )
        ? structuredClone(candidate.mentorshipEvidence)
        : [],
      mentorshipPreReads: Array.isArray(
        candidate.mentorshipPreReads,
      )
        ? structuredClone(candidate.mentorshipPreReads)
        : [],
    };
  } catch {
    return createDemoDomainSeed();
  }
}

export function resetDemoDomainStorage(
  storage: Pick<Storage, "removeItem">,
) {
  storage.removeItem(DEMO_DOMAIN_STORAGE_KEY);
}

function upsertById<T extends { id: string }>(
  current: T[],
  additions: T[],
) {
  const ids = new Set(additions.map((item) => item.id));
  return [
    ...current.filter((item) => !ids.has(item.id)),
    ...structuredClone(additions),
  ];
}

export interface CampusFlowDomainBootstrap {
  venture: DemoDomainVenture;
  documents: DemoDomainDocument[];
  evidence: DemoDomainEvidence[];
}

export function serializeCampusFlowDomainBootstrap(
  serialized: string | null,
  bootstrap: CampusFlowDomainBootstrap,
) {
  const current = parseDemoDomainState(serialized);
  const next: DemoDomainState = {
    ...current,
    revision: current.revision + 1,
    ventures: upsertById(current.ventures, [bootstrap.venture]),
    documents: upsertById(
      current.documents,
      bootstrap.documents,
    ),
    evidence: upsertById(current.evidence, bootstrap.evidence),
    updatedAt: bootstrap.venture.updatedAt,
  };
  return JSON.stringify(next);
}

export function createBrowserDemoDomainRepository({
  storage: providedStorage,
  enableCrossContextSync,
}: {
  storage?: Storage;
  enableCrossContextSync?: boolean;
} = {}): DemoDomainRepository {
  const browserAvailable = typeof window !== "undefined";
  const broadcastEnabled =
    enableCrossContextSync ?? browserAvailable;
  const memory = new Map<string, string>();
  const memoryStorage: Storage = {
    get length() {
      return memory.size;
    },
    clear: () => memory.clear(),
    getItem: (key) => memory.get(key) ?? null,
    key: (index) => [...memory.keys()][index] ?? null,
    removeItem: (key) => {
      memory.delete(key);
    },
    setItem: (key, value) => {
      memory.set(key, value);
    },
  };
  const storage =
    providedStorage ??
    (browserAvailable ? window.localStorage : memoryStorage);
  let state = parseDemoDomainState(
    storage.getItem(DEMO_DOMAIN_STORAGE_KEY),
  );
  const seededState = seedAcceptedMentorshipJourneys(state);
  if (seededState !== state) {
    state = {
      ...seededState,
      revision: state.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    storage.setItem(DEMO_DOMAIN_STORAGE_KEY, JSON.stringify(state));
  }
  const listeners = new Set<(next: DemoDomainState) => void>();
  const channel =
    !broadcastEnabled ||
    typeof BroadcastChannel === "undefined"
      ? null
      : new BroadcastChannel(DEMO_DOMAIN_CHANNEL_NAME);

  const emit = () => {
    const snapshot = structuredClone(state);
    listeners.forEach((listener) => listener(snapshot));
  };

  const readLatest = () => {
    const latest = parseDemoDomainState(
      storage.getItem(DEMO_DOMAIN_STORAGE_KEY),
    );
    if (latest.revision >= state.revision) {
      state = latest;
    }
    return state;
  };

  const commit = (next: DemoDomainState) => {
    const latest = readLatest();
    state = {
      ...structuredClone(next),
      version: 2,
      revision: latest.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    storage.setItem(
      DEMO_DOMAIN_STORAGE_KEY,
      JSON.stringify(state),
    );
    channel?.postMessage({ revision: state.revision });
    emit();
    return structuredClone(state);
  };

  const refreshFromStorage = () => {
    const previousRevision = state.revision;
    readLatest();
    if (state.revision > previousRevision) emit();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === DEMO_DOMAIN_STORAGE_KEY) {
      refreshFromStorage();
    }
  };
  const handleChannel = () => refreshFromStorage();
  if (browserAvailable) {
    window.addEventListener("storage", handleStorage);
  }
  channel?.addEventListener("message", handleChannel);

  const getRequest = (requestId: string) => {
    const request = readLatest().connectionRequests.find(
      (item) => item.id === requestId,
    );
    if (!request) throw new DemoConnectionRequestNotFoundError();
    return request;
  };

  const mentorshipMethods =
    createMentorshipContinuityRepositoryMethods({
      readLatest,
      commit,
    });

  return {
    getSnapshot() {
      return structuredClone(readLatest());
    },

    bootstrapCampusFlow(venture, documents, evidence) {
      const current = readLatest();
      return commit({
        ...current,
        ventures: upsertById(current.ventures, [venture]),
        documents: upsertById(current.documents, documents),
        evidence: upsertById(current.evidence, evidence),
      });
    },

    recordCanonicalQuestion(ventureId, questionId) {
      const current = readLatest();
      const venture = current.ventures.find(
        (item) => item.id === ventureId,
      );
      if (
        !venture ||
        venture.canonicalQuestionIds.includes(questionId)
      ) {
        return structuredClone(current);
      }
      return commit({
        ...current,
        ventures: current.ventures.map((item) =>
          item.id === ventureId
            ? {
                ...item,
                canonicalQuestionIds: [
                  ...item.canonicalQuestionIds,
                  questionId,
                ],
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      });
    },

    createConnectionRequest(brief) {
      const current = readLatest();
      const existing = current.connectionRequests.find(
        (request) =>
          request.ventureId === brief.venture.id &&
          request.mentorId === brief.mentor.id,
      );
      if (existing) throw new DuplicateDemoConnectionRequestError();
      const request: DemoDomainConnectionRequest = {
        id: REQUEST_ID,
        founderId: brief.founder.id,
        ventureId: brief.venture.id,
        mentorId: brief.mentor.id,
        status: "pending",
        briefSnapshot: structuredClone(brief),
        createdAt: brief.capturedAt,
        updatedAt: brief.capturedAt,
      };
      commit({
        ...current,
        connectionRequests: [
          ...current.connectionRequests,
          request,
        ],
      });
      return structuredClone(request);
    },

    markRequestViewed(requestId) {
      const request = getRequest(requestId);
      if (request.status !== "pending") {
        return structuredClone(request);
      }
      const viewed: DemoDomainConnectionRequest = {
        ...request,
        status: "viewed",
        viewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const current = readLatest();
      commit({
        ...current,
        connectionRequests: current.connectionRequests.map((item) =>
          item.id === requestId ? viewed : item,
        ),
      });
      return structuredClone(viewed);
    },

    updateRequestStatus(requestId, status) {
      const request = getRequest(requestId);
      if (request.status === "accepted") {
        return structuredClone(request);
      }
      const updated: DemoDomainConnectionRequest = {
        ...request,
        status,
        updatedAt: new Date().toISOString(),
      };
      const current = readLatest();
      commit({
        ...current,
        connectionRequests: current.connectionRequests.map((item) =>
          item.id === requestId ? updated : item,
        ),
      });
      return structuredClone(updated);
    },

    acceptRequest(requestId, input) {
      const request = getRequest(requestId);
      if (request.status === "accepted" && request.acceptance) {
        return structuredClone(request);
      }
      const acceptance: DemoDomainMentorAcceptance = {
        ...structuredClone(input),
        id: `acceptance-${requestId}`,
        requestId,
        mentorId: request.mentorId,
        acceptedAt: ACCEPTED_AT,
      };
      const accepted: DemoDomainConnectionRequest = {
        ...request,
        status: "accepted",
        acceptance,
        updatedAt: ACCEPTED_AT,
      };
      const current = readLatest();
      commit(
        seedAcceptedMentorshipJourneys({
        ...current,
        connectionRequests: current.connectionRequests.map((item) =>
          item.id === requestId ? accepted : item,
        ),
        }),
      );
      return structuredClone(accepted);
    },

    ...mentorshipMethods,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    destroy() {
      if (browserAvailable) {
        window.removeEventListener("storage", handleStorage);
      }
      channel?.removeEventListener("message", handleChannel);
      channel?.close();
      listeners.clear();
    },
  };
}

export type {
  ConnectionBriefSnapshot,
  DemoDomainConnectionRequest,
  DemoDomainEvidence,
  DemoDomainVenture,
  DemoDomainDocument,
};
