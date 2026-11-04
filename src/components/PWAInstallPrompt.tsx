'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Download,
  X,
  Share,
  PlusSquare,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');

  useEffect(() => {
    // 1. Register Service Worker in production & development
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('SY Beauty Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('SW registration failed:', err);
        });
    }

    // 2. Check if already installed / standalone
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      setIsInstalled(isStandalone);

      // 3. Detect iOS device
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isApple);
      if (isApple) {
        setActiveTab('ios');
      } else if (/android/.test(userAgent)) {
        setActiveTab('android');
      }
    }

    // 4. Capture Android/Chrome beforeinstallprompt event silently (no popup)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // 5. Listen for explicit user click (from MobileBottomNav or Navbar)
    const handleCustomOpen = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('open-pwa-install', handleCustomOpen);

    // App installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsModalOpen(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleCustomOpen);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsModalOpen(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || !isModalOpen) {
    return null;
  }

  return (
    <>
      {/* On-Demand Install Guide Modal (Only shows when user taps 'Yükle') */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container with strict max-height and flex-col scroll */}
        <div className="relative z-10 w-full max-w-md bg-[#0F0F12] border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl text-white shadow-2xl flex flex-col max-h-[86vh] overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
          {/* Header (Sticky / Shrink-0) */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0F0F12]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-lg bg-black shrink-0">
                <Image
                  src="/icons/icon-192.png"
                  alt="Simay Yorulmaz"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-sm sm:text-base text-zinc-100">
                  Simay Yorulmaz Health & Beauty
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#D4AF37] font-semibold">
                  Mobil Uygulama / Ana Ekrana Ekle
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body (Scrolls smoothly with touch or mouse) */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Simay Yorulmaz web uygulamasını telefonunuza yükleyerek dilediğiniz an tek tıkla online randevu alabilir, bakım seanslarınızı ve dükkandan teslim siparişlerinizi takip edebilirsiniz.
              </p>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tek tıkla randevu alma</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dükkandan teslim sepet</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hızlı & internetsiz erişim</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hafıza kaplamaz</span>
                </div>
              </div>

              {/* Platform Tabs Switcher (Apple vs Android) */}
              <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('ios')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'ios'
                      ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Share className="w-3.5 h-3.5" />
                  <span>iPhone / Apple (Ana Ekrana Ekle)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('android')}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'android'
                      ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android / Chrome</span>
                </button>
              </div>

              {/* Instructions based on Active Tab */}
              {activeTab === 'ios' ? (
                /* Apple iPhone / iPad Safari Instructions */
                <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900 border border-[#D4AF37]/40 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                      <Share className="w-4 h-4" />
                      <span>iPhone Safari ile Ana Ekrana Ekleme:</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold">
                      Apple iOS Uyumlu
                    </span>
                  </div>

                  {/* Visual 3-Step Flow Diagram */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                        <Share className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-zinc-300 font-medium">1. Paylaş</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                        <PlusSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-zinc-300 font-medium leading-tight">2. Ana Ekrana Ekle</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">3. Ekle</span>
                    </div>
                  </div>

                  <ol className="text-xs text-zinc-200 space-y-2.5 pl-0.5 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Safari ekranının en altındaki <strong className="text-white inline-flex items-center gap-1 mx-0.5 font-bold"><Share className="w-3.5 h-3.5 text-[#D4AF37]" /> Paylaş</strong> (ortasında yukarı ok olan kare) simgesine dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Açılan menüyü aşağı kaydırıp <strong className="text-white font-bold inline-flex items-center gap-1 mx-0.5"><PlusSquare className="w-3.5 h-3.5 text-[#D4AF37]" /> "Ana Ekrana Ekle"</strong> seçeneğini seçin.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Sağ üst köşedeki <strong className="text-emerald-400 font-bold">"Ekle"</strong> butonuna basın. Simay Yorulmaz logosu iPhone ana ekranınıza anında eklenecektir.
                      </span>
                    </li>
                  </ol>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Ana ekrandan açtığınızda tam ekran olarak çalışır.</span>
                  </div>
                </div>
              ) : deferredPrompt ? (
                /* Android / Chrome native 1-click prompt */
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Hızlı Yükleme Destekleniyor</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Telefonunuz bu web uygulamasını tek tıkla yüklemeye uygundur.
                  </p>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8222] text-black font-black text-sm shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Uygulamayı Şimdi Yükle</span>
                  </button>
                </div>
              ) : (
                /* Android Chrome manual steps */
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                    <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                    <span>Android / Chrome Kurulum Adımları:</span>
                  </div>
                  <ol className="text-xs text-zinc-300 space-y-2.5 pl-0.5 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Chrome sağ üst köşesindeki <strong className="text-white font-bold">üç nokta (⋮)</strong> menüsüne dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Menüden <strong className="text-white font-bold">"Uygulamayı Yükle"</strong> veya <strong className="text-white font-bold">"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                      </span>
                    </li>
                  </ol>
                </div>
              )}
          </div>

          {/* Footer (Sticky / Shrink-0) */}
          <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 shrink-0 bg-[#0F0F12]">
            <span className="flex items-center gap-1.5 text-[#D4AF37] text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simay Yorulmaz · Demirköy</span>
            </span>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
