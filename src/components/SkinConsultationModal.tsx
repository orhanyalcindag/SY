'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSalon } from '@/context/SalonContext';
import { SALON_INFO } from '@/data/initialData';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  Send,
  HelpCircle,
} from 'lucide-react';

export default function SkinConsultationModal() {
  const {
    isConsultationOpen,
    setIsConsultationOpen,
    services,
    products,
    setIsBookingOpen,
    setSelectedServiceForBooking,
    addToCart,
    setIsCartOpen,
  } = useSalon();

  const [step, setStep] = useState<1 | 2 | 3 | 'result'>(1);
  const [skinType, setSkinType] = useState<string>('');
  const [concern, setConcern] = useState<string>('');
  const [goal, setGoal] = useState<string>('');

  if (!isConsultationOpen) return null;

  const handleReset = () => {
    setStep(1);
    setSkinType('');
    setConcern('');
    setGoal('');
  };

  // Compute recommendation based on selections
  const getRecommendation = () => {
    if (skinType === 'tuy' || concern === 'tuy') {
      const srv = services.find((s) => s.category === 'Lazer Epilasyon') || services[2];
      const prd = products.find((p) => p.category === 'Güneş Koruması') || products[1];
      return {
        title: 'Buz Başlıklı Hibrit Lazer Epilasyon Protokolü',
        reason: 'İstenmeyen tüylerden 4 mevsim acısız ve kalıcı olarak kurtulmak için en ideal çözüm.',
        service: srv,
        product: prd,
      };
    }

    if (skinType === 'tirnak' || concern === 'tirnak') {
      const srv = services.find((s) => s.category === 'Protez Tırnak & Manikür') || services[3];
      const prd = products.find((p) => p.category === 'Tırnak & El Bakımı') || products[2];
      return {
        title: 'Medikal Manikür & Jel Güçlendirme Protokolü',
        reason: 'Kırılan ve yıpranan tırnakları güçlendirip estetik el çizimiyle taçlandırmak için önerilir.',
        service: srv,
        product: prd,
      };
    }

    if (concern === 'leke' || goal === 'isilti') {
      const srv = services.find((s) => s.id === 'srv-2') || services[0];
      const prd = products.find((p) => p.id === 'prd-1') || products[0];
      return {
        title: 'Somon DNA & Aydınlatıcı Cilt Protokolü',
        reason: 'Cilt tonunu eşitlemek, güneş/akne lekelerini hafifletmek ve hücre yenilenmesini tetiklemek için.',
        service: srv,
        product: prd,
      };
    }

    // Default: Hydrafacial
    const srv = services.find((s) => s.id === 'srv-1') || services[0];
    const prd = products.find((p) => p.id === 'prd-2') || products[1];
    return {
      title: 'Hydrafacial Derinlemesine Medikal Cilt Protokolü',
      reason: 'Gözenekleri arındırmak, siyah noktaları temizlemek ve yoğun nem bariyeri oluşturmak için.',
      service: srv,
      product: prd,
    };
  };

  const recommendation = getRecommendation();

  const handleBookRecommended = () => {
    if (recommendation.service) {
      setSelectedServiceForBooking(recommendation.service);
      setIsConsultationOpen(false);
      setIsBookingOpen(true);
    }
  };

  const handleBuyProduct = () => {
    if (recommendation.product) {
      addToCart(recommendation.product);
      setIsConsultationOpen(false);
      setIsCartOpen(true);
    }
  };

  const handleWhatsAppConsultation = () => {
    let msg = `*✨ SİMAY YORULMAZ HEALTH & BEAUTY - KİŞİSEL CİLT TESTİ SONUCUM ✨*\n\n`;
    msg += `*Cilt Tipim:* ${skinType}\n`;
    msg += `*Temel Şikayetim:* ${concern}\n`;
    msg += `*Hedefim:* ${goal}\n`;
    msg += `*Sistem Önerisi:* ${recommendation.title}\n\n`;
    msg += `_Merhaba Simay Hanım, web sitenizdeki akıllı güzellik testini çözdüm. Bu protokol hakkında detaylı bilgi ve randevu alabilir miyim?_`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-[#D4AF37]/50 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-extrabold text-base sm:text-lg text-white">
                Akıllı Güzellik Danışmanı
              </h3>
              <p className="text-xs text-zinc-400">
                3 soruda cildinize en uygun salon protokolünü keşfedin
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsConsultationOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Cilt Tipi & İhtiyaç */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37]">
              <span>SORU 1 / 3</span>
              <span>CİLT & BÖLGE TİPİ</span>
            </div>
            <h4 className="font-serif font-bold text-lg text-white">
              Cildinizi veya bakım ihtiyacınızı en iyi hangisi tanımlıyor?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'kuru', title: 'Kuru & Nemsiz Cilt', desc: 'Gerginlik hissi, pul pul dökülme ve solgunluk' },
                { id: 'yagli', title: 'Yağlı & Parlayan Cilt', desc: 'Geniş gözenekler, aşırı sebum ve siyah nokta' },
                { id: 'karma', title: 'Karma & Hassas Cilt', desc: 'T bölgesi yağlı, yanaklar kuru veya kızarık' },
                { id: 'tuy', title: 'Lazer & Tüy Giderme', desc: 'İstenmeyen tüyler ve batık problemleri' },
                { id: 'tirnak', title: 'Kırılgan & Zayıf Tırnak', desc: 'Çabuk kırılan, uzamayan veya şekilsiz tırnaklar' },
                { id: 'kas_kirpik', title: 'Seyrek Kaş & Düz Kirpik', desc: 'Hacimsiz bakışlar ve düzensiz kaş formu' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSkinType(opt.id);
                    setStep(2);
                  }}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    skinType === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-md'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-sm text-white">{opt.title}</span>
                  <span className="text-[11px] text-zinc-400 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Temel Şikayet */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37]">
              <span>SORU 2 / 3</span>
              <span>TEMEL ŞİKAYET</span>
            </div>
            <h4 className="font-serif font-bold text-lg text-white">
              En çok çözüme kavuşturmak istediğiniz konu nedir?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'gozenek', title: 'Tıkanmış Gözenek & Siyah Nokta', desc: 'Derinlemesine temizlik ve pürüzsüzlük ihtiyacı' },
                { id: 'leke', title: 'Güneş / Akne Lekesi & Ton Eşitsizliği', desc: 'Cilt tonunun homojen ve aydınlık olmaması' },
                { id: 'kirisiklik', title: 'İnce Çizgiler & Elastikiyet Kaybı', desc: 'Kolajen desteği ve toparlayıcı bakım ihtiyacı' },
                { id: 'tuy', title: 'Ağda & Jilet Tahrişi / Batıklar', desc: 'Pürüzsüz ve kalıcı konfor arayışı' },
                { id: 'tirnak', title: 'Soyulan ve Uzamayan Tırnaklar', desc: 'Dayanıklı ve şık bir tırnak yapısı arzusu' },
                { id: 'yorgunluk', title: 'Yorgun ve Mat Görünüm', desc: 'Cildin ışıltısını ve canlılığını kaybetmesi' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setConcern(opt.id);
                    setStep(3);
                  }}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    concern === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-md'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-sm text-white">{opt.title}</span>
                  <span className="text-[11px] text-zinc-400 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                ← Önceki Soruya Dön
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Öncelikli Hedef */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37]">
              <span>SORU 3 / 3</span>
              <span>HEDEFİNİZ</span>
            </div>
            <h4 className="font-serif font-bold text-lg text-white">
              Bu bakımdan beklediğiniz en büyük etki nedir?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'isilti', title: 'Işıl Işıl Nemli Cam Cilt (Glass Skin)', desc: 'Makyajsız dahi parlayan sağlıklı cilt görünümü' },
                { id: 'puruzsuz', title: 'Pürüzsüz & Sıkı Doku', desc: 'Gözeneklerin küçülmesi ve kadife yumuşaklığı' },
                { id: 'kalici_rahatlik', title: '4 Mevsim Kalıcı Pürüzsüzlük', desc: 'Tüyleri düşünmeden rahat bir yaşam' },
                { id: 'zarif_tirnak', title: 'Zarif & Kırılmayan Tırnaklar', desc: 'Her an bakımlı ve estetik el görünümü' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setGoal(opt.id);
                    setStep('result');
                  }}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    goal === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-md'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-sm text-white">{opt.title}</span>
                  <span className="text-[11px] text-zinc-400 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                ← Önceki Soruya Dön
              </button>
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {step === 'result' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center space-y-1">
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">
                TEST SONUCUNUZ HAZIRLANDI
              </span>
              <h4 className="font-serif font-extrabold text-lg text-white">
                {recommendation.title}
              </h4>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                {recommendation.reason}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recommended Service Card */}
              {recommendation.service && (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      ÖNERİLEN SALON SEANSI
                    </span>
                    <h5 className="font-serif font-bold text-sm text-white mt-1">
                      {recommendation.service.name}
                    </h5>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {recommendation.service.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span className="font-black text-sm text-[#D4AF37]">
                      {formatCurrency(recommendation.service.price)}
                    </span>
                    <button
                      onClick={handleBookRecommended}
                      className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF47] text-black font-extrabold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Randevu Al</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Recommended Home Care Product */}
              {recommendation.product && (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                      ÖNERİLEN EV DEVAM ÜRÜNÜ
                    </span>
                    <h5 className="font-serif font-bold text-sm text-white mt-1">
                      {recommendation.product.name}
                    </h5>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {recommendation.product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                    <span className="font-black text-sm text-blue-400">
                      {formatCurrency(recommendation.product.price)}
                    </span>
                    <button
                      onClick={handleBuyProduct}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Consultation Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800">
              <button
                onClick={handleReset}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Testi Baştan Çöz</span>
              </button>

              <button
                onClick={handleWhatsAppConsultation}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
              >
                <Send className="w-4 h-4" />
                <span>Simay Hanım ile WhatsApp&apos;ta Görüş</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
