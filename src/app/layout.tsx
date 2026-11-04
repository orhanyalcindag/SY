import type { Metadata } from 'next';
import './globals.css';
import { SalonProvider } from '@/context/SalonContext';
import CartDrawer from '@/components/CartDrawer';
import BookingModal from '@/components/BookingModal';

export const metadata: Metadata = {
  title: 'Simay Yorulmaz Health & Beauty | Demirköy Güzellik ve Estetik Merkezi',
  description:
    'Kırklareli Demirköy’de Hydrafacial cilt bakımı, buz başlıklı lazer epilasyon, jel protez tırnak, ipek kirpik ve özel bakım protokolleri. Simay Yorulmaz.',
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
    description: 'Demirköy’ün Ayrıcalıklı Güzellik & Estetik Kulübü',
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
      <body className="bg-[#0A0A0C] text-zinc-100 min-h-screen antialiased selection:bg-[#D4AF37] selection:text-black">
        <SalonProvider>
          {children}
          <CartDrawer />
          <BookingModal />
        </SalonProvider>
      </body>
    </html>
  );
}
