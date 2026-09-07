import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  ARTICLES_BY_DATE,
  ARTICLE_CATEGORIES,
  formatDate,
} from '../data/articles';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';

export default function GuidePage() {
  const [category, setCategory] = useState<string | null>(null);

  usePageMeta({
    title: 'Veli Rehberi | Hype Academia',
    description:
      'Çocuklar ve kodlama üzerine velilere yönelik rehber yazılar: hangi yaşta başlanmalı, Scratch mi Python mı, kurs seçerken nelere dikkat edilmeli.',
  });

  const list = category
    ? ARTICLES_BY_DATE.filter((a) => a.category === category)
    : ARTICLES_BY_DATE;

  const [lead, ...rest] = list;

  return (
    <>
      <section className="border-b border-sand-300">
        <div className="container py-14 md:py-20">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-5">
              <span className="rule" />
              Veli Rehberi
            </p>
            <h1 className="font-display text-display-md font-semibold text-ink-950">
              Karar vermeden önce okuyun
            </h1>
            <p className="mt-5 text-lg text-lead-600 leading-relaxed">
              Velilerin bize en çok sorduğu sorulara uzun uzun cevap verdiğimiz yer. Satış metni
              değil; kendi kursumuza yönlendirmediği yerlerde de dürüst olmaya çalışıyoruz.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Kategoriler */}
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setCategory(null)}
              className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                category === null
                  ? 'bg-ink-950 border-ink-950 text-sand-50'
                  : 'border-sand-400 text-lead-600 hover:border-ink-950 hover:text-ink-950'
              }`}
            >
              Tümü
            </button>
            {ARTICLE_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(category === c ? null : c)}
                className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                  category === c
                    ? 'bg-ink-950 border-ink-950 text-sand-50'
                    : 'border-sand-400 text-lead-600 hover:border-ink-950 hover:text-ink-950'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Öne çıkan yazı */}
          {lead && (
            <Reveal>
              <article className="border-y border-sand-300 py-8 mb-10">
                <Link to={`/rehber/${lead.slug}`} className="group block">
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-lead-500">
                    <span className="font-mono">01</span>
                    <span className="badge-neutral">{lead.category}</span>
                    <span>{formatDate(lead.published)}</span>
                    <span>·</span>
                    <span>{lead.readMinutes} dk okuma</span>
                  </div>
                  <h2 className="font-display text-display-sm font-semibold text-ink-950 max-w-3xl group-hover:text-brick-600 transition-colors">
                    {lead.title}
                  </h2>
                  <p className="mt-4 text-lg text-lead-600 leading-relaxed max-w-2xl">
                    {lead.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-950 border-b border-brick-500 pb-0.5">
                    Yazıyı oku
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </article>
            </Reveal>
          )}

          {/* Diğerleri */}
          <div className="divide-y divide-sand-300 border-b border-sand-300">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 50}>
                <article>
                  <Link
                    to={`/rehber/${a.slug}`}
                    className="group grid md:grid-cols-[auto_1fr_auto] gap-x-6 gap-y-2 items-baseline py-6"
                  >
                    <span className="font-mono text-xs text-lead-400">
                      {String(i + 2).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block font-display text-xl font-semibold text-ink-950 group-hover:text-brick-600 transition-colors">
                        {a.title}
                      </span>
                      <span className="block mt-2 text-lead-600 leading-relaxed max-w-2xl">
                        {a.excerpt}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-3 text-xs text-lead-500">
                        <span className="badge-neutral">{a.category}</span>
                        <span>{formatDate(a.published)}</span>
                        <span>·</span>
                        <span>{a.readMinutes} dk</span>
                      </span>
                    </span>
                    <ArrowRight className="hidden md:block w-5 h-5 text-lead-400 group-hover:text-brick-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          {list.length === 0 && (
            <p className="py-12 text-center text-lead-500">
              Bu kategoride henüz yazı yok.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
