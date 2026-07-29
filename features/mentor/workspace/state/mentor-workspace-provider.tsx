"use client";

import * as React from "react";

import { createBrowserWorkspaceStorage } from "@/features/venture/core/infrastructure";

import { createMockMentorWorkspaceRepository } from "../services/mentor-workspace-repository";
import type {
  AcceptMentorRequestInput,
  DeclineMentorRequestInput,
  MentorConnectionRequest,
  MentorContactPreference,
  MentorRequestFilter,
  MentorRequestSort,
  RequestMoreContextInput,
} from "../types/mentor-workspace.types";

const MENTOR_WORKSPACE_STORAGE_KEY =
  "kizuna:mentor-workspace:mvp:v1";

interface MentorWorkspaceContextValue {
  requests: MentorConnectionRequest[];
  contactPreference: MentorContactPreference | null;
  loading: boolean;
  mutationPending: boolean;
  error: string | null;
  filter: MentorRequestFilter;
  sort: MentorRequestSort;
  setFilter: (filter: MentorRequestFilter) => void;
  setSort: (sort: MentorRequestSort) => void;
  refresh: () => Promise<void>;
  getRequest: (
    requestId: string,
  ) => MentorConnectionRequest | undefined;
  markViewed: (requestId: string) => Promise<void>;
  accept: (
    input: AcceptMentorRequestInput,
  ) => Promise<MentorConnectionRequest>;
  requestMoreContext: (
    input: RequestMoreContextInput,
  ) => Promise<MentorConnectionRequest>;
  decline: (
    input: DeclineMentorRequestInput,
  ) => Promise<MentorConnectionRequest>;
  saveContactPreference: (
    preference: MentorContactPreference,
  ) => Promise<MentorContactPreference>;
}

const MentorWorkspaceContext =
  React.createContext<MentorWorkspaceContextValue | null>(null);

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export function MentorWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [requests, setRequests] = React.useState<
    MentorConnectionRequest[]
  >([]);
  const [contactPreference, setContactPreference] =
    React.useState<MentorContactPreference | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [mutationPending, setMutationPending] =
    React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] =
    React.useState<MentorRequestFilter>("all");
  const [sort, setSort] =
    React.useState<MentorRequestSort>("newest");

  const repository = React.useMemo(() => {
    const storage = createBrowserWorkspaceStorage({
      currentKey: MENTOR_WORKSPACE_STORAGE_KEY,
      getStorage: () => window.localStorage,
    });
    return createMockMentorWorkspaceRepository({ storage });
  }, []);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextRequests, nextPreference] =
        await Promise.all([
          repository.listRequests(),
          repository.getContactPreference(),
        ]);
      setRequests(nextRequests);
      setContactPreference(nextPreference);
    } catch (nextError) {
      setError(getErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  }, [repository]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const replaceRequest = React.useCallback(
    (nextRequest: MentorConnectionRequest) => {
      setRequests((current) =>
        current.map((request) =>
          request.id === nextRequest.id
            ? nextRequest
            : request,
        ),
      );
    },
    [],
  );

  const markViewed = React.useCallback(
    async (requestId: string) => {
      const current = requests.find(
        (request) => request.id === requestId,
      );
      if (!current || current.status !== "new") return;
      const nextRequest =
        await repository.markRequestViewed(requestId);
      replaceRequest(nextRequest);
    },
    [replaceRequest, repository, requests],
  );

  const runMutation = React.useCallback(
    async (
      operation: () => Promise<MentorConnectionRequest>,
    ) => {
      setMutationPending(true);
      setError(null);
      try {
        const nextRequest = await operation();
        replaceRequest(nextRequest);
        return nextRequest;
      } catch (nextError) {
        setError(getErrorMessage(nextError));
        throw nextError;
      } finally {
        setMutationPending(false);
      }
    },
    [replaceRequest],
  );

  const accept = React.useCallback(
    (input: AcceptMentorRequestInput) =>
      runMutation(() => repository.acceptRequest(input)),
    [repository, runMutation],
  );

  const requestMoreContext = React.useCallback(
    (input: RequestMoreContextInput) =>
      runMutation(() =>
        repository.requestMoreContext(input),
      ),
    [repository, runMutation],
  );

  const decline = React.useCallback(
    (input: DeclineMentorRequestInput) =>
      runMutation(() => repository.declineRequest(input)),
    [repository, runMutation],
  );

  const saveContactPreference = React.useCallback(
    async (preference: MentorContactPreference) => {
      setMutationPending(true);
      setError(null);
      try {
        const saved =
          await repository.saveContactPreference(preference);
        setContactPreference(saved);
        return saved;
      } catch (nextError) {
        setError(getErrorMessage(nextError));
        throw nextError;
      } finally {
        setMutationPending(false);
      }
    },
    [repository],
  );

  const getRequest = React.useCallback(
    (requestId: string) =>
      requests.find((request) => request.id === requestId),
    [requests],
  );

  const value =
    React.useMemo<MentorWorkspaceContextValue>(
      () => ({
        requests,
        contactPreference,
        loading,
        mutationPending,
        error,
        filter,
        sort,
        setFilter,
        setSort,
        refresh,
        getRequest,
        markViewed,
        accept,
        requestMoreContext,
        decline,
        saveContactPreference,
      }),
      [
        accept,
        contactPreference,
        decline,
        error,
        filter,
        getRequest,
        loading,
        markViewed,
        mutationPending,
        refresh,
        requestMoreContext,
        requests,
        saveContactPreference,
        sort,
      ],
    );

  return (
    <MentorWorkspaceContext.Provider value={value}>
      {children}
    </MentorWorkspaceContext.Provider>
  );
}

export function useMentorWorkspace() {
  const context = React.useContext(MentorWorkspaceContext);
  if (!context) {
    throw new Error(
      "useMentorWorkspace must be used within MentorWorkspaceProvider",
    );
  }
  return context;
}
