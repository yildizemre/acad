import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { coursesForAge } from '../../data/courses';
import CourseIcon from '../ui/CourseIcon';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const AGES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

/**
 * Velinin en hızlı cevap istediği soru: "benim çocuğuma hangisi uygun?"
 * Yaşı seçince uygun kursları anında listeler.
 */
export default function AgeFinder() {
  const [age, setAge] = useState<number | null>(null);
  const matches = age !== null ? coursesForAge(age) : [];

  return (
    <section id="yas-bul" className="section bg-sand-50 border-y border-sand-300/70">
      <div className="container">
        <SectionHeading
          index="01"
          eyebrow="30 Saniyede Cevap"
          title="Çocuğunuz kaç yaşında?"
          subtitle="Yaşı seçin, ona uygun programları hemen görün. Her kursun yaş aralığı pedagojik olarak belirlenmiştir."
        />

        {/* Yaş seçici */}
        <Reveal className="mt-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {AGES.map((a) => (
              <button
                key={a}
                onClick={() => setAge(age === a ? null : a)}
                aria-pressed={age === a}
                className={`w-14 h-14 md:w-16 md:h-16 rounded font-display text-lg font-semibold transition-colors ${
                  age === a
                    ? 'bg-brick-500 text-white scale-105'
                    : 'bg-sand-50 text-ink-950 border border-sand-300 hover:ring-brick-300 hover:-translate-y-0.5'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Sonuç */}
        <div className="mt-10 max-w-4xl mx-auto">
          {age === null ? (
            <div className="text-center py-10 text-lead-400 text-sm flex flex-col items-center gap-3">
              <Search className="w-8 h-8 text-lead-300" />
              Yaş seçince uygun kurslar burada listelenir
            </div>
          ) : (
            <>
              <p className="text-center text-lead-500 mb-6">
                <span className="font-semibold text-ink-950">{age} yaş</span> için{' '}
                <span className="font-semibold text-brick-600">{matches.length} program</span>{' '}
                uygun:
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((c, i) => (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link
                      to={`/kurslar/${c.slug}`}
                      className="card-hover p-5 flex items-start gap-4 h-full group"
                    >
                      <span className="w-11 h-11 rounded border border-sand-400 text-ink-950 flex items-center justify-center shrink-0 group-hover:border-brick-500 group-hover:text-brick-600 transition-colors">
                        <CourseIcon name={c.icon} className="w-5 h-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-ink-950 leading-snug mb-1">
                          {c.shortTitle}
                        </span>
                        <span className="block text-xs text-lead-400 mb-2">
                          {c.level} · {c.weeks} hafta
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brick-600">
                          Müfredatı gör
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link to="/iletisim" className="btn-primary">
                  Hangisi olduğundan emin değilim, konuşalım
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
