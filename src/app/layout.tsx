import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SalonProvider } from '@/context/SalonContext';
import CartDrawer from '@/components/CartDrawer';
import BookingModal from '@/components/BookingModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Simay Yorulmaz Health & Beauty | Demirköy Güzellik ve Estetik Merkezi',
  description:
    'Kırklareli Demirköy’de Hydrafacial cilt bakımı, buz başlıklı lazer epilasyon, jel protez tırnak, ipek kirpik ve özel bakım protokolleri. Simay Yorulmaz.',
  manifest: '/manifest.json',
  applicationName: 'Simay Yorulmaz',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Simay Yorulmaz',
  },
  icons: {
    icon: [
      { url: '/icons/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    'Simay Yorulmaz',
    'Demirköy Güzellik Salonu',
    'Kırklareli Güzellik Merkezi',
    'Buz Lazer Epilasyon',
    'Protez Tırnak Demirköy',
    'Cilt Bakımı',
    'İpek Kirpik',
  ],
  openGraph: {
    title: 'Simay Yorulmaz Health & Beauty',
    description: 'Demirköy’ün Ayrıcalıklı Güzellik & Estetik Merkezi',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Simay Yorulmaz" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#0A0A0C] text-zinc-100 min-h-screen antialiased selection:bg-[#D4AF37] selection:text-black pb-16 sm:pb-0">
        <SalonProvider>
          {children}
          <CartDrawer />
          <BookingModal />
          <MobileBottomNav />
          <PWAInstallPrompt />
        </SalonProvider>
      </body>
    </html>
  );
}
