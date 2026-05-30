import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Oğlum ilk kez bir şeyi "işte bu benim yaptığım" diyerek arkadaşlarına gösterdi. Hype Academia sadece kod öğretmedi, özgüven kazandırdı.',
    name: 'Ayşe Yılmaz',
    role: 'Kerem\'in annesi · 13 yaş',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    course: 'Python Programlama',
    stars: 5,
  },
  {
    quote:
      'Kızım kurs bitmeden önce kendi web sitesini yayına aldı. Eğitmenler çok sabırlı ve motive edici. Kesinlikle tavsiye ediyorum.',
    name: 'Mehmet Arslan',
    role: 'Elif\'in babası · 15 yaş',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    course: 'Web Tasarım & Geliştirme',
    stars: 5,
  },
  {
    quote:
      'Scratch kursundan başladı, şimdi Python öğreniyor. Hype Academia\'nın kademeli yaklaşımı çok doğru. Zorlamadan, oyunlaştırarak ilerliyorlar.',
    name: 'Fatma Çelik',
    role: 'Bora\'nın annesi · 10 yaş',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    course: 'Scratch ile Oyun Geliştirme',
    stars: 5,
  },
  {
    quote:
      'Robotik kursunda yaptığı projeyi bilim fuarına götürdü ve birincilik ödülü kazandı. Eğitmeni hâlâ bizimle irtibatta. Bu destek paha biçilmez.',
    name: 'Ali Demir',
    role: 'Can\'ın babası · 12 yaş',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    course: 'Arduino & Robotik',
    stars: 5,
  },
  {
    quote:
      'AI kursunu bitirdiğinde "annecim artık yazılımcıyım" dedi. 16 yaşında! Program hem eğlenceli hem de gerçekten profesyonel bir içeriğe sahip.',
    name: 'Selin Kaya',
    role: 'Derin\'in annesi · 16 yaş',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    course: 'Yapay Zeka & ML',
    stars: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
        setAnimating(false);
      }, 250);
    },
    [animating]
  );

  useEffect(() => {
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [go]);

  const t = testimonials[current];

  return (
    <section id="yorumlar" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-brand-navy/5 border border-brand-navy/10 text-brand-navy text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Veli Yorumları
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
            Aileler{' '}
            <span className="text-brand-green">Ne Diyor?</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-250 ${
              animating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
            }`}
          >
            {/* Quote icon */}
            <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-7">
              <Quote className="w-6 h-6 text-brand-green" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {[...Array(t.stars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote text */}
            <blockquote className="text-brand-navy text-xl md:text-2xl font-medium leading-relaxed mb-8">
              "{t.quote}"
            </blockquote>

            {/* Author row */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-green/30"
                />
                <div>
                  <div className="font-bold text-brand-navy">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.role}</div>
                </div>
              </div>
              <div className="bg-brand-green/10 text-brand-green-dark text-xs font-semibold px-4 py-2 rounded-full">
                {t.course}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { if (!animating) { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 250); } }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-brand-green'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Yorum ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-3">
              <button
                onClick={() => go(-1)}
                className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-navy hover:text-brand-navy transition-all"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => go(1)}
                className="w-11 h-11 rounded-full bg-brand-navy flex items-center justify-center text-white hover:bg-brand-navy-light transition-all"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-t border-gray-200 pt-12">
          {[
            { value: '2.500+', label: 'Mezun Öğrenci' },
            { value: '4.9/5', label: 'Ortalama Puan' },
            { value: '98%', label: 'Tavsiye Oranı' },
            { value: '50+', label: 'Aktif Kurs' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-brand-navy mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
