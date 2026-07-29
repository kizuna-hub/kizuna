import { createCanonicalCampusFlowMentorBrief } from "../../../founder/ai-workspace/mentor-connection/public";
import type { WorkspaceStorage } from "../../../venture/core/infrastructure";

import {
  canonicalMentorPersona,
  createCampusFlowMentorRequest,
  createSecondaryMentorRequests,
} from "../demo/mentor-workspace-demo-data";
import type {
  AcceptMentorRequestInput,
  DeclineMentorRequestInput,
  MentorConnectionRequest,
  MentorContactMethod,
  MentorContactPreference,
  MentorRequestListInput,
  MentorWorkspaceRepository,
  MentorWorkspaceSnapshot,
  RequestMoreContextInput,
} from "../types/mentor-workspace.types";

const DEFAULT_LATENCY_MS = 180;
const MUTATION_LATENCY_MS = 360;
const ACCEPTED_AT = "2026-07-29T04:12:00.000Z";
const UPDATED_AT = "2026-07-29T04:11:00.000Z";

export class MentorWorkspaceRequestNotFoundError extends Error {
  constructor() {
    super("Không tìm thấy yêu cầu kết nối.");
    this.name = "MentorWorkspaceRequestNotFoundError";
  }
}

export class DuplicateMentorAcceptanceError extends Error {
  constructor() {
    super("Yêu cầu này đã được chấp nhận.");
    this.name = "DuplicateMentorAcceptanceError";
  }
}

export class MentorRequestUnavailableError extends Error {
  constructor() {
    super("Yêu cầu này không còn khả dụng.");
    this.name = "MentorRequestUnavailableError";
  }
}

export function validateMentorContact(
  method: MentorContactMethod,
  value?: string,
) {
  const normalized = value?.trim() ?? "";
  if (method === "mentor_will_contact") {
    return { valid: true, normalizedValue: undefined };
  }
  if (!normalized) {
    return {
      valid: false,
      message: "Vui lòng nhập thông tin liên hệ.",
    };
  }
  if (method === "email") {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    return valid
      ? { valid: true, normalizedValue: normalized }
      : { valid: false, message: "Email chưa đúng định dạng." };
  }
  if (method === "phone" || method === "zalo") {
    const digits = normalized.replace(/[^\d]/g, "");
    const valid = digits.length >= 9 && digits.length <= 12;
    return valid
      ? { valid: true, normalizedValue: normalized }
      : {
          valid: false,
          message:
            method === "zalo"
              ? "Số Zalo chưa đúng định dạng."
              : "Số điện thoại chưa đúng định dạng.",
        };
  }
  return normalized.length >= 3
    ? { valid: true, normalizedValue: normalized }
    : {
        valid: false,
        message: "Thông tin Messenger chưa đúng định dạng.",
      };
}

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function cloneRequest(request: MentorConnectionRequest) {
  return structuredClone(request);
}

function isSnapshot(value: unknown): value is MentorWorkspaceSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<MentorWorkspaceSnapshot>;
  return (
    Array.isArray(snapshot.requests) &&
    (snapshot.contactPreference === null ||
      typeof snapshot.contactPreference === "object" ||
      snapshot.contactPreference === undefined)
  );
}

function applyListInput(
  requests: MentorConnectionRequest[],
  input: MentorRequestListInput = {},
) {
  const filtered = requests.filter((request) => {
    switch (input.filter) {
      case "new":
        return request.status === "new";
      case "viewed":
        return request.status === "viewed";
      case "contacted":
        return (
          request.status === "accepted" ||
          request.status === "needs_more_context"
        );
      default:
        return request.status !== "cancelled";
    }
  });

  return filtered.sort((left, right) => {
    if (input.sort === "best_fit") {
      return right.fitScore - left.fitScore;
    }
    if (input.sort === "expiring") {
      return left.expiresAt.localeCompare(right.expiresAt);
    }
    return right.createdAt.localeCompare(left.createdAt);
  });
}

async function createSeedSnapshot(): Promise<MentorWorkspaceSnapshot> {
  const founderBrief = await createCanonicalCampusFlowMentorBrief();
  return {
    requests: [
      createCampusFlowMentorRequest(founderBrief),
      ...createSecondaryMentorRequests(),
    ],
    contactPreference: null,
  };
}

