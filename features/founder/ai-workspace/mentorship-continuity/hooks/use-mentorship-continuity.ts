"use client";

import React from "react";

import { trackProductEvent } from "@/features/demo-domain/services/product-analytics";
import type {
  DemoDomainRepository,
  DemoDomainState,
} from "@/features/demo-domain/types/demo-domain.types";
import type {
  CreateMentorshipCheckpointInput,
  UpdateMentorshipCheckpointResultInput,
  UpsertMentorshipPreReadInput,
} from "@/features/demo-domain/types/mentorship-continuity.types";

import type {
  WorkspaceLayoutAction,
  WorkspaceLayoutState,
} from "../../types/workspace-layout.types";
import { buildMentorshipPreReadContent } from "../services/mentorship-pre-read-builder";

export function useMentorshipContinuity({
  ventureId,
  domainState,
  repositoryRef,
  layout,
  dispatchLayout,
  setDomainState,
}: {
  ventureId: string;
  domainState: DemoDomainState | null;
  repositoryRef: React.MutableRefObject<DemoDomainRepository | null>;
  layout: WorkspaceLayoutState;
  dispatchLayout: React.Dispatch<WorkspaceLayoutAction>;
  setDomainState: React.Dispatch<
    React.SetStateAction<DemoDomainState | null>
  >;
}) {
  const canonicalMentorConnection = React.useMemo(
    () =>
      domainState?.connectionRequests.find(
        (request) => request.ventureId === ventureId,
      ),
    [domainState, ventureId],
  );
  const acceptedMentorConnection =
    canonicalMentorConnection?.status === "accepted" &&
    canonicalMentorConnection.acceptance
      ? canonicalMentorConnection
      : undefined;
  const mentorshipJourney = React.useMemo(
    () =>
      domainState?.mentorshipJourneys.find(
        (journey) => journey.ventureId === ventureId,
      ),
    [domainState, ventureId],
  );
  const mentorshipCheckpoints = React.useMemo(
    () =>
      (domainState?.mentorshipCheckpoints ?? [])
        .filter((checkpoint) => checkpoint.ventureId === ventureId)
        .sort((a, b) => b.sequence - a.sequence),
    [domainState, ventureId],
  );
  const activeMentorshipCheckpoint =
    mentorshipCheckpoints.find(
      (checkpoint) =>
        checkpoint.id === mentorshipJourney?.activeCheckpointId,
    ) ?? mentorshipCheckpoints[0];
  const selectedMentorshipCheckpoint =
    mentorshipCheckpoints.find(
      (checkpoint) => checkpoint.id === layout.selectedCheckpointId,
    ) ?? activeMentorshipCheckpoint;
  const mentorshipEvidence = React.useMemo(
    () =>
      (domainState?.mentorshipEvidence ?? []).filter(
        (evidence) =>
          evidence.checkpointId === selectedMentorshipCheckpoint?.id,
      ),
    [domainState, selectedMentorshipCheckpoint?.id],
  );
  const mentorshipPreRead = React.useMemo(
    () =>
      domainState?.mentorshipPreReads.find(
        (preRead) =>
          preRead.checkpointId === selectedMentorshipCheckpoint?.id,
      ),
    [domainState, selectedMentorshipCheckpoint?.id],
  );

  const getRepository = React.useCallback(() => {
    const repository = repositoryRef.current;
    if (!repository) {
      throw new Error("Hành trình đồng hành chưa sẵn sàng.");
    }
    return repository;
  }, [repositoryRef]);
  const refresh = React.useCallback(
    (repository: DemoDomainRepository) =>
      setDomainState(repository.getSnapshot()),
    [setDomainState],
  );
  const openMentorshipCheckpointCapture = React.useCallback(() => {
    dispatchLayout({
      type: "open-mentorship-panel",
      mode: "checkpoint_capture",
    });
    trackProductEvent("mentorship_checkpoint_capture_opened", {
      ventureId,
      mentorId: mentorshipJourney?.mentorId ?? "unknown",
      connectionRequestId:
        mentorshipJourney?.connectionRequestId ?? "unknown",
    });
  }, [dispatchLayout, mentorshipJourney, ventureId]);
  const openMentorshipResultUpdate = React.useCallback(
    (checkpointId: string) => {
      dispatchLayout({
        type: "open-mentorship-panel",
        mode: "checkpoint_update",
        checkpointId,
      });
      trackProductEvent("mentorship_result_update_opened", {
        ventureId,
        checkpointId,
      });
    },
    [dispatchLayout, ventureId],
  );
  const openMentorshipCheckpointDetail = React.useCallback(
    (checkpointId: string) => {
      dispatchLayout({
        type: "open-mentorship-panel",
        mode: "checkpoint_detail",
        checkpointId,
      });
      trackProductEvent("mentorship_checkpoint_history_opened", {
        ventureId,
        checkpointId,
      });
    },
    [dispatchLayout, ventureId],
  );
  const openMentorshipPreRead = React.useCallback(
    (checkpointId: string) => {
      const repository = getRepository();
      const checkpoint = repository.getMentorshipCheckpoint(checkpointId);
      if (!checkpoint) return;
      if (!repository.getMentorshipPreRead(checkpointId)) {
        repository.createOrUpdateMentorshipPreRead({
          checkpointId,
          ...buildMentorshipPreReadContent(checkpoint),
        });
        refresh(repository);
      }
      dispatchLayout({
        type: "open-mentorship-panel",
        mode: "pre_read",
        checkpointId,
      });
      trackProductEvent("mentorship_pre_read_opened", {
        ventureId,
        checkpointId,
      });
    },
    [dispatchLayout, getRepository, refresh, ventureId],
  );
  const createMentorshipCheckpoint = React.useCallback(
    (input: CreateMentorshipCheckpointInput) => {
      const repository = getRepository();
      const checkpoint = repository.createMentorshipCheckpoint(input);
      refresh(repository);
      trackProductEvent("mentorship_checkpoint_saved", {
        ventureId,
        mentorId: checkpoint.mentorId,
        checkpointId: checkpoint.id,
        connectionRequestId: checkpoint.connectionRequestId,
      });
      return checkpoint;
    },
    [getRepository, refresh, ventureId],
  );
  const updateMentorshipCheckpointResult = React.useCallback(
    (input: UpdateMentorshipCheckpointResultInput) => {
      const repository = getRepository();
      const checkpoint =
        repository.updateMentorshipCheckpointResult(input);
      refresh(repository);
      trackProductEvent("mentorship_result_saved", {
        ventureId,
        mentorId: checkpoint.mentorId,
        checkpointId: checkpoint.id,
        status: input.executionStatus,
        evidenceCount: checkpoint.evidenceIds.length,
      });
      if (checkpoint.evidenceIds.length > 0) {
        trackProductEvent("mentorship_evidence_attached", {
          ventureId,
          checkpointId: checkpoint.id,
          evidenceCount: checkpoint.evidenceIds.length,
        });
      }
      return checkpoint;
    },
    [getRepository, refresh, ventureId],
  );
  const saveMentorshipPreRead = React.useCallback(
    (input: UpsertMentorshipPreReadInput) => {
      const repository = getRepository();
      const preRead = repository.createOrUpdateMentorshipPreRead(input);
      refresh(repository);
      trackProductEvent("mentorship_pre_read_saved", {
        ventureId,
        mentorId: preRead.mentorId,
        checkpointId: preRead.checkpointId,
        status: preRead.status,
      });
      return preRead;
    },
    [getRepository, refresh, ventureId],
  );
  const sendMentorshipPreRead = React.useCallback(
    (preReadId: string) => {
      const repository = getRepository();
      const preRead = repository.sendMentorshipPreRead(preReadId);
      refresh(repository);
      trackProductEvent("mentorship_pre_read_sent", {
        ventureId,
        mentorId: preRead.mentorId,
        checkpointId: preRead.checkpointId,
        status: preRead.status,
      });
      return preRead;
    },
    [getRepository, refresh, ventureId],
  );

  return {
    canonicalMentorConnection,
    acceptedMentorConnection,
    mentorshipJourney,
    mentorshipCheckpoints,
    activeMentorshipCheckpoint,
    selectedMentorshipCheckpoint,
    mentorshipEvidence,
    mentorshipPreRead,
    openMentorshipCheckpointCapture,
    openMentorshipResultUpdate,
    openMentorshipCheckpointDetail,
    openMentorshipPreRead,
    createMentorshipCheckpoint,
    updateMentorshipCheckpointResult,
    saveMentorshipPreRead,
    sendMentorshipPreRead,
  };
}
