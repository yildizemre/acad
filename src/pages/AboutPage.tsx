import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Mail, Target, Eye, CheckCircle2 } from 'lucide-react';
import { TEACHERS, VALUES, JOBS, PROCESS } from '../data/content';
import { SITE, STATS } from '../data/site';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta({
    title: 'Hakkımızda, Eğitmenlerimiz ve Sürecimiz | Hype Academia',
    description:
      'Gebze Teknik Üniversitesi bünyesinde 2020’de kurulan Hype Academia’nın misyonu, değerleri, eğitmen kadrosu ve kayıt süreci.',
  });

  return (
    <>
      {/* ─── Başlık ─────────────────────────────────────────────────────── */}
      <section className="bg-sand-50 border-b border-sand-300/70">
        <div className="container py-14 md:py-20">
          <Reveal className="max-w-3xl">
            <div className="eyebrow mb-4">
              <span className="rule" />
              {SITE.foundedYear}'den beri
            </div>
            <h1 className="text-display-md font-bold text-ink-950">
              Sanayiye yapay zeka çözümü üreten bir ekip,{' '}
              <span className="underline-electric">çocuklara ders veriyor</span>
            </h1>
            <p className="mt-5 text-lg text-lead-500 leading-relaxed">
              {SITE.name}, {SITE.foundedYear} yılında {SITE.parentInstitution} bünyesinde kuruldu.
              Kurucu ekibimiz bilgisayarla görü, derin öğrenme ve görüntü işleme alanlarında
              Türkiye'nin önde gelen sanayi kuruluşlarına çözüm geliştiriyor. Yıllar içinde
              edindiğimiz endüstriyel birikimi genç nesle aktarmak için bu akademiyi kurduk.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-10">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="bg-sand-50 rounded-lg border border-sand-300 p-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-3xl font-bold text-ink-950">{s.value}</span>
                    <span className="block text-sm text-lead-400 mt-1">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ─── Misyon & vizyon ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Reveal>
              <div className="card p-7 h-full">
                <span className="w-11 h-11 rounded border border-sand-400 text-ink-950 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-ink-950 mb-3">Misyonumuz</h2>
                <p className="text-lead-500 leading-relaxed">
                  Sektörel yetkinliği genç nesle aktarmak; problem çözen, yaratıcı ve özgüvenli
                  dijital liderler yetiştirmek.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card p-7 h-full">
                <span className="w-11 h-11 rounded border border-sand-400 text-ink-950 flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-ink-950 mb-3">Vizyonumuz</h2>
                <p className="text-lead-500 leading-relaxed">
                  Türkiye'yi teknoloji ihraç eden bir ülkeye dönüştürecek nesli yetiştirmek ve
                  ülkemizin global teknoloji ekosistemindeki payını artırmak.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-10">
            <div className="max-w-4xl mx-auto flex gap-3 rounded-lg bg-sand-200 border border-sand-300 p-5">
              <BadgeCheck className="w-5 h-5 text-ink-700 shrink-0 mt-0.5" />
              <p className="text-sm text-ink-950 leading-relaxed">
                Verdiğimiz tüm tamamlama sertifikaları Türkiye Cumhuriyeti E-Devlet sistemi
                üzerinden doğrulanabilmektedir.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Değerler ───────────────────────────────────────────────────── */}
      <section className="section bg-sand-50 border-y border-sand-300/70">
        <div className="container">
          <SectionHeading
            eyebrow="Değerlerimiz"
            title="Nasıl çalıştığımızı belirleyen beş ilke"
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="card p-6 h-full">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brick-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-ink-950 mb-1.5">{v.title}</h3>
                      <p className="text-sm text-lead-500 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Eğitmenler ─────────────────────────────────────────────────── */}
      <section id="egitmenler" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Kadro"
            title="Eğitmenlerimiz"
            subtitle="Tüm eğitmenlerimiz aktif olarak endüstride çalışan veya akademik kariyeri olan mühendislerdir. Teknik yetkinliği çocuk dostu bir öğrenme deneyimiyle buluşturuyorlar."
          />

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEACHERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <div className="card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt=""
                        loading="lazy"
                        className="w-12 h-12 rounded object-cover shrink-0"
                      />
                    ) : (
                      <span className="w-12 h-12 rounded bg-ink-950 text-sand-50 flex items-center justify-center font-semibold shrink-0">
                        {t.initials}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-ink-950">
                        {t.profile ? (
                          <a
                            href={t.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brick-600 transition-colors"
                          >
                            {t.name}
                          </a>
                        ) : (
                          t.name
                        )}
                      </div>
                      <div className="text-brick-600 text-xs font-semibold">{t.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-lead-500 leading-relaxed mb-3">{t.exp}</p>
                  <div className="text-xs text-lead-400">
                    Verdiği kurslar:{' '}
                    <span className="text-ink-950 font-medium">{t.courses}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Süreç ──────────────────────────────────────────────────────── */}
      <section id="surec" className="section bg-sand-50 border-y border-sand-300/70">
        <div className="container">
          <SectionHeading
            eyebrow="Nasıl Çalışır"
            title="Kayıttan sertifikaya, adım adım"
            subtitle="İlk iki adım tamamen ücretsizdir ve hiçbir bağlayıcılığı yoktur."
          />

          <div className="mt-12 max-w-3xl mx-auto space-y-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step.n} delay={i * 60}>
                <div className="card p-5 flex gap-4">
                  <span className="w-11 h-11 rounded-xl bg-brick-500 text-white flex items-center justify-center font-bold shrink-0">
                    {step.n}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-ink-950">{step.title}</h3>
                      <span className="badge-neutral">{step.duration}</span>
                    </div>
                    <p className="text-sm text-lead-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kariyer ────────────────────────────────────────────────────── */}
      <section id="kariyer" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Kariyer"
            title="Ekibimize katılmak ister misiniz?"
            subtitle="Genç nesle ilham vermek isteyen mühendisler ve eğitimciler arıyoruz."
          />

          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {JOBS.map((j, i) => (
              <Reveal key={j.pos} delay={i * 50}>
                <div className="card p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-ink-950">{j.pos}</h3>
                    <span className="badge bg-brick-50 text-brick-700 border border-brick-200">
                      {j.type}
                    </span>
                  </div>
                  <p className="text-sm text-lead-500 leading-relaxed">{j.detail}</p>
                </div>
              </Reveal>
            ))}

            <Reveal>
              <div className="panel p-6 flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
                <div className="flex items-center gap-3 flex-1">
                  <Mail className="w-5 h-5 text-brick-500 shrink-0" />
                  <p className="text-sm text-lead-600">
                    CV ve kısa bir tanıtım metnini{' '}
                    <a
                      href={`mailto:${SITE.emailCareer}`}
                      className="font-semibold text-ink-950 hover:text-brick-600 transition-colors"
                    >
                      {SITE.emailCareer}
                    </a>{' '}
                    adresine gönderin.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Kapanış ────────────────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="container">
          <div className="rounded-lg bg-ink-950 text-white p-8 md:p-12 text-center">
            <h2 className="text-display-sm font-bold text-white mb-4">
              Ekibimizle tanışmanın en iyi yolu bir ders yapmak
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
              1 saatlik ücretsiz deneme dersinde çocuğunuz eğitmenimizle gerçek bir ders yapar.
            </p>
            <Link to="/iletisim" className="btn-primary btn-lg">
              Ücretsiz deneme dersi al
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
