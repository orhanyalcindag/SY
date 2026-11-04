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
  ClientProfile,
  ClientPackage,
  SalonExpense,
  ExpenseCategory,
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
  Lock,
  Unlock,
  Bell,
  Gift,
  FileText,
  CreditCard,
  Receipt,
  Cloud,
  Eye,
  EyeOff,
  LogOut,
  Users,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import FirebaseConnectModal from '@/components/FirebaseConnectModal';
import { AdminUser } from '@/types';

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
    markAppointmentReminded,
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    resetTimeSlots,
    isSlotBooked,
    getOccupiedSlotsForDate,
    blockedDates,
    blockedSlots,
    toggleBlockDate,
    toggleBlockSlot,
    isDateBlocked,
    isSlotBlocked,
    clients,
    updateClientNotes,
    addLoyaltyPoints,
    getClientByPhone,
    packages,
    addPackage,
    consumeSession,
    deletePackage,
    expenses,
    addExpense,
    deleteExpense,
    notification,
    isCloudConnected,
    adminUsers,
    currentUser,
    isAuthLoading,
    loginAdmin,
    logoutAdmin,
    addAdminUser,
    deleteAdminUser,
    updateAdminPassword,
  } = useSalon();

  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Active tab navigation
  const [activeTab, setActiveTab] = useState<
    'weekly' | 'appointments' | 'clients' | 'packages' | 'slots' | 'services' | 'products' | 'finance' | 'users'
  >('weekly');

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('SY');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // User Management State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Yönetici' | 'Personel'>('Personel');
  const [userFormError, setUserFormError] = useState('');

  // Change Password State
  const [changePassUser, setChangePassUser] = useState<AdminUser | null>(null);
  const [newPassInput, setNewPassInput] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);

  // Client-safe Date initialization
  const [todayStr, setTodayStr] = useState('2026-11-04');
  const [tomorrowStr, setTomorrowStr] = useState('2026-11-05');
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
  const [manualBlockDateInput, setManualBlockDateInput] = useState('2026-11-08');

  // Weekly Dashboard Appointment Detail Modal
  const [selectedAppointment, setSelectedAppointment] = useState<SalonAppointment | null>(null);

  // Quick Booking Modal from Weekly Calendar Click
  const [isQuickBookingModalOpen, setIsQuickBookingModalOpen] = useState(false);

  // CRM Client Drawer / Modal State
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [clientNoteEdit, setClientNoteEdit] = useState('');
  const [pointAddInput, setPointAddInput] = useState(50);

  // Package Management State
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [pkgClientName, setPkgClientName] = useState('');
  const [pkgClientPhone, setPkgClientPhone] = useState('+90 5');
  const [pkgName, setPkgName] = useState('Tüm Vücut Buz Başlıklı Hibrit Lazer (8 Seans)');
  const [pkgCategory, setPkgCategory] = useState<ServiceCategory>('Lazer Epilasyon');
  const [pkgTotalSessions, setPkgTotalSessions] = useState(8);
  const [pkgTotalPrice, setPkgTotalPrice] = useState(9500);
  const [pkgPaidAmount, setPkgPaidAmount] = useState(9500);
  const [pkgNotes, setPkgNotes] = useState('');

  // Expense Management State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Kozmetik & Sarf Malzeme');
  const [expAmount, setExpAmount] = useState(1500);
  const [expDate, setExpDate] = useState('2026-11-04');
  const [expNote, setExpNote] = useState('');

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
    setExpDate(formattedToday);
    setManualBlockDateInput(formattedToday);

    const tmrw = new Date(now);
    tmrw.setDate(now.getDate() + 1);
    const tmrwFormatted = `${tmrw.getFullYear()}-${String(tmrw.getMonth() + 1).padStart(2, '0')}-${String(tmrw.getDate()).padStart(2, '0')}`;
    setTomorrowStr(tmrwFormatted);

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

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = completedRevenue - totalExpenses;

  // Tomorrow's appointments for No-Show reminder
  const tomorrowAppointments = appointments.filter(
    (a) => a.date === tomorrowStr && a.status !== 'IPTAL'
  );

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

  // Calculate blocked slots in current week
  const blockedWeeklySlots = weekDays.reduce((acc, day) => {
    if (isDateBlocked(day.dateStr)) {
      return acc + timeSlots.length;
    }
    const dayBlockedSlots = timeSlots.filter((slot) => isSlotBlocked(day.dateStr, slot));
    return acc + dayBlockedSlots.length;
  }, 0);

  const availableWeeklySlots = Math.max(0, totalWeeklySlots - bookedWeeklySlots - blockedWeeklySlots);
  const activeBookableSlots = Math.max(1, totalWeeklySlots - blockedWeeklySlots);
  const weeklyOccupancyRate = Math.round((bookedWeeklySlots / activeBookableSlots) * 100);
  const weeklyRevenue = weekAppointments.reduce((sum, a) => sum + a.price, 0);

  // Handle Quick Booking Submit (with past date, closed day & occupied slot blocking)
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

    if (newDate < todayStr) {
      setFormError('Geçmiş bir tarihe randevu kaydedilemez. Lütfen bugünü veya ileri bir tarihi seçiniz.');
      return;
    }

    if (isDateBlocked(newDate)) {
      setFormError(`Seçilen ${newDate} tarihinde salon hizmete kapalıdır. Lütfen açık olan bir gün seçiniz.`);
      return;
    }

    if (isSlotBlocked(newDate, newTime)) {
      setFormError(`Seçilen ${newDate} tarihinde saat ${newTime} randevulara kapatılmıştır. Lütfen müsait bir saat seçiniz.`);
      return;
    }

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
    if (dateStr < todayStr || isDateBlocked(dateStr) || isSlotBlocked(dateStr, slotTime)) return;
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

  // Handle Add Package
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgClientName.trim() || pkgClientPhone.length < 10) return;

    addPackage({
      clientName: pkgClientName,
      clientPhone: pkgClientPhone,
      packageName: pkgName,
      category: pkgCategory,
      totalSessions: Number(pkgTotalSessions),
      completedSessions: 0,
      totalPrice: Number(pkgTotalPrice),
      paidAmount: Number(pkgPaidAmount),
      startDate: todayStr,
      notes: pkgNotes || 'Yeni paket satışı.',
    });

    setPkgClientName('');
    setPkgClientPhone('+90 5');
    setPkgNotes('');
    setIsAddPackageOpen(false);
  };

  // Handle Add Expense
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || expAmount <= 0) return;

    addExpense({
      title: expTitle,
      category: expCategory,
      amount: Number(expAmount),
      date: expDate || todayStr,
      note: expNote,
    });

    setExpTitle('');
    setExpAmount(1500);
    setExpNote('');
    setIsAddExpenseOpen(false);
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

  // Send WhatsApp No-Show Reminder
  const handleSendReminderWhatsApp = (apt: SalonAppointment) => {
    let msg = `*✨ Sayın ${apt.clientName}, Simay Yorulmaz Health & Beauty Randevu Hatırlatması ✨*\n\n`;
    msg += `Yarın saat *${apt.time}*'de salonumuzda *${apt.serviceName}* randevunuz bulunmaktadır.\n\n`;
    msg += `📍 *Adres:* ${SALON_INFO.address}\n\n`;
    msg += `Randevunuza katılım durumunuzu bu mesaja "Evet, geleceğim" veya "Saat değişikliği rica ediyorum" şeklinde yanıtlayarak teyit etmenizi rica ederiz.\n\n`;
    msg += `Sizi ağırlamayı sabırsızlıkla bekliyoruz! 🌸`;

    const encoded = encodeURIComponent(msg);
    const cleanPhone = apt.clientPhone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, '_blank');
    markAppointmentReminded(apt.id);
  };

  // Send WhatsApp Package Session Update
  const handleSendPackageSessionWhatsApp = (pkg: ClientPackage) => {
    const remaining = pkg.totalSessions - pkg.completedSessions;
    let msg = `*✨ Sayın ${pkg.clientName}, Simay Yorulmaz Health & Beauty Seans Bilgilendirmesi ✨*\n\n`;
    msg += `Bugün *${pkg.packageName}* paketinizin *${pkg.completedSessions}. seansı* başarıyla tamamlanmıştır.\n\n`;
    msg += `📊 *Kalan Seans Sayınız:* ${remaining} Seans\n`;
    if (remaining > 0) {
      msg += `Bir sonraki seans randevunuzu oluşturmak için dilediğiniz zaman bu hattan bize ulaşabilirsiniz.`;
    } else {
      msg += `Tebrikler! Paketinizin tüm seansları başarıyla tamamlanmıştır. Bizi tercih ettiğiniz için teşekkür ederiz! 💖`;
    }

    const encoded = encodeURIComponent(msg);
    const cleanPhone = pkg.clientPhone.replace(/[^0-9]/g, '');
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

  // Filtered Clients
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.phone.includes(clientSearch) ||
      (c.specialNotes && c.specialNotes.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  // Auth Form Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAdmin(loginUsername, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    if (!newUsername.trim() || !newPassword.trim()) {
      setUserFormError('Lütfen kullanıcı adı ve şifre giriniz.');
      return;
    }
    const res = addAdminUser({
      username: newUsername,
      password: newPassword,
      name: newName.trim() || newUsername.trim(),
      role: newRole,
    });
    if (!res.success) {
      setUserFormError(res.message);
      return;
    }
    setIsAddUserOpen(false);
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewRole('Personel');
  };

  const handleUpdatePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePassUser) return;
    if (!newPassInput.trim()) return;
    const res = updateAdminPassword(changePassUser.id, newPassInput);
    if (res.success) {
      setChangePassUser(null);
      setNewPassInput('');
    }
  };

  // Auth Guard
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#997929] via-[#D4AF37] to-[#F3E5AB] p-[2px] animate-pulse">
          <div className="w-full h-full bg-[#0A0A0C] rounded-3xl flex items-center justify-center">
            <span className="font-serif font-black text-2xl text-[#D4AF37]">SY</span>
          </div>
        </div>
        <p className="text-zinc-500 text-xs mt-4 tracking-widest uppercase font-semibold">
          Yetkilendirme Kontrol Ediliyor...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-[#D4AF37] selection:text-black">
        {/* Ambient Luxury Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Logo & Brand */}
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#997929] via-[#D4AF37] to-[#F3E5AB] p-[2px] shadow-[0_0_40px_rgba(212,175,55,0.25)]">
              <div className="w-full h-full bg-[#0A0A0C] rounded-3xl flex items-center justify-center">
                <span className="font-serif font-black text-2xl text-[#D4AF37]">SY</span>
              </div>
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl tracking-wider text-white">
                SİMAY YORULMAZ
              </h1>
              <p className="text-[11px] text-[#D4AF37] font-bold tracking-widest uppercase mt-1">
                Yönetici & CRM Paneli Girişi
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-zinc-950/90 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-xl space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="SY"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Giriş Şifresi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="p-1 text-zinc-500 hover:text-zinc-300 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#997929] via-[#D4AF37] to-[#F3E5AB] text-black font-extrabold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Panele Giriş Yap</span>
              </button>
            </form>

            <div className="pt-2 text-center border-t border-zinc-900 space-y-1">
              <p className="text-[11px] text-zinc-500">
                Kırklareli Demirköy Salon, Seans, Kasa & Danışan Otomasyonu
              </p>
              <p className="text-[10px] text-zinc-600">
                Varsayılan Giriş: <strong className="text-zinc-400">SY</strong> / <strong className="text-zinc-400">3939</strong>
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-[#D4AF37] transition inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Web Sitesine Geri Dön</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                YÖNETİM & CRM PANELİ
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">Demirköy Salon, Seans, Kasa & Danışan Otomasyonu</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cloud Database Sync Status */}
          {isCloudConnected ? (
            <button
              type="button"
              onClick={() => setIsCloudModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.25)] cursor-pointer"
              title="Canlı Bulut Veritabanı Aktif"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="hidden sm:inline">Bulut: Aktif</span>
              <span className="sm:hidden">Bulut</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCloudModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/60 text-amber-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)] cursor-pointer"
              title="Verileri tüm cihazlarda ortak eşitlemek için tıklayın"
            >
              <Cloud className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Bulut Veritabanı Bağla</span>
              <span className="sm:hidden">Bulut</span>
            </button>
          )}

          <Link
            href="/urunler"
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-emerald-400 text-xs font-semibold transition flex items-center gap-1.5"
            title="Mağazayı Yeni Sekmede Aç"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mağazayı Aç</span>
          </Link>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            title="Web Sitesini Görüntüle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web Sitesine Git</span>
          </Link>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#D4AF37] font-semibold">
                @{currentUser.username} · {currentUser.role}
              </span>
            </div>
            <button
              type="button"
              onClick={logoutAdmin}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Yönetim Panelinden Güvenli Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
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
            <p className="text-[11px] text-zinc-500 mt-1">
              {bookedWeeklySlots} Dolu / {availableWeeklySlots} Boş Slot
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Kayıtlı Danışan</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-400 mt-2">
              {clients.length} Kişi
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">CRM dosya & formül hafızası</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Net Salon Kârı</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">
              {formatCurrency(netProfit)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Gelir: {formatCurrency(completedRevenue)} · Gider: {formatCurrency(totalExpenses)}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Aktif Paketler</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-400 mt-2">
              {packages.length} Paket
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Seanslı lazer & cilt takibi</p>
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
            <Clock className="w-4 h-4" />
            <span>Randevular & Hatırlatıcı ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Danışan Dosyası & CRM ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Paket & Seans Takip ({packages.length})</span>
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
            <span>Kasa, Masraflar & Net Kâr</span>
          </button>

          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'slots'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Saat & Gün Kapatma</span>
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
            <span>WhatsApp Mağaza ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kullanıcılar ({adminUsers.length})</span>
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
                  {weekStartFormatted} — {weekEndFormatted} tarihleri arasındaki tüm seanslar, boş ve kapalı saatler.
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

            {/* Mobile swipe helper tip */}
            <div className="flex sm:hidden items-center justify-between px-2 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-[#D4AF37]">
                <span>👉 Tabloyu parmağınızla sağa/sola kaydırabilirsiniz</span>
              </span>
              <span className="text-zinc-500">7 Gün</span>
            </div>

            {/* Equal-Sized Weekly Calendar Matrix Table */}
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[1020px]">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-[#0F0F12]">
                      <th className="w-20 py-3.5 px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider sticky left-0 bg-[#0F0F12] z-20 border-r border-zinc-800 text-center">
                        Saat
                      </th>

                      {weekDays.map((day) => {
                        const dayBlocked = isDateBlocked(day.dateStr);

                        return (
                          <th
                            key={day.dateStr}
                            className={`w-[calc((100%-80px)/7)] py-3 px-2 text-center border-r border-zinc-800 last:border-r-0 ${
                              day.isToday ? 'bg-[#D4AF37]/10' : ''
                            } ${dayBlocked ? 'bg-red-950/20' : ''}`}
                          >
                            <div className="text-[11px] font-semibold text-zinc-400">{day.dayName}</div>
                            <div className="flex items-center justify-center gap-1.5 mt-0.5">
                              <span
                                className={`text-sm font-extrabold ${
                                  dayBlocked
                                    ? 'text-red-400'
                                    : day.isToday
                                    ? 'text-[#D4AF37]'
                                    : 'text-zinc-200'
                                }`}
                              >
                                {day.dayNum} {day.monthName}
                              </span>
                              {day.isToday && !dayBlocked && (
                                <span className="px-1.5 py-0.2 rounded bg-[#D4AF37] text-black text-[9px] font-black uppercase">
                                  Bugün
                                </span>
                              )}
                              {dayBlocked && (
                                <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-black uppercase">
                                  Kapalı
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleBlockDate(day.dateStr)}
                              className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border transition inline-flex items-center gap-1 cursor-pointer ${
                                dayBlocked
                                  ? 'bg-red-900/40 border-red-700 text-red-300 hover:bg-red-800/50'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                              }`}
                              title={dayBlocked ? 'Günü tekrar randevulara aç' : 'Bu günü tamamen kapat'}
                            >
                              {dayBlocked ? (
                                <>
                                  <Unlock className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>Günü Aç</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-2.5 h-2.5 text-zinc-400" />
                                  <span>Günü Kapat</span>
                                </>
                              )}
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {timeSlots.map((slot, slotIndex) => (
                      <tr key={slot} className="hover:bg-zinc-900/20 transition">
                        <td className="w-20 h-[92px] p-2 font-mono text-xs font-bold text-[#D4AF37] sticky left-0 bg-zinc-950 border-r border-zinc-800 z-10 text-center align-middle">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{slot}</span>
                          </div>
                        </td>

                        {weekDays.map((day, dayIndex) => {
                          const isBlocked = isDateBlocked(day.dateStr) || isSlotBlocked(day.dateStr, slot);
                          const apt = appointments.find(
                            (a) => a.date === day.dateStr && a.time === slot && a.status !== 'IPTAL'
                          );

                          // BOOKED APPOINTMENT
                          if (apt) {
                            return (
                              <td
                                key={day.dateStr + slot}
                                className={`h-[92px] p-1.5 border-r border-zinc-800/80 last:border-r-0 align-middle ${
                                  day.isToday ? 'bg-[#D4AF37]/5' : ''
                                }`}
                              >
                                <div
                                  onClick={() => setSelectedAppointment(apt)}
                                  className={`w-full h-full min-h-[78px] rounded-xl border transition cursor-pointer shadow-sm hover:scale-[1.02] p-2 flex flex-col justify-between group relative ${
                                    apt.status === 'TAMAMLANDI'
                                      ? 'bg-emerald-950/40 border-emerald-700/60 hover:border-emerald-500'
                                      : apt.status === 'ISLEMDE'
                                      ? 'bg-blue-950/40 border-blue-700/60 hover:border-blue-500'
                                      : apt.status === 'ONAYLANDI'
                                      ? 'bg-amber-950/40 border-[#D4AF37]/60 hover:border-[#D4AF37]'
                                      : 'bg-zinc-900/90 border-zinc-700 hover:border-zinc-500'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                      <span className="font-bold text-xs text-white truncate max-w-[95px]" title={apt.clientName}>
                                        {apt.clientName}
                                      </span>
                                      <span
                                        className={`text-[8px] px-1 py-0.2 rounded font-black uppercase ${
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
                                  </div>

                                  <div className="text-[10px] font-bold text-[#D4AF37] mt-0.5 flex items-center justify-between">
                                    <span>{formatCurrency(apt.price)}</span>
                                    <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 font-mono">
                                      {slot}
                                    </span>
                                  </div>

                                  {/* Hover Floating Tooltip Baloncuk */}
                                  <div
                                    className={`absolute z-40 ${
                                      slotIndex < 2 ? 'top-full mt-2' : 'bottom-full mb-2'
                                    } ${
                                      dayIndex === 0
                                        ? 'left-0'
                                        : dayIndex === 6
                                        ? 'right-0'
                                        : 'left-1/2 -translate-x-1/2'
                                    } w-64 p-3 rounded-2xl bg-[#0F0F12] border border-[#D4AF37] text-white shadow-2xl shadow-black/95 backdrop-blur-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200`}
                                  >
                                    <div
                                      className={`absolute ${
                                        slotIndex < 2
                                          ? '-top-1.5 border-l border-t'
                                          : '-bottom-1.5 border-r border-b'
                                      } ${
                                        dayIndex === 0
                                          ? 'left-6'
                                          : dayIndex === 6
                                          ? 'right-6'
                                          : 'left-1/2 -translate-x-1/2'
                                      } w-3 h-3 bg-[#0F0F12] border-[#D4AF37] rotate-45`}
                                    />

                                    <div className="relative z-10 space-y-1.5 text-left">
                                      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                                        <div className="flex items-center gap-1.5 font-extrabold text-xs text-white">
                                          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                                          <span>{apt.clientName}</span>
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37]">
                                          {apt.status}
                                        </span>
                                      </div>

                                      <div className="text-[11px] font-semibold text-zinc-200">
                                        {apt.serviceName}
                                      </div>

                                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/60">
                                        <span className="font-mono text-zinc-400 flex items-center gap-1">
                                          <Phone className="w-3 h-3 text-zinc-500" />
                                          {apt.clientPhone}
                                        </span>
                                        <span className="font-black text-[#D4AF37]">
                                          {formatCurrency(apt.price)}
                                        </span>
                                      </div>

                                      {apt.notes && (
                                        <div className="text-[10px] text-zinc-300 italic bg-black/50 p-1.5 rounded-lg border border-zinc-800/80">
                                          &ldquo;{apt.notes}&rdquo;
                                        </div>
                                      )}

                                      <div className="pt-1 text-[9px] text-[#D4AF37] flex items-center justify-center gap-1 border-t border-zinc-800/60 font-semibold">
                                        <span>Tıklayarak durumu değiştirin / WhatsApp gönderin</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            );
                          }

                          // CLOSED / BLOCKED CELL
                          if (isBlocked) {
                            return (
                              <td
                                key={day.dateStr + slot}
                                className={`h-[92px] p-1.5 border-r border-zinc-800/80 last:border-r-0 align-middle ${
                                  day.isToday ? 'bg-[#D4AF37]/5' : ''
                                }`}
                              >
                                <div className="w-full h-full min-h-[78px] rounded-xl bg-red-950/20 border border-red-900/40 hover:border-red-600/60 flex flex-col items-center justify-center p-2 transition text-center group relative">
                                  <Lock className="w-3.5 h-3.5 text-red-400 mb-0.5" />
                                  <span className="text-xs font-bold text-red-400">Kapalı</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isDateBlocked(day.dateStr)) {
                                        toggleBlockDate(day.dateStr);
                                      } else {
                                        toggleBlockSlot(day.dateStr, slot);
                                      }
                                    }}
                                    className="text-[10px] text-zinc-400 hover:text-white underline mt-0.5 cursor-pointer"
                                  >
                                    Tekrar Aç
                                  </button>
                                </div>
                              </td>
                            );
                          }

                          // PAST CELL
                          if (day.isPast) {
                            return (
                              <td
                                key={day.dateStr + slot}
                                className="h-[92px] p-1.5 border-r border-zinc-800/80 last:border-r-0 align-middle"
                              >
                                <div className="w-full h-full min-h-[78px] rounded-xl bg-zinc-950/60 border border-zinc-900/60 flex items-center justify-center text-center select-none">
                                  <span className="text-xs text-zinc-600 font-medium">
                                    Geçmiş
                                  </span>
                                </div>
                              </td>
                            );
                          }

                          // AVAILABLE CELL ("Boş")
                          return (
                            <td
                              key={day.dateStr + slot}
                              className={`h-[92px] p-1.5 border-r border-zinc-800/80 last:border-r-0 align-middle ${
                                day.isToday ? 'bg-[#D4AF37]/5' : ''
                              }`}
                            >
                              <div
                                onClick={() => handleOpenSlotBooking(day.dateStr, slot)}
                                className="w-full h-full min-h-[78px] rounded-xl border border-dashed border-zinc-800/80 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all flex flex-col items-center justify-center p-2 relative group cursor-pointer"
                              >
                                <span className="text-xs font-semibold text-zinc-500 group-hover:text-[#D4AF37] transition">
                                  Boş
                                </span>
                                <span className="text-[10px] text-zinc-600 group-hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5 mt-0.5">
                                  <Plus className="w-2.5 h-2.5" /> Randevu
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBlockSlot(day.dateStr, slot);
                                  }}
                                  className="absolute top-1 right-1 p-1 rounded-md text-zinc-600 hover:text-red-400 hover:bg-zinc-800/80 transition opacity-0 group-hover:opacity-100"
                                  title={`${day.dayName} ${slot} saatini kapat`}
                                >
                                  <Lock className="w-3 h-3" />
                                </button>
                              </div>
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

        {/* TAB 2: APPOINTMENTS & NO-SHOW REMINDER */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Tomorrow's No-Show Reminder Banner */}
            {tomorrowAppointments.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Bell className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Yarın İçin {tomorrowAppointments.length} Randevu Bulunuyor (No-Show Hatırlatma)
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Danışanlara tek tıkla WhatsApp hatırlatma mesajı göndererek randevu gelmeme oranını sıfırlayın.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 font-bold">
                    {tomorrowAppointments.filter((a) => a.reminded).length} / {tomorrowAppointments.length} Hatırlatıldı
                  </span>
                </div>
              </div>
            )}

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
                            const blocked = isSlotBlocked(newDate, slot);
                            const unavailable = occupied || blocked;
                            return (
                              <option key={slot} value={slot} disabled={unavailable}>
                                {slot} {blocked ? '— (KAPALI)' : occupied ? '— (DOLU)' : '— (Müsait)'}
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

              {/* Appointments Management Table */}
              <div className="lg:col-span-2 space-y-4">
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

                            {apt.reminded && (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Hatırlatıldı
                              </span>
                            )}
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
                          {apt.date === tomorrowStr && (
                            <button
                              onClick={() => handleSendReminderWhatsApp(apt)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Yarın için Hatırlatma Gönder"
                            >
                              <Bell className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Hatırlat</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleSendClientWhatsApp(apt)}
                            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition cursor-pointer"
                            title="WhatsApp Onay Gönder"
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
                              title="Tamamla (+ ParaPuan Kazandırır)"
                            >
                              Tamamla
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
          </div>
        )}

        {/* TAB 3: CLIENT DOSSIER & CRM */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Danışan Dosyası & Formül / Seans Hafızası (CRM)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Müşterilerinizin alerji, cilt hassasiyeti, oje rengi, boya formülü gibi özel notlarını ve kazandıkları <strong>ParaPuan</strong> bakiyelerini buradan takip edin.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="İsim, telefon veya formül ara..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => {
                const clientApts = appointments.filter(
                  (a) => a.clientPhone.replace(/[^0-9]/g, '') === client.phone.replace(/[^0-9]/g, '')
                );
                const clientPackages = packages.filter(
                  (p) => p.clientPhone.replace(/[^0-9]/g, '') === client.phone.replace(/[^0-9]/g, '')
                );
                const totalSpent = clientApts.reduce((sum, a) => sum + (a.status === 'TAMAMLANDI' ? a.price : 0), 0);

                return (
                  <div
                    key={client.phone}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-[#D4AF37]/50 transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-base text-white">{client.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold flex items-center gap-1">
                          <Gift className="w-3 h-3" /> {client.loyaltyPoints} ₺ ParaPuan
                        </span>
                      </div>

                      <div className="text-xs text-zinc-400 font-mono mb-3">{client.phone}</div>

                      {/* Special Notes & Formula Memory */}
                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
                          Özel Not & Formül Hafızası
                        </span>
                        <p className="text-zinc-300 italic">
                          {client.specialNotes || 'Henüz özel not eklenmemiş.'}
                        </p>
                      </div>

                      {/* Mini Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-800/80 text-center">
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Ziyaret</span>
                          <span className="text-xs font-bold text-white">{clientApts.length} Seans</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Paketler</span>
                          <span className="text-xs font-bold text-blue-400">{clientPackages.length} Adet</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Bıraktığı Ciro</span>
                          <span className="text-xs font-bold text-emerald-400">{formatCurrency(totalSpent)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setClientNoteEdit(client.specialNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Notu & Puanı Düzenle</span>
                      </button>

                      <a
                        href={`https://api.whatsapp.com/send?phone=${client.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition"
                        title="WhatsApp Mesajı Başlat"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGES & SESSIONS TRACKING */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Paket & Seans Takip Modülü
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Lazer epilasyon, bölgesel incelme ve medikal cilt bakım paketlerini tanımlayın; her seanstan sonra tek tıkla seansı düşüp danışana WhatsApp bilgilendirmesi gönderin.
                </p>
              </div>

              <button
                onClick={() => setIsAddPackageOpen(!isAddPackageOpen)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Paket Satışı Tanımla</span>
              </button>
            </div>

            {/* Add Package Form Card */}
            {isAddPackageOpen && (
              <form onSubmit={handleCreatePackage} className="p-6 rounded-2xl bg-zinc-950 border border-[#D4AF37]/40 space-y-4">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Yeni Seanslı Paket Satışı Kaydı
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Danışan Adı Soyadı *</label>
                    <input
                      type="text"
                      required
                      value={pkgClientName}
                      onChange={(e) => setPkgClientName(e.target.value)}
                      placeholder="Örn: Zeynep Demir"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Telefon Numarası *</label>
                    <input
                      type="tel"
                      required
                      value={pkgClientPhone}
                      onChange={(e) => setPkgClientPhone(e.target.value)}
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Paket Adı *</label>
                    <input
                      type="text"
                      required
                      value={pkgName}
                      onChange={(e) => setPkgName(e.target.value)}
                      placeholder="Örn: 8 Seans Buz Lazer"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Kategori</label>
                    <select
                      value={pkgCategory}
                      onChange={(e) => setPkgCategory(e.target.value as ServiceCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Lazer Epilasyon">Lazer Epilasyon</option>
                      <option value="Cilt Bakımı">Cilt Bakımı</option>
                      <option value="Bölgesel İncelme">Bölgesel İncelme</option>
                      <option value="Protez Tırnak & Manikür">Protez Tırnak & Manikür</option>
                      <option value="İpek Kirpik & Kaş">İpek Kirpik & Kaş</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Toplam Seans Sayısı *</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      required
                      value={pkgTotalSessions}
                      onChange={(e) => setPkgTotalSessions(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Toplam Paket Tutarı (TL) *</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      required
                      value={pkgTotalPrice}
                      onChange={(e) => setPkgTotalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Tahsil Edilen Peşinat (TL) *</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      required
                      value={pkgPaidAmount}
                      onChange={(e) => setPkgPaidAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Not / Protokol Detayı</label>
                  <input
                    type="text"
                    value={pkgNotes}
                    onChange={(e) => setPkgNotes(e.target.value)}
                    placeholder="Uygulanacak bölgeler, atış değerleri, taksit notu..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPackageOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    Paketi Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* Packages List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => {
                const remaining = pkg.totalSessions - pkg.completedSessions;
                const progressPct = Math.round((pkg.completedSessions / pkg.totalSessions) * 100);
                const debt = pkg.totalPrice - pkg.paidAmount;

                return (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10">
                          {pkg.category}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">{pkg.clientPhone}</span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-white">{pkg.packageName}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Danışan: <strong className="text-white">{pkg.clientName}</strong></p>

                      {/* Progress Bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-300">
                            {pkg.completedSessions} / {pkg.totalSessions} Seans Tamamlandı
                          </span>
                          <span className="text-[#D4AF37] font-bold">
                            {remaining === 0 ? 'TAMAMLANDI' : `${remaining} Seans Kaldı`}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#997929] to-[#D4AF37] transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Financial info & Notes */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Paket Tutarı</span>
                          <span className="font-bold text-white">{formatCurrency(pkg.totalPrice)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Tahsil Edilen</span>
                          <span className="font-bold text-emerald-400">{formatCurrency(pkg.paidAmount)}</span>
                        </div>
                        {debt > 0 && (
                          <div>
                            <span className="text-[10px] text-zinc-500 block">Kalan Bakiye</span>
                            <span className="font-bold text-red-400">{formatCurrency(debt)}</span>
                          </div>
                        )}
                      </div>

                      {pkg.notes && (
                        <p className="mt-3 text-[11px] text-zinc-400 italic bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60">
                          {pkg.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                        title="Paketi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendPackageSessionWhatsApp(pkg)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          title="WhatsApp Seans Durumu Gönder"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp Bilgilendir</span>
                        </button>

                        <button
                          onClick={() => consumeSession(pkg.id)}
                          disabled={remaining <= 0}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            remaining <= 0
                              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                              : 'bg-[#D4AF37] hover:bg-[#E5BF47] text-black shadow-md'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Seans Düş (-1)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: FINANCE, EXPENSES & NET PROFIT */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Kasa, Gider Yönetimi & Net Salon Kârı
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Gerçekleşen seans cirosundan kira, malzeme, elektrik ve personel masraflarını düşerek salonunuzun gerçek <strong>Net Kârını</strong> anlık olarak raporlayın.
                </p>
              </div>

              <button
                onClick={() => setIsAddExpenseOpen(!isAddExpenseOpen)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Masraf / Gider Ekle</span>
              </button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Tamamlanan Ciro (Gelir)</span>
                <div className="text-2xl font-black text-emerald-400 mt-1.5">
                  {formatCurrency(completedRevenue)}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">Bekleyen Seans: {formatCurrency(totalExpectedRevenue - completedRevenue)}</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Toplam Masraflar (Gider)</span>
                <div className="text-2xl font-black text-red-400 mt-1.5">
                  {formatCurrency(totalExpenses)}
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">{expenses.length} adet kayıtlı harcama</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 border border-[#D4AF37]/50 shadow-xl">
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">NET SALON KÂRI</span>
                <div className="text-2xl font-black text-[#D4AF37] mt-1.5">
                  {formatCurrency(netProfit)}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  {netProfit >= 0 ? 'Kârlı Operasyon' : 'Gider Fazlası'}
                </span>
              </div>
            </div>

            {/* Add Expense Form Card */}
            {isAddExpenseOpen && (
              <form onSubmit={handleCreateExpense} className="p-6 rounded-2xl bg-zinc-950 border border-red-500/40 space-y-4">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Yeni Salon Masrafı / Gider Kaydı
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-zinc-400 mb-1">Gider Başlığı *</label>
                    <input
                      type="text"
                      required
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      placeholder="Örn: Otoklav Sterilizasyon Torbaları & Törpü Alımı"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Kategori</label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Kira & Aidat">Kira & Aidat</option>
                      <option value="Kozmetik & Sarf Malzeme">Kozmetik & Sarf Malzeme</option>
                      <option value="Elektrik, Su, Isınma">Elektrik, Su, Isınma</option>
                      <option value="Personel & Hakediş">Personel & Hakediş</option>
                      <option value="Pazarlama & Reklam">Pazarlama & Reklam</option>
                      <option value="Diğer Masraflar">Diğer Masraflar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Tutar (TL) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      step={50}
                      value={expAmount}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Tarih</label>
                    <input
                      type="date"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Açıklama / Fatura No</label>
                  <input
                    type="text"
                    value={expNote}
                    onChange={(e) => setExpNote(e.target.value)}
                    placeholder="Tedarikçi firma, fiş/fatura numarası..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    Gideri Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* Expenses Table */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Gider & Masraf Listesi</h4>
              <div className="divide-y divide-zinc-900">
                {expenses.map((exp) => (
                  <div key={exp.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{exp.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {exp.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {exp.date} {exp.note && `· ${exp.note}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-red-400">-{formatCurrency(exp.amount)}</span>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                        title="Gideri Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SLOT & DAY MANAGEMENT */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Randevu Saatleri & Kapalı Gün/Saat Ayarları
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Salonunuzun açık olduğu saat dilimlerini belirleyin veya istediğiniz özel günleri/saatleri randevuya kapatın. Buradaki değişiklikler hem <strong>web sitesindeki müşteri randevu penceresine</strong> hem de <strong>haftalık takvim tablosuna</strong> anında yansır.
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

            {/* Block / Close Specific Day or Date Box */}
            <div className="p-6 rounded-2xl bg-zinc-950/90 border border-red-900/40 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                <h4 className="text-sm font-bold text-white">Özel Gün Kapatma / Tatil Kilitleme</h4>
              </div>
              <p className="text-xs text-zinc-400">
                Resmi tatil, izin veya tadilat günlerinde salonu randevuya kapatabilirsiniz. Kapalı günlerde müşteriler randevu alamaz.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="date"
                  min={todayStr}
                  value={manualBlockDateInput}
                  onChange={(e) => setManualBlockDateInput(e.target.value)}
                  className="w-full sm:w-60 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500"
                />

                <button
                  type="button"
                  onClick={() => toggleBlockDate(manualBlockDateInput)}
                  className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDateBlocked(manualBlockDateInput)
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {isDateBlocked(manualBlockDateInput) ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{manualBlockDateInput} Tarihini Randevuya Aç</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>{manualBlockDateInput} Tarihini Tamamen Kapat</span>
                    </>
                  )}
                </button>
              </div>

              {blockedDates.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                    Şu Anda Kapalı Olan Günler:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map((d) => (
                      <span
                        key={d}
                        className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium flex items-center gap-2"
                      >
                        <span>{d}</span>
                        <button
                          onClick={() => toggleBlockDate(d)}
                          className="hover:text-white cursor-pointer"
                          title="Kilidi Aç"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                  const todayClosed = isSlotBlocked(todayStr, slot);

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
                            todayClosed
                              ? 'text-red-400'
                              : todayBooked
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {todayClosed ? 'Bugün: Kapalı' : todayBooked ? 'Bugün: Dolu' : 'Bugün: Müsait'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleBlockSlot(todayStr, slot)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-[#D4AF37] hover:bg-zinc-900 transition cursor-pointer"
                          title={todayClosed ? 'Bugün için saati aç' : 'Bugün için saati kapat'}
                        >
                          {todayClosed ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => removeTimeSlot(slot)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition cursor-pointer"
                          title={`"${slot}" saatini tamamen kaldır`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SERVICES & PRICE MANAGEMENT */}
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

        {/* TAB 8: PRODUCTS & WHATSAPP SHOP MANAGEMENT */}
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

        {/* TAB 9: USERS & STAFF MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <span>Yönetici & Personel Yetki Yönetimi</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Yönetim paneline giriş yapabilecek kişileri belirleyin, yeni personel ekleyin veya şifreleri güncelleyin.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserFormError('');
                  setNewUsername('');
                  setNewPassword('');
                  setNewName('');
                  setNewRole('Personel');
                  setIsAddUserOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#997929] via-[#D4AF37] to-[#F3E5AB] text-black font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Yeni Kullanıcı Ekle</span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-start gap-3">
              <Key className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 space-y-1">
                <p className="font-semibold text-white">
                  Giriş Güvenliği ve Bulut Eşitlemesi
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Ana yönetici kullanıcı adı <strong className="text-[#D4AF37]">SY</strong>, şifresi ise <strong className="text-[#D4AF37]">3939</strong>&apos;dur.
                  Buraya ekleyeceğiniz veya şifresini değiştireceğiniz her kullanıcı, Firebase bulut veritabanı sayesinde <strong>tüm cihaz ve telefonlarda anında geçerli olur</strong>.
                </p>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminUsers.map((user) => {
                const isSuperAdmin = user.username.toUpperCase() === 'SY';
                const isSelf = currentUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-[#D4AF37]/40 transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#997929] via-[#D4AF37] to-[#F3E5AB] p-[1.5px] shrink-0">
                            <div className="w-full h-full bg-[#0A0A0C] rounded-2xl flex items-center justify-center font-serif font-black text-sm text-[#D4AF37]">
                              {user.name.slice(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-400">
                                  (Siz)
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-zinc-400 font-mono">@{user.username}</p>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider shrink-0 ${
                            user.role === 'Yönetici'
                              ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]'
                              : 'bg-blue-500/15 border border-blue-500/40 text-blue-400'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-1.5 font-mono">
                        <div className="flex items-center justify-between text-zinc-400">
                          <span className="text-[11px] font-sans">Kullanıcı Adı:</span>
                          <span className="text-white font-bold">{user.username}</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-400">
                          <span className="text-[11px] font-sans">Şifre:</span>
                          <span className="text-zinc-300 font-bold tracking-widest">
                            {user.password.length > 0 ? '••••••••' : '(Şifresiz)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setChangePassUser(user);
                          setNewPassInput('');
                          setShowNewPass(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Şifre Değiştir</span>
                      </button>

                      {isSuperAdmin ? (
                        <span className="text-[10px] text-zinc-500 italic px-2 py-1 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Ana Yönetici
                        </span>
                      ) : isSelf ? (
                        <span className="text-[10px] text-zinc-500 italic px-2 py-1 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Aktif Oturum
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`"${user.name}" (@${user.username}) kullanıcısını silmek istediğinize emin misiniz?`)) {
                              deleteAdminUser(user.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition cursor-pointer"
                          title="Kullanıcıyı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
                      const blocked = isSlotBlocked(newDate, slot);
                      const unavailable = occupied || blocked;
                      return (
                        <option key={slot} value={slot} disabled={unavailable}>
                          {slot} {blocked ? '— (KAPALI)' : occupied ? '— (DOLU)' : '— (Müsait)'}
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

      {/* MODAL 3: CRM CLIENT PROFILE & NOTES EDITOR MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-zinc-950 border border-[#D4AF37]/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">{selectedClient.name}</h3>
                  <p className="text-xs text-zinc-400">{selectedClient.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Loyalty Points Section */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Mevcut ParaPuan Cüzdanı</span>
                <span className="text-xl font-black text-[#D4AF37]">{selectedClient.loyaltyPoints} ₺</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  step={10}
                  value={pointAddInput}
                  onChange={(e) => setPointAddInput(Number(e.target.value))}
                  className="w-20 px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white text-center"
                />
                <button
                  type="button"
                  onClick={() => {
                    addLoyaltyPoints(selectedClient.phone, pointAddInput);
                    setSelectedClient((prev) => prev ? { ...prev, loyaltyPoints: prev.loyaltyPoints + pointAddInput } : null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold cursor-pointer"
                >
                  + Ekle
                </button>
              </div>
            </div>

            {/* Special Notes & Formula Memory Editor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Uzman Notları, Alerjiler & İşlem / Formül Hafızası
              </label>
              <textarea
                rows={4}
                value={clientNoteEdit}
                onChange={(e) => setClientNoteEdit(e.target.value)}
                placeholder="Örn: Ciltte niasinamid hassasiyeti var, badem tırnak formunda 04 numaralı nude oje tercih ediyor..."
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  updateClientNotes(selectedClient.phone, clientNoteEdit);
                  setSelectedClient((prev) => prev ? { ...prev, specialNotes: clientNoteEdit } : null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Hafıza Notunu Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN USER */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-[#D4AF37]/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Yeni Kullanıcı / Personel Ekle
                  </h3>
                  <p className="text-[11px] text-zinc-400">Yönetim paneline erişim yetkisi tanımlayın</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Kullanıcı Adı (Girişte kullanılacak) *
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Örn: asistan1, sema"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Giriş Şifresi *
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Örn: 1234, Salon2026*"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Ad Soyad / Ünvan
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Örn: Ayşe Yılmaz (Cilt Uzmanı)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Yetki Derecesi (Rol)
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'Yönetici' | 'Personel')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Personel">Personel (Randevu & Seans Takibi)</option>
                  <option value="Yönetici">Yönetici (Tam Yetki & Kasa Erişimi)</option>
                </select>
              </div>

              {userFormError && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs">
                  {userFormError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold hover:text-white cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#997929] via-[#D4AF37] to-[#F3E5AB] text-black font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Kullanıcıyı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE USER PASSWORD */}
      {changePassUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm p-6 rounded-2xl bg-zinc-950 border border-[#D4AF37]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-white">
                    Şifre Değiştir
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {changePassUser.name} (@{changePassUser.username})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChangePassUser(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Yeni Şifre *
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    autoFocus
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="Yeni şifreyi giriniz"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="p-1 text-zinc-500 hover:text-zinc-300 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangePassUser(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold hover:text-white cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Şifreyi Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloud Database Connect Modal */}
      <FirebaseConnectModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />
    </div>
  );
}
