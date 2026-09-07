import { Users, BadgeCheck, Layers, MessageSquare, Repeat, Receipt } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const REASONS = [
  {
    icon: Users,
    title: 'Sınıflar gerçekten küçük',
    desc: 'Kulüpte en fazla 8, Atölyede en fazla 4 öğrenci. Kalabalık sınıfta çocuk soru sormaya çekiniyor — biz bunu baştan engelliyoruz.',
  },
  {
    icon: Layers,
    title: 'Müfredat hafta hafta açık',
    desc: 'Hangi hafta ne işleneceğini, hangi projenin çıkacağını kayıt olmadan görebilirsiniz. Sürpriz içerik yok.',
  },
  {
    icon: Receipt,
    title: 'Fiyatlar sitede yazılı',
    desc: 'Fiyat öğrenmek için form doldurup beklemenize gerek yok. Üç paket, altı ödeme planı, hepsi açık.',
  },
  {
    icon: BadgeCheck,
    title: 'Sektörde çalışan eğitmenler',
    desc: 'Eğitmenlerimiz aktif olarak yapay zeka, oyun ve web projeleri geliştiren mühendisler. Anlattıkları şeyi kendileri yapıyor.',
  },
  {
    icon: MessageSquare,
    title: 'Veli sürecin içinde',
    desc: 'Aylık yazılı gelişim raporu, öğrenci panelinden ödev ve devam takibi, dönem ortasında birebir görüşme.',
  },
  {
    icon: Repeat,
    title: 'Kaçırılan ders kaybolmaz',
    desc: 'Her ders kaydedilir, 12 ay erişilebilir. Ayrıca dönem başına 2 telafi hakkınız vardır.',
  },
];

export default function WhyUsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Neden Hype Academia"
          title="Velilerin sorduğu zor soruların cevabı"
          subtitle="Online eğitimde en çok endişe edilen noktaları baştan çözecek şekilde kurguladık."
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 60}>
              <div className="card-hover p-6 h-full">
                <span className="w-11 h-11 rounded border border-sand-400 text-ink-950 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-ink-950 mb-2">{title}</h3>
                <p className="text-sm text-lead-500 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
