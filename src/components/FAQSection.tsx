'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { SALON_INFO } from '@/data/initialData';

interface FAQItem {
  id: string;
  category: 'Lazer' | 'Cilt Bakımı' | 'Tırnak & Kirpik' | 'Randevu & Ödeme';
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Lazer',
    question: 'Buz Başlıklı Hibrit Lazer Epilasyon acıtır mı?',
    answer:
      'Kesinlikle hayır. Salonumuzda kullanılan son jenerasyon hibrit diode lazer cihazımız, safir kristal başlığı sayesinde temas ettiği bölgeyi -15°C’ye kadar soğutur. Bu soğutma teknolojisi kıl köklerini şoklarken cilt yüzeyindeki sinir uçlarını uyuşturur ve acı, sızı veya yanma hissini tamamen ortadan kaldırır.',
  },
  {
    id: 'faq-2',
    category: 'Lazer',
    question: 'Yaz aylarında veya bronz tene lazer epilasyon yapılabilir mi?',
    answer:
      'Evet. Klasik eski nesil lazerler bronz tende leke riski taşırken, salonumuzdaki hibrit dalga boyu teknolojisi ten rengi ayrımı gözetmeksizin 4 mevsim güvenle uygulanabilir. Ancak işlemden hemen sonraki 48 saat doğrudan aşırı güneş banyosu ve solaryum önerilmez.',
  },
  {
    id: 'faq-3',
    category: 'Cilt Bakımı',
    question: 'Hydrafacial medikal cilt bakımı ilk seansta fark yaratır mı?',
    answer:
      'Evet! Hydrafacial işlemi patentli vortex vakum teknolojisiyle siyah noktaları, tıkalı gözenekleri ve ölü deriyi derinlemesine temizlerken hyaluronik asit ve antioksidan solüsyonlar enjekte eder. İlk seanstan çıktığınız anda cildinizde gözle görülür parlaklık, pürüzsüzlük ve "cam cilt" ışıltısı oluşur.',
  },
  {
    id: 'faq-4',
    category: 'Lazer',
    question: 'Lazer seansına gelmeden önce nelere dikkat etmeliyim?',
    answer:
      'Lazer randevunuzdan 24 saat önce uygulama yapılacak bölgeleri jilet yardımıyla kısaltmanız gerekmektedir. Kılları kökünden alan ağda, cımbız veya epilatör gibi işlemler lazerden en az 3 hafta önce bırakılmalıdır. Randevuya gelirken cildinizde deodorant, krem veya losyon olmamalıdır.',
  },
  {
    id: 'faq-5',
    category: 'Tırnak & Kirpik',
    question: 'Protez tırnak veya kalıcı oje kendi doğal tırnaklarıma zarar verir mi?',
    answer:
      'Uzman estetisyen tarafından doğru teknikle uygulandığında ve doğru solüsyonlarla çıkarıldığında kesinlikle zarar vermez. Aksine tırnak yeme alışkanlığı olan veya tırnakları çabuk kırılan danışanlarımızda doğal tırnağın uzamasına kalkan görevi görür.',
  },
  {
    id: 'faq-6',
    category: 'Tırnak & Kirpik',
    question: 'İpek kirpik ne kadar süre kalıcıdır ve duşta dökülür mü?',
    answer:
      'İpek kirpikler düzenli kullanımla 3-5 hafta arası kalıcılık gösterir. Doğal kirpiklerinizin yenilenme döngüsüne bağlı olarak 3-4 haftada bir ara bakım önerilir. İlk 24 saat su ve buharla temas ettirmediğiniz sürece dökülme yapmaz, duş ve günlük hayatta son derece konforludur.',
  },
  {
    id: 'faq-7',
    category: 'Cilt Bakımı',
    question: 'Hamilelik veya emzirme döneminde hangi işlemler yaptırılabilir?',
    answer:
      'Hamilelik sürecinde lazer epilasyon ve agresif kimyasal peeling işlemleri etik ve yasal olarak uygulanmamaktadır. Ancak doğal içerikli medikal nem bakımları, el-ayak bakımı, medikal manikür ve tırnak güçlendirme işlemleri doktorunuzun aksi bir tavsiyesi olmadığı sürece güvenle uygulanabilir.',
  },
  {
    id: 'faq-8',
    category: 'Randevu & Ödeme',
    question: 'Randevumu nasıl oluşturabilirim veya saatini değiştirebilir miyim?',
    answer:
      'Web sitemiz üzerinden "Online Randevu" butonuna basarak dilediğiniz gün ve müsait saati seçip 30 saniyede randevunuzu onaylayabilirsiniz. Saat değişikliği veya iptal durumunda randevu saatinden en az 4 saat önce sitemizdeki WhatsApp destek hattından bize bildirmeniz yeterlidir.',
  },
  {
    id: 'faq-9',
    category: 'Randevu & Ödeme',
    question: 'Ödeme seçenekleri nelerdir? Paket alımlarında taksit yapılıyor mu?',
    answer:
      'Nakit, kredi kartı ve havale/EFT ile ödeme kabul edilmektedir. Çoklu seans lazer ve cilt bakım paketlerinde danışanlarımıza özel seans başı ödeme kolaylığı veya taksitli ödeme imkânı sunulmaktadır.',
  },
  {
    id: 'faq-10',
    category: 'Randevu & Ödeme',
    question: 'Salonda hijyen ve sterilizasyon standartları nasıl uygulanıyor?',
    answer:
      'Sağlık Bakanlığı hijyen yönetmeliklerine %100 uyumludur. Tırnak ve cilt aletleri her danışan sonrasında medikal otoklav ve sterilizatör ünitelerinde dezenfekte edilerek tek kullanımlık steril poşetlerde açılır. Havlu, sedye örtüsü ve terlikler her işlemde tek kullanımlıktır.',
  },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('TÜMÜ');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = ['TÜMÜ', 'Lazer', 'Cilt Bakımı', 'Tırnak & Kirpik', 'Randevu & Ödeme'];

  const filteredFaqs =
    activeCategory === 'TÜMÜ'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Schema.org FAQPage Structured Data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="sss" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-3">
          <MessageCircleQuestion className="w-3.5 h-3.5" />
          <span>Merak Edilen Sorular</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sıkça Sorulan Sorular
        </h2>
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
          Uygulama süreçleri, buz lazer konforu, cilt bakımı ve salon kurallarımız hakkında aklınıza takılan her şeyi yanıtladık.
        </p>

        {/* Categories Tab Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-zinc-950 border-[#D4AF37]/60 shadow-lg shadow-[#D4AF37]/5'
                  : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                  <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`p-1.5 rounded-lg bg-zinc-900 text-zinc-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#D4AF37]' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-900">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Question Banner */}
      <div className="mt-12 p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-bold text-white">
            Başka bir sorunuz veya danışmak istediğiniz özel bir durum mu var?
          </h4>
          <p className="text-xs text-zinc-400">
            Simay Hanım’a WhatsApp üzerinden dilediğiniz an soru sorabilir, kişisel ön değerlendirme alabilirsiniz.
          </p>
        </div>

        <a
          href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent(
            'Merhaba Simay Hanım, işlemleriniz hakkında bir soru sormak istiyorum.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950 shrink-0 transition"
        >
          WhatsApp ile Sor
        </a>
      </div>
    </section>
  );
}
