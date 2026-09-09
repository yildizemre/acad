import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { TIERS, formatTRY, perLesson, lessonMinutesRange } from '../../data/pricing';
import { COURSES } from '../../data/courses';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const TINTS = ['bg-tint-sky', 'bg-night-950', 'bg-tint-lilac'];

export default function PricingTeaser() {
  return (
    <section className="section bg-night-50">
      <div className="container">
        <SectionHeading
          eyebrow="Fiyatlar"
          title={
            <>
              Fiyatı öğrenmek için <span className="mark">aramanıza gerek yok</span>
            </>
          }
          subtitle="Üç paketimiz de aynı müfredatı işler. Değişen tek şey sınıf büyüklüğü ve çocuğunuza ayrılan eğitmen zamanıdır."
        />

        <div className="mt-14 grid lg:grid-cols-3 gap-5 items-stretch">
          {TIERS.map((t, i) => {
            const dark = t.popular;
            return (
              <Reveal key={t.id} delay={i * 80}>
                <div
                  className={`relative rounded-3xl p-7 md:p-8 h-full flex flex-col ${TINTS[i]} ${
                    dark ? 'text-white lg:-mt-4 lg:pb-12' : ''
                  }`}
                >
                  {dark && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-marker">
                      En çok tercih edilen
                    </span>
                  )}

                  <h3 className={`text-2xl font-extrabold mb-1 ${dark ? 'text-white' : 'text-night-950'}`}>
                    {t.name}
                  </h3>
                  <p className={`mb-6 ${dark ? 'text-night-300' : 'text-night-700'}`}>
                    {t.subtitle}
                  </p>

                  <div className={`text-4xl font-extrabold mb-1 ${dark ? 'text-white' : 'text-night-950'}`}>
                    {formatTRY(t.price8)}
                  </div>
                  <p className={`text-sm mb-6 ${dark ? 'text-night-400' : 'text-night-600'}`}>
                    8 hafta / 16 ders · ders başı yaklaşık {formatTRY(perLesson(t.price8, 8))}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={dark ? 'badge bg-white/15 text-white' : 'badge-white'}>
                      En fazla {t.maxStudents} öğrenci
                    </span>
                    <span className={dark ? 'badge bg-white/15 text-white' : 'badge-white'}>
                      {t.lessonLength}
                    </span>
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {t.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${dark ? 'text-marker' : 'text-electric-500'}`} />
                        <span className={dark ? 'text-night-200' : 'text-night-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-night-500">
          Ders süresi kursa göre {lessonMinutesRange([...COURSES])} arasında değişir. Unity ve
          Yapay Zeka kurslarında sınıflar zaten en fazla 6 kişiliktir.
        </p>

        <Reveal className="mt-10">
          <div className="rounded-3xl bg-marker p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-xl md:text-2xl font-extrabold text-night-950 mb-2">
                Peşin ödemede %10 indirim · 9 taksite kadar faizsiz
              </p>
              <p className="text-night-800">
                Kardeş indirimi %15. İlk 2 ders içinde koşulsuz iade — gerekçe sormuyoruz.
              </p>
            </div>
            <Link to="/fiyatlar" className="btn-primary shrink-0">
              Hesaplayıcıyı aç
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
