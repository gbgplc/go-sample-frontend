'use client';

import { useMemo } from 'react';
import { AppConfig, MockMarketFixtures, MockTransport, RestTransport } from '@gbg-go/onboarding-core';
import { OnboardingApp } from '@gbg-go/onboarding-ui';

export interface OnboardingClientProps {
  config: AppConfig;
  fixtures: MockMarketFixtures;
}

/**
 * Picks the transport once per page load. `NEXT_PUBLIC_ONBOARDING_TRANSPORT`
 * defaults to "mock" — every app must run with no backend present (front-end
 * handoff, section 5) — and switches to "rest" once a microservice base URL
 * is configured. Nothing below this line knows which one is active.
 */
export function OnboardingClient({ config, fixtures }: OnboardingClientProps) {
  const transport = useMemo(() => {
    const mode = process.env.NEXT_PUBLIC_ONBOARDING_TRANSPORT || 'mock';
    if (mode === 'rest') {
      return new RestTransport(process.env.NEXT_PUBLIC_API_BASE_URL || '');
    }
    return new MockTransport(fixtures, config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <OnboardingApp transport={transport} config={config} />;
}
