/**
 * Shared types for the REST contract in "Market onboarding applications —
 * front-end handoff", section 2. Both the Java and the TypeScript backend
 * microservice must produce these shapes to the field name.
 */

export type ScreenKind =
  | 'intro'
  | 'form'
  | 'choice'
  | 'capture'
  | 'upload'
  | 'consent'
  | 'processing'
  | 'result';

export type JourneyStatus = 'InProgress' | 'PendingInput' | 'Completed';

export type ModuleState = 'Pass' | 'Running' | 'Review' | 'Fail' | 'Skipped';

export interface ModuleRun {
  label: string;
  state: ModuleState;
  ms?: string;
  /**
   * Go's own descriptive result for this module — e.g. "Document
   * Classified", "Extraction Successful", "No Match" — the same text shown
   * in the Go platform's own investigation UI. Worth showing because `state`
   * alone often cannot: a module with no positive/negative verdict of its
   * own (Document Classification, Extraction) always maps to `Review`
   * regardless of how it actually went, so the coloured badge carries the
   * state and this carries the detail.
   */
  outcome?: string;
}

export interface SummaryRow {
  k: string;
  v: string;
}

export interface FieldSchema {
  name: string;
  label: string;
  type?: 'text' | 'date' | 'tel' | 'email' | 'postcode';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export interface ChoiceOption {
  value: string;
  label: string;
  detail?: string;
  icon?: string;
}

export interface ConsentCheck {
  name: string;
  label: string;
  detail?: string;
  defaultChecked?: boolean;
}

/**
 * One row of the stage rail. This is a presentational hint, not a routing
 * table — the client still advances only from what an interaction response
 * actually returns. A live backend can compute it the same way the mock
 * does: once a branch is resolved, the remaining stages for that path are
 * known, even if the exact screens within a stage are not.
 */
export interface StagePlanEntry {
  label: string;
  state: 'done' | 'active' | 'upcoming';
}

/** The current interaction — the front end's routing signal (section 2, GET /interaction). */
export interface Interaction {
  interactionId: string;
  kind: ScreenKind;
  stage: string;
  eyebrow?: string;
  title: string;
  body?: string;
  note?: string;
  cta?: string;
  secondaryCta?: string;
  /**
   * 'document-back' is the second side of a two-sided document: the same
   * rear-facing capture as 'document', distinct so the screen can say which
   * side is wanted and the backend can route it to PrimaryDocument/side2Image.
   */
  captureType?: 'document' | 'document-back' | 'selfie';
  accepted?: string[];
  collects?: FieldSchema[];
  options?: ChoiceOption[];
  checks?: ConsentCheck[];
  /** Go module names this interaction's submission will invoke — shown as progress context, not routing data. */
  modules?: string[];
  /** Present on `processing` and `result` kinds only. */
  moduleRuns?: ModuleRun[];
  decision?: 'pass' | 'refer' | 'fail';
  timing?: string;
  /** Present only on a scenario's terminal `result` — this is what GET /record mirrors. */
  summary?: SummaryRow[];
  recordNote?: string;
  /** The full stage rail for the path resolved so far, current stage included. */
  stagePlan?: StagePlanEntry[];
}

export interface StartSessionResponse {
  sessionId: string;
  status: JourneyStatus;
  interaction: Interaction | null;
}

export interface SubmitInteractionResponse {
  status: JourneyStatus;
  interaction: Interaction | null;
}

export interface StateResponse {
  status: JourneyStatus;
  decision?: 'pass' | 'refer' | 'fail';
  moduleRuns?: ModuleRun[];
}

/** GET /record — the verification record shown on the final screen. */
export interface RecordResponse {
  decision: 'pass' | 'refer' | 'fail';
  title: string;
  timing: string;
  body: string;
  cta: string;
  moduleRuns: ModuleRun[];
  summary: SummaryRow[];
  recordNote?: string;
  /**
   * The checks could not run, as opposed to running and declining.
   *
   * Both arrive as `decision: 'fail'`, and they mean opposite things to the
   * customer — a decline is a verdict to appeal, an error is a reason to try
   * again — so the service says which it is rather than leaving the client to
   * infer it. Optional for the mock, which has no such fixture.
   */
  systemError?: boolean;
}

/** One reassurance shown while the customer decides whether to start. */
export interface TrustPoint {
  /** Phosphor icon name, e.g. `ph-lock-simple`. */
  icon: string;
  title: string;
  detail: string;
}

export interface AppConfig {
  brand: string;
  mark: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  helpLine: string;
  journeyName: string;
  resourceId: string;
  /**
   * What this organisation does and why it needs to verify anyone — shown on
   * the intro screen, above the journey's own copy.
   *
   * All four fields below are optional: an app that sets none renders exactly
   * as it did before. They exist because a journey answers "what do I do
   * next", never "who is asking and why should I trust them", and a customer
   * being asked to photograph their passport reasonably wants both.
   */
  purpose?: string;
  /** Heading for the welcome screen. Defaults to "Welcome to {brand}". */
  welcomeTitle?: string;
  /** Label on the button that starts the journey. Defaults to "Get started". */
  welcomeCta?: string;
  /** Three or four reassurances — data handling, retention, alternatives. */
  trustPoints?: TrustPoint[];
  /** What the customer gets once verified. */
  outcomes?: string[];
  /** Regulatory or governance footnote for the intro screen. */
  complianceNote?: string;
}

export type ErrorCode =
  | 'VALIDATION_FAILED'
  | 'SESSION_EXPIRED'
  | 'INTERACTION_STALE'
  | 'UPSTREAM_UNAVAILABLE'
  | 'RATE_LIMITED';

export interface ErrorEnvelope {
  code: ErrorCode;
  http: number;
  message: string;
  fields?: Record<string, string>;
  retryable: boolean;
}

export class OnboardingError extends Error {
  envelope: ErrorEnvelope;
  constructor(envelope: ErrorEnvelope) {
    super(envelope.message);
    this.name = 'OnboardingError';
    this.envelope = envelope;
  }
}

/** The transport both RestTransport and MockTransport implement — the app never knows which is active. */
export interface OnboardingTransport {
  startSession(prefill?: Record<string, unknown>): Promise<StartSessionResponse>;
  submitInteraction(
    sessionId: string,
    interactionId: string,
    data: Record<string, unknown>
  ): Promise<SubmitInteractionResponse>;
  /**
   * The screen the journey is currently on.
   *
   * Needed while processing as well as while collecting: a journey can
   * return to a collection screen after modules have started (the back of a
   * two-sided document, asked for once Classification has read the front).
   */
  getInteraction(sessionId: string): Promise<Interaction | null>;
  getState(sessionId: string): Promise<StateResponse>;
  getRecord(sessionId: string): Promise<RecordResponse>;
  uploadAttachment(sessionId: string, file: File): Promise<{ attachmentRef: string }>;
  getConfig(): Promise<AppConfig>;
}
