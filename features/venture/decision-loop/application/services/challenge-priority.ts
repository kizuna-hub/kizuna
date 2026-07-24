import type { ChallengeDimension } from "../../domain";

const dimensionWeight: Record<ChallengeDimension, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function calculateChallengePriority(input: {
  impact: ChallengeDimension;
  uncertainty: ChallengeDimension;
  urgency: ChallengeDimension;
  controllability: ChallengeDimension;
}) {
  return (
    dimensionWeight[input.impact] * 4 +
    dimensionWeight[input.uncertainty] * 3 +
    dimensionWeight[input.urgency] * 2 +
    dimensionWeight[input.controllability]
  );
}

