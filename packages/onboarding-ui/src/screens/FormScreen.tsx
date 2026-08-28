import { TextField } from '@gbg-go/design-system';
import { FieldSchema } from '@gbg-go/onboarding-core';

export interface FormScreenProps {
  fields: FieldSchema[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  fieldErrors?: Record<string, string>;
}

const HTML_TYPE: Record<string, string> = { date: 'text', tel: 'tel', email: 'email', postcode: 'text', text: 'text' };

export function FormScreen({ fields, values, onChange, fieldErrors }: FormScreenProps) {
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
          value={values[f.name] ?? ''}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      ))}
    </div>
  );
}
