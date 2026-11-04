import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Built-in verified cloud credentials for Simay Yorulmaz Health & Beauty
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyA0NP4-OYyE0PJ6YpukWat3rCJ0l-IISYw',
  authDomain: 'syhealthbeauty.firebaseapp.com',
  projectId: 'syhealthbeauty',
  storageBucket: 'syhealthbeauty.firebasestorage.app',
  messagingSenderId: '935227571087',
  appId: '1:935227571087:web:19a27e8fef1133e5dfe9fa',
};

// 1. Check environment variables
const envConfig: Partial<FirebaseConfig> = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Helper to get active config (Env -> localStorage -> Built-in default)
export function getActiveFirebaseConfig(): FirebaseConfig {
  if (
    envConfig.apiKey &&
    envConfig.projectId &&
    envConfig.apiKey !== 'YOUR_API_KEY'
  ) {
    return envConfig as FirebaseConfig;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('sy_firebase_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  return DEFAULT_FIREBASE_CONFIG;
}

// 3. Initialize Firebase instance
let dbInstance: Firestore | null = null;

export function getFirebaseDb(): Firestore | null {
  if (dbInstance) return dbInstance;

  const config = getActiveFirebaseConfig();
  if (!config) return null;

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return null;
  }
}
