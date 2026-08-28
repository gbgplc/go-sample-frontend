'use client';

import { ChangeEvent, useRef, useState } from 'react';

export interface UploadScreenProps {
  accepted?: string[];
  accent: string;
  onFileSelected: (file: File) => void;
}

export function UploadScreen({ accepted, accent, onFileSelected }: UploadScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          padding: '28px 20px',
          border: '1px dashed var(--gbg-charcoal-300)',
          borderRadius: 8,
          background: 'var(--gbg-charcoal-50)',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        <i className="ph-bold ph-upload-simple" style={{ fontSize: 24, color: accent }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gbg-charcoal-700)' }}>
          {fileName || 'Add a file'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--gbg-charcoal-400)', textAlign: 'center' }}>
          PDF, JPG or PNG. Up to 10 MB.
        </div>
      </button>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} style={{ display: 'none' }} />
      {accepted?.map((a) => (
        <div
          key={a}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            border: '1px solid var(--gbg-charcoal-200)',
            borderRadius: 4,
          }}
        >
          <i className="ph ph-file-text" style={{ fontSize: 18, color: 'var(--gbg-charcoal-400)' }} />
          <span style={{ fontSize: 13, color: 'var(--gbg-charcoal-500)' }}>{a}</span>
        </div>
      ))}
    </div>
  );
}
