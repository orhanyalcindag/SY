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
} from 'lucide-react';

const TIME_SLOTS = [
  '09:30',
  '10:30',
  '11:30',
  '13:00',
  '14:00',
  '15:00',
  '16:30',
  '17:30',
  '18:30',
];

export default function BookingModal() {
  const {
    isBookingOpen,
    setIsBookingOpen,
    services,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    addAppointment,
  } = useSalon();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [date, setDate] = useState('2026-11-04');
  const [time, setTime] = useState('11:30');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+90 5');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedServiceId(selectedServiceForBooking.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [selectedServiceForBooking, services, selectedServiceId]);

  if (!isBookingOpen) return null;

  const currentService =
    services.find((s) => s.id === selectedServiceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleClose = () => {
    setIsBookingOpen(false);
    setSelectedServiceForBooking(null);
    setIsSuccess(false);
    setClientName('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#0F0F12] border border-[#D4AF37]/40 rounded-2xl text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-black/60 border-b border-white/10 flex items-center justify-between">
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
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
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
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp’tan Teyit Et</span>
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {errorMessage}
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

            {/* Date and Time Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Randevu Tarihi</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Saat Seçimi</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8222] hover:from-[#E5BF47] hover:to-[#B38F2C] text-black font-extrabold text-xs shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition transform active:scale-95"
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
