import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';
import { FAQS, FAQ_CATEGORIES } from '../data/content';
import { SITE, WA_URL } from '../data/site';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';
import useStructuredData, { breadcrumb } from '../hooks/useStructuredData';

export default function FaqPage() {
  const [category, setCategory] = useState<string>('genel');
  const [open, setOpen] = useState<string | null>(null);

  usePageMeta({
    title: 'Sıkça Sorulan Sorular | Hype Academia',
    description:
      'Dersler, ödeme, iade, teknik gereksinimler ve kayıt süreci hakkında en çok sorulan soruların cevapları.',
  });

  useStructuredData([
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    breadcrumb([{ name: 'Sıkça Sorulan Sorular', path: '/sss' }]),
  ]);

  const visible = FAQS.filter((f) => f.category === category);

  return (
    <>
      {/* Başlık */}
      <section className="bg-sand-50 border-b border-sand-300/70">
        <div className="container py-14 md:py-20">
          <Reveal className="max-w-3xl">
            <div className="eyebrow mb-4">
              <span className="rule" />
              Destek
            </div>
            <h1 className="text-display-md font-bold text-ink-950">
              Sıkça sorulan sorular
            </h1>
            <p className="mt-5 text-lg text-lead-500 leading-relaxed">
              Velilerimizin en çok sorduğu {FAQS.length} sorunun cevabını burada topladık.
              Aradığınızı bulamazsanız WhatsApp hattımızdan yazabilirsiniz.
            </p>
          </Reveal>
        </div>
      </section>

      {/* İçerik */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10 max-w-4xl mx-auto">
            {/* Kategoriler */}
            <nav className="lg:sticky lg:top-28 h-fit">
              <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 lg:mx-0 lg:px-0">
                {FAQ_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategory(c.id);
                      setOpen(null);
                    }}
                    className={`shrink-0 lg:w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      category === c.id
                        ? 'bg-ink-950 text-white'
                        : 'bg-sand-200 text-lead-600 hover:bg-sand-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Sorular */}
            <div className="space-y-3">
              {visible.map((f, i) => {
                const isOpen = open === f.q;
                return (
                  <Reveal key={f.q} delay={i * 40}>
                    <div
                      className={`rounded-lg bg-sand-50 border transition-all ${
                        isOpen ? 'ring-brick-200' : 'ring-sand-300/70'
                      }`}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : f.q)}
                        className="w-full flex items-start gap-4 p-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="flex-1 font-semibold text-ink-950">{f.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-lead-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="px-5 pb-5 text-lead-500 leading-relaxed">{f.a}</p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Yardım */}
          <Reveal className="mt-14">
            <div className="max-w-4xl mx-auto panel p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-ink-950 mb-2">
                  Cevabını bulamadığınız bir soru mu var?
                </h2>
                <p className="text-lead-500">
                  WhatsApp hattımıza yazın, genellikle birkaç dakika içinde dönüyoruz. Ya da{' '}
                  <a
                    href={`tel:${SITE.phoneIntl}`}
                    className="font-semibold text-ink-950 hover:text-brick-600 transition-colors"
                  >
                    {SITE.phoneDisplay}
                  </a>{' '}
                  numarasından arayın.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <Link to="/iletisim" className="btn-primary">
                  Deneme dersi al
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
