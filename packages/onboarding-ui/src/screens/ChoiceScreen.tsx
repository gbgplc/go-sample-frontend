'use client';

import { useState } from 'react';
import { ChoiceOption } from '@gbg-go/onboarding-core';

export interface ChoiceScreenProps {
  options: ChoiceOption[];
  accent: string;
  accentSoft: string;
  disabled?: boolean;
  onChoose: (value: string) => void;
}

export function ChoiceScreen({ options, accent, accentSoft, disabled, onChoose }: ChoiceScreenProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {options.map((o) => {
        const isHover = hovered === o.value;
        return (
          <button
            key={o.value}
            disabled={disabled}
            onClick={() => onChoose(o.value)}
            onMouseEnter={() => setHovered(o.value)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              textAlign: 'left',
              padding: 16,
              background: isHover ? accentSoft : '#fff',
              border: `1px solid ${isHover ? accent : 'var(--gbg-charcoal-200)'}`,
              borderRadius: 8,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'border-color 120ms ease, background-color 120ms ease',
            }}
          >
            {o.icon && <i className={`ph-bold ${o.icon}`} style={{ fontSize: 22, color: accent, marginTop: 1 }} />}
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gbg-charcoal-700)' }}>{o.label}</span>
              {o.detail && (
                <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--gbg-charcoal-400)' }}>{o.detail}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
