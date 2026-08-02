export type VentureStage =
  | "Idea"
  | "Prototype"
  | "Pilot"
  | "Launched";

export type AttentionStatus =
  | "Cần hỗ trợ"
  | "Rủi ro cao"
  | "Theo dõi"
  | "Đang tốt";

export type ReadinessLevel = "Low" | "Medium" | "High";

export type VentureMark =
  | "leaf"
  | "graduation"
  | "shield"
  | "sprout"
  | "heart"
  | "building"
  | "map"
  | "air";

export interface UniversityVenture {
  id: string;
  name: string;
  description: string;
  founder: {
    name: string;
    subtitle: string;
    initials: string;
    tone: string;
  };
  stage: VentureStage;
  readiness: number;
  readinessLevel: ReadinessLevel;
  blocker: string;
  lastActivityDate: string;
  lastActivity: string;
  mentor: {
    name: string;
    avatar: string;
  } | null;
  attention: AttentionStatus;
  mark: VentureMark;
  tone: string;
}

export interface ReportSection {
  id: string;
  label: string;
  description: string;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  cadence: string;
  tone: "blue" | "green" | "orange" | "purple";
}
