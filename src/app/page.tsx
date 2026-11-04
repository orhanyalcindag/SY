'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSalon } from '@/context/SalonContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkinConsultationModal from '@/components/SkinConsultationModal';
import { SALON_INFO, SALON_GALLERY_IMAGES, GOOGLE_REVIEWS_DATA } from '@/data/initialData';
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
  ArrowUpRight,
  ChevronRight,
  Award,
  Sparkle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const {
    services,
    products,
    addToCart,
    setIsBookingOpen,
    setSelectedServiceForBooking,
    setIsConsultationOpen,
    notification,
  } = useSalon();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('TÜMÜ');

  const categories: string[] = [
    'TÜMÜ',
    'Cilt Bakımı',
    'Lazer Epilasyon',
    'Protez Tırnak & Manikür',
    'İpek Kirpik & Kaş',
    'Bölgesel İncelme',
  ];

  const filteredServices =
    activeCategoryFilter === 'TÜMÜ'
      ? services
      : services.filter((s) => s.category === activeCategoryFilter);

  // Take top 3 or 4 featured products for the homepage teaser
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  const handleBookService = (service: SalonService) => {
    setSelectedServiceForBooking(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 selection:bg-[#D4AF37] selection:text-black font-sans pb-16 sm:pb-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 p-3.5 rounded-xl bg-zinc-900/95 border border-[#D4AF37] text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-right flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Rich Visuals */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-white/5">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-amber-600/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold shadow-lg shadow-[#D4AF37]/5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kırklareli Demirköy’ün Seçkin Güzellik & Estetik Merkezi</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]">
                Zarafetinizi ve Işıltınızı <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B38F2C]">
                  Uzman Dokunuşlarla
                </span>{' '}
                Keşfedin
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Simay Yorulmaz Health & Beauty; gelişmiş buz lazer epilasyon, Hydrafacial medikal cilt bakımı, protez tırnak sanatı ve kişiye özel eliksirlerle sizlere ayrıcalıklı bir deneyim sunuyor.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5BF47] hover:to-[#B38F2C] text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Online Randevu Oluştur</span>
                </button>

                <Link
                  href="/urunler"
                  className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-500/30 hover:border-emerald-500/60 flex items-center gap-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Mağazası</span>
                </Link>

                <a
                  href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-black/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hemen Ara</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-white/10">
                <div>
                  <div className="text-xl font-black text-[#D4AF37]">500+</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Mutlu Danışan</div>
                </div>
                <div>
                  <div className="text-xl font-black text-[#D4AF37]">-4°C</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Buz Lazer Konforu</div>
                </div>
                <div>
                  <div className="text-xl font-black text-[#D4AF37]">4.9 / 5</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Memnuniyet Skoru</div>
                </div>
                <div>
                  <div className="text-xl font-black text-[#D4AF37]">%100</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Klinik Hijyen</div>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Visual Card (Clean, Unobstructed) */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl shadow-[#D4AF37]/10 group bg-zinc-950">
                  <Image
                    src="/images/hero.jpg"
                    alt="Simay Yorulmaz Cilt Bakımı ve Güzellik Protokolü"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Informative Cards Cleanly Positioned Below the Image (No Overlap) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md lg:max-w-none mx-auto">
                {/* Protocol Card */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#D4AF37]/40 transition flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      Öne Çıkan Protokol
                    </span>
                    <h4 className="font-serif font-bold text-xs text-white mt-0.5">
                      Hydrafacial & Somon DNA
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-extrabold text-[11px]">
                    1.400 ₺
                  </span>
                </div>

                {/* Nail Art Card */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#D4AF37]/40 transition flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      Jel Tırnak & Nail Art
                    </span>
                    <h4 className="font-serif font-bold text-xs text-white mt-0.5">
                      Özel El Çizimi Tasarımlar
                    </h4>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Açık</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (#hizmetler) with Visual Cards */}
      <section id="hizmetler" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Klinik & Estetik Hizmet Yelpazesi</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            İşlemler ve Seans Protokolleri
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Her biri alanında uzmanlık gerektiren son teknoloji medikal ve estetik uygulamalarımız.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
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

        {/* Rich Services Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group rounded-3xl bg-zinc-950 border border-zinc-800/90 overflow-hidden hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#D4AF37]/10"
            >
              {/* Service Visual Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/30">
                    {service.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-zinc-300 border border-white/10">
                  <Clock className="w-3 h-3 text-[#D4AF37]" />
                  <span>{service.durationMinutes} dk</span>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF37] transition">
                    {service.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">İşlem Bedeli</span>
                    <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37]">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookService(service)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-zinc-200 font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Randevu Al</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Skin Consultation CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>30 Saniyelik Akıllı Güzellik Testi</span>
            </div>
            <h3 className="font-serif text-xl sm:text-3xl font-extrabold text-white">
              Hangi Bakımın Size Uygun Olduğunu Bilmiyor Musunuz?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Cilt tipinizi ve hedefinizi seçin, Simay Yorulmaz uzmanlığında hazırlanan size özel salon protokolünü ve ev devam bakımını saniyeler içinde keşfedin.
            </p>
          </div>

          <button
            onClick={() => setIsConsultationOpen(true)}
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#997929] via-[#D4AF37] to-[#F3E5AB] hover:brightness-110 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-[#D4AF37]/20 transition transform active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer relative z-10"
          >
            <Sparkles className="w-4 h-4" />
            <span>Testi Başlat & Önerini Gör</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* DEDICATED PRODUCTS TEASER SECTION (Redirects to /urunler) */}
      <section className="py-20 bg-zinc-950/70 border-y border-white/5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 right-0 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Klinik Onaylı Ev Devam Protokolleri</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                Özel Bakım Ürünleri & Serumlar
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
                Salonda yapılan işlemlerin kalıcılığını ve etkisini artıran, Simay Yorulmaz tarafından özenle seçilmiş klinik kozmetik ürünleri.
              </p>
            </div>

            {/* Direct Link to /urunler */}
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-950 transition transform active:scale-95 shrink-0"
            >
              <span>Tüm Ürünleri İncele ({products.length}+ Ürün)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Featured Products Teaser Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden hover:border-[#D4AF37]/50 transition flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full bg-black">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#D4AF37] text-black font-extrabold text-[9px] shadow-sm">
                    SEÇKİN
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-emerald-400 border border-emerald-500/30 font-semibold text-[9px]">
                    {product.inStock ? 'Stokta' : 'Tükendi'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-white group-hover:text-[#D4AF37] transition line-clamp-2">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-sm font-black text-[#D4AF37]">
                      {formatCurrency(product.price)}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner inside Teaser */}
          <div className="mt-10 p-6 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Sepete Ekleyin, WhatsApp ile Ayırtıp Dükkandan Teslim Alın
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Demirköy salonumuzda kullanılan saf klinik serum ve bakım ürünlerini sepetinize ekleyip salondan elden teslim alabilirsiniz.
                </p>
              </div>
            </div>

            <Link
              href="/urunler"
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 hover:text-white transition flex items-center gap-1.5 shrink-0"
            >
              <span>Mağaza Sayfasına Git</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About & Studio Atmosphere (#hakkimizda) */}
      <section id="hakkimizda" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs transition cursor-pointer"
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
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-800 shadow-xl group bg-zinc-950">
              <Image
                src="/images/salon-interior.jpg"
                alt="Simay Yorulmaz Butik Salon Atmosferi"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">Butik Salon Atmosferi</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-800 shadow-xl group bg-zinc-950">
                <Image
                  src="/images/manicure.jpg"
                  alt="Nail Art Protez Tırnak"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white">Steril Cihazlı Manikür</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-[#D4AF37]/30 text-center">
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

      {/* Expanded Gallery Section (#galeri) */}
      <section id="galeri" className="py-24 bg-zinc-950/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">İşlem & Salon Portfolyosu</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Görsel Galeri & Işıltılı Sonuçlar
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              Salondan kareler, protez tırnak sanatı, ipek kirpik tasarımları ve cilt bakım sonuçları.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SALON_GALLERY_IMAGES.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 shadow-md bg-zinc-950"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37]">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps & Client Reviews Section (#yorumlar) */}
      <section id="yorumlar" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Google Reviews Header Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            {/* Left: Google Brand & Score */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                {/* Google Multi-Color G Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-semibold text-zinc-300">Google Haritalar Doğrulanmış Profil</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  {GOOGLE_REVIEWS_DATA.rating}
                </span>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-zinc-400">
                  ({GOOGLE_REVIEWS_DATA.totalReviews}+ Değerlendirme)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Demirköy, İğneada ve Kırklareli’den salonumuzu ziyaret eden misafirlerimizin Google Haritalar üzerinde paylaştığı gerçek yorumlar.
              </p>
            </div>

            {/* Right: CTA to Write or View on Google */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href={GOOGLE_REVIEWS_DATA.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition"
              >
                {/* Mini Google G */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google’da Tüm Yorumları İncele</span>
              </a>

              <a
                href={GOOGLE_REVIEWS_DATA.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Siz de Google’da Yorum Yazın</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
            </div>
          </div>
        </div>

        {/* Real Reviews Grid (6 Reviews) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GOOGLE_REVIEWS_DATA.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Author Info & Avatar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${rev.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-md`}
                    >
                      {rev.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{rev.author}</h4>
                      <span className="text-[10px] text-zinc-400 block">{rev.badge}</span>
                    </div>
                  </div>

                  {/* Google G mini tag */}
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500">{rev.date}</span>
                </div>

                {/* Service Tag */}
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-semibold">
                  {rev.service}
                </span>

                {/* Review Text */}
                <p className="text-xs text-zinc-300 leading-relaxed">
                  “{rev.text}”
                </p>
              </div>

              {/* Business Owner Response if available */}
              {rev.ownerReply && (
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-[11px] space-y-1">
                  <span className="font-bold text-[#D4AF37] block">
                    İşletme Sahibinin Yanıtı (Simay Yorulmaz):
                  </span>
                  <p className="text-zinc-400 italic">
                    {rev.ownerReply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Location & Contact Section (#iletisim) */}
      <section id="iletisim" className="py-24 bg-zinc-950/60 border-t border-white/5">
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
                  className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
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

      {/* Interactive Skin Consultation Modal */}
      <SkinConsultationModal />
    </div>
  );
}
