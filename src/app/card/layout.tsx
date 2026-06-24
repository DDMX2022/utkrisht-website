import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Utkrisht – Digital Business Card',
  description:
    'Utkrisht Interiors – Vastu-compliant interior design solutions. Save our contact or share our card.',
  openGraph: {
    title: 'Utkrisht – Digital Business Card',
    description:
      'Transforming spaces with innovative, Vastu-compliant interior design solutions.',
    url: '/card',
    siteName: 'Utkrisht',
    type: 'website',
  },
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
