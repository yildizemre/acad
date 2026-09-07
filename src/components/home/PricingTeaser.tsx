import { Link } from 'react-router-dom';
import { ArrowRight, Check, Calculator, ShieldCheck } from 'lucide-react';
import { TIERS, formatTRY, perLesson } from '../../data/pricing';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

export default function PricingTeaser() {
  return (
    <section className="section bg-sand-50 border-y border-sand-300/70">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Fiyatlar"
          title="Fiyatı öğrenmek için aramanıza gerek yok"
          subtitle="Üç paketimiz de aynı müfredatı işler. Değişen tek şey sınıf büyüklüğü ve çocuğunuza ayrılan eğitmen zamanıdır."
        />

        <div className="mt-12 grid lg:grid-cols-3 gap-5 items-start">
          {TIERS.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <div
                className={`rounded-lg p-6 h-full flex flex-col ${
                  t.popular
                    ? 'bg-ink-950 text-white'
                    : 'bg-sand-50 border border-sand-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`text-lg font-bold ${t.popular ? 'text-white' : 'text-ink-950'}`}
                  >
                    {t.name}
                  </h3>
                  {t.popular && (
                    <span className="badge bg-brick-500 text-white text-[10px]">Popüler</span>
                  )}
                </div>
                <p className={`text-xs mb-5 ${t.popular ? 'text-white/50' : 'text-lead-400'}`}>
                  {t.classSize} · {t.lessonLength}
                </p>

                <div
                  className={`text-3xl font-bold mb-1 ${t.popular ? 'text-white' : 'text-ink-950'}`}
                >
                  {formatTRY(t.price8)}
                </div>
                <p className={`text-xs mb-5 ${t.popular ? 'text-white/50' : 'text-lead-400'}`}>
                  8 hafta / 16 ders · ders başı {formatTRY(perLesson(t.price8, 8))}
                </p>

                <ul className="space-y-2 flex-1">
                  {t.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          t.popular ? 'text-brick-400' : 'text-brick-500'
                        }`}
                      />
                      <span className={t.popular ? 'text-white/75' : 'text-lead-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="rounded-lg bg-sand-50 border border-sand-300 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <Calculator className="w-5 h-5 text-brick-500 shrink-0 mt-0.5" />
                <p className="text-lead-600 text-sm leading-relaxed">
                  <strong className="text-ink-950">Peşin ödemede %10 indirim</strong>, 9 taksite
                  kadar faizsiz. Kardeş indirimi %15, patika indirimi %15'e varan.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-ink-700 shrink-0 mt-0.5" />
                <p className="text-lead-600 text-sm leading-relaxed">
                  <strong className="text-ink-950">İlk 2 ders içinde koşulsuz iade.</strong>{' '}
                  Beğenmezseniz gerekçe sormadan paranızı iade ediyoruz.
                </p>
              </div>
            </div>
            <Link to="/fiyatlar" className="btn-secondary shrink-0">
              Tüm fiyatlar ve hesaplayıcı
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
