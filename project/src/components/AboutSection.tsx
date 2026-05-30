import { BadgeCheck, Building2, Cpu, Users2, Target, Eye } from 'lucide-react';

const values = [
  { icon: Cpu, label: 'Görüntü İşleme & CV Uzmanlığı', desc: 'Bilgisayarla görü ve AI alanında sektör deneyimi' },
  { icon: Building2, label: 'Büyük Firma Deneyimi', desc: 'Fortune 500 şirketlerine yazılım ve AI çözümleri' },
  { icon: Users2, label: '2020\'den Beri Sahadayız', desc: 'GTÜ bünyesinde kurulmuş, köklü akademik yapı' },
  { icon: BadgeCheck, label: 'E-Devlet Onaylı Sertifika', desc: 'Devlet güvencesiyle tanınan tamamlama belgesi' },
];

export default function AboutSection() {
  return (
    <section id="hakkimizda" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Hype Academia ekibi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/30 via-transparent to-transparent" />
            </div>

            {/* Floating: Founded badge */}
            <div className="absolute -bottom-5 -left-5 md:-left-8 bg-white rounded-2xl shadow-xl px-5 py-4">
              <div className="text-3xl font-black text-brand-navy">2020</div>
              <div className="text-xs text-gray-500 font-medium">Kuruluş Yılı</div>
            </div>

            {/* Floating: GTU badge */}
            <div className="absolute -top-5 -right-5 md:-right-8 bg-brand-navy rounded-2xl shadow-xl px-4 py-3 text-center">
              <div className="text-brand-green font-bold text-sm">GTÜ</div>
              <div className="text-white/70 text-xs">Bünyesinde</div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="order-1 lg:order-2">
            <span className="inline-block bg-brand-green/10 text-brand-green-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Hakkımızda
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-5">
              Endüstri Uzmanları<br />
              <span className="text-brand-green">Eğitiyor</span>
            </h2>

            <p className="text-gray-500 leading-relaxed mb-5">
              Hype Academia, 2020 yılında <strong className="text-brand-navy">Gebze Teknik Üniversitesi</strong> bünyesinde
              kuruldu. Kurucu ekibimiz; bilgisayarla görü (computer vision), derin öğrenme ve
              görüntü işleme alanlarında <strong className="text-brand-navy">ülkemizin önde gelen sanayi kuruluşlarına</strong> yapay
              zeka çözümleri geliştirmektedir.
            </p>

            <p className="text-gray-500 leading-relaxed mb-8">
              Tüm bu endüstri birikimini genç nesle aktarmak için Hype Academia'yı hayata geçirdik.
              Çocuklarınıza yalnızca kod yazmayı değil, <strong className="text-brand-navy">gerçek dünya problemlerini
              çözmeyi</strong> öğretiyoruz.
            </p>

            {/* Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-brand-green/30 transition-colors"
                >
                  <div className="w-9 h-9 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <div className="text-brand-navy font-semibold text-sm">{label}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mission/Vision mini strip */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border-l-4 border-brand-green pl-4">
                <div className="flex items-center gap-1.5 text-brand-navy font-bold text-sm mb-1">
                  <Target className="w-4 h-4 text-brand-green" /> Misyon
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Sektörel yetkinliği genç nesle aktarmak; problem çözen dijital liderler yetiştirmek.
                </p>
              </div>
              <div className="border-l-4 border-brand-navy pl-4">
                <div className="flex items-center gap-1.5 text-brand-navy font-bold text-sm mb-1">
                  <Eye className="w-4 h-4 text-brand-navy" /> Vizyon
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Türkiye'yi teknoloji ihraç eden bir ülkeye dönüştürecek nesli yetiştirmek.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
