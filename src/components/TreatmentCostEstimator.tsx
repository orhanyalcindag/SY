'use client';

import React, { useState } from 'react';
import { useSalon } from '@/context/SalonContext';
import { SALON_INFO } from '@/data/initialData';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Calendar,
  Send,
  Layers,
  Percent,
} from 'lucide-react';

interface BodyZone {
  id: string;
  name: string;
  duration: number; // minutes
  singlePrice: number;
  packagePrice: number; // 6 sessions bundle price
  category: 'Kadın & Erkek' | 'Kadın' | 'Hassas Bölge';
}

const BODY_ZONES: BodyZone[] = [
  { id: 'koltuk-alti', name: 'Koltuk Altı', duration: 15, singlePrice: 350, packagePrice: 1600, category: 'Kadın & Erkek' },
  { id: 'genital', name: 'Genital / Özel Bölge', duration: 20, singlePrice: 600, packagePrice: 2800, category: 'Hassas Bölge' },
  { id: 'tum-bacak', name: 'Tüm Bacak', duration: 45, singlePrice: 1100, packagePrice: 5200, category: 'Kadın & Erkek' },
  { id: 'yarim-bacak', name: 'Yarım Bacak', duration: 25, singlePrice: 650, packagePrice: 3100, category: 'Kadın & Erkek' },
  { id: 'tum-kol', name: 'Tüm Kol', duration: 30, singlePrice: 650, packagePrice: 3100, category: 'Kadın & Erkek' },
  { id: 'yarim-kol', name: 'Yarım Kol', duration: 20, singlePrice: 400, packagePrice: 1900, category: 'Kadın & Erkek' },
  { id: 'yuz-biyik', name: 'Tüm Yüz / Bıyık & Çene', duration: 15, singlePrice: 350, packagePrice: 1600, category: 'Kadın & Erkek' },
  { id: 'sirt-gogus', name: 'Sırt veya Göğüs Bölgesi', duration: 35, singlePrice: 900, packagePrice: 4300, category: 'Kadın & Erkek' },
  { id: 'gobek-bel', name: 'Göbek / Bel Çevresi', duration: 20, singlePrice: 450, packagePrice: 2100, category: 'Kadın & Erkek' },
];

