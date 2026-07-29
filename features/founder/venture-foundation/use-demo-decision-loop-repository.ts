"use client";

import React from "react";

import type { DecisionLoopRepository } from "@/features/venture/decision-loop/application/ports/decision-loop-repository";
import { createMockDecisionLoopRepository } from "@/features/venture/decision-loop/infrastructure/mock/mock-decision-loop-repository";

import { useDemoWorkspace } from "./demo-workspace-provider";

export function useDemoDecisionLoopRepository() {
  const { state, replaceDemoState } = useDemoWorkspace();
  const stateRef = React.useRef(state);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return React.useMemo<DecisionLoopRepository>(
    () =>
      createMockDecisionLoopRepository({
        read: () => stateRef.current,
        commit: (nextState) => {
          stateRef.current = nextState;
          replaceDemoState(nextState);
        },
      }),
    [replaceDemoState],
  );
}
