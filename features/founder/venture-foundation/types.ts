/**
 * @deprecated Import venture contracts from "@/features/venture/core" and
 * Decision Loop contracts from "@/features/venture/decision-loop".
 */
export * from "../../venture/core";
export * from "../../venture/decision-loop/domain";
export type {
  VentureWorkspaceState as DemoWorkspaceState,
} from "../../venture/decision-loop/application/model/venture-workspace-state";
