import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Mail,
  Target,
  Eye,
  ShieldCheck,
  Lock,
  Building2,
} from 'lucide-react';
import { TEACHERS, VALUES, JOBS, PROCESS } from '../data/content';
import { SITE, STATS } from '../data/site';
import { SELLER, BRAND, PAYMENT_PROVIDER, sellerName, sellerRows } from '../data/legal-entity';
import { COMMITMENTS } from '../data/testimonials';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import VideoWall from '../components/ui/VideoWall';
import PaymentBadges from '../components/ui/PaymentBadges';
import usePageMeta from '../hooks/usePageMeta';

/** Rakam kutularının rengi — sırayla döner, ana sayfadaki şeritle aynı dil. */
const NUM_TINT = ['bg-marker', 'bg-tint-sky', 'bg-tint-rose', 'bg-tint-peach'];

/** Değer kartlarının zemini — her kart farklı renk. */
const VALUE_TINT = [
  'bg-tint-peach',
  'bg-tint-sky',
  'bg-tint-lime',
  'bg-tint-lilac',
  'bg-tint-mint',
  'bg-tint-rose',
];

/** Eğitmen kartındaki baş harf kutusunun rengi. */
const AVATAR_TINT = [
  'bg-tint-sky',
  'bg-tint-peach',
  'bg-tint-lilac',
  'bg-tint-mint',
  'bg-tint-rose',
  'bg-tint-lime',
];

