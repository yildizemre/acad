import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, X, ArrowRight, Sparkles } from 'lucide-react';
import { COURSES } from '../data/courses';
import { PATHS, formatTRY } from '../data/pricing';
import CourseCard from '../components/CourseCard';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';

const AGES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const LEVELS = ['Başlangıç', 'Orta', 'İleri'] as const;

export default function CoursesPage() {
  const [age, setAge] = useState<number | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  usePageMeta({
    title: 'Kurslar ve Müfredatlar | Hype Academia',
    description:
      '8–17 yaş arası çocuklar için Scratch, Python, Web, Unity, Yapay Zeka ve Arduino kursları. Hafta hafta müfredat, fiyatlar ve ön koşullar.',
  });

  const filtered = useMemo(
    () =>
      COURSES.filter(
        (c) =>
          (age === null || (age >= c.ageMin && age <= c.ageMax)) &&
          (level === null || c.level === level),
      ),
    [age, level],
  );

  const hasFilter = age !== null || level !== null;

  return (
    <>
      {/* Başlık */}
      <section className="bg-sand-50 border-b border-sand-300/70">
        <div className="container py-14 md:py-20">
          <Reveal className="max-w-3xl">
            <div className="eyebrow mb-4">
              <span className="rule" />
              6 Uzmanlık Programı
            </div>
            <h1 className="text-display-md font-bold text-ink-950">
              Her kursun müfredatı <span className="underline-electric">hafta hafta</span> açık
            </h1>
            <p className="mt-5 text-lg text-lead-500 leading-relaxed">
              Çocuğunuzun hangi hafta neyi öğreneceğini, hangi projeyi bitireceğini ve kurs sonunda
              elinde ne kalacağını kayıt olmadan önce görebilirsiniz. Gizli içerik yok.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filtreler */}
      <section className="sticky top-20 md:top-24 z-30 bg-sand-50/90 backdrop-blur-lg border-b border-sand-300/70">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-950 shrink-0">
              <Filter className="w-4 h-4 text-brick-500" />
              Filtrele
            </div>

            {/* Yaş */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              <span className="text-xs text-lead-400 shrink-0 hidden sm:inline">Yaş:</span>
              {AGES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(age === a ? null : a)}
                  className={`shrink-0 w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                    age === a
                      ? 'bg-brick-500 text-white'
                      : 'bg-sand-200 text-lead-600 hover:bg-sand-300'
                  }`}
                  aria-pressed={age === a}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Seviye */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-lead-400 hidden sm:inline">Seviye:</span>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(level === l ? null : l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    level === l
                      ? 'bg-ink-950 text-white'
                      : 'bg-sand-200 text-lead-600 hover:bg-sand-300'
                  }`}
                  aria-pressed={level === l}
                >
                  {l}
                </button>
              ))}
            </div>

            {hasFilter && (
              <button
                onClick={() => {
                  setAge(null);
                  setLevel(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-lead-400 hover:text-brick-600 transition-colors shrink-0 lg:ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                Temizle
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Kurslar */}
      <section className="section">
        <div className="container">
          <p className="text-sm text-lead-400 mb-6">
            {filtered.length} kurs listeleniyor
            {age !== null && <> · {age} yaş</>}
            {level !== null && <> · {level}</>}
          </p>

          {filtered.length === 0 ? (
            <div className="panel p-12 text-center">
              <p className="text-lead-500 mb-4">
                Bu filtreye uyan kurs yok. Yaş ve seviye kombinasyonunu değiştirmeyi deneyin.
              </p>
              <button
                onClick={() => {
                  setAge(null);
                  setLevel(null);
                }}
                className="btn-ghost btn-sm"
              >
                Filtreleri temizle
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => (
                <Reveal key={c.id} delay={i * 60}>
                  <CourseCard course={c} index={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Öğrenme patikaları */}
      <section className="section bg-sand-50 border-t border-sand-300/70">
        <div className="container">
          <SectionHeading
            eyebrow="Yıllık Programlar"
            title="Tek kurs yerine bir öğrenme patikası"
            subtitle="İki kursu birlikte aldığınızda hem birbirini tamamlayan bir program hem de daha uygun bir fiyat elde edersiniz."
          />

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PATHS.map((p, i) => {
              const save = p.listPrice - p.price;
              return (
                <Reveal key={p.id} delay={i * 80}>
                  <div className="card p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge-neutral">{p.ageRange}</span>
                      <span className="badge bg-sand-200 text-ink-900 border border-sand-400">
                        <Sparkles className="w-3 h-3" />
                        {formatTRY(save)} avantaj
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-ink-950 mb-1">{p.name}</h3>
                    <p className="text-xs text-lead-400 mb-4">{p.duration}</p>
                    <p className="text-sm text-lead-500 leading-relaxed mb-5">{p.outcome}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.courseIds.map((id) => {
                        const c = COURSES.find((x) => x.id === id);
                        return c ? (
                          <Link
                            key={id}
                            to={`/kurslar/${c.slug}`}
                            className="badge bg-sand-50 border border-sand-300 text-lead-600 hover:ring-brick-300 hover:text-brick-700 transition-colors"
                          >
                            {c.shortTitle}
                          </Link>
                        ) : null;
                      })}
                    </div>

                    <div className="mt-auto pt-5 border-t border-sand-200">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-ink-950">
                          {formatTRY(p.price)}
                        </span>
                        <span className="text-sm text-lead-400 line-through">
                          {formatTRY(p.listPrice)}
                        </span>
                      </div>
                      <Link to="/iletisim" className="btn-ghost btn-sm w-full">
                        Bu patikayı konuşalım
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-lead-400">
            Patika fiyatları Kulüp (grup) paketi içindir. Atölye ve Birebir seçenekleri için{' '}
            <Link to="/fiyatlar" className="text-brick-600 font-medium hover:underline">
              fiyat sayfasına
            </Link>{' '}
            bakabilirsiniz.
          </p>
        </div>
      </section>
    </>
  );
}
