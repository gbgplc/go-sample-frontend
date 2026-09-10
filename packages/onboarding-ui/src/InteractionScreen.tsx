'use client';

import { useEffect, useState } from 'react';
import { Button } from '@gbg-go/design-system';
import { AppConfig, Interaction } from '@gbg-go/onboarding-core';
import { NoteBanner, StepHeader } from './screens/StepHeader';
import { IntroScreen } from './screens/IntroScreen';
import { WelcomeCard } from './screens/WelcomeCard';
import { FormScreen } from './screens/FormScreen';
import { ChoiceScreen } from './screens/ChoiceScreen';
import { CaptureScreen } from './screens/CaptureScreen';
import { UploadScreen } from './screens/UploadScreen';
import { ConsentScreen } from './screens/ConsentScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { ResultScreen } from './screens/ResultScreen';

export interface InteractionScreenProps {
  interaction: Interaction;
  accent: string;
  accentSoft: string;
  busy: boolean;
  fieldErrors?: Record<string, string>;
  onSubmit: (data?: Record<string, unknown>) => void;
  /** Uploads the file via POST /attachments and resolves with the attachment reference to submit. */
  onUploadFile: (file: File) => Promise<string>;
  /** Supplies the intro screen's optional "who is asking, and why" content. */
  config?: AppConfig;
}

/**
 * Renders one of the eight screen kinds for the current interaction, plus
 * the shared header/note/CTA every kind takes. `choice` submits itself per
 * option and has no separate CTA — every other kind does.
 */
export function InteractionScreen({
  interaction,
  accent,
  accentSoft,
  busy,
  fieldErrors,
  onSubmit,
  onUploadFile,
  config,
}: InteractionScreenProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [consentValues, setConsentValues] = useState<Record<string, boolean>>({});
  const [attachmentRef, setAttachmentRef] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Resets on interaction.stage, not interaction.interactionId. Against a
  // live Go journey, interactionId is one value for the whole collection
  // phase (segment1@latest) — every screen from "About you" through
  // "Biometrics" shares it, because Go returns a single interaction and the
  // client splits it into screens (session.ts, GoApiClient). Resetting on it
  // never fires between screens, so a value typed on one screen was still in
  // formValues on the next, submitted alongside that screen's own fields.
  //
  // On Northbank that meant contact-details submitted MothersMaidenName,
  // Gender and NationalInsuranceNumber a second time along with the new
  // email/phone fields — Go rejected the resubmission with a bare 500
  // ("Unknown error occurred"), which reached the customer as a dead-end
  // "Something went wrong" after every screen past the first. `stage` is the
  // per-screen label ("About you", "Contact details", ...) and does change
  // on every screen, live or mock.
  useEffect(() => {
    setFormValues({});
    setAttachmentRef(null);
    setConsentValues(
      Object.fromEntries((interaction.checks || []).map((c) => [c.name, c.defaultChecked ?? false]))
    );
  }, [interaction.stage, interaction.checks]);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      setAttachmentRef(await onUploadFile(file));
    } finally {
      setUploading(false);
    }
  };

  const handlePrimaryCta = () => {
    switch (interaction.kind) {
      case 'form':
        onSubmit(formValues);
        return;
      case 'consent':
        onSubmit(consentValues);
        return;
      case 'upload':
      case 'capture':
        onSubmit({ attachmentRef });
        return;
      default:
        onSubmit({});
    }
  };

  // Checks settle in a few seconds. Past eight, say something: a spinner that
  // has not moved reads as broken, and a customer who reloads mid-verification
  // loses the journey.
  const [slowNotice, setSlowNotice] = useState<string | undefined>();
  useEffect(() => {
    if (interaction.kind !== 'processing') {
      setSlowNotice(undefined);
      return;
    }
    const timer = setTimeout(
      () => setSlowNotice('This is taking longer than usual. Please keep this page open.'),
      8000
    );
    return () => clearTimeout(timer);
  }, [interaction.kind, interaction.interactionId]);

  const showCta = interaction.kind !== 'choice' && interaction.kind !== 'processing';
  const needsAttachment = interaction.kind === 'upload' || interaction.kind === 'capture';
  const ctaDisabled = busy || uploading || (needsAttachment && !attachmentRef);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <StepHeader interaction={interaction} />

      {interaction.kind === 'intro' && (
        <>
          {config && <WelcomeCard config={config} />}
          <IntroScreen />
        </>
      )}

      {interaction.kind === 'form' && (
        <FormScreen
          fields={interaction.collects || []}
          values={formValues}
          onChange={(name, value) => setFormValues((v) => ({ ...v, [name]: value }))}
          fieldErrors={fieldErrors}
        />
      )}

      {interaction.kind === 'choice' && (
        <ChoiceScreen
          options={interaction.options || []}
          accent={accent}
          accentSoft={accentSoft}
          disabled={busy}
          onChoose={(value) => onSubmit({ value })}
        />
      )}

      {interaction.kind === 'capture' && (
        <CaptureScreen
          captureType={interaction.captureType}
          accepted={interaction.accepted}
          accent={accent}
          onCaptured={handleFile}
        />
      )}

      {interaction.kind === 'upload' && (
        <UploadScreen accepted={interaction.accepted} accent={accent} onFileSelected={handleFile} />
      )}

      {interaction.kind === 'consent' && (
        <ConsentScreen
          checks={interaction.checks || []}
          values={consentValues}
          onChange={(name, checked) => setConsentValues((v) => ({ ...v, [name]: checked }))}
        />
      )}

      {interaction.kind === 'processing' && (
        <ProcessingScreen
          moduleRuns={interaction.moduleRuns}
          accent={accent}
          onSettled={() => onSubmit({})}
          slowNotice={slowNotice}
        />
      )}

      {interaction.kind === 'result' && (
        <ResultScreen
          decision={interaction.decision}
          timing={interaction.timing}
          moduleRuns={interaction.moduleRuns}
          summary={interaction.summary}
          recordNote={interaction.recordNote}
          accent={accent}
        />
      )}

      {interaction.note && <NoteBanner note={interaction.note} accent={accent} accentSoft={accentSoft} />}

      {showCta && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <Button
            fullWidth
            disabled={ctaDisabled}
            onClick={handlePrimaryCta}
            style={{ background: accent, borderColor: accent }}
          >
            {busy ? 'Please wait…' : uploading ? 'Uploading…' : interaction.cta || 'Continue'}
          </Button>
          {interaction.secondaryCta && (
            <Button variant="text" fullWidth disabled={busy || uploading} onClick={handlePrimaryCta}>
              {interaction.secondaryCta}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