export default function AboutPage() {
  usePageMeta({
    title: 'Hakkımızda, Eğitmenlerimiz ve Sürecimiz | Hype Academia',
    description:
      'Gebze Teknik Üniversitesi bünyesinde 2020’de kurulan Hype Academia’nın misyonu, değerleri, eğitmen kadrosu, kayıt süreci ve satıcı bilgileri.',
  });

  return (
    <>
      {/* ─── Başlık ─────────────────────────────────────────────────────── */}
      <section className="pt-10 md:pt-16">
        <div className="container">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow justify-center mb-6">
              {SITE.foundedYear}&apos;den beri &middot; {SITE.parentInstitution} bünyesinde
            </p>
            <h1 className="text-display-md">
              Sanayiye yapay zeka çözümü üreten bir ekip,{' '}
              <span className="mark">çocuklara ders veriyor</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-night-600 md:text-xl">
              {SITE.name}, {SITE.foundedYear} yılında {SITE.parentInstitution} bünyesinde kuruldu.
              Kurucu ekibimiz bilgisayarla görü, derin öğrenme ve görüntü işleme alanlarında
              Türkiye&apos;nin önde gelen sanayi kuruluşlarına çözüm geliştiriyor. Yıllar içinde
              edindiğimiz endüstriyel birikimi genç nesle aktarmak için bu akademiyi kurduk.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/iletisim" className="btn-primary">
                Ücretsiz deneme dersi al
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#kurumsal" className="btn-ghost">
                Satıcı bilgileri
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Rakamlar ───────────────────────────────────────────────────── */}
      <section className="pt-14 md:pt-20">
        <div className="container">
          <Reveal>
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {STATS.map((s, i) => (
                <div key={s.label} className="text-center">
                  <dd
                    className={`mark-num text-3xl font-extrabold text-night-950 md:text-4xl ${
                      NUM_TINT[i % NUM_TINT.length]
                    }`}
                  >
                    {s.value}
                  </dd>
                  <dt className="mt-3 text-sm font-bold text-night-900">{s.label}</dt>
                  {s.note && (
                    <p className="mt-1 text-xs leading-snug text-night-500">{s.note}</p>
                  )}
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ─── Öğrencilerimizin işleri ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Ne ürettiğimize bakın"
            title={
              <>
                Anlattıklarımızın karşılığı <span className="mark">ekranda görünür</span>
              </>
            }
            subtitle="Aşağıdakiler tanıtım için çekilmiş görüntüler değil; öğrencilerimizin kendi bilgisayarlarından alınmış ekran kayıtları."
          />
          <Reveal className="mt-12">
            <div className="mx-auto max-w-4xl rounded-3xl bg-night-950 p-2 shadow-lift md:p-3">
              <VideoWall variant="compact" />
            </div>
          </Reveal>
          <Reveal className="mt-8 text-center">
            <Link to="/projeler" className="btn-ghost">
              Dokuz kaydın hepsini izle
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── Misyon & vizyon ────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl bg-tint-sky p-8 md:p-10">
                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-night-950">
                  <Target className="h-5 w-5" />
                </span>
                <h2 className="mb-3 text-2xl font-extrabold text-night-950">Misyonumuz</h2>
                <p className="text-lg leading-relaxed text-night-700">
                  Sektörel yetkinliği genç nesle aktarmak; problem çözen, yaratıcı ve özgüvenli
                  dijital liderler yetiştirmek.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex h-full flex-col rounded-3xl bg-tint-lilac p-8 md:p-10">
                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-night-950">
                  <Eye className="h-5 w-5" />
                </span>
                <h2 className="mb-3 text-2xl font-extrabold text-night-950">Vizyonumuz</h2>
                <p className="text-lg leading-relaxed text-night-700">
                  Türkiye&apos;yi teknoloji ihraç eden bir ülkeye dönüştürecek nesli yetiştirmek
                  ve ülkemizin global teknoloji ekosistemindeki payını artırmak.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-5">
            <div className="mx-auto flex max-w-5xl items-start gap-4 rounded-3xl bg-marker p-6 md:p-7">
              <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-night-950" />
              <p className="font-bold leading-relaxed text-night-950">
                Verdiğimiz tüm tamamlama sertifikaları Türkiye Cumhuriyeti E-Devlet sistemi
                üzerinden doğrulanabilmektedir.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Değerler ───────────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="Değerlerimiz"
            title={
              <>
                Nasıl çalıştığımızı belirleyen <span className="mark">beş ilke</span>
              </>
            }
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div
                  className={`flex h-full flex-col rounded-3xl p-7 ${
                    VALUE_TINT[i % VALUE_TINT.length]
                  }`}
                >
                  <span className="mb-5 font-mono text-sm font-bold text-night-950/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mb-2.5 text-xl font-extrabold text-night-950">{v.title}</h3>
                  <p className="leading-relaxed text-night-700">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Yazılı taahhütler ─────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="Söz veriyoruz"
            title={
              <>
                Reklam cümlesi değil, <span className="mark">yazılı taahhüt</span>
              </>
            }
            subtitle="Aşağıdakilerin hepsi sözleşmede yazılıdır ve tutulmadığında iade hakkınız doğar."
          />

          <Reveal className="mt-12">
            <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
              {COMMITMENTS.map((c) => (
                <li key={c.n} className="rounded-3xl bg-night-50 p-6">
                  <div className="mb-2 flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-electric-500" />
                    <h3 className="font-extrabold text-night-950">{c.title}</h3>
                  </div>
                  <p className="leading-relaxed text-night-600">{c.detail}</p>
                  {c.proofTo && c.proofLabel && (
                    <Link
                      to={c.proofTo}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500"
                    >
                      {c.proofLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ─── Eğitmenler ─────────────────────────────────────────────────── */}
      <section id="egitmenler" className="section scroll-mt-32 pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="Kadro"
            title={
              <>
                Dersi <span className="mark">mühendisler</span> veriyor
              </>
            }
            subtitle="Tüm eğitmenlerimiz aktif olarak endüstride çalışan veya akademik kariyeri olan mühendislerdir. Teknik yetkinliği çocuk dostu bir öğrenme deneyimiyle buluşturuyorlar."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TEACHERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <div className="flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-night-100">
                  <div className="mb-5 flex items-center gap-4">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt=""
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-night-950 ${
                          AVATAR_TINT[i % AVATAR_TINT.length]
                        }`}
                      >
                        {t.initials}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-extrabold text-night-950">
                        {t.profile ? (
                          <a
                            href={t.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-electric-500"
                          >
                            {t.name}
                          </a>
                        ) : (
                          t.name
                        )}
                      </div>
                      <div className="text-sm font-semibold text-night-500">{t.title}</div>
                    </div>
                  </div>

                  <p className="mb-5 leading-relaxed text-night-600">{t.exp}</p>

                  <div className="mt-auto border-t border-night-100 pt-4 text-xs text-night-400">
                    Verdiği kurslar:{' '}
                    <span className="font-bold text-night-950">{t.courses}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Süreç ──────────────────────────────────────────────────────── */}
      <section id="surec" className="section scroll-mt-32 pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="Nasıl Çalışır"
            title={
              <>
                Kayıttan sertifikaya, <span className="mark">adım adım</span>
              </>
            }
            subtitle="İlk iki adım tamamen ücretsizdir ve hiçbir bağlayıcılığı yoktur."
          />

          <div className="mx-auto mt-12 max-w-3xl">
            {PROCESS.map((step, i) => (
              <Reveal key={step.n} delay={i * 60}>
                <div className="relative flex gap-5 pb-8 last:pb-0">
                  {/* Adımları birbirine bağlayan çizgi */}
                  {i < PROCESS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-6 top-14 bottom-2 w-0.5 bg-night-100"
                    />
                  )}
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-night-950 font-extrabold text-white">
                    {step.n}
                  </span>
                  <div className="flex-1 rounded-3xl bg-night-50 p-6">
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-extrabold text-night-950">{step.title}</h3>
                      <span className="badge-white">{step.duration}</span>
                    </div>
                    <p className="leading-relaxed text-night-600">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kurumsal kimlik ───────────────────────────────────────────── */}
      <section id="kurumsal" className="section scroll-mt-32 pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="Kurumsal Kimlik"
            title={
              <>
                Kim satıyor, <span className="mark">kime ödeme yapıyorsunuz?</span>
              </>
            }
            subtitle={`${BRAND.name}, ${SELLER.shortName} bünyesinde faaliyet gösteren bir eğitim markasıdır. Sitede yaptığınız satın almalarda satıcı ve fatura kesen taraf ${sellerName}'dır. Bunu saklamıyoruz; ödeme yaptığınız kurumu bilmeniz gerektiğini düşünüyoruz.`}
          />

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_340px] [&>*]:min-w-0">
            {/* Satıcı bilgileri */}
            <Reveal>
              <div className="h-full min-w-0 rounded-3xl bg-white p-6 ring-1 ring-night-100 md:p-8">
                <p className="mb-5 flex items-center gap-2 text-sm font-bold text-night-400">
                  <Building2 className="h-4 w-4" />
                  Satıcı bilgileri
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[300px] border-collapse text-left text-sm">
                    <tbody className="divide-y divide-night-100">
                      {sellerRows().map(([k, v]) => (
                        <tr key={k} className="align-top">
                          <th
                            scope="row"
                            className="w-1/3 whitespace-nowrap py-3 pr-6 font-medium text-night-500"
                          >
                            {k}
                          </th>
                          <td className="py-3 font-semibold text-night-950">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    ['Mesafeli Satış Sözleşmesi', '/yasal/mesafeli-satis-sozlesmesi'],
                    ['Ön Bilgilendirme Formu', '/yasal/on-bilgilendirme-formu'],
                    ['Teslimat ve İade Şartları', '/yasal/teslimat-ve-iade'],
                    ['Gizlilik Politikası', '/yasal/gizlilik'],
                    ['KVKK Aydınlatma Metni', '/yasal/kvkk'],
                  ].map(([label, to]) => (
                    <Link
                      key={to}
                      to={to}
                      className="badge-neutral transition-colors hover:bg-night-950 hover:text-white"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Ödeme güvenliği */}
            <Reveal delay={100}>
              <div className="flex h-full flex-col rounded-3xl bg-tint-mint p-7 md:p-8">
                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-night-950">
                  <Lock className="h-5 w-5" />
                </span>
                <h3 className="mb-3 text-xl font-extrabold text-night-950">Ödeme güvenliği</h3>
                <p className="mb-6 leading-relaxed text-night-700">
                  Ödemeler {PAYMENT_PROVIDER.legalName} altyapısı üzerinden 3D Secure
                  doğrulamasıyla alınır. Kart bilgileriniz ödeme sağlayıcısının kendi güvenli
                  alanında girilir, bizim sunucularımıza hiç ulaşmaz. Site SSL sertifikasıyla
                  şifrelenmiş bağlantı üzerinden yayınlanır.
                </p>
                <PaymentBadges className="mt-auto" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Kariyer ────────────────────────────────────────────────────── */}
      <section id="kariyer" className="section scroll-mt-32 pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="Kariyer"
            title={
              <>
                Ekibimize <span className="mark">katılmak</span> ister misiniz?
              </>
            }
            subtitle="Genç nesle ilham vermek isteyen mühendisler ve eğitimciler arıyoruz."
          />

          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {JOBS.map((j, i) => (
              <Reveal key={j.pos} delay={i * 50}>
                <div className="rounded-3xl bg-white p-6 ring-1 ring-night-100">
                  <div className="mb-2 flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-extrabold text-night-950">{j.pos}</h3>
                    <span className="badge-neutral">{j.type}</span>
                  </div>
                  <p className="leading-relaxed text-night-600">{j.detail}</p>
                </div>
              </Reveal>
            ))}

            <Reveal>
              <div className="mt-6 flex items-center gap-4 rounded-3xl bg-night-50 p-6">
                <Mail className="h-5 w-5 shrink-0 text-electric-500" />
                <p className="text-night-600">
                  CV ve kısa bir tanıtım metnini{' '}
                  <a
                    href={`mailto:${SITE.emailCareer}`}
                    className="font-bold text-night-950 underline decoration-2 underline-offset-4 transition-colors hover:text-electric-500"
                  >
                    {SITE.emailCareer}
                  </a>{' '}
                  adresine gönderin.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Kapanış ────────────────────────────────────────────────────── */}
      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="overflow-hidden rounded-3xl bg-night-950 p-8 text-center text-white md:p-14">
            <h2 className="text-display-sm text-white">
              Ekibimizle tanışmanın en iyi yolu <span className="mark text-night-950">bir ders yapmak</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-night-300">
              1 saatlik ücretsiz deneme dersinde çocuğunuz eğitmenimizle gerçek bir ders yapar.
              Kart bilgisi istemiyoruz, bağlayıcılığı yok.
            </p>
            <Link to="/iletisim" className="btn-primary btn-lg mt-9 bg-white text-night-950 hover:bg-night-100">
              Ücretsiz deneme dersi al
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
