import { Shield, Lightbulb, BarChart3, Heart, Trophy, Headphones } from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'Deneyimli Eğitmenler',
    description:
      'Sektör deneyimli, çocuk psikolojisine hakim eğitmenlerimiz her öğrenciye ilham kaynağı olur. Yalnızca en iyilerle çalışıyoruz.',
    color: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
  },
  {
    icon: Lightbulb,
    title: 'Proje Bazlı Öğrenme',
    description:
      'Teoriden değil, uygulamadan öğreniyoruz. Her kurs sonunda gerçek hayatta kullanabileceği bitmiş bir proje ile ayrılıyor.',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
  },
  {
    icon: BarChart3,
    title: 'Kişiselleştirilmiş Takip',
    description:
      'Her öğrencinin gelişimini ayrı ayrı takip ederek aileleri düzenli olarak bilgilendiriyor, eğitimi kişiye özel şekillendiriyoruz.',
    color: 'bg-green-50 text-green-600',
    border: 'border-green-100',
  },
  {
    icon: Shield,
    title: 'Güvenli Öğrenme Ortamı',
    description:
      'Çevrimiçi derslerimiz Türkiye\'nin KVKK standartlarına uygun, tamamen güvenli ve ebeveyn onaylı platformlarda yürütülür.',
    color: 'bg-brand-navy/5 text-brand-navy',
    border: 'border-brand-navy/10',
  },
  {
    icon: Heart,
    title: 'Aile Dostu Yaklaşım',
    description:
      'Ebeveynler de sürecin parçası. Aylık ilerleme raporları, veli toplantıları ve özel danışma seanslarıyla yanınızdayız.',
    color: 'bg-rose-50 text-rose-600',
    border: 'border-rose-100',
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description:
      'WhatsApp veya mail yoluyla her zaman ulaşabilirsiniz. Teknik sorun mu? Soru mu? Anında yardım alın.',
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-100',
  },
];

export default function WhyUs() {
  return (
    <section id="neden-biz" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-brand-green/10 text-brand-green-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Felsefemiz
          </span>
          <h2 className="section-title">
            Neden{' '}
            <span className="text-brand-green">Hype Academia?</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Binlerce aile bize güveniyor. İşte fark yaratan unsurlar.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`group rounded-2xl border ${f.border} p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-13 h-13 rounded-2xl ${f.color} w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonial strip */}
        <div className="mt-16 bg-hero rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-100" />
          <div className="relative z-10 text-center">
            <p className="text-white/90 text-xl md:text-2xl font-medium italic leading-relaxed max-w-3xl mx-auto">
              "Oğlum Hype Academia'ya başladıktan 3 ay sonra kendi oyununu yaptı.
              Artık her gün 'bugün ne kodlayacağım?' diye soruyor. Bu değişimi görünce
              gerçekten çok mutlu olduk."
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Veli"
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-green"
              />
              <div className="text-left">
                <div className="text-white font-semibold">Ayşe Yılmaz</div>
                <div className="text-white/60 text-sm">13 yaşındaki Kerem'in annesi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
