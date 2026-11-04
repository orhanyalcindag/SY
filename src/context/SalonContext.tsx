'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SalonAppointment,
  CartItem,
  SalonProduct,
  SalonService,
} from '@/types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
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
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
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
      if (savedServices) setServices(JSON.parse(savedServices));

      const savedProducts = localStorage.getItem('sy_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedAppointments = localStorage.getItem('sy_appointments');
      if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
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

  // Service CRUD
  const addService = (serviceData: Omit<SalonService, 'id'>) => {
    const newService: SalonService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    const updated = [newService, ...services];
    saveServices(updated);
    showNotification(`"${newService.name}" hizmet listesine eklendi.`);
  };

  const updateService = (id: string, updatedFields: Partial<SalonService>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    saveServices(updated);
    showNotification('İşlem bilgileri ve fiyat güncellendi.');
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
    showNotification(`Randevu kaydedildi: ${newApt.clientName} (${newApt.time})`);
  };

  const updateAppointmentStatus = (id: string, status: SalonAppointment['status']) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    saveAppointments(updated);
    showNotification(`Randevu durumu güncellendi: ${status}`);
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    saveAppointments(updated);
    showNotification('Randevu kaydı silindi.');
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

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // WhatsApp Checkout Action
  const sendWhatsAppOrder = (clientInfo: {
    name: string;
    phone: string;
    address?: string;
    note?: string;
  }) => {
    if (cart.length === 0) return;

    let message = `*✨ SİMAY YORULMAZ HEALTH & BEAUTY - YENİ SİPARİŞ ✨*\n\n`;
    message += `*Müşteri Adı:* ${clientInfo.name}\n`;
    message += `*Telefon:* ${clientInfo.phone}\n`;
    if (clientInfo.address) {
      message += `*Teslimat Adresi:* ${clientInfo.address}\n`;
    }
    if (clientInfo.note) {
      message += `*Müşteri Notu:* ${clientInfo.note}\n`;
    }
    message += `\n*📦 SİPARİŞ EDİLEN ÜRÜNLER:*\n`;

    cart.forEach((item, index) => {
      const itemSubtotal = item.product.price * item.quantity;
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   👉 Adet: ${item.quantity} x ${item.product.price.toLocaleString('tr-TR')} ₺ = *${itemSubtotal.toLocaleString('tr-TR')} ₺*\n`;
    });

    message += `\n*💰 GENEL TOPLAM TUTAR:* *${cartTotal.toLocaleString('tr-TR')} ₺*\n\n`;
    message += `_Merhaba Simay Hanım, web sitenizden sepetime eklediğim ürünleri sipariş etmek istiyorum. Stok ve kargo/teslimat hakkında bilgi alabilir miyim? Teşekkürler!_`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encoded}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
    setIsCartOpen(false);
    showNotification('Siparişiniz WhatsApp’a aktarıldı! Teşekkür ederiz.');
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
