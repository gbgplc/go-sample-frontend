import { AppConfig, MockMarketFixtures, MockStepDef } from '@gbg-go/onboarding-core';

export const config: AppConfig = {
  brand: 'Meridian Health',
  mark: 'M',
  tagline: 'Patient record registration',
  accent: '#219C4C',
  accentSoft: '#C7EBD5',
  helpLine: 'Reception can verify you in person with the same documents.',
  journeyName: 'Patient record access',
  resourceId: 'jny_patient_record_v3@latest',
};

// Shared prefix — identical for both the "myself" and "carer" scenarios;
// the choice on the second step is what branches them apart.
const prefix: MockStepDef[] = [
  {
    kind: 'intro',
    stage: 'Start',
    title: 'Verify your identity to see your health record',
    body: 'Meridian confirms who you are before showing your record. About three minutes.',
    note: 'You can also bring ID to reception and verify in person.',
    cta: 'Start',
  },
  {
    kind: 'choice',
    stage: 'Who',
    title: 'Who are you registering?',
    body: 'Both routes ask for the same identity checks. Acting for someone else adds one document.',
    options: [
      { value: 'self', label: 'Myself', detail: 'You are the patient', icon: 'ph-user', branchTo: 'self' },
      {
        value: 'carer',
        label: 'Someone I care for',
        detail: 'You hold parental responsibility or a lasting power of attorney',
        icon: 'ph-users-three',
        branchTo: 'carer',
      },
    ],
  },
];

const selfSteps: MockStepDef[] = [
  ...prefix,
  {
    kind: 'form',
    stage: 'Details',
    title: 'Your details',
    body: 'We match these against national records to find your patient file.',
    cta: 'Continue',
    modules: ['Data Verification'],
    fields: [
      { name: 'fullName', label: 'Full name', placeholder: 'Priya Raman' },
      { name: 'dateOfBirth', label: 'Date of birth', type: 'date', placeholder: 'DD / MM / YYYY' },
      { name: 'postcode', label: 'Postcode', type: 'postcode', placeholder: 'SE1 7TP' },
      {
        name: 'nhsNumber',
        label: 'NHS number',
        placeholder: '000 000 0000',
        helperText: 'Optional. Ten digits, on your medical card.',
      },
    ],
  },
  {
    kind: 'choice',
    stage: 'Route',
    title: 'How would you like to verify?',
    body: 'A digital ID you already hold is quickest. Scanning a document works if you have none.',
    modules: ['Digital Identity Insights'],
    options: [
      {
        value: 'digital',
        label: 'Use a digital ID',
        detail: 'Post Office EasyID, Yoti, or a bank ID you already hold',
        icon: 'ph-identification-badge',
      },
      {
        value: 'document',
        label: 'Scan a photo ID',
        detail: 'Passport, driving licence or biometric residence permit',
        icon: 'ph-scan',
      },
    ],
  },
  {
    kind: 'capture',
    captureType: 'document',
    stage: 'Document',
    title: 'Scan your photo ID',
    body: 'We check the document is genuine and read the details from it.',
    accepted: ['Passport', 'Driving licence', 'Biometric residence permit'],
    cta: 'Scan document',
    modules: ['Document Authentication', 'Document Extraction'],
  },
  {
    kind: 'capture',
    captureType: 'selfie',
    stage: 'Biometrics',
    title: 'Take a selfie',
    body: 'This proves you are the person in the document, so nobody else can open your record.',
    cta: 'Take selfie',
    modules: ['Liveness Verification', 'Facematch Verification'],
  },
  {
    kind: 'consent',
    stage: 'Consent',
    title: 'Share your record with Meridian Health',
    body: 'You decide what each group can see. You can change any of this later in settings.',
    cta: 'Agree and continue',
    checks: [
      {
        name: 'shareWithClinicians',
        label: 'Show my record to clinicians treating me',
        detail: 'GP notes, test results, prescriptions and referrals',
        defaultChecked: true,
      },
      {
        name: 'sharePrescriptions',
        label: 'Share prescriptions with my chosen pharmacy',
        detail: 'Only the pharmacy you name',
      },
      { name: 'useForResearch', label: 'Use my data for research', detail: 'Anonymised, optional, and unrelated to your care' },
    ],
  },
  {
    kind: 'result',
    stage: 'Decision',
    title: 'Record linked',
    decision: 'pass',
    timing: 'Verified in 9 seconds',
    body: 'You can now see appointments, test results and prescriptions in your Meridian account.',
    cta: 'Open my record',
    moduleRuns: [
      { label: 'Data Verification', state: 'Pass', ms: '1.1s' },
      { label: 'Document Authentication', state: 'Pass', ms: '2.4s' },
      { label: 'Facematch Verification', state: 'Pass', ms: '1.3s' },
      { label: 'Liveness Verification', state: 'Pass', ms: '2.9s' },
    ],
    recordNote:
      'Your identity evidence is held separately from your medical record. Ask the practice for a copy, or to delete it once registration is complete.',
    summary: [
      { k: 'Journey', v: 'Patient record access · v3' },
      { k: 'Reference', v: 'MH-VER-77341' },
      { k: 'Verified', v: '26 Aug 2026 08:17:44' },
      { k: 'Total time', v: '9.2 seconds' },
      { k: 'Modules run', v: '6 of 6' },
      { k: 'Identity route', v: 'Photo ID and selfie' },
      { k: 'Record matched', v: '1 patient file' },
      { k: 'Consent given', v: 'Clinicians and named pharmacy' },
      { k: 'Assurance level', v: 'Medium — meets practice policy' },
    ],
  },
];

