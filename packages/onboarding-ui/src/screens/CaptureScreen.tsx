/**
 * Document and selfie capture are placeholders (front-end handoff, section 6
 * open decisions: capture SDK integration is not yet chosen). This renders
 * the same viewfinder mock as the design prototype; swap the contents of
 * this component for GBG's Web SDK capture surface once that decision lands
 * — the chrome around it (header, CTA, accent) does not change.
 */
export interface CaptureScreenProps {
  captureType?: 'document' | 'selfie';
  accepted?: string[];
  accent: string;
}

export function CaptureScreen({ captureType, accepted, accent }: CaptureScreenProps) {
  if (captureType === 'selfie') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: 190,
            height: 190,
            borderRadius: '50%',
            background: 'var(--gbg-charcoal-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: 86, height: 104, borderRadius: '50% 50% 46% 46%', background: 'rgba(255,255,255,.16)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px dashed rgba(255,255,255,.35)' }} />
          <div
            style={{
              position: 'absolute',
              inset: -3,
              borderRadius: '50%',
              border: `3px solid ${accent}`,
              clipPath: 'inset(0 0 62% 0)',
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: 'var(--gbg-charcoal-400)', textAlign: 'center' }}>
          Hold still. Look straight at the camera.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          position: 'relative',
          height: 190,
          borderRadius: 8,
          background: 'var(--gbg-charcoal-600)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 236,
            height: 148,
            borderRadius: 6,
            background: 'linear-gradient(180deg,#2f2f38,#23232b)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 52, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.28)' }} />
            <div style={{ width: 20, height: 14, borderRadius: 2, background: 'rgba(255,255,255,.18)' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 44, height: 56, borderRadius: 3, background: 'rgba(255,255,255,.14)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <div style={{ width: '80%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,.24)' }} />
              <div style={{ width: '60%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,.18)' }} />
              <div style={{ width: '70%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,.18)' }} />
            </div>
          </div>
          <div style={{ height: 10, borderRadius: 2, background: 'rgba(255,255,255,.10)' }} />
        </div>
        <div
          className="onb-scan-line"
          style={{ position: 'absolute', left: 26, right: 26, height: 2, background: accent, opacity: 0.8 }}
        />
      </div>
      {accepted && accepted.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {accepted.map((a) => (
            <span
              key={a}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: 20,
                padding: '0 8px',
                background: '#fff',
                border: '1px solid var(--gbg-charcoal-200)',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--gbg-charcoal-500)',
              }}
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
