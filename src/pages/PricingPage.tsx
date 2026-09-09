import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  ArrowRight,
  Calculator,
  Info,
  ShieldCheck,
  Gift,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { COURSES } from '../data/courses';
import {
  TIERS,
  PATHS,
  PAYMENT_PLANS,
  DISCOUNTS,
  DISCOUNT_RULE,
  priceFor,
  courseExtraFor,
  totalFor,
  installmentsFor,
  planLine,
  classSizeLabel,
  lessonLineFor,
  pathInfo,
  formatTRY,
  perLesson,
} from '../data/pricing';
import { REFUND_POLICY, REFUND_NOTES } from '../data/content';
import { SITE } from '../data/site';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import { track } from '../lib/analytics';

/**
 * Kurs farkının nereden geldiğini tek satırda söyler. Rakamın açıklaması
 * yoksa veli onu keyfî bir zam gibi okuyor.
 */
const EXTRA_NOTES: Record<string, string> = {
  python: 'Geliştirme ortamı ve bireysel kod incelemesi',
  web: 'Alan adı ve barındırma — site yayında kalır',
  unity: '6 kişilik sınıf, 75 dakikalık ders',
  ai: 'Bulut işlem gücü, 6 kişilik sınıf, 75 dakikalık ders',
  robotics: 'Adrese gönderilen 30 parçalık Arduino seti',
};

function extraNote(courseId: string): string {
  return EXTRA_NOTES[courseId] ?? '';
}

