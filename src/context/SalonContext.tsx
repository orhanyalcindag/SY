'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SalonAppointment,
  CartItem,
  SalonProduct,
  SalonService,
  ClientProfile,
  ClientPackage,
  SalonExpense,
  BeforeAfterItem,
} from '@/types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_TIME_SLOTS,
  INITIAL_CLIENTS,
  INITIAL_PACKAGES,
  INITIAL_EXPENSES,
  INITIAL_BEFORE_AFTER,
  SALON_INFO,
} from '@/data/initialData';

interface SalonContextType {
  // Services
  services: SalonService[];
  addService: (service: Omit<SalonService, 'id'>) => void;
  updateService: (id: string, updated: Partial<SalonService>) => void;
  deleteService: (id: string) => void;

  // Products
  products: SalonProduct[];
  addProduct: (product: Omit<SalonProduct, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<SalonProduct>) => void;
  deleteProduct: (id: string) => void;

  // Appointments
  appointments: SalonAppointment[];
  addAppointment: (appointment: Omit<SalonAppointment, 'id' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: SalonAppointment['status']) => void;
  deleteAppointment: (id: string) => void;
  markAppointmentReminded: (id: string) => void;

  // Time Slots Management
  timeSlots: string[];
  addTimeSlot: (slot: string) => void;
  removeTimeSlot: (slot: string) => void;
  resetTimeSlots: () => void;
  isSlotBooked: (date: string, time: string, excludeAptId?: string) => boolean;
  getOccupiedSlotsForDate: (date: string) => string[];

  // Blocked Dates and Slots Management
  blockedDates: string[];
  blockedSlots: string[];
  toggleBlockDate: (date: string) => void;
  toggleBlockSlot: (date: string, time: string) => void;
  isDateBlocked: (date: string) => boolean;
  isSlotBlocked: (date: string, time: string) => boolean;

  // CRM & Client Dossier
  clients: ClientProfile[];
  updateClientNotes: (phone: string, notes: string) => void;
  addLoyaltyPoints: (phone: string, points: number) => void;
  getClientByPhone: (phone: string) => ClientProfile | undefined;

  // Packages & Sessions
  packages: ClientPackage[];
  addPackage: (pkg: Omit<ClientPackage, 'id'>) => void;
  consumeSession: (packageId: string) => void;
  deletePackage: (packageId: string) => void;

  // Expenses & Cashflow
  expenses: SalonExpense[];
  addExpense: (expense: Omit<SalonExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Before & After Gallery
  beforeAfterItems: BeforeAfterItem[];

  // Cart & Shopping
  cart: CartItem[];
  addToCart: (product: SalonProduct) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Drawers & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  isConsultationOpen: boolean;
  setIsConsultationOpen: (open: boolean) => void;
  selectedServiceForBooking: SalonService | null;
  setSelectedServiceForBooking: (service: SalonService | null) => void;

  // WhatsApp Checkout Action
  sendWhatsAppOrder: (clientInfo: { name: string; phone: string; address?: string; note?: string }) => void;

  // Feedback Notification
  notification: string | null;
  showNotification: (msg: string) => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export function SalonProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<SalonService[]>(INITIAL_SERVICES);
  const [products, setProducts] = useState<SalonProduct[]>(INITIAL_PRODUCTS);
  const [appointments, setAppointments] = useState<SalonAppointment[]>(INITIAL_APPOINTMENTS);
  const [timeSlots, setTimeSlots] = useState<string[]>(INITIAL_TIME_SLOTS);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [packages, setPackages] = useState<ClientPackage[]>(INITIAL_PACKAGES);
  const [expenses, setExpenses] = useState<SalonExpense[]>(INITIAL_EXPENSES);
  const [beforeAfterItems] = useState<BeforeAfterItem[]>(INITIAL_BEFORE_AFTER);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<SalonService | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedServices = localStorage.getItem('sy_services');
      if (savedServices) {
        const parsed = JSON.parse(savedServices) as SalonService[];
        const migrated = parsed.map((s) => {
          if (!s.image || s.image.includes('unsplash.com')) {
            const initial = INITIAL_SERVICES.find((init) => init.id === s.id);
            return { ...s, image: initial?.image || '/images/hydrafacial.jpg' };
          }
          return s;
        });
        setServices(migrated);
      }

      const savedProducts = localStorage.getItem('sy_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts) as SalonProduct[];
        const migrated = parsed.map((p) => {
          if (!p.image || p.image.includes('unsplash.com')) {
            const initial = INITIAL_PRODUCTS.find((init) => init.id === p.id);
            return { ...p, image: initial?.image || '/images/serum-c.jpg' };
          }
          return p;
        });
        setProducts(migrated);
      }

      const savedAppointments = localStorage.getItem('sy_appointments');
      if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

      const savedSlots = localStorage.getItem('sy_time_slots');
      if (savedSlots) setTimeSlots(JSON.parse(savedSlots));

      const savedBlockedDates = localStorage.getItem('sy_blocked_dates');
      if (savedBlockedDates) setBlockedDates(JSON.parse(savedBlockedDates));

      const savedBlockedSlots = localStorage.getItem('sy_blocked_slots');
      if (savedBlockedSlots) setBlockedSlots(JSON.parse(savedBlockedSlots));

      const savedClients = localStorage.getItem('sy_clients');
      if (savedClients) setClients(JSON.parse(savedClients));

      const savedPackages = localStorage.getItem('sy_packages');
      if (savedPackages) setPackages(JSON.parse(savedPackages));

      const savedExpenses = localStorage.getItem('sy_expenses');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Sync helpers
  const saveServices = (newServices: SalonService[]) => {
    setServices(newServices);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_services', JSON.stringify(newServices));
    }
  };

