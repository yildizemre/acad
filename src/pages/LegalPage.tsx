import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { ALL_LEGAL_DOCS, legalBySlug, type LegalSection } from '../data/content';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import useStructuredData, { breadcrumb } from '../hooks/useStructuredData';
import { missingLegalFields } from '../data/legal-entity';

function Section({ s, i }: { s: LegalSection; i: number }) {
  return (
    <Reveal delay={Math.min(i, 6) * 40}>
      <section className="mb-9">
        {(s.article || s.heading) && (
          <h2 className="text-lg font-extrabold text-night-950 mb-3">
            {s.article && (
              <span className="font-mono text-xs text-night-400 mr-3 align-middle">
                MADDE {s.article}
              </span>
            )}
            {s.heading}
          </h2>
        )}

        {s.body && <p className="text-night-700 leading-relaxed mb-3">{s.body}</p>}

        {s.rows && (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse text-left text-sm min-w-[420px]">
              <tbody>
                {s.rows.map(([k, v]) => (
                  <tr key={k} className="align-top">
                    <th
                      scope="row"
                      className="py-2.5 pr-6 font-medium text-night-950 whitespace-nowrap w-1/3"
                    >
                      {k}
                    </th>
                    <td className="py-2.5 text-night-700">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {s.list && (
          <ul className="space-y-2 my-3">
            {s.list.map((item) => (
              <li key={item} className="flex gap-3 text-night-700 leading-relaxed">
                <span className="text-electric-500 font-mono text-sm shrink-0 mt-0.5">&mdash;</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        {s.note && (
          <p className="mt-4 border-l-2 border-electric-500 bg-night-50 px-4 py-3 text-sm text-night-700 leading-relaxed rounded-r">
            {s.note}
          </p>
        )}
      </section>
    </Reveal>
  );
}

export default function LegalPage() {
  const { slug } = useParams();
  const doc = slug ? legalBySlug(slug) : undefined;

  usePageMeta({
    title: doc ? `${doc.title} | Hype Academia` : 'Yasal | Hype Academia',
    description: doc ? doc.intro ?? `${doc.title} — son güncelleme ${doc.updated}.` : undefined,
  });

  useStructuredData(
    doc ? breadcrumb([{ name: doc.title, path: `/yasal/${doc.slug}` }]) : null,
  );

  if (!doc) return <Navigate to="/" replace />;

  // Eksik tüzel kişilik bilgisi uyarısı YALNIZCA geliştirme modunda görünür.
  // Ziyaretçi hiçbir zaman yer tutucu metin görmez; eksik alanlar sözleşmeden
  // komple çıkarılır (bkz. legal-entity.ts → sellerRows).
  const eksik = missingLegalFields();
  const eksikVar = import.meta.env.DEV && eksik.length > 0;

  return (
    <section className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-night-500 hover:text-night-950 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana sayfa
          </Link>

          <Reveal>
            <h1 className="text-display-sm text-night-950 mb-2">
              {doc.title}
            </h1>
            <p className="text-sm text-night-500 mb-6">Son güncelleme: {doc.updated}</p>
            {doc.intro && (
              <p className="text-lg text-night-600 leading-relaxed mb-10">{doc.intro}</p>
            )}
          </Reveal>

          {eksikVar && (
            <div className="mb-10 flex gap-3 border border-electric-500 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-electric-500 shrink-0 mt-0.5" />
              <p className="text-sm text-night-700 leading-relaxed">
                <strong className="text-night-950">
                  Yalnızca geliştirme modunda görünür:
                </strong>{' '}
                sözleşmede {eksik.length} alan eksik ({eksik.join(', ')}). Bu alanlar
                ziyaretçiye gösterilmiyor, ama sanal POS başvurusundan önce{' '}
                <code className="text-xs">src/data/legal-entity.ts</code> dosyasından
                doldurulmalı.
              </p>
            </div>
          )}

          <div>
            {doc.sections.map((s, i) => (
              <Section key={i} s={s} i={i} />
            ))}
          </div>

          <div className="mt-12 pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-night-500 mb-4">
              Diğer yasal metinler
            </h2>
            <div className="flex flex-wrap gap-2">
              {ALL_LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
                <Link
                  key={d.slug}
                  to={`/yasal/${d.slug}`}
                  className="badge-neutral hover:border-night-950 hover:text-night-950 transition-colors"
                >
                  {d.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
