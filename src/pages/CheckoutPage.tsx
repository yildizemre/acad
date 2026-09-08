import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, MessageCircle, ShieldCheck, Info } from 'lucide-react';
import { COURSES } from '../data/courses';
import {
  TIERS,
  PAYMENT_PLANS,
  priceFor,
  totalFor,
  installmentsFor,
  installmentLabel,
  classSizeLabel,
  lessonLineFor,
  formatTRY,
  perLesson,
} from '../data/pricing';
import { waLink, SITE } from '../data/site';
import { track } from '../lib/analytics';
import usePageMeta from '../hooks/usePageMeta';
import { PAYMENT_ONLINE } from '../lib/payment';
import { PAYMENT_PROVIDER } from '../data/legal-entity';

/**
 * Kayıt özeti sayfası. Kullanıcı kurs + paket + ödeme planını seçer, tam tutarı
 * görür ve tek adımda kayda geçer.
 *
 * Online ödeme sağlayıcısı bağlanana kadar (bkz. docs/ODEME-ENTEGRASYONU.md)
 * siparişi eksiksiz biçimde WhatsApp'a aktarır — böylece kayıt görüşmesinde
 * hiçbir bilgi tekrar sorulmaz.
 */
export default function CheckoutPage() {
  const [params] = useSearchParams();
  const [courseId, setCourseId] = useState(params.get('kurs') ?? COURSES[0].id);
  const [tierId, setTierId] = useState(params.get('paket') ?? TIERS[1].id);
  const [planId, setPlanId] = useState(params.get('plan') ?? 'taksit6');
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);

  usePageMeta({
    title: 'Kayıt Özeti | Hype Academia',
    description: 'Seçtiğiniz kurs, paket ve ödeme planının toplam tutarını görün ve kayda geçin.',
  });

  const course = COURSES.find((c) => c.id === courseId) ?? COURSES[0];
  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[1];
  const plan = PAYMENT_PLANS.find((p) => p.id === planId) ?? PAYMENT_PLANS[2];

  const calc = useMemo(() => {
    const base = priceFor(tier, course);
    const total = totalFor(base, plan);
    return { base, total, inst: installmentsFor(base, plan), diff: total - base };
  }, [tier, course, plan]);

  const orderMessage =
    `Merhaba, kayıt olmak istiyorum.\n\n` +
    `Kurs: ${course.title}\n` +
    `Süre: ${course.weeks} hafta · ${course.weeks * course.lessonsPerWeek} ders\n` +
    `Paket: ${tier.name} (${classSizeLabel(tier, course)})
` +
    `Ders: ${lessonLineFor(tier, course)}
` +
    `Ödeme planı: ${plan.name}\n` +
    `Toplam: ${formatTRY(calc.total)}` +
    (calc.inst.count > 1 ? ` (${installmentLabel(calc.inst)})` : '');

  const Choice = ({
    active,
    onClick,
    title,
    sub,
  }: {
    active: boolean;
    onClick: () => void;
    title: string;
    sub: string;
  }) => (
    <button
      onClick={onClick}
      className={`text-left px-4 py-3 rounded border transition-colors ${
        active
          ? 'border-night-950 bg-night-950 text-white'
          : 'border-night-200 hover:border-night-950 text-night-950'
      }`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className={`block text-xs mt-0.5 ${active ? 'text-night-300' : 'text-night-500'}`}>
        {sub}
      </span>
    </button>
  );

  return (
    <section className="section">
      <div className="container">
        <Link
          to="/fiyatlar"
          className="inline-flex items-center gap-1.5 text-sm text-night-500 hover:text-night-950 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Fiyatlar
        </Link>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-12 items-start">
          {/* Seçimler */}
          <div>
            <p className="eyebrow mb-4">
              Kayıt Özeti
            </p>
            <h1 className="text-display-md text-night-950 mb-10">
              Seçiminizi onaylayın
            </h1>

            <div className="space-y-9">
              <div>
                <h2 className="text-lg font-extrabold text-night-950 mb-4">
                  <span className="font-mono text-xs text-night-400 mr-3">01</span>
                  Kurs
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {COURSES.map((c) => (
                    <Choice
                      key={c.id}
                      active={courseId === c.id}
                      onClick={() => setCourseId(c.id)}
                      title={c.shortTitle}
                      sub={`${c.ageRange} · ${c.weeks} hafta`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-night-950 mb-4">
                  <span className="font-mono text-xs text-night-400 mr-3">02</span>
                  Paket
                </h2>
                <div className="grid sm:grid-cols-3 gap-2">
                  {TIERS.map((t) => (
                    <Choice
                      key={t.id}
                      active={tierId === t.id}
                      onClick={() => setTierId(t.id)}
                      title={t.name}
                      sub={classSizeLabel(t, course)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-night-950 mb-4">
                  <span className="font-mono text-xs text-night-400 mr-3">03</span>
                  Ödeme planı
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {PAYMENT_PLANS.map((p) => (
                    <Choice
                      key={p.id}
                      active={planId === p.id}
                      onClick={() => setPlanId(p.id)}
                      title={p.name}
                      sub={p.badge ?? ''}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Özet */}
          <aside className="lg:sticky lg:top-28 border border-night-950 rounded-2xl p-6 bg-white">
            <h2 className="text-lg font-extrabold text-night-950 mb-5">Sipariş özeti</h2>

            <dl className="space-y-2.5 text-sm pb-5">
              {[
                ['Kurs', course.shortTitle],
                ['Süre', `${course.weeks} hafta · ${course.weeks * course.lessonsPerWeek} ders`],
                ['Paket', `${tier.name} · ${classSizeLabel(tier, course)}`],
                ['Ders', lessonLineFor(tier, course)],
                ['Liste fiyatı', formatTRY(calc.base)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-night-500">{k}</dt>
                  <dd className="font-medium text-night-950 text-right">{v}</dd>
                </div>
              ))}
              {calc.diff !== 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-night-500">{calc.diff < 0 ? 'İndirim' : 'Vade farkı'}</dt>
                  <dd className="font-semibold text-electric-500 text-right">
                    {calc.diff < 0 ? '−' : '+'}
                    {formatTRY(Math.abs(calc.diff))}
                  </dd>
                </div>
              )}
            </dl>

            <div className="py-5">
              <div className="text-xs text-night-500 mb-1">Toplam</div>
              <div className="text-3xl font-extrabold text-night-950">
                {formatTRY(calc.total)}
              </div>
              {calc.inst.count > 1 && (
                <div className="mt-2 text-sm text-night-600">
                  {installmentLabel(calc.inst)}
                </div>
              )}
              <div className="mt-2 text-xs text-night-500">
                Ders başına yaklaşık {formatTRY(perLesson(calc.total, course.weeks))}
              </div>
            </div>

            {/* Ön bilgilendirme ve sözleşme onayı — mesafeli satış mevzuatı gereği */}
            <div className="pt-5">
              <label className="flex gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sozlesmeOnay}
                  onChange={(e) => setSozlesmeOnay(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#1B18FF]"
                />
                <span className="text-xs text-night-600 leading-relaxed">
                  <Link
                    to="/yasal/on-bilgilendirme-formu"
                    className="text-night-950 underline hover:text-electric-500"
                  >
                    Ön Bilgilendirme Formu
                  </Link>{' '}
                  ve{' '}
                  <Link
                    to="/yasal/mesafeli-satis-sozlesmesi"
                    className="text-night-950 underline hover:text-electric-500"
                  >
                    Mesafeli Satış Sözleşmesi
                  </Link>
                  ’ni okudum, onaylıyorum.
                </span>
              </label>
            </div>

            <div className="pt-4 space-y-3">
              {PAYMENT_ONLINE ? (
                <button className="btn-primary w-full" disabled={!sozlesmeOnay}>
                  Ödemeye geç
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href={waLink(orderMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track('whatsapp_tiklandi', {
                      source: 'kayit_ozeti',
                      kurs: course.shortTitle,
                      paket: tier.name,
                      tutar: calc.total,
                    })
                  }
                  className={`btn-primary w-full ${
                    sozlesmeOnay ? '' : 'pointer-events-none opacity-45'
                  }`}
                  aria-disabled={!sozlesmeOnay}
                >
                  <MessageCircle className="w-4 h-4" />
                  Bu seçimle kayda geç
                </a>
              )}

              <Link to="/iletisim" className="btn-ghost w-full btn-sm">
                Önce ücretsiz deneme dersi
              </Link>
            </div>

            <div className="mt-5 space-y-2.5 text-xs text-night-600">
              <p className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-night-950 shrink-0" />
                İlk 2 ders içinde koşulsuz iade
              </p>
              <p className="flex gap-2">
                <Info className="w-4 h-4 text-night-950 shrink-0" />
                Seçiminiz WhatsApp mesajına yazılı gelir; kayıt görüşmesinde tekrar
                anlatmanız gerekmez.
              </p>
            </div>

            <div className="mt-5 pt-5">
              <img
                src="/odeme/kart-logolari.svg"
                alt="Kabul edilen ödeme yöntemleri: iyzico ile Öde, Mastercard, Visa, American Express, Troy"
                width={429}
                height={32}
                className="h-6 w-auto mb-3"
              />
              <p className="text-xs text-night-500 leading-relaxed">
                {PAYMENT_PROVIDER.note} Bağlantı SSL sertifikasıyla şifrelenir.
              </p>
              <p className="mt-3 text-xs text-night-500">Soru için {SITE.phoneDisplay}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
