'use client';

import { useEffect } from 'react';
import { ModuleRun } from '@gbg-go/onboarding-core';
import { moduleIconColor } from './moduleState';

export interface ProcessingScreenProps {
  moduleRuns?: ModuleRun[];
  accent: string;
  /**
   * Called once the journey has left `InProgress`. Supplied by
   * {@link OnboardingApp}, which polls the transport's `getState` — this
   * screen renders, it does not decide when the work is done.
   */
  onSettled: () => void;
  /** Rendered under the spinner once the wait runs long. */
  slowNotice?: string;
}

export function ProcessingScreen({ moduleRuns, accent, onSettled, slowNotice }: ProcessingScreenProps) {
  // Kept only for a transport that reports no state of its own: without it the
  // mock would spin forever. A live transport settles this screen from the
  // poll in OnboardingApp long before the fallback fires.
  useEffect(() => {
    const timer = setTimeout(onSettled, 20_000);
    return () => clearTimeout(timer);
  }, [onSettled]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      <div
        className="onb-spinner"
        role="status"
        aria-live="polite"
        aria-label="Running your checks"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '3px solid var(--gbg-charcoal-200)',
          borderTopColor: accent,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {moduleRuns?.map((m) => {
          const { icon, color } = moduleIconColor(m.state);
          return (
            <div
              key={m.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                border: '1px solid var(--gbg-charcoal-200)',
                borderRadius: 4,
              }}
            >
              <i className={`ph-bold ${icon}`} aria-hidden="true" style={{ fontSize: 16, color }} />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--gbg-charcoal-500)' }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color }}>{m.state}</span>
            </div>
          );
        })}
      </div>
      {slowNotice && (
        <p
          aria-live="polite"
          style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--gbg-charcoal-500)', textAlign: 'center' }}
        >
          {slowNotice}
        </p>
      )}
    </div>
  );
}
