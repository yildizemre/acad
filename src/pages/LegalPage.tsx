import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LEGAL_DOCS, legalBySlug } from '../data/content';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';

export default function LegalPage() {
  const { slug } = useParams();
  const doc = slug ? legalBySlug(slug) : undefined;

  usePageMeta({
    title: doc ? `${doc.title} | Hype Academia` : 'Yasal | Hype Academia',
    description: doc ? `${doc.title} — son güncelleme ${doc.updated}.` : undefined,
  });

  if (!doc) return <Navigate to="/" replace />;

  return (
    <section className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-lead-400 hover:text-ink-950 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana sayfa
          </Link>

          <Reveal>
            <h1 className="text-display-sm font-bold text-ink-950 mb-2">{doc.title}</h1>
            <p className="text-sm text-lead-400 mb-10">Son güncelleme: {doc.updated}</p>
          </Reveal>

          <div className="space-y-7">
            {doc.sections.map((s, i) => (
              <Reveal key={i} delay={i * 40}>
                <div>
                  {s.heading && (
                    <h2 className="text-lg font-bold text-ink-950 mb-3">{s.heading}</h2>
                  )}
                  {s.body && <p className="text-lead-600 leading-relaxed">{s.body}</p>}
                  {s.list && (
                    <ul className="space-y-2 mt-2">
                      {s.list.map((item) => (
                        <li key={item} className="flex gap-2.5 text-lead-600 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-brick-400 mt-2.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Diğer belgeler */}
          <div className="mt-14 pt-8 border-t border-sand-300">
            <h2 className="text-sm font-bold uppercase tracking-wider text-lead-400 mb-4">
              Diğer yasal metinler
            </h2>
            <div className="flex flex-wrap gap-2">
              {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
                <Link
                  key={d.slug}
                  to={`/yasal/${d.slug}`}
                  className="badge bg-sand-200 text-lead-600 hover:bg-sand-300 transition-colors"
                >
                  {d.title}
                </Link>
              ))}
              <Link
                to="/fiyatlar#iade"
                className="badge bg-sand-200 text-lead-600 hover:bg-sand-300 transition-colors"
              >
                İptal & İade Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
