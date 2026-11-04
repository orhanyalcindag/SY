'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSalon } from '@/context/SalonContext';
import {
  Home,
  Sparkles,
  Calendar,
  ShoppingBag,
  Smartphone,
  Layers,
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartItemCount, setIsCartOpen, setIsBookingOpen } = useSalon();

  // Hide on admin page to keep admin interface clean
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleOpenInstall = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-pwa-install'));
    }
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-[#D4AF37]/30 px-2 py-1.5 pb-safe text-white shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            pathname === '/' ? 'text-[#D4AF37]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">Anasayfa</span>
        </Link>

        {/* 2. Services */}
        <Link
          href="/#hizmetler"
          className="flex flex-col items-center justify-center py-1 rounded-xl text-zinc-400 hover:text-zinc-200 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">İşlemler</span>
        </Link>

        {/* 3. Center Highlight: Online Randevu Button */}
        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
          title="Online Randevu Al"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#997929] via-[#D4AF37] to-[#F3E5AB] p-0.5 shadow-lg shadow-[#D4AF37]/30 group-active:scale-95 transition transform">
            <div className="w-full h-full bg-[#0A0A0C] rounded-full flex items-center justify-center text-[#D4AF37]">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#D4AF37] mt-1 tracking-tight">
            Randevu
          </span>
        </button>

        {/* 4. Cart / Shop */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 rounded-xl text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
          title="Sepeti Aç"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#D4AF37] text-black font-black text-[9px] flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1">Sepetim</span>
        </button>

        {/* 5. Install App Trigger */}
        <button
          onClick={handleOpenInstall}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-zinc-400 hover:text-[#D4AF37] transition cursor-pointer"
          title="Uygulamayı Telefona / Ana Ekrana Ekle"
        >
          <Smartphone className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[10px] font-semibold mt-1 text-[#D4AF37]">Uygulama</span>
        </button>
      </div>
    </nav>
  );
}
