import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.scss';

const roboto = Roboto({ weight: ['300', '400', '700'], subsets: ['cyrillic'] });

export const metadata: Metadata = {
  title: 'Jellyfin',
  description: 'Vidaa Jellyfin Client',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className} style={{ margin: 0 }}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
