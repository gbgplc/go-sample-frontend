'use client';

import { useEffect } from 'react';
import { ModuleRun } from '@gbg-go/onboarding-core';
import { moduleIconColor } from './moduleState';

export interface ProcessingScreenProps {
  moduleRuns?: ModuleRun[];
  accent: string;
  /**
   * A live RestTransport backend resolves this by polling GET /state until
   * status leaves InProgress. The mock has nothing to poll, so it stands in
   * with a fixed wait before calling back — same UI, same contract shape.
   */
  onSettled: () => void;
}

export function ProcessingScreen({ moduleRuns, accent, onSettled }: ProcessingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onSettled, 1400);
    return () => clearTimeout(timer);
  }, [onSettled]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      <div
        className="onb-spinner"
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
              <i className={`ph-bold ${icon}`} style={{ fontSize: 16, color }} />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--gbg-charcoal-500)' }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color }}>{m.state}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
