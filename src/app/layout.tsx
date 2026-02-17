import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Institut Biznis - Business University',
  description: 'Hybrid education platform for entrepreneurs. Learn, connect, and grow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Navigation />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
