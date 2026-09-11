'use client';

import { InputHTMLAttributes, useState } from 'react';

/**
 * GBG Go — TextField.
 * Label sits above the field (not in an outlined notch). 40px height, white
 * fill, 4px radius, 1px C300 border → C400 hover → B400 focus, red on error.
 */
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  /**
   * Mark the fields that are not required with "Optional".
   *
   * Opt-in rather than automatic: a caller that does not know which of its
   * fields are required leaves `required` unset on all of them, and an
   * automatic marker would then label every field Optional — worse than
   * saying nothing. Set it only where the requirement data is real.
   */
  showOptional?: boolean;
  style?: React.CSSProperties;
}

export function TextField({
  label,
  type = 'text',
  helperText,
  error = false,
  required = false,
  showOptional = false,
  disabled = false,
  style,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? 'var(--gbg-red-500)' : focused ? 'var(--gbg-hyacinth-400)' : 'var(--gbg-charcoal-300)';

  return (
    <label style={{ display: 'block', ...style }}>
      {label && (
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gbg-charcoal-500)', marginBottom: 4 }}>
          {label}
          {/*
            "Optional" on the optional ones, rather than an asterisk on the
            required ones. A journey can ask for a dozen fields of which two
            are optional, and marking the exception is both less noise and the
            more useful half to know: someone scanning the form is looking for
            what they can skip, not for permission to fill a box in.

            Not announced separately to a screen reader — the input's own
            `required` already carries that, and a reader would otherwise hear
            the state twice.
          */}
          {showOptional && !required && (
            <span
              aria-hidden="true"
              style={{ fontWeight: 400, color: 'var(--gbg-charcoal-400)', marginLeft: 6 }}
            >
              Optional
            </span>
          )}
        </div>
      )}
      <input
        type={type}
        required={required}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          height: 40,
          padding: '8px 12px',
          fontFamily: 'var(--gbg-font-stack)',
          fontSize: 14,
          color: 'var(--gbg-charcoal-700)',
          background: disabled ? 'var(--gbg-charcoal-50)' : '#fff',
          border: `1px solid ${borderColor}`,
          borderRadius: 4,
          outline: 'none',
          transition: 'border-color 120ms ease',
        }}
        {...rest}
      />
      {helperText && (
        <div style={{ fontSize: 12, color: error ? 'var(--gbg-red-700)' : 'var(--gbg-charcoal-400)', marginTop: 4 }}>
          {helperText}
        </div>
      )}
    </label>
  );
}
