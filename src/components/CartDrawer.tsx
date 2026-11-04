'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSalon } from '@/context/SalonContext';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Send,
  User,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    sendWhatsAppOrder,
  } = useSalon();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+90 5');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isCartOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (!phone || phone.length < 10) {
      setValidationError('Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }
    setValidationError('');
    sendWhatsAppOrder({
      name,
      phone,
      address,
      note,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-[#0F0F12] border-l border-[#D4AF37]/30 text-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-zinc-100">
                Alışveriş Sepetim
              </h3>
              <p className="text-[11px] text-[#D4AF37]">
                WhatsApp Üzerinden Doğrudan Sipariş
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              <ShoppingBag className="w-8 h-8 opacity-40" />
            </div>
            <h4 className="font-serif text-lg font-bold text-zinc-300">
              Sepetiniz Boş
            </h4>
            <p className="text-xs text-zinc-500 mt-2 max-w-xs leading-relaxed">
              Özel cilt bakım serumları, koruyucular ve elixirlere göz atıp sepetinize ekleyebilirsiniz.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-6 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
            >
              Ürünleri İncele
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex gap-3.5 items-center hover:border-zinc-700 transition"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-zinc-200 truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {item.product.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-extrabold text-[#D4AF37]">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 hover:text-[#D4AF37] text-zinc-400 transition"
                          title="Azalt"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 hover:text-[#D4AF37] text-zinc-400 transition"
                          title="Arttır"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center text-xs text-zinc-400 pt-1">
              <span>{cart.length} çeşit ürün</span>
              <button
                onClick={clearCart}
                className="hover:text-red-400 transition underline underline-offset-2"
              >
                Sepeti Boşalt
              </button>
            </div>

            {/* Checkout Information Form */}
            <form onSubmit={handleSubmit} className="pt-4 border-t border-white/10 space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Teslimat & İletişim Bilgileri</span>
              </h4>

              {validationError && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
                  {validationError}
                </div>
              )}

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Adınız ve Soyadınız *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Ayşe Yılmaz"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Telefon Numaranız (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Teslimat / Kargo Adresi (İsteğe Bağlı)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Demirköy / Kırklareli veya Şehir dışı kargo"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Sipariş Notu (İsteğe Bağlı)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Örn: Cilt bakımı sonrası elden teslim alacağım"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp ile Sipariş Ver ({formatCurrency(cartTotal)})</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simay Hanım ile birebir doğrudan WhatsApp hattı</span>
              </div>
            </form>
          </div>
        )}

        {/* Footer Subtotal */}
        {cart.length > 0 && (
          <div className="p-4 bg-black border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">Toplam Sepet Tutarı</span>
              <div className="text-lg font-black text-[#D4AF37]">
                {formatCurrency(cartTotal)}
              </div>
            </div>
            <span className="text-[10px] text-zinc-400">
              *Ödeme teslimatta / havale ile
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
