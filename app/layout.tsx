import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.scss';

const roboto = Roboto({ weight: ['300', '400', '700'], subsets: ['cyrillic'] });

export const metadata: Metadata = {
  title: 'Jellyfin Vidaa OS App',
  description: 'Jellyfin Vidaa OS App built with NextJS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className} style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
