import { MockMarketFixtures, MockStepDef } from './mockFixtures';
import {
  AppConfig,
  Interaction,
  JourneyStatus,
  OnboardingError,
  OnboardingTransport,
  RecordResponse,
  StagePlanEntry,
  StartSessionResponse,
  StateResponse,
  SubmitInteractionResponse,
} from './types';

interface MockSession {
  scenarioId: string;
  stepIndex: number;
}

function stepStatus(step: MockStepDef): JourneyStatus {
  if (step.kind === 'processing') return 'InProgress';
  if (step.kind === 'result' && step.summary) return 'Completed';
  return 'PendingInput';
}

/**
 * The rail for the resolved path so far: one row per distinct stage label,
 * in order of first appearance. A stage is `done` once its first occurrence
 * is behind the current step and it isn't the current stage; matching by
 * label (not position) is what lets a repeated stage — banking's "Decision"
 * shows twice around the referral upload — flip back to `active` correctly
 * on the second visit instead of getting stuck.
 */
function buildStagePlan(steps: MockStepDef[], currentIndex: number): StagePlanEntry[] {
  const currentStage = steps[currentIndex].stage;
  const seen: { label: string; first: number }[] = [];
  steps.forEach((s, idx) => {
    if (!seen.some((x) => x.label === s.stage)) seen.push({ label: s.stage, first: idx });
  });
  return seen.map(({ label, first }) => {
    if (label === currentStage) return { label, state: 'active' };
    return { label, state: first < currentIndex ? 'done' : 'upcoming' };
  });
}

function toInteraction(step: MockStepDef, id: string, stagePlan: StagePlanEntry[]): Interaction {
  return {
    interactionId: id,
    kind: step.kind,
    stage: step.stage,
    eyebrow: step.eyebrow,
    title: step.title,
    body: step.body,
    note: step.note,
    cta: step.cta,
    secondaryCta: step.secondaryCta,
    captureType: step.captureType,
    accepted: step.accepted,
    collects: step.fields,
    options: step.options?.map(({ branchTo: _branchTo, ...o }) => o),
    checks: step.checks,
    modules: step.modules,
    moduleRuns: step.moduleRuns,
    decision: step.decision,
    timing: step.timing,
    summary: step.summary,
    recordNote: step.recordNote,
    stagePlan,
  };
}

function toRecord(step: MockStepDef): RecordResponse {
  return {
    decision: step.decision || 'pass',
    title: step.title,
    timing: step.timing || '',
    body: step.body || '',
    cta: step.cta || 'Done',
    moduleRuns: step.moduleRuns || [],
    summary: step.summary || [],
    recordNote: step.recordNote,
  };
}

/**
 * Standalone canned-fixture transport (section 5, mock mode). Implements the
 * same `OnboardingTransport` interface as `RestTransport`, so nothing above
 * the transport layer knows which is active — flip
 * `NEXT_PUBLIC_ONBOARDING_TRANSPORT` to switch.
 *
 * Which of a market's designed outcomes plays is picked once per session,
 * from a `?mock_scenario=<id>` query param when present (falling back to the
 * fixture's default) — this is what lets the referral, step-up and blocked
 * paths all be reached on demand for review and QA, per "mock mode" in the
 * front-end handoff. It is a demo/test affordance; a live RestTransport has
 * no such switch because the branch is Go's decision, not the client's.
 */
export class MockTransport implements OnboardingTransport {
  private sessions = new Map<string, MockSession>();
  private nextId = 1;

  constructor(
    private fixtures: MockMarketFixtures,
    private config: AppConfig,
    private latencyMs = 500
  ) {}

  private wait(ms = this.latencyMs) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private pickScenarioId(): string {
    if (typeof window !== 'undefined') {
      const fromQuery = new URLSearchParams(window.location.search).get('mock_scenario');
      if (fromQuery && this.fixtures.scenarios[fromQuery]) return fromQuery;
    }
    return this.fixtures.defaultScenarioId;
  }

  private currentStep(session: MockSession): MockStepDef {
    const scenario = this.fixtures.scenarios[session.scenarioId];
    return scenario.steps[Math.min(session.stepIndex, scenario.steps.length - 1)];
  }

  private stagePlan(session: MockSession): StagePlanEntry[] {
    const scenario = this.fixtures.scenarios[session.scenarioId];
    const index = Math.min(session.stepIndex, scenario.steps.length - 1);
    return buildStagePlan(scenario.steps, index);
  }

  async startSession(): Promise<StartSessionResponse> {
    await this.wait();
    const sessionId = `mock_${this.nextId++}`;
    const session: MockSession = { scenarioId: this.pickScenarioId(), stepIndex: 0 };
    this.sessions.set(sessionId, session);
    const step = this.currentStep(session);
    return {
      sessionId,
      status: stepStatus(step),
      interaction: toInteraction(step, `${sessionId}_0`, this.stagePlan(session)),
    };
  }

  async submitInteraction(
    sessionId: string,
    interactionId: string,
    data: Record<string, unknown>
  ): Promise<SubmitInteractionResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new OnboardingError({
        code: 'SESSION_EXPIRED',
        http: 410,
        message: 'Your session has ended. Start again to continue.',
        retryable: false,
      });
    }
    await this.wait();

    const step = this.currentStep(session);
    const expectedId = `${sessionId}_${session.stepIndex}`;
    if (interactionId !== expectedId) {
      throw new OnboardingError({
        code: 'INTERACTION_STALE',
        http: 409,
        message: 'This step has moved on. Refetching the current one.',
        retryable: true,
      });
    }

    // Branching choice: switch scenario, continuing at the same position in
    // the target scenario's own step list (both share the prefix up to here).
    if (step.kind === 'choice' && step.options) {
      const chosen = step.options.find((o) => o.value === data.value);
      if (chosen?.branchTo && chosen.branchTo !== session.scenarioId) {
        session.scenarioId = chosen.branchTo;
      }
    }

    const targetScenario = this.fixtures.scenarios[session.scenarioId];
    session.stepIndex = Math.min(session.stepIndex + 1, targetScenario.steps.length - 1);

    const nextStep = this.currentStep(session);
    const nextId = `${sessionId}_${session.stepIndex}`;
    return {
      status: stepStatus(nextStep),
      interaction: toInteraction(nextStep, nextId, this.stagePlan(session)),
    };
  }

  async getState(sessionId: string): Promise<StateResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new OnboardingError({
        code: 'SESSION_EXPIRED',
        http: 410,
        message: 'Your session has ended. Start again to continue.',
        retryable: false,
      });
    }
    const step = this.currentStep(session);
    return { status: stepStatus(step), decision: step.decision, moduleRuns: step.moduleRuns };
  }

  async getRecord(sessionId: string): Promise<RecordResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new OnboardingError({
        code: 'SESSION_EXPIRED',
        http: 410,
        message: 'Your session has ended. Start again to continue.',
        retryable: false,
      });
    }
    return toRecord(this.currentStep(session));
  }

  async uploadAttachment(_sessionId: string, file: File): Promise<{ attachmentRef: string }> {
    await this.wait(300);
    return { attachmentRef: `mock_attachment_${file.name}_${Date.now()}` };
  }

  async getConfig(): Promise<AppConfig> {
    return this.config;
  }
}
