import { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

/**
 * GBG Go — Link.
 * Underlined by default (never underline-on-hover), 500 weight, Hyacinth
 * B400 → B300 on hover. Pass `color` to override.
 */
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color' | 'onClick'> {
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  color?: string;
  children?: ReactNode;
}

export function Link({ href, onClick, color, children, style, ...rest }: LinkProps) {
  return (
    <a
      href={href || '#'}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      style={{
        color: color || 'var(--gbg-hyacinth-400)',
        textDecoration: 'underline',
        textDecorationColor: 'currentColor',
        fontWeight: 500,
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
