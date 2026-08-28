import { AppConfig } from '@gbg-go/onboarding-core';
import { MockMarketFixtures, MockStepDef } from '@gbg-go/onboarding-core';

export const config: AppConfig = {
  brand: 'Northbank',
  mark: 'N',
  tagline: 'Current account opening, UK',
  accent: '#4D4DFF',
  accentSoft: '#F5F5FC',
  helpLine: 'Call 0800 000 000, or carry on in a branch with the same reference.',
  journeyName: 'UK retail account opening',
  resourceId: 'jny_uk_retail_cdd@latest',
};

// Shared prefix — identical for every banking scenario.
const prefix: MockStepDef[] = [
  {
    kind: 'intro',
    stage: 'Start',
    title: 'Open your Northbank current account',
    body: 'Four steps, about four minutes. You will need photo ID and three years of address history.',
    note: 'Northbank checks your identity with GBG. Your document images are not kept on this device.',
    cta: 'Get started',
  },
  {
    kind: 'form',
    stage: 'Details',
    eyebrow: 'Step 1 of 4',
    title: 'Your details',
    body: 'We check these against trusted consumer and government data sources. No credit footprint.',
    cta: 'Continue',
    modules: ['Data Verification'],
    fields: [
      { name: 'fullName', label: 'Full name', placeholder: 'Amara Osei' },
      { name: 'dateOfBirth', label: 'Date of birth', type: 'date', placeholder: 'DD / MM / YYYY' },
      {
        name: 'homeAddress',
        label: 'Home address',
        placeholder: 'Start typing your postcode',
        helperText: 'We will ask for earlier addresses next',
      },
      { name: 'mobileNumber', label: 'Mobile number', type: 'tel', placeholder: '+44' },
    ],
  },
  {
    kind: 'capture',
    captureType: 'document',
    stage: 'Document',
    eyebrow: 'Step 2 of 4',
    title: 'Scan your photo ID',
    body: 'Hold the document flat and fill the frame. Where your document has a chip, we read it for a stronger result.',
    accepted: ['Passport', 'UK driving licence', 'National ID card'],
    cta: 'Scan document',
    secondaryCta: 'Use a digital ID instead',
    modules: ['Document Classification', 'Document Authentication', 'Document Extraction', 'NFC Chip Authentication'],
  },
  {
    kind: 'capture',
    captureType: 'selfie',
    stage: 'Biometrics',
    eyebrow: 'Step 3 of 4',
    title: 'Take a selfie',
    body: 'We confirm a real person is present, then compare your face with the photo on your document.',
    cta: 'Take selfie',
    modules: ['Liveness Verification', 'Facematch Verification'],
  },
];

const bankRuns = (dataVerificationState: 'Pass' | 'Review') => [
  { label: 'Data Verification', state: dataVerificationState, ms: '0.9s' },
  { label: 'Document Authentication', state: 'Pass' as const, ms: '2.1s' },
  { label: 'Facematch Verification', state: 'Pass' as const, ms: '1.4s' },
  { label: 'PEPs and Sanctions', state: 'Pass' as const, ms: '1.2s' },
  { label: 'Financial Screening', state: 'Pass' as const, ms: '0.8s' },
];

const straightThrough: MockStepDef[] = [
  ...prefix,
  {
    kind: 'processing',
    stage: 'Screening',
    eyebrow: 'Step 4 of 4',
    title: 'Running your checks',
    body: 'This usually takes a few seconds.',
    modules: ['PEPs and Sanctions', 'Financial Screening', 'GBG Trust'],
    moduleRuns: [
      { label: 'Data Verification', state: 'Pass' },
      { label: 'Document Authentication', state: 'Pass' },
      { label: 'PEPs and Sanctions', state: 'Running' },
      { label: 'Financial Screening', state: 'Running' },
    ],
  },
  {
    kind: 'result',
    stage: 'Decision',
    title: 'Account opened',
    decision: 'pass',
    timing: 'Decision reached in 6 seconds',
    body: 'Your account number and sort code are in the Northbank app. Your card arrives within five working days.',
    moduleRuns: bankRuns('Pass'),
    cta: 'Go to my account',
    recordNote:
      'Download your verification record as a PDF, or ask us for it later. We keep it for six years under our AML duties.',
    summary: [
      { k: 'Journey', v: 'UK retail account opening · v12' },
      { k: 'Reference', v: 'NB-2026-004182' },
      { k: 'Started', v: '26 Aug 2026 09:41:02' },
      { k: 'Decision reached', v: '26 Aug 2026 09:41:08' },
      { k: 'Total time', v: '6.4 seconds' },
      { k: 'Modules run', v: '10 of 10' },
      { k: 'Document', v: 'UK passport · chip read' },
      { k: 'Data sources matched', v: '3 of 3' },
      { k: 'Outcome', v: 'Approved — no manual review' },
    ],
  },
];

const referral: MockStepDef[] = [
  ...prefix,
  {
    kind: 'processing',
    stage: 'Screening',
    eyebrow: 'Step 4 of 4',
    title: 'Running your checks',
    body: 'This usually takes a few seconds.',
    modules: ['PEPs and Sanctions', 'Financial Screening', 'GBG Trust'],
    moduleRuns: [
      { label: 'Data Verification', state: 'Review' },
      { label: 'Document Authentication', state: 'Pass' },
      { label: 'PEPs and Sanctions', state: 'Pass' },
      { label: 'Financial Screening', state: 'Running' },
    ],
  },
  {
    kind: 'result',
    stage: 'Decision',
    title: 'We need one more document',
    decision: 'refer',
    timing: 'Referred after 6 seconds',
    body: 'Your address did not match our data sources. Add a bank statement or utility bill dated in the last three months.',
    moduleRuns: bankRuns('Review'),
    cta: 'Add a document',
  },
  {
    kind: 'upload',
    stage: 'Proof of address',
    title: 'Proof of address',
    body: 'We read the name and address from your document and compare them with what you told us.',
    accepted: ['Bank statement — last 3 months', 'Utility bill', 'Council tax letter'],
    cta: 'Submit',
    modules: ['Proof of Address Extraction', 'Document Attachments'],
  },
  {
    kind: 'result',
    stage: 'Decision',
    title: 'With our team',
    decision: 'refer',
    timing: 'Most reviews close within two hours',
    body: 'An analyst is checking your document. We will email a.osei@example.com as soon as it is done.',
    moduleRuns: [
      { label: 'Proof of Address Extraction', state: 'Pass', ms: '1.6s' },
      { label: 'Manual review', state: 'Running' },
    ],
    cta: 'Done',
    recordNote: 'You can add another document while the review is open. We will email you either way.',
    summary: [
      { k: 'Journey', v: 'UK retail account opening · v12' },
      { k: 'Reference', v: 'NB-2026-004219' },
      { k: 'Started', v: '26 Aug 2026 14:02:11' },
      { k: 'Referred', v: '26 Aug 2026 14:02:17' },
      { k: 'Time to referral', v: '6.1 seconds' },
      { k: 'Modules run', v: '11 of 12' },
      { k: 'Referred by', v: 'Data Verification — address not matched' },
      { k: 'Evidence added', v: '1 document · proof of address' },
      { k: 'With', v: 'Northbank onboarding team' },
    ],
  },
];

export const fixtures: MockMarketFixtures = {
  defaultScenarioId: 'straight',
  scenarios: {
    straight: { id: 'straight', label: 'Straight-through', steps: straightThrough },
    refer: { id: 'refer', label: 'Referred — address mismatch', steps: referral },
  },
};
