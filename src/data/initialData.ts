import { SalonAppointment, SalonProduct, SalonService } from '@/types';

export const SALON_INFO = {
  name: 'Simay Yorulmaz Health & Beauty',
  tagline: 'Lüks Cilt Protokolleri, Lazer Epilasyon & Profesyonel Tırnak Tasarımı',
  founder: 'Simay Yorulmaz',
  phone: '+90 553 188 88 47',
  phoneCall: '+905531888847',
  whatsappRaw: '905531888847',
  address: 'Orhaniye Mahallesi, İğneada Caddesi, No: 36/C, Demirköy / Kırklareli',
  city: 'Kırklareli',
  district: 'Demirköy',
  instagram: 'simayyorulmaz_kirklareli',
  instagramUrl: 'https://www.instagram.com/simayyorulmaz_kirklareli/',
  workingHours: 'Pazartesi - Cumartesi: 09:30 - 19:30',
  description:
    'Kırklareli Demirköy’de en yeni teknoloji cihazlar, steril klinik standartları ve kişiye özel güzellik protokolleriyle hizmet veren ayrıcalıklı güzellik ve estetik merkezi.',
};

export const INITIAL_TIME_SLOTS: string[] = [
  '09:30',
  '10:30',
  '11:30',
  '13:00',
  '14:00',
  '15:00',
  '16:30',
  '17:30',
  '18:30',
];

export const INITIAL_SERVICES: SalonService[] = [
  {
    id: 'srv-1',
    name: 'Hydrafacial Derinlemesine Medikal Cilt Bakımı',
    category: 'Cilt Bakımı',
    price: 1400,
    durationMinutes: 60,
    description: 'Vakum teknolojisiyle gözenek arındırma, salisilik asit peelingi, hyaluronik asit infüzyonu ve LED terapi.',
    image: '/images/hydrafacial.jpg',
    popular: true,
  },
  {
    id: 'srv-2',
    name: 'Somon DNA & Gençlik Işıltısı Protokolü',
    category: 'Cilt Bakımı',
    price: 2200,
    durationMinutes: 60,
    description: 'Hücre yenilenmesini tetikleyen saf polinükleotid serum ve dermapen ile sıkılaştırıcı medikal bakım.',
    image: '/images/somon-dna.jpg',
    popular: true,
  },
  {
    id: 'srv-3',
    name: 'Buz Başlıklı Hibrit Lazer Epilasyon (Tüm Vücut - 6 Seans)',
    category: 'Lazer Epilasyon',
    price: 8500,
    durationMinutes: 60,
    description: 'Acısız -4°C buz başlık teknolojisiyle 4 mevsim uygulanabilen konforlu ve etkili tüy giderme paketi.',
    image: '/images/laser.jpg',
    popular: true,
  },
  {
    id: 'srv-4',
    name: 'Jel Protez Tırnak + Özel Nail Art Tasarımı',
    category: 'Protez Tırnak & Manikür',
    price: 950,
    durationMinutes: 90,
    description: 'Şablon veya tips ile tırnak uzatma, badem/kare form ve isteğe özel el çizimi nail art.',
    image: '/images/nail-art.jpg',
    popular: true,
  },
  {
    id: 'srv-5',
    name: 'Kalıcı Oje & Medikal Kuru (Cihazlı) Manikür',
    category: 'Protez Tırnak & Manikür',
    price: 550,
    durationMinutes: 45,
    description: 'Freze uçlarla tırnak etlerini steril temizleme ve 3-4 hafta kalıcı UV jel cila uygulaması.',
    image: '/images/manicure.jpg',
    popular: false,
  },
  {
    id: 'srv-6',
    name: 'Volume İpek Kirpik (3D - 5D Rus Hacmi)',
    category: 'İpek Kirpik & Kaş',
    price: 1100,
    durationMinutes: 90,
    description: 'Ağırlık yapmayan ultra hafif vizon ipek liflerle göz yapısına özel volüm tasarımı.',
    image: '/images/lashes.jpg',
    popular: true,
  },
  {
    id: 'srv-7',
    name: 'Kaş Laminasyonu & Keratin Botoks Bakımı',
    category: 'İpek Kirpik & Kaş',
    price: 650,
    durationMinutes: 45,
    description: 'Asi kaş kıllarını yukarı doğru sabitleme, keratin dolgusu ve doğal renk tonlaması.',
    image: '/images/laminasyon.jpg',
    popular: false,
  },
  {
    id: 'srv-8',
    name: 'Microblading Kıl Tekniği Kaş Tasarımı',
    category: 'Kalıcı Makyaj',
    price: 3500,
    durationMinutes: 120,
    description: 'Altın oran ölçümüyle yüz hatlarına en uygun doğal kıl tekniği pigmentasyonu (1 yıl kalıcı).',
    image: '/images/microblading.jpg',
    popular: false,
  },
  {
    id: 'srv-9',
    name: 'G5 Bölgesel Masaj & Selülit Protokolü (8 Seans)',
    category: 'Bölgesel İncelme',
    price: 4800,
    durationMinutes: 45,
    description: 'Ritmik titreşimli masaj başlığıyla kan dolaşımını hızlandırıp selülit görünümünü yok eden paket.',
    image: '/images/g5.jpg',
    popular: false,
  },
];

