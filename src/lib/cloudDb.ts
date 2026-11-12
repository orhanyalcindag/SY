import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import {
  SalonAppointment,
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
} from '@/data/initialData';

// Firestore collection names
const COL_APPOINTMENTS = 'sy_appointments';
const COL_SERVICES = 'sy_services';
const COL_PRODUCTS = 'sy_products';
const COL_CLIENTS = 'sy_clients';
const COL_PACKAGES = 'sy_packages';
const COL_EXPENSES = 'sy_expenses';
const COL_SETTINGS = 'sy_settings';
const COL_USERS = 'sy_users';
const DOC_SETTINGS = 'general';

export interface SalonSettingsData {
  timeSlots: string[];
  blockedDates: string[];
  blockedSlots: string[];
}

export interface SeedDataPayload {
  services?: SalonService[];
  products?: SalonProduct[];
  appointments?: SalonAppointment[];
  clients?: ClientProfile[];
  packages?: ClientPackage[];
  expenses?: SalonExpense[];
  users?: AdminUser[];
  timeSlots?: string[];
  blockedDates?: string[];
  blockedSlots?: string[];
}

// 1. Initial Seed to Cloud if database is empty on first setup
export async function seedCloudDatabaseIfEmpty(customData?: SeedDataPayload) {
  const db = getFirebaseDb();
  if (!db) return;

  try {
    const servicesSnap = await getDocs(collection(db, COL_SERVICES));
    if (servicesSnap.empty) {
      console.log('Seeding services to Firebase...');
      const seedServices = (customData?.services && customData.services.length > 0)
        ? customData.services
        : INITIAL_SERVICES;
      for (const s of seedServices) {
        await setDoc(doc(db, COL_SERVICES, s.id), s);
      }
    }

    const productsSnap = await getDocs(collection(db, COL_PRODUCTS));
    if (productsSnap.empty) {
      console.log('Seeding products to Firebase...');
      const seedProducts = (customData?.products && customData.products.length > 0)
        ? customData.products
        : INITIAL_PRODUCTS;
      for (const p of seedProducts) {
        await setDoc(doc(db, COL_PRODUCTS, p.id), p);
      }
    }

    const aptSnap = await getDocs(collection(db, COL_APPOINTMENTS));
    if (aptSnap.empty) {
      console.log('Seeding appointments to Firebase...');
      const seedApts = (customData?.appointments && customData.appointments.length > 0)
        ? customData.appointments
        : INITIAL_APPOINTMENTS;
      for (const a of seedApts) {
        await setDoc(doc(db, COL_APPOINTMENTS, a.id), a);
      }
    }

    const clientSnap = await getDocs(collection(db, COL_CLIENTS));
    if (clientSnap.empty) {
      console.log('Seeding clients to Firebase...');
      const seedClients = (customData?.clients && customData.clients.length > 0)
        ? customData.clients
        : INITIAL_CLIENTS;
      for (const c of seedClients) {
        await setDoc(doc(db, COL_CLIENTS, c.phone.replace(/[^0-9]/g, '')), c);
      }
    }

    const pkgSnap = await getDocs(collection(db, COL_PACKAGES));
    if (pkgSnap.empty) {
      console.log('Seeding packages to Firebase...');
      const seedPackages = (customData?.packages && customData.packages.length > 0)
        ? customData.packages
        : INITIAL_PACKAGES;
      for (const pk of seedPackages) {
        await setDoc(doc(db, COL_PACKAGES, pk.id), pk);
      }
    }

    const expSnap = await getDocs(collection(db, COL_EXPENSES));
    if (expSnap.empty) {
      console.log('Seeding expenses to Firebase...');
      const seedExpenses = (customData?.expenses && customData.expenses.length > 0)
        ? customData.expenses
        : INITIAL_EXPENSES;
      for (const ex of seedExpenses) {
        await setDoc(doc(db, COL_EXPENSES, ex.id), ex);
      }
    }

    const userSnap = await getDocs(collection(db, COL_USERS));
    if (userSnap.empty) {
      console.log('Seeding initial admin users to Firebase...');
      const seedUsers = (customData?.users && customData.users.length > 0)
        ? customData.users
        : INITIAL_ADMIN_USERS;
      for (const u of seedUsers) {
        await setDoc(doc(db, COL_USERS, u.id), u);
      }
    }

    const settingsRef = doc(db, COL_SETTINGS, DOC_SETTINGS);
    await setDoc(
      settingsRef,
      {
        timeSlots: customData?.timeSlots && customData.timeSlots.length > 0
          ? customData.timeSlots
          : INITIAL_TIME_SLOTS,
        blockedDates: customData?.blockedDates || [],
        blockedSlots: customData?.blockedSlots || [],
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error seeding Cloud database:', err);
  }
}

// 2. Realtime Subscriptions
export function subscribeToAppointments(callback: (apts: SalonAppointment[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  return onSnapshot(
    collection(db, COL_APPOINTMENTS),
    (snapshot) => {
      const list: SalonAppointment[] = [];
      snapshot.forEach((d) => list.push(d.data() as SalonAppointment));
      callback(list);
    },
    (err) => {
      console.error('subscribeToAppointments error:', err);
    }
  );
}

export function subscribeToServices(callback: (services: SalonService[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  return onSnapshot(
    collection(db, COL_SERVICES),
    (snapshot) => {
      const list: SalonService[] = [];
      snapshot.forEach((d) => list.push(d.data() as SalonService));
      callback(list);
    },
    (err) => {
      console.error('subscribeToServices error:', err);
    }
  );
}

export function subscribeToProducts(callback: (products: SalonProduct[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  return onSnapshot(
    collection(db, COL_PRODUCTS),
    (snapshot) => {
      const list: SalonProduct[] = [];
      snapshot.forEach((d) => list.push(d.data() as SalonProduct));
      callback(list);
    },
    (err) => {
      console.error('subscribeToProducts error:', err);
    }
  );
}

export function subscribeToClients(callback: (clients: ClientProfile[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  return onSnapshot(
    collection(db, COL_CLIENTS),
    (snapshot) => {
      const list: ClientProfile[] = [];
      snapshot.forEach((d) => list.push(d.data() as ClientProfile));
      callback(list);
    },
    (err) => {
      console.error('subscribeToClients error:', err);
    }
  );
}

export function subscribeToPackages(callback: (packages: ClientPackage[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  return onSnapshot(
    collection(db, COL_PACKAGES),
    (snapshot) => {
      const list: ClientPackage[] = [];
      snapshot.forEach((d) => list.push(d.data() as ClientPackage));
      callback(list);
    },
    (err) => {
      console.error('subscribeToPackages error:', err);
    }
  );
}

export function subscribeToExpenses(callback: (expenses: SalonExpense[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  return onSnapshot(
    collection(db, COL_EXPENSES),
    (snapshot) => {
      const list: SalonExpense[] = [];
      snapshot.forEach((d) => list.push(d.data() as SalonExpense));
      callback(list);
    },
    (err) => {
      console.error('subscribeToExpenses error:', err);
    }
  );
}

export function subscribeToSettings(callback: (settings: SalonSettingsData) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  const settingsRef = doc(db, COL_SETTINGS, DOC_SETTINGS);
  return onSnapshot(
    settingsRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as SalonSettingsData);
      }
    },
    (err) => {
      console.error('subscribeToSettings error:', err);
    }
  );
}

export function subscribeToAdminUsers(callback: (users: AdminUser[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  return onSnapshot(
    collection(db, COL_USERS),
    (snapshot) => {
      const list: AdminUser[] = [];
      snapshot.forEach((d) => list.push(d.data() as AdminUser));
      callback(list);
    },
    (err) => {
      console.error('subscribeToAdminUsers error:', err);
    }
  );
}

// 3. Cloud Mutations
export async function cloudSaveAppointment(apt: SalonAppointment) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await setDoc(doc(db, COL_APPOINTMENTS, apt.id), apt);
  } catch (err) {
    console.error('cloudSaveAppointment error:', err);
  }
}

export async function cloudUpdateAppointmentStatus(id: string, status: SalonAppointment['status']) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await updateDoc(doc(db, COL_APPOINTMENTS, id), { status });
  } catch (err) {
    console.error('cloudUpdateAppointmentStatus error:', err);
  }
}

export async function cloudDeleteAppointment(id: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, COL_APPOINTMENTS, id));
  } catch (err) {
    console.error('cloudDeleteAppointment error:', err);
  }
}

export async function cloudSaveService(service: SalonService) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await setDoc(doc(db, COL_SERVICES, service.id), service);
  } catch (err) {
    console.error('cloudSaveService error:', err);
  }
}

export async function cloudDeleteService(id: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, COL_SERVICES, id));
  } catch (err) {
    console.error('cloudDeleteService error:', err);
  }
}

export async function cloudSaveProduct(product: SalonProduct) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await setDoc(doc(db, COL_PRODUCTS, product.id), product);
  } catch (err) {
    console.error('cloudSaveProduct error:', err);
  }
}

