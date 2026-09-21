import type { Metadata } from 'next';
import { Cinzel, Montserrat, Great_Vibes, Italianno, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuickViewModal from '@/components/ui/QuickViewModal';
import SizeGuideModal from '@/components/ui/SizeGuideModal';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/ui/Toast';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-serif'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script'
});

const italianno = Italianno({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-italianno'
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant'
});

export const metadata: Metadata = {
  title: 'FINESSE FASHION BY DHANI — The Art of Elegance | Luxury Couture',
  description: 'FINESSE FASHION BY DHANI is a luxury couture fashion house crafting hand-draped silk gowns, tailored co-ord sets, and embellished occasion wear in regal maroon and ivory.',
  keywords: ['luxury fashion', 'haute couture', 'silk gowns', 'co-ord sets', 'occasion wear', 'FINESSE FASHION BY DHANI', 'designer wear'],
  authors: [{ name: 'FINESSE FASHION Atelier' }],
  openGraph: {
    title: 'FINESSE FASHION BY DHANI — The Art of Elegance',
    description: 'Timeless silhouettes. Modern femininity. Explore curated luxury collections.',
    siteName: 'FINESSE FASHION BY DHANI',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable} ${greatVibes.variable} ${italianno.variable} ${cormorantGaramond.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-[#58111A] antialiased">
        <AuthProvider>
          <StoreProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <QuickViewModal />
            <SizeGuideModal />
            <Toast />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
