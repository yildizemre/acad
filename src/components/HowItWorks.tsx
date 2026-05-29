import { UserCheck, CalendarCheck, Rocket, Award } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserCheck,
    title: 'Ücretsiz Danışma',
    description:
      'Uzman eğitmen danışmanlarımız çocuğunuzun ilgi alanlarını ve hedeflerini anlar. Hangi kursa başlayacağına birlikte karar verirsiniz.',
    color: 'text-brand-green',
    bg: 'bg-brand-green/10',
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Deneme Dersi',
    description:
      'Tamamen ücretsiz 1 saatlik deneme dersiyle platformumuzu ve eğitim metodumuzu deneyimleyin. Bağlayıcılığı yok.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Kursa Başla',
    description:
      'Seçtiğiniz programa kayıt olun. Canlı dersler, interaktif ödevler ve proje çalışmalarıyla öğrenme yolculuğu başlar.',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    step: '04',
    icon: Award,
    title: 'Sertifika & Proje',
    description:
      'Kurs sonunda çocuğunuz gerçek bir proje geliştirmiş ve resmi Hype Academia sertifikası kazanmış olur.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
];

export default function HowItWorks() {
  return (
    <section id="nasil-calisir" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-brand-navy/5 border border-brand-navy/10 text-brand-navy text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Süreç
          </span>
          <h2 className="section-title">
            Nasıl <span className="text-brand-green">Çalışır?</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Kayıttan sertifikaya uzanan yolculuk, 4 adımda tamamlanır.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-green via-blue-400 to-rose-400 opacity-30" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative flex flex-col items-center text-center group">
                {/* Step number */}
                <div className="relative z-10 mb-5">
                  <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400`}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-brand-navy text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
