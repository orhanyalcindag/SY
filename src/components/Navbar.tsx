'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSalon } from '@/context/SalonContext';
import { SALON_INFO } from '@/data/initialData';
import {
  ShoppingBag,
  Calendar,
  Sparkles,
  Phone,
  Menu,
  X,
  Smartphone,
  Download,
} from 'lucide-react';

export default function Navbar() {
  const { cartItemCount, setIsCartOpen, setIsBookingOpen } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#D4AF37]/20 text-white transition-all">
      {/* Top micro bar with contact & address info */}
      <div className="bg-black/90 border-b border-white/5 px-4 py-1.5 text-[11px] text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#D4AF37]">
              <Sparkles className="w-3 h-3" />
              <span className="font-semibold">{SALON_INFO.district} / {SALON_INFO.city}</span>
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline">{SALON_INFO.address}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${SALON_INFO.phoneCall}`}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-[#D4AF37] transition"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-medium">{SALON_INFO.phone}</span>
            </a>
            <span className="hidden md:inline opacity-40">|</span>
            <span className="hidden md:inline text-zinc-400">{SALON_INFO.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#997929] via-[#D4AF37] to-[#F3E5AB] p-[1.5px] shadow-lg shadow-[#D4AF37]/10 group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#0A0A0C] rounded-full flex items-center justify-center">
              <span className="font-serif font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                SY
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-wider font-extrabold text-base sm:text-lg text-zinc-100 group-hover:text-[#D4AF37] transition">
                SİMAY YORULMAZ
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]/90 -mt-0.5">
              Health & Beauty · Demirköy
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide">
          <Link href="/#hizmetler" className="text-zinc-300 hover:text-[#D4AF37] transition">
            İşlemler & Fiyatlar
          </Link>
          <Link href="/urunler" className="text-zinc-300 hover:text-[#D4AF37] transition flex items-center gap-1.5 group">
            <span>Özel Ürünler</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition">
              WhatsApp Mağaza
            </span>
          </Link>
          <Link href="/#hakkimizda" className="text-zinc-300 hover:text-[#D4AF37] transition">
            Hakkımızda
          </Link>
          <Link href="/#galeri" className="text-zinc-300 hover:text-[#D4AF37] transition">
            Galeri
          </Link>
          <Link href="/#yorumlar" className="text-zinc-300 hover:text-[#D4AF37] transition">
            Yorumlar
          </Link>
          <Link href="/#iletisim" className="text-zinc-300 hover:text-[#D4AF37] transition">
            İletişim & Konum
          </Link>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-pwa-install'));
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] hover:text-white transition cursor-pointer text-[11px] font-semibold"
            title="Mobil Uygulamayı Yükle"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Uygulama</span>
          </button>
        </nav>

        {/* Action Controls: Cart, Booking, Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer"
            title="Alışveriş Sepeti"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">Sepetim</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F2C] text-black font-extrabold text-[10px] flex items-center justify-center shadow-md animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Quick Booking CTA */}
          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5BF47] hover:to-[#B38F2C] text-black font-bold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Online Randevu</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 md:hidden"
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/98 border-b border-zinc-800 px-4 py-4 space-y-3">
          <Link
            href="/#hizmetler"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-[#D4AF37]"
          >
            İşlemler & Fiyatlar
          </Link>
          <Link
            href="/urunler"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Özel Ürünler (WhatsApp Mağaza)
          </Link>
          <Link
            href="/#hakkimizda"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-[#D4AF37]"
          >
            Hakkımızda
          </Link>
          <Link
            href="/#galeri"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-[#D4AF37]"
          >
            Galeri
          </Link>
          <Link
            href="/#yorumlar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-[#D4AF37]"
          >
            Yorumlar
          </Link>
          <Link
            href="/#iletisim"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-[#D4AF37]"
          >
            İletişim & Konum
          </Link>

          {/* Mobile App Install Button */}
          <div className="pt-2 border-t border-zinc-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-pwa-install'));
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/40 text-[#D4AF37] hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#D4AF37]" />
              <span>Mobil Uygulamayı Telefona Yükle</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
