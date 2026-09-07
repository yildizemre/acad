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
  totalFor,
  installmentFor,
  formatTRY,
  perLesson,
} from '../data/pricing';
import { REFUND_POLICY, REFUND_NOTE } from '../data/content';
import { SITE } from '../data/site';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import { track } from '../lib/analytics';

export default function PricingPage() {
  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [tierId, setTierId] = useState(TIERS[1].id);
  const [planId, setPlanId] = useState('taksit6');

  usePageMeta({
    title: 'Fiyatlar, Paketler ve Ödeme Planları | Hype Academia',
    description:
      'Kulüp, Atölye ve Birebir paket fiyatları, taksit seçenekleri, indirimler ve iade politikası. Hesaplayıcı ile ödeyeceğiniz tutarı anında görün.',
  });

  const course = COURSES.find((c) => c.id === courseId)!;
  const tier = TIERS.find((t) => t.id === tierId)!;
  const plan = PAYMENT_PLANS.find((p) => p.id === planId)!;

  const calc = useMemo(() => {
    const base = priceFor(tier, course.weeks);
    const total = totalFor(base, plan);
    const monthly = installmentFor(base, plan);
    return { base, total, monthly, diff: total - base };
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
      <section className="bg-sand-50 border-b border-sand-300/70">
        <div className="container py-14 md:py-20">
          <Reveal className="max-w-3xl">
            <div className="eyebrow mb-4">
              <span className="rule" />
              Şeffaf Fiyatlandırma
            </div>
            <h1 className="text-display-md font-bold text-ink-950">
              Fiyatlarımız burada yazıyor. <span className="underline-electric">Aramanıza gerek yok.</span>
            </h1>
            <p className="mt-5 text-lg text-lead-500 leading-relaxed">
              Müfredat her pakette aynıdır — değişen tek şey çocuğunuza ayrılan eğitmen zamanıdır.
              Sınıf küçüldükçe fiyat artar, çünkü öğrenci başına düşen ilgi artar.
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
            subtitle="Aşağıdaki fiyatlar 8 haftalık (16 ders) programlar içindir. 10 haftalık Web ve Unity kursları için fiyatlar kart üzerinde ayrıca belirtilmiştir."
          />

          <div className="mt-12 grid lg:grid-cols-3 gap-6 items-start">
            {TIERS.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <div
                  className={`relative rounded-lg p-7 h-full flex flex-col ${
                    t.popular
                      ? 'bg-ink-950 text-white lg:-mt-4 lg:pb-11'
                      : 'bg-sand-50 border border-sand-300'
                  }`}
                >
                  {t.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-brick-500 text-white">
                      En çok tercih edilen
                    </span>
                  )}

                  <h3
                    className={`text-2xl font-bold mb-1 ${t.popular ? 'text-white' : 'text-ink-950'}`}
                  >
                    {t.name}
                  </h3>
                  <p className={`text-sm mb-6 ${t.popular ? 'text-white/60' : 'text-lead-500'}`}>
                    {t.subtitle}
                  </p>

                  <div className="mb-1 flex items-baseline gap-1.5">
                    <span
                      className={`text-4xl font-bold ${t.popular ? 'text-white' : 'text-ink-950'}`}
                    >
                      {formatTRY(t.price8)}
                    </span>
                  </div>
                  <p className={`text-xs mb-1 ${t.popular ? 'text-white/50' : 'text-lead-400'}`}>
                    8 haftalık program · ders başı {formatTRY(perLesson(t.price8, 8))}
                  </p>
                  <p className={`text-xs mb-6 ${t.popular ? 'text-white/50' : 'text-lead-400'}`}>
                    10 haftalık kurslar: {formatTRY(t.price10)}
                  </p>

                  <div
                    className={`rounded-xl p-3.5 mb-6 text-xs leading-relaxed ${
                      t.popular ? 'bg-sand-50/10 text-white/70' : 'bg-sand-50 text-lead-500'
                    }`}
                  >
                    <span className={t.popular ? 'text-white font-semibold' : 'text-ink-950 font-semibold'}>
                      Kimler için:
                    </span>{' '}
                    {t.bestFor}
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 mb-6 text-xs ${
                      t.popular ? 'text-white/70' : 'text-lead-500'
                    }`}
                  >
                    <span
                      className={`badge ${t.popular ? 'bg-sand-50/10 text-white' : 'bg-sand-200 text-lead-600'}`}
                    >
                      {t.classSize}
                    </span>
                    <span
                      className={`badge ${t.popular ? 'bg-sand-50/10 text-white' : 'bg-sand-200 text-lead-600'}`}
                    >
                      {t.lessonLength}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            t.popular ? 'text-brick-400' : 'text-brick-500'
                          }`}
                        />
                        <span className={t.popular ? 'text-white/80' : 'text-lead-600'}>{f}</span>
                      </li>
                    ))}
                    {t.missing?.map((m) => (
                      <li key={m} className="flex gap-2.5 text-sm">
                        <X
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            t.popular ? 'text-white/25' : 'text-lead-300'
                          }`}
                        />
                        <span className={t.popular ? 'text-white/35' : 'text-lead-400'}>{m}</span>
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
                      className={`w-full btn-sm inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-colors ${
                        t.popular
                          ? 'text-sand-300 hover:text-sand-50'
                          : 'text-lead-600 hover:text-ink-950'
                      }`}
                    >
                      Doğrudan kayıt olmak istiyorum
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="flex gap-3 max-w-3xl mx-auto rounded-lg bg-sand-200 border border-sand-300 p-5">
              <Info className="w-5 h-5 text-ink-700 shrink-0 mt-0.5" />
              <p className="text-sm text-ink-950 leading-relaxed">
                <strong>Her pakete dahil:</strong> ders kayıtlarına 12 ay erişim, E-Devlet onaylı
                sertifika, öğrenci paneli, aylık veli raporu ve Arduino kursundaki donanım seti.
                Sonradan çıkan hiçbir ek ücret yoktur.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Hesaplayıcı ────────────────────────────────────────────────── */}
      <section id="hesaplayici" className="section bg-ink-950 text-white">
        <div className="container">
          <SectionHeading
            eyebrow="Hesaplayıcı"
            title="Tam olarak ne ödeyeceğinizi görün"
            subtitle="Kursu, paketi ve ödeme planını seçin; toplam tutar ve aylık ödeme anında hesaplansın."
            tone="dark"
          />

          <div className="mt-12 grid lg:grid-cols-[1fr_380px] gap-8 max-w-5xl mx-auto">
            {/* Seçimler */}
            <div className="space-y-7">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">1. Kurs</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {COURSES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCourseId(c.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                        courseId === c.id
                          ? 'bg-brick-500 ring-brick-500 text-white font-semibold'
                          : 'bg-sand-50/5 ring-white/10 text-white/70 hover:bg-sand-50/10'
                      }`}
                    >
                      <span className="block">{c.shortTitle}</span>
                      <span
                        className={`block text-xs ${courseId === c.id ? 'text-white/80' : 'text-white/40'}`}
                      >
                        {c.weeks} hafta · {c.ageRange}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">2. Paket</label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {TIERS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTierId(t.id)}
                      className={`px-4 py-3 rounded-xl text-sm transition-all border ${
                        tierId === t.id
                          ? 'bg-brick-500 ring-brick-500 text-white font-semibold'
                          : 'bg-sand-50/5 ring-white/10 text-white/70 hover:bg-sand-50/10'
                      }`}
                    >
                      <span className="block">{t.name}</span>
                      <span
                        className={`block text-xs ${tierId === t.id ? 'text-white/80' : 'text-white/40'}`}
                      >
                        {t.classSize}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  3. Ödeme planı
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {PAYMENT_PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                        planId === p.id
                          ? 'bg-brick-500 ring-brick-500 text-white font-semibold'
                          : 'bg-sand-50/5 ring-white/10 text-white/70 hover:bg-sand-50/10'
                      }`}
                    >
                      <span className="block">{p.name}</span>
                      {p.badge && (
                        <span
                          className={`block text-xs ${planId === p.id ? 'text-white/80' : 'text-white/40'}`}
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
              <div className="bg-sand-50 rounded-lg p-6 text-lead-600">
                <div className="flex items-center gap-2 text-brick-600 mb-5">
                  <Calculator className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Özet</span>
                </div>

                <dl className="space-y-2.5 text-sm pb-5 border-b border-sand-200">
                  <div className="flex justify-between gap-3">
                    <dt className="text-lead-400">Kurs</dt>
                    <dd className="font-medium text-ink-950 text-right">{course.shortTitle}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-lead-400">Süre</dt>
                    <dd className="font-medium text-ink-950 text-right">
                      {course.weeks} hafta · {course.weeks * course.lessonsPerWeek} ders
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-lead-400">Paket</dt>
                    <dd className="font-medium text-ink-950 text-right">{tier.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-lead-400">Liste fiyatı</dt>
                    <dd className="font-medium text-ink-950 text-right">
                      {formatTRY(calc.base)}
                    </dd>
                  </div>
                  {calc.diff !== 0 && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-lead-400">
                        {calc.diff < 0 ? 'İndirim' : 'Vade farkı'}
                      </dt>
                      <dd
                        className={`font-semibold text-right ${
                          calc.diff < 0 ? 'text-ink-800' : 'text-brick-600'
                        }`}
                      >
                        {calc.diff < 0 ? '−' : '+'}
                        {formatTRY(Math.abs(calc.diff))}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="py-5 border-b border-sand-200">
                  <div className="text-xs text-lead-400 mb-1">Toplam ödeyeceğiniz</div>
                  <div className="text-3xl font-bold text-ink-950">{formatTRY(calc.total)}</div>
                  {plan.installments > 1 && (
                    <div className="mt-2 inline-flex items-center gap-1.5 badge bg-brick-50 text-brick-700 border border-brick-200">
                      <CreditCard className="w-3 h-3" />
                      {plan.installments} × {formatTRY(calc.monthly)}
                    </div>
                  )}
                  <div className="mt-3 text-xs text-lead-400">
                    Ders başına {formatTRY(perLesson(calc.total, course.weeks))}
                  </div>
                </div>

                <p className="py-4 text-xs text-lead-500 leading-relaxed">{plan.description}</p>
                {plan.note && (
                  <p className="text-xs text-lead-400 leading-relaxed pb-4">{plan.note}</p>
                )}

                <Link
                  to={`/kayit?kurs=${course.id}&paket=${tier.id}&plan=${plan.id}`}
                  className="btn-primary w-full"
                >
                  Bu planla kayıt olalım
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-3 text-[11px] text-lead-400 text-center leading-relaxed">
                  Önce ücretsiz deneme dersi yapıyoruz. Kayıt öncesi hiçbir ödeme alınmaz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Patikalar ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Paket Avantajı"
            title="İki kursu birlikte alın, daha az ödeyin"
            subtitle="Birbirini tamamlayan kursları yıllık patika olarak aldığınızda indirim otomatik uygulanır."
          />

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PATHS.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div className="card p-6 h-full flex flex-col">
                  <span className="badge-neutral self-start mb-4">{p.ageRange}</span>
                  <h3 className="text-xl font-bold text-ink-950 mb-1">{p.name}</h3>
                  <p className="text-xs text-lead-400 mb-4">{p.duration}</p>
                  <p className="text-sm text-lead-500 leading-relaxed mb-5 flex-1">{p.outcome}</p>

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

                  <div className="pt-5 border-t border-sand-200">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-ink-950">{formatTRY(p.price)}</span>
                      <span className="text-sm text-lead-400 line-through">
                        {formatTRY(p.listPrice)}
                      </span>
                    </div>
                    <div className="text-xs text-ink-800 font-semibold">
                      {formatTRY(p.listPrice - p.price)} tasarruf
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ödeme planları ─────────────────────────────────────────────── */}
      <section id="odeme" className="section bg-sand-50 border-y border-sand-300/70">
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
                    <h3 className="font-bold text-ink-950">{p.name}</h3>
                    {p.badge && (
                      <span
                        className={`badge shrink-0 ${
                          p.multiplier < 1
                            ? 'bg-sand-200 text-ink-900 border border-sand-400'
                            : p.multiplier > 1
                              ? 'bg-sand-200 text-brick-700 border border-sand-400'
                              : 'bg-sand-200 text-lead-600'
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-lead-500 leading-relaxed">{p.description}</p>
                  {p.note && <p className="mt-2 text-xs text-lead-400">{p.note}</p>}
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
                    <h3 className="font-bold text-ink-950">{d.name}</h3>
                    <span className="badge bg-brick-50 text-brick-700 border border-brick-200 shrink-0">
                      <Gift className="w-3 h-3" />
                      {d.amount}
                    </span>
                  </div>
                  <p className="text-sm text-lead-500 leading-relaxed mb-3">{d.detail}</p>
                  {d.stackable && (
                    <span className="text-[11px] font-semibold text-ink-800">
                      ✓ Diğer indirimlerle birleşir
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="flex gap-3 max-w-3xl mx-auto rounded-lg bg-sand-200 border border-sand-300 p-5">
              <AlertCircle className="w-5 h-5 text-brick-600 shrink-0 mt-0.5" />
              <p className="text-sm text-ink-950 leading-relaxed">{DISCOUNT_RULE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── İade politikası ────────────────────────────────────────────── */}
      <section id="iade" className="section bg-sand-50 border-y border-sand-300/70">
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
                    <h3 className="font-bold text-ink-950 mb-1">{r.title}</h3>
                    <p className="text-sm text-lead-500 leading-relaxed">{r.detail}</p>
                  </div>
                  <span
                    className={`badge shrink-0 self-start sm:self-center ${
                      r.positive
                        ? 'bg-sand-200 text-ink-900 border border-sand-400'
                        : 'bg-sand-200 text-lead-600'
                    }`}
                  >
                    {r.positive && <ShieldCheck className="w-3 h-3" />}
                    {r.result}
                  </span>
                </div>
              </Reveal>
            ))}

            <p className="pt-4 text-xs text-lead-400 leading-relaxed text-center">{REFUND_NOTE}</p>
          </div>
        </div>
      </section>

      {/* ─── Kapanış ────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="rounded-lg bg-ink-950 text-white p-8 md:p-12 text-center">
            <h2 className="text-display-sm font-bold text-white mb-4">
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
