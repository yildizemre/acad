import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COURSES } from '../../data/courses';
import CourseCard from '../CourseCard';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

export default function CoursesPreview() {
  return (
    <section id="kurslar" className="section">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
          index="02"
            align="left"
            eyebrow="Programlar"
            title="Altı program, tek bir yol haritası"
            subtitle="Bloklarla başlayıp yapay zekaya kadar giden kademeli bir yapı kurduk. Her kurs bir öncekinin üzerine biner."
            className="!mx-0"
          />
          <Link to="/kurslar" className="btn-ghost shrink-0">
            Tüm kursları gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <CourseCard course={c} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
