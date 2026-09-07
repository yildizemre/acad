import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ARTICLES_BY_DATE, formatDate } from '../../data/articles';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

export default function GuideTeaser() {
  const latest = ARTICLES_BY_DATE.slice(0, 3);

  return (
    <section className="section bg-sand-50 border-t border-sand-300">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            index="07"
            eyebrow="Veli Rehberi"
            title="Karar vermeden önce okuyun"
            subtitle="Kayıt olmasanız da işinize yarayacak yazılar. Kendi kursumuza yönlendirmediği yerlerde de dürüst olmaya çalışıyoruz."
          />
          <Link to="/rehber" className="btn-ghost shrink-0">
            Tüm yazılar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ul className="divide-y divide-sand-300 border-y border-sand-300">
          {latest.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 60}>
              <Link
                to={`/rehber/${a.slug}`}
                className="group grid md:grid-cols-[auto_1fr_auto] gap-x-6 gap-y-2 items-baseline py-5"
              >
                <span className="font-mono text-xs text-lead-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-ink-950 group-hover:text-brick-600 transition-colors">
                    {a.title}
                  </span>
                  <span className="block mt-1.5 text-sm text-lead-600 leading-relaxed max-w-2xl">
                    {a.excerpt}
                  </span>
                </span>
                <span className="text-xs text-lead-500 whitespace-nowrap">
                  {formatDate(a.published)} · {a.readMinutes} dk
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
