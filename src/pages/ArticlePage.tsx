import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  ARTICLES_BY_DATE,
  articleBySlug,
  formatDate,
  type Block,
} from '../data/articles';
import { courseById } from '../data/courses';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import useStructuredData, { breadcrumb } from '../hooks/useStructuredData';
import { SITE } from '../data/site';

/** Blok tipine göre doğru işaretlemeyi üretir. */
function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case 'h2':
      return (
        <h2 key={i} className="text-2xl font-extrabold text-night-950 mt-12 mb-4">
          {b.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i} className="text-lg font-extrabold text-night-950 mt-8 mb-3">
          {b.text}
        </h3>
      );
    case 'p':
      return (
        <p key={i} className="text-night-700 leading-[1.75] mb-5 text-[17px]">
          {b.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className="mb-6 space-y-2.5">
          {b.items.map((it) => (
            <li key={it} className="flex gap-3 text-night-700 leading-relaxed text-[17px]">
              <span className="text-electric-500 font-mono text-sm shrink-0 mt-0.5">—</span>
              {it}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i} className="mb-6 space-y-3">
          {b.items.map((it, n) => (
            <li key={it} className="flex gap-3 text-night-700 leading-relaxed text-[17px]">
              <span className="font-mono text-sm text-night-400 shrink-0 mt-0.5">
                {String(n + 1).padStart(2, '0')}
              </span>
              {it}
            </li>
          ))}
        </ol>
      );
    case 'callout':
      return (
        <aside key={i} className="my-8 border-l-2 border-electric-500 bg-night-50 p-5 rounded-r">
          <p className="font-semibold text-night-950 mb-1.5">{b.title}</p>
          <p className="text-night-700 leading-relaxed">{b.text}</p>
        </aside>
      );
    case 'table':
      return (
        <div key={i} className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[480px]">
            <thead>
              <tr className="border-y border-night-950">
                {b.head.map((h) => (
                  <th
                    key={h}
                    className="py-3 pr-5 text-xs font-semibold uppercase tracking-wider text-night-950"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className={`py-3 pr-5 align-top text-[15px] ${
                        c === 0 ? 'font-medium text-night-950' : 'text-night-600'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = slug ? articleBySlug(slug) : undefined;

  usePageMeta({
    title: article ? `${article.title} | Hype Academia` : 'Yazı bulunamadı',
    description: article?.excerpt,
  });

  useStructuredData(
    article
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            datePublished: article.published,
            dateModified: article.published,
            inLanguage: 'tr-TR',
            wordCount: article.body
              .map((b) => ('text' in b ? b.text : ''))
              .join(' ')
              .split(/\s+/).length,
            articleSection: article.category,
            author: { '@type': 'Organization', name: article.author, url: SITE.url },
            publisher: { '@id': `${SITE.url}/#organization` },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE.url}/rehber/${article.slug}`,
            },
          },
          breadcrumb([
            { name: 'Veli Rehberi', path: '/rehber' },
            { name: article.title, path: `/rehber/${article.slug}` },
          ]),
        ]
      : null,
  );

  if (!article) return <Navigate to="/rehber" replace />;

  const related = article.relatedCourseIds
    .map(courseById)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const others = ARTICLES_BY_DATE.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <article>
        {/* Başlık */}
        <header>
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl">
              <Link
                to="/rehber"
                className="inline-flex items-center gap-1.5 text-sm text-night-500 hover:text-night-950 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Veli Rehberi
              </Link>

              <div className="flex flex-wrap items-center gap-3 text-xs text-night-500 mb-5">
                <span className="badge-neutral">{article.category}</span>
                <span>{formatDate(article.published)}</span>
                <span>·</span>
                <span>{article.readMinutes} dakika okuma</span>
              </div>

              <h1 className="text-display-md text-night-950">
                {article.title}
              </h1>
              <p className="mt-5 text-lg text-night-600 leading-relaxed">{article.excerpt}</p>
            </div>
          </div>
        </header>

        {/* Gövde */}
        <div className="container py-12 md:py-16">
          <div className="max-w-[680px]">{article.body.map(renderBlock)}</div>
        </div>
      </article>

      {/* İlgili kurslar */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="container py-12">
            <div className="max-w-[680px]">
              <p className="eyebrow mb-4">
                Bu yazıyla ilgili programlar
              </p>
              <ul className="divide-y divide-night-100">
                {related.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/kurslar/${c.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="block text-lg font-extrabold text-night-950 group-hover:text-electric-500 transition-colors">
                          {c.title}
                        </span>
                        <span className="block text-sm text-night-500 mt-1">
                          {c.ageRange} · {c.weeks} hafta · {c.level}
                        </span>
                      </span>
                      <ArrowRight className="w-5 h-5 text-night-400 shrink-0 group-hover:text-electric-500 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link to="/iletisim" className="btn-primary">
                  Ücretsiz deneme dersi al
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Diğer yazılar */}
      <section className="section">
        <div className="container">
          <h2 className="text-2xl font-extrabold text-night-950 mb-8">
            Diğer yazılar
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <Link to={`/rehber/${a.slug}`} className="group block h-full">
                  <div className="border-t-2 border-night-950 pt-4 h-full">
                    <span className="text-xs text-night-500">{a.category}</span>
                    <h3 className="text-lg font-extrabold text-night-950 mt-2 group-hover:text-electric-500 transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-sm text-night-600 leading-relaxed mt-2">{a.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
