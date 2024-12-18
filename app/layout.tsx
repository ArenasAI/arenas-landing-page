import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Dela_Gothic_One } from 'next/font/google'
import { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import Navigation from '@/components/Navigation';
import Footer from '@/components/footer';
import ClientWrapper from '@/components/client-wrapper';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Arenas AI - Your Personal Data Analyst",
  description: "Get rid of Excel forever!"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">
          <ClientWrapper>
          <Navigation />
          {children}
          </ClientWrapper>
        </main>
      </body>
    </html>
  );
}
