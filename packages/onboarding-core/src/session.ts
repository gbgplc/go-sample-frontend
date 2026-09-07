'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  ErrorEnvelope,
  Interaction,
  OnboardingError,
  OnboardingTransport,
  RecordResponse,
  StagePlanEntry,
} from './types';

/**
 * The seven-state machine from "Market onboarding applications — front-end
 * handoff", section 3. `submitting` and `starting` are transient network
 * states; every screen kind renders during `collecting` or `processing`.
 */
export type SessionPhase = 'idle' | 'starting' | 'collecting' | 'submitting' | 'processing' | 'decided' | 'failed';

export interface SessionState {
  phase: SessionPhase;
  sessionId?: string;
  interaction?: Interaction | null;
  record?: RecordResponse;
  /** The rail for the resolved path so far — held separately from `interaction`
   *  so it survives into `decided`, once there's no interaction left to read it from. */
  stagePlan?: StagePlanEntry[];
  error?: ErrorEnvelope;
  fieldErrors?: Record<string, string>;
}

type Action =
  | { type: 'START' }
  | { type: 'STARTED'; sessionId: string; interaction: Interaction | null }
  | { type: 'SUBMITTING' }
  | { type: 'ADVANCED'; interaction: Interaction | null }
  | { type: 'DECIDED'; record: RecordResponse; stagePlan?: StagePlanEntry[] }
  | { type: 'FAILED'; error: ErrorEnvelope }
  | { type: 'VALIDATION_FAILED'; error: ErrorEnvelope };

function phaseFor(interaction: Interaction | null): SessionPhase {
  return interaction?.kind === 'processing' ? 'processing' : 'collecting';
}

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'START':
      return { phase: 'starting' };
    case 'STARTED':
      return {
        phase: phaseFor(action.interaction),
        sessionId: action.sessionId,
        interaction: action.interaction,
        stagePlan: action.interaction?.stagePlan,
      };
    case 'SUBMITTING':
      return { ...state, phase: 'submitting', error: undefined, fieldErrors: undefined };
    case 'ADVANCED':
      return {
        ...state,
        phase: phaseFor(action.interaction),
        interaction: action.interaction,
        stagePlan: action.interaction?.stagePlan,
      };
    case 'DECIDED':
      return { ...state, phase: 'decided', record: action.record, stagePlan: action.stagePlan ?? state.stagePlan };
    case 'FAILED':
      return { ...state, phase: 'failed', error: action.error };
    case 'VALIDATION_FAILED':
      return { ...state, phase: 'collecting', error: action.error, fieldErrors: action.error.fields };
    default:
      return state;
  }
}

function toEnvelope(e: unknown): ErrorEnvelope {
  if (e instanceof OnboardingError) return e.envelope;
  return {
    code: 'UPSTREAM_UNAVAILABLE',
    http: 0,
    message: 'Something went wrong on our end. Try again shortly.',
    retryable: true,
  };
}

export interface UseOnboardingSession extends SessionState {
  /** Submit the current interaction's data and advance. Empty object for screens with nothing to collect. */
  submit: (data?: Record<string, unknown>) => Promise<void>;
  /** Begin a fresh session from idle — used after a failure or an explicit restart. */
  restart: () => void;
  /** Start a deferred journey (see the `deferStart` argument). No-op otherwise. */
  begin: () => void;
}

export function useOnboardingSession(
  transport: OnboardingTransport,
  prefill?: Record<string, unknown>,
  /**
   * Hold in `idle` until {@link UseOnboardingSession.begin} is called, instead
   * of starting a journey on mount.
   *
   * Starting on mount means every page view creates a journey instance,
   * including the ones where somebody opens the link, reads the first
   * paragraph and closes the tab. Deferring lets an app show its own welcome
   * first and only reach the platform when the customer commits.
   */
  deferStart = false
): UseOnboardingSession {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle' });
  const startedRef = useRef(false);

  const start = useCallback(async () => {
    dispatch({ type: 'START' });
    try {
      const res = await transport.startSession(prefill);
      dispatch({ type: 'STARTED', sessionId: res.sessionId, interaction: res.interaction });
    } catch (e) {
      dispatch({ type: 'FAILED', error: toEnvelope(e) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transport]);

  useEffect(() => {
    if (deferStart || startedRef.current) return;
    startedRef.current = true;
    start();
  }, [start, deferStart]);

  /** Start the journey from a deferred `idle`. A no-op once one is running. */
  const begin = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    start();
  }, [start]);

  const submit = useCallback(
    async (data: Record<string, unknown> = {}) => {
      if (!state.sessionId || !state.interaction) return;
      dispatch({ type: 'SUBMITTING' });
      try {
        const res = await transport.submitInteraction(state.sessionId, state.interaction.interactionId, data);
        if (res.status === 'Completed') {
          const record = await transport.getRecord(state.sessionId);
          dispatch({ type: 'DECIDED', record, stagePlan: res.interaction?.stagePlan });
        } else {
          dispatch({ type: 'ADVANCED', interaction: res.interaction });
        }
      } catch (e) {
        const envelope = toEnvelope(e);
        if (envelope.code === 'VALIDATION_FAILED') {
          dispatch({ type: 'VALIDATION_FAILED', error: envelope });
        } else {
          dispatch({ type: 'FAILED', error: envelope });
        }
      }
    },
    [transport, state.sessionId, state.interaction]
  );

  const restart = useCallback(() => {
    // Stays true: a restart starts a journey immediately, so leaving it false
    // would let the deferred-start effect fire a second one behind it.
    startedRef.current = true;
    start();
  }, [start]);

  return { ...state, submit, restart, begin };
}
