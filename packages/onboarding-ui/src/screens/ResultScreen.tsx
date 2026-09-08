import { ModuleRun, SummaryRow } from '@gbg-go/onboarding-core';
import { moduleIconColor } from './moduleState';

export interface ResultScreenProps {
  decision?: 'pass' | 'refer' | 'fail';
  timing?: string;
  moduleRuns?: ModuleRun[];
  summary?: SummaryRow[];
  recordNote?: string;
  accent: string;
  /**
   * The checks could not run, as opposed to running and declining. Shown
   * differently because the two mean opposite things to the customer: a
   * decline is a verdict to appeal, an error is a reason to try again.
   */
  systemError?: boolean;
}

const DECISION_TONE: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  pass: { icon: 'ph-check', color: 'var(--gbg-green-700)', bg: 'var(--gbg-green-100)', label: 'Approved' },
  refer: { icon: 'ph-clock-countdown', color: 'var(--gbg-orange-700)', bg: 'var(--gbg-orange-100)', label: 'Referred' },
  fail: { icon: 'ph-x', color: 'var(--gbg-red-500)', bg: 'var(--gbg-red-100)', label: 'Declined' },
};

// Amber and a warning mark, not red and a cross: nothing was decided about
// this person, and the badge should not imply otherwise.
const ERROR_TONE = {
  icon: 'ph-warning',
  color: 'var(--gbg-orange-700)',
  bg: 'var(--gbg-orange-100)',
  label: 'Not completed',
};

export function ResultScreen({ decision, timing, moduleRuns, summary, recordNote, accent, systemError }: ResultScreenProps) {
  const tone = systemError ? ERROR_TONE : DECISION_TONE[decision || 'pass'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: tone.bg,
          }}
        >
          <i className={`ph-bold ${tone.icon}`} style={{ fontSize: 24, color: tone.color }} />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: tone.color }}>{tone.label}</span>
          {timing && <span style={{ fontSize: 12, color: 'var(--gbg-charcoal-400)' }}>{timing}</span>}
        </span>
      </div>

      {moduleRuns && moduleRuns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="gbg-eyebrow" style={{ paddingBottom: 8 }}>
            Modules run
          </div>
          {moduleRuns.map((m) => {
            const { icon, color } = moduleIconColor(m.state);
            return (
              <div
                key={m.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderTop: '1px solid var(--gbg-charcoal-100)',
                }}
              >
                <i className={`ph-bold ${icon}`} style={{ fontSize: 15, color }} />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--gbg-charcoal-500)' }}>{m.label}</span>
                {m.ms && <span style={{ fontSize: 12, color: 'var(--gbg-charcoal-300)' }}>{m.ms}</span>}
                <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 52, textAlign: 'right' }}>
                  {m.state}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {summary && summary.length > 0 && (
        <div style={{ border: '1px solid var(--gbg-charcoal-200)', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              borderBottom: '1px solid var(--gbg-charcoal-200)',
              background: 'var(--gbg-charcoal-50)',
            }}
          >
            <i className="ph-bold ph-path" style={{ fontSize: 15, color: 'var(--gbg-charcoal-400)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gbg-charcoal-700)' }}>
              Your verification record
            </span>
          </div>
          <div style={{ padding: '4px 16px 12px' }}>
            {summary.map((r) => (
              <div
                key={r.k}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--gbg-charcoal-100)',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--gbg-charcoal-400)' }}>{r.k}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gbg-charcoal-700)', textAlign: 'right' }}>
                  {r.v}
                </span>
              </div>
            ))}
            {recordNote && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingTop: 12 }}>
                <i className="ph ph-download-simple" style={{ fontSize: 15, color: accent, marginTop: 1 }} />
                <span style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--gbg-charcoal-400)' }}>{recordNote}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
