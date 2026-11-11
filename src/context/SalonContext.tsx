'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  SalonAppointment,
  CartItem,
  SalonProduct,
  SalonService,
  ClientProfile,
  ClientPackage,
  SalonExpense,
  AdminUser,
} from '@/types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_TIME_SLOTS,
  INITIAL_CLIENTS,
  INITIAL_PACKAGES,
  INITIAL_EXPENSES,
  INITIAL_ADMIN_USERS,
  SALON_INFO,
} from '@/data/initialData';
import {
  getActiveFirebaseConfig,
  getFirebaseDb,
  FirebaseConfig,
} from '@/lib/firebase';
import {
  seedCloudDatabaseIfEmpty,
  subscribeToAppointments,
  subscribeToServices,
  subscribeToProducts,
  subscribeToClients,
  subscribeToPackages,
  subscribeToExpenses,
  subscribeToSettings,
  subscribeToAdminUsers,
  cloudSaveAppointment,
  cloudUpdateAppointmentStatus,
  cloudDeleteAppointment,
  cloudSaveService,
  cloudDeleteService,
  cloudSaveProduct,
  cloudDeleteProduct,
  cloudSaveClient,
  cloudSavePackage,
  cloudDeletePackage,
  cloudSaveExpense,
  cloudDeleteExpense,
  cloudSaveSettings,
  cloudSaveAdminUser,
  cloudDeleteAdminUser,
} from '@/lib/cloudDb';

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
  isClientPortalOpen: boolean;
  setIsClientPortalOpen: (open: boolean) => void;
  isPrePostCareOpen: boolean;
  setIsPrePostCareOpen: (open: boolean) => void;
  isGiftVoucherOpen: boolean;
  setIsGiftVoucherOpen: (open: boolean) => void;
  selectedServiceForBooking: SalonService | null;
  setSelectedServiceForBooking: (service: SalonService | null) => void;

  // WhatsApp Checkout Action (In-Store Pickup)
  sendWhatsAppOrder: (clientInfo: {
    name: string;
    phone: string;
    pickupTime?: string;
    note?: string;
    address?: string;
  }) => void;

  // Feedback Notification
  notification: string | null;
  showNotification: (msg: string) => void;

  // Cloud Database (Firebase)
  isCloudConnected: boolean;
  saveFirebaseConfig: (config: FirebaseConfig) => void;
  clearFirebaseConfig: () => void;

  // Admin Authentication & User Management
  adminUsers: AdminUser[];
  currentUser: AdminUser | null;
  isAuthLoading: boolean;
  loginAdmin: (username: string, pass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  addAdminUser: (userData: Omit<AdminUser, 'id' | 'createdAt'>) => { success: boolean; message: string };
  deleteAdminUser: (id: string) => { success: boolean; message: string };
  updateAdminPassword: (id: string, newPassword: string) => { success: boolean; message: string };
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
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isPrePostCareOpen, setIsPrePostCareOpen] = useState(false);
  const [isGiftVoucherOpen, setIsGiftVoucherOpen] = useState(false);
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

      const savedUsers = localStorage.getItem('sy_admin_users');
      let currentUsersList = INITIAL_ADMIN_USERS;
      if (savedUsers) {
        try {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentUsersList = parsed;
            setAdminUsers(parsed);
          }
        } catch {
          // Ignore
        }
      }

      // Check existing authenticated session
      const storedSession = localStorage.getItem('sy_auth_session');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          const found = currentUsersList.find(
            (u) =>
              u.id === session.id ||
              u.username.toLowerCase() === (session.username || '').toLowerCase()
          );
          if (found) {
            setCurrentUser(found);
          }
        } catch {
          // Ignore
        }
      }
      setIsAuthLoading(false);
    } catch {
      setIsAuthLoading(false);
      // Ignore parse errors
    }
  }, []);

  // Realtime Cloud Firestore synchronization across devices
  const isCloudSeededRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const config = getActiveFirebaseConfig();
    if (!config) {
      setIsCloudConnected(false);
      return;
    }

    try {
      const db = getFirebaseDb();
      if (!db) {
        setIsCloudConnected(false);
        return;
      }

      setIsCloudConnected(true);

      // Seed if cloud is completely fresh
      if (!isCloudSeededRef.current) {
        isCloudSeededRef.current = true;
        seedCloudDatabaseIfEmpty({
          services,
          products,
          appointments,
          clients,
          packages,
          expenses,
          users: adminUsers,
          timeSlots,
          blockedDates,
          blockedSlots,
        });
      }

      // Realtime Admin Users listener
      const unsubUsers = subscribeToAdminUsers((cloudUsers) => {
        if (cloudUsers && cloudUsers.length > 0) {
          setAdminUsers(cloudUsers);
          localStorage.setItem('sy_admin_users', JSON.stringify(cloudUsers));
          setCurrentUser((prev) => {
            if (!prev) return null;
            const updated = cloudUsers.find((u) => u.id === prev.id);
            return updated || prev;
          });
        }
      });

      // Realtime Appointments listener
      const unsubApts = subscribeToAppointments((cloudApts) => {
        if (cloudApts) {
          setAppointments(cloudApts);
          localStorage.setItem('sy_appointments', JSON.stringify(cloudApts));
        }
      });

      // Realtime Services listener
      const unsubSrv = subscribeToServices((cloudSrv) => {
        if (cloudSrv && cloudSrv.length > 0) {
          setServices(cloudSrv);
          localStorage.setItem('sy_services', JSON.stringify(cloudSrv));
        }
      });

      // Realtime Products listener
      const unsubPrd = subscribeToProducts((cloudPrd) => {
        if (cloudPrd && cloudPrd.length > 0) {
          setProducts(cloudPrd);
          localStorage.setItem('sy_products', JSON.stringify(cloudPrd));
        }
      });

      // Realtime Clients listener
      const unsubClients = subscribeToClients((cloudClients) => {
        if (cloudClients && cloudClients.length > 0) {
          setClients(cloudClients);
          localStorage.setItem('sy_clients', JSON.stringify(cloudClients));
        }
      });

      // Realtime Packages listener
      const unsubPkg = subscribeToPackages((cloudPkg) => {
        if (cloudPkg && cloudPkg.length > 0) {
          setPackages(cloudPkg);
          localStorage.setItem('sy_packages', JSON.stringify(cloudPkg));
        }
      });

      // Realtime Expenses listener
      const unsubExp = subscribeToExpenses((cloudExp) => {
        if (cloudExp && cloudExp.length > 0) {
          setExpenses(cloudExp);
          localStorage.setItem('sy_expenses', JSON.stringify(cloudExp));
        }
      });

      // Realtime Settings (Slots, Blocked Dates & Times) listener
      const unsubSettings = subscribeToSettings((settings) => {
        if (settings.timeSlots && settings.timeSlots.length > 0) {
          setTimeSlots(settings.timeSlots);
          localStorage.setItem('sy_time_slots', JSON.stringify(settings.timeSlots));
        }
        if (settings.blockedDates) {
          setBlockedDates(settings.blockedDates);
          localStorage.setItem('sy_blocked_dates', JSON.stringify(settings.blockedDates));
        }
        if (settings.blockedSlots) {
          setBlockedSlots(settings.blockedSlots);
          localStorage.setItem('sy_blocked_slots', JSON.stringify(settings.blockedSlots));
        }
      });

      return () => {
        unsubUsers();
        unsubApts();
        unsubSrv();
        unsubPrd();
        unsubClients();
        unsubPkg();
        unsubExp();
        unsubSettings();
      };
    } catch (err) {
      console.error('Firebase realtime setup error:', err);
      setIsCloudConnected(false);
    }
  }, []);

  const saveFirebaseConfig = (config: FirebaseConfig) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_firebase_config', JSON.stringify(config));
      showNotification('Firebase bağlantı bilgileri kaydedildi! Canlı senkronizasyon başlatılıyor...');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  const clearFirebaseConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sy_firebase_config');
      showNotification('Firebase bağlantısı kesildi. Yerel moda geçildi.');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  // Admin Authentication & User Management
  const loginAdmin = (username: string, pass: string): { success: boolean; message: string } => {
    const trimmedUser = username.trim();
    const trimmedPass = pass.trim();

    const matched = adminUsers.find(
      (u) =>
        u.username.toLowerCase() === trimmedUser.toLowerCase() &&
        u.password === trimmedPass
    );

    if (matched) {
      setCurrentUser(matched);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'sy_auth_session',
          JSON.stringify({ id: matched.id, username: matched.username, role: matched.role })
        );
      }
      showNotification(`Hoş geldiniz, ${matched.name}!`);
      return { success: true, message: 'Giriş başarılı.' };
    }

    return {
      success: false,
      message: 'Kullanıcı adı veya şifre hatalı. Lütfen kontrol edip tekrar deneyiniz.',
    };
  };

  const logoutAdmin = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sy_auth_session');
    }
    showNotification('Yönetim panelinden güvenli çıkış yapıldı.');
  };

  const addAdminUser = (
    userData: Omit<AdminUser, 'id' | 'createdAt'>
  ): { success: boolean; message: string } => {
    const trimmedUsername = userData.username.trim();
    if (!trimmedUsername) {
      return { success: false, message: 'Kullanıcı adı boş bırakılamaz.' };
    }
    if (!userData.password.trim()) {
      return { success: false, message: 'Şifre boş bırakılamaz.' };
    }

    const exists = adminUsers.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        message: `"${trimmedUsername}" kullanıcı adı zaten kayıtlı. Başka bir kullanıcı adı seçiniz.`,
      };
    }

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      username: trimmedUsername,
      password: userData.password.trim(),
      name: userData.name.trim() || trimmedUsername,
      role: userData.role || 'Personel',
      createdAt: new Date().toISOString(),
    };

    const updated = [...adminUsers, newUser];
    setAdminUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_admin_users', JSON.stringify(updated));
    }
    cloudSaveAdminUser(newUser).catch(console.error);
    showNotification(`Yeni kullanıcı "${newUser.name}" eklendi.`);
    return { success: true, message: 'Kullanıcı başarıyla eklendi.' };
  };

  const deleteAdminUser = (id: string): { success: boolean; message: string } => {
    const target = adminUsers.find((u) => u.id === id);
    if (!target) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    if (target.username.toUpperCase() === 'SY') {
      return {
        success: false,
        message: 'Ana yönetici hesabı ("SY") silinemez.',
      };
    }

    if (currentUser && currentUser.id === id) {
      return {
        success: false,
        message: 'Şu anda oturumu açık olan kendi hesabınızı silemezsiniz.',
      };
    }

    const updated = adminUsers.filter((u) => u.id !== id);
    setAdminUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_admin_users', JSON.stringify(updated));
    }
    cloudDeleteAdminUser(id).catch(console.error);
    showNotification(`"${target.name}" kullanıcısı silindi.`);
    return { success: true, message: 'Kullanıcı silindi.' };
  };

  const updateAdminPassword = (
    id: string,
    newPassword: string
  ): { success: boolean; message: string } => {
    if (!newPassword.trim()) {
      return { success: false, message: 'Şifre boş olamaz.' };
    }

    const target = adminUsers.find((u) => u.id === id);
    if (!target) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    const updatedUser = { ...target, password: newPassword.trim() };
    const updated = adminUsers.map((u) => (u.id === id ? updatedUser : u));
    setAdminUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sy_admin_users', JSON.stringify(updated));
    }
    cloudSaveAdminUser(updatedUser).catch(console.error);

    if (currentUser?.id === id) {
      setCurrentUser(updatedUser);
    }

    showNotification(`"${target.name}" kullanıcısının şifresi güncellendi.`);
    return { success: true, message: 'Şifre güncellendi.' };
  };

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
    cloudSaveService(newService).catch(console.error);
    showNotification(`"${newService.name}" hizmeti eklendi.`);
  };

  const updateService = (id: string, updatedFields: Partial<SalonService>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    saveServices(updated);
    const target = updated.find((s) => s.id === id);
    if (target) {
      cloudSaveService(target).catch(console.error);
    }
    showNotification('İşlem fiyatı ve detayları güncellendi.');
  };

  const deleteService = (id: string) => {
    const target = services.find((s) => s.id === id);
    const updated = services.filter((s) => s.id !== id);
    saveServices(updated);
    cloudDeleteService(id).catch(console.error);
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
    cloudSaveProduct(newProduct).catch(console.error);
    showNotification(`"${newProduct.name}" mağazaya eklendi ve yayında!`);
  };

  const updateProduct = (id: string, updatedFields: Partial<SalonProduct>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    saveProducts(updated);
    const target = updated.find((p) => p.id === id);
    if (target) {
      cloudSaveProduct(target).catch(console.error);
    }
    showNotification('Ürün ve fiyat güncellendi.');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    cloudDeleteProduct(id).catch(console.error);
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
    cloudSaveAppointment(newApt).catch(console.error);

    // Auto-register client in CRM if new
    const existingClient = clients.find(
      (c) => c.phone.replace(/[^0-9]/g, '') === newApt.clientPhone.replace(/[^0-9]/g, '')
    );
    if (!existingClient) {
      const newClientProfile: ClientProfile = {
        name: newApt.clientName,
        phone: newApt.clientPhone,
        specialNotes: newApt.notes || 'Web üzerinden ilk randevu.',
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
      };
      saveClients([newClientProfile, ...clients]);
      cloudSaveClient(newClientProfile).catch(console.error);
    }

    showNotification(`Randevu kaydedildi: ${newApt.clientName} (${newApt.time})`);
  };

  const updateAppointmentStatus = (id: string, status: SalonAppointment['status']) => {
    const targetApt = appointments.find((a) => a.id === id);
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    saveAppointments(updated);
    cloudUpdateAppointmentStatus(id, status).catch(console.error);

    // If status is TAMAMLANDI, automatically award 5% loyalty ParaPuan to client!
    if (status === 'TAMAMLANDI' && targetApt) {
      const earnedPoints = Math.round(targetApt.price * 0.05);
      const cleanPhone = targetApt.clientPhone.replace(/[^0-9]/g, '');
      const clientExists = clients.find((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      if (clientExists) {
        const updatedClient = {
          ...clientExists,
          loyaltyPoints: clientExists.loyaltyPoints + earnedPoints,
        };
        const updatedClients = clients.map((c) =>
          c.phone.replace(/[^0-9]/g, '') === cleanPhone ? updatedClient : c
        );
        saveClients(updatedClients);
        cloudSaveClient(updatedClient).catch(console.error);
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
    cloudDeleteAppointment(id).catch(console.error);
    showNotification('Randevu kaydı silindi.');
  };

  const markAppointmentReminded = (id: string) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, reminded: true } : a));
    saveAppointments(updated);
    const target = updated.find((a) => a.id === id);
    if (target) {
      cloudSaveAppointment(target).catch(console.error);
    }
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
    cloudSaveSettings({ timeSlots: updated }).catch(console.error);
    showNotification(`Yeni randevu saati eklendi: ${trimmed}`);
  };

  const removeTimeSlot = (slot: string) => {
    if (timeSlots.length <= 1) {
      showNotification('En az bir randevu saati bulunmalıdır.');
      return;
    }
    const updated = timeSlots.filter((s) => s !== slot);
    saveTimeSlots(updated);
    cloudSaveSettings({ timeSlots: updated }).catch(console.error);
    showNotification(`Randevu saati kaldırıldı: ${slot}`);
  };

  const resetTimeSlots = () => {
    saveTimeSlots(INITIAL_TIME_SLOTS);
    cloudSaveSettings({ timeSlots: INITIAL_TIME_SLOTS }).catch(console.error);
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
    cloudSaveSettings({ blockedDates: updated }).catch(console.error);
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
    cloudSaveSettings({ blockedSlots: updated }).catch(console.error);
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
    let updatedClient: ClientProfile | undefined;
    const updated = clients.map((c) => {
      if (c.phone.replace(/[^0-9]/g, '') === cleanPhone) {
        updatedClient = { ...c, specialNotes: notes };
        return updatedClient;
      }
      return c;
    });
    saveClients(updated);
    if (updatedClient) {
      cloudSaveClient(updatedClient).catch(console.error);
    }
    showNotification('Danışan formül ve işlem hafızası güncellendi.');
  };

  const addLoyaltyPoints = (phone: string, points: number) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let updatedClient: ClientProfile | undefined;
    const updated = clients.map((c) => {
      if (c.phone.replace(/[^0-9]/g, '') === cleanPhone) {
        updatedClient = { ...c, loyaltyPoints: Math.max(0, c.loyaltyPoints + points) };
        return updatedClient;
      }
      return c;
    });
    saveClients(updated);
    if (updatedClient) {
      cloudSaveClient(updatedClient).catch(console.error);
    }
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
    cloudSavePackage(newPkg).catch(console.error);
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

    let updatedPkg: ClientPackage | undefined;
    const updated = packages.map((p) => {
      if (p.id === packageId) {
        updatedPkg = {
          ...p,
          completedSessions: p.completedSessions + 1,
          lastSessionDate: today,
        };
        return updatedPkg;
      }
      return p;
    });

    savePackages(updated);
    if (updatedPkg) {
      cloudSavePackage(updatedPkg).catch(console.error);
    }
    const remaining = target.totalSessions - (target.completedSessions + 1);
    showNotification(`1 seans düşüldü! Kalan seans: ${remaining}`);
  };

  const deletePackage = (packageId: string) => {
    const updated = packages.filter((p) => p.id !== packageId);
    savePackages(updated);
    cloudDeletePackage(packageId).catch(console.error);
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
    cloudSaveExpense(newExp).catch(console.error);
    showNotification(`Masraf kaydedildi: ${newExp.title}`);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    saveExpenses(updated);
    cloudDeleteExpense(id).catch(console.error);
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

  // WhatsApp Checkout Action (In-Store Pickup)
  const sendWhatsAppOrder = (clientInfo: {
    name: string;
    phone: string;
    pickupTime?: string;
    note?: string;
    address?: string;
  }) => {
    if (cart.length === 0) return;

    let message = `*✨ SİMAY YORULMAZ HEALTH & BEAUTY - DÜKKANDAN TESLİM SİPARİŞ ✨*\n\n`;
    message += `*Müşteri:* ${clientInfo.name}\n`;
    message += `*Telefon:* ${clientInfo.phone}\n`;
    message += `*Teslimat:* 🏬 Dükkandan Elden Teslim Alma (Demirköy Salonu)\n`;
    if (clientInfo.pickupTime) {
      message += `*Tahmini Teslim Alma:* ${clientInfo.pickupTime}\n`;
    }
    if (clientInfo.note) {
      message += `*Sipariş Notu:* ${clientInfo.note}\n`;
    }
    message += `\n*Ayrılacak Ürünler (Sepet):*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} x ${item.quantity} adet = ${item.product.price * item.quantity} ₺\n`;
    });

    message += `\n*TOPLAM TUTAR:* ${cartTotal} ₺\n`;
    message += `\n_Merhaba Simay Hanım, web sitenizden yukarıdaki ürünleri dükkandan elden teslim almak üzere ayırtmak istiyorum. Ürünler hazırlandığında bilgi verebilir misiniz?_`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encoded}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    setIsCartOpen(false);
    showNotification('Siparişiniz WhatsApp mesajı olarak yönlendirildi! Ürünleriniz dükkanda sizin için hazırlanacaktır.');
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
        isClientPortalOpen,
        setIsClientPortalOpen,
        isPrePostCareOpen,
        setIsPrePostCareOpen,
        isGiftVoucherOpen,
        setIsGiftVoucherOpen,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        sendWhatsAppOrder,
        notification,
        showNotification,
        isCloudConnected,
        saveFirebaseConfig,
        clearFirebaseConfig,
        adminUsers,
        currentUser,
        isAuthLoading,
        loginAdmin,
        logoutAdmin,
        addAdminUser,
        deleteAdminUser,
        updateAdminPassword,
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
