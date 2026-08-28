import { CSSProperties } from 'react';

/**
 * GBG Go — StatusBadge.
 * Tinted background + coloured dot + coloured bold caption. Colour is
 * paired with a text label so it's never the sole carrier of meaning.
 */
export type GbgStatus = 'pass' | 'fail' | 'review' | 'pending';

const GBG_STATUS: Record<GbgStatus, { label: string; fg: string; bg: string }> = {
  pass: { label: 'Passed', fg: 'var(--gbg-green-700)', bg: 'var(--gbg-green-100)' },
  fail: { label: 'Failed', fg: 'var(--gbg-red-700)', bg: 'var(--gbg-red-100)' },
  review: { label: 'In review', fg: 'var(--gbg-orange-700)', bg: 'var(--gbg-orange-100)' },
  pending: { label: 'Pending', fg: 'var(--gbg-charcoal-500)', bg: 'var(--gbg-charcoal-50)' },
};

export interface StatusBadgeProps {
  status?: GbgStatus;
  label?: string;
  style?: CSSProperties;
}

export function StatusBadge({ status = 'pending', label, style }: StatusBadgeProps) {
  const c = GBG_STATUS[status] || GBG_STATUS.pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 2,
        background: c.bg,
        color: c.fg,
        fontSize: 12,
        fontWeight: 600,
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.fg, display: 'inline-block' }} />
      {label || c.label}
    </span>
  );
}
