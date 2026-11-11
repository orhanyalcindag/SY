'use client';

import React, { useState, useEffect } from 'react';
import { useSalon } from '@/context/SalonContext';
import { SALON_INFO } from '@/data/initialData';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Gift,
  Sparkles,
  Heart,
  Send,
  Share2,
  CheckCircle2,
  Crown,
} from 'lucide-react';

export default function GiftVoucherModal() {
  const { services, isGiftVoucherOpen, setIsGiftVoucherOpen } = useSalon();
  const [giftType, setGiftType] = useState<'amount' | 'service'>('amount');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'srv-1');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [giftMessage, setGiftMessage] = useState('Kendine özel bir an ayırman ve ışıldaman dileğiyle...');
  const [voucherCode, setVoucherCode] = useState('SY-883921');

  useEffect(() => {
    if (isGiftVoucherOpen) {
      const code = 'SY-' + Math.floor(100000 + Math.random() * 900000);
      setVoucherCode(code);
    }
  }, [isGiftVoucherOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGiftVoucherOpen) {
        setIsGiftVoucherOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGiftVoucherOpen, setIsGiftVoucherOpen]);

  if (!isGiftVoucherOpen) return null;

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  const finalGiftValue = giftType === 'amount' ? (customAmount ? Number(customAmount) : selectedAmount) : activeService.price;
  const giftTitle = giftType === 'amount' ? `${formatCurrency(finalGiftValue)} Değerinde Bakım Hediye Çeki` : activeService.name;

  const handleSendWhatsApp = () => {
    let msg = `*🎁 SİMAY YORULMAZ HEALTH & BEAUTY - ÖZEL GÜZELLİK HEDİYE KARTI 🎁*\n\n`;
    msg += `*Kupon Kodu:* ${voucherCode}\n`;
    msg += `*Alıcı:* ${recipientName || 'Değerli Misafirimiz'}\n`;
    msg += `*Hediye Eden:* ${senderName || 'Bir Seveniniz'}\n`;
    msg += `*Hediye İçeriği:* ${giftTitle}\n`;
    msg += `*Özel Not:* "${giftMessage}"\n\n`;
    msg += `_Bu hediye kartı Demirköy Simay Yorulmaz salonumuzda geçerlidir. Randevu oluştururken kupon kodunuzu belirtmeniz yeterlidir._\n\n`;
    msg += `📍 *Adres:* ${SALON_INFO.address}\n`;
    msg += `📞 *Randevu & Bilgi:* ${SALON_INFO.phone}`;

    window.open(`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden w-full max-w-full box-border">
      {/* Backdrop */}
      <div onClick={() => setIsGiftVoucherOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-[#0F0F12] border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl text-white shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-zinc-100">
                Sevdiklerinize Güzellik Hediye Edin
              </h3>
              <p className="text-[11px] text-[#D4AF37]">
                Kişiselleştirilmiş lüks hediye kartı & bakım çeki oluşturun
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGiftVoucherOpen(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Luxury Card Preview */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C1810] via-zinc-950 to-[#120F08] border-2 border-[#D4AF37]/70 shadow-2xl relative overflow-hidden text-center sm:text-left">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-serif font-bold tracking-wider text-xs text-zinc-200">
                  SİMAY YORULMAZ VIP
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#D4AF37] font-bold tracking-widest">
                {voucherCode}
              </span>
            </div>

            <div className="py-4">
              <p className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                Özel Bakım Hediye Kartı
              </p>
              <h4 className="font-serif text-lg sm:text-xl font-extrabold text-white mt-1">
                {giftTitle}
              </h4>
              <p className="text-xs text-zinc-300 italic mt-2 max-w-md mx-auto sm:mx-0">
                "{giftMessage || 'Kendini şımartman dileğiyle...'}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
              <div>
                <span>Kime: </span>
                <span className="font-bold text-white">{recipientName || 'Değerli Misafirimiz'}</span>
              </div>
              <div>
                <span>Hediye Eden: </span>
                <span className="font-bold text-[#D4AF37]">{senderName || 'Bir Seveniniz'}</span>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-4 text-xs">
            {/* Gift Type Switcher */}
            <div>
              <label className="font-bold text-zinc-300 block mb-2">Hediye Şekli</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGiftType('amount')}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    giftType === 'amount'
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  Belirli Bir Tutar (Hediye Çeki)
                </button>
                <button
                  type="button"
                  onClick={() => setGiftType('service')}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    giftType === 'service'
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  Özel Bir Hizmet / Protokol
                </button>
              </div>
            </div>

            {/* Selection based on giftType */}
            {giftType === 'amount' ? (
              <div>
                <label className="font-bold text-zinc-300 block mb-2">Hediye Tutarı</label>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 2000, 3000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 rounded-xl font-extrabold border transition ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="font-bold text-zinc-300 block mb-2">Hediye Edilecek Hizmet</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium outline-none"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} — {formatCurrency(srv.price)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Recipient & Sender Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Alıcı Adı / Kime</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Örn: Canım Anneme, Elif..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Gönderen / Kimden</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Örn: Eşiniz Orhan..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="font-bold text-zinc-300 block mb-1">Kişisel Hediye Mesajınız</label>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                rows={2}
                placeholder="Örn: Doğum günün kutlu olsun..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleSendWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Hediye Kartını WhatsApp ile Oluştur & Gönder</span>
          </button>
        </div>
      </div>
    </div>
  );
}
