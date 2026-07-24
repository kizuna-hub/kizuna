import type { BaselineFieldKey } from "../domain";

export const baselineFieldLabels: Record<BaselineFieldKey, string> = {
  problem: "Problem",
  customer: "Customer",
  buyer: "Buyer",
  solution: "Solution",
  stage: "Current stage",
  businessModel: "Business model",
  evidenceSummary: "Evidence summary",
  currentGoal: "Current goal",
  supportSummary: "Existing support",
  programSummary: "Program context",
  openAssumptions: "Open assumptions",
};

export const baselineFieldKeys = Object.keys(
  baselineFieldLabels,
) as BaselineFieldKey[];

