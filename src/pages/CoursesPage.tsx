import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, X, ArrowRight, Sparkles } from 'lucide-react';
import { COURSES } from '../data/courses';
import { PATHS, formatTRY, pathInfo } from '../data/pricing';
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
    title: 'Çocuklar İçin Kodlama Kursları — Scratch, Python, Robotik | Hype Academia',
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
      <section className="pt-10 md:pt-16">
        <div className="container">
          <Reveal className="text-center max-w-3xl mx-auto">
            <h1 className="text-display-md">
              Her kursun müfredatı <span className="mark">hafta hafta</span> açık
            </h1>
            <p className="mt-6 text-lg md:text-xl text-night-600 leading-relaxed">
              Çocuğunuzun hangi hafta neyi öğreneceğini, hangi projeyi bitireceğini ve kurs sonunda elinde ne kalacağını kayıt olmadan önce görebilirsiniz. Gizli içerik yok.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filtreler */}
      <section className="sticky top-20 md:top-24 z-30 bg-white/90 backdrop-blur-lg /70">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-night-950 shrink-0">
              <Filter className="w-4 h-4 text-electric-500" />
              Filtrele
            </div>

            {/* Yaş */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-night-400 shrink-0 hidden sm:inline">Yaş:</span>
              {AGES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(age === a ? null : a)}
                  className={`shrink-0 w-9 h-9 rounded-2xl text-sm font-semibold transition-all ${
                    age === a
                      ? 'bg-electric-500 text-white'
                      : 'bg-night-50 text-night-600 hover:bg-night-100'
                  }`}
                  aria-pressed={age === a}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Seviye */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-night-400 hidden sm:inline">Seviye:</span>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(level === l ? null : l)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                    level === l
                      ? 'bg-night-950 text-white'
                      : 'bg-night-50 text-night-600 hover:bg-night-100'
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
                className="inline-flex items-center gap-1 text-xs font-medium text-night-400 hover:text-electric-500 transition-colors shrink-0 lg:ml-auto"
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
          <p className="text-sm text-night-400 mb-6">
            {filtered.length} kurs listeleniyor
            {age !== null && <> · {age} yaş</>}
            {level !== null && <> · {level}</>}
          </p>

          {filtered.length === 0 ? (
            <div className="panel p-12 text-center">
              <p className="text-night-500 mb-4">
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
      <section className="section bg-white /70">
        <div className="container">
          <SectionHeading
            eyebrow="Yıllık Programlar"
            title="Tek kurs yerine bir öğrenme patikası"
            subtitle="İki kursu birlikte aldığınızda hem birbirini tamamlayan bir program hem de daha uygun bir fiyat elde edersiniz."
          />

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PATHS.map((p, i) => {
              const info = pathInfo(p);
              return (
                <Reveal key={p.id} delay={i * 80}>
                  <div className="card p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge-neutral">{p.ageRange}</span>
                      <span className="badge bg-night-50 text-night-900 border border-night-200">
                        <Sparkles className="w-3 h-3" />
                        {formatTRY(info.save)} avantaj
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-night-950 mb-1">{p.name}</h3>
                    <p className="text-xs text-night-400 mb-4">{info.duration}</p>
                    <p className="text-sm text-night-500 leading-relaxed mb-5">{p.outcome}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.courseIds.map((id) => {
                        const c = COURSES.find((x) => x.id === id);
                        return c ? (
                          <Link
                            key={id}
                            to={`/kurslar/${c.slug}`}
                            className="badge bg-night-50 text-night-600 hover:ring-brick-300 hover:text-electric-600 transition-colors"
                          >
                            {c.shortTitle}
                          </Link>
                        ) : null;
                      })}
                    </div>

                    <div className="mt-auto pt-5">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-extrabold text-night-950">
                          {formatTRY(p.price)}
                        </span>
                        <span className="text-sm text-night-400 line-through">
                          {formatTRY(info.listPrice)}
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

          <p className="mt-8 text-center text-sm text-night-400">
            Patika fiyatları Kulüp (grup) paketi içindir. Atölye ve Birebir seçenekleri için{' '}
            <Link to="/fiyatlar" className="text-electric-500 font-medium hover:underline">
              fiyat sayfasına
            </Link>{' '}
            bakabilirsiniz.
          </p>
        </div>
      </section>
    </>
  );
}
