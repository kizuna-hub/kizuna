import {
  DuplicateMentorConnectionError,
  MentorConnectionDeliveryError,
} from "./mentor-connection-repository";
import type {
  MentorConnectionBrief,
  MentorConnectionRepository,
  MentorConnectionRequest,
} from "../types/mentor-connection.types";

const SAVE_LATENCY_MS = 260;
const SEND_LATENCY_MS = 720;
const SENT_AT = "2026-07-29T03:16:00.000Z";

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function key(ventureId: string, mentorId: string) {
  return `${ventureId}:${mentorId}`;
}

export function createMockMentorConnectionRepository(options: {
  getDraft?: (
    ventureId: string,
    mentorId: string,
  ) => MentorConnectionBrief | undefined;
  getRequest?: (
    ventureId: string,
    mentorId: string,
  ) => MentorConnectionRequest | undefined;
  onSaveDraft?: (brief: MentorConnectionBrief) => void;
  onSendRequest?: (request: MentorConnectionRequest) => void;
  saveLatencyMs?: number;
  sendLatencyMs?: number;
  failSave?: boolean;
  failSend?: boolean;
} = {}): MentorConnectionRepository {
  const drafts = new Map<string, MentorConnectionBrief>();
  const requests = new Map<string, MentorConnectionRequest>();
  const inFlight = new Map<
    string,
    Promise<MentorConnectionRequest>
  >();

  return {
    async getDraft(ventureId, mentorId) {
      return (
        options.getDraft?.(ventureId, mentorId) ??
        drafts.get(key(ventureId, mentorId)) ??
        null
      );
    },

    async saveDraft(brief) {
      await wait(options.saveLatencyMs ?? SAVE_LATENCY_MS);
      if (options.failSave) {
        throw new Error("Chưa thể lưu nháp.");
      }
      const saved = {
        ...structuredClone(brief),
        status: "draft" as const,
        savedAt: SENT_AT,
        updatedAt: SENT_AT,
        errorMessage: undefined,
      };
      drafts.set(key(brief.ventureId, brief.mentorId), saved);
      options.onSaveDraft?.(saved);
      return saved;
    },

    async sendRequest({ brief }) {
      const requestKey = key(brief.ventureId, brief.mentorId);
      const existing =
        options.getRequest?.(brief.ventureId, brief.mentorId) ??
        requests.get(requestKey);
      if (existing) {
        throw new DuplicateMentorConnectionError();
      }
      const active = inFlight.get(requestKey);
      if (active) return active;

      const operation = (async () => {
        await wait(options.sendLatencyMs ?? SEND_LATENCY_MS);
        if (options.failSend) {
          throw new MentorConnectionDeliveryError();
        }
        const request: MentorConnectionRequest = {
          id: `mentor-request:${requestKey}`,
          ventureId: brief.ventureId,
          mentorId: brief.mentorId,
          brief: {
            ...structuredClone(brief),
            status: "sent",
            updatedAt: SENT_AT,
          },
          status: "pending",
          sentAt: SENT_AT,
        };
        requests.set(requestKey, request);
        options.onSendRequest?.(request);
        return request;
      })();

      inFlight.set(requestKey, operation);
      try {
        return await operation;
      } finally {
        inFlight.delete(requestKey);
      }
    },

    async getExistingRequest(ventureId, mentorId) {
      return (
        options.getRequest?.(ventureId, mentorId) ??
        requests.get(key(ventureId, mentorId)) ??
        null
      );
    },
  };
}

