import { ConsentCheck } from '@gbg-go/onboarding-core';

export interface ConsentScreenProps {
  checks: ConsentCheck[];
  values: Record<string, boolean>;
  onChange: (name: string, checked: boolean) => void;
}

export function ConsentScreen({ checks, values, onChange }: ConsentScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {checks.map((c) => (
        <label
          key={c.name}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            padding: 14,
            border: '1px solid var(--gbg-charcoal-200)',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={values[c.name] ?? false}
            onChange={(e) => onChange(c.name, e.target.checked)}
            style={{ width: 16, height: 16, margin: '2px 0 0', accentColor: 'var(--gbg-hyacinth-400)' }}
          />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gbg-charcoal-700)' }}>{c.label}</span>
            {c.detail && (
              <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--gbg-charcoal-400)' }}>{c.detail}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
