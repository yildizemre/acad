import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Play } from 'lucide-react';
import { PROJECTS, embedUrl, type Project } from '../data/projects';
import { COURSES, courseById } from '../data/courses';
import Reveal from '../components/ui/Reveal';
import usePageMeta from '../hooks/usePageMeta';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [playing, setPlaying] = useState(false);
  const course = courseById(project.courseId);
  const embed = embedUrl(project);

  return (
    <article className="border-t-2 border-ink-950 pt-5 flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="font-mono text-xs text-lead-400">
          {String(index + 1).padStart(2, '0')}
        </span>
        {course && (
          <Link
            to={`/kurslar/${course.slug}`}
            className="badge-neutral hover:border-ink-950 hover:text-ink-950 transition-colors"
          >
            {course.shortTitle}
          </Link>
        )}
      </div>

      <div className="border border-sand-300 rounded overflow-hidden bg-sand-200 mb-5">
        {playing && embed ? (
          <iframe
            src={embed}
            title={project.title}
            className="w-full aspect-[4/3]"
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        ) : (
          <div className="relative">
            <img
              src={project.image}
              alt={`${project.title} — proje ekranı`}
              loading="lazy"
              decoding="async"
              width={1000}
              height={750}
              className="w-full block"
            />
            {embed && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-ink-950/45 opacity-0 hover:opacity-100 transition-opacity"
              >
                <span className="inline-flex items-center gap-2 bg-sand-50 text-ink-950 px-5 py-3 rounded font-semibold text-sm">
                  <Play className="w-4 h-4 fill-current" />
                  Oyna
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold text-ink-950 mb-2">{project.title}</h3>

      {project.student && (
        <p className="text-sm text-lead-500 mb-3">
          {project.student.name} · {project.student.age} yaş
        </p>
      )}

      <p className="text-lead-600 leading-relaxed mb-5">{project.brief}</p>

      <div className="border-l-2 border-brick-500 pl-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brick-600 mb-1.5">
          Çözülmesi gereken problem
        </p>
        <p className="text-sm text-lead-700 leading-relaxed">{project.challenge}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-sand-300">
        <p className="text-xs font-semibold uppercase tracking-wider text-lead-500 mb-2.5">
          Gösterdiği yetkinlikler
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {project.skills.map((s) => (
            <li key={s} className="badge-neutral">
              {s}
            </li>
          ))}
        </ul>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-950 border-b border-brick-500 pb-0.5 hover:text-brick-600 transition-colors"
          >
            Projeyi aç
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [courseId, setCourseId] = useState<string | null>(null);

  usePageMeta({
    title: 'Bitirme Projeleri | Hype Academia',
    description:
      'Her kursun son haftasında öğrencinin ürettiği iş: oyunlar, web siteleri, robotlar ve yapay zeka modelleri. Kurs sonunda elinde ne kalacağını buradan görün.',
  });

  const list = courseId ? PROJECTS.filter((p) => p.courseId === courseId) : PROJECTS;

  return (
    <>
      <section className="border-b border-sand-300">
        <div className="container py-14 md:py-20">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-5">
              <span className="rule" />
              Bitirme Projeleri
            </p>
            <h1 className="font-display text-display-md font-semibold text-ink-950">
              8 hafta sonunda elinde ne kalıyor?
            </h1>
            <p className="mt-5 text-lg text-lead-600 leading-relaxed">
              Her kurs bir bitirme projesiyle sonuçlanıyor ve öğrenci bunu Demo Günü’nde canlı
              sunuyor. Aşağıdakiler o projeler — sadece nasıl göründükleri değil, öğrencinin
              yolda çözmek zorunda kaldığı asıl problem de yazılı.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setCourseId(null)}
              className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                courseId === null
                  ? 'bg-ink-950 border-ink-950 text-sand-50'
                  : 'border-sand-400 text-lead-600 hover:border-ink-950 hover:text-ink-950'
              }`}
            >
              Tümü
            </button>
            {COURSES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourseId(courseId === c.id ? null : c.id)}
                className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                  courseId === c.id
                    ? 'bg-ink-950 border-ink-950 text-sand-50'
                    : 'border-sand-400 text-lead-600 hover:border-ink-950 hover:text-ink-950'
                }`}
              >
                {c.shortTitle}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 border-t border-sand-300 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-xl font-semibold text-ink-950 mb-2">
                Çocuğunuzun projesi de burada olsun
              </h2>
              <p className="text-lead-600">
                Öğrenci kendi fikrini seçiyor; yukarıdakiler her kursun standart bitirme
                projesi. Deneme dersinde çocuğunuzun ne yapmak istediğini birlikte konuşalım.
              </p>
            </div>
            <Link to="/iletisim" className="btn-primary shrink-0">
              Ücretsiz deneme dersi al
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
