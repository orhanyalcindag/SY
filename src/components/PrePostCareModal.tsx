'use client';

import React, { useState, useEffect } from 'react';
import { useSalon } from '@/context/SalonContext';
import {
  X,
  Sparkles,
  Zap,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Droplets,
  Sun,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export default function PrePostCareModal() {
  const { isPrePostCareOpen, setIsPrePostCareOpen } = useSalon();
  const [activeTab, setActiveTab] = useState<'laser' | 'skin' | 'nail' | 'lash'>('laser');

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPrePostCareOpen) {
        setIsPrePostCareOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrePostCareOpen, setIsPrePostCareOpen]);

  if (!isPrePostCareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden w-full max-w-full box-border">
      {/* Backdrop */}
      <div onClick={() => setIsPrePostCareOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto bg-[#0F0F12] border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl text-white shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-zinc-100">
                Danışan Rehberi: İşlem Öncesi & Sonrası Bakım
              </h3>
              <p className="text-[11px] text-[#D4AF37]">
                Maksimum etki ve kusursuz sonuçlar için altın kurallar
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrePostCareOpen(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-4 pb-2 shrink-0 border-b border-zinc-800 bg-[#0A0A0C]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTab('laser')}
              className={`py-2 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'laser'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buz Lazer</span>
            </button>

            <button
              onClick={() => setActiveTab('skin')}
              className={`py-2 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'skin'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Cilt Bakımı</span>
            </button>

            <button
              onClick={() => setActiveTab('nail')}
              className={`py-2 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'nail'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Protez Tırnak</span>
            </button>

            <button
              onClick={() => setActiveTab('lash')}
              className={`py-2 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'lash'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>İpek Kirpik</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: BUZ LAZER */}
          {activeTab === 'laser' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>Seansa Gelmeden Önce (Hazırlık)</span>
                </h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>24 Saat Önce Jilet:</strong> Uygulama bölgesindeki tüyleri randevudan 1 gün önce jiletle kısaltın. Lazer ışığı kökü hedefler; yüzeydeki uzun kıllar enerjiyi boşa harcar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Ağda & Cımbız Yasağı:</strong> Lazerden en az 3 hafta önce kökten alma işlemlerini bırakın. Kıl kökünün var olması şarttır.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Temiz Cilt:</strong> Randevuya gelirken uygulama bölgesine deodorant, vücut simi, losyon veya parfüm sürmeyiniz.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Seans Sonrası (Sonuç ve Koruma)</span>
                </h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>İlk 24 Saat Sıcak Su Yasağı:</strong> Hamam, sauna, sıcak duş ve yoğun terleten sporlardan kaçının. Ilık suyla duş alabilirsiniz.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Güneş Koruması:</strong> Açıkta kalan bölgelere (kol, yüz vb.) mutlaka SPF 50+ güneş kremi uygulayın.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>10-14 Gün Sonra Dökülme:</strong> Kıllar işlemden 10-15 gün sonra kendiliğinden dökülmeye başlayacaktır; çekip koparmayınız, banyoda hafif kese ile destekleyebilirsiniz.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: CİLT BAKIMI */}
          {activeTab === 'skin' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>Cilt Bakımı Öncesi</span>
                </h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mümkünse randevuya makyajsız veya hafif makyajla gelmeniz temizleme aşamasını hızlandırır.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>İşlemden 3 gün önce ev tipi agresif asitli peeling ve retinoid (Retinol) kullanımını durdurun.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Cilt Bakımı Sonrası (24 Saat Kuralı)</span>
                </h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>24 Saat Makyaj Yapmayın:</strong> Temizlenen ve arınan gözeneklerin nefes alması için fondöten ve pudra kullanmayınız.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Temiz Yastık Kılıfı:</strong> İşlem akşamı yastık kılıfınızı temiz bir kılıfla değiştirin; cilde elinizle sık sık dokunmayın.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Güneş Kremini İhmal Etmeyin:</strong> Yeni arınmış cilt güneşe karşı daha hassastır; yüksek korumalı SPF kullanın.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Günde en az 2 litre su tüketerek cildin içeriden nemlenmesini destekleyin.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PROTEZ TIRNAK */}
          {activeTab === 'nail' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>Protez Tırnak & Jel Bakım Önerileri</span>
                </h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tırnaklarınızı Alet Olarak Kullanmayın:</strong> Kutu kola kapağı açmak, etiket kazımak veya sert zeminlere vurmaktan kaçının.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Kimyasal Temasında Eldiven:</strong> Çamaşır suyu ve yoğun ev kimyasalları jelin parlaklığını matlaştırabilir; eldiven kullanınız.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Asla Zorla Sökmeyiniz:</strong> Çıkarmak istediğinizde evde zorlamak doğal tırnak tabakanızı zedeler; salonda özel freze ve solüsyonla çıkarılmalıdır.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>3-4 Haftada Bir Bakım:</strong> Doğal tırnağınız uzadıkça dip dolgusu ve form düzeltmesi için bakım randevunuzu aksatmayınız.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: İPEK KİRPİK */}
          {activeTab === 'lash' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>İpek Kirpik Kullanım Rehberi</span>
                </h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>İlk 48 Saat Su ve Buhar Yasağı:</strong> Medikal yapıştırıcının tam polimerize olması için ilk 2 gün sıcak su, hamam, sauna ve göz ovuşturmadan kaçının.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Yağsız Temizleyici:</strong> Göz çevrenizi temizlerken yağ bazlı değil, su bazlı (micellar su) ürünler tercih ediniz; yağ yapıştırıcıyı çözer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Maskara & Rimel Sürmeyin:</strong> İpek kirpiğin üzerine rimel sürmek kirpikleri birbirine yapıştırır ve ağırlık yapar. Zaten yoğun bir bakışa sahipsiniz!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Sabahları size hediye edilen özel kirpik fırçasıyla kirpiklerinizi nazikçe tarayarak formunu koruyun.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center">
            <span className="text-zinc-300 font-medium">
              Simay Yorulmaz · Demirköy / Kırklareli · Sağlığınız ve Güzelliğiniz Güvende
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
