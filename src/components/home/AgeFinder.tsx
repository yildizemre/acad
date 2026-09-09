import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { coursesForAge } from '../../data/courses';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const AGES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const TINT: Record<string, string> = {
  peach: 'bg-tint-peach',
  rose: 'bg-tint-rose',
  lime: 'bg-tint-lime',
  sky: 'bg-tint-sky',
  lilac: 'bg-tint-lilac',
  mint: 'bg-tint-mint',
};

/** Velinin en hızlı cevap istediği soru: "benim çocuğuma hangisi uygun?" */
export default function AgeFinder() {
  const [age, setAge] = useState<number | null>(null);
  const matches = age !== null ? coursesForAge(age) : [];

  return (
    <section id="yas-bul" className="section">
      <div className="container">
        <SectionHeading
          title={
            <>
              Çocuğunuz <span className="mark">kaç yaşında?</span>
            </>
          }
          subtitle="Yaşı seçin, ona uygun programları hemen görün. Her kursun yaş aralığı pedagojik olarak belirlenmiştir."
        />

        <Reveal className="mt-10">
          <div className="flex flex-wrap justify-center gap-3">
            {AGES.map((a) => (
              <button
                key={a}
                onClick={() => setAge(age === a ? null : a)}
                aria-pressed={age === a}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full text-xl md:text-2xl font-extrabold
                  transition-all duration-200 ${
                    age === a
                      ? 'bg-night-950 text-white scale-105'
                      : 'bg-night-50 text-night-950 hover:bg-marker hover:scale-105'
                  }`}
              >
                {a}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 max-w-5xl mx-auto">
          {age === null ? (
            <p className="text-center text-night-400 font-semibold">
              Yaş seçince uygun kurslar burada listelenir
            </p>
          ) : (
            <>
              <p className="text-center text-lg text-night-700 mb-8">
                <span className="font-extrabold text-night-950">{age} yaş</span> için{' '}
                <span className="mark font-extrabold">{matches.length} program</span> uygun
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {matches.map((c, i) => (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link
                      to={`/kurslar/${c.slug}`}
                      className={`group block rounded-3xl p-6 h-full transition-transform duration-300 hover:-translate-y-1 ${
                        TINT[c.tint] ?? 'bg-night-50'
                      }`}
                    >
                      <span className="badge-white mb-4">{c.level}</span>
                      <span className="block text-xl font-extrabold text-night-950 mb-2">
                        {c.shortTitle}
                      </span>
                      <span className="block text-sm text-night-700 mb-5">
                        {c.weeks} hafta · maks. {c.maxStudents} kişi
                      </span>
                      <span className="inline-flex items-center gap-2 font-bold text-night-950">
                        Müfredatı gör
                        <span className="w-8 h-8 rounded-full bg-night-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link to="/iletisim" className="btn-primary">
                  Emin değilim, birlikte karar verelim
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
