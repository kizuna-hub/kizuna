import type { DemoDomainState } from "../types/demo-domain.types";

export const DEMO_DOMAIN_STORAGE_KEY = "kizuna:demo-domain:v1";
export const DEMO_DOMAIN_CHANNEL_NAME =
  "kizuna:demo-domain:v1:updates";

export function createDemoDomainSeed(): DemoDomainState {
  return {
    version: 2,
    revision: 0,
    users: [
      {
        id: "founder-nguyen-tuan-ngoc",
        name: "Nguyễn Tuấn Ngọc",
        email: "founder@demo.kizuna.vn",
        role: "founder",
      },
      {
        id: "mentor-tran-minh-quan",
        name: "Trần Minh Quân",
        email: "mentor@demo.kizuna.vn",
        role: "mentor",
      },
    ],
    founderProfiles: [
      {
        id: "profile-founder-nguyen-tuan-ngoc",
        userId: "founder-nguyen-tuan-ngoc",
        displayName: "Nguyễn Tuấn Ngọc",
        title: "Founder",
      },
    ],
    mentorProfiles: [
      {
        id: "mentor-tran-minh-quan",
        userId: "mentor-tran-minh-quan",
        displayName: "Trần Minh Quân",
        role: "Product Lead",
        organization: "VNPay",
        expertise: [
          "Product validation",
          "Pilot design",
          "Community products",
          "Student startups",
        ],
      },
    ],
    documents: [],
    evidence: [],
    ventures: [],
    connectionRequests: [],
    mentorshipJourneys: [],
    mentorshipCheckpoints: [],
    mentorshipEvidence: [],
    mentorshipPreReads: [],
    updatedAt: "2026-07-30T00:00:00.000Z",
  };
}
