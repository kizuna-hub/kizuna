import type {
  BaselineField,
  VentureSource,
} from "../../../domain";
import type { ConfidenceLevel } from "../../../../core";

export function baselineField(
  value: string,
  sourceIds: string[],
  options: {
    confidence?: ConfidenceLevel;
    status?: BaselineField["status"];
    confirmed?: boolean;
    confirmedAt?: string;
  } = {},
): BaselineField {
  return {
    value,
    sourceIds,
    confidence: options.confidence ?? "developing",
    status:
      options.status ??
      (value ? "needs-review" : "missing"),
    lastConfirmedAt: options.confirmedAt,
    founderConfirmed: options.confirmed ?? false,
  };
}