export function createMockMentorWorkspaceRepository({
  storage,
  latencyMs = DEFAULT_LATENCY_MS,
  mutationLatencyMs = MUTATION_LATENCY_MS,
}: {
  storage?: WorkspaceStorage;
  latencyMs?: number;
  mutationLatencyMs?: number;
} = {}): MentorWorkspaceRepository {
  let snapshotPromise: Promise<MentorWorkspaceSnapshot> | null = null;
  const acceptOperations = new Map<
    string,
    Promise<MentorConnectionRequest>
  >();

  async function loadSnapshot() {
    if (!snapshotPromise) {
      snapshotPromise = (async () => {
        const serialized = storage?.load();
        if (serialized) {
          try {
            const parsed: unknown = JSON.parse(serialized);
            if (isSnapshot(parsed)) {
              return {
                requests: parsed.requests.map(cloneRequest),
                contactPreference:
                  parsed.contactPreference ?? null,
              };
            }
          } catch {
            // Fall back to the deterministic seed.
          }
        }
        return createSeedSnapshot();
      })();
    }
    return snapshotPromise;
  }

  async function commit(next: MentorWorkspaceSnapshot) {
    const cloned = structuredClone(next);
    snapshotPromise = Promise.resolve(cloned);
    storage?.save(JSON.stringify(cloned));
    return cloned;
  }

  async function mutateRequest(
    requestId: string,
    update: (
      request: MentorConnectionRequest,
    ) => MentorConnectionRequest,
  ) {
    const current = await loadSnapshot();
    const index = current.requests.findIndex(
      (request) => request.id === requestId,
    );
    if (index < 0) {
      throw new MentorWorkspaceRequestNotFoundError();
    }
    const nextRequest = update(current.requests[index]);
    const nextRequests = current.requests.map((request, position) =>
      position === index ? nextRequest : request,
    );
    await commit({
      ...current,
      requests: nextRequests,
    });
    return cloneRequest(nextRequest);
  }

  return {
    async listRequests(input) {
      await wait(latencyMs);
      const snapshot = await loadSnapshot();
      return applyListInput(
        snapshot.requests.map(cloneRequest),
        input,
      );
    },

    async getRequest(requestId) {
      await wait(latencyMs);
      const snapshot = await loadSnapshot();
      const request = snapshot.requests.find(
        (item) => item.id === requestId,
      );
      return request ? cloneRequest(request) : null;
    },

    async markRequestViewed(requestId) {
      await wait(mutationLatencyMs);
      return mutateRequest(requestId, (request) => {
        if (request.status !== "new") return request;
        return {
          ...request,
          status: "viewed",
          viewedBriefVersion: request.briefVersion,
          updatedAt: UPDATED_AT,
        };
      });
    },

    async acceptRequest(input) {
      const active = acceptOperations.get(input.requestId);
      if (active) return active;

      const operation = (async () => {
        await wait(mutationLatencyMs);
        if (!input.message.trim()) {
          throw new Error("Lời nhắn không được để trống.");
        }
        if (input.message.length > 500) {
          throw new Error("Lời nhắn không được vượt quá 500 ký tự.");
        }
        const validation = validateMentorContact(
          input.contactMethod,
          input.contactValue,
        );
        if (!validation.valid) {
          throw new Error(validation.message);
        }

        const accepted = await mutateRequest(
          input.requestId,
          (request) => {
            if (request.status === "accepted" || request.acceptance) {
              throw new DuplicateMentorAcceptanceError();
            }
            if (
              request.status === "cancelled" ||
              request.status === "declined"
            ) {
              throw new MentorRequestUnavailableError();
            }
            return {
              ...request,
              status: "accepted",
              updatedAt: ACCEPTED_AT,
              viewedBriefVersion: request.briefVersion,
              acceptance: {
                id: `acceptance-${request.id}`,
                requestId: request.id,
                mentorId: input.mentorId,
                message: input.message.trim(),
                contactMethod: input.contactMethod,
                contactValue: validation.normalizedValue,
                meetingPreference: input.meetingPreference,
                acceptedAt: ACCEPTED_AT,
              },
            };
          },
        );

        if (input.saveAsDefault) {
          const current = await loadSnapshot();
          await commit({
            ...current,
            contactPreference: {
              preferredChannel: input.contactMethod,
              contactValue: validation.normalizedValue,
              defaultAcceptanceMessage: input.message.trim(),
            },
          });
        }
        return accepted;
      })();

      acceptOperations.set(input.requestId, operation);
      try {
        return await operation;
      } finally {
        acceptOperations.delete(input.requestId);
      }
    },

    async requestMoreContext(input) {
      await wait(mutationLatencyMs);
      if (input.selectedTopics.length === 0) {
        throw new Error("Chọn ít nhất một nội dung cần bổ sung.");
      }
      return mutateRequest(input.requestId, (request) => {
        if (request.status === "cancelled") {
          throw new MentorRequestUnavailableError();
        }
        if (request.status === "needs_more_context") {
          return request;
        }
        return {
          ...request,
          status: "needs_more_context",
          updatedAt: UPDATED_AT,
          moreContext: {
            selectedTopics: [...input.selectedTopics],
            note: input.note?.trim() || undefined,
            requestedAt: UPDATED_AT,
          },
        };
      });
    },

    async declineRequest(input) {
      await wait(mutationLatencyMs);
      return mutateRequest(input.requestId, (request) => {
        if (request.status === "cancelled") {
          throw new MentorRequestUnavailableError();
        }
        if (request.status === "declined") return request;
        if (request.status === "accepted") {
          throw new DuplicateMentorAcceptanceError();
        }
        return {
          ...request,
          status: "declined",
          updatedAt: UPDATED_AT,
          decline: {
            reason: input.reason,
            note: input.note?.trim() || undefined,
            declinedAt: UPDATED_AT,
          },
        };
      });
    },

    async listAcceptedConnections() {
      await wait(latencyMs);
      const snapshot = await loadSnapshot();
      return snapshot.requests
        .filter(
          (request) =>
            request.status === "accepted" &&
            Boolean(request.acceptance),
        )
        .sort((left, right) =>
          (right.acceptance?.acceptedAt ?? "").localeCompare(
            left.acceptance?.acceptedAt ?? "",
          ),
        )
        .map(cloneRequest);
    },

    async getContactPreference() {
      await wait(latencyMs);
      const snapshot = await loadSnapshot();
      return snapshot.contactPreference
        ? structuredClone(snapshot.contactPreference)
        : null;
    },

    async saveContactPreference(preference) {
      await wait(mutationLatencyMs);
      const validation = validateMentorContact(
        preference.preferredChannel,
        preference.contactValue,
      );
      if (!validation.valid) {
        throw new Error(validation.message);
      }
      const saved: MentorContactPreference = {
        ...structuredClone(preference),
        contactValue: validation.normalizedValue,
      };
      const current = await loadSnapshot();
      await commit({
        ...current,
        contactPreference: saved,
      });
      return saved;
    },
  };
}