export const INITIAL_PRODUCTS: SalonProduct[] = [
  {
    id: 'prd-1',
    name: 'Simay Pure Radiance C Vitamini & Ferulik Serum (30ml)',
    category: 'Cilt Bakımı & Serum',
    price: 780,
    image: '/images/serum-c.jpg',
    description: '%15 saf C vitamini ve antioksidan kompleksiyle leke karşıtı, aydınlatıcı profesyonel bakım eliksiri.',
    inStock: true,
    featured: true,
  },
  {
    id: 'prd-2',
    name: 'Hyaluronik Asit 4D Yoğun Nemlendirici Eliksir (50ml)',
    category: 'Cilt Bakımı & Serum',
    price: 690,
    image: '/images/hyaluronik.jpg',
    description: '4 farklı moleküler ağırlıkta hyaluronik asit ile derinlemesine nem dolgusu, elastikiyet ve canlanma.',
    inStock: true,
    featured: true,
  },
  {
    id: 'prd-3',
    name: 'Invisible Touch SPF 50+ Mineral UV Koruyucu Krem (50ml)',
    category: 'Güneş Koruması',
    price: 620,
    image: '/images/gunes-kremi.jpg',
    description: 'Lazer ve cilt bakımı sonrası beyazlık bırakmayan, gözenek tıkamayan hafif ipeksi koruyucu.',
    inStock: true,
    featured: true,
  },
  {
    id: 'prd-4',
    name: 'Keratin & Jojoba Besleyici Tırnak & Kütikül Yağı (15ml)',
    category: 'Tırnak & El Bakımı',
    price: 320,
    image: '/images/tirnak-yagi.jpg',
    description: 'Protez tırnak ve manikür sonrası tırnak yatağını güçlendiren, çatlamayı önleyen aromatik bakım yağı.',
    inStock: true,
    featured: false,
  },
  {
    id: 'prd-5',
    name: 'Pro-Lash Peptid Kirpik & Kaş Uzatıcı Konsantre (10ml)',
    category: 'Kaş & Kirpik Serumu',
    price: 850,
    image: '/images/lash-serum.jpg',
    description: '4 haftada belirgin dolgunluk ve uzunluk sağlayan multivitamin ve biyotin destekli yenilikçi formül.',
    inStock: true,
    featured: true,
  },
  {
    id: 'prd-6',
    name: 'Biberiye & Kafein Sıkılaştırıcı Vücut Masaj Serumu (150ml)',
    category: 'Vücut & Masaj Yağı',
    price: 540,
    image: '/images/g5.jpg',
    description: 'G5 masajı sonrası selülitli bölgelere uygulanan kan akışını hızlandırıcı ve sıkılaştırıcı termal eliksir.',
    inStock: true,
    featured: false,
  },
  {
    id: 'prd-7',
    name: 'Kolajen & Retinol Hücre Yenileyici Gece Kremi (50ml)',
    category: 'Cilt Bakımı & Serum',
    price: 890,
    image: '/images/serum-c.jpg',
    description: 'Gece boyunca ince çizgileri ve kırışıklıkları onaran peptit ve tip-1 kolajen kompleksi.',
    inStock: true,
    featured: true,
  },
  {
    id: 'prd-8',
    name: 'Niasinamid %10 & Çinko Gözenek Sıkılaştırıcı Tonik (120ml)',
    category: 'Cilt Bakımı & Serum',
    price: 490,
    image: '/images/hyaluronik.jpg',
    description: 'Genişlemiş gözenekleri sıkılaştıran, sebum dengesini sağlayan ve siyah noktaları önleyen tonik.',
    inStock: true,
    featured: false,
  },
  {
    id: 'prd-9',
    name: 'Argan & E Vitamini Yoğun Onarıcı El Balsamı (75ml)',
    category: 'Tırnak & El Bakımı',
    price: 360,
    image: '/images/manicure.jpg',
    description: 'Soğuk havalarda çatlayan eller için derinlemesine besleyici, yağlı his bırakmayan yoğun bariyer krem.',
    inStock: true,
    featured: false,
  },
];

