import { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Clock,
  Users,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Monitor,
  Wrench,
  Target,
  Trophy,
  Signal,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  COURSES,
  courseBySlug,
  courseById,
  totalLessons,
} from '../data/courses';
import { TIERS, priceFor, formatTRY, perLesson, classSizeLabel, lessonLineFor } from '../data/pricing';
import { SITE, waLink } from '../data/site';
import { projectsForCourse } from '../data/projects';
import CourseIcon from '../components/ui/CourseIcon';
import Reveal from '../components/ui/Reveal';
import CourseCard from '../components/CourseCard';
import usePageMeta from '../hooks/usePageMeta';
import { track } from '../lib/analytics';
import useStructuredData, { breadcrumb } from '../hooks/useStructuredData';
import { TIERS as PRICE_TIERS } from '../data/pricing';

const GAIN_TINTS = [
  'bg-tint-peach', 'bg-tint-sky', 'bg-tint-lime',
  'bg-tint-rose', 'bg-tint-lilac', 'bg-tint-mint',
];

export default function CourseDetailPage() {
  const { slug } = useParams();
  const course = slug ? courseBySlug(slug) : undefined;
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  usePageMeta({
    title: course
      ? `${course.title} — ${course.ageRange} | Hype Academia`
      : 'Kurs bulunamadı | Hype Academia',
    description: course
      ? `${course.summary} ${course.weeks} hafta, ${totalLessons(course)} canlı ders. Haftalık müfredat, ön koşullar ve fiyatlar.`
      : undefined,
  });

  useEffect(() => {
    if (course) track('kurs_goruntulendi', { kurs: course.shortTitle, seviye: course.level });
  }, [course]);

  // Arama sonuçlarında kursun süresi, seviyesi ve fiyatı görünsün
  useStructuredData(
    course
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: course.title,
            description: course.intro,
            url: `${SITE.url}/kurslar/${course.slug}`,
            image: `${SITE.url}${course.image}`,
            inLanguage: 'tr-TR',
            educationalLevel: course.level,
            timeRequired: `P${course.weeks}W`,
            teaches: course.gains,
            coursePrerequisites: course.prerequisites,
            provider: { '@id': `${SITE.url}/#organization` },
            audience: {
              '@type': 'EducationalAudience',
              audienceType: `${course.ageRange} çocuklar ve gençler`,
            },
            offers: {
              '@type': 'Offer',
              price: priceFor(PRICE_TIERS[0], course.weeks),
              priceCurrency: 'TRY',
              category: 'Paid',
              availability: 'https://schema.org/InStock',
              url: `${SITE.url}/fiyatlar`,
            },
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
              courseWorkload: `PT${course.lessonsPerWeek * course.lessonMinutes}M`,
              inLanguage: 'tr-TR',
              instructor: { '@type': 'Organization', name: 'Hype Academia' },
            },
          },
          breadcrumb([
            { name: 'Kurslar', path: '/kurslar' },
            { name: course.title, path: `/kurslar/${course.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: course.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : null,
  );

  if (!course) return <Navigate to="/kurslar" replace />;

  const next = course.nextCourseId ? courseById(course.nextCourseId) : undefined;
  const projects = projectsForCourse(course.id);
  const related = COURSES.filter(
    (c) => c.id !== course.id && c.ageMin <= course.ageMax && c.ageMax >= course.ageMin,
  ).slice(0, 3);

  return (
    <>
      {/* ─── Başlık ─────────────────────────────────────────────────────── */}
      <section className="relative bg-night-950 text-white overflow-hidden">

        <div className="container relative py-12 md:py-16">
          <Link
            to="/kurslar"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm kurslar
          </Link>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-14 items-start">
            {/* Sol: bilgi */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="badge bg-white/10 text-white border border-white/20">
                  <CourseIcon name={course.icon} className="w-3.5 h-3.5" />
                  {course.ageRange}
                </span>
                <span className="badge bg-white/10 text-white border border-white/20">
                  <Signal className="w-3.5 h-3.5" />
                  {course.level}
                </span>
                {course.tag && (
                  <span className="badge bg-electric-500 text-white">{course.tag}</span>
                )}
              </div>

              <h1 className="text-display-md text-white mb-5">{course.title}</h1>

              <p className="text-lg text-white/70 leading-relaxed max-w-2xl mb-8">{course.intro}</p>

              <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
                <span className="inline-flex items-center gap-2 text-white/80">
                  <Clock className="w-4 h-4 text-brick-400" />
                  {course.weeks} hafta · {totalLessons(course)} canlı ders
                </span>
                <span className="inline-flex items-center gap-2 text-white/80">
                  <Monitor className="w-4 h-4 text-brick-400" />
                  Haftada {course.lessonsPerWeek} ders × {course.lessonMinutes} dk
                </span>
                <span className="inline-flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4 text-brick-400" />
                  Maks. {course.maxStudents} öğrenci
                </span>
                <span className="inline-flex items-center gap-2 text-white/80">
                  <Star className="w-4 h-4 fill-brick-500 text-electric-500" />
                  {course.rating} · {course.students} öğrenci
                </span>
              </div>
            </div>

            {/* Sağ: fiyat kartı */}
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl overflow-hidden">
                <img
                  src={course.image}
                  alt={`${course.title} canlı ders ekranı — ${course.tools.slice(0, 2).join(' ve ')} kullanılıyor`}
                  width={1200}
                  height={800}
                  className="w-full aspect-[16/9] object-cover"
                />

                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-night-400 mb-3">
                    Paket seçenekleri
                  </div>

                  <div className="space-y-2 mb-5">
                    {TIERS.map((t) => {
                      const p = priceFor(t, course.weeks);
                      return (
                        <div
                          key={t.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                            t.popular
                              ? 'bg-electric-50 ring-brick-200'
                              : 'bg-white ring-night-100/70'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-night-950">{t.name}</span>
                              {t.popular && (
                                <span className="text-[10px] font-bold text-electric-500 uppercase">
                                  Popüler
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-night-400">
                              {classSizeLabel(t, course)} · {lessonLineFor(t, course)}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-night-950">{formatTRY(p)}</div>
                            <div className="text-[11px] text-night-400">
                              ders başı ~{formatTRY(perLesson(p, course.weeks))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Link to="/iletisim" className="btn-primary w-full mb-2">
                    Ücretsiz Deneme Dersi Al
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={waLink(
                      `Merhaba, "${course.title}" kursu hakkında bilgi almak istiyorum.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full btn-sm"
                  >
                    WhatsApp'tan sor
                  </a>

                  <p className="mt-4 text-xs text-night-400 text-center leading-relaxed">
                    Peşin ödemede %10 indirim · 9 taksite kadar faizsiz ·{' '}
                    <Link to="/fiyatlar" className="text-electric-500 hover:underline">
                      tüm ödeme planları
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Veliye not ─────────────────────────────────────────────────── */}
      <section className="bg-electric-50 border-b border-brick-100">
        <div className="container py-8">
          <div className="flex gap-4 max-w-4xl">
            <span className="w-10 h-10 rounded-xl bg-electric-500 text-white flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </span>
            <div>
              <div className="font-bold text-night-950 mb-1">Velilere not</div>
              <p className="text-night-600 leading-relaxed">{course.parentNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Kazanımlar ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-12">
            <div>
              <Reveal>
                <div className="eyebrow mb-4">
                  Kurs Sonunda
                </div>
                <h2 className="text-display-sm text-night-950 mb-8">
                  Çocuğunuz bu kursta ne kazanır?
                </h2>
              </Reveal>

              <ul className="grid sm:grid-cols-2 gap-4">
                {course.gains.map((g, i) => (
                  <Reveal as="li" key={g} delay={i * 50}>
                    <div className={`flex gap-3 h-full p-5 rounded-2xl ${GAIN_TINTS[i % GAIN_TINTS.length]}`}>
                      <CheckCircle2 className="w-5 h-5 text-electric-500 shrink-0 mt-0.5" />
                      <span className="text-night-600 leading-relaxed text-sm">{g}</span>
                    </div>
                  </Reveal>
                ))}
              </ul>

              {/* Bitirme projesi */}
              <Reveal className="mt-8">
                <div className="rounded-2xl bg-night-950 text-white p-6 md:p-8">
                  <div className="flex items-center gap-2 text-brick-400 mb-3">
                    <Trophy className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Bitirme Projesi
                    </span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{course.finalProject}</p>
                </div>
              </Reveal>
            </div>

            {/* Yan bilgi */}
            <div className="space-y-5">
              <Reveal>
                <div className="rounded-2xl bg-tint-sky p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-electric-500" />
                    <h3 className="text-sm font-bold text-night-950">Ön Koşullar</h3>
                  </div>
                  <p className="text-sm text-night-500 leading-relaxed">{course.prerequisites}</p>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="rounded-2xl bg-tint-lime p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-4 h-4 text-electric-500" />
                    <h3 className="text-sm font-bold text-night-950">Teknik Gereksinimler</h3>
                  </div>
                  <ul className="space-y-2">
                    {course.requirements.map((r) => (
                      <li key={r} className="flex gap-2 text-sm text-night-500 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-night-200 mt-2 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="rounded-2xl bg-tint-lilac p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-electric-500" />
                    <h3 className="text-sm font-bold text-night-950">Kullanılan Araçlar</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {course.tools.map((t) => (
                      <span key={t} className="badge-neutral">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Müfredat ───────────────────────────────────────────────────── */}
      <section className="section bg-white /70">
        <div className="container">
          <Reveal className="max-w-2xl mb-10">
            <div className="eyebrow mb-4">
              Haftalık Program
            </div>
            <h2 className="text-display-sm text-night-950 mb-4">
              {course.weeks} haftanın tamamı, hafta hafta
            </h2>
            <p className="text-lg text-night-500 leading-relaxed">
              Her hafta iki canlı ders işlenir ve haftanın sonunda öğrencinin elinde çalışan bir
              çıktı kalır. Aşağıdaki başlıklara tıklayarak detayları görebilirsiniz.
            </p>
          </Reveal>

          <div className="max-w-3xl space-y-3">
            {course.curriculum.map((w, i) => {
              const open = openWeek === w.week;
              return (
                <Reveal key={w.week} delay={i * 40}>
                  <div
                    className={`rounded-2xl bg-white border transition-all ${
                      open ? 'ring-brick-200' : 'ring-night-100/70'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setOpenWeek(open ? null : w.week);
                        if (!open) {
                          track('mufredat_haftasi_acildi', {
                            kurs: course.shortTitle,
                            hafta: w.week,
                          });
                        }
                      }}
                      className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
                      aria-expanded={open}
                    >
                      <span
                        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 transition-colors ${
                          open ? 'bg-electric-500 text-white' : 'bg-night-50 text-night-950'
                        }`}
                      >
                        <span className="text-[9px] font-medium uppercase leading-none opacity-70">
                          Hafta
                        </span>
                        <span className="text-base font-bold leading-none mt-0.5">{w.week}</span>
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-night-950">{w.title}</span>
                        {!open && (
                          <span className="block text-xs text-night-400 truncate mt-0.5">
                            {w.topics.length} konu · {w.project}
                          </span>
                        )}
                      </span>

                      <ChevronDown
                        className={`w-5 h-5 text-night-400 shrink-0 transition-transform ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {open && (
                      <div className="px-4 md:px-5 pb-5 pt-0">
                        <div>
                          <ul className="space-y-2 mb-4">
                            {w.topics.map((t) => (
                              <li key={t} className="flex gap-2.5 text-sm text-night-600">
                                <CheckCircle2 className="w-4 h-4 text-brick-400 shrink-0 mt-0.5" />
                                {t}
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2.5 items-start rounded-xl bg-night-50 bg-night-50 p-3.5">
                            <Sparkles className="w-4 h-4 text-night-800 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-night-900 mb-0.5">
                                Hafta sonunda elinde kalan
                              </div>
                              <div className="text-sm text-night-950">{w.project}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Bu kursun bitirme projesi ───────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <Reveal>
                <div className="bg-night-50 rounded overflow-hidden bg-night-50">
                  <img
                    src={projects[0].image}
                    alt={`${projects[0].title} — proje ekranı`}
                    loading="lazy"
                    decoding="async"
                    width={1000}
                    height={750}
                    className="w-full block"
                  />
                </div>
              </Reveal>

              <Reveal delay={100}>
                <p className="eyebrow mb-4">
                  Son Hafta
                </p>
                <h2 className="text-display-sm text-night-950 mb-4">
                  {projects[0].title}
                </h2>
                <p className="text-lg text-night-600 leading-relaxed mb-6">{projects[0].brief}</p>

                <div className="border-l-2 border-electric-500 pl-4 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-electric-500 mb-1.5">
                    Çözülmesi gereken problem
                  </p>
                  <p className="text-night-700 leading-relaxed">{projects[0].challenge}</p>
                </div>

                <ul className="flex flex-wrap gap-1.5 mb-8">
                  {projects[0].skills.map((sk) => (
                    <li key={sk} className="badge-neutral">
                      {sk}
                    </li>
                  ))}
                </ul>

                <Link to="/projeler" className="btn-ghost">
                  Diğer bitirme projeleri
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ─── Kursa özel SSS ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Reveal className="text-center mb-10">
              <h2 className="text-display-sm text-night-950">
                Bu kurs hakkında sık sorulanlar
              </h2>
            </Reveal>

            <div className="space-y-3">
              {course.faq.map((f, i) => (
                <Reveal key={f.q} delay={i * 60}>
                  <div className="rounded-2xl bg-night-50 p-6">
                    <h3 className="font-bold text-night-950 mb-2">{f.q}</h3>
                    <p className="text-night-500 leading-relaxed text-sm">{f.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/sss" className="btn-ghost">
                Tüm soruları gör
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sonraki adım ───────────────────────────────────────────────── */}
      {next && (
        <section className="pb-4">
          <div className="container">
            <Reveal>
              <div className="rounded-2xl bg-night-950 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-brick-400 mb-2">
                    Bu kurstan sonra
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">{next.title}</h2>
                  <p className="text-white/60">{next.summary}</p>
                </div>
                <Link to={`/kurslar/${next.slug}`} className="btn-primary shrink-0">
                  Programı incele
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── Benzer kurslar ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="text-2xl font-extrabold text-night-950 mb-8">
              {course.ageRange} için diğer kurslar
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c, i) => (
                <Reveal key={c.id} delay={i * 60}>
                  <CourseCard course={c} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Kapanış ────────────────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="container">
          <div className="panel p-8 md:p-10 text-center">
            <h2 className="text-2xl font-extrabold text-night-950 mb-3">
              Emin değil misiniz? Önce deneyin.
            </h2>
            <p className="text-night-500 mb-6 max-w-lg mx-auto">
              1 saatlik ücretsiz deneme dersinde çocuğunuz gerçek bir eğitmenle gerçek bir ders
              yapar. Kart bilgisi istemiyoruz, bağlayıcılığı yok.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/iletisim" className="btn-primary btn-lg">
                Ücretsiz Deneme Dersi Al
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href={`tel:${SITE.phoneIntl}`} className="btn-ghost btn-lg">
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
