import { Lightbulb, Code2, Rocket, ArrowRight } from 'lucide-react';

const pillars = [
  {
    num: '01',
    icon: Lightbulb,
    title: 'Merak ve Özgürlük',
    description:
      'Her çocuk farklı öğrenir. Katı müfredatlar yerine, öğrencinin ilgi alanını merkeze alarak ilerleriz. Soru sormak teşvik edilir, deney yapmak ödüllendirilir.',
    detail: 'Kişiselleştirilmiş öğrenme yolları, merak odaklı müfredat',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    numColor: 'text-amber-200',
    border: 'hover:border-amber-200',
  },
  {
    num: '02',
    icon: Code2,
    title: 'Uygulamalı Öğrenme',
    description:
      'Teoriden değil, uygulamadan başlarız. Her ders içeriğinin %70\'i canlı kodlama, problem çözme ve takım çalışmasıyla geçer. Hata yapmak öğrenmenin bir parçasıdır.',
    detail: '%70 uygulama, %30 teori — gerçek geliştirici deneyimi',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    numColor: 'text-blue-200',
    border: 'hover:border-blue-200',
  },
  {
    num: '03',
    icon: Rocket,
    title: 'Gerçek Projeler',
    description:
      'Her öğrenci kurs sonunda çalışan bir proje ile ayrılır. Oyun, web sitesi, mobil uygulama ya da yapay zeka modeli — gerçek bir şey inşa eder ve dünyaya sunar.',
    detail: 'Portföy projesi, sertifika ve demo günü sunumu',
    iconBg: 'bg-brand-green/10',
    iconColor: 'text-brand-green-dark',
    numColor: 'text-green-200',
    border: 'hover:border-green-200',
  },
];

export default function Philosophy() {
  return (
    <section id="felsefe" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-block bg-brand-green/10 text-brand-green-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Hype Felsefesi
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
            Merak ve{' '}
            <span className="text-brand-green">Uygulama</span>
          </h2>
          <p className="text-gray-500 text-lg mt-4 leading-relaxed">
            Çocuğunuzun teknoloji dünyasında gerçekten yetkin olması için
            üç temel ilkeyi her derse taşıyoruz.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                className={`relative rounded-3xl border-2 border-gray-100 ${p.border} p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group`}
              >
                {/* Big background number */}
                <div className={`absolute top-4 right-6 text-8xl font-black ${p.numColor} select-none pointer-events-none transition-opacity group-hover:opacity-80`}>
                  {p.num}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${p.iconColor}`} />
                </div>

                <h3 className="text-brand-navy font-bold text-xl mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{p.description}</p>

                <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                  <div className="w-1.5 h-1.5 bg-brand-green rounded-full mt-1.5 shrink-0" />
                  <span className="text-xs text-gray-500 font-medium">{p.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 rounded-3xl px-8 py-8 border border-slate-100">
          <div>
            <h4 className="text-brand-navy font-bold text-xl mb-1">
              Bu felsefenin farkını bir derste yaşayın
            </h4>
            <p className="text-gray-500 text-sm">Kayıt gerekmez, tamamen ücretsiz, 1 saatlik deneme dersi.</p>
          </div>
          <button
            onClick={() => document.querySelector('#deneme')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary whitespace-nowrap"
          >
            Ücretsiz Ders Al
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
