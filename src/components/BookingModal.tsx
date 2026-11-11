'use client';

import React, { useState, useEffect } from 'react';
import { useSalon } from '@/context/SalonContext';
import { SALON_INFO } from '@/data/initialData';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Send,
  ShieldCheck,
  Ban,
  AlertCircle,
  Lock,
} from 'lucide-react';

export default function BookingModal() {
  const {
    isBookingOpen,
    setIsBookingOpen,
    services,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    addAppointment,
    appointments,
    timeSlots,
    isSlotBooked,
    getOccupiedSlotsForDate,
    isDateBlocked,
    isSlotBlocked,
  } = useSalon();

  const [todayStr, setTodayStr] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:30');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+90 5');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Client-side date initialization and modal open refresh
  useEffect(() => {
    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const now = new Date();
    const today = formatDate(now);
    setTodayStr(today);

    // If today is Monday (salon is closed), default to tomorrow (Tuesday)
    let initialDate = today;
    if (now.getDay() === 1) {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      initialDate = formatDate(tomorrow);
    }

    setDate((prev) => (!prev || prev < today ? initialDate : prev));

    if (isBookingOpen) {
      setIsSuccess(false);
      setErrorMessage('');
    }
  }, [isBookingOpen]);

  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedServiceId(selectedServiceForBooking.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [selectedServiceForBooking, services, selectedServiceId]);

  // Check occupied slots for the selected date
  const occupiedSlots = getOccupiedSlotsForDate(date);

  // Auto-select first available time slot if currently selected time is occupied
  useEffect(() => {
    if (timeSlots.length > 0) {
      if (occupiedSlots.includes(time)) {
        const firstAvailable = timeSlots.find((s) => !occupiedSlots.includes(s));
        if (firstAvailable) {
          setTime(firstAvailable);
        }
      } else if (!timeSlots.includes(time)) {
        setTime(timeSlots[0]);
      }
    }
  }, [date, occupiedSlots, time, timeSlots]);

  const handleClose = () => {
    setIsBookingOpen(false);
    setSelectedServiceForBooking(null);
    setIsSuccess(false);
    setClientName('');
    setNotes('');
    setErrorMessage('');
  };

  // Keyboard Escape listener - MUST be called unconditionally before any early returns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBookingOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingOpen]);

  if (!isBookingOpen) return null;

  const currentService =
    services.find((s) => s.id === selectedServiceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Past date check
    if (date < todayStr) {
      setErrorMessage('Geçmiş bir tarihe randevu alınamaz. Lütfen bugünü veya ileri bir tarihi seçiniz.');
      return;
    }

    // 2. Closed day check
    if (isDateBlocked(date)) {
      setErrorMessage('Seçilen tarihte salonumuz randevulara kapalıdır. Lütfen açık olan başka bir gün seçiniz.');
      return;
    }

    // 3. Closed slot check
    if (isSlotBlocked(date, time)) {
      setErrorMessage(`Seçilen ${date} ${time} saati randevulara kapalıdır. Lütfen müsait olan başka bir saat seçiniz.`);
      return;
    }

    // 4. Full / Occupied slot check
    if (isSlotBooked(date, time)) {
      setErrorMessage(`Seçilen ${date} ${time} saati doludur. Lütfen müsait olan başka bir saat seçiniz.`);
      return;
    }

    if (!clientName.trim()) {
      setErrorMessage('Lütfen adınızı ve soyadınızı yazınız.');
      return;
    }
    if (!clientPhone || clientPhone.length < 10) {
      setErrorMessage('Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }

    setErrorMessage('');

    if (currentService) {
      addAppointment({
        clientName,
        clientPhone,
        serviceName: currentService.name,
        price: currentService.price,
        date,
        time,
        status: 'BEKLEMEDE',
        notes: notes || 'Online Web Sitesi Üzerinden Randevu Talebi',
      });
      setIsSuccess(true);
    }
  };

  const handleNotifyWhatsApp = () => {
    if (!currentService) return;
    let message = `*✨ SİMAY YORULMAZ HEALTH & BEAUTY - ONLİNE RANDEVU TALEBİ ✨*\n\n`;
    message += `*Danışan:* ${clientName}\n`;
    message += `*Telefon:* ${clientPhone}\n`;
    message += `*Talep Edilen İşlem:* ${currentService.name}\n`;
    message += `*İşlem Tutarı:* ${formatCurrency(currentService.price)}\n`;
    message += `*Tarih:* ${date}\n`;
    message += `*Saat:* ${time}\n`;
    if (notes) {
      message += `*Not:* ${notes}\n`;
    }
    message += `\n_Merhaba Simay Hanım, web sitenizden randevu oluşturdum. Müsaitlik durumunu teyit etmek istiyorum._`;

    const encoded = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encoded}`;
    window.open(url, '_blank');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden w-full max-w-full box-border">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-[#0F0F12] border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl text-white shadow-2xl flex flex-col max-h-[88vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 bg-black/60 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-zinc-100">
                Online Randevu Oluştur
              </h3>
              <p className="text-[11px] text-[#D4AF37]">
                {SALON_INFO.district} / {SALON_INFO.city}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1 overscroll-contain">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-white">
              Randevu Talebiniz Alındı!
            </h4>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              Talebiniz salon yönetim sistemimize kaydedildi. Randevunuzu anında onaylatmak ve Simay Hanım’a WhatsApp’tan iletmek için aşağıdaki butona dokunabilirsiniz.
            </p>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-left text-xs space-y-1.5 my-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">İşlem:</span>
                <span className="font-bold text-white">{currentService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tarih & Saat:</span>
                <span className="font-bold text-[#D4AF37]">{date} · {time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Danışan:</span>
                <span className="font-bold text-white">{clientName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleNotifyWhatsApp}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp’tan Teyit Et</span>
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Uygulanacak İşlem & Protokol</span>
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({formatCurrency(s.price)} · {s.durationMinutes} dk)
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection (Blocked for past dates) */}
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Randevu Tarihi</span>
                </span>
                <span className="text-[10px] text-zinc-500">Bugün veya ileri tarih seçiniz</span>
              </label>
              <input
                type="date"
                min={todayStr}
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrorMessage('');
                }}
                className={`w-full px-3 py-2 rounded-xl bg-zinc-950 border text-xs text-white focus:outline-none ${
                  isDateBlocked(date)
                    ? 'border-red-600 bg-red-950/20'
                    : 'border-zinc-800 focus:border-[#D4AF37]'
                }`}
              />
              {isDateBlocked(date) && (
                <div className="mt-2 p-2 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-[11px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Salonumuz bu tarihte hizmete kapalıdır. Lütfen başka bir gün seçiniz.</span>
                </div>
              )}
            </div>

            {/* Time Slot Selection (Occupied or closed slots cannot be chosen) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Saat Seçimi</span>
                </label>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Müsait</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Dolu</span>
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Kapalı</span>
                  </span>
                </div>
              </div>

              {/* Interactive Time Slot Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const isBooked = isSlotBooked(date, slot);
                  const isBlocked = isSlotBlocked(date, slot);
                  const isUnavailable = isBooked || isBlocked;
                  const isSelected = time === slot && !isUnavailable;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => {
                        setTime(slot);
                        setErrorMessage('');
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition flex flex-col items-center justify-center gap-0.5 border ${
                        isBlocked
                          ? 'bg-red-950/30 border-red-900/50 text-red-400 cursor-not-allowed opacity-60'
                          : isBooked
                          ? 'bg-zinc-950/80 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-extrabold shadow-md shadow-[#D4AF37]/20'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 cursor-pointer'
                      }`}
                      title={isBlocked ? 'Bu saat randevulara kapalıdır' : isBooked ? 'Bu saat doludur' : 'Bu saat müsait'}
                    >
                      <span className={isUnavailable ? 'line-through' : ''}>{slot}</span>
                      <span className="text-[9px] font-normal">
                        {isBlocked ? 'KAPALI' : isBooked ? 'DOLU' : 'Müsait'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {occupiedSlots.length === timeSlots.length && (
                <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
                  <Ban className="w-3 h-3" />
                  <span>Bu tarihteki tüm saatler doludur. Lütfen başka bir gün seçiniz.</span>
                </p>
              )}
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Adınız ve Soyadınız *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Telefon (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                İşlem Öncesi Notunuz (İsteğe Bağlı)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cilt hassasiyeti, tırnak modeli veya özel istek..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Price Preview Card */}
            {currentService && (
              <div className="p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400">Tahmini İşlem Bedeli</span>
                  <div className="font-extrabold text-sm text-[#D4AF37]">
                    {formatCurrency(currentService.price)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-zinc-400">
                  <span>Tahmini Süre: </span>
                  <span className="font-bold text-white">{currentService.durationMinutes} Dakika</span>
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={occupiedSlots.length === timeSlots.length}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5BF47] hover:to-[#B38F2C] text-black font-extrabold text-xs shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                <span>Randevu Talebini Onayla</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Randevularınız için ön ödeme / kapora talep edilmez.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
