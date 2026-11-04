'use client';

import React from 'react';
import Link from 'next/link';
import { SALON_INFO } from '@/data/initialData';
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Camera,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#997929] via-[#D4AF37] to-[#F3E5AB] p-[1.5px]">
                <div className="w-full h-full bg-[#0A0A0C] rounded-full flex items-center justify-center">
                  <span className="font-serif font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                    SY
                  </span>
                </div>
              </div>
              <div>
                <span className="font-serif tracking-wider font-extrabold text-lg text-white">
                  SİMAY YORULMAZ
                </span>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                  Health & Beauty · Demirköy
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              Demirköy / Kırklareli’nin öncü güzellik kulübü. Yüksek hijyen standartları, son jenerasyon cihaz parkuru ve uzman protokollerimizle doğal güzelliğinizi ön plana çıkarıyoruz.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={SALON_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition"
              >
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-medium text-xs">@{SALON_INFO.instagram}</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 hover:border-emerald-500/50 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-medium text-xs">WhatsApp Destek & Randevu</span>
              </a>
            </div>
          </div>

          {/* Quick Treatments */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold tracking-wider text-sm">
              Öne Çıkan Protokoller
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a href="#hizmetler" className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Hydrafacial Cilt Bakımı</span>
                </a>
              </li>
              <li>
                <a href="#hizmetler" className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Buz Lazer Epilasyon</span>
                </a>
              </li>
              <li>
                <a href="#hizmetler" className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Jel Protez Tırnak & Nail Art</span>
                </a>
              </li>
              <li>
                <a href="#hizmetler" className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Somon DNA Gençlik Aşısı</span>
                </a>
              </li>
              <li>
                <a href="#hizmetler" className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Volume İpek Kirpik</span>
                </a>
              </li>
              <li>
                <a href="#urunler" className="hover:text-[#D4AF37] transition flex items-center gap-1.5 text-[#D4AF37]">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Profesyonel Bakım Ürünleri</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold tracking-wider text-sm">
              İletişim & Lokasyon
            </h4>
            <div className="space-y-2.5 text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{SALON_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${SALON_INFO.phoneCall}`} className="hover:text-white transition">
                  {SALON_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{SALON_INFO.workingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-zinc-400">T.C. Sağlık & Hijyen Standartları</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© 2026 {SALON_INFO.name}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-2">
            <span>Demirköy / Kırklareli</span>
            <span>•</span>
            <span className="text-[#D4AF37]">Simay Yorulmaz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
