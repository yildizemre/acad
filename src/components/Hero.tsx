import { ArrowRight, Play, CheckCircle2, Star, Zap, BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

const STATS = [
  { value: '2.500+', label: 'Mezun Öğrenci' },
  { value: '98%', label: 'Memnuniyet' },
  { value: '50+', label: 'Aktif Kurs' },
];

const AVATAR_URLS = [
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scroll = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center pt-16 md:pt-20">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-slate-50/80 to-transparent pointer-events-none" />
      <div className="absolute top-24 right-10 w-80 h-80 bg-brand-green/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 left-4 w-56 h-56 bg-navy-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ─── Left: Text ─── */}
          <div
            className={`transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 text-brand-green-dark text-sm font-semibold px-4 py-2 rounded-full mb-7">
              <Zap className="w-4 h-4 text-brand-green" />
              8–17 Yaş Arası Teknoloji Eğitimi
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] font-bold text-brand-navy leading-[1.07] mb-6 tracking-tight">
              Geleceği<br />
              Bugünden{' '}
              <span className="relative inline-block">
                <span className="text-gradient">Kodla</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 160 8"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2,6 Q40,1 80,5 Q120,9 158,4"
                    stroke="#00C896"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Oyun geliştirmeden yapay zekaya, web tasarımdan robotiğe —
              çocuğunuz gerçek projeler inşa ederek öğreniyor.
              Deneyimli eğitmenler, proje tabanlı yöntem.
            </p>

            {/* Trust bullets */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
              {['Ücretsiz deneme dersi', 'E-Devlet onaylı sertifika', '7/24 destek'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* E-devlet badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-10">
              <BadgeCheck className="w-4 h-4" />
              Türk Hükümeti E-Devlet Sistemi Onaylı Sertifika
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button
                onClick={() => scroll('#deneme')}
                className="btn-primary text-base !px-8 !py-4 shadow-xl shadow-brand-green/20"
              >
                Ücretsiz Deneme Dersi Al
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('#yas-filtresi')}
                className="inline-flex items-center justify-center gap-2 text-brand-navy font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-brand-navy transition-all duration-200"
              >
                <Play className="w-5 h-5 text-brand-green fill-brand-green" />
                Kursları Keşfet
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-10 bg-gray-200" />}
                  <div>
                    <div className="text-2xl font-bold text-brand-navy">{s.value}</div>
                    <div className="text-sm text-gray-400">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right: Image + floating badges ─── */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Main photo */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/5] max-w-sm mx-auto lg:max-w-none">
              <img
                src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Öğrenciler kodlama yapıyor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
            </div>

            {/* Floating: student count */}
            <div className="absolute -top-5 -left-5 md:-left-8 bg-white rounded-2xl shadow-xl px-4 py-3 animate-float">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 shrink-0">
                  {AVATAR_URLS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-navy whitespace-nowrap">
                    320+ Aktif Öğrenci
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating: code card */}
            <div
              className="absolute -bottom-5 -right-5 md:-right-8 bg-brand-navy rounded-2xl shadow-xl p-4 animate-float"
              style={{ animationDelay: '2s' }}
            >
              <div className="text-[10px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">
                Python
              </div>
              <div className="text-xs font-mono space-y-1 leading-relaxed">
                <div>
                  <span className="text-brand-green">print</span>
                  <span className="text-white/90">("Merhaba Dünya!")</span>
                </div>
                <div>
                  <span className="text-blue-400">for</span>
                  <span className="text-white/90"> i </span>
                  <span className="text-blue-400">in</span>
                  <span className="text-white/90"> range(10):</span>
                </div>
                <div className="pl-4 text-white/60">...</div>
              </div>
            </div>

            {/* Floating: live indicator */}
            <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-brand-navy">Canlı Ders</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
