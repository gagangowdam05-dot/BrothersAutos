import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'Brothers Autos | Certified Pre-Owned Cars at Best Prices',
  description:
    'Discover certified second hand cars at Brothers Autos showroom. 200-point quality checked, zero-meter tampering guarantee, instant loan approvals, and transparent RTO paperwork.',
  keywords: [
    'secondhand cars',
    'used cars showroom',
    'Brothers Autos',
    'pre-owned cars',
    'certified used cars',
    'buy used car',
    'car loan emi calculator',
    'test drive car',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
