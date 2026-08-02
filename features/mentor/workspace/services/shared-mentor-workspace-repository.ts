import type {
  DemoDomainConnectionRequest,
  DemoDomainRepository,
} from "@/features/demo-domain/types/demo-domain.types";

import {
  validateMentorContact,
} from "./mentor-workspace-repository";
import type {
  AcceptMentorRequestInput,
  MentorConnectionRequest,
  MentorContactPreference,
  MentorRequestListInput,
  MentorWorkspaceRepository,
} from "../types/mentor-workspace.types";

function toMentorRequest(
  request: DemoDomainConnectionRequest,
): MentorConnectionRequest {
  const snapshot = request.briefSnapshot;
  return {
    id: request.id,
    founder: {
      id: snapshot.founder.id,
      name: snapshot.founder.name,
      institution: snapshot.founder.institution,
    },
    venture: {
      id: snapshot.venture.id,
      name: snapshot.venture.name,
      stage: snapshot.venture.stage,
      teamSummary: snapshot.venture.teamSummary,
      productSummary: snapshot.venture.productSummary,
      tags: [...snapshot.venture.tags],
    },
    brief: {
      currentChallenge: snapshot.currentChallenge,
      supportNeeded: [...snapshot.supportNeeded],
      expectedOutcome: snapshot.expectedOutcome,
      founderMessage: snapshot.founderMessage,
      founderConfirmed: true,
    },
    evidence: structuredClone(snapshot.evidence),
    sharedDocuments: structuredClone(snapshot.sharedDocuments),
    status:
      request.status === "pending" ? "new" : request.status,
    fitScore: snapshot.mentor.fitScore,
    expiresAt: "2026-08-10T16:59:00.000Z",
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    briefVersion: 1,
    viewedBriefVersion:
      request.status === "pending" ? undefined : 1,
    acceptance: request.acceptance
      ? structuredClone(request.acceptance)
      : undefined,
  };
}

function applyListInput(
  requests: MentorConnectionRequest[],
  input: MentorRequestListInput = {},
) {
  return requests
    .filter((request) => {
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
    })
    .sort((left, right) => {
      if (input.sort === "best_fit") {
        return right.fitScore - left.fitScore;
      }
      if (input.sort === "expiring") {
        return left.expiresAt.localeCompare(right.expiresAt);
      }
      return right.createdAt.localeCompare(left.createdAt);
    });
}

export function createSharedMentorWorkspaceRepository({
  domain,
}: {
  domain: DemoDomainRepository;
}): MentorWorkspaceRepository {
  let contactPreference: MentorContactPreference | null = null;
  const inFlight = new Map<
    string,
    Promise<MentorConnectionRequest>
  >();

  const get = (requestId: string) => {
    const request = domain
      .getSnapshot()
      .connectionRequests.find((item) => item.id === requestId);
    return request ? toMentorRequest(request) : null;
  };

  return {
    async listRequests(input) {
      return applyListInput(
        domain
          .getSnapshot()
          .connectionRequests.map(toMentorRequest),
        input,
      );
    },

    async getRequest(requestId) {
      return get(requestId);
    },

    async markRequestViewed(requestId) {
      return toMentorRequest(domain.markRequestViewed(requestId));
    },

    async acceptRequest(input: AcceptMentorRequestInput) {
      const active = inFlight.get(input.requestId);
      if (active) return active;
      const operation = (async () => {
        const message = input.message.trim();
        if (!message || message.length > 500) {
          throw new Error(
            "Lời nhắn phải có từ 1 đến 500 ký tự.",
          );
        }
        const validation = validateMentorContact(
          input.contactMethod,
          input.contactValue,
        );
        if (!validation.valid) {
          throw new Error(validation.message);
        }
        const accepted = domain.acceptRequest(input.requestId, {
          message,
          contactMethod: input.contactMethod,
          contactValue: validation.normalizedValue,
          meetingPreference: input.meetingPreference,
        });
        if (input.saveAsDefault) {
          contactPreference = {
            preferredChannel: input.contactMethod,
            contactValue: validation.normalizedValue,
            defaultAcceptanceMessage: message,
          };
        }
        return toMentorRequest(accepted);
      })();
      inFlight.set(input.requestId, operation);
      try {
        return await operation;
      } finally {
        inFlight.delete(input.requestId);
      }
    },

    async requestMoreContext(input) {
      if (input.selectedTopics.length === 0) {
        throw new Error("Chọn ít nhất một nội dung cần bổ sung.");
      }
      return toMentorRequest(
        domain.updateRequestStatus(
          input.requestId,
          "needs_more_context",
        ),
      );
    },

    async declineRequest(input) {
      return toMentorRequest(
        domain.updateRequestStatus(input.requestId, "declined"),
      );
    },

    async listAcceptedConnections() {
      return domain
        .getSnapshot()
        .connectionRequests.filter(
          (request) =>
            request.status === "accepted" &&
            Boolean(request.acceptance),
        )
        .map(toMentorRequest);
    },

    async getContactPreference() {
      return contactPreference
        ? structuredClone(contactPreference)
        : null;
    },

    async saveContactPreference(preference) {
      const validation = validateMentorContact(
        preference.preferredChannel,
        preference.contactValue,
      );
      if (!validation.valid) {
        throw new Error(validation.message);
      }
      contactPreference = {
        ...structuredClone(preference),
        contactValue: validation.normalizedValue,
      };
      return structuredClone(contactPreference);
    },
  };
}
