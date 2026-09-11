import { TextField } from '@gbg-go/design-system';
import { FieldSchema } from '@gbg-go/onboarding-core';

export interface FormScreenProps {
  fields: FieldSchema[];
  /**
   * Whether these fields carry real requirement data.
   *
   * True for a live journey, whose `collects` says which refs are required.
   * The mock's fixtures do not set `required` at all, so marking there would
   * label every field Optional.
   */
  showOptional?: boolean;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  fieldErrors?: Record<string, string>;
}

const HTML_TYPE: Record<string, string> = { date: 'text', tel: 'tel', email: 'email', postcode: 'text', text: 'text' };

export function FormScreen({ fields, values, onChange, fieldErrors, showOptional }: FormScreenProps) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {fields.map((f) => (
        <TextField
          key={f.name}
          label={f.label}
          type={HTML_TYPE[f.type || 'text']}
          placeholder={f.placeholder}
          helperText={fieldErrors?.[f.name] || f.helperText}
          error={!!fieldErrors?.[f.name]}
          required={f.required}
          showOptional={showOptional}
          value={values[f.name] ?? ''}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      ))}
    </div>
  );
}
