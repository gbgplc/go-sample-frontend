import { Interaction } from '@gbg-go/onboarding-core';

export function StepHeader({ interaction }: { interaction: Interaction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {interaction.eyebrow && <div className="gbg-eyebrow">{interaction.eyebrow}</div>}
      <div
        style={{
          fontFamily: 'var(--gbg-font-stack)',
          fontWeight: 800,
          lineHeight: 1.25,
          color: 'var(--gbg-charcoal-700)',
          fontSize: 20,
        }}
      >
        {interaction.title}
      </div>
      {interaction.body && (
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--gbg-charcoal-500)' }}>{interaction.body}</p>
      )}
    </div>
  );
}

export function NoteBanner({ note, accent, accentSoft }: { note: string; accent: string; accentSoft: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 4, background: accentSoft }}>
      <i className="ph ph-info" style={{ fontSize: 16, color: accent, marginTop: 1 }} />
      <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--gbg-charcoal-500)' }}>{note}</span>
    </div>
  );
}
