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

  /**
   * While the journey is processing, ask the platform whether it has settled
   * rather than guessing.
   *
   * A `processing` interaction means Go is running modules, and only Go knows
   * when that is done — measured at about three seconds against the demo
   * tenant, but that is a sample of one journey on one day, not a guarantee.
   * So this polls `getState` every second until the status leaves
   * `InProgress`, then fetches the record and lands on the decision.
   *
   * Note that a *failed* journey is also terminal. Go reports an abandoned
   * journey as `Error`, the service maps that to `Completed` carrying a
   * `fail` decision, and it arrives here as an ordinary settle — which is
   * what stops the customer waiting on a spinner for a journey that will
   * never advance. The GBG docs are explicit that an abandoned journey is not
   * retryable: starting again is the only way forward, which is what the
   * result screen's CTA does.
   */
  useEffect(() => {
    if (state.phase !== 'processing' || !state.sessionId) return;
    const sessionId = state.sessionId;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await transport.getState(sessionId);
        if (cancelled) return;
        if (res.status !== 'InProgress') {
          const record = await transport.getRecord(sessionId);
          if (!cancelled) dispatch({ type: 'DECIDED', record });
        }
      } catch (e) {
        // A single failed poll is not a failed journey — the next tick
        // retries. Only a hard transport error ends it.
        const envelope = toEnvelope(e);
        if (!cancelled && !envelope.retryable) dispatch({ type: 'FAILED', error: envelope });
      }
    };

    poll();
    const timer = setInterval(poll, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [state.phase, state.sessionId, transport]);

  return { ...state, submit, restart, begin };
}
