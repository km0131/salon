import type { Metadata } from 'next'; // 型をインポート
import "./globals.css";
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Salon App',
  description: 'Salon Management System',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}