export default function PricingPage() {
  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [tierId, setTierId] = useState(TIERS[1].id);
  const [planId, setPlanId] = useState('taksitli');

  usePageMeta({
    title: 'Çocuk Kodlama Kursu Fiyatları 2026 — Paketler ve Taksit | Hype Academia',
    description:
      'Kulüp, Atölye ve Birebir paket fiyatları, taksit seçenekleri, indirimler ve iade politikası. Hesaplayıcı ile ödeyeceğiniz tutarı anında görün.',
  });

  const course = COURSES.find((c) => c.id === courseId)!;
  const tier = TIERS.find((t) => t.id === tierId)!;
  const plan = PAYMENT_PLANS.find((p) => p.id === planId)!;

  const calc = useMemo(() => {
    const base = priceFor(tier, course);
    const total = totalFor(base, plan);
    return {
      base,
      extra: courseExtraFor(course),
      total,
      inst: installmentsFor(base, plan),
      diff: total - base,
    };
  }, [tier, course, plan]);

  // Seçim değiştikçe hangi kombinasyonların ilgi gördüğünü ölçüyoruz
  useEffect(() => {
    const t = window.setTimeout(
      () =>
        track('fiyat_hesaplandi', {
          kurs: course.shortTitle,
          paket: tier.name,
          plan: plan.name,
          tutar: calc.total,
        }),
      900,
    );
    return () => window.clearTimeout(t);
  }, [course, tier, plan, calc.total]);

  return (
    <>
      {/* ─── Başlık ─────────────────────────────────────────────────────── */}
      <section className="pt-10 md:pt-16">
        <div className="container">
          <Reveal className="text-center max-w-3xl mx-auto">
            <h1 className="text-display-md">
              Fiyatlarımız burada yazıyor. <span className="mark">Aramanıza gerek yok.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-night-600 leading-relaxed">
              Müfredat her pakette aynıdır — değişen tek şey çocuğunuza ayrılan eğitmen zamanıdır. Sınıf küçüldükçe fiyat artar, çünkü öğrenci başına düşen ilgi artar.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Paketler ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="3 Paket"
            title="Aynı müfredat, üç farklı yoğunluk"
            subtitle="Aşağıdaki fiyatlar 8 haftalık (16 ders) programın paket fiyatıdır. 10 haftalık Web ve Unity kursları kart üzerinde ayrıca yazılıdır. Bazı kurslar donanım, lisans veya daha küçük sınıf nedeniyle bu fiyatın üstüne kendi farkını ekler — hesaplayıcıda kalem kalem görürsünüz."
          />

          <div className="mt-12 grid lg:grid-cols-3 gap-6 items-start">
            {TIERS.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <div
                  className={`relative rounded-2xl p-7 h-full flex flex-col ${
                    t.popular
                      ? 'bg-night-950 text-white lg:-mt-4 lg:pb-11'
                      : 'bg-night-50'
                  }`}
                >
                  {t.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-marker">
                      En çok tercih edilen
                    </span>
                  )}

                  <h3
                    className={`text-2xl font-extrabold mb-1 ${t.popular ? 'text-white' : 'text-night-950'}`}
                  >
                    {t.name}
                  </h3>
                  <p className={`text-sm mb-6 ${t.popular ? 'text-night-300' : 'text-night-600'}`}>
                    {t.subtitle}
                  </p>

                  <div className="mb-1 flex items-baseline gap-1.5">
                    <span
                      className={`text-4xl font-bold ${t.popular ? 'text-white' : 'text-night-950'}`}
                    >
                      {formatTRY(t.price8)}
                    </span>
                  </div>
                  <p className={`text-xs mb-1 ${t.popular ? 'text-night-400' : 'text-night-600'}`}>
                    8 haftalık program · ders başı yaklaşık {formatTRY(perLesson(t.price8, 8))}
                  </p>
                  <p className={`text-xs mb-6 ${t.popular ? 'text-night-400' : 'text-night-600'}`}>
                    10 haftalık kurslar: {formatTRY(t.price10)}
                  </p>

                  <div
                    className={`rounded-xl p-3.5 mb-6 text-xs leading-relaxed ${
                      t.popular ? 'bg-white/10 text-white/70' : 'bg-white text-night-500'
                    }`}
                  >
                    <span className={t.popular ? 'text-white font-extrabold' : 'text-night-950 font-extrabold'}>
                      Kimler için:
                    </span>{' '}
                    {t.bestFor}
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 mb-6 text-xs ${
                      t.popular ? 'text-white/70' : 'text-night-500'
                    }`}
                  >
                    <span
                      className={t.popular ? 'badge bg-white/15 text-white' : 'badge-white'}
                    >
                      {classSizeLabel(t)}
                    </span>
                    <span
                      className={t.popular ? 'badge bg-white/15 text-white' : 'badge-white'}
                    >
                      {t.lessonLength}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            t.popular ? 'text-brick-400' : 'text-electric-500'
                          }`}
                        />
                        <span className={t.popular ? 'text-night-200' : 'text-night-700'}>{f}</span>
                      </li>
                    ))}
                    {t.missing?.map((m) => (
                      <li key={m} className="flex gap-2.5 text-sm">
                        <X
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            t.popular ? 'text-white/30' : 'text-night-300'
                          }`}
                        />
                        <span className={t.popular ? 'text-white/40' : 'text-night-400'}>{m}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2">
                    <Link
                      to="/iletisim"
                      className={`w-full ${t.popular ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      Ücretsiz deneme dersi
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/kayit?paket=${t.id}`}
                      className={`w-full btn-sm inline-flex items-center justify-center gap-1.5 font-semibold rounded-2xl transition-colors ${
                        t.popular
                          ? 'text-night-300 hover:text-white'
                          : 'text-night-600 hover:text-night-950'
                      }`}
                    >
                      Doğrudan kayıt olmak istiyorum
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="max-w-3xl mx-auto rounded-2xl bg-night-50 p-5">
              <p className="text-sm font-semibold text-night-950 mb-2">
                Ders süresi ve sınıf mevcudu kursa göre değişir
              </p>
              <ul className="space-y-1.5">
                {COURSES.map((c) => (
                  <li key={c.id} className="text-sm text-night-600 flex flex-wrap gap-x-2">
                    <span className="font-medium text-night-950">{c.shortTitle}:</span>
                    <span>
                      haftada {c.lessonsPerWeek} ders × {c.lessonMinutes} dk · sınıf en fazla{' '}
                      {c.maxStudents} kişi
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-night-500 leading-relaxed">
                Paketin sınıf sınırı ile kursun sınırı farklıysa düşük olan geçerlidir.
                Örneğin Unity kursunda Kulüp paketi 8 değil 6 kişiliktir.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-6">
            <div className="flex gap-3 max-w-3xl mx-auto rounded-2xl bg-night-50 bg-night-50 p-5">
              <Info className="w-5 h-5 text-night-700 shrink-0 mt-0.5" />
              <p className="text-sm text-night-950 leading-relaxed">
                <strong>Her pakete dahil:</strong> ders kayıtlarına 12 ay erişim, E-Devlet onaylı
                sertifika, öğrenci paneli, aylık veli raporu ve Arduino kursundaki donanım seti.
                Sonradan çıkan hiçbir ek ücret yoktur.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Hesaplayıcı ────────────────────────────────────────────────── */}
      <section id="hesaplayici" className="section">
        <div className="container">
          <div className="rounded-3xl bg-tint-sky p-6 md:p-12">
          <SectionHeading
            eyebrow="Hesaplayıcı"
            title="Tam olarak ne ödeyeceğinizi görün"
            subtitle="Kursu, paketi ve ödeme planını seçin; toplam tutar ve aylık ödeme anında hesaplansın."
          />

          <div className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 max-w-5xl mx-auto">
            {/* Seçimler */}
            <div className="space-y-7">
              <div>
                <label className="block text-sm font-extrabold text-night-950 mb-3">1. Kurs</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {COURSES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCourseId(c.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                        courseId === c.id
                          ? 'bg-night-950 border-night-950 text-white'
                          : 'bg-white border-night-200 text-night-800 hover:border-night-950'
                      }`}
                    >
                      <span className="block">{c.shortTitle}</span>
                      <span
                        className={`block text-xs ${courseId === c.id ? 'text-night-300' : 'text-night-500'}`}
                      >
                        {c.weeks} hafta · {c.ageRange}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-night-950 mb-3">2. Paket</label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {TIERS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTierId(t.id)}
                      className={`px-4 py-3 rounded-xl text-sm transition-all border ${
                        tierId === t.id
                          ? 'bg-night-950 border-night-950 text-white'
                          : 'bg-white border-night-200 text-night-800 hover:border-night-950'
                      }`}
                    >
                      <span className="block">{t.name}</span>
                      <span
                        className={`block text-xs ${tierId === t.id ? 'text-night-300' : 'text-night-500'}`}
                      >
                        {classSizeLabel(t, course)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-night-950 mb-3">
                  3. Ödeme planı
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {PAYMENT_PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                        planId === p.id
                          ? 'bg-night-950 border-night-950 text-white'
                          : 'bg-white border-night-200 text-night-800 hover:border-night-950'
                      }`}
                    >
                      <span className="block">{p.name}</span>
                      {p.badge && (
                        <span
                          className={`block text-xs ${planId === p.id ? 'text-night-300' : 'text-night-500'}`}
                        >
                          {p.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sonuç */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-white rounded-2xl p-6 text-night-600">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-9 h-9 rounded-full bg-marker flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-night-950" />
                  </span>
                  <span className="font-extrabold text-night-950">Özet</span>
                </div>

                <dl className="space-y-2.5 text-sm pb-5">
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-400">Kurs</dt>
                    <dd className="font-medium text-night-950 text-right">{course.shortTitle}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-400">Süre</dt>
                    <dd className="font-medium text-night-950 text-right">
                      {course.weeks} hafta · {course.weeks * course.lessonsPerWeek} ders
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-400">Paket</dt>
                    <dd className="font-medium text-night-950 text-right">{tier.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-400">Sınıf</dt>
                    <dd className="font-medium text-night-950 text-right">
                      {classSizeLabel(tier, course)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-400">Ders</dt>
                    <dd className="font-medium text-night-950 text-right">
                      {lessonLineFor(tier, course)}
                    </dd>
                  </div>
                  {calc.extra > 0 && (
                    <>
                      <div className="flex justify-between gap-3">
                        <dt className="text-night-400">Paket fiyatı</dt>
                        <dd className="font-medium text-night-950 text-right">
                          {formatTRY(calc.base - calc.extra)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-night-400">
                          Kurs farkı
                          <span className="block text-xs text-night-400/80">{extraNote(course.id)}</span>
                        </dt>
                        <dd className="font-medium text-night-950 text-right">
                          +{formatTRY(calc.extra)}
                        </dd>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-400">Liste fiyatı</dt>
                    <dd className="font-medium text-night-950 text-right">
                      {formatTRY(calc.base)}
                    </dd>
                  </div>
                  {calc.diff !== 0 && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-night-400">
                        {calc.diff < 0 ? 'İndirim' : 'Vade farkı'}
                      </dt>
                      <dd
                        className={`font-semibold text-right ${
                          calc.diff < 0 ? 'text-night-800' : 'text-electric-500'
                        }`}
                      >
                        {calc.diff < 0 ? '−' : '+'}
                        {formatTRY(Math.abs(calc.diff))}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="my-5 rounded-2xl bg-electric-500 text-white p-5">
                  <div className="text-sm font-semibold text-white/80 mb-1">
                    Toplam ödeyeceğiniz
                  </div>
                  <div className="text-4xl font-extrabold text-white">{formatTRY(calc.total)}</div>
                  {plan.installments > 1 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 badge bg-white/20 text-white">
                      <CreditCard className="w-3 h-3" />
                      {planLine(plan, calc.base)}
                    </div>
                  )}
                  <div className="mt-3 text-sm text-white/80">
                    Ders başına yaklaşık {formatTRY(perLesson(calc.total, course.weeks))}
                  </div>
                </div>

                <p className="py-4 text-xs text-night-500 leading-relaxed">{plan.description}</p>
                {plan.note && (
                  <p className="text-xs text-night-400 leading-relaxed pb-4">{plan.note}</p>
                )}

                <Link
                  to={`/kayit?kurs=${course.id}&paket=${tier.id}&plan=${plan.id}`}
                  className="btn-primary w-full"
                >
                  Bu planla kayıt olalım
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-3 text-[11px] text-night-400 text-center leading-relaxed">
                  Önce ücretsiz deneme dersi yapıyoruz. Kayıt öncesi hiçbir ödeme alınmaz.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ─── Patikalar ──────────────────────────────────────────────────── */}
      <section id="patikalar" className="section scroll-mt-32">
        <div className="container">
          <SectionHeading
            eyebrow="Paket Avantajı"
            title="İki kursu birlikte alın, daha az ödeyin"
            subtitle="Birbirini tamamlayan kursları yıllık patika olarak aldığınızda indirim otomatik uygulanır."
          />

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PATHS.map((p, i) => {
              const info = pathInfo(p);
              return (
              <Reveal key={p.id} delay={i * 80}>
                <div className="card p-6 h-full flex flex-col">
                  <span className="badge-neutral self-start mb-4">{p.ageRange}</span>
                  <h3 className="text-xl font-extrabold text-night-950 mb-1">{p.name}</h3>
                  <p className="text-xs text-night-400 mb-4">{info.duration}</p>
                  <p className="text-sm text-night-500 leading-relaxed mb-5 flex-1">{p.outcome}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.courseIds.map((id) => {
                      const c = COURSES.find((x) => x.id === id);
                      return c ? (
                        <span key={id} className="badge-neutral">
                          {c.shortTitle}
                        </span>
                      ) : null;
                    })}
                  </div>

                  <div className="pt-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-extrabold text-night-950">{formatTRY(p.price)}</span>
                      <span className="text-sm text-night-400 line-through">
                        {formatTRY(info.listPrice)}
                      </span>
                    </div>
                    <div className="text-xs text-night-800 font-semibold">
                      {formatTRY(info.save)} tasarruf
                    </div>
                    <p className="mt-3 text-xs text-night-500 leading-relaxed">
                      Karşılaştırma fiyatı, bu iki kursun Kulüp paketinde tek tek alınması
                      hâlinde ödenecek tutardır. Kapsam aynıdır.
                    </p>
                  </div>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Ödeme planları ─────────────────────────────────────────────── */}
      <section id="odeme" className="section bg-white /70">
        <div className="container">
          <SectionHeading
            eyebrow="Ödeme"
            title="Ödeme planları"
            subtitle="Bütçenize uyan planı seçin. 9 taksite kadar vade farkı yoktur."
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAYMENT_PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <div className="card p-5 h-full">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-night-950">{p.name}</h3>
                    {p.badge && (
                      <span
                        className={`badge shrink-0 ${
                          p.multiplier < 1
                            ? 'bg-night-50 text-night-900 border border-night-200'
                            : p.multiplier > 1
                              ? 'bg-night-50 text-electric-600 border border-night-200'
                              : 'bg-night-50 text-night-600'
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-night-500 leading-relaxed">{p.description}</p>
                  {p.note && <p className="mt-2 text-xs text-night-400">{p.note}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── İndirimler ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="İndirimler"
            title="Fiyatı düşüren yollar"
            subtitle="Hangi indirimin size uyduğundan emin değilseniz kayıt görüşmesinde birlikte hesaplıyoruz."
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISCOUNTS.map((d, i) => (
              <Reveal key={d.name} delay={i * 50}>
                <div className="card p-5 h-full">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-night-950">{d.name}</h3>
                    <span className="badge bg-electric-50 text-electric-600 border border-brick-200 shrink-0">
                      <Gift className="w-3 h-3" />
                      {d.amount}
                    </span>
                  </div>
                  <p className="text-sm text-night-500 leading-relaxed mb-3">{d.detail}</p>
                  {d.stackable && (
                    <span className="text-[11px] font-semibold text-night-800">
                      ✓ Diğer indirimlerle birleşir
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="flex gap-3 max-w-3xl mx-auto rounded-2xl bg-night-50 bg-night-50 p-5">
              <AlertCircle className="w-5 h-5 text-electric-500 shrink-0 mt-0.5" />
              <p className="text-sm text-night-950 leading-relaxed">{DISCOUNT_RULE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── İade politikası ────────────────────────────────────────────── */}
      <section id="iade" className="section bg-white /70">
        <div className="container">
          <SectionHeading
            eyebrow="Güvence"
            title="İptal ve iade politikası"
            subtitle="Beğenmezseniz paranızı geri alırsınız. Bunu yazılı olarak taahhüt ediyoruz."
          />

          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {REFUND_POLICY.map((r, i) => (
              <Reveal key={r.title} delay={i * 60}>
                <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-night-950 mb-1">{r.title}</h3>
                    <p className="text-sm text-night-500 leading-relaxed">{r.detail}</p>
                  </div>
                  <span
                    className={`badge shrink-0 self-start sm:self-center ${
                      r.positive
                        ? 'bg-night-50 text-night-900 border border-night-200'
                        : 'bg-night-50 text-night-600'
                    }`}
                  >
                    {r.positive && <ShieldCheck className="w-3 h-3" />}
                    {r.result}
                  </span>
                </div>
              </Reveal>
            ))}

            <div className="pt-6 mt-4 grid sm:grid-cols-3 gap-5">
              {REFUND_NOTES.map((n) => (
                <div key={n.title}>
                  <p className="text-sm font-semibold text-night-950 mb-1.5">{n.title}</p>
                  <p className="text-xs text-night-600 leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Kapanış ────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="rounded-2xl bg-night-950 text-white p-8 md:p-12 text-center">
            <h2 className="text-display-sm text-white mb-4">
              Hangi paketin uygun olduğundan emin değil misiniz?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              15 dakikalık ücretsiz danışma görüşmesinde çocuğunuzun seviyesini ve hedefini
              konuşup birlikte karar veriyoruz. Satış baskısı yok.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/iletisim" className="btn-primary btn-lg">
                Ücretsiz görüşme planla
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href={`tel:${SITE.phoneIntl}`} className="btn-outline btn-lg">
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
