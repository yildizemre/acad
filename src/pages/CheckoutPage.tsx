import { useState, useMemo, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Info,
  Lock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
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
import {
  PAYMENT_ONLINE,
  odemeTokenIste,
  type OdemeAlicisi,
  type TokenYaniti,
} from '../lib/payment';
import { PAYMENT_PROVIDER } from '../data/legal-entity';
import PaytrFrame from '../components/PaytrFrame';
import PaymentBadges from '../components/ui/PaymentBadges';

/**
 * Kayıt sayfası. Üç adım:
 *
 *   01 seçim  — kurs, paket, ödeme planı
 *   02 bilgi  — veli ve öğrenci bilgileri, sözleşme onayı
 *   03 ödeme  — PayTR ödeme formu (iframe)
 *
 * Tutar tarayıcıdan sunucuya GÖNDERİLMEZ; sunucu aynı fiyat verisinden kendisi
 * hesaplar (netlify/functions/paytr-token.mts). Buradaki tutar yalnızca
 * gösterim içindir.
 *
 * Online ödeme kapalıysa veya seçilen plan online tahsile uygun değilse
 * (Aylık Esnek) akış WhatsApp'a düşer — sipariş özeti mesaja yazılı gelir.
 */

type Adim = 'secim' | 'bilgi' | 'odeme';

const BOS_ALICI: OdemeAlicisi = {
  adSoyad: '',
  email: '',
  telefon: '',
  adres: '',
  ogrenciAdi: '',
  ogrenciYasi: '',
  not: '',
};

/**
 * Seçim düğmesi ve form alanı.
 *
 * ⚠️ Bu iki bileşen bilerek MODÜL seviyesinde duruyor. CheckoutPage'in içinde
 *    tanımlanırlarsa her render'da yeni bir bileşen TÜRÜ oluşur; React eski
 *    ağacı söküp yenisini kurar ve girdi alanı her tuş vuruşunda odağı
 *    kaybeder — form fiilen kullanılamaz hâle gelir.
 */
function Choice({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
        active
          ? 'border-night-950 bg-night-950 text-white'
          : 'border-night-200 text-night-950 hover:border-night-950'
      }`}
    >
      <span className="block text-sm font-bold">{title}</span>
      <span className={`mt-0.5 block text-xs ${active ? 'text-night-300' : 'text-night-500'}`}>
        {sub}
      </span>
    </button>
  );
}

const GIRDI =
  'w-full rounded-2xl border-2 border-night-200 px-4 py-3 text-night-950 outline-none ' +
  'transition-colors placeholder:text-night-300 focus:border-night-950';

function Alan({
  ad,
  etiket,
  deger,
  onDegis,
  tip = 'text',
  ipucu,
  zorunlu = true,
  genis = false,
}: {
  ad: keyof OdemeAlicisi;
  etiket: string;
  deger: string;
  onDegis: (alan: keyof OdemeAlicisi, deger: string) => void;
  tip?: string;
  ipucu?: string;
  zorunlu?: boolean;
  genis?: boolean;
}) {
  return (
    <label className={genis ? 'sm:col-span-2' : ''}>
      <span className="mb-1.5 block text-sm font-bold text-night-950">
        {etiket}
        {!zorunlu && <span className="ml-1.5 font-normal text-night-400">(isteğe bağlı)</span>}
      </span>
      {tip === 'textarea' ? (
        <textarea
          name={ad}
          required={zorunlu}
          rows={3}
          value={deger}
          onChange={(e) => onDegis(ad, e.target.value)}
          placeholder={ipucu}
          className={GIRDI}
        />
      ) : (
        <input
          name={ad}
          type={tip}
          required={zorunlu}
          value={deger}
          onChange={(e) => onDegis(ad, e.target.value)}
          placeholder={ipucu}
          className={GIRDI}
        />
      )}
    </label>
  );
}

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const [courseId, setCourseId] = useState(params.get('kurs') ?? COURSES[0].id);
  const [tierId, setTierId] = useState(params.get('paket') ?? TIERS[1].id);
  const [planId, setPlanId] = useState(params.get('plan') ?? 'taksit6');

  const [adim, setAdim] = useState<Adim>('secim');
  const [alici, setAlici] = useState<OdemeAlicisi>(BOS_ALICI);
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [odeme, setOdeme] = useState<TokenYaniti | null>(null);

  usePageMeta({
    title: 'Kayıt ve Ödeme | Hype Academia',
    description:
      'Seçtiğiniz kurs, paket ve ödeme planının toplam tutarını görün, güvenli ödeme ile kaydınızı tamamlayın.',
  });

  const course = COURSES.find((c) => c.id === courseId) ?? COURSES[0];
  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[1];
  const plan = PAYMENT_PLANS.find((p) => p.id === planId) ?? PAYMENT_PLANS[2];

  const calc = useMemo(() => {
    const base = priceFor(tier, course);
    const total = totalFor(base, plan);
    return { base, total, inst: installmentsFor(base, plan), diff: total - base };
  }, [tier, course, plan]);

  /** Bu seçim online tahsil edilebilir mi? */
  const onlineMumkun = PAYMENT_ONLINE && plan.onlineOdeme !== false;

  const orderMessage =
    `Merhaba, kayıt olmak istiyorum.\n\n` +
    `Kurs: ${course.title}\n` +
    `Süre: ${course.weeks} hafta · ${course.weeks * course.lessonsPerWeek} ders\n` +
    `Paket: ${tier.name} (${classSizeLabel(tier, course)})\n` +
    `Ders: ${lessonLineFor(tier, course)}\n` +
    `Ödeme planı: ${plan.name}\n` +
    `Toplam: ${formatTRY(calc.total)}` +
    (calc.inst.count > 1 ? ` (${installmentLabel(calc.inst)})` : '');

  function alanDegis(alan: keyof OdemeAlicisi, deger: string) {
    setAlici((o) => ({ ...o, [alan]: deger }));
  }

  async function odemeyeGec(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);

    try {
      const yanit = await odemeTokenIste({
        ...alici,
        kursId: course.id,
        paketId: tier.id,
        planId: plan.id,
        sozlesmeOnay,
      });
      setOdeme(yanit);
      setAdim('odeme');
      track('odeme_baslatildi', {
        kurs: course.shortTitle,
        paket: tier.name,
        plan: plan.name,
        tutar: yanit.tutar,
      });
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.');
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <Link
          to="/fiyatlar"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-night-500 transition-colors hover:text-night-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Fiyatlar
        </Link>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* ─── Sol: adımlar ─────────────────────────────────────────────── */}
          <div>
            <p className="eyebrow mb-4">Kayıt</p>
            <h1 className="mb-10 text-display-md text-night-950">
              {adim === 'odeme' ? 'Ödemenizi tamamlayın' : 'Seçiminizi onaylayın'}
            </h1>

            {/* ── 01 · 02 · 03 adım göstergesi ── */}
            <ol className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              {(
                [
                  ['secim', '01', 'Seçim'],
                  ['bilgi', '02', 'Bilgiler'],
                  ['odeme', '03', 'Ödeme'],
                ] as const
              ).map(([id, no, ad], i) => {
                const sira = ['secim', 'bilgi', 'odeme'].indexOf(adim);
                const gecildi = i < sira;
                const aktif = id === adim;
                return (
                  <li key={id} className="flex items-center gap-3">
                    {i > 0 && <span className="h-px w-6 bg-night-200" aria-hidden="true" />}
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-bold ${
                        aktif
                          ? 'bg-night-950 text-white'
                          : gecildi
                            ? 'bg-marker text-night-950'
                            : 'bg-night-50 text-night-400'
                      }`}
                    >
                      <span className="font-mono text-xs">{no}</span>
                      {ad}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* ── ADIM 01 — seçim ── */}
            {adim === 'secim' && (
              <div className="space-y-9">
                <div>
                  <h2 className="mb-4 text-lg font-extrabold text-night-950">Kurs</h2>
                  <div className="grid gap-2 sm:grid-cols-2">
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
                  <h2 className="mb-4 text-lg font-extrabold text-night-950">Paket</h2>
                  <div className="grid gap-2 sm:grid-cols-3">
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
                  <h2 className="mb-4 text-lg font-extrabold text-night-950">Ödeme planı</h2>
                  <div className="grid gap-2 sm:grid-cols-2">
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
                  <p className="mt-3 text-xs leading-relaxed text-night-500">
                    {plan.description}
                    {plan.note && <> {plan.note}</>}
                  </p>
                </div>
              </div>
            )}

            {/* ── ADIM 02 — bilgiler ── */}
            {adim === 'bilgi' && (
              <form onSubmit={odemeyeGec} className="space-y-8">
                <div>
                  <h2 className="mb-1.5 text-lg font-extrabold text-night-950">
                    Fatura ve iletişim bilgileri
                  </h2>
                  <p className="mb-5 text-sm leading-relaxed text-night-500">
                    Bu bilgiler faturanın kesilmesi ve kayıt görüşmesi için gereklidir. Kart
                    bilgileriniz bir sonraki adımda {PAYMENT_PROVIDER.name} ekranında girilir;
                    bizim sunucumuza hiç ulaşmaz.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Alan ad="adSoyad" deger={alici.adSoyad} onDegis={alanDegis} etiket="Veli adı soyadı" ipucu="Ad Soyad" />
                    <Alan ad="email" deger={alici.email} onDegis={alanDegis} etiket="E-posta" tip="email" ipucu="ornek@eposta.com" />
                    <Alan ad="telefon" deger={alici.telefon} onDegis={alanDegis} etiket="Telefon" tip="tel" ipucu="05xx xxx xx xx" />
                    <Alan ad="ogrenciAdi" deger={alici.ogrenciAdi} onDegis={alanDegis} etiket="Öğrencinin adı" ipucu="Ad Soyad" />
                    <Alan ad="ogrenciYasi" deger={alici.ogrenciYasi} onDegis={alanDegis} etiket="Öğrencinin yaşı" ipucu="11" />
                    <div className="hidden sm:block" />
                    <Alan
                      ad="adres"
                      deger={alici.adres}
                      onDegis={alanDegis}
                      etiket="Fatura adresi"
                      tip="textarea"
                      ipucu="Mahalle, cadde, no, ilçe / il"
                      genis
                    />
                    <Alan
                      ad="not"
                      deger={alici.not}
                      onDegis={alanDegis}
                      etiket="Eklemek istediğiniz not"
                      tip="textarea"
                      ipucu="Ders saati tercihi, çocuğunuzun daha önce yaptıkları…"
                      zorunlu={false}
                      genis
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer gap-3 rounded-2xl bg-night-50 p-5">
                  <input
                    type="checkbox"
                    checked={sozlesmeOnay}
                    onChange={(e) => setSozlesmeOnay(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#1B18FF]"
                  />
                  <span className="text-sm leading-relaxed text-night-600">
                    <Link
                      to="/yasal/on-bilgilendirme-formu"
                      target="_blank"
                      className="font-bold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500"
                    >
                      Ön Bilgilendirme Formu
                    </Link>{' '}
                    ve{' '}
                    <Link
                      to="/yasal/mesafeli-satis-sozlesmesi"
                      target="_blank"
                      className="font-bold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500"
                    >
                      Mesafeli Satış Sözleşmesi
                    </Link>
                    ’ni okudum, onaylıyorum.
                  </span>
                </label>

                {hata && (
                  <p className="flex items-start gap-3 rounded-2xl bg-tint-rose p-5 text-sm leading-relaxed text-night-900">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    {hata}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setAdim('secim')}
                    className="btn-ghost"
                    disabled={gonderiliyor}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Seçime dön
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={gonderiliyor}>
                    {gonderiliyor ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Ödeme formu hazırlanıyor…
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Güvenli ödemeye geç · {formatTRY(calc.total)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ── ADIM 03 — ödeme formu ── */}
            {adim === 'odeme' && odeme && (
              <div className="space-y-5">
                {odeme.testModu && (
                  <p className="flex items-start gap-3 rounded-2xl bg-marker p-5 text-sm font-bold leading-relaxed text-night-950">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    TEST MODU — bu ekrandan gerçek tahsilat yapılmaz. Canlıya geçmek için
                    Netlify ortam değişkenlerinde PAYTR_TEST_MODE=0 yapın.
                  </p>
                )}

                <p className="text-sm leading-relaxed text-night-500">
                  Sipariş no <span className="font-mono text-night-950">{odeme.siparisNo}</span> ·
                  Tutar <span className="font-bold text-night-950">{formatTRY(odeme.tutar)}</span>
                </p>

                <PaytrFrame token={odeme.token} />

                <p className="text-xs leading-relaxed text-night-500">
                  Taksitli ödemelerde bankanızın uyguladığı vade farkı yukarıdaki ekranda
                  gösterilir ve toplam tutara yansır. Kart bilgileriniz {PAYMENT_PROVIDER.name}
                  ’nin güvenli alanında girilir, {SITE.name} sunucularına iletilmez.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setOdeme(null);
                    setAdim('bilgi');
                  }}
                  className="btn-ghost btn-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Bilgileri düzelt
                </button>
              </div>
            )}
          </div>

          {/* ─── Sağ: sipariş özeti ───────────────────────────────────────── */}
          <aside className="rounded-3xl bg-white p-6 ring-2 ring-night-950 lg:sticky lg:top-28">
            <h2 className="mb-5 text-lg font-extrabold text-night-950">Sipariş özeti</h2>

            <dl className="space-y-2.5 pb-5 text-sm">
              {[
                ['Kurs', course.shortTitle],
                ['Süre', `${course.weeks} hafta · ${course.weeks * course.lessonsPerWeek} ders`],
                ['Paket', `${tier.name} · ${classSizeLabel(tier, course)}`],
                ['Ders', lessonLineFor(tier, course)],
                ['Liste fiyatı', formatTRY(calc.base)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-night-500">{k}</dt>
                  <dd className="text-right font-medium text-night-950">{v}</dd>
                </div>
              ))}
              {calc.diff !== 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-night-500">{calc.diff < 0 ? 'İndirim' : 'Vade farkı'}</dt>
                  <dd className="text-right font-semibold text-electric-500">
                    {calc.diff < 0 ? '−' : '+'}
                    {formatTRY(Math.abs(calc.diff))}
                  </dd>
                </div>
              )}
            </dl>

            <div className="border-t border-night-100 py-5">
              <div className="mb-1 text-xs text-night-500">Toplam</div>
              <div className="text-3xl font-extrabold text-night-950">
                {formatTRY(calc.total)}
              </div>
              {calc.inst.count > 1 && (
                <div className="mt-2 text-sm text-night-600">{installmentLabel(calc.inst)}</div>
              )}
              <div className="mt-2 text-xs text-night-500">
                Ders başına yaklaşık {formatTRY(perLesson(calc.total, course.weeks))}
              </div>
            </div>

            {/* Eylem — hangi yolun açık olduğuna göre değişir */}
            {adim === 'secim' && (
              <div className="space-y-3 border-t border-night-100 pt-5">
                {onlineMumkun ? (
                  <button onClick={() => setAdim('bilgi')} className="btn-primary w-full">
                    Devam et
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <>
                    {PAYMENT_ONLINE && plan.onlineOdeme === false && (
                      <p className="rounded-2xl bg-tint-peach p-4 text-xs leading-relaxed text-night-800">
                        <span className="font-bold">{plan.name}</span> planı ay ay ödendiği için
                        tek seferde kartla tahsil edilemiyor. Bu planda kaydı telefonla
                        açıyoruz — diğer planlarda online ödeme kullanılabilir.
                      </p>
                    )}
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
                      className="btn-primary w-full"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Bu seçimle kayda geç
                    </a>
                  </>
                )}

                <Link to="/iletisim" className="btn-ghost btn-sm w-full">
                  Önce ücretsiz deneme dersi
                </Link>
              </div>
            )}

            <div className="mt-5 space-y-2.5 border-t border-night-100 pt-5 text-xs text-night-600">
              <p className="flex gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-night-950" />
                İlk 2 ders içinde koşulsuz iade
              </p>
              <p className="flex gap-2">
                <Info className="h-4 w-4 shrink-0 text-night-950" />
                Ödeme sonrası kayıt ekibimiz 1 iş günü içinde ders saatinizi belirlemek için
                arar.
              </p>
            </div>

            <div className="mt-5 border-t border-night-100 pt-5">
              <PaymentBadges className="mb-3" />
              <p className="text-xs leading-relaxed text-night-500">
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
