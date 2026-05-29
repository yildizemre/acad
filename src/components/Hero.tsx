import { ArrowRight, Play, Sparkles, Users, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const stats = [
  { value: '2.500+', label: 'Mezun Öğrenci' },
  { value: '98%', label: 'Memnuniyet Oranı' },
  { value: '120+', label: 'Aktif Kurs' },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-hero overflow-hidden flex items-center">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-navy-light/30 rounded-full blur-3xl" />

      {/* Floating code elements */}
      <div className="absolute top-28 right-8 md:right-24 animate-float opacity-70 hidden sm:block">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-xs font-mono text-white/80 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div><span className="text-brand-green">const</span> <span className="text-blue-300">future</span> = <span className="text-yellow-300">"senin"</span>;</div>
          <div><span className="text-brand-green">console</span>.log(future);</div>
          <div className="text-brand-green mt-1">// "senin"</div>
        </div>
      </div>

      <div className="absolute bottom-36 right-12 md:right-40 animate-float animation-delay-300 opacity-60 hidden md:block" style={{ animationDelay: '2s' }}>
        <div className="bg-brand-green/20 backdrop-blur-sm border border-brand-green/30 rounded-xl p-3 text-xs font-mono text-white/90">
          <div className="text-brand-green-light">🚀 Build something amazing</div>
        </div>
      </div>

      <div className="absolute top-48 left-8 md:left-16 animate-float opacity-60 hidden lg:block" style={{ animationDelay: '3s' }}>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-white text-xs">
            <div className="font-semibold">Yeni Kurs!</div>
            <div className="opacity-70">AI ile Uygulama Geliştir</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <span className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/40 text-brand-green-light text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              8-17 Yaş Arası Teknoloji Eğitimi
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-100 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Geleceğin{' '}
            <span className="text-gradient">Yazılımcılarını</span>{' '}
            Bugün Yetiştiriyoruz
          </h1>

          {/* Subtext */}
          <p
            className={`text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Hype Academia ile çocuğunuz; oyun geliştirmeden yapay zekaya,
            web tasarımdan robotik kodlamaya kadar teknolojinin her alanında
            uzman rehberler eşliğinde proje tabanlı öğrenir.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-700 delay-300 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button
              onClick={() => handleScroll('#iletisim')}
              className="btn-primary text-base !px-8 !py-4 shadow-2xl shadow-brand-green/30"
            >
              Ücretsiz Deneme Dersi Al
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('#kurslar')}
              className="btn-outline text-base !px-8 !py-4"
            >
              <Play className="w-5 h-5 fill-white" />
              Kurslara Göz At
            </button>
          </div>

          {/* Stats */}
          <div
            className={`flex flex-wrap gap-8 transition-all duration-700 delay-500 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-white/60 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
}
