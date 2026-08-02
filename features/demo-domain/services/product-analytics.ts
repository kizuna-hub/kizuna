export type ProductEventName =
  | "demo_founder_logged_in"
  | "demo_mentor_logged_in"
  | "venture_created"
  | "analysis_completed"
  | "workspace_opened"
  | "founder_question_asked"
  | "readiness_question_asked"
  | "mentor_recommendations_viewed"
  | "mentor_fit_opened"
  | "connection_brief_opened"
  | "connection_request_sent"
  | "mentor_request_opened"
  | "mentor_request_accepted"
  | "founder_acceptance_viewed";

export interface ProductEvent {
  name: ProductEventName;
  occurredAt: string;
  properties?: Record<string, string | number | boolean>;
}

export interface ProductAnalytics {
  track(event: ProductEvent): void;
}

const demoEvents: ProductEvent[] = [];

export const productAnalytics: ProductAnalytics = {
  track(event) {
    demoEvents.push(structuredClone(event));
  },
};

export function trackProductEvent(
  name: ProductEventName,
  properties?: ProductEvent["properties"],
) {
  productAnalytics.track({
    name,
    occurredAt: new Date().toISOString(),
    properties,
  });
}

export function getTrackedProductEvents() {
  return structuredClone(demoEvents);
}

export function resetTrackedProductEvents() {
  demoEvents.splice(0, demoEvents.length);
}
