import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Map,
  Scale,
  HeartHandshake,
  Cpu,
  Clock,
  MessageCircle,
} from 'lucide-react';
import {
  ARTICLES_BY_DATE,
  ARTICLE_CATEGORIES,
  formatDate,
  type Article,
} from '../data/articles';
import { COURSES, coursesForAge } from '../data/courses';
import { SITE, WA_URL } from '../data/site';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import usePageMeta from '../hooks/usePageMeta';
import useStructuredData, { breadcrumb } from '../hooks/useStructuredData';

/**
 * Kategoriler artık sadece filtre etiketi değil — her biri hangi soruya cevap
 * verdiğini kendisi söylüyor. Veli "hangi başlığa bakayım" diye düşünmesin.
 */
const CATEGORY_INFO: Record<
  (typeof ARTICLE_CATEGORIES)[number],
  { icon: typeof Map; question: string; tint: string }
> = {
  'Yol Haritası': {
    icon: Map,
    question: 'Ne zaman, hangi sırayla, ne kadar sürede?',
    tint: 'bg-tint-sky',
  },
  'Karar Rehberi': {
    icon: Scale,
    question: 'İki seçenek arasında kaldığınızda hangisi?',
    tint: 'bg-tint-lime',
  },
  'Veli Rehberi': {
    icon: HeartHandshake,
    question: 'Evde ne yapmalı, nereye kadar karışmalı?',
    tint: 'bg-tint-peach',
  },
  Teknik: {
    icon: Cpu,
    question: 'Bilgisayar, kurulum, donanım neye ihtiyaç var?',
    tint: 'bg-tint-lilac',
  },
};

