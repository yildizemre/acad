import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROCESS } from '../../data/content';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

export default function ProcessSection() {
  return (
    <section id="surec" className="section">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Nasıl Çalışır"
          title="Kayıttan sertifikaya, adım adım"
          subtitle="Sürecin tamamı altı adımdan oluşur. İlk iki adım tamamen ücretsizdir ve hiçbir bağlayıcılığı yoktur."
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {PROCESS.map((step, i) => (
            <Reveal key={step.n} delay={i * 70}>
              <div className="relative pl-16">
                {/* Numara */}
                <span className="absolute left-0 top-0 w-12 h-12 border border-ink-950 text-ink-950 flex items-center justify-center font-display text-lg font-semibold">
                  {step.n}
                </span>

                {/* Bağlantı çizgisi (son ikisi hariç) */}
                {i < PROCESS.length - 1 && (
                  <span className="hidden lg:block absolute left-6 top-12 bottom-[-2.5rem] w-px bg-sand-300" />
                )}

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-ink-950">{step.title}</h3>
                  <span className="badge-neutral shrink-0">{step.duration}</span>
                </div>
                <p className="text-lead-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="rounded-lg bg-sand-50 border border-sand-300 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-ink-950 mb-2">
                İlk iki adım için hiçbir şey ödemiyorsunuz
              </h3>
              <p className="text-lead-500">
                Danışma görüşmesi ve 1 saatlik deneme dersi ücretsizdir. Kart bilgisi istemiyoruz,
                otomatik yenilenen bir abonelik yok.
              </p>
            </div>
            <Link to="/iletisim" className="btn-primary shrink-0">
              Ücretsiz deneme dersi al
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
