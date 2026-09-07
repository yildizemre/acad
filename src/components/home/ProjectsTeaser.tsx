import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '../../data/projects';
import { courseById } from '../../data/courses';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const TINT: Record<string, string> = {
  peach: 'bg-tint-peach',
  rose: 'bg-tint-rose',
  lime: 'bg-tint-lime',
  sky: 'bg-tint-sky',
  lilac: 'bg-tint-lilac',
  mint: 'bg-tint-mint',
};

export default function ProjectsTeaser() {
  const featured = PROJECTS.slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Bitirme Projeleri"
          title={
            <>
              8 hafta sonunda <span className="mark">elinde ne kalıyor?</span>
            </>
          }
          subtitle="Her kurs bir bitirme projesiyle sonuçlanıyor. Öğrenci son hafta bunu ailesine ve sınıfına canlı sunuyor."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {featured.map((p, i) => {
            const course = courseById(p.courseId);
            return (
              <Reveal key={p.id} delay={i * 70}>
                <Link
                  to="/projeler"
                  className={`group flex flex-col h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 ${
                    course ? TINT[course.tint] : 'bg-night-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    {course && <span className="badge-white">{course.shortTitle}</span>}
                    <span className="badge-white">Müfredat projesi</span>
                  </div>

                  <div className="rounded-2xl overflow-hidden bg-white/60 mb-5">
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

                  <h3 className="text-xl font-extrabold text-night-950 mb-2">{p.title}</h3>
                  <p className="text-night-700 leading-relaxed mb-5">{p.brief}</p>

                  <span className="mt-auto inline-flex items-center gap-2 font-bold text-night-950">
                    İncele
                    <span className="w-8 h-8 rounded-full bg-night-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 text-center">
          <Link to="/projeler" className="btn-ghost">
            Tüm projeleri gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
