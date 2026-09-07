import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ARTICLES_BY_DATE, formatDate } from '../../data/articles';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const TINTS = ['bg-tint-lime', 'bg-tint-sky', 'bg-tint-rose'];

export default function GuideTeaser() {
  const latest = ARTICLES_BY_DATE.slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Veli Rehberi"
          title={
            <>
              Karar vermeden önce <span className="mark">okuyun</span>
            </>
          }
          subtitle="Kayıt olmasanız da işinize yarayacak yazılar. Kendi kursumuza yönlendirmediği yerlerde de dürüst olmaya çalışıyoruz."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 70}>
              <Link
                to={`/rehber/${a.slug}`}
                className={`group flex flex-col h-full rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1 ${
                  TINTS[i % TINTS.length]
                }`}
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="badge-white">{a.category}</span>
                  <span className="badge-white">{a.readMinutes} dk</span>
                </div>
                <h3 className="text-xl font-extrabold text-night-950 mb-3 leading-tight">
                  {a.title}
                </h3>
                <p className="text-night-700 leading-relaxed mb-6">{a.excerpt}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-night-600">
                    {formatDate(a.published)}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-night-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link to="/rehber" className="btn-ghost">
            Tüm yazılar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
