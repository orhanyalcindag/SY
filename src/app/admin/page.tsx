'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSalon } from '@/context/SalonContext';
import { SALON_INFO } from '@/data/initialData';
import {
  ServiceCategory,
  ProductCategory,
  SalonService,
  SalonProduct,
  SalonAppointment,
} from '@/types';
import {
  Calendar,
  Clock,
  Sparkles,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  PlayCircle,
  XCircle,
  TrendingUp,
  Tag,
  DollarSign,
  ExternalLink,
  Edit2,
  User,
  Phone,
  Layers,
  ArrowRight,
  Search,
  Filter,
  Send,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  X,
  Percent,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminPage() {
  const {
    services,
    addService,
    updateService,
    deleteService,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    resetTimeSlots,
    isSlotBooked,
    getOccupiedSlotsForDate,
    notification,
  } = useSalon();

  // Active tab navigation
  const [activeTab, setActiveTab] = useState<'weekly' | 'appointments' | 'slots' | 'services' | 'products' | 'finance'>('weekly');

  // Client-safe Date initialization
  const [todayStr, setTodayStr] = useState('2026-11-04');
  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(new Date('2026-11-02T00:00:00'));
  const [weekOffset, setWeekOffset] = useState(0);

  // Quick Appointment Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('+90 5');
  const [newSelectedServiceId, setNewSelectedServiceId] = useState(services[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-11-04');
  const [newTime, setNewTime] = useState(timeSlots[0] || '11:30');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Slot Management State
  const [newSlotInput, setNewSlotInput] = useState('');

  // Weekly Dashboard Appointment Detail Modal
  const [selectedAppointment, setSelectedAppointment] = useState<SalonAppointment | null>(null);

  // Quick Booking Modal from Weekly Calendar Click
  const [isQuickBookingModalOpen, setIsQuickBookingModalOpen] = useState(false);

  // Appointment filters
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('ALL');

  // New Service Form State
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [srvName, setSrvName] = useState('');
  const [srvCategory, setSrvCategory] = useState<ServiceCategory>('Cilt Bakımı');
  const [srvPrice, setSrvPrice] = useState(1200);
  const [srvDuration, setSrvDuration] = useState(60);
  const [srvDescription, setSrvDescription] = useState('');

  // New Product Form State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [prdName, setPrdName] = useState('');
  const [prdCategory, setPrdCategory] = useState<ProductCategory>('Cilt Bakımı & Serum');
  const [prdPrice, setPrdPrice] = useState(750);
  const [prdImage, setPrdImage] = useState('/images/serum-c.jpg');
  const [prdDescription, setPrdDescription] = useState('');
  const [prdInStock, setPrdInStock] = useState(true);

  // Client-side date and monday initialization
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    setTodayStr(formattedToday);
    setNewDate(formattedToday);

    // Calculate Monday of the current week
    const day = now.getDay(); // 0 is Sunday, 1 is Monday
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekMonday(monday);
  }, []);

  // Update newTime default when timeSlots change
  useEffect(() => {
    if (timeSlots.length > 0 && !timeSlots.includes(newTime)) {
      setNewTime(timeSlots[0]);
    }
  }, [timeSlots, newTime]);

  // Financial & Stats Calculations
  const totalAppointments = appointments.length;
  const totalExpectedRevenue = appointments.reduce((sum, a) => sum + a.price, 0);
  const completedRevenue = appointments
    .filter((a) => a.status === 'TAMAMLANDI')
    .reduce((sum, a) => sum + a.price, 0);
  const pendingCount = appointments.filter((a) => a.status === 'BEKLEMEDE' || a.status === 'ONAYLANDI').length;

  // Calculate 7 days for the currently selected week
  const getWeekDays = () => {
    const targetMonday = new Date(currentWeekMonday);
    targetMonday.setDate(currentWeekMonday.getDate() + weekOffset * 7);

    const dayLabels = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const shortDayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const monthLabels = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(targetMonday);
      d.setDate(targetMonday.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const monthName = monthLabels[d.getMonth()] || `${mm}.`;
      return {
        date: d,
        dateStr,
        dayName: dayLabels[i],
        shortDayName: shortDayLabels[i],
        dayNum: dd,
        monthName,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
      };
    });
  };

  const weekDays = getWeekDays();
  const weekStartFormatted = `${weekDays[0].dayNum} ${weekDays[0].monthName}`;
  const weekEndFormatted = `${weekDays[6].dayNum} ${weekDays[6].monthName} ${weekDays[6].date.getFullYear()}`;

  // Weekly occupancy calculations
  const weekDateStrings = weekDays.map((d) => d.dateStr);
  const weekAppointments = appointments.filter(
    (a) => weekDateStrings.includes(a.date) && a.status !== 'IPTAL'
  );
  const totalWeeklySlots = timeSlots.length * 7;
  const bookedWeeklySlots = weekAppointments.length;
  const availableWeeklySlots = Math.max(0, totalWeeklySlots - bookedWeeklySlots);
  const weeklyOccupancyRate = totalWeeklySlots > 0 ? Math.round((bookedWeeklySlots / totalWeeklySlots) * 100) : 0;
  const weeklyRevenue = weekAppointments.reduce((sum, a) => sum + a.price, 0);

  // Handle Quick Booking Submit (with past date & occupied slot blocking)
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newClientName.trim()) {
      setFormError('Lütfen danışan adını ve soyadını giriniz.');
      return;
    }
    if (!newClientPhone || newClientPhone.length < 10) {
      setFormError('Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }

    // 1. Past date check
    if (newDate < todayStr) {
      setFormError('Geçmiş bir tarihe randevu kaydedilemez. Lütfen bugünü veya ileri bir tarihi seçiniz.');
      return;
    }

    // 2. Occupied slot check
    if (isSlotBooked(newDate, newTime)) {
      setFormError(`Seçilen ${newDate} tarihinde saat ${newTime} doludur. Lütfen müsait bir saat seçiniz.`);
      return;
    }

    const currentSrv = services.find((s) => s.id === newSelectedServiceId) || services[0];

    addAppointment({
      clientName: newClientName,
      clientPhone: newClientPhone,
      serviceName: currentSrv.name,
      price: currentSrv.price,
      date: newDate,
      time: newTime,
      status: 'ONAYLANDI',
      notes: newNotes || 'Yönetim Panelinden Doğrudan Kayıt',
    });

    setNewClientName('');
    setNewClientPhone('+90 5');
    setNewNotes('');
    setFormError('');
    setIsQuickBookingModalOpen(false);
  };

  // Open Quick Booking from an empty slot in the Weekly Dashboard
  const handleOpenSlotBooking = (dateStr: string, slotTime: string) => {
    if (dateStr < todayStr) return; // Ignore past dates
    setNewDate(dateStr);
    setNewTime(slotTime);
    setFormError('');
    setIsQuickBookingModalOpen(true);
  };

  // Handle Add New Time Slot
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSlotInput.trim();
    if (!trimmed) return;
    addTimeSlot(trimmed);
    setNewSlotInput('');
  };

  // Handle New Service Submit
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;

    addService({
      name: srvName,
      category: srvCategory,
      price: Number(srvPrice),
      durationMinutes: Number(srvDuration),
      description: srvDescription || `${srvName} profesyonel uygulaması.`,
      popular: false,
    });

    setSrvName('');
    setSrvDescription('');
    setIsAddServiceOpen(false);
  };

  // Handle New Product Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prdName.trim()) return;

    addProduct({
      name: prdName,
      category: prdCategory,
      price: Number(prdPrice),
      image: prdImage || '/images/serum-c.jpg',
      description: prdDescription || `${prdName} bakım ürünü.`,
      inStock: prdInStock,
      featured: true,
    });

    setPrdName('');
    setPrdDescription('');
    setIsAddProductOpen(false);
  };

  // Send WhatsApp confirmation to client
  const handleSendClientWhatsApp = (apt: SalonAppointment) => {
    let msg = `*✨ Sayın ${apt.clientName}, Simay Yorulmaz Health & Beauty Randevu Bilgilendirmesi ✨*\n\n`;
    msg += `Randevunuz teyit edilmiştir:\n`;
    msg += `📅 *Tarih:* ${apt.date}\n`;
    msg += `⏰ *Saat:* ${apt.time}\n`;
    msg += `💆‍♀️ *İşlem:* ${apt.serviceName}\n`;
    msg += `📍 *Adres:* ${SALON_INFO.address}\n\n`;
    msg += `Sorularınız veya saat değişikliği için bu hattan bize ulaşabilirsiniz. Sizi ağırlamaktan mutluluk duyacağız!`;

    const encoded = encodeURIComponent(msg);
    const cleanPhone = apt.clientPhone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, '_blank');
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(aptSearch.toLowerCase()) ||
      apt.clientPhone.includes(aptSearch) ||
      apt.serviceName.toLowerCase().includes(aptSearch.toLowerCase());
    const matchesStatus = aptStatusFilter === 'ALL' || apt.status === aptStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 p-3.5 rounded-xl bg-zinc-900 border border-[#D4AF37] text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-right flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0F0F12]/95 backdrop-blur-md border-b border-[#D4AF37]/25 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#997929] via-[#D4AF37] to-[#F3E5AB] p-[1.5px]">
            <div className="w-full h-full bg-[#0A0A0C] rounded-full flex items-center justify-center">
              <span className="font-serif font-black text-sm text-[#D4AF37]">SY</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-extrabold text-sm sm:text-base text-white">
                SİMAY YORULMAZ
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold tracking-wider">
                YÖNETİM PANELİ
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">Demirköy Salon & Kasa Otomasyonu</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/urunler"
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-emerald-400 text-xs font-semibold transition flex items-center gap-1.5"
            title="Mağazayı Yeni Sekmede Aç"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mağazayı Aç (/urunler)</span>
          </Link>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            title="Web Sitesini Görüntüle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web Sitesine Git</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Haftalık Doluluk</span>
              <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#D4AF37] mt-2">
              %{weeklyOccupancyRate}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">{bookedWeeklySlots} Dolu / {availableWeeklySlots} Boş Slot</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Aktif Seanslar</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {pendingCount}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Onaylanan veya bekleyen</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Haftalık Ciro</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">
              {formatCurrency(weeklyRevenue)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Toplam Ciro: {formatCurrency(totalExpectedRevenue)}</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Randevu Slotları</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-400 mt-2">
              {timeSlots.length} Saat / Gün
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Slotları panelden düzenleyin</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Haftalık Takvim Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Randevu Listesi & Hızlı Kayıt ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'slots'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Saat & Slot Yönetimi ({timeSlots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>İşlemler & Fiyatlar ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ürünler & WhatsApp Satış ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Kasa & Rapor</span>
          </button>
        </div>

        {/* TAB 1: WEEKLY APPOINTMENTS DASHBOARD */}
        {activeTab === 'weekly' && (
          <div className="space-y-6">
            {/* Week Switcher & Occupancy Header */}
            <div className="p-6 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-white">
                    Haftalık Randevu & Doluluk Tablosu
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold">
                    %{weeklyOccupancyRate} Doluluk
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {weekStartFormatted} — {weekEndFormatted} tarihleri arasındaki tüm seanslar ve boş saatler.
                </p>
              </div>

              {/* Week Navigation Controls */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  title="Önceki Hafta"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Önceki Hafta</span>
                </button>

                <button
                  onClick={() => setWeekOffset(0)}
                  disabled={weekOffset === 0}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    weekOffset === 0
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-bold'
                      : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  title="Mevcut Haftaya Dön"
                >
                  Bu Hafta
                </button>

                <button
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  title="Sonraki Hafta"
                >
                  <span className="hidden sm:inline">Sonraki Hafta</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekly Capacity Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <span className="text-xs text-zinc-300 font-medium">Boş & Rezerve Edilebilir</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">{availableWeeklySlots} Slot</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-sm shadow-[#D4AF37]/50" />
                  <span className="text-xs text-zinc-300 font-medium">Dolu Randevular</span>
                </div>
                <span className="text-xs font-bold text-[#D4AF37]">{bookedWeeklySlots} Seans</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <span className="text-xs text-zinc-400 font-medium">Geçmiş Tarih Koruması</span>
                </div>
                <span className="text-xs font-bold text-zinc-400">Kilitli</span>
              </div>
            </div>

            {/* Weekly Calendar Matrix */}
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-[#0F0F12]">
                      <th className="py-3 px-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider w-24 sticky left-0 bg-[#0F0F12] z-10 border-r border-zinc-800">
                        Saat
                      </th>
                      {weekDays.map((day) => (
                        <th
                          key={day.dateStr}
                          className={`py-3 px-3 text-center border-r border-zinc-800 last:border-r-0 ${
                            day.isToday ? 'bg-[#D4AF37]/10' : ''
                          }`}
                        >
                          <div className="text-[11px] font-semibold text-zinc-400">{day.dayName}</div>
                          <div className="flex items-center justify-center gap-1.5 mt-0.5">
                            <span
                              className={`text-sm font-extrabold ${
                                day.isToday ? 'text-[#D4AF37]' : 'text-zinc-200'
                              }`}
                            >
                              {day.dayNum} {day.monthName}
                            </span>
                            {day.isToday && (
                              <span className="px-1.5 py-0.2 rounded bg-[#D4AF37] text-black text-[9px] font-black uppercase">
                                Bugün
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {timeSlots.map((slot) => (
                      <tr key={slot} className="hover:bg-zinc-900/30 transition">
                        {/* Time Slot Label */}
                        <td className="py-3 px-4 font-mono text-xs font-bold text-[#D4AF37] sticky left-0 bg-zinc-950 border-r border-zinc-800 z-10">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{slot}</span>
                          </div>
                        </td>

                        {/* 7 Days of the Week */}
                        {weekDays.map((day) => {
                          const apt = appointments.find(
                            (a) => a.date === day.dateStr && a.time === slot && a.status !== 'IPTAL'
                          );

                          if (apt) {
                            // BOOKED CELL (DOLU)
                            return (
                              <td
                                key={day.dateStr + slot}
                                className={`p-2 border-r border-zinc-800/80 last:border-r-0 align-top ${
                                  day.isToday ? 'bg-[#D4AF37]/5' : ''
                                }`}
                              >
                                <div
                                  onClick={() => setSelectedAppointment(apt)}
                                  className={`p-2.5 rounded-xl border transition cursor-pointer shadow-sm hover:scale-[1.02] ${
                                    apt.status === 'TAMAMLANDI'
                                      ? 'bg-emerald-950/40 border-emerald-700/60 hover:border-emerald-500'
                                      : apt.status === 'ISLEMDE'
                                      ? 'bg-blue-950/40 border-blue-700/60 hover:border-blue-500'
                                      : apt.status === 'ONAYLANDI'
                                      ? 'bg-amber-950/40 border-[#D4AF37]/60 hover:border-[#D4AF37]'
                                      : 'bg-zinc-900/90 border-zinc-700 hover:border-zinc-500'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="font-bold text-xs text-white truncate max-w-[110px]" title={apt.clientName}>
                                      {apt.clientName}
                                    </span>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                                        apt.status === 'TAMAMLANDI'
                                          ? 'bg-emerald-500/20 text-emerald-400'
                                          : apt.status === 'ISLEMDE'
                                          ? 'bg-blue-500/20 text-blue-400'
                                          : apt.status === 'ONAYLANDI'
                                          ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                          : 'bg-zinc-800 text-zinc-400'
                                      }`}
                                    >
                                      {apt.status === 'TAMAMLANDI' ? 'TAMAM' : apt.status}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-zinc-300 truncate" title={apt.serviceName}>
                                    {apt.serviceName}
                                  </div>
                                  <div className="text-[10px] font-bold text-[#D4AF37] mt-1">
                                    {formatCurrency(apt.price)}
                                  </div>
                                </div>
                              </td>
                            );
                          }

                          // EMPTY CELL (BOŞ / MÜSAİT VEYA GEÇMİŞ)
                          if (day.isPast) {
                            return (
                              <td
                                key={day.dateStr + slot}
                                className="p-2 border-r border-zinc-800/80 last:border-r-0 bg-zinc-950/40 align-middle text-center"
                              >
                                <span className="text-[10px] text-zinc-600 font-medium select-none">
                                  Geçmiş
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={day.dateStr + slot}
                              className={`p-2 border-r border-zinc-800/80 last:border-r-0 align-middle ${
                                day.isToday ? 'bg-[#D4AF37]/5' : ''
                              }`}
                            >
                              <button
                                onClick={() => handleOpenSlotBooking(day.dateStr, slot)}
                                className="w-full h-full py-2.5 px-2 rounded-xl border border-dashed border-zinc-800/90 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-zinc-500 hover:text-emerald-400 text-[11px] font-semibold transition flex items-center justify-center gap-1 group cursor-pointer"
                                title={`${day.dayName} ${slot} için hızlı randevu kaydı yap`}
                              >
                                <Plus className="w-3 h-3 group-hover:scale-110 transition" />
                                <span>Boş Slot</span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS LIST & QUICK BOOKING FORM */}
        {activeTab === 'appointments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Add Appointment Form (Left Column) */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-zinc-950/90 border border-zinc-800 sticky top-24">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Kolay Randevu Kaydı</h3>
                    <p className="text-[11px] text-zinc-400">Danışanı hemen takvime ekleyin</p>
                  </div>
                </div>

                {formError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateAppointment} className="space-y-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Danışan Adı Soyadı *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="Örn: Zeynep Arslan"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Telefon Numarası *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="tel"
                        required
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        placeholder="+90 5XX XXX XX XX"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Uygulanacak İşlem *</label>
                    <select
                      value={newSelectedServiceId}
                      onChange={(e) => setNewSelectedServiceId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({formatCurrency(s.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Tarih <span className="text-zinc-500">(Geçmiş seçilemez)</span>
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Randevu Saati</label>
                      <select
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        {timeSlots.map((slot) => {
                          const occupied = isSlotBooked(newDate, slot);
                          return (
                            <option key={slot} value={slot} disabled={occupied}>
                              {slot} {occupied ? '— (DOLU)' : '— (Müsait)'}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Özel Not</label>
                    <input
                      type="text"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Cilt hassasiyeti, tırnak rengi vb."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Randevuyu Kaydet</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Appointments Management Table (Right 2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={aptSearch}
                    onChange={(e) => setAptSearch(e.target.value)}
                    placeholder="Danışan adı, telefon veya işlem ara..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {['ALL', 'BEKLEMEDE', 'ONAYLANDI', 'ISLEMDE', 'TAMAMLANDI', 'IPTAL'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setAptStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                        aptStatusFilter === st
                          ? 'bg-zinc-800 text-[#D4AF37] border border-[#D4AF37]/40 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'Tümü' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments List */}
              <div className="space-y-3">
                {filteredAppointments.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-500 text-xs">
                    Kayıtlı randevu bulunamadı.
                  </div>
                ) : (
                  filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-zinc-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{apt.clientName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              apt.status === 'TAMAMLANDI'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : apt.status === 'ISLEMDE'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : apt.status === 'ONAYLANDI'
                                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                                : apt.status === 'IPTAL'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                          <span className="text-zinc-200 font-medium">{apt.serviceName}</span>
                          <span>•</span>
                          <span className="text-[#D4AF37] font-semibold">{formatCurrency(apt.price)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-500" />
                            {apt.date} · {apt.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                          <span>{apt.clientPhone}</span>
                          {apt.notes && <span>· Not: {apt.notes}</span>}
                        </div>
                      </div>

                      {/* Status Buttons & Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => handleSendClientWhatsApp(apt)}
                          className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition cursor-pointer"
                          title="WhatsApp Bilgilendirme Gönder"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        {apt.status !== 'ONAYLANDI' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'ONAYLANDI')}
                            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer"
                            title="Onayla"
                          >
                            Onayla
                          </button>
                        )}

                        {apt.status !== 'ISLEMDE' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'ISLEMDE')}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 text-[11px] text-blue-300 border border-blue-900 cursor-pointer"
                            title="İşleme Al"
                          >
                            İşlemde
                          </button>
                        )}

                        {apt.status !== 'TAMAMLANDI' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'TAMAMLANDI')}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-[11px] text-emerald-300 border border-emerald-900 cursor-pointer"
                            title="Tamamlandı"
                          >
                            Tamamla
                          </button>
                        )}

                        {apt.status !== 'IPTAL' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'IPTAL')}
                            className="px-2.5 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950 text-[11px] text-red-400 border border-red-900/40 cursor-pointer"
                            title="İptal Et"
                          >
                            İptal
                          </button>
                        )}

                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition cursor-pointer"
                          title="Kaydı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SLOT MANAGEMENT (Randevu Saatleri & Slot Yönetimi) */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Randevu Saatleri & Slot Düzenleme
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Salonunuzun açık olduğu saat dilimlerini belirleyin. Buraya eklediğiniz veya sildiğiniz saatler anında hem <strong>web sitesindeki randevu alma penceresine</strong> hem de <strong>haftalık takvim tablosuna</strong> yansır.
                </p>
              </div>

              <button
                onClick={resetTimeSlots}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
                title="Varsayılan Saat Dilimlerine Dön"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Varsayılan Saatlere Sıfırla</span>
              </button>
            </div>

            {/* Add New Time Slot Form */}
            <form onSubmit={handleAddSlot} className="p-5 rounded-2xl bg-zinc-950/90 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 flex-1 w-full">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <input
                  type="text"
                  required
                  value={newSlotInput}
                  onChange={(e) => setNewSlotInput(e.target.value)}
                  placeholder="Örn: 10:00, 12:30 veya 19:00"
                  className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Saat Dilimi Ekle</span>
              </button>
            </form>

            {/* Active Time Slots Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Mevcut Aktif Randevu Saatleri ({timeSlots.length})
                </h4>
                <span className="text-[11px] text-zinc-500">
                  Danışanlar sadece bu saatler arasından seçim yapabilir.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {timeSlots.map((slot) => {
                  const todayBooked = appointments.some(
                    (a) => a.date === todayStr && a.time === slot && a.status !== 'IPTAL'
                  );

                  return (
                    <div
                      key={slot}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="font-mono font-black text-sm text-white">{slot}</span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold block mt-1 ${
                            todayBooked ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {todayBooked ? 'Bugün: Dolu' : 'Bugün: Müsait'}
                        </span>
                      </div>

                      <button
                        onClick={() => removeTimeSlot(slot)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition cursor-pointer"
                        title={`"${slot}" saatini kaldır`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES & PRICE MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">İşlem & Hizmet Fiyat Listesi</h3>
                <p className="text-xs text-zinc-400">
                  Buradan eklediğiniz veya güncellediğiniz işlemler web sayfasında danışanlara görüntülenir.
                </p>
              </div>

              <button
                onClick={() => setIsAddServiceOpen(!isAddServiceOpen)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni İşlem Ekle</span>
              </button>
            </div>

            {/* Add Service Modal/Card */}
            {isAddServiceOpen && (
              <form onSubmit={handleCreateService} className="p-6 rounded-2xl bg-zinc-950 border border-[#D4AF37]/40 space-y-4">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Yeni Hizmet / Protokol Tanımla
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-zinc-400 mb-1">İşlem Adı *</label>
                    <input
                      type="text"
                      required
                      value={srvName}
                      onChange={(e) => setSrvName(e.target.value)}
                      placeholder="Örn: Karbon Peeling & Leke Tedavisi"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Kategori</label>
                    <select
                      value={srvCategory}
                      onChange={(e) => setSrvCategory(e.target.value as ServiceCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Cilt Bakımı">Cilt Bakımı</option>
                      <option value="Lazer Epilasyon">Lazer Epilasyon</option>
                      <option value="Protez Tırnak & Manikür">Protez Tırnak & Manikür</option>
                      <option value="İpek Kirpik & Kaş">İpek Kirpik & Kaş</option>
                      <option value="Bölgesel İncelme">Bölgesel İncelme</option>
                      <option value="Kalıcı Makyaj">Kalıcı Makyaj</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">İşlem Ücreti (TL) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={50}
                      value={srvPrice}
                      onChange={(e) => setSrvPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Tahmini Süre (Dakika)</label>
                    <input
                      type="number"
                      min={10}
                      step={5}
                      value={srvDuration}
                      onChange={(e) => setSrvDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Açıklama</label>
                  <input
                    type="text"
                    value={srvDescription}
                    onChange={(e) => setSrvDescription(e.target.value)}
                    placeholder="İşlem adımları, kullanılan cihaz veya serum..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddServiceOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    Hizmeti Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* Services Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10">
                        {srv.category}
                      </span>
                      <span className="text-[11px] text-zinc-400">{srv.durationMinutes} dk</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-white">{srv.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{srv.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Fiyat</span>
                      <span className="text-sm font-black text-[#D4AF37]">
                        {formatCurrency(srv.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newPrice = prompt(`"${srv.name}" için yeni fiyatı giriniz (TL):`, srv.price.toString());
                          if (newPrice && !isNaN(Number(newPrice))) {
                            updateService(srv.id, { price: Number(newPrice) });
                          }
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-white text-xs transition cursor-pointer"
                        title="Fiyatı Değiştir"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteService(srv.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                        title="Hizmeti Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PRODUCTS & WHATSAPP SHOP MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Ürün & WhatsApp Mağaza Yönetimi</h3>
                <p className="text-xs text-zinc-400">
                  Buraya eklenen tüm ürünler ayrılmış <strong className="text-emerald-400">/urunler</strong> mağaza sayfasında ve anasayfa vitrininde anında listelenir; danışan sepetine ekleyip WhatsApp üzerinden sipariş verebilir.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/urunler"
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mağazada Gör</span>
                </Link>
                <button
                  onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Ürün Ekle</span>
                </button>
              </div>
            </div>

            {/* Add Product Modal/Card */}
            {isAddProductOpen && (
              <form onSubmit={handleCreateProduct} className="p-6 rounded-2xl bg-zinc-950 border border-emerald-500/40 space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Yeni Bakım Ürünü Ekle
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-zinc-400 mb-1">Ürün Adı *</label>
                    <input
                      type="text"
                      required
                      value={prdName}
                      onChange={(e) => setPrdName(e.target.value)}
                      placeholder="Örn: Niasinamid %10 + Çinko Serum (30ml)"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Kategori</label>
                    <select
                      value={prdCategory}
                      onChange={(e) => setPrdCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Cilt Bakımı & Serum">Cilt Bakımı & Serum</option>
                      <option value="Güneş Koruması">Güneş Koruması</option>
                      <option value="Tırnak & El Bakımı">Tırnak & El Bakımı</option>
                      <option value="Kaş & Kirpik Serumu">Kaş & Kirpik Serumu</option>
                      <option value="Vücut & Masaj Yağı">Vücut & Masaj Yağı</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Satış Fiyatı (TL) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={10}
                      value={prdPrice}
                      onChange={(e) => setPrdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-zinc-400 mb-1">Görsel URL</label>
                    <input
                      type="text"
                      value={prdImage}
                      onChange={(e) => setPrdImage(e.target.value)}
                      placeholder="/images/serum-c.jpg veya URL"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Ürün Açıklaması</label>
                  <input
                    type="text"
                    value={prdDescription}
                    onChange={(e) => setPrdDescription(e.target.value)}
                    placeholder="İçerik, etki alanı ve kullanım talimatı..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={prdInStock}
                      onChange={(e) => setPrdInStock(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <span>Hemen Stokta ve Satışa Açık</span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddProductOpen(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                    >
                      Ürünü Mağazaya Ekle
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prd) => (
                <div
                  key={prd.id}
                  className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full bg-black">
                    <Image
                      src={prd.image}
                      alt={prd.name}
                      fill
                      className="object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold ${
                        prd.inStock ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                      }`}
                    >
                      {prd.inStock ? 'STOKTA' : 'TÜKENDİ'}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                        {prd.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-white mt-0.5">{prd.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{prd.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-base font-black text-[#D4AF37]">
                        {formatCurrency(prd.price)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const newPrice = prompt(`"${prd.name}" için yeni fiyatı giriniz (TL):`, prd.price.toString());
                            if (newPrice && !isNaN(Number(newPrice))) {
                              updateProduct(prd.id, { price: Number(newPrice) });
                            }
                          }}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-white text-xs transition cursor-pointer"
                          title="Fiyatı Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => updateProduct(prd.id, { inStock: !prd.inStock })}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border cursor-pointer ${
                            prd.inStock
                              ? 'border-emerald-800 text-emerald-400 hover:bg-emerald-950/40'
                              : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                          }`}
                          title="Stok Durumu Değiştir"
                        >
                          {prd.inStock ? 'Stokta' : 'Tükendi'}
                        </button>

                        <button
                          onClick={() => deleteProduct(prd.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                          title="Ürünü Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FINANCE & CASHFLOW */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h3 className="font-serif font-bold text-base text-white">Kasa & Gelir Özeti</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Gerçekleşen Ciro</span>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    {formatCurrency(completedRevenue)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Bekleyen Seans Tutarı</span>
                  <div className="text-xl font-black text-[#D4AF37] mt-1">
                    {formatCurrency(totalExpectedRevenue - completedRevenue)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Ortalama Randevu Tutarı</span>
                  <div className="text-xl font-black text-blue-400 mt-1">
                    {totalAppointments > 0
                      ? formatCurrency(Math.round(totalExpectedRevenue / totalAppointments))
                      : '0 ₺'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: APPOINTMENT DETAILS & STATUS ACTION MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-zinc-950 border border-[#D4AF37]/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Randevu Detayları</h3>
                  <p className="text-xs text-zinc-400">{selectedAppointment.date} · {selectedAppointment.time}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Danışan:</span>
                <span className="font-bold text-white text-sm">{selectedAppointment.clientName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Telefon:</span>
                <span className="font-mono text-zinc-200">{selectedAppointment.clientPhone}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Hizmet / İşlem:</span>
                <span className="font-bold text-zinc-200">{selectedAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Ücret:</span>
                <span className="font-black text-[#D4AF37] text-sm">{formatCurrency(selectedAppointment.price)}</span>
              </div>
              {selectedAppointment.notes && (
                <div className="py-1">
                  <span className="text-zinc-400 block mb-1">Özel Not:</span>
                  <p className="text-zinc-300 italic bg-black/40 p-2.5 rounded-lg border border-zinc-800">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Status Change Buttons */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Durumu Güncelle
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['ONAYLANDI', 'ISLEMDE', 'TAMAMLANDI', 'IPTAL'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, st);
                      setSelectedAppointment((prev) => (prev ? { ...prev, status: st } : null));
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition cursor-pointer text-center ${
                      selectedAppointment.status === st
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  deleteAppointment(selectedAppointment.id);
                  setSelectedAppointment(null);
                }}
                className="px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-950/40 border border-red-900/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Randevuyu Sil</span>
              </button>

              <button
                onClick={() => handleSendClientWhatsApp(selectedAppointment)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Onay Gönder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK BOOKING FROM WEEKLY EMPTY SLOT CLICK */}
      {isQuickBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-[#D4AF37]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Bu Saate Randevu Ekle</h3>
                  <p className="text-xs text-[#D4AF37] font-semibold">{newDate} · Saat: {newTime}</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickBookingModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Danışan Adı Soyadı *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Örn: Merve Kaya"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Telefon Numarası *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Uygulanacak İşlem *</label>
                <select
                  value={newSelectedServiceId}
                  onChange={(e) => setNewSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatCurrency(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Tarih</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Saat</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {timeSlots.map((slot) => {
                      const occupied = isSlotBooked(newDate, slot);
                      return (
                        <option key={slot} value={slot} disabled={occupied}>
                          {slot} {occupied ? '— (DOLU)' : '— (Müsait)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Özel Not</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="İsteğe bağlı not..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickBookingModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Randevuyu Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
