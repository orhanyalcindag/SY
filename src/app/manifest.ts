import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Simay Yorulmaz Health & Beauty',
    short_name: 'SY Beauty',
    description:
      'Simay Yorulmaz Güzellik & Estetik Merkezi - Demirköy. Randevu, Cilt Bakımı, Lazer Epilasyon ve Profesyonel Ürünler.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0C',
    theme_color: '#0A0A0C',
    orientation: 'portrait-primary',
    lang: 'tr',
    icons: [
      {
        src: '/icons/icon-96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Online Randevu Al',
        short_name: 'Randevu',
        description: 'Hızlıca yeni bir bakım veya seans randevusu oluşturun',
        url: '/?action=book',
      },
      {
        name: 'Özel Ürünler & Mağaza',
        short_name: 'Mağaza',
        description: 'Klinik serumlar ve dükkandan teslim bakım ürünleri',
        url: '/urunler',
      },
      {
        name: 'Yönetim & CRM Paneli',
        short_name: 'Yönetim',
        description: 'Salon randevu, seans ve kasa takip paneli',
        url: '/admin',
      },
    ],
  };
}