export async function cloudDeleteProduct(id: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, COL_PRODUCTS, id));
  } catch (err) {
    console.error('cloudDeleteProduct error:', err);
  }
}

export async function cloudSaveClient(client: ClientProfile) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    const key = client.phone.replace(/[^0-9]/g, '');
    await setDoc(doc(db, COL_CLIENTS, key), client);
  } catch (err) {
    console.error('cloudSaveClient error:', err);
  }
}

export async function cloudDeleteClient(phone: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    const key = phone.replace(/[^0-9]/g, '');
    await deleteDoc(doc(db, COL_CLIENTS, key));
  } catch (err) {
    console.error('cloudDeleteClient error:', err);
  }
}

export async function cloudSavePackage(pkg: ClientPackage) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await setDoc(doc(db, COL_PACKAGES, pkg.id), pkg);
  } catch (err) {
    console.error('cloudSavePackage error:', err);
  }
}

export async function cloudDeletePackage(id: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, COL_PACKAGES, id));
  } catch (err) {
    console.error('cloudDeletePackage error:', err);
  }
}

export async function cloudSaveExpense(expense: SalonExpense) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await setDoc(doc(db, COL_EXPENSES, expense.id), expense);
  } catch (err) {
    console.error('cloudSaveExpense error:', err);
  }
}

export async function cloudDeleteExpense(id: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, COL_EXPENSES, id));
  } catch (err) {
    console.error('cloudDeleteExpense error:', err);
  }
}

export async function cloudSaveSettings(settings: Partial<SalonSettingsData>) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    const settingsRef = doc(db, COL_SETTINGS, DOC_SETTINGS);
    await setDoc(settingsRef, settings, { merge: true });
  } catch (err) {
    console.error('cloudSaveSettings error:', err);
  }
}

export async function cloudSaveAdminUser(user: AdminUser) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await setDoc(doc(db, COL_USERS, user.id), user);
  } catch (err) {
    console.error('cloudSaveAdminUser error:', err);
  }
}

export async function cloudDeleteAdminUser(id: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await deleteDoc(doc(db, COL_USERS, id));
  } catch (err) {
    console.error('cloudDeleteAdminUser error:', err);
  }
}
