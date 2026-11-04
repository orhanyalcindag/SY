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
}

export interface CartItem {
  product: SalonProduct;
  quantity: number;
}
