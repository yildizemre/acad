import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '../../data/projects';
import { courseById } from '../../data/courses';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

/**
 * Stok fotoğraf galerisinin yerini aldı. Velinin gerçekten merak ettiği şey
 * "sekiz hafta sonunda ortada ne olacak" sorusu.
 */
export default function ProjectsTeaser() {
  const featured = PROJECTS.slice(0, 3);

  return (
    <section className="section border-t border-sand-300">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            index="06"
            eyebrow="Bitirme Projeleri"
            title="Anlatmak yerine gösterelim"
            subtitle="Her kurs bir bitirme projesiyle sonuçlanıyor. Öğrenci son hafta bunu ailesine ve sınıfına canlı sunuyor."
          />
          <Link to="/projeler" className="btn-ghost shrink-0">
            Tüm projeleri gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
          {featured.map((p, i) => {
            const course = courseById(p.courseId);
            return (
              <Reveal key={p.id} delay={i * 70}>
                <Link to="/projeler" className="group block border-t-2 border-ink-950 pt-5 h-full">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="font-mono text-xs text-lead-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {course && <span className="badge-neutral">{course.shortTitle}</span>}
                  </div>

                  <div className="border border-sand-300 rounded overflow-hidden mb-4 bg-sand-200">
                    <img
                      src={p.image}
                      alt={`${p.title} — öğrenci bitirme projesi ekranı`}
                      loading="lazy"
                      decoding="async"
                      width={1000}
                      height={750}
                      className="w-full block"
                    />
                  </div>

                  <h3 className="font-display text-xl font-semibold text-ink-950 group-hover:text-brick-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-lead-600 leading-relaxed mt-2">{p.brief}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
