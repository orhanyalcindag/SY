'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSalon } from '@/context/SalonContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SALON_INFO } from '@/data/initialData';
import { SalonProduct } from '@/types';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Send,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  PackageCheck,
  Phone,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const {
    products,
    addToCart,
    cartItemCount,
    cartTotal,
    setIsCartOpen,
    notification,
  } = useSalon();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('TÜMÜ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const productCategories: string[] = [
    'TÜMÜ',
    'Cilt Bakımı & Serum',
    'Güneş Koruması',
    'Tırnak & El Bakımı',
    'Kaş & Kirpik Serumu',
    'Vücut & Masaj Yağı',
  ];

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategoryFilter === 'TÜMÜ' || product.category === activeCategoryFilter;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'tr');
    // Default: featured first
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 selection:bg-[#D4AF37] selection:text-black font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 p-3.5 rounded-xl bg-zinc-900/95 border border-[#D4AF37] text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-right flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-black via-zinc-950 to-[#0A0A0C] border-b border-white/5 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#D4AF37]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-white transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anasayfa</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-[#D4AF37] font-semibold">Özel Bakım Ürünleri & WhatsApp Sipariş</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>WhatsApp ile Ayırtın & Dükkandan Teslim Alın</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
              Profesyonel Cilt & Bakım Ürünleri
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
              Simay Yorulmaz tarafından klinikte kullanılan saf formüllü serumlar, UV filtreleri, elixirlar ve kirpik güçlendiriciler. Sepetinize ekleyin, WhatsApp üzerinden ayırtıp Demirköy salonumuzdan elden teslim alın.
            </p>
          </div>

          {/* Quick Stats & Guarantees */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-zinc-300 font-medium">Orijinal Klinik Formül</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <PackageCheck className="w-4 h-4" />
              </div>
              <span className="text-zinc-300 font-medium">Dükkandan Elden Teslim</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-zinc-300 font-medium">Hızlı WhatsApp Onayı</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <Star className="w-4 h-4" />
              </div>
              <span className="text-zinc-300 font-medium">Simay Yorulmaz Tavsiyeli</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls: Search, Categories, Sort */}
        <div className="space-y-5 mb-10">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, içerik veya kategori ara (örn: C Vitamini, Güneş, Serum)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-white"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* Sort & Cart Summary Trigger */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-zinc-400 hidden sm:inline">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-zinc-200 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="featured" className="bg-zinc-900 text-white">Önerilenler</option>
                  <option value="price-asc" className="bg-zinc-900 text-white">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc" className="bg-zinc-900 text-white">Fiyat: Yüksekten Düşüğe</option>
                  <option value="name" className="bg-zinc-900 text-white">İsim: A - Z</option>
                </select>
              </div>

              {cartItemCount > 0 && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Sepeti Aç ({formatCurrency(cartTotal)})</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {productCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeCategoryFilter === cat
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Feedback */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 pb-3 border-b border-white/5">
          <span>Toplam {sortedProducts.length} adet profesyonel ürün listeleniyor</span>
          {activeCategoryFilter !== 'TÜMÜ' && (
            <span className="text-[#D4AF37] font-semibold">
              Kategori: {activeCategoryFilter}
            </span>
          )}
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-zinc-950/60 border border-zinc-800">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Ürün Bulunamadı</h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
              Arama kriterlerinize uygun ürün bulunamadı. Filtreleri temizleyerek tüm ürünleri listeleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setActiveCategoryFilter('TÜMÜ');
                setSearchQuery('');
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-zinc-950 border border-zinc-800/90 overflow-hidden hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#D4AF37]/5"
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
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#D4AF37] text-black font-extrabold text-[10px] shadow-md tracking-wider uppercase">
                      ÖNERİLEN
                    </span>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-sm border ${
                      product.inStock
                        ? 'bg-black/75 text-emerald-400 border-emerald-500/30'
                        : 'bg-black/75 text-red-400 border-red-500/30'
                    }`}
                  >
                    {product.inStock ? 'Stokta Var' : 'Tükendi'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1.5">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#D4AF37] transition leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Birim Fiyat</span>
                      <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950 flex items-center gap-1.5 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WhatsApp Help Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="font-serif text-lg font-bold text-white">
              Hangi Ürünün Cildinize Uygun Olduğunu Mu Düşünüyorsunuz?
            </h4>
            <p className="text-xs text-zinc-400 max-w-xl">
              Cilt tipinize, gözenek yapınıza veya leke durumunuza en uygun serumu belirlemek için Simay Hanım’a WhatsApp üzerinden fotoğraf göndererek ücretsiz ön danışmanlık alabilirsiniz.
            </p>
          </div>

          <a
            href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Merhaba Simay Hanım, ürünleriniz hakkında bilgi ve cilt önerisi almak istiyorum.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 shrink-0 transition"
          >
            <Phone className="w-4 h-4" />
            <span>Simay Hanım’a WhatsApp’tan Sor</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