export const INITIAL_APPOINTMENTS: SalonAppointment[] = [
  {
    id: 'apt-1',
    clientName: 'Elif Karahan',
    clientPhone: '+90 532 411 22 33',
    serviceName: 'Hydrafacial Derinlemesine Medikal Cilt Bakımı',
    price: 1400,
    date: '2026-11-04',
    time: '11:00',
    status: 'ONAYLANDI',
    notes: 'Hassas cilt tipi, güneş kremi önerisi yapılacak.',
    createdAt: '2026-11-03T14:20:00Z',
  },
  {
    id: 'apt-2',
    clientName: 'Büşra Demir',
    clientPhone: '+90 544 555 66 77',
    serviceName: 'Jel Protez Tırnak + Özel Nail Art Tasarımı',
    price: 950,
    date: '2026-11-04',
    time: '13:30',
    status: 'ISLEMDE',
    notes: 'Kare form istiyor, simli french tasarım.',
    createdAt: '2026-11-03T16:10:00Z',
  },
  {
    id: 'apt-3',
    clientName: 'Selin Yıldız',
    clientPhone: '+90 533 777 88 99',
    serviceName: 'Buz Başlıklı Hibrit Lazer Epilasyon (Tüm Vücut - 6 Seans)',
    price: 8500,
    date: '2026-11-04',
    time: '15:30',
    status: 'BEKLEMEDE',
    notes: '1. seans kontrolü ve seans açılışı.',
    createdAt: '2026-11-04T08:30:00Z',
  },
  {
    id: 'apt-4',
    clientName: 'Merve Çelik',
    clientPhone: '+90 535 999 00 11',
    serviceName: 'Volume İpek Kirpik (3D - 5D Rus Hacmi)',
    price: 1100,
    date: '2026-11-04',
    time: '17:00',
    status: 'ONAYLANDI',
    notes: 'Doğal kedi gözü kıvrımı (C curl) tercih ediyor.',
    createdAt: '2026-11-04T09:15:00Z',
  },
  {
    id: 'apt-5',
    clientName: 'Zeynep Kaya',
    clientPhone: '+90 542 333 44 55',
    serviceName: 'Somon DNA & Gençlik Işıltısı Protokolü',
    price: 2200,
    date: '2026-11-03',
    time: '14:00',
    status: 'TAMAMLANDI',
    notes: 'İşlem tamamlandı, C vitamini serum satın aldı.',
    createdAt: '2026-11-02T11:00:00Z',
  },
];

export const SALON_GALLERY_IMAGES = [
  {
    id: 'gal-1',
    title: 'Hydrafacial Cilt Yenileme',
    category: 'Cilt Protokolü',
    image: '/images/hydrafacial.jpg',
  },
  {
    id: 'gal-2',
    title: 'Özel El Çizimi Nail Art Tasarımı',
    category: 'Protez Tırnak',
    image: '/images/nail-art.jpg',
  },
  {
    id: 'gal-3',
    title: 'Buz Başlıklı -4°C Konforlu Lazer Seansı',
    category: 'Lazer Epilasyon',
    image: '/images/laser.jpg',
  },
  {
    id: 'gal-4',
    title: 'Kişiselleştirilmiş Cilt Analizi & Serum Seansı',
    category: 'Medikal Bakım',
    image: '/images/somon-dna.jpg',
  },
  {
    id: 'gal-5',
    title: 'Doğal Russian Volume İpek Kirpik',
    category: 'İpek Kirpik',
    image: '/images/lashes.jpg',
  },
  {
    id: 'gal-6',
    title: 'Salon Dinlenme & Karşılama Alanı',
    category: 'Salon Atmosferi',
    image: '/images/salon-interior.jpg',
  },
  {
    id: 'gal-7',
    title: 'Medikal Kuru Cihazlı Manikür Hijyeni',
    category: 'Steril Hijyen',
    image: '/images/manicure.jpg',
  },
  {
    id: 'gal-8',
    title: 'Seçkin Kozmetik & Bakım Serumları Rafı',
    category: 'Özel Ürünler',
    image: '/images/serum-c.jpg',
  },
];

export interface GoogleReview {
  id: string;
  author: string;
  initials: string;
  avatarBg: string;
  rating: number;
  date: string;
  service: string;
  badge: string;
  text: string;
  ownerReply?: string;
}

