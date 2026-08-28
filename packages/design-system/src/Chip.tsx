import { CSSProperties } from 'react';

/**
 * GBG Go — Chip (filter pill).
 * Small and pencil-like, not pill-shaped: 20px height, 4px radius, 1px C200
 * border, white fill, 12px / 500 caption. Optional 12px delete affordance.
 */
export interface ChipProps {
  label: string;
  onDelete?: () => void;
  style?: CSSProperties;
}

export function Chip({ label, onDelete, style }: ChipProps) {
  return (
    <span
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
        ...style,
      }}
    >
      {label}
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label={`Remove ${label}`}
          style={{
            width: 12,
            height: 12,
            border: 'none',
            background: 'none',
            color: 'var(--gbg-charcoal-400)',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="ph ph-x" style={{ fontSize: 12 }} />
        </button>
      )}
    </span>
  );
}
