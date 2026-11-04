'use client';

import React, { useState } from 'react';
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
    notification,
  } = useSalon();

  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'products' | 'finance'>('appointments');

  // Quick Appointment Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('+90 5');
  const [newSelectedServiceId, setNewSelectedServiceId] = useState(services[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-11-04');
  const [newTime, setNewTime] = useState('11:00');
  const [newNotes, setNewNotes] = useState('');

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
  const [prdImage, setPrdImage] = useState('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80');
  const [prdDescription, setPrdDescription] = useState('');
  const [prdInStock, setPrdInStock] = useState(true);

  // Financial & Stats Calculations
  const totalAppointments = appointments.length;
  const totalExpectedRevenue = appointments.reduce((sum, a) => sum + a.price, 0);
  const completedRevenue = appointments
    .filter((a) => a.status === 'TAMAMLANDI')
    .reduce((sum, a) => sum + a.price, 0);
  const pendingCount = appointments.filter((a) => a.status === 'BEKLEMEDE' || a.status === 'ONAYLANDI').length;

  // Handle Quick Booking Submit
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || newClientPhone.length < 10) return;

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
      image: prdImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
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
    msg += `Randevunuz onaylanmıştır:\n`;
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
              <span className="text-xs font-semibold text-zinc-400">Toplam Randevu</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {totalAppointments}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Sistemdeki kayıtlı seanslar</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Aktif / Bekleyen</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#D4AF37] mt-2">
              {pendingCount}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Onaylanan veya bekleyen</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Tahmini Toplam Ciro</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">
              {formatCurrency(totalExpectedRevenue)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Tamamlanan: {formatCurrency(completedRevenue)}</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">WhatsApp Mağaza</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-400 mt-2">
              {products.length} Ürün
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Web sitesinde aktif satışta</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Randevu Yönetimi & Hızlı Kayıt ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'services'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>İşlemler & Fiyat Belirleme ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Kasa & Rapor</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS & QUICK BOOKING */}
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
                      <label className="block text-[11px] text-zinc-400 mb-1">Tarih</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Saat</label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        placeholder="11:00"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
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
                    className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 transition active:scale-95"
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
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
                          className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition"
                          title="WhatsApp Bilgilendirme Gönder"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        {apt.status !== 'ONAYLANDI' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'ONAYLANDI')}
                            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 hover:text-white border border-zinc-800"
                            title="Onayla"
                          >
                            Onayla
                          </button>
                        )}

                        {apt.status !== 'ISLEMDE' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'ISLEMDE')}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 text-[11px] text-blue-300 border border-blue-900"
                            title="İşleme Al"
                          >
                            İşlemde
                          </button>
                        )}

                        {apt.status !== 'TAMAMLANDI' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'TAMAMLANDI')}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-[11px] text-emerald-300 border border-emerald-900"
                            title="Tamamlandı"
                          >
                            Tamamla
                          </button>
                        )}

                        {apt.status !== 'IPTAL' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'IPTAL')}
                            className="px-2.5 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950 text-[11px] text-red-400 border border-red-900/40"
                            title="İptal Et"
                          >
                            İptal
                          </button>
                        )}

                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition"
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

        {/* TAB 2: SERVICES & PRICE MANAGEMENT */}
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
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
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
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md"
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
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-white text-xs transition"
                        title="Fiyatı Değiştir"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteService(srv.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition"
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

        {/* TAB 3: PRODUCTS & WHATSAPP SHOP MANAGEMENT */}
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
                      placeholder="https://images.unsplash.com/..."
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
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md"
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
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-white text-xs transition"
                          title="Fiyatı Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => updateProduct(prd.id, { inStock: !prd.inStock })}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${
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
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition"
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

        {/* TAB 4: FINANCE & CASHFLOW */}
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
    </div>
  );
}