const carerSteps: MockStepDef[] = [
  ...prefix,
  {
    kind: 'form',
    stage: 'Patient',
    title: 'Who are you acting for?',
    body: 'We find their record first, then verify you.',
    cta: 'Continue',
    modules: ['Data Verification'],
    fields: [
      { name: 'patientFullName', label: "Patient's full name", placeholder: 'Margaret Ellis' },
      { name: 'patientDateOfBirth', label: "Patient's date of birth", type: 'date', placeholder: 'DD / MM / YYYY' },
      { name: 'patientPostcode', label: "Patient's postcode", type: 'postcode', placeholder: 'SE1 7TP' },
      { name: 'relationship', label: 'Your relationship to them', placeholder: 'Attorney, parent, guardian' },
    ],
  },
  {
    kind: 'form',
    stage: 'Details',
    title: 'Your details',
    body: 'Now the identity checks for you, the carer.',
    cta: 'Continue',
    modules: ['Data Verification'],
    fields: [
      { name: 'fullName', label: 'Full name', placeholder: 'Daniel Ellis' },
      { name: 'dateOfBirth', label: 'Date of birth', type: 'date', placeholder: 'DD / MM / YYYY' },
      { name: 'homeAddress', label: 'Home address', placeholder: 'Start typing your postcode' },
      { name: 'mobileNumber', label: 'Mobile number', type: 'tel', placeholder: '+44' },
    ],
  },
  {
    kind: 'capture',
    captureType: 'document',
    stage: 'Document',
    title: 'Scan your photo ID',
    body: 'We check the document is genuine and read the details from it.',
    accepted: ['Passport', 'Driving licence', 'Biometric residence permit'],
    cta: 'Scan document',
    modules: ['Document Authentication', 'Document Extraction'],
  },
  {
    kind: 'capture',
    captureType: 'selfie',
    stage: 'Biometrics',
    title: 'Take a selfie',
    body: 'This proves you are the person in the document.',
    cta: 'Take selfie',
    modules: ['Liveness Verification', 'Facematch Verification'],
  },
  {
    kind: 'upload',
    stage: 'Authority',
    title: 'Proof you can act for Margaret Ellis',
    body: 'A clinician reviews this before the record is shared. It is the one step we cannot automate.',
    accepted: ['Lasting power of attorney', 'Court order', 'Clinic authorisation letter'],
    cta: 'Submit',
    modules: ['Document Attachments'],
  },
  {
    kind: 'result',
    stage: 'Decision',
    title: 'With the practice team',
    decision: 'refer',
    timing: 'Usually within one working day',
    body: 'Your identity is verified. A clinician is checking your authority to act for Margaret, and we will email you when it is approved.',
    cta: 'Done',
    moduleRuns: [
      { label: 'Data Verification', state: 'Pass', ms: '1.0s' },
      { label: 'Facematch Verification', state: 'Pass', ms: '1.3s' },
      { label: 'Document Attachments', state: 'Review' },
    ],
    recordNote: 'Nothing from Margaret’s record is shared until a clinician approves your authority.',
    summary: [
      { k: 'Journey', v: 'Patient record access · v3' },
      { k: 'Reference', v: 'MH-VER-77358' },
      { k: 'Acting for', v: 'Margaret Ellis · b. 1948' },
      { k: 'Your identity', v: 'Verified in 8.6 seconds' },
      { k: 'Modules run', v: '6 of 6' },
      { k: 'Authority document', v: 'Lasting power of attorney' },
      { k: 'Awaiting', v: 'Clinician review of authority' },
      { k: 'Outcome so far', v: 'Identity verified, access pending' },
    ],
  },
];

export const fixtures: MockMarketFixtures = {
  defaultScenarioId: 'self',
  scenarios: {
    self: { id: 'self', label: 'Patient — verified in app', steps: selfSteps },
    carer: { id: 'carer', label: 'Carer acting for a patient', steps: carerSteps },
  },
};
