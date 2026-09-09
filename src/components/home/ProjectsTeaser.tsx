import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import VideoWall from '../ui/VideoWall';

export default function ProjectsTeaser() {
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
          subtitle="Aşağıdakiler tanıtım videosu değil, öğrencilerin kendi ekranlarından alınmış kayıtlar. Her kurs böyle bir bitirme projesiyle sonuçlanıyor ve öğrenci son hafta onu ailesine canlı sunuyor."
        />

        <Reveal className="mt-14">
          <VideoWall
            variant="card"
            ids={['unity-acik-dunya', 'quiz-uygulamasi', 'villa-3b']}
          />
        </Reveal>

        <Reveal className="mt-10 text-center">
          <Link to="/projeler" className="btn-ghost">
            Dokuz kaydın hepsini izle
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
