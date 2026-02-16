import type { Metadata } from 'next';
import "./globals.css";
import Providers from './providers';
import { AuthProvider } from "@/context/AuthContext"; // 追加

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
        {/* Providersの中で包むことで、API取得(Query)も認証(Auth)も両方使えるようになります */}
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}