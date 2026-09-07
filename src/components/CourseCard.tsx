import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Course } from '../data/courses';
import { totalLessons } from '../data/courses';
import { TIERS, priceFor, formatTRY } from '../data/pricing';

/** Seviye, renkli hap yerine üç kademeli bir sinyal göstergesiyle okunuyor. */
const LEVEL_STEPS: Record<string, number> = { Başlangıç: 1, Orta: 2, İleri: 3 };

function LevelMeter({ level }: { level: string }) {
  const active = LEVEL_STEPS[level] ?? 1;
  return (
    <span className="inline-flex items-center gap-2" title={`Seviye: ${level}`}>
      <span className="flex items-end gap-[3px]" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`w-[3px] ${n === 1 ? 'h-2' : n === 2 ? 'h-3' : 'h-4'} ${
              n <= active ? 'bg-electric-500' : 'bg-sand-400'
            }`}
          />
        ))}
      </span>
      <span className="text-xs font-medium text-lead-600">{level}</span>
    </span>
  );
}

export default function CourseCard({ course, index }: { course: Course; index?: number }) {
  const from = priceFor(TIERS[0], course.weeks);

  return (
    <article className="group flex flex-col h-full bg-sand-50 border border-sand-300 rounded-lg overflow-hidden transition-colors duration-200 hover:border-ink-950">
      {/* Görsel — üstünde uçuşan rozet yok, sadece fotoğraf */}
      <Link
        to={`/kurslar/${course.slug}`}
        className="relative block aspect-[3/2] overflow-hidden bg-sand-200"
        tabIndex={-1}
      >
        <img
          src={course.image}
          alt={`${course.title} dersinden ekran görüntüsü — ${course.ageRange} canlı online kurs`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-col flex-1 p-5">
        {/* Künye satırı: numara — yaş — seviye */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-sand-300">
          <span className="flex items-center gap-3">
            {index !== undefined && (
              <span className="font-mono text-xs text-lead-400">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
            <span className="text-xs font-semibold text-ink-950">{course.ageRange}</span>
          </span>
          <LevelMeter level={course.level} />
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug mb-2">
          <Link
            to={`/kurslar/${course.slug}`}
            className="text-ink-950 hover:text-brick-600 transition-colors"
          >
            {course.title}
          </Link>
        </h3>

        {course.tag && <span className="badge-brick self-start mb-3">{course.tag}</span>}

        <p className="text-lead-600 text-sm leading-relaxed mb-5">{course.summary}</p>

        {/* Ölçüler düz rakam olarak — ikonla süslenmiyor */}
        <dl className="mt-auto grid grid-cols-3 gap-3 py-4 border-t border-sand-300 text-center">
          <div>
            <dd className="font-display text-lg font-semibold text-ink-950 leading-none">
              {course.weeks}
            </dd>
            <dt className="text-[11px] text-lead-500 mt-1">hafta</dt>
          </div>
          <div className="border-x border-sand-300">
            <dd className="font-display text-lg font-semibold text-ink-950 leading-none">
              {totalLessons(course)}
            </dd>
            <dt className="text-[11px] text-lead-500 mt-1">canlı ders</dt>
          </div>
          <div>
            <dd className="font-display text-lg font-semibold text-ink-950 leading-none">
              {course.maxStudents}
            </dd>
            <dt className="text-[11px] text-lead-500 mt-1">kişilik sınıf</dt>
          </div>
        </dl>

        <div className="flex items-end justify-between gap-3 pt-4 border-t border-sand-300">
          <div>
            <div className="text-[11px] text-lead-500 leading-none mb-1.5">Başlangıç</div>
            <div className="font-display text-lg font-semibold text-ink-950 leading-none">
              {formatTRY(from)}
            </div>
          </div>
          <Link
            to={`/kurslar/${course.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-950 border-b border-brick-500 pb-0.5 hover:text-brick-600 transition-colors"
          >
            Müfredat
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
