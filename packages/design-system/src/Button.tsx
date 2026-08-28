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

  const disabledStyle: React.CSSProperties = disabled
    ? variant === 'outlined'
      ? { background: '#fff', color: 'var(--gbg-charcoal-300)', borderColor: 'var(--gbg-charcoal-200)' }
      : { background: 'var(--gbg-charcoal-200)', color: 'var(--gbg-charcoal-400)', borderColor: 'transparent' }
    : {};

  const hoverStyle: React.CSSProperties =
    hover && !disabled
      ? variant === 'contained'
        ? { background: isError ? 'var(--gbg-red-700)' : 'var(--gbg-hyacinth-300)' }
        : { background: 'var(--gbg-hyacinth-50)' }
      : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...disabledStyle, ...hoverStyle, ...style }}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}