export default function TreatmentCostEstimator() {
  const { setIsBookingOpen, setSelectedServiceForBooking, services } = useSalon();
  const [selectedZones, setSelectedZones] = useState<string[]>(['koltuk-alti', 'tum-bacak', 'genital']);
  const [sessionCount, setSessionCount] = useState<6 | 8>(6);

  const toggleZone = (id: string) => {
    setSelectedZones((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllPopular = () => {
    setSelectedZones(['koltuk-alti', 'genital', 'tum-bacak']);
  };

  const handleSelectFullBody = () => {
    setSelectedZones(['koltuk-alti', 'genital', 'tum-bacak', 'tum-kol', 'yuz-biyik']);
  };

  // Calculations
  const activeZoneObjects = BODY_ZONES.filter((z) => selectedZones.includes(z.id));
  const totalDuration = activeZoneObjects.reduce((acc, z) => acc + z.duration, 0);
  const totalSinglePerSession = activeZoneObjects.reduce((acc, z) => acc + z.singlePrice, 0);
  
  // Package calculation
  const totalSingleForNSessions = totalSinglePerSession * sessionCount;
  // Apply bundle discount
  const basePackageTotal = activeZoneObjects.reduce(
    (acc, z) => acc + (sessionCount === 6 ? z.packagePrice : Math.round(z.packagePrice * 1.25)),
    0
  );
  // Combo extra discount if 3 or more zones selected
  const comboDiscountMultiplier = activeZoneObjects.length >= 4 ? 0.9 : activeZoneObjects.length >= 3 ? 0.95 : 1.0;
  const finalPackagePrice = Math.round(basePackageTotal * comboDiscountMultiplier);
  const totalSavings = totalSingleForNSessions - finalPackagePrice;

  const handleBooking = () => {
    const laserService = services.find((s) => s.category === 'Lazer Epilasyon') || services[2];
    setSelectedServiceForBooking(laserService);
    setIsBookingOpen(true);
  };

  const handleWhatsAppQuotation = () => {
    const zoneNames = activeZoneObjects.map((z) => z.name).join(', ');
    let msg = `*✨ SİMAY YORULMAZ HEALTH & BEAUTY - LAZER PAKET HESAPLAMASI ✨*\n\n`;
    msg += `*Seçilen Bölgeler:* ${zoneNames}\n`;
    msg += `*Tahmini Seans Süresi:* ${totalDuration} Dakika\n`;
    msg += `*Seans Adedi:* ${sessionCount} Seans Paket\n`;
    msg += `*Tek Seans Toplamı:* ${formatCurrency(totalSinglePerSession)}\n`;
    msg += `*Avantajlı Paket Fiyatı:* ${formatCurrency(finalPackagePrice)}\n`;
    msg += `*Toplam Avantaj:* ${formatCurrency(totalSavings)} Tasarruf\n\n`;
    msg += `_Merhaba Simay Hanım, web sitenizdeki lazer hesaplama sihirbazı üzerinden bu paketi inceledim. Müsaitlik durumu ve randevu için görüşebilir miyiz?_`;

    window.open(`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="hesaplayici" className="py-24 bg-zinc-950/60 border-t border-white/5 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Kişiselleştirilmiş Lazer Sihirbazı</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Lazer Epilasyon & Paket Maliyet Hesaplayıcı
          </h2>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            İşlem yaptırmak istediğiniz bölgeleri seçin; anlık seans süresini, önerilen seans sayısını ve tek seansa kıyasla paket avantajınızı şeffafça hesaplayın.
          </p>

          {/* Quick Combo Presets */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleSelectAllPopular}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[#D4AF37]/40 text-xs text-[#D4AF37] font-semibold transition"
            >
              ★ Popüler Altın Üçlü (Koltuk Altı + Genital + Bacak)
            </button>
            <button
              onClick={handleSelectFullBody}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-semibold transition"
            >
              Tüm Vücut Full Paket
            </button>
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Zone Selector Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Uygulama Bölgeleri ({selectedZones.length} Seçili)
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">Paket Tercihi:</span>
                <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setSessionCount(6)}
                    className={`px-2.5 py-0.5 rounded-md font-bold text-xs transition ${
                      sessionCount === 6 ? 'bg-[#D4AF37] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    6 Seans
                  </button>
                  <button
                    onClick={() => setSessionCount(8)}
                    className={`px-2.5 py-0.5 rounded-md font-bold text-xs transition ${
                      sessionCount === 8 ? 'bg-[#D4AF37] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    8 Seans VIP
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BODY_ZONES.map((zone) => {
                const isSelected = selectedZones.includes(zone.id);
                return (
                  <div
                    key={zone.id}
                    onClick={() => toggleZone(zone.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {zone.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                          <Clock className="w-3 h-3 text-[#D4AF37]" />
                          <span>~{zone.duration} Dakika</span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                            : 'border-zinc-700 bg-zinc-900'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-zinc-400">Tek Seans:</span>
                      <span className="font-semibold text-zinc-200">{formatCurrency(zone.singlePrice)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3 text-xs text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Simay Yorulmaz salonunda -15°C gerçek buz başlıklı hibrit diode lazer kullanılır. 4 mevsim yanık riski olmadan, bronz tene dahi güvenle uygulanır.
              </span>
            </div>
          </div>

          {/* Right Column: Live Calculation Summary Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-950 border border-[#D4AF37]/40 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    Hesaplama Özeti
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    Kişiye Özel Lazer Paketi
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Seçili Bölge Sayısı</span>
                  <span className="font-bold text-white">{selectedZones.length} Bölge</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>Toplam Seans Süresi</span>
                  <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{totalDuration} Dakika / Seans
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>Önerilen Seans Periyodu</span>
                  <span className="font-bold text-white">4 - 6 Hafta Aralıkla</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>Seans Başına Tekil Fiyat</span>
                  <span className="font-semibold text-zinc-300">{formatCurrency(totalSinglePerSession)}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>{sessionCount} Seanslık Tekil Toplam</span>
                  <span className="line-through text-zinc-400">{formatCurrency(totalSingleForNSessions)}</span>
                </div>
              </div>

              {/* Final Package Price Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D4AF37]/15 via-black to-zinc-950 border border-[#D4AF37]/50 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Avantajlı Paket Fiyatı ({sessionCount} Seans)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1">
                    <Percent className="w-2.5 h-2.5" />
                    Tasarruf
                  </span>
                </div>

                <div className="mt-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#D4AF37]">
                  {formatCurrency(finalPackagePrice)}
                </div>

                <p className="text-[11px] text-emerald-400 font-medium mt-1">
                  Tekil seanslara göre toplam {formatCurrency(totalSavings)} tasarruf sağlarsınız.
                </p>
              </div>

              {/* Call to Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleBooking}
                  disabled={selectedZones.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5BF47] hover:to-[#B38F2C] text-black font-extrabold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Bu Paketi Ayırt & Randevu Al</span>
                </button>

                <button
                  onClick={handleWhatsAppQuotation}
                  disabled={selectedZones.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Simay Hanım’a WhatsApp ile Gönder</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-400 pt-2 border-t border-white/5">
                <span>✓ Seanslı Takip Kartı</span>
                <span>•</span>
                <span>✓ Seans Başı Ödeme İmkânı</span>
                <span>•</span>
                <span>✓ 0 Yanık Garantisi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
