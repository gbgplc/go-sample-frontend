import { ChoiceOption, ConsentCheck, FieldSchema, ModuleRun, ScreenKind, SummaryRow } from './types';

/**
 * A single scripted step in a mock scenario. Almost every field maps
 * straight onto `Interaction`; `result`-kind steps additionally carry
 * decision/timing/moduleRuns, and only the scenario's terminal step also
 * carries `summary` + `recordNote` — that's what flips the mock transport's
 * reported status to `Completed` and is what GET /record returns.
 */
export interface MockStepDef {
  kind: ScreenKind;
  stage: string;
  eyebrow?: string;
  title: string;
  body?: string;
  note?: string;
  cta?: string;
  secondaryCta?: string;
  captureType?: 'document' | 'selfie';
  accepted?: string[];
  fields?: FieldSchema[];
  /** branchTo maps an option's value to the scenario to continue in, at this same step index + 1. */
  options?: (ChoiceOption & { branchTo?: string })[];
  checks?: ConsentCheck[];
  modules?: string[];
  moduleRuns?: ModuleRun[];
  decision?: 'pass' | 'refer' | 'fail';
  timing?: string;
  summary?: SummaryRow[];
  recordNote?: string;
}

export interface MockScenario {
  id: string;
  label: string;
  steps: MockStepDef[];
}

export interface MockMarketFixtures {
  defaultScenarioId: string;
  scenarios: Record<string, MockScenario>;
}
