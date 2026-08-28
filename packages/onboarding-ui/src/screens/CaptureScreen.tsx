'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

/**
 * A working document/selfie capture surface, built to GBG's own documented
 * pattern for host-page capture (Web Bridge SDK docs, "Capture Screens"):
 * live getUserMedia preview + shutter as the primary rung, a file-picker
 * fallback (with the `capture` attribute hint) when the camera is
 * unavailable or permission is refused. GBG does not ship a capture
 * component for this — every integrator builds this UI themselves, whether
 * or not a hosted journey is involved; only the wire shape of the result is
 * standardised. This produces real photos, not document-authenticity or
 * liveness checks — those run server-side once modules are live.
 *
 * Swap-out point for a production capture SDK: everything below the
 * `onCaptured(file)` call is the seam — replace this component's internals,
 * keep the prop contract.
 */
export interface CaptureScreenProps {
  captureType?: 'document' | 'selfie';
  accepted?: string[];
  accent: string;
  onCaptured: (file: File) => void;
}

type Phase = 'starting' | 'live' | 'captured' | 'filePicker' | 'unavailable';

export function CaptureScreen({ captureType, accepted, accent, onCaptured }: CaptureScreenProps) {
  const isSelfie = captureType === 'selfie';
  const facingMode = isSelfie ? 'user' : 'environment';

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>('starting');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(() => {
    setPermissionError(null);
    setPhase('starting');

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setPhase('filePicker');
      return () => {};
    }

    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setPhase('live');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setPermissionError(e instanceof Error ? e.message : String(e));
        setPhase('filePicker');
      });

    return () => {
      cancelled = true;
    };
  }, [facingMode]);

  useEffect(() => {
    setPreviewUrl(null);
    const cancel = startCamera();
    return () => {
      cancel();
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureType]);

  const snap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopStream();
        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.85));
        setPhase('captured');
        onCaptured(new File([blob], `${captureType || 'capture'}.jpg`, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.85
    );
  };

  const retake = () => {
    setPreviewUrl(null);
    startCamera();
  };

  const onFilePicked = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setPhase('captured');
    onCaptured(file);
  };

  const frameStyle: React.CSSProperties = isSelfie
    ? {
        position: 'relative',
        width: 190,
        height: 190,
        borderRadius: '50%',
        background: 'var(--gbg-charcoal-600)',
        overflow: 'hidden',
        margin: '0 auto',
      }
    : {
        position: 'relative',
        height: 190,
        borderRadius: 8,
        background: 'var(--gbg-charcoal-600)',
        overflow: 'hidden',
      };

  const mediaStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(phase === 'starting' || phase === 'live' || phase === 'captured') && (
        <div style={frameStyle}>
          {/* Kept mounted (just hidden) while captured, so retake can reuse the same <video>. */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ ...mediaStyle, display: phase === 'live' ? 'block' : 'none' }}
          />
          {phase === 'captured' && previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Captured preview" style={mediaStyle} />
          )}
          {phase === 'starting' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: 'rgba(255,255,255,.7)',
              }}
            >
              Starting camera…
            </div>
          )}
          {isSelfie && phase === 'live' && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${accent}` }} />
          )}
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {phase === 'live' && (
        <button
          type="button"
          onClick={snap}
          aria-label={isSelfie ? 'Take selfie photo' : 'Capture document photo'}
          style={{
            alignSelf: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: `3px solid ${accent}`,
            background: '#fff',
            cursor: 'pointer',
          }}
        />
      )}

      {phase === 'captured' && (
        <button
          type="button"
          onClick={retake}
          style={{
            alignSelf: 'center',
            background: 'none',
            border: 'none',
            color: accent,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          Retake
        </button>
      )}

      {phase === 'filePicker' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '24px 20px',
              border: '1px dashed var(--gbg-charcoal-300)',
              borderRadius: 8,
              background: 'var(--gbg-charcoal-50)',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            <i className="ph-bold ph-camera" style={{ fontSize: 22, color: accent }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gbg-charcoal-700)' }}>
              {isSelfie ? 'Take or choose a selfie' : 'Take or choose a photo'}
            </div>
            {permissionError && (
              <div style={{ fontSize: 11, color: 'var(--gbg-charcoal-400)', textAlign: 'center' }}>
                Camera unavailable — using file picker instead.
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={facingMode}
            onChange={onFilePicked}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {!isSelfie && accepted && accepted.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {accepted.map((a) => (
            <span
              key={a}
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
              }}
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {isSelfie && phase === 'live' && (
        <div style={{ fontSize: 12, color: 'var(--gbg-charcoal-400)', textAlign: 'center' }}>
          Hold still. Look straight at the camera.
        </div>
      )}
    </div>
  );
}