export const GOOGLE_REVIEWS_DATA: {
  rating: number;
  totalReviews: number;
  recommendationPercent: number;
  googleMapsUrl: string;
  reviews: GoogleReview[];
} = {
  rating: 4.9,
  totalReviews: 48,
  recommendationPercent: 99,
  googleMapsUrl:
    'https://www.google.com/search?q=simay+yorulmaz+g%C3%BCzellik+salonu+demirk%C3%B6y',
  reviews: [
    {
      id: 'rev-1',
      author: 'Gizem Kaya',
      initials: 'GK',
      avatarBg: 'bg-emerald-700',
      rating: 5,
      date: '1 hafta önce',
      service: 'Buz Başlıklı Hibrit Lazer Epilasyon',
      badge: 'Yerel Rehber · 16 yorum',
      text:
        'Demirköy’de böyle nezih, tertemiz ve profesyonel bir güzellik merkezinin açılmış olması bizler için gerçekten büyük bir şans. Simay Hanım’ın güler yüzü, samimiyeti ve uzmanlığı harika. Buz lazer seanslarımda 3. seanstayım ve sonuçlar şimdiden inanılmaz. Ağrı sızı kesinlikle yok. Hijyen ve randevu dakikliği 10 numara.',
      ownerReply:
        'Sevgili Gizem Hanım, güzel yorumunuz ve güveniniz için çok teşekkür ederiz. Sizi her zaman salonumuzda ağırlamaktan mutluluk duyarız! ✨',
    },
    {
      id: 'rev-2',
      author: 'Büşra Tekin',
      initials: 'BT',
      avatarBg: 'bg-purple-700',
      rating: 5,
      date: '2 hafta önce',
      service: 'Jel Protez Tırnak & Nail Art Tasarımı',
      badge: 'Doğrulanmış Müşteri',
      text:
        'Gelin tırnaklarım ve bakımım için Simay Hanım’ı tercih ettim. Tırnaklarımdaki el çizimi altın detaylı nail art çalışmasına herkes hayran kaldı. Kullanılan tüm aletler kişiye özel tek kullanımlık paketlerden açılıyor. Temizliğe ve sterilizasyona verdikleri önem gerçekten takdire şayan. Kesinlikle tavsiye ediyorum.',
      ownerReply:
        'Mutluluğunuz bizim için en büyük ödül Büşra Hanım! Hayatınızın en özel gününde bize güvendiğiniz için teşekkür eder, ömür boyu mutluluklar dileriz.',
    },
    {
      id: 'rev-3',
      author: 'Elif Nur Arslan',
      initials: 'EA',
      avatarBg: 'bg-blue-700',
      rating: 5,
      date: '1 ay önce',
      service: 'Hydrafacial Derinlemesine Medikal Cilt Bakımı',
      badge: 'Yerel Rehber · 24 yorum',
      text:
        'Hydrafacial cilt protokolü yaptırdım. Seans öncesi ücretsiz dijital cilt analizi yapıp cildimin tam ihtiyacı olan nem ve vitamin infüzyonunu belirlediler. İşlemden sonra gözeneklerim tamamen arındı ve yüzüm ışıl ışıl parladı. Salonda önerdikleri C vitamini serumu da aldım, evde severek kullanıyorum.',
    },
    {
      id: 'rev-4',
      author: 'Selin Yıldız',
      initials: 'SY',
      avatarBg: 'bg-amber-700',
      rating: 5,
      date: '1 ay önce',
      service: 'Volume İpek Kirpik & Kaş Laminasyonu',
      badge: 'Doğrulanmış Müşteri',
      text:
        'İğneada’dan tavsiye üzerine geldim. İpek kirpik ve kaş laminasyonu yaptırdım. O kadar hafif ve doğal oldu ki gözümde hiçbir batma veya ağırlık hissetmedim. Simay Hanım işinde gerçekten tam bir profesyonel, Demirköy’de bu kalitede bir hizmet almak harika bir duygu.',
    },
    {
      id: 'rev-5',
      author: 'Merve Çelik',
      initials: 'MÇ',
      avatarBg: 'bg-rose-700',
      rating: 5,
      date: '2 ay önce',
      service: 'Somon DNA Gençlik Protokolü & Manikür',
      badge: 'Yerel Rehber · 11 yorum',
      text:
        'Salonun atmosferi, nezaketi, ferahlığı ve kahve ikramına kadar her detay çok özenli. İğneada Caddesi üzerinde konumu da çok rahat. Somon DNA protokolünden sonra cildimdeki elastikiyet ve canlılık hemen fark edildi. Manikür uygulaması da son derece steril ve cihazlı yapılıyor.',
    },
    {
      id: 'rev-6',
      author: 'Zeynep Karahan',
      initials: 'ZK',
      avatarBg: 'bg-teal-700',
      rating: 5,
      date: '3 ay önce',
      service: 'G5 Bölgesel Masaj & Selülit Protokolü',
      badge: 'Doğrulanmış Müşteri',
      text:
        'G5 bölgesel masaj seanslarına katıldım. Simay Hanım seans sürecini çok titiz takip etti ve gözle görülür bir sıkılaşma elde ettik. Güler yüzlü yaklaşımı ve her soruma sabırla detaylı bilgi vermesi çok değerliydi. Teşekkürler Simay Yorulmaz Health & Beauty!',
    },
  ],
};
