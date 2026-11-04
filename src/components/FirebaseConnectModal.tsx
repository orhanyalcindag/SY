'use client';

import React, { useState, useEffect } from 'react';
import { useSalon } from '@/context/SalonContext';
import { getActiveFirebaseConfig, FirebaseConfig } from '@/lib/firebase';
import {
  Cloud,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  ExternalLink,
  HelpCircle,
  Database,
  RefreshCw,
  Trash2,
  Sparkles,
  KeyRound,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FirebaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FirebaseConnectModal({
  isOpen,
  onClose,
}: FirebaseConnectModalProps) {
  const { isCloudConnected, saveFirebaseConfig, clearFirebaseConfig, showNotification } = useSalon();

  const [activeTab, setActiveTab] = useState<'paste' | 'manual'>('paste');
  const [pasteInput, setPasteInput] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  // Manual inputs
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [parseError, setParseError] = useState('');

  // Active config info
  const [activeConfig, setActiveConfig] = useState<FirebaseConfig | null>(null);

  useEffect(() => {
    if (isOpen) {
      const cfg = getActiveFirebaseConfig();
      setActiveConfig(cfg);
      if (cfg) {
        setApiKey(cfg.apiKey || '');
        setAuthDomain(cfg.authDomain || '');
        setProjectId(cfg.projectId || '');
        setStorageBucket(cfg.storageBucket || '');
        setMessagingSenderId(cfg.messagingSenderId || '');
        setAppId(cfg.appId || '');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Extract keys from config text (JS object, JSON, or env snippet)
  const handleAutoParseAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    setParseError('');

    if (!pasteInput.trim()) {
      setParseError('Lütfen Firebase Console kodunu yapıştırınız.');
      return;
    }

    try {
      const extractValue = (key: string): string => {
        // Regex matches key: "value", "key": "value", KEY="value", etc.
        const regex = new RegExp(`['"]?${key}['"]?\\s*[:=]\\s*['"\`]([^'"\`]+)['"\`]`, 'i');
        const match = pasteInput.match(regex);
        return match ? match[1].trim() : '';
      };

      const extractedApiKey = extractValue('apiKey') || extractValue('NEXT_PUBLIC_FIREBASE_API_KEY');
      const extractedAuthDomain = extractValue('authDomain') || extractValue('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
      const extractedProjectId = extractValue('projectId') || extractValue('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      const extractedStorageBucket = extractValue('storageBucket') || extractValue('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
      const extractedMessagingSenderId = extractValue('messagingSenderId') || extractValue('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
      const extractedAppId = extractValue('appId') || extractValue('NEXT_PUBLIC_FIREBASE_APP_ID');

      if (!extractedApiKey || !extractedProjectId) {
        setParseError(
          'Firebase bilgileri tam algılanamadı. Lütfen "apiKey" ve "projectId" içeren blok kopyaladığınızdan emin olun veya "Manuel Giriş" sekmesini kullanın.'
        );
        return;
      }

      const config: FirebaseConfig = {
        apiKey: extractedApiKey,
        authDomain: extractedAuthDomain || `${extractedProjectId}.firebaseapp.com`,
        projectId: extractedProjectId,
        storageBucket: extractedStorageBucket || `${extractedProjectId}.appspot.com`,
        messagingSenderId: extractedMessagingSenderId || '',
        appId: extractedAppId || '',
      };

      saveFirebaseConfig(config);
      onClose();
    } catch {
      setParseError('Kod ayrıştırılırken hata oluştu. Lütfen formatı kontrol edin.');
    }
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    setParseError('');

    if (!apiKey.trim() || !projectId.trim()) {
      setParseError('API Key ve Proje ID (Project ID) zorunludur.');
      return;
    }

    const config: FirebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveFirebaseConfig(config);
    onClose();
  };

  const handleDisconnect = () => {
    if (confirm('Firebase bağlantısını kesmek istediğinize emin misiniz? Sistem yerel tarayıcı moduna dönecektir.')) {
      clearFirebaseConfig();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0F0F12] border border-[#D4AF37]/40 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  Canlı Bulut Veritabanı
                </h3>
                {isCloudConnected ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    BAĞLI & AKTİF
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-400 text-[10px] font-bold tracking-wider">
                    YEREL MOD
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Farklı cihazlar ve tarayıcılar arası gerçek zamanlı veri eşitleme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Status Box */}
          {isCloudConnected ? (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">
                      Firebase Firestore Bağlantısı Aktif
                    </h4>
                    <p className="text-xs text-emerald-400/80 mt-0.5">
                      Proje ID:{' '}
                      <code className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-white font-mono">
                        {activeConfig?.projectId || 'Bilinmiyor'}
                      </code>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bağlantıyı Kes</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed border-t border-emerald-900/40 pt-2.5">
                Müşterilerinizin cep telefonlarından aldıkları randevular, mağaza siparişleri ve
                buradan yaptığınız tüm fiyat/işlem değişiklikleri anında senkronize olmaktadır.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <h4 className="text-sm font-semibold text-amber-300">
                  Neden Bulut Veritabanı Gerekli?
                </h4>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Şu anda sistem <strong>tarayıcı yerel hafızasında</strong> çalışıyor. Farklı bir
                bilgisayardan veya müşteriler kendi telefonlarından siteye girdiğinde randevuların
                ortak bir havuzda toplanması için Google&apos;ın ücretsiz{' '}
                <strong>Firebase Firestore</strong> veritabanını 1 dakikada bağlayabilirsiniz.
              </p>
            </div>
          )}

          {/* Quick Guide Accordion */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  60 Saniyede Ücretsiz Firebase Hesabı Açma Rehberi
                </span>
              </div>
              {showGuide ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {showGuide && (
              <div className="p-4 pt-0 border-t border-zinc-800/60 space-y-3 text-xs text-zinc-300">
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <div>
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      console.firebase.google.com <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    adresine gidin ve Google hesabınızla ücretsiz oturum açın.
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <div>
                    <strong>&quot;Proje Ekle&quot;</strong> butonuna tıklayın, projenize bir isim verin (örn:{' '}
                    <code>simay-salon</code>) ve adımları onaylayın.
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <div>
                    Sol menüden <strong>Build ➔ Firestore Database</strong> tıklayın ➔{' '}
                    <strong>Veritabanı Oluştur</strong> ➔ Konum olarak <code>eur3 (europe-west)</code> seçin ➔{' '}
                    <strong>&quot;Test modunda başlat&quot;</strong> seçeneğini işaretleyip tamamlayın.
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    4
                  </span>
                  <div>
                    Sol üstteki <strong>Proje Ayarları (⚙️)</strong> simgesine tıklayın ➔ Aşağı kaydırıp{' '}
                    <strong>Web Uygulaması Ekle (&lt;/&gt;)</strong> simgesine basın ➔ Verilen{' '}
                    <code>const firebaseConfig = &#123; ... &#125;;</code> bloğunu kopyalayıp aşağıdaki kutucuğa yapıştırın!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Tabs */}
          <div className="flex gap-2 border-b border-zinc-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'paste'
                  ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#D4AF37]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hızlı Yapıştır (Otomatik Algıla)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'manual'
                  ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#D4AF37]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Manuel Alan Girişi</span>
            </button>
          </div>

          {/* Tab 1: Paste Code Form */}
          {activeTab === 'paste' ? (
            <form onSubmit={handleAutoParseAndSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Firebase Console Yapılandırma Kodu (firebaseConfig)
                </label>
                <textarea
                  rows={6}
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "simay-salon.firebaseapp.com",\n  projectId: "simay-salon",\n  storageBucket: "simay-salon.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123456789:web:..."\n};`}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37] placeholder-zinc-600 transition"
                ></textarea>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Firebase Console&apos;dan kopyaladığınız kod bloğunu olduğu gibi buraya yapıştırabilirsiniz. Sistem otomatik olarak anahtarları ayıklar.
                </p>
              </div>

              {parseError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
                  {parseError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#997929] via-[#D4AF37] to-[#F3E5AB] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Bulut Veritabanına Bağlan & Canlı Eşitle</span>
              </button>
            </form>
          ) : (
            /* Tab 2: Manual Entry Form */
            <form onSubmit={handleManualSave} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    API Key *
                  </label>
                  <input
                    type="text"
                    required
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Project ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="simay-salon"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    placeholder="simay-salon.firebaseapp.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Storage Bucket
                  </label>
                  <input
                    type="text"
                    value={storageBucket}
                    onChange={(e) => setStorageBucket(e.target.value)}
                    placeholder="simay-salon.appspot.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Messaging Sender ID
                  </label>
                  <input
                    type="text"
                    value={messagingSenderId}
                    onChange={(e) => setMessagingSenderId(e.target.value)}
                    placeholder="123456789012"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="1:123456789012:web:abc..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {parseError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
                  {parseError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#997929] via-[#D4AF37] to-[#F3E5AB] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Bilgileri Kaydet & Bağlan</span>
              </button>
            </form>
          )}

          {/* Vercel Environment Variables Note */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-200">💡 Canlı Yayın / Vercel Kullanıcıları İçin:</span>
            <p>
              Vercel üzerinde yayınladığınızda, projenizin <strong>Settings ➔ Environment Variables</strong>{' '}
              bölümüne <code>NEXT_PUBLIC_FIREBASE_API_KEY</code>, <code>NEXT_PUBLIC_FIREBASE_PROJECT_ID</code> gibi
              değişkenleri ekleyerek tüm ziyaretçilerin otomatik olarak buluta bağlanmasını da sağlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
