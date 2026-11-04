'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSalon } from '@/context/SalonContext';
import { BeforeAfterItem, ServiceCategory } from '@/types';
import { Sparkles, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function BeforeAfterSlider() {
  const { beforeAfterItems, setIsBookingOpen, setSelectedServiceForBooking, services } = useSalon();
  const [activeCategory, setActiveCategory] = useState<string>('TÜMÜ');
  const [sliderPositions, setSliderPositions] = useState<{ [key: string]: number }>({});

  const categories = ['TÜMÜ', 'Cilt Bakımı', 'Lazer Epilasyon', 'Protez Tırnak & Manikür', 'İpek Kirpik & Kaş'];

  const filteredItems = beforeAfterItems.filter(
    (item) => activeCategory === 'TÜMÜ' || item.category === activeCategory
  );

  const handleSliderChange = (id: string, value: number) => {
    setSliderPositions((prev) => ({ ...prev, [id]: value }));
  };

  const handleBookService = (category: ServiceCategory) => {
    const match = services.find((s) => s.category === category) || services[0];
    if (match) {
      setSelectedServiceForBooking(match);
      setIsBookingOpen(true);
    }
  };

  return (
    <section id="oncesi-sonrasi" className="py-20 bg-[#0A0A0C] border-t border-zinc-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerçek Sonuçlar · Öncesi & Sonrası</span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-white">
            Kusursuz Değişime Tanıklık Edin
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Simay Yorulmaz Health & Beauty protokollerinin danışanlarımızda yarattığı gözle görülür farkları kaydırıcı ile inceleyin.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Before / After Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => {
            const sliderPos = sliderPositions[item.id] !== undefined ? sliderPositions[item.id] : 50;

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800/90 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between space-y-5 group"
              >
                {/* Title & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold whitespace-nowrap">
                    {item.highlightTag}
                  </span>
                </div>

                {/* Interactive Split Slider Container */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden select-none shadow-2xl bg-black">
                  {/* "After" Image (Background) */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={item.afterImage}
                      alt={`${item.title} Sonrası`}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] font-black uppercase tracking-wider z-10">
                      Sonrası
                    </span>
                  </div>

                  {/* "Before" Image (Clipped Overlay) */}
                  <div
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                  >
                    <Image
                      src={item.beforeImage}
                      alt={`${item.title} Öncesi`}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-zinc-300 border border-zinc-700 text-[10px] font-black uppercase tracking-wider z-10">
                      Öncesi
                    </span>
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D4AF37] via-white to-[#D4AF37] pointer-events-none shadow-[0_0_10px_rgba(212,175,55,0.8)] z-20"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-7 h-7 rounded-full bg-[#0A0A0C] border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center text-[10px] font-black shadow-lg">
                      ⇔
                    </div>
                  </div>

                  {/* Native Range Input for Smooth Dragging */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                    aria-label="Öncesi ve sonrası görselini kaydır"
                  />
                </div>

                {/* Description & Action */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.sessionsCount}</span>
                    </span>
                    <span className="text-[11px] text-zinc-500">Fotoğrafı Sağa/Sola Kaydırın ⇄</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  <button
                    onClick={() => handleBookService(item.category)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#997929] via-[#D4AF37] to-[#997929] hover:brightness-110 text-black font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Bu Sonuç İçin Randevu Al</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
