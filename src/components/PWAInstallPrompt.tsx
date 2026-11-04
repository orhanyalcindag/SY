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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md bg-[#0F0F12] border border-[#D4AF37]/40 rounded-3xl text-white shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-lg bg-black">
                  <Image
                    src="/icons/icon-192.png"
                    alt="Simay Yorulmaz"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-extrabold text-base text-zinc-100">
                    Simay Yorulmaz Health & Beauty
                  </h3>
                  <p className="text-[11px] text-[#D4AF37] font-semibold">
                    Mobil Uygulamayı Telefonunuza Yükleyin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="py-5 space-y-4">
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

              {/* Instructions based on OS */}
              {isIOS ? (
                /* iOS Safari instructions */
                <div className="p-4 rounded-2xl bg-zinc-950 border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                    <Smartphone className="w-4 h-4" />
                    <span>iPhone / iPad (Safari) İçin Kurulum:</span>
                  </div>
                  <ol className="text-xs text-zinc-300 space-y-2.5 pl-1">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Safari alt menüsündeki <strong className="text-white inline-flex items-center gap-1 mx-1"><Share className="w-3.5 h-3.5 text-[#D4AF37]" /> Paylaş</strong> simgesine dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Açılan sayfayı aşağı kaydırıp <strong className="text-white inline-flex items-center gap-1 mx-1"><PlusSquare className="w-3.5 h-3.5 text-[#D4AF37]" /> Ana Ekrana Ekle</strong> seçeneğine dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Sağ üst köşedeki <strong className="text-white">"Ekle"</strong> butonuna basarak uygulamayı telefonunuza yükleyin.
                      </span>
                    </li>
                  </ol>
                </div>
              ) : deferredPrompt ? (
                /* Android / Chrome native prompt button */
                <div className="pt-2">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA8222] text-black font-black text-sm shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Uygulamayı Şimdi Yükle</span>
                  </button>
                </div>
              ) : (
                /* Android Chrome manual instructions if prompt not yet fired */
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                    <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                    <span>Android / Chrome İçin Kurulum:</span>
                  </div>
                  <ol className="text-xs text-zinc-300 space-y-2.5 pl-1">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Chrome sağ üst köşesindeki <strong className="text-white">üç nokta (⋮)</strong> menüsüne dokunun.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong className="text-white">"Uygulamayı Yükle"</strong> veya <strong className="text-white">"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                      </span>
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simay Yorulmaz · Demirköy</span>
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:text-white transition cursor-pointer"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
