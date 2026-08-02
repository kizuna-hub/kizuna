import {
  mentorConnectionFunnel,
  mentorConnectionRequests,
  mentorSupplyGaps,
} from "../data/mentor-connection-mock-data";
import { isPendingMentorConnection } from "../model/mentor-connection-selectors";

export function listMentorConnectionRequests() {
  return structuredClone(mentorConnectionRequests);
}

export function getMentorConnectionRequest(id: string) {
  return structuredClone(
    mentorConnectionRequests.find((request) => request.id === id) ??
      null,
  );
}

export function getMentorConnectionDashboard() {
  const requests = listMentorConnectionRequests();

  return {
    requests,
    funnel: structuredClone(mentorConnectionFunnel),
    supplyGaps: structuredClone(mentorSupplyGaps),
    metrics: {
      sent: 26,
      opened: 21,
      accepted: 12,
      medianResponseHours: 18.4,
      pendingOver72Hours: requests.filter(
        (request) =>
          request.waitingHours > 72 &&
          isPendingMentorConnection(request),
      ).length,
    },
  };
}
