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

/**
 * How long the processing screen waits for a decision before giving up.
 *
 * Generous against how long a healthy journey takes — a live Northbank run
 * settles in a few seconds, and the screen already says "this is taking
 * longer than usual" at eight — so reaching this is a journey that has
 * stopped advancing, not a slow one. Long enough that a genuinely slow
 * module chain is never cut off; short enough that a deadlocked journey does
 * not hold someone on a spinner for the rest of the afternoon.
 */
const PROCESSING_TIMEOUT_MS = 90_000;

/**
 * Where the current journey's session id is kept across a page reload.
 *
 * The session cookie already survives a reload — it is HttpOnly and set by
 * the service — but every endpoint is addressed by session id in the path,
 * and that id lives only in React state. So a refresh loses the journey and
 * starts a new one: work re-entered from scratch, and a decision already
 * reached is replaced by a fresh instance's.
 *
 * sessionStorage rather than localStorage: a journey belongs to the tab it
 * was started in, and should not be resumed in a different one or after the
 * browser has been closed. Both the id and the cookie have to agree for a
 * resume to work, so a stale id from a previous visit fails cleanly as an
 * expired session rather than reading somebody else's journey.
 */
const SESSION_KEY = 'gbg-onboarding-session-id';

function rememberSession(sessionId: string): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
  } catch {
    // Private browsing, blocked storage: resume is a convenience, and a
    // journey that cannot be resumed still runs.
  }
}

function recallSession(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function forgetSession(): void {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // As above.
  }
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
      rememberSession(res.sessionId);
      dispatch({ type: 'STARTED', sessionId: res.sessionId, interaction: res.interaction });
    } catch (e) {
      dispatch({ type: 'FAILED', error: toEnvelope(e) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transport]);

  /**
   * Pick up the journey this tab already had, if there is one.
   *
   * Re-reads the platform rather than restoring a snapshot, so what the
   * customer sees on return is the journey as it stands now — a decision
   * that has since moved from Manual review to Accept shows as Accept, not
   * as the verdict that was on screen when they left.
   *
   * Falls through to a fresh journey whenever the stored session is no
   * longer usable: expired past its TTL, a cookie that no longer matches, or
   * a service that has restarted and lost its in-memory store. Those are the
   * ordinary cases, not errors worth showing.
   */
  const resume = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const state = await transport.getState(sessionId);
      if (state.status === 'Completed') {
        const record = await transport.getRecord(sessionId);
        dispatch({ type: 'STARTED', sessionId, interaction: null });
        dispatch({ type: 'DECIDED', record });
        return true;
      }
      const interaction = await transport.getInteraction(sessionId);
      if (!interaction) return false;
      dispatch({ type: 'STARTED', sessionId, interaction });
      return true;
    } catch {
      return false;
    }
  }, [transport]);

  useEffect(() => {
    if (startedRef.current) return;
    const existing = typeof window === 'undefined' ? null : recallSession();

    // A stored session is resumed even when the app defers its start: the
    // welcome screen is for someone who has not begun, and this person has.
    if (existing) {
      startedRef.current = true;
      resume(existing).then((resumed) => {
        if (resumed) return;
        forgetSession();
        // Deferred apps go back to their welcome screen rather than silently
        // starting a journey the customer never asked for a second time.
        if (deferStart) {
          startedRef.current = false;
          return;
        }
        start();
      });
      return;
    }

    if (deferStart) return;
    startedRef.current = true;
    start();
  }, [start, resume, deferStart]);

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
    // Dropped before the new one is stored, so a start that fails leaves no
    // id behind — the next reload would otherwise resume the journey the
    // customer just chose to abandon.
    forgetSession();
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
          return;
        }
        // Processing is not always the last phase. A journey can go back to
        // collecting: Document Classification reads side 1 and asks for the
        // back of the document, which arrives seconds after the submit, so
        // the service holds on `processing` until that answer exists rather
        // than advancing to the selfie on a stale one. Without re-reading the
        // interaction here, the customer waits on a spinner for a screen that
        // is already waiting for them.
        const next = await transport.getInteraction(sessionId);
        if (!cancelled && next && next.kind !== 'processing') {
          dispatch({ type: 'ADVANCED', interaction: next });
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

    // A journey can stop advancing without ever reporting that it has.
    //
    // A module that completes without producing an output its successor
    // declared leaves the graph deadlocked: Go keeps answering InProgress,
    // result.status stays "pending", and no status this loop waits for ever
    // arrives. Verified on the live tenant (2026-09-10) — Document
    // Classification completing on an unreadable image deadlocks Document
    // Extraction, and the instance sits pending indefinitely.
    //
    // Polling forever is honest but useless: the customer watches a spinner
    // with no end and no instruction. So the wait is bounded, and what it
    // says at the end is what is actually known — the checks did not
    // complete, not that the customer failed them. Non-retryable, because
    // the docs are explicit that an abandoned journey cannot be resumed;
    // the result screen's CTA starts a new one.
    const giveUp = setTimeout(() => {
      if (cancelled) return;
      dispatch({
        type: 'FAILED',
        error: {
          code: 'UPSTREAM_UNAVAILABLE',
          http: 0,
          message:
            'We could not finish your checks. Nothing has been decided about you — please start again.',
          retryable: false,
        },
      });
    }, PROCESSING_TIMEOUT_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
      clearTimeout(giveUp);
    };
  }, [state.phase, state.sessionId, transport]);

  return { ...state, submit, restart, begin };
}
