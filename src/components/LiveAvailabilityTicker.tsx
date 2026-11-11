'use client';

import React, { useState, useEffect } from 'react';
import { useSalon } from '@/context/SalonContext';
import { Sparkles, Clock, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LiveAvailabilityTicker() {
  const { timeSlots, getOccupiedSlotsForDate, isDateBlocked, isSlotBlocked, setIsBookingOpen } =
    useSalon();

  const [todayStr, setTodayStr] = useState<string>('');
  const [tomorrowStr, setTomorrowStr] = useState<string>('');
  const [todayAvailable, setTodayAvailable] = useState<string[]>([]);
  const [tomorrowAvailable, setTomorrowAvailable] = useState<string[]>([]);
  const [isTodayClosed, setIsTodayClosed] = useState(false);

  useEffect(() => {
    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const now = new Date();
    const tDay = formatDate(now);
    const tmrw = new Date(now);
    tmrw.setDate(now.getDate() + 1);
    const tmrwDay = formatDate(tmrw);

    setTodayStr(tDay);
    setTomorrowStr(tmrwDay);

    // Calculate today's available slots
    if (isDateBlocked(tDay)) {
      setIsTodayClosed(true);
      setTodayAvailable([]);
    } else {
      setIsTodayClosed(false);
      const occupiedToday = getOccupiedSlotsForDate(tDay);
      const availableT = timeSlots.filter(
        (slot) => !occupiedToday.includes(slot) && !isSlotBlocked(tDay, slot)
      );
      setTodayAvailable(availableT);
    }

    // Calculate tomorrow's available slots
    if (!isDateBlocked(tmrwDay)) {
      const occupiedTmrw = getOccupiedSlotsForDate(tmrwDay);
      const availableTmrw = timeSlots.filter(
        (slot) => !occupiedTmrw.includes(slot) && !isSlotBlocked(tmrwDay, slot)
      );
      setTomorrowAvailable(availableTmrw);
    } else {
      setTomorrowAvailable([]);
    }
  }, [timeSlots, getOccupiedSlotsForDate, isDateBlocked, isSlotBlocked]);

  if (!todayStr) return null;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-12">
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#D4AF37]/35 shadow-xl shadow-black/60 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Live Badge & Description */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Canlı Randevu Müsaitliği
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-wider">
                Bugün & Yarın
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {isTodayClosed
                ? 'Salonumuz bugün kapalıdır. Yarın için randevu oluşturabilirsiniz.'
                : todayAvailable.length > 0
                ? `Bugün için ${todayAvailable.length} müsait randevu saati bulunmaktadır.`
                : 'Bugünkü randevu kontenjanımız dolmuştur. Yarın için kayıt alınıyor.'}
            </p>
          </div>
        </div>

        {/* Center / Right: Quick Available Slots Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {!isTodayClosed && todayAvailable.length > 0 ? (
            <>
              <span className="text-[10px] font-semibold text-zinc-400 hidden lg:inline mr-1">
                Bugün En Yakın:
              </span>
              {todayAvailable.slice(0, 4).map((slot) => (
                <button
                  key={slot}
                  onClick={() => setIsBookingOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-[#D4AF37] border border-zinc-800 hover:border-[#D4AF37] text-zinc-200 hover:text-black font-semibold text-xs transition duration-200 flex items-center gap-1 cursor-pointer group"
                  title={`Bugün ${slot} saatine randevu al`}
                >
                  <Clock className="w-3 h-3 text-[#D4AF37] group-hover:text-black transition" />
                  <span>{slot}</span>
                </button>
              ))}
            </>
          ) : tomorrowAvailable.length > 0 ? (
            <>
              <span className="text-[10px] font-semibold text-zinc-400 hidden lg:inline mr-1">
                Yarın Müsait:
              </span>
              {tomorrowAvailable.slice(0, 4).map((slot) => (
                <button
                  key={slot}
                  onClick={() => setIsBookingOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-[#D4AF37] border border-zinc-800 hover:border-[#D4AF37] text-zinc-200 hover:text-black font-semibold text-xs transition duration-200 flex items-center gap-1 cursor-pointer group"
                  title={`Yarın ${slot} saatine randevu al`}
                >
                  <Calendar className="w-3 h-3 text-[#D4AF37] group-hover:text-black transition" />
                  <span>Yarın {slot}</span>
                </button>
              ))}
            </>
          ) : null}

          {/* Action Button */}
          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer ml-1"
          >
            <span>Hemen Randevu Seç</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
