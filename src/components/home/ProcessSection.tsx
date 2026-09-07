import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROCESS } from '../../data/content';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const TINTS = [
  'bg-tint-peach', 'bg-tint-sky', 'bg-tint-lime',
  'bg-tint-rose', 'bg-tint-lilac', 'bg-tint-mint',
];

export default function ProcessSection() {
  return (
    <section id="surec" className="section bg-night-50">
      <div className="container">
        <SectionHeading
          eyebrow="Nasıl çalışır"
          title={
            <>
              Kayıttan sertifikaya, <span className="mark">altı adım</span>
            </>
          }
          subtitle="İlk iki adım tamamen ücretsizdir ve hiçbir bağlayıcılığı yoktur."
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROCESS.map((step, i) => (
            <Reveal key={step.n} delay={i * 70}>
              <div className={`rounded-3xl p-7 h-full ${TINTS[i % TINTS.length]}`}>
                <div className="flex items-center justify-between mb-5">
                  <span className="w-12 h-12 rounded-full bg-night-950 text-white flex items-center justify-center text-lg font-extrabold">
                    {step.n}
                  </span>
                  <span className="badge-white">{step.duration}</span>
                </div>
                <h3 className="text-xl font-extrabold text-night-950 mb-2">{step.title}</h3>
                <p className="text-night-700 leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="rounded-3xl bg-night-950 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                İlk iki adım için hiçbir şey ödemiyorsunuz
              </h3>
              <p className="text-night-300 text-lg">
                Danışma görüşmesi ve 1 saatlik deneme dersi ücretsizdir. Kart bilgisi
                istemiyoruz, otomatik yenilenen bir abonelik yok.
              </p>
            </div>
            <Link to="/iletisim" className="btn-brand btn-lg shrink-0">
              Ücretsiz deneme dersi al
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
