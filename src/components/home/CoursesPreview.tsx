import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COURSES } from '../../data/courses';
import CourseCard from '../CourseCard';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

export default function CoursesPreview() {
  return (
    <section id="kurslar" className="section bg-night-50">
      <div className="container">
        <SectionHeading
          eyebrow="Programlar"
          title={
            <>
              Altı program, <span className="mark">tek bir yol haritası</span>
            </>
          }
          subtitle="Bloklarla başlayıp yapay zekaya kadar giden kademeli bir yapı kurduk. Her kurs bir öncekinin üzerine biner."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSES.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <CourseCard course={c} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link to="/kurslar" className="btn-primary">
            Tüm kursları ve müfredatları gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