  const saveProducts = (newProducts: SalonProduct[]) => {
    setProducts(newProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_products', JSON.stringify(newProducts));
    }
  };

  const saveAppointments = (newApts: SalonAppointment[]) => {
    setAppointments(newApts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_appointments', JSON.stringify(newApts));
    }
  };

  const saveClients = (newClients: ClientProfile[]) => {
    setClients(newClients);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_clients', JSON.stringify(newClients));
    }
  };

  const savePackages = (newPackages: ClientPackage[]) => {
    setPackages(newPackages);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_packages', JSON.stringify(newPackages));
    }
  };

  const saveExpenses = (newExpenses: SalonExpense[]) => {
    setExpenses(newExpenses);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_expenses', JSON.stringify(newExpenses));
    }
  };

  // Service CRUD
  const addService = (serviceData: Omit<SalonService, 'id'>) => {
    const newService: SalonService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    const updated = [newService, ...services];
    saveServices(updated);
    showNotification(`"${newService.name}" hizmeti eklendi.`);
  };

  const updateService = (id: string, updatedFields: Partial<SalonService>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    saveServices(updated);
    showNotification('İşlem fiyatı ve detayları güncellendi.');
  };

  const deleteService = (id: string) => {
    const target = services.find((s) => s.id === id);
    const updated = services.filter((s) => s.id !== id);
    saveServices(updated);
    showNotification(`"${target?.name || 'Hizmet'}" silindi.`);
  };

  // Product CRUD
  const addProduct = (productData: Omit<SalonProduct, 'id'>) => {
    const newProduct: SalonProduct = {
      ...productData,
      id: `prd-${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    showNotification(`"${newProduct.name}" mağazaya eklendi ve yayında!`);
  };

  const updateProduct = (id: string, updatedFields: Partial<SalonProduct>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    saveProducts(updated);
    showNotification('Ürün ve fiyat güncellendi.');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    showNotification(`"${target?.name || 'Ürün'}" kaldırıldı.`);
  };

  // Appointment CRUD
  const addAppointment = (aptData: Omit<SalonAppointment, 'id' | 'createdAt'>) => {
    const newApt: SalonAppointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newApt, ...appointments];
    saveAppointments(updated);

    // Auto-register client in CRM if new
    const existingClient = clients.find((c) => c.phone.replace(/[^0-9]/g, '') === newApt.clientPhone.replace(/[^0-9]/g, ''));
    if (!existingClient) {
      const newClientProfile: ClientProfile = {
        name: newApt.clientName,
        phone: newApt.clientPhone,
        specialNotes: newApt.notes || 'Web üzerinden ilk randevu.',
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
      };
      saveClients([newClientProfile, ...clients]);
    }

    showNotification(`Randevu kaydedildi: ${newApt.clientName} (${newApt.time})`);
  };

  const updateAppointmentStatus = (id: string, status: SalonAppointment['status']) => {
    const targetApt = appointments.find((a) => a.id === id);
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    saveAppointments(updated);

    // If status is TAMAMLANDI, automatically award 5% loyalty ParaPuan to client!
    if (status === 'TAMAMLANDI' && targetApt) {
      const earnedPoints = Math.round(targetApt.price * 0.05);
      const cleanPhone = targetApt.clientPhone.replace(/[^0-9]/g, '');
      const clientExists = clients.find((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      if (clientExists) {
        const updatedClients = clients.map((c) =>
          c.phone.replace(/[^0-9]/g, '') === cleanPhone
            ? { ...c, loyaltyPoints: c.loyaltyPoints + earnedPoints }
            : c
        );
        saveClients(updatedClients);
        showNotification(`Randevu tamamlandı! Danışana ${earnedPoints} ₺ ParaPuan tanımlandı.`);
      } else {
        showNotification(`Randevu tamamlandı.`);
      }
    } else {
      showNotification(`Randevu durumu güncellendi: ${status}`);
    }
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    saveAppointments(updated);
    showNotification('Randevu kaydı silindi.');
  };

  const markAppointmentReminded = (id: string) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, reminded: true } : a));
    saveAppointments(updated);
    showNotification('WhatsApp hatırlatma gönderimi kaydedildi.');
  };

  // Time Slots Management
  const saveTimeSlots = (slots: string[]) => {
    const sorted = [...slots].sort((a, b) => a.localeCompare(b));
    setTimeSlots(sorted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_time_slots', JSON.stringify(sorted));
    }
  };

  const addTimeSlot = (slot: string) => {
    const trimmed = slot.trim();
    if (!trimmed) return;
    if (timeSlots.includes(trimmed)) {
      showNotification(`"${trimmed}" saati zaten listede mevcut.`);
      return;
    }
    const updated = [...timeSlots, trimmed];
    saveTimeSlots(updated);
    showNotification(`Yeni randevu saati eklendi: ${trimmed}`);
  };

  const removeTimeSlot = (slot: string) => {
    if (timeSlots.length <= 1) {
      showNotification('En az bir randevu saati bulunmalıdır.');
      return;
    }
    const updated = timeSlots.filter((s) => s !== slot);
    saveTimeSlots(updated);
    showNotification(`Randevu saati kaldırıldı: ${slot}`);
  };

  const resetTimeSlots = () => {
    saveTimeSlots(INITIAL_TIME_SLOTS);
    showNotification('Randevu saatleri varsayılan ayarlara döndürüldü.');
  };

  const isSlotBooked = (date: string, time: string, excludeAptId?: string) => {
    return appointments.some(
      (a) => a.date === date && a.time === time && a.status !== 'IPTAL' && a.id !== excludeAptId
    );
  };

  const saveBlockedDates = (dates: string[]) => {
    setBlockedDates(dates);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_blocked_dates', JSON.stringify(dates));
    }
  };

  const saveBlockedSlots = (slots: string[]) => {
    setBlockedSlots(slots);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_blocked_slots', JSON.stringify(slots));
    }
  };

  const toggleBlockDate = (date: string) => {
    const isBlocked = blockedDates.includes(date);
    let updated: string[];
    if (isBlocked) {
      updated = blockedDates.filter((d) => d !== date);
      showNotification(`${date} tarihi randevulara açıldı.`);
    } else {
      updated = [...blockedDates, date];
      showNotification(`${date} tarihi randevulara kapatıldı.`);
    }
    saveBlockedDates(updated);
  };

  const toggleBlockSlot = (date: string, time: string) => {
    const key = `${date}_${time}`;
    const isBlocked = blockedSlots.includes(key);
    let updated: string[];
    if (isBlocked) {
      updated = blockedSlots.filter((k) => k !== key);
      showNotification(`${date} ${time} saati randevulara açıldı.`);
    } else {
      updated = [...blockedSlots, key];
      showNotification(`${date} ${time} saati randevulara kapatıldı.`);
    }
    saveBlockedSlots(updated);
  };

  const isDateBlocked = (date: string) => {
    return blockedDates.includes(date);
  };

  const isSlotBlocked = (date: string, time: string) => {
    return blockedDates.includes(date) || blockedSlots.includes(`${date}_${time}`);
  };

  const getOccupiedSlotsForDate = (date: string) => {
    if (blockedDates.includes(date)) {
      return [...timeSlots];
    }
    const booked = appointments
      .filter((a) => a.date === date && a.status !== 'IPTAL')
      .map((a) => a.time);
    const blocked = blockedSlots
      .filter((k) => k.startsWith(`${date}_`))
      .map((k) => k.replace(`${date}_`, ''));
    return Array.from(new Set([...booked, ...blocked]));
  };

  // CRM: Update Client Notes & Memory
  const updateClientNotes = (phone: string, notes: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const updated = clients.map((c) =>
      c.phone.replace(/[^0-9]/g, '') === cleanPhone ? { ...c, specialNotes: notes } : c
    );
    saveClients(updated);
    showNotification('Danışan formül ve işlem hafızası güncellendi.');
  };

  const addLoyaltyPoints = (phone: string, points: number) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const updated = clients.map((c) =>
      c.phone.replace(/[^0-9]/g, '') === cleanPhone
        ? { ...c, loyaltyPoints: Math.max(0, c.loyaltyPoints + points) }
        : c
    );
    saveClients(updated);
    showNotification(`ParaPuan bakiyesi güncellendi.`);
  };

  const getClientByPhone = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return clients.find((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);
  };

  // Package & Session Tracking
  const addPackage = (pkgData: Omit<ClientPackage, 'id'>) => {
    const newPkg: ClientPackage = {
      ...pkgData,
      id: `pkg-${Date.now()}`,
    };
    const updated = [newPkg, ...packages];
    savePackages(updated);
    showNotification(`"${newPkg.packageName}" paketi ${newPkg.clientName} için tanımlandı.`);
  };

  const consumeSession = (packageId: string) => {
    const target = packages.find((p) => p.id === packageId);
    if (!target) return;
    if (target.completedSessions >= target.totalSessions) {
      showNotification('Bu paketin tüm seansları zaten tamamlanmıştır.');
      return;
    }

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;

    const updated = packages.map((p) => {
      if (p.id === packageId) {
        return {
          ...p,
          completedSessions: p.completedSessions + 1,
          lastSessionDate: today,
        };
      }
      return p;
    });

    savePackages(updated);
    const remaining = target.totalSessions - (target.completedSessions + 1);
    showNotification(`1 seans düşüldü! Kalan seans: ${remaining}`);
  };

  const deletePackage = (packageId: string) => {
    const updated = packages.filter((p) => p.id !== packageId);
    savePackages(updated);
    showNotification('Paket kaydı silindi.');
  };

  // Expenses Management
  const addExpense = (expenseData: Omit<SalonExpense, 'id'>) => {
    const newExp: SalonExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    const updated = [newExp, ...expenses];
    saveExpenses(updated);
    showNotification(`Masraf kaydedildi: ${newExp.title}`);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    saveExpenses(updated);
    showNotification('Gider kaydı silindi.');
  };

  // Cart Management
  const addToCart = (product: SalonProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showNotification(`"${product.name}" sepete eklendi.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // WhatsApp Checkout Action
  const sendWhatsAppOrder = (clientInfo: { name: string; phone: string; address?: string; note?: string }) => {
    if (cart.length === 0) return;

    let message = `*✨ SİMAY YORULMAZ HEALTH & BEAUTY - YENİ SİPARİŞ ✨*\n\n`;
    message += `*Müşteri:* ${clientInfo.name}\n`;
    message += `*Telefon:* ${clientInfo.phone}\n`;
    if (clientInfo.address) {
      message += `*Teslimat Adresi:* ${clientInfo.address}\n`;
    }
    if (clientInfo.note) {
      message += `*Sipariş Notu:* ${clientInfo.note}\n`;
    }
    message += `\n*Sepet İçeriği:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} x ${item.quantity} adet = ${item.product.price * item.quantity} ₺\n`;
    });

    message += `\n*TOPLAM TUTAR:* ${cartTotal} ₺\n`;
    message += `\n_Merhaba Simay Hanım, web sitenizden yukarıdaki ürünlerin siparişini oluşturmak istiyorum. Stok ve kargo/teslimat hakkında bilgi alabilir miyim?_`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encoded}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    setIsCartOpen(false);
    showNotification('Siparişiniz WhatsApp mesajı olarak yönlendirildi!');
  };

  return (
    <SalonContext.Provider
      value={{
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
        beforeAfterItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        isBookingOpen,
        setIsBookingOpen,
        isConsultationOpen,
        setIsConsultationOpen,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        sendWhatsAppOrder,
        notification,
        showNotification,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
}

export function useSalon() {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
}
