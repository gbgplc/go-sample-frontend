import { ModuleState } from '@gbg-go/onboarding-core';

const MAP: Record<ModuleState, [string, string]> = {
  Pass: ['ph-check-circle', 'var(--gbg-green-700)'],
  Running: ['ph-circle-dashed', 'var(--gbg-charcoal-400)'],
  Review: ['ph-warning-circle', 'var(--gbg-orange-700)'],
  Fail: ['ph-x-circle', 'var(--gbg-red-500)'],
  Skipped: ['ph-minus-circle', 'var(--gbg-charcoal-300)'],
};

export function moduleIconColor(state: ModuleState): { icon: string; color: string } {
  const [icon, color] = MAP[state] || MAP.Pass;
  return { icon, color };
}
