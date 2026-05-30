import { useState } from 'react';
import { Code2, Brain, Palette, ArrowRight, ChevronRight } from 'lucide-react';

type AgeGroup = '8-12' | '13-17';

interface Track {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  courses: string[];
  badge: string;
  badgeColor: string;
  iconBg: string;
  iconColor: string;
}

const tracks: Record<AgeGroup, Track[]> = {
  '8-12': [
    {
      icon: Code2,
      title: 'Kodlama',
      subtitle: 'Scratch & Python Temelleri',
      description:
        'Görsel blok kodlama ile düşünme becerilerini kazanır, ardından Python\'a adım atar.',
      courses: ['Scratch ile Oyun Geliştirme', 'Python\'a Giriş', 'Mini Projeler'],
      badge: 'En Çok Tercih',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Brain,
      title: 'Robotik & Elektronik',
      subtitle: 'Arduino ile Gerçek Dünya',
      description:
        'Fiziksel devreler kurar, sensörler programlar ve kendi akıllı aletlerini üretir.',
      courses: ['Arduino Temelleri', 'Sensörler & Motorlar', 'İlk Robotum'],
      badge: 'Yeni Dönem',
      badgeColor: 'bg-orange-100 text-orange-700',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: Palette,
      title: 'Tasarım & Animasyon',
      subtitle: 'Yaratıcılığı Teknolojiyle Birleştir',
      description:
        'Dijital tasarım araçlarını kullanarak kendi karakterlerini ve animasyonlarını hayata geçirir.',
      courses: ['Figma Temelleri', 'Dijital İllüstrasyon', 'Animasyon Atölyesi'],
      badge: '',
      badgeColor: '',
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ],
  '13-17': [
    {
      icon: Code2,
      title: 'Yazılım & Web',
      subtitle: 'Python · React · Full-Stack',
      description:
        'Profesyonel düzeyde web uygulamaları ve backend sistemler geliştirerek portföy oluşturur.',
      courses: ['Python İleri Seviye', 'React ile Web Geliştirme', 'Full-Stack Proje'],
      badge: 'En Çok Tercih',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Brain,
      title: 'Yapay Zeka & Veri',
      subtitle: 'AI · Machine Learning · Data',
      description:
        'Makine öğrenmesi modellerini sıfırdan kurar, gerçek veri setleriyle analiz yapar.',
      courses: ['AI\'ya Giriş', 'Machine Learning', 'Gerçek AI Projesi'],
      badge: 'Yeni',
      badgeColor: 'bg-cyan-100 text-cyan-700',
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      icon: Palette,
      title: 'UI/UX & Ürün Tasarımı',
      subtitle: 'Figma · Prototyping · Design Systems',
      description:
        'Kullanıcı odaklı arayüzler tasarlar, prototip oluşturur ve tasarım sistemi kurar.',
      courses: ['Figma İleri', 'UX Araştırması', 'Ürün Tasarım Projesi'],
      badge: '',
      badgeColor: '',
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ],
};

export default function AgeFilter() {
  const [selected, setSelected] = useState<AgeGroup>('8-12');

  return (
    <section id="yas-filtresi" className="py-20 md:py-28 bg-brand-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Çocuğun Şu An{' '}
            <span className="text-gradient">Neye İlgi Duyuyor?</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Yaşına ve ilgi alanına göre kişiselleştirilmiş öğrenme rotası seçin.
          </p>
        </div>

        {/* Age toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-1.5 flex gap-1">
            {(['8-12', '13-17'] as AgeGroup[]).map((age) => (
              <button
                key={age}
                onClick={() => setSelected(age)}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selected === age
                    ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30 scale-[1.02]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {age} Yaş
              </button>
            ))}
          </div>
        </div>

        {/* Track cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks[selected].map((track, i) => {
            const Icon = track.icon;
            return (
              <div
                key={`${selected}-${i}`}
                className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-brand-green/40 transition-all duration-300 group cursor-pointer flex flex-col"
                style={{
                  animation: 'fadeInUp 0.4s ease-out both',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${track.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${track.iconColor}`} />
                  </div>
                  {track.badge && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${track.badgeColor}`}>
                      {track.badge}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="mb-5 flex-1">
                  <h3 className="text-white font-bold text-xl mb-1">{track.title}</h3>
                  <div className="text-brand-green text-sm font-medium mb-3">{track.subtitle}</div>
                  <p className="text-white/60 text-sm leading-relaxed">{track.description}</p>
                </div>

                {/* Course list */}
                <ul className="space-y-2 mb-6">
                  {track.courses.map((course) => (
                    <li key={course} className="flex items-center gap-2 text-sm text-white/70">
                      <ChevronRight className="w-4 h-4 text-brand-green shrink-0" />
                      {course}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-brand-green text-white font-semibold py-3 rounded-xl transition-all duration-200 group-hover:bg-brand-green">
                  Rotayı İncele
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