/** Yaş aralıklarına göre hangi kursların açık olduğunu gösteren küçük harita. */
const AGE_STEPS = [8, 10, 12, 14, 16];

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const info = CATEGORY_INFO[article.category];
  return (
    <Link
      to={`/rehber/${article.slug}`}
      className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-night-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${info.tint} text-night-950`}
        >
          <info.icon className="h-4 w-4" />
        </span>
        <span className="text-xs font-bold text-night-500">{article.category}</span>
        <span className="ml-auto font-mono text-xs text-night-300">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mb-2.5 text-lg font-extrabold leading-snug text-night-950 transition-colors group-hover:text-electric-500">
        {article.title}
      </h3>
      <p className="mb-5 leading-relaxed text-night-600">{article.excerpt}</p>

      <div className="mt-auto flex items-center gap-3 border-t border-night-100 pt-4 text-xs text-night-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {article.readMinutes} dk okuma
        </span>
        <span aria-hidden="true">·</span>
        <span>{formatDate(article.published)}</span>
        <ArrowRight className="ml-auto h-4 w-4 text-night-950 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function GuidePage() {
  const [category, setCategory] = useState<string | null>(null);

  usePageMeta({
    title: 'Çocuklar ve Kodlama — Velilere Rehber | Hype Academia',
    description:
      'Çocuklar ve kodlama üzerine velilere yönelik rehber: hangi yaşta başlanmalı, Scratch mi Python mı, kurs seçerken nelere dikkat edilmeli, ne kadar sürede ne öğrenilir.',
  });

  useStructuredData([
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Velilere Kodlama Rehberi',
      itemListElement: ARTICLES_BY_DATE.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.title,
        url: `${SITE.url}/rehber/${a.slug}`,
      })),
    },
    breadcrumb([{ name: 'Veli Rehberi', path: '/rehber' }]),
  ]);

  const list = category
    ? ARTICLES_BY_DATE.filter((a) => a.category === category)
    : ARTICLES_BY_DATE;

  const [lead, ...rest] = list;

  // Rehberin giriş kapıları — velinin aklındaki üç tipik soru
  const kapilar = [
    {
      soru: 'Kaç yaşında başlamalı?',
      cevap: 'Yaş tek başına ölçü değil. Hazır olma işaretlerini yazdık.',
      slug: 'cocugum-kac-yasinda-kodlamaya-baslamali',
      tint: 'bg-tint-sky',
    },
    {
      soru: 'Hangi kursla başlamalı?',
      cevap: 'Scratch mi Python mı — üç soruyla netleşiyor.',
      slug: 'scratch-mi-python-mi',
      tint: 'bg-tint-lime',
    },
    {
      soru: 'Bu kursa güvenilir mi?',
      cevap: 'Kayıt olmadan önce sorulması gereken 9 soru.',
      slug: 'online-kodlama-kursu-secerken-9-soru',
      tint: 'bg-tint-peach',
    },
  ].filter((k) => ARTICLES_BY_DATE.some((a) => a.slug === k.slug));

  return (
    <>
      {/* ─── Başlık ─────────────────────────────────────────────────────── */}
      <section className="pt-10 md:pt-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center mb-6">
              Veli Rehberi &middot; {ARTICLES_BY_DATE.length} yazı
            </p>
            <h1 className="text-display-md">
              Karar vermeden önce <span className="mark">okuyun</span>
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-night-600 md:text-xl">
              Velilerin bize en çok sorduğu sorulara uzun uzun cevap verdiğimiz yer. Satış metni
              değil: bizim kursumuza yönlendirmediği yerlerde de dürüst olmaya çalışıyoruz —
              “bu yaşta beklemek daha doğru” veya “bu kursa ihtiyacınız yok” dediğimiz yazılar da var.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Giriş kapıları ─────────────────────────────────────────────── */}
      {kapilar.length > 0 && (
        <section className="pt-12 md:pt-16">
          <div className="container">
            <Reveal>
              <p className="mb-5 text-center text-sm font-bold text-night-400">
                En çok okunan üç soru
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {kapilar.map((k) => (
                  <Link
                    key={k.slug}
                    to={`/rehber/${k.slug}`}
                    className={`group flex flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 ${k.tint}`}
                  >
                    <h2 className="mb-2 text-lg font-extrabold text-night-950">{k.soru}</h2>
                    <p className="mb-5 leading-relaxed text-night-700">{k.cevap}</p>
                    <span className="mt-auto inline-flex items-center gap-2 font-bold text-night-950">
                      Cevabı oku
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-night-950 text-white transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── Konu başlıkları ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Rehber nasıl kurulu"
            title={
              <>
                Dört başlık, <span className="mark">dört ayrı soru</span>
              </>
            }
            subtitle="Aradığınız cevabın hangi başlıkta olduğunu bilmek için yazıları tek tek açmanıza gerek yok."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ARTICLE_CATEGORIES.map((c, i) => {
              const info = CATEGORY_INFO[c];
              const adet = ARTICLES_BY_DATE.filter((a) => a.category === c).length;
              const secili = category === c;
              return (
                <Reveal key={c} delay={i * 60}>
                  <button
                    type="button"
                    onClick={() => setCategory(secili ? null : c)}
                    aria-pressed={secili}
                    className={`flex h-full w-full flex-col rounded-3xl p-6 text-left transition-all ${
                      info.tint
                    } ${secili ? 'ring-2 ring-night-950' : 'hover:-translate-y-1'}`}
                  >
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-night-950">
                      <info.icon className="h-5 w-5" />
                    </span>
                    <span className="mb-1.5 block font-extrabold text-night-950">{c}</span>
                    <span className="mb-4 block leading-relaxed text-night-700">
                      {info.question}
                    </span>
                    <span className="mt-auto text-xs font-bold text-night-950/60">
                      {adet} yazı {secili ? '· seçili' : ''}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Yazılar ────────────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-display-sm text-night-950">
              {category ? category : 'Bütün yazılar'}
            </h2>
            {category && (
              <button
                type="button"
                onClick={() => setCategory(null)}
                className="btn-ghost btn-sm"
              >
                Filtreyi kaldır
              </button>
            )}
          </div>

          {/* Öne çıkan yazı */}
          {lead && (
            <Reveal>
              <Link
                to={`/rehber/${lead.slug}`}
                className="group mb-6 grid gap-8 rounded-3xl bg-night-950 p-8 text-white md:grid-cols-[minmax(0,1fr)_240px] md:p-12"
              >
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
                    <span className="badge-marker">En yeni</span>
                    <span className="badge bg-white/10 text-white">{lead.category}</span>
                    <span className="text-night-400">{formatDate(lead.published)}</span>
                  </div>
                  <h3 className="text-display-sm text-white transition-colors group-hover:text-marker">
                    {lead.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-night-300">
                    {lead.excerpt}
                  </p>
                </div>
                <div className="flex flex-col justify-end gap-4 md:items-end">
                  <span className="inline-flex items-center gap-1.5 text-sm text-night-400">
                    <Clock className="h-4 w-4" />
                    {lead.readMinutes} dakika okuma
                  </span>
                  <span className="inline-flex items-center gap-2 font-bold text-white">
                    Yazıyı oku
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marker text-night-950 transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 50}>
                <ArticleCard article={a} index={i + 1} />
              </Reveal>
            ))}
          </div>

          {list.length === 0 && (
            <p className="py-12 text-center text-night-500">Bu başlıkta henüz yazı yok.</p>
          )}
        </div>
      </section>

      {/* ─── Yaşa göre harita ───────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="container">
          <SectionHeading
            eyebrow="Kısa yol"
            title={
              <>
                Okumaya vaktiniz yoksa: <span className="mark">yaşa göre</span>
              </>
            }
            subtitle="Yazıların hepsini okumadan da başlangıç noktanızı görebilirsiniz. Bu tablo yalnızca yaş sınırlarına bakar; asıl karar deneme dersinde netleşir."
          />

          <Reveal className="mt-12">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl ring-1 ring-night-100">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-night-950 text-white">
                    <th scope="col" className="px-5 py-4 font-bold">
                      Yaş
                    </th>
                    <th scope="col" className="px-5 py-4 font-bold">
                      Açık olan programlar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-night-100 bg-white">
                  {AGE_STEPS.map((yas) => {
                    const uygun = coursesForAge(yas);
                    return (
                      <tr key={yas}>
                        <th scope="row" className="whitespace-nowrap px-5 py-4 font-extrabold text-night-950">
                          {yas} yaş
                        </th>
                        <td className="px-5 py-4">
                          <span className="flex flex-wrap gap-1.5">
                            {uygun.length === 0 ? (
                              <span className="text-night-500">
                                Henüz erken — 8 yaşını beklemenizi öneriyoruz.
                              </span>
                            ) : (
                              uygun.map((c) => (
                                <Link
                                  key={c.id}
                                  to={`/kurslar/${c.slug}`}
                                  className="badge-neutral transition-colors hover:bg-night-950 hover:text-white"
                                >
                                  {c.shortTitle}
                                </Link>
                              ))
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal className="mt-6 text-center">
            <Link to="/kurslar" className="btn-ghost">
              {COURSES.length} programın müfredatı
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── Kapanış ────────────────────────────────────────────────────── */}
      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl bg-night-50 p-8 md:flex-row md:items-center md:p-10">
            <div className="flex-1">
              <h2 className="mb-2 text-xl font-extrabold text-night-950">
                Cevabını burada bulamadınız mı?
              </h2>
              <p className="leading-relaxed text-night-600">
                Yazmadığımız bir soru varsa WhatsApp hattımıza yazın; hem size cevap verelim hem
                de yeni yazı konusu olsun. Sıkça sorulan soruların tamamı{' '}
                <Link
                  to="/sss"
                  className="font-bold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500"
                >
                  SSS sayfasında
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <Link to="/iletisim" className="btn-primary">
                Deneme dersi al
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
