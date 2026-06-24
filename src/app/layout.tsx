import './globals.css';

import Script from 'next/script';

import Providers from '@/components/Providers';

const GA_MEASUREMENT_ID = 'G-07Y55JEKL6';

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy='afterInteractive'
        />
        <Script id='ga4-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
