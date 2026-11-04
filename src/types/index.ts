export type ServiceCategory =
  | 'Cilt Bakımı'
  | 'Lazer Epilasyon'
  | 'Protez Tırnak & Manikür'
  | 'İpek Kirpik & Kaş'
  | 'Bölgesel İncelme'
  | 'Kalıcı Makyaj';

export type ProductCategory =
  | 'Cilt Bakımı & Serum'
  | 'Güneş Koruması'
  | 'Tırnak & El Bakımı'
  | 'Kaş & Kirpik Serumu'
  | 'Vücut & Masaj Yağı';

export interface SalonService {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  description: string;
  image?: string;
  popular?: boolean;
}

export interface SalonProduct {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export type AppointmentStatus =
  | 'BEKLEMEDE'
  | 'ONAYLANDI'
  | 'ISLEMDE'
  | 'TAMAMLANDI'
  | 'IPTAL';

export interface SalonAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  reminded?: boolean;
}

export interface CartItem {
  product: SalonProduct;
  quantity: number;
}

// 1. Client Profile & Memory (CRM)
export interface ClientProfile {
  phone: string;
  name: string;
  specialNotes?: string; // Cilt hassasiyeti, alerji, formül hafızası (oje rengi, boya kodu vb.)
  loyaltyPoints: number; // ParaPuan Cüzdanı
  createdAt: string;
}

// 2. Package & Session Tracking (Paket & Seans Takip)
export interface ClientPackage {
  id: string;
  clientName: string;
  clientPhone: string;
  packageName: string;
  category: ServiceCategory;
  totalSessions: number;
  completedSessions: number;
  totalPrice: number;
  paidAmount: number;
  startDate: string;
  lastSessionDate?: string;
  notes?: string;
}

// 3. Expenses & Cashflow (Kasa & Gider Takibi)
export type ExpenseCategory =
  | 'Kira & Aidat'
  | 'Kozmetik & Sarf Malzeme'
  | 'Elektrik, Su, Isınma'
  | 'Personel & Hakediş'
  | 'Pazarlama & Reklam'
  | 'Diğer Masraflar';

export interface SalonExpense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  note?: string;
}
