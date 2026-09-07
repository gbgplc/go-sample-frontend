import { Interaction } from '@gbg-go/onboarding-core';

export function StepHeader({ interaction }: { interaction: Interaction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {interaction.eyebrow && <div className="gbg-eyebrow">{interaction.eyebrow}</div>}
      {/* A real <h1>: every screen replaces the whole view, so each is the
          page's own heading. Screen readers announce it on arrival, which is
          how a non-sighted customer knows the step changed. */}
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--gbg-font-stack)',
          fontWeight: 800,
          lineHeight: 1.25,
          color: 'var(--gbg-charcoal-700)',
          // 24px rather than 20: this is the one thing on screen the customer
          // must read, and it competes with a photo of their own face.
          fontSize: 24,
          letterSpacing: '-0.015em',
        }}
      >
        {interaction.title}
      </h1>
      {interaction.body && (
        // 15px over 14, and charcoal-500 (7.9:1) over 400 — instructions that
        // decide whether a passport scan succeeds are not small print.
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--gbg-charcoal-500)', maxWidth: '60ch' }}>
          {interaction.body}
        </p>
      )}
    </div>
  );
}

export function NoteBanner({ note, accent, accentSoft }: { note: string; accent: string; accentSoft: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 11,
        padding: '13px 15px',
        borderRadius: 8,
        background: accentSoft,
        // A left rule reads as an aside rather than a form field, which a
        // bare tinted rectangle at this size otherwise resembles.
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <i className="ph ph-info" aria-hidden="true" style={{ fontSize: 17, color: accent, marginTop: 1, flex: '0 0 auto' }} />
      <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--gbg-charcoal-500)' }}>{note}</span>
    </div>
  );
}
