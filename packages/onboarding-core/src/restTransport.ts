import {
  AppConfig,
  ErrorEnvelope,
  Interaction,
  OnboardingError,
  OnboardingTransport,
  RecordResponse,
  StartSessionResponse,
  StateResponse,
  SubmitInteractionResponse,
} from './types';

/**
 * Thin proxy client (section 1). Talks to the onboarding microservice, never
 * to GBG Go directly, and never holds a Go credential. Session identity rides
 * on a first-party HTTP-only cookie set by the service (section 6, open
 * decision: front-end authentication) — `credentials: 'include'` on every
 * call is what makes that cookie flow.
 */
export class RestTransport implements OnboardingTransport {
  constructor(private baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init?.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
    if (!res.ok) {
      let envelope: ErrorEnvelope;
      try {
        envelope = await res.json();
      } catch {
        envelope = {
          code: 'UPSTREAM_UNAVAILABLE',
          http: res.status,
          message: 'Something went wrong on our end. Try again shortly.',
          retryable: true,
        };
      }
      throw new OnboardingError(envelope);
    }
    return res.json() as Promise<T>;
  }

  startSession(prefill?: Record<string, unknown>): Promise<StartSessionResponse> {
    // Forwards the page's own `?mock_scenario=` straight through, so the same
    // demo/QA affordance MockTransport reads from window.location works
    // identically when a service's mock Go client is what's answering —
    // a live service just ignores the unrecognised query param.
    const scenario = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('mock_scenario') : null;
    const query = scenario ? `?mock_scenario=${encodeURIComponent(scenario)}` : '';
    return this.request(`/v1/sessions${query}`, { method: 'POST', body: JSON.stringify({ prefill }) });
  }

  submitInteraction(
    sessionId: string,
    interactionId: string,
    data: Record<string, unknown>
  ): Promise<SubmitInteractionResponse> {
    return this.request(`/v1/sessions/${sessionId}/interaction`, {
      method: 'POST',
      body: JSON.stringify({ interactionId, data }),
    });
  }

  getInteraction(sessionId: string): Promise<Interaction | null> {
    return this.request(`/v1/sessions/${sessionId}/interaction`);
  }

  getState(sessionId: string): Promise<StateResponse> {
    return this.request(`/v1/sessions/${sessionId}/state`);
  }

  getRecord(sessionId: string): Promise<RecordResponse> {
    return this.request(`/v1/sessions/${sessionId}/record`);
  }

  async uploadAttachment(sessionId: string, file: File): Promise<{ attachmentRef: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.request(`/v1/sessions/${sessionId}/attachments`, { method: 'POST', body: form });
  }

  getConfig(): Promise<AppConfig> {
    return this.request('/v1/config');
  }
}
