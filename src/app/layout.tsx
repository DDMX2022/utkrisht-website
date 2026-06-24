import './globals.css';

import Providers from '@/components/Providers';

export const metadata = {
  title: 'Utkrisht - Interior Design',
  description: 'Professional interior design services with stunning results',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='font-sans'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
