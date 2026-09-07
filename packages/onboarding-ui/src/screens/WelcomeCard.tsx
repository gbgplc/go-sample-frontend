import { AppConfig } from '@gbg-go/onboarding-core';
import styles from './WelcomeCard.module.css';

/**
 * The "who is asking, and why" panel, shown once on the intro screen.
 *
 * A journey tells the customer what to do next; it never says what the
 * organisation is or why it needs a passport photograph. That gap matters
 * most at the first screen, where someone decides whether to start at all —
 * and most of all in healthcare, where the honest answer ("so nobody else
 * can read your medical record") is genuinely reassuring rather than
 * bureaucratic.
 *
 * Every field is optional. An app that configures none of them renders
 * nothing here and behaves exactly as it did before.
 */
export function WelcomeCard({ config }: { config: AppConfig }) {
  const { purpose, trustPoints, outcomes, complianceNote, accent, accentSoft } = config;
  if (!purpose && !trustPoints?.length && !outcomes?.length) return null;

  return (
    <div className={styles.card}>
      {purpose && <p className={styles.purpose}>{purpose}</p>}

      {outcomes && outcomes.length > 0 && (
        <div className={styles.outcomes} style={{ background: accentSoft }}>
          <h2 className={styles.outcomesHeading}>Once you are verified you can</h2>
          <ul className={styles.outcomeList}>
            {outcomes.map((outcome) => (
              <li key={outcome} className={styles.outcomeItem}>
                <i className="ph-bold ph-check" aria-hidden="true" style={{ color: accent }} />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {trustPoints && trustPoints.length > 0 && (
        <ul className={styles.trustList}>
          {trustPoints.map((point) => (
            <li key={point.title} className={styles.trustItem}>
              <span className={styles.trustIcon} style={{ background: accentSoft, color: accent }}>
                <i className={`ph-bold ${point.icon}`} aria-hidden="true" />
              </span>
              <span className={styles.trustText}>
                <span className={styles.trustTitle}>{point.title}</span>
                <span className={styles.trustDetail}>{point.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {complianceNote && <p className={styles.compliance}>{complianceNote}</p>}
    </div>
  );
}
