import { OnboardingClient } from './OnboardingClient';
import { config, fixtures } from '../onboarding.config';

export default function Page() {
  return <OnboardingClient config={config} fixtures={fixtures} />;
}
