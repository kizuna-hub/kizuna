"use client";

import React from "react";

import { createBrowserWorkspaceStorage } from "@/features/venture/core/infrastructure";
import type { DecisionLoopRepository } from "@/features/venture/decision-loop";
import { createMockDecisionLoopRepository } from "@/features/venture/decision-loop/infrastructure";

import {
  archiveDemoVenture as archiveDemoVentureState,
  confirmDemoVentureSetup as confirmDemoVentureSetupState,
  createDemoVenture as createDemoVentureState,
  deleteDemoVenture as deleteDemoVentureState,
  duplicateDemoVenture as duplicateDemoVentureState,
  renameDemoVenture as renameDemoVentureState,
  resetDemoState as createResetState,
  restoreDemoState as parseRestoredState,
  serializeDemoWorkspaceState,
  setActiveVenture as setActiveVentureState,
  setLastVisitedVenturePath as setLastVisitedVenturePathState,
  updateDemoVentureSetup as updateDemoVentureSetupState,
  type UpdateVentureSetupInput,
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
  updateVentureSetup: (
    ventureId: VentureId,
    input: UpdateVentureSetupInput,
  ) => void;
  confirmVentureSetup: (ventureId: VentureId) => boolean;
  archiveDemoVenture: (ventureId: VentureId) => void;
  duplicateDemoVenture: (ventureId: VentureId) => VentureId | undefined;
  renameDemoVenture: (
    ventureId: VentureId,
    name: string,
  ) => void;
  deleteDemoVenture: (ventureId: VentureId) => void;
  replaceDemoState: (state: DemoWorkspaceState) => void;
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
      const currentState = stateRef.current;
      const nextState = setActiveVentureState(
        currentState,
        ventureId,
      );
      if (nextState === currentState) return;
      stateRef.current = nextState;
      setState(nextState);
    },
    [],
  );

  const setLastVisitedVenturePath = React.useCallback(
    (ventureId: VentureId, path: string) => {
      const currentState = stateRef.current;
      const nextState = setLastVisitedVenturePathState(
        currentState,
        ventureId,
        path,
      );
      if (nextState === currentState) return;
      stateRef.current = nextState;
      setState(nextState);
    },
    [],
  );

  const createDemoVenture = React.useCallback(
    (input: CreateDemoVentureInput) => {
      const result = createDemoVentureState(
        stateRef.current,
        input,
      );
      stateRef.current = result.state;
      setState(result.state);
      return result.ventureId;
    },
    [],
  );

  const updateVentureSetup = React.useCallback(
    (
      ventureId: VentureId,
      input: UpdateVentureSetupInput,
    ) => {
      const nextState = updateDemoVentureSetupState(
        stateRef.current,
        ventureId,
        input,
      );
      stateRef.current = nextState;
      setState(nextState);
    },
    [],
  );

  const confirmVentureSetup = React.useCallback(
    (ventureId: VentureId) => {
      const result = confirmDemoVentureSetupState(
        stateRef.current,
        ventureId,
      );
      stateRef.current = result.state;
      setState(result.state);
      return result.confirmed;
    },
    [],
  );

  const archiveDemoVenture = React.useCallback(
    (ventureId: VentureId) => {
      setState((current) =>
        archiveDemoVentureState(current, ventureId),
      );
    },
    [],
  );

  const duplicateDemoVenture = React.useCallback(
    (ventureId: VentureId) => {
      const result = duplicateDemoVentureState(
        stateRef.current,
        ventureId,
      );
      stateRef.current = result.state;
      setState(result.state);
      return result.ventureId;
    },
    [],
  );

  const renameDemoVenture = React.useCallback(
    (ventureId: VentureId, name: string) => {
      const nextState = renameDemoVentureState(
        stateRef.current,
        ventureId,
        name,
      );
      stateRef.current = nextState;
      setState(nextState);
    },
    [],
  );

  const deleteDemoVenture = React.useCallback(
    (ventureId: VentureId) => {
      const nextState = deleteDemoVentureState(
        stateRef.current,
        ventureId,
      );
      stateRef.current = nextState;
      setState(nextState);
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

  const replaceDemoState = React.useCallback(
    (nextState: DemoWorkspaceState) => {
      stateRef.current = nextState;
      setState(nextState);
    },
    [],
  );

  const updateUiPreferences = React.useCallback(
    (preferences: Partial<WorkspaceUiPreferences>) => {
      const current = stateRef.current;
      const nextState = {
        ...current,
        uiPreferences: {
          ...current.uiPreferences,
          ...preferences,
        },
      };
      stateRef.current = nextState;
      setState(nextState);
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
      updateVentureSetup,
      confirmVentureSetup,
      archiveDemoVenture,
      duplicateDemoVenture,
      renameDemoVenture,
      deleteDemoVenture,
      replaceDemoState,
      restoreDemoState,
      resetDemoState,
      updateUiPreferences,
      decisionLoopRepository,
    }),
    [
      archiveDemoVenture,
      deleteDemoVenture,
      duplicateDemoVenture,
      createDemoVenture,
      confirmVentureSetup,
      decisionLoopRepository,
      hydrated,
      resetDemoState,
      renameDemoVenture,
      restoreDemoState,
      replaceDemoState,
      setActiveVenture,
      setLastVisitedVenturePath,
      state,
      updateVentureSetup,
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
