import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import '@gbg-go/design-system/src/tokens.css';
import '@gbg-go/onboarding-ui/src/animations.css';
import '@phosphor-icons/web/regular/style.css';
import '@phosphor-icons/web/bold/style.css';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'Northbank — open your current account',
  description: 'Identity verification for a Northbank current account, powered by GBG Go.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
