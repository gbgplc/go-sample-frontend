import { ReactNode } from 'react';
import styles from './AppShell.module.css';

export interface ShellStage {
  label: string;
  state: 'done' | 'active' | 'upcoming';
}

const STAGE_ICON: Record<ShellStage['state'], string> = {
  done: 'ph-check-circle',
  active: 'ph-circle-half',
  upcoming: 'ph-circle',
};

export interface AppShellProps {
  appName: string;
  mark: string;
  accent: string;
  accentSoft: string;
  helpLine: string;
  currentStage: string;
  /** 0–100. The client only ever knows stages it has already visited plus the
   *  current one, never the true total (screen order comes from the journey,
   *  not a client-side route table) — so this is a "you're making progress"
   *  signal, not an exact fraction. */
  progressPct: number;
  stages: ShellStage[];
  children: ReactNode;
}

export function AppShell({ appName, mark, accent, accentSoft, helpLine, currentStage, progressPct, stages, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.mobileBar}>
        <span className={styles.mobileMark} style={{ background: accent }}>
          {mark}
        </span>
        <span className={styles.mobileName}>{appName}</span>
        <span className={styles.mobileStage}>{currentStage}</span>
      </div>
      <div className={styles.mobileProgressTrack}>
        <div className={styles.mobileProgressFill} style={{ width: `${progressPct}%`, background: accent }} />
      </div>

      <div className={styles.body}>
        <aside className={styles.rail} style={{ background: accentSoft }}>
          <div className={styles.railHead}>
            <span className={styles.railMark} style={{ background: accent }}>
              {mark}
            </span>
            <span className={styles.railName}>{appName}</span>
          </div>
          <div className={styles.stageList}>
            {stages.map((s) => (
              <div key={s.label} className={styles.stageRow}>
                <i
                  className={`ph-bold ${STAGE_ICON[s.state]}`}
                  style={{
                    fontSize: 17,
                    color:
                      s.state === 'done' ? 'var(--gbg-green-700)' : s.state === 'active' ? accent : 'var(--gbg-charcoal-300)',
                  }}
                />
                <span
                  style={{
                    fontWeight: s.state === 'active' ? 700 : 500,
                    color: s.state === 'upcoming' ? 'var(--gbg-charcoal-400)' : s.state === 'active' ? 'var(--gbg-charcoal-700)' : 'var(--gbg-charcoal-500)',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.railSpacer} />
          <div>
            <div className={styles.railHelpLabel}>Need a hand?</div>
            <div className={styles.railHelpLine}>{helpLine}</div>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.mainInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}
