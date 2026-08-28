'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';

/**
 * GBG Go — IconButton.
 * Square, transparent-by-default action with a C50 hover wash. 32px short or
 * 48px default. Always pass `ariaLabel` — icon-only controls need a name.
 */
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  ariaLabel: string;
  size?: 32 | 48;
  children?: ReactNode;
}

export function IconButton({ disabled = false, ariaLabel, size = 32, style, children, ...rest }: IconButtonProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hover && !disabled ? 'var(--gbg-charcoal-50)' : 'transparent',
        color: disabled ? 'var(--gbg-charcoal-300)' : 'var(--gbg-charcoal-500)',
        border: 'none',
        borderRadius: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 120ms ease',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
