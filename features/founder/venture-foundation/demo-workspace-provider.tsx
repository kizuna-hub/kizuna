"use client";

import React from "react";

import { createBrowserWorkspaceStorage } from "@/features/venture/core/infrastructure";
import type { DecisionLoopRepository } from "@/features/venture/decision-loop";
import { createMockDecisionLoopRepository } from "@/features/venture/decision-loop/infrastructure";

import {
  archiveDemoVenture as archiveDemoVentureState,
  createDemoVenture as createDemoVentureState,
  resetDemoState as createResetState,
  restoreDemoState as parseRestoredState,
  serializeDemoWorkspaceState,
  setActiveVenture as setActiveVentureState,
  setLastVisitedVenturePath as setLastVisitedVenturePathState,
} from "./demo-repository";
import {
  createDemoWorkspaceSeed,
  DEMO_WORKSPACE_STORAGE_KEY,
  LEGACY_DEMO_WORKSPACE_STORAGE_KEY,
} from "./demo-seed";
import type {
  CreateDemoVentureInput,
  DemoWorkspaceState,
  VentureId,
  WorkspaceUiPreferences,
} from "./types";

type DemoWorkspaceContextValue = {
  state: DemoWorkspaceState;
  hydrated: boolean;
  setActiveVenture: (ventureId: VentureId) => void;
  setLastVisitedVenturePath: (
    ventureId: VentureId,
    path: string,
  ) => void;
  createDemoVenture: (
    input: CreateDemoVentureInput,
  ) => VentureId;
  archiveDemoVenture: (ventureId: VentureId) => void;
  restoreDemoState: () => void;
  resetDemoState: () => void;
  updateUiPreferences: (
    preferences: Partial<WorkspaceUiPreferences>,
  ) => void;
  decisionLoopRepository: DecisionLoopRepository;
};

const DemoWorkspaceContext =
  React.createContext<DemoWorkspaceContextValue | null>(null);

export function DemoWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<DemoWorkspaceState>(
    createDemoWorkspaceSeed,
  );
  const stateRef = React.useRef(state);
  const [hydrated, setHydrated] = React.useState(false);
  const workspaceStorage = React.useMemo(
    () =>
      createBrowserWorkspaceStorage({
        currentKey: DEMO_WORKSPACE_STORAGE_KEY,
        legacyKeys: [LEGACY_DEMO_WORKSPACE_STORAGE_KEY],
        getStorage: () => window.localStorage,
      }),
    [],
  );
  const decisionLoopRepository =
    React.useMemo<DecisionLoopRepository>(
      () =>
        createMockDecisionLoopRepository({
          read: () => stateRef.current,
          commit: (nextState) => {
            stateRef.current = nextState;
            setState(nextState);
          },
        }),
      [],
    );

  React.useEffect(() => {
    const stored = workspaceStorage.load();
    setState(parseRestoredState(stored));
    setHydrated(true);
  }, [workspaceStorage]);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  React.useEffect(() => {
    if (!hydrated) return;
    workspaceStorage.save(serializeDemoWorkspaceState(state));
  }, [hydrated, state, workspaceStorage]);

  const setActiveVenture = React.useCallback(
    (ventureId: VentureId) => {
      setState((current) =>
        setActiveVentureState(current, ventureId),
      );
    },
    [],
  );

  const setLastVisitedVenturePath = React.useCallback(
    (ventureId: VentureId, path: string) => {
      setState((current) =>
        setLastVisitedVenturePathState(
          current,
          ventureId,
          path,
        ),
      );
    },
    [],
  );

  const createDemoVenture = React.useCallback(
    (input: CreateDemoVentureInput) => {
      const result = createDemoVentureState(state, input);
      setState(result.state);
      return result.ventureId;
    },
    [state],
  );

  const archiveDemoVenture = React.useCallback(
    (ventureId: VentureId) => {
      setState((current) =>
        archiveDemoVentureState(current, ventureId),
      );
    },
    [],
  );

  const restoreDemoState = React.useCallback(() => {
    const stored = workspaceStorage.load();
    setState(parseRestoredState(stored));
  }, [workspaceStorage]);

  const resetDemoState = React.useCallback(() => {
    workspaceStorage.clear();
    setState(createResetState());
  }, [workspaceStorage]);

  const updateUiPreferences = React.useCallback(
    (preferences: Partial<WorkspaceUiPreferences>) => {
      setState((current) => ({
        ...current,
        uiPreferences: {
          ...current.uiPreferences,
          ...preferences,
        },
      }));
    },
    [],
  );

  const value = React.useMemo<DemoWorkspaceContextValue>(
    () => ({
      state,
      hydrated,
      setActiveVenture,
      setLastVisitedVenturePath,
      createDemoVenture,
      archiveDemoVenture,
      restoreDemoState,
      resetDemoState,
      updateUiPreferences,
      decisionLoopRepository,
    }),
    [
      archiveDemoVenture,
      createDemoVenture,
      decisionLoopRepository,
      hydrated,
      resetDemoState,
      restoreDemoState,
      setActiveVenture,
      setLastVisitedVenturePath,
      state,
      updateUiPreferences,
    ],
  );

  return (
    <DemoWorkspaceContext.Provider value={value}>
      {children}
    </DemoWorkspaceContext.Provider>
  );
}

export function useDemoWorkspace() {
  const context = React.useContext(DemoWorkspaceContext);
  if (!context) {
    throw new Error(
      "useDemoWorkspace must be used within DemoWorkspaceProvider",
    );
  }
  return context;
}
