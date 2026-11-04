'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSalon } from '@/context/SalonContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SALON_INFO } from '@/data/initialData';
import { SalonService } from '@/types';
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Camera,
  ArrowRight,
  Star,
  Heart,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const {
    services,
    products,
    addToCart,
    setIsBookingOpen,
    setSelectedServiceForBooking,
    notification,
  } = useSalon();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('TÜMÜ');
  const [activeProductFilter, setActiveProductFilter] = useState<string>('TÜMÜ');

  const categories: string[] = [
    'TÜMÜ',
    'Cilt Bakımı',
    'Lazer Epilasyon',
    'Protez Tırnak & Manikür',
    'İpek Kirpik & Kaş',
    'Bölgesel İncelme',
  ];

  const productCategories: string[] = [
    'TÜMÜ',
    'Cilt Bakımı & Serum',
    'Güneş Koruması',
    'Tırnak & El Bakımı',
    'Kaş & Kirpik Serumu',
    'Vücut & Masaj Yağı',
  ];

  const filteredServices =
    activeCategoryFilter === 'TÜMÜ'
      ? services
      : services.filter((s) => s.category === activeCategoryFilter);

  const filteredProducts =
    activeProductFilter === 'TÜMÜ'
      ? products
      : products.filter((p) => p.category === activeProductFilter);

  const handleBookService = (service: SalonService) => {
    setSelectedServiceForBooking(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 selection:bg-[#D4AF37] selection:text-black font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 p-3.5 rounded-xl bg-zinc-900/95 border border-[#D4AF37] text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-right flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation (Strictly no admin button) */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden border-b border-white/5">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[200px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold mb-6 shadow-lg shadow-[#D4AF37]/5 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kırklareli Demirköy’ün Ayrıcalıklı Güzellik & Estetik Kulübü</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Zarafetinizi ve Işıltınızı <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B38F2C]">
              Uzman Dokunuşlarla
            </span>{' '}
            Keşfedin
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Simay Yorulmaz Health & Beauty; gelişmiş buz lazer epilasyon, medikal cilt protokolleri, protez tırnak sanatı ve profesyonel bakımlarla sizlere ayrıcalıklı bir deneyim sunuyor.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5BF47] hover:to-[#B38F2C] text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2 transition transform active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Online Randevu Oluştur</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 font-bold text-xs sm:text-sm border border-zinc-700 hover:border-[#D4AF37]/40 flex items-center gap-2 transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp’tan Bilgi Al</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-14 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">%100 Steril Ortam</h4>
                <p className="text-[11px] text-zinc-400">Tek kullanımlık medikal hijyen</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Buz Başlıklı Lazer</h4>
                <p className="text-[11px] text-zinc-400">Acısız & 4 mevsim etkili</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Kişiye Özel Protokol</h4>
                <p className="text-[11px] text-zinc-400">Cilt tipine özel eliksirler</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">500+ Mutlu Danışan</h4>
                <p className="text-[11px] text-zinc-400">Demirköy’ün referans merkezi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (#hizmetler) */}
      <section id="hizmetler" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hizmet Yelpazesi & Fiyatlandırma</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            İşlemler ve Seans Protokolleri
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            İhtiyacınıza en uygun bakımı seçerek hızlıca randevunuzu planlayabilirsiniz.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeCategoryFilter === cat
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#D4AF37]/5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{service.durationMinutes} dk</span>
                  </div>
                </div>

                <h3 className="font-serif text-base font-bold text-white group-hover:text-[#D4AF37] transition">
                  {service.name}
                </h3>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">İşlem Bedeli</span>
                  <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37]">
                    {formatCurrency(service.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleBookService(service)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-zinc-200 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Randevu Al</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products & Shop Section (#urunler) */}
      <section id="urunler" className="py-20 bg-zinc-950/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>WhatsApp Sipariş & Doğrudan Teslimat</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Özel Bakım Ürünleri & Serumlar
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Salonda uygulanan profesyonel protokollerin devamını evinizde sürdürmeniz için Simay Yorulmaz onaylı seçkin ürünler.
            </p>

            {/* Product Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {productCategories.map((pCat) => (
                <button
                  key={pCat}
                  onClick={() => setActiveProductFilter(pCat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeProductFilter === pCat
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/30'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {pCat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden hover:border-[#D4AF37]/50 transition flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#D4AF37] text-black font-extrabold text-[10px] shadow-md">
                      ÖNERİLEN
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">
                    {product.inStock ? 'Stokta Var' : 'Tükendi'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#D4AF37] transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Fiyat</span>
                      <span className="text-base font-black text-[#D4AF37]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950 flex items-center gap-1.5 transition transform active:scale-95 disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Studio Atmosphere (#hakkimizda) */}
      <section id="hakkimizda" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simay Yorulmaz Felsefesi</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-white leading-tight">
              Demirköy’de Yüksek Standartlı <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37]">
                Güzellik & Bakım Deneyimi
              </span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Simay Yorulmaz Health & Beauty; Kırklareli Demirköy’de danışanlarına metropol standartlarında kişiselleştirilmiş estetik ve bakım hizmetleri sunma misyonuyla kurulmuştur.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Her cilt benzersizdir ilkesiyle; seans öncesi ücretsiz dijital cilt analizi gerçekleştiriyor, buz lazer epilasyondan protez tırnak sanatına kadar tüm uygulamalarımızda en kaliteli ürünleri kullanıyoruz.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs text-zinc-200">Kişiye özel tek kullanımlık törpü, manikür kitleri ve steril otoklavlama</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs text-zinc-200">Buz başlıklı -4°C acısız konforlu lazer seansları</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs text-zinc-200">Güler yüzlü, randevu saatine sadık ve butik salon konsepti</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs transition"
              >
                Hemen Randevu Al
              </button>
              <a
                href={SALON_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-zinc-200 text-xs font-semibold transition flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                <span>Instagram’da İncele</span>
              </a>
            </div>
          </div>

          {/* Visual Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80"
                alt="Simay Yorulmaz Cilt Bakımı"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80"
                  alt="Nail Art Protez Tırnak"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-[#D4AF37]/30 text-center">
                <div className="text-2xl font-black text-[#D4AF37]">4.9 / 5.0</div>
                <div className="flex justify-center gap-1 text-amber-400 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-zinc-400">Demirköy’de Müşteri Memnuniyeti</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section (#galeri) */}
      <section id="galeri" className="py-20 bg-zinc-950/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">İşlem & Salon Galerisi</span>
            <h2 className="font-serif text-3xl font-extrabold text-white mt-1">
              Işıltılı Dönüşümler
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              Salondan kareler, protez tırnak çalışmaları ve cilt bakım sonuçları.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
                alt="Cilt Bakımı Protokolü"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <span className="text-xs font-semibold text-white">Hydrafacial Seansı</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
              <Image
                src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80"
                alt="Jel Tırnak Nail Art"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <span className="text-xs font-semibold text-white">Özel Nail Art Tasarımı</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
              <Image
                src="https://images.unsplash.com/photo-1512290900672-1f02e6a39343?w=600&auto=format&fit=crop&q=80"
                alt="Lazer Epilasyon"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <span className="text-xs font-semibold text-white">Buz Başlıklı Lazer</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
              <Image
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
                alt="İpek Kirpik & Kaş"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <span className="text-xs font-semibold text-white">Volume İpek Kirpik</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section (#yorumlar) */}
      <section id="yorumlar" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Danışan Görüşleri</span>
          <h2 className="font-serif text-3xl font-extrabold text-white mt-1">
            Misafirlerimiz Ne Diyor?
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            Demirköy ve çevre ilçelerden salonumuzu tercih eden danışanlarımızın gerçek deneyimleri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              “Simay Hanım’ın ilgisi ve profesyonelliği harika. Demirköy’de böyle nezih ve kaliteli bir merkezin olması büyük şans. Cilt bakımından sonra yüzüm pırıl pırıl parladı!”
            </p>
            <div className="pt-2 border-t border-zinc-800 text-xs font-bold text-white">
              Büşra D. <span className="text-[10px] text-[#D4AF37] font-normal">· Demirköy</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              “Buz lazer seanslarına başladım, hiç acı hissetmedim. Ortam son derece temiz ve hijyenik. Tırnak yaptırmaya da geliyorum, nail art konusunda çok yetenekliler.”
            </p>
            <div className="pt-2 border-t border-zinc-800 text-xs font-bold text-white">
              Elif K. <span className="text-[10px] text-[#D4AF37] font-normal">· Kırklareli</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              “Web sitesinden sepetten C vitamini serum siparişi verdim, WhatsApp üzerinden hemen yanıtlayıp hazırladılar. Ürünler çok kaliteli, teşekkürler Simay Hanım.”
            </p>
            <div className="pt-2 border-t border-zinc-800 text-xs font-bold text-white">
              Selin Y. <span className="text-[10px] text-[#D4AF37] font-normal">· İğneada</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section (#iletisim) */}
      <section id="iletisim" className="py-20 bg-zinc-950/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>Demirköy Merkez</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                Salonumuza Bekliyoruz
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Randevulu veya bilgi almak için bizi ziyaret edebilir ya da telefon & WhatsApp üzerinden anında iletişime geçebilirsiniz.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Adres</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">{SALON_INFO.address}</p>
                    <span className="text-[11px] text-[#D4AF37]">{SALON_INFO.district} / {SALON_INFO.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Telefon & WhatsApp</h4>
                    <a href={`tel:${SALON_INFO.phoneCall}`} className="text-xs text-zinc-300 hover:text-white transition">
                      {SALON_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Clock className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Çalışma Saatleri</h4>
                    <p className="text-xs text-zinc-300">{SALON_INFO.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps / Location Info Card */}
            <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto">
                <MapPin className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Simay Yorulmaz Health & Beauty
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Demirköy İğneada Caddesi üzerinde kolay ulaşılabilir konumuyla hizmetinizde.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Simay Yorulmaz Health & Beauty Demirköy')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs transition flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Google Haritalarda Aç</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Merhaba Simay Hanım, konum ve randevu için bilgi almak istiyorum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp’tan Yaz</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
