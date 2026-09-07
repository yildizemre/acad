import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Course } from '../data/courses';
import { totalLessons } from '../data/courses';
import { TIERS, priceFor, formatTRY } from '../data/pricing';

/** Kursun kendi zemin rengi — her kart farklı görünsün. */
const TINT: Record<string, string> = {
  peach: 'bg-tint-peach',
  rose: 'bg-tint-rose',
  lime: 'bg-tint-lime',
  sky: 'bg-tint-sky',
  lilac: 'bg-tint-lilac',
  mint: 'bg-tint-mint',
};

export default function CourseCard({ course }: { course: Course; index?: number }) {
  const from = priceFor(TIERS[0], course.weeks);

  return (
    <article
      className={`group relative flex flex-col h-full rounded-3xl p-6 md:p-7 transition-transform duration-300 hover:-translate-y-1.5 ${
        TINT[course.tint] ?? 'bg-night-50'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <span className="badge-white">{course.ageRange}</span>
        {course.tag && <span className="badge-dark">{course.tag}</span>}
      </div>

      {/* Ders ekranı — kartın rengi üstünde beyaz çerçeve içinde */}
      <Link
        to={`/kurslar/${course.slug}`}
        className="block rounded-2xl overflow-hidden bg-white/60 mb-6"
        tabIndex={-1}
      >
        <img
          src={course.image}
          alt={`${course.title} dersinden ekran görüntüsü — ${course.ageRange} canlı online kurs`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          className="w-full block transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <h3 className="text-2xl font-extrabold text-night-950 leading-tight mb-3">
        <Link to={`/kurslar/${course.slug}`} className="hover:underline decoration-2 underline-offset-4">
          {course.title}
        </Link>
      </h3>

      <p className="text-night-700 leading-relaxed mb-6">{course.summary}</p>

      {/* Künye — beyaz haplar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="badge-white">{course.weeks} hafta</span>
        <span className="badge-white">{totalLessons(course)} canlı ders</span>
        <span className="badge-white">Maks. {course.maxStudents} kişi</span>
        <span className="badge-white">{course.level}</span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5 border-t border-night-950/10">
        <div>
          <div className="text-xs font-semibold text-night-600 mb-0.5">Başlangıç fiyatı</div>
          <div className="text-xl font-extrabold text-night-950">{formatTRY(from)}</div>
        </div>
        <Link
          to={`/kurslar/${course.slug}`}
          className="inline-flex items-center gap-2 font-bold text-night-950 group-hover:gap-3 transition-all"
        >
          Müfredat
          <span className="w-9 h-9 rounded-full bg-night-950 text-white flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </article>
  );
}
