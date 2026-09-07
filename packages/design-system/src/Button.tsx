'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';

/**
 * GBG Go — Button.
 * Three variants (contained / outlined / text), two sizes (48 default, 32
 * short), flat — no elevation, no ripple. Sentence-case, 600 weight.
 * Destructive uses the error colour with the contained or outlined treatment.
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'medium' | 'small';
  color?: 'primary' | 'error';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  type = 'button',
  children,
  style,
  ...rest
}: ButtonProps) {
  const isSmall = size === 'small';
  const isError = color === 'error';
  const [hover, setHover] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const base: React.CSSProperties = {
    height: isSmall ? 32 : 48,
    padding: variant === 'text' ? '0 8px' : isSmall ? '0 12px' : '0 16px',
    fontFamily: 'var(--gbg-font-stack)',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: fullWidth ? '100%' : undefined,
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
    textTransform: 'none',
    boxShadow: 'none',
  };

  const variants: Record<string, React.CSSProperties> = {
    contained: {
      background: isError ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)',
      color: '#fff',
    },
    outlined: {
      background: '#fff',
      color: isError ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)',
      borderColor: isError ? 'var(--gbg-red-500)' : 'var(--gbg-hyacinth-400)',
    },
    text: {
      background: 'transparent',
      color: 'var(--gbg-hyacinth-400)',
      border: 'none',
    },
  };

  // charcoal-400 (#787887) on charcoal-200 (#E3E3E8) is 3.4:1 — under the
  // 4.5:1 floor, and this label carries the one instruction on the screen
  // ("Scan document"). charcoal-500 on charcoal-100 reaches 7.4:1 and still
  // reads as clearly unavailable next to a filled button.
  const disabledStyle: React.CSSProperties = disabled
    ? variant === 'outlined'
      ? { background: '#fff', color: 'var(--gbg-charcoal-500)', borderColor: 'var(--gbg-charcoal-300)' }
      : { background: 'var(--gbg-charcoal-100)', color: 'var(--gbg-charcoal-500)', borderColor: 'var(--gbg-charcoal-200)' }
    : {};

  const hoverStyle: React.CSSProperties =
    hover && !disabled
      ? variant === 'contained'
        ? { background: isError ? 'var(--gbg-red-700)' : 'var(--gbg-hyacinth-300)' }
        : { background: 'var(--gbg-hyacinth-50)' }
      : {};

  // A caller's `style` overrides the variant — that is how each market applies
  // its brand colour — but it must not override the disabled treatment. An app
  // passing `background: accent` alongside `disabled` otherwise keeps the full
  // brand fill and loses only the text colour, leaving grey-on-green: about
  // 1.6:1, unreadable, and it still reads as a button you can press.
  const composed: React.CSSProperties = disabled
    ? { ...base, ...variants[variant], ...style, ...disabledStyle }
    : { ...base, ...variants[variant], ...hoverStyle, ...style };

  // Keyboard focus needs to be visible, and an offset ring stays visible over
  // a brand fill of any colour — a border or inset ring disappears into it.
  if (focusVisible && !disabled) {
    composed.outline = '3px solid var(--gbg-charcoal-700)';
    composed.outlineOffset = 2;
  }

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onMouseEnter={(e) => {
        setHover(true);
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        rest.onMouseLeave?.(e);
      }}
      // :focus-visible, so a ring appears for keyboard users but not on tap.
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) setFocusVisible(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocusVisible(false);
        rest.onBlur?.(e);
      }}
      style={composed}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}
