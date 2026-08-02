import type {
  MentorConnectionRepository,
  SendMentorConnectionRequestInput,
} from "../types/mentor-connection.types";

export type {
  MentorConnectionRepository,
  SendMentorConnectionRequestInput,
};

export class DuplicateMentorConnectionError extends Error {
  constructor() {
    super("Bạn đã gửi yêu cầu tới mentor này.");
    this.name = "DuplicateMentorConnectionError";
  }
}

export class MentorConnectionDeliveryError extends Error {
  constructor() {
    super("Chưa thể gửi yêu cầu lúc này.");
    this.name = "MentorConnectionDeliveryError";
  }
}
