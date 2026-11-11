'use client';

import React, { useState, useEffect } from 'react';
import { useSalon } from '@/context/SalonContext';
import { SALON_INFO } from '@/data/initialData';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Search,
  User,
  Calendar,
  Clock,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  Phone,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SalonAppointment, ClientPackage, ClientProfile } from '@/types';

export default function ClientPortalModal() {
  const {
    appointments,
    packages,
    clients,
    isClientPortalOpen,
    setIsClientPortalOpen,
    setIsBookingOpen,
  } = useSalon();

  const [phoneInput, setPhoneInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [foundAppointments, setFoundAppointments] = useState<SalonAppointment[]>([]);
  const [foundPackages, setFoundPackages] = useState<ClientPackage[]>([]);
  const [foundClient, setFoundClient] = useState<ClientProfile | null>(null);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isClientPortalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClientPortalOpen]);

  const normalizePhone = (num: string): string => {
    return num.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = normalizePhone(phoneInput);
    if (cleanQuery.length < 7) {
      return;
    }

    setHasSearched(true);

    // Search appointments
    const matchedApts = appointments.filter((a) => {
      const cleanApt = normalizePhone(a.clientPhone);
      return cleanApt.includes(cleanQuery) || cleanQuery.includes(cleanApt);
    });
    setFoundAppointments(matchedApts);

    // Search packages
    const matchedPkgs = packages.filter((p) => {
      const cleanPkg = normalizePhone(p.clientPhone);
      return cleanPkg.includes(cleanQuery) || cleanQuery.includes(cleanPkg);
    });
    setFoundPackages(matchedPkgs);

    // Search client CRM
    const matchedCli = clients.find((c) => {
      const cleanCli = normalizePhone(c.phone);
      return cleanCli.includes(cleanQuery) || cleanQuery.includes(cleanCli);
    });
    setFoundClient(matchedCli || null);
  };

  const handleClose = () => {
    setIsClientPortalOpen(false);
    setHasSearched(false);
    setPhoneInput('');
  };

  if (!isClientPortalOpen) return null;

  const clientDisplayName =
    foundClient?.name ||
    foundAppointments[0]?.clientName ||
    foundPackages[0]?.clientName ||
    'Danışanımız';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden w-full max-w-full box-border">
      {/* Backdrop */}
      <div onClick={handleClose} className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-[#0F0F12] border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl text-white shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-zinc-100">
                Danışan Randevu & Paket Portalı
              </h3>
              <p className="text-[11px] text-[#D4AF37]">
                Yaklaşan randevularınızı ve paket seanslarınızı anında sorgulayın
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Phone Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="text-xs font-bold text-zinc-300 block">
              Kayıtlı Telefon Numaranızı Giriniz
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Örn: 0532 123 45 67 veya 532..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white text-xs outline-none transition"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md transition transform active:scale-95 cursor-pointer shrink-0"
              >
                Sorgula
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              * Telefon numaranız yalnızca kendi randevu ve seans bilgilerinizi ekranda listelemek için kullanılır.
            </p>
          </form>

          {/* Results Display */}
          {hasSearched && (
            <div className="space-y-6 border-t border-white/10 pt-5">
              {/* Client Welcome Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    Danışan Dosyası
                  </span>
                  <h4 className="font-serif text-base font-bold text-white mt-0.5">
                    {clientDisplayName}
                  </h4>
                  <p className="text-xs text-zinc-400">{phoneInput}</p>
                </div>

                {foundClient && (
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Sadakat Puanı</span>
                    <div className="flex items-center gap-1 text-sm font-extrabold text-[#D4AF37]">
                      <Award className="w-4 h-4" />
                      <span>{foundClient.loyaltyPoints} SY Puan</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 1. Upcoming Appointments */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Randevularınız ({foundAppointments.length})</span>
                  </h4>
                  {foundAppointments.length > 0 && (
                    <span className="text-[10px] text-zinc-400">En güncel kayıtlar</span>
                  )}
                </div>

                {foundAppointments.length === 0 ? (
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-center">
                    <p className="text-xs text-zinc-400">
                      Bu telefon numarasına ait aktif bir randevu bulunmamaktadır.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {foundAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">
                              {apt.serviceName}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                apt.status === 'ONAYLANDI'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : apt.status === 'ISLEMDE'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : apt.status === 'TAMAMLANDI'
                                  ? 'bg-zinc-800 text-zinc-300'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-zinc-400">
                            <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
                              <Calendar className="w-3 h-3" />
                              {apt.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-white font-semibold">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              {apt.time}
                            </span>
                            <span>•</span>
                            <span>{formatCurrency(apt.price)}</span>
                          </div>

                          {apt.notes && (
                            <p className="text-[11px] text-zinc-400 italic">
                              Not: {apt.notes}
                            </p>
                          )}
                        </div>

                        <a
                          href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent(
                            `Merhaba Simay Hanım, ${apt.date} saat ${apt.time} tarihindeki ${apt.serviceName} randevum hakkında bilgi almak / güncelleme yapmak istiyorum.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-emerald-400 transition flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Send className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp Değişiklik Bildir</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Active Packages & Sessions Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Paket & Seans Takip Kartlarınız ({foundPackages.length})</span>
                  </h4>
                </div>

                {foundPackages.length === 0 ? (
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-center">
                    <p className="text-xs text-zinc-400">
                      Kayıtlı lazer veya seanslı bakım paketiniz bulunmamaktadır.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {foundPackages.map((pkg) => {
                      const remaining = pkg.totalSessions - pkg.completedSessions;
                      const percent = Math.round((pkg.completedSessions / pkg.totalSessions) * 100);

                      return (
                        <div
                          key={pkg.id}
                          className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                                {pkg.category}
                              </span>
                              <h5 className="font-serif font-bold text-sm text-white">
                                {pkg.packageName}
                              </h5>
                            </div>

                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold self-start sm:self-auto ${
                                remaining === 0
                                  ? 'bg-zinc-800 text-zinc-400'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {remaining === 0 ? 'Tamamlandı' : `${remaining} Seans Kaldı`}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                              <span>
                                {pkg.completedSessions} / {pkg.totalSessions} Seans Tamamlandı
                              </span>
                              <span className="font-bold text-white">%{percent}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-[#D4AF37] transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
                            {pkg.lastSessionDate && (
                              <span>Son Seansınız: {pkg.lastSessionDate}</span>
                            )}
                            {pkg.notes && <span className="italic">{pkg.notes}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* New Booking CTA */}
          <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <h5 className="font-serif text-xs font-bold text-white">
                Yeni Bir Randevu mu Oluşturmak İstiyorsunuz?
              </h5>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Müsait saatleri seçerek anında online randevunuzu oluşturabilirsiniz.
              </p>
            </div>
            <button
              onClick={() => {
                handleClose();
                setIsBookingOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md transition transform active:scale-95 cursor-pointer shrink-0"
            >
              Hemen Randevu Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
