'use client';

import { useEffect, useState } from 'react';
import { Button } from '@gbg-go/design-system';
import { AppConfig, OnboardingTransport, useOnboardingSession } from '@gbg-go/onboarding-core';
import { AppShell, ShellStage } from './shells/AppShell';
import { InteractionScreen } from './InteractionScreen';
import { ResultScreen } from './screens/ResultScreen';

export interface OnboardingAppProps {
  transport: OnboardingTransport;
  config: AppConfig;
}

/** Fallback for a transport that hasn't implemented `stagePlan` yet — grows
 *  as stages are visited instead of showing the full path up front. */
function useVisitedStages(currentStage: string | undefined): ShellStage[] {
  const [visited, setVisited] = useState<string[]>([]);
  useEffect(() => {
    if (!currentStage) return;
    setVisited((prev) => (prev[prev.length - 1] === currentStage ? prev : [...prev, currentStage]));
  }, [currentStage]);
  return visited.map((label, i) => ({ label, state: i === visited.length - 1 ? 'active' : 'done' }));
}

export function OnboardingApp({ transport, config }: OnboardingAppProps) {
  const session = useOnboardingSession(transport);
  const currentStage = session.interaction?.stage ?? (session.phase === 'decided' ? 'Decision' : undefined);
  const fallbackStages = useVisitedStages(currentStage);

  const decided = session.phase === 'decided';
  const stages: ShellStage[] = session.stagePlan
    ? session.stagePlan.map((s) => ({ label: s.label, state: decided ? 'done' : s.state }))
    : fallbackStages;

  const doneCount = stages.filter((s) => s.state === 'done').length;
  const hasActive = stages.some((s) => s.state === 'active');
  const progressPct = decided
    ? 100
    : stages.length
      ? Math.round(((doneCount + (hasActive ? 0.5 : 0)) / stages.length) * 100)
      : 4;

  const handleUploadFile = async (file: File): Promise<string> => {
    if (!session.sessionId) return '';
    const { attachmentRef } = await transport.uploadAttachment(session.sessionId, file);
    return attachmentRef;
  };

  if (session.phase === 'idle' || session.phase === 'starting') {
    return (
      <AppShell
        appName={config.brand}
        mark={config.mark}
        accent={config.accent}
        accentSoft={config.accentSoft}
        helpLine={config.helpLine}
        currentStage="Starting"
        progressPct={4}
        stages={[]}
      >
        <div style={{ fontSize: 13, color: 'var(--gbg-charcoal-400)' }}>Loading…</div>
      </AppShell>
    );
  }

  if (session.phase === 'failed') {
    return (
      <AppShell
        appName={config.brand}
        mark={config.mark}
        accent={config.accent}
        accentSoft={config.accentSoft}
        helpLine={config.helpLine}
        currentStage="Unable to continue"
        progressPct={0}
        stages={[]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gbg-charcoal-700)' }}>
            {session.error?.code === 'SESSION_EXPIRED' ? 'Your session ended' : 'Something went wrong'}
          </div>
          <p style={{ fontSize: 14, color: 'var(--gbg-charcoal-500)' }}>
            {session.error?.message || 'We could not reach the service. Try again.'}
          </p>
          <Button onClick={session.restart} style={{ background: config.accent, borderColor: config.accent }}>
            Start again
          </Button>
        </div>
      </AppShell>
    );
  }

  if (session.phase === 'decided' && session.record) {
    const r = session.record;
    return (
      <AppShell
        appName={config.brand}
        mark={config.mark}
        accent={config.accent}
        accentSoft={config.accentSoft}
        helpLine={config.helpLine}
        currentStage="Decision"
        progressPct={100}
        stages={stages}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gbg-charcoal-700)' }}>{r.title}</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--gbg-charcoal-500)' }}>{r.body}</p>
          </div>
          <ResultScreen
            decision={r.decision}
            timing={r.timing}
            moduleRuns={r.moduleRuns}
            summary={r.summary}
            recordNote={r.recordNote}
            accent={config.accent}
          />
          <Button
            fullWidth
            onClick={session.restart}
            style={{ background: config.accent, borderColor: config.accent }}
          >
            {r.cta}
          </Button>
        </div>
      </AppShell>
    );
  }

  if (!session.interaction) return null;

  return (
    <AppShell
      appName={config.brand}
      mark={config.mark}
      accent={config.accent}
      accentSoft={config.accentSoft}
      helpLine={config.helpLine}
      currentStage={session.interaction.stage}
      progressPct={progressPct}
      stages={stages}
    >
      <InteractionScreen
        interaction={session.interaction}
        accent={config.accent}
        accentSoft={config.accentSoft}
        busy={session.phase === 'submitting'}
        fieldErrors={session.fieldErrors}
        onSubmit={session.submit}
        onUploadFile={handleUploadFile}
        config={config}
      />
    </AppShell>
  );
}
