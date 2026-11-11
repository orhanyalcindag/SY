'use client';

import React from 'react';
import { SALON_INFO } from '@/data/initialData';
import {
  MapPin,
  Navigation,
  Car,
  Clock,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';

const REGIONS = [
  { name: 'İğneada', distance: '25 km', duration: '~25 dk', route: 'İğneada - Demirköy Yolu' },
  { name: 'Vize', distance: '23 km', duration: '~22 dk', route: 'D565 Karayolu' },
  { name: 'Pınarhisar', distance: '38 km', duration: '~35 dk', route: 'Pınarhisar - Demirköy Yolu' },
  { name: 'Kırklareli Merkez', distance: '60 km', duration: '~50 dk', route: 'Pınarhisar Üzerinden' },
  { name: 'Lüleburgaz', distance: '68 km', duration: '~55 dk', route: 'Pınarhisar Bağlantısı' },
];

export default function RegionalGuide() {
  return (
    <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Trakya & Çevre İlçelerden Ulaşım</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white">
            Demirköy Salonumuza Nasıl Ulaşabilirsiniz?
          </h3>
          <p className="text-xs text-zinc-400 max-w-xl">
            İğneada, Vize, Pınarhisar ve tüm Trakya bölgesinden salonumuza konforlu ve hızlı bir şekilde ulaşabilirsiniz.
          </p>
        </div>

        <a
          href={SALON_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5BF47] text-black font-extrabold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 shrink-0 transition"
        >
          <Navigation className="w-4 h-4" />
          <span>Google Haritalarda Canlı Yol Tarifi Aç</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </a>
      </div>

      {/* Grid of travel times */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-6">
        {REGIONS.map((reg) => (
          <div
            key={reg.name}
            className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col justify-between hover:border-[#D4AF37]/40 transition"
          >
            <div>
              <span className="font-serif font-bold text-sm text-white block">
                {reg.name}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">{reg.route}</span>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">{reg.distance}</span>
              <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {reg.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Location specifics and parking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs text-zinc-300">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Merkezi Konum</strong>
            <span>İğneada Caddesi üzerinde, Demirköy merkezinde kolayca fark edilir vitrinimizle hizmetinizdeyiz.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Car className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Ücretsiz Otopark</strong>
            <span>Salonumuzun önünde ve cadde boyunca araç park etmek son derece kolay ve ücretsizdir.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Randevu ile Sıra Beklememe</strong>
            <span>Kişiye özel zamanlama protokolümüz sayesinde uzak yoldan gelen misafirlerimiz asla sıra beklemez.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
