import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Play, Film, Info } from 'lucide-react';
import { PROJECTS, embedUrl, projectKindLabel, hasDemo, type Project } from '../data/projects';
import { COURSES, courseById } from '../data/courses';
import Reveal from '../components/ui/Reveal';
import VideoWall from '../components/ui/VideoWall';
import { STUDENT_VIDEOS, VIDEOS_PUBLISHED } from '../data/videos';
import { SITE } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';
import useStructuredData, { breadcrumb } from '../hooks/useStructuredData';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [playing, setPlaying] = useState(false);
  const course = courseById(project.courseId);
  const embed = embedUrl(project);
  const kind = projectKindLabel(project);

  return (
    <article className="border-t-2 border-night-950 pt-5 flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="font-mono text-xs text-night-400">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          <span className={kind.real ? 'badge-brand' : 'badge-neutral'}>{kind.label}</span>
          {course && (
            <Link
              to={`/kurslar/${course.slug}`}
              className="badge-neutral hover:border-night-950 hover:text-night-950 transition-colors"
            >
              {course.shortTitle}
            </Link>
          )}
        </div>
      </div>

      <div className="bg-night-50 rounded overflow-hidden bg-night-50 mb-5">
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
                className="absolute inset-0 flex items-center justify-center bg-night-950/45 opacity-0 hover:opacity-100 transition-opacity"
              >
                <span className="inline-flex items-center gap-2 bg-white text-night-950 px-5 py-3 rounded font-semibold text-sm">
                  <Play className="w-4 h-4 fill-current" />
                  Oyna
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <h3 className="text-xl font-extrabold text-night-950 mb-2">{project.title}</h3>

      {project.student && (
        <p className="text-sm text-night-500 mb-3">
          {project.student.name} · {project.student.age} yaş
        </p>
      )}

      <p className="text-night-600 leading-relaxed mb-5">{project.brief}</p>

      <div className="border-l-2 border-electric-500 pl-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-electric-500 mb-1.5">
          Çözülmesi gereken problem
        </p>
        <p className="text-sm text-night-700 leading-relaxed">{project.challenge}</p>
      </div>

      <div className="mt-auto pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-night-500 mb-2.5">
          Gösterdiği yetkinlikler
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {project.skills.map((s) => (
            <li key={s} className="badge-neutral">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500 transition-colors"
            >
              Projeyi aç
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-night-950 underline decoration-2 underline-offset-4 hover:text-electric-500 transition-colors"
            >
              <Film className="w-3.5 h-3.5" />
              Ekran kaydını izle
            </a>
          )}
          {!hasDemo(project) && (
            <p className="flex items-start gap-2 text-xs text-night-500 leading-relaxed">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Bu, müfredatın ürettiği projenin tanımıdır; belirli bir öğrenciye ait
              oynanabilir bir sürümü henüz yayınlanmadı.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [courseId, setCourseId] = useState<string | null>(null);

  usePageMeta({
    title: 'Öğrenci Projeleri — Çocuklar Kodlamayla Ne Üretiyor? | Hype Academia',
    description:
      'Her kursun son haftasında öğrencinin ürettiği iş: oyunlar, web siteleri, robotlar ve yapay zeka modelleri. Kurs sonunda elinde ne kalacağını buradan görün.',
  });

  // Ekran kayıtları Google'ın video aramasında da çıksın diye.
  useStructuredData([
    ...STUDENT_VIDEOS.map((v) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: `${v.title} — ${v.tool}`,
      description: `${v.blurb} ${v.detail}`,
      thumbnailUrl: `${SITE.url}/videos/${v.id}.jpg`,
      contentUrl: `${SITE.url}/videos/${v.id}.mp4`,
      uploadDate: VIDEOS_PUBLISHED,
      duration: 'PT12S',
      width: v.width,
      height: v.height,
      isFamilyFriendly: true,
      inLanguage: 'tr-TR',
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    })),
    breadcrumb([{ name: 'Bitirme Projeleri', path: '/projeler' }]),
  ]);

  const list = courseId ? PROJECTS.filter((p) => p.courseId === courseId) : PROJECTS;

  return (
    <>
      <section className="pt-10 md:pt-16">
        <div className="container">
          <Reveal className="text-center max-w-3xl mx-auto">
            <h1 className="text-display-md">
              8 hafta sonunda <span className="mark">elinde ne kalıyor?</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-night-600 leading-relaxed">
              Her kurs bir bitirme projesiyle sonuçlanıyor ve öğrenci bunu Demo Günü’nde canlı sunuyor. Önce öğrencilerimizin kendi ekranlarından alınmış dokuz kayıt; altında da her kursun bitirme projesi ve öğrencinin yolda çözmek zorunda kaldığı asıl problem.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Öğrencilerin ekranından: dokuz gerçek kayıt ─── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <h2 className="text-display-sm text-night-950">
              Öğrencilerin <span className="mark">kendi ekranından</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-night-600 leading-relaxed">
              Dokuz kayıt, dokuz ayrı iş. Hiçbiri tanıtım için yeniden çekilmedi; hepsi
              öğrencinin çalışırken kaydettiği ekran. Sesleri kaldırdık, on ikişer saniyelik
              bölümlerini aldık.
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <VideoWall variant="card" detail count={9} />
          </Reveal>
        </div>
      </section>

      {/* ─── Müfredatın ürettiği bitirme projeleri ─── */}
      <section className="section pt-0">
        <div className="container">
          <Reveal className="mb-10">
            <h2 className="text-display-sm text-night-950">
              Her kursun <span className="mark">bitirme projesi</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-night-600 leading-relaxed">
              Aşağıdakiler müfredatın tanımı: öğrenci kursun son haftasında bunu yapıyor.
              Kendi fikri varsa onu yapıyor, ama zorluk seviyesi ve kazanımlar aynı kalıyor.
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setCourseId(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${
                courseId === null
                  ? 'bg-night-950 border-night-950 text-white'
                  : 'border-night-200 text-night-600 hover:border-night-950 hover:text-night-950'
              }`}
            >
              Tümü
            </button>
            {COURSES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourseId(courseId === c.id ? null : c.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${
                  courseId === c.id
                    ? 'bg-night-950 border-night-950 text-white'
                    : 'border-night-200 text-night-600 hover:border-night-950 hover:text-night-950'
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

          <div className="mt-16 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-xl font-extrabold text-night-950 mb-2">
                Çocuğunuzun projesi de burada olsun
              </h2>
              <p className="text-night-600">
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
