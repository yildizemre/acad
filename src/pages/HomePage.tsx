import Hero from '../components/Hero';
import AgeFinder from '../components/home/AgeFinder';
import CoursesPreview from '../components/home/CoursesPreview';
import ProjectsTeaser from '../components/home/ProjectsTeaser';
import TeachersTeaser from '../components/home/TeachersTeaser';
import ProcessSection from '../components/home/ProcessSection';
import PricingTeaser from '../components/home/PricingTeaser';
import TrustSection from '../components/home/TrustSection';
import GuideTeaser from '../components/home/GuideTeaser';
import TrialCTA from '../components/TrialCTA';
import usePageMeta from '../hooks/usePageMeta';

/**
 * Bölüm sırası bilinçli:
 *   önce ne öğretiyoruz (kurslar) → sonunda ne çıkıyor (projeler) →
 *   kim öğretiyor (eğitmenler) → nasıl işliyor → ne kadar → taahhütler.
 *
 * Güven mesajları (şeffaf fiyat, iade, küçük sınıf, ders kaydı) eskiden dört
 * ayrı bölümde tekrarlanıyordu. Artık tek bir yerde toplandı: TrustSection.
 */
export default function HomePage() {
  usePageMeta({
    title: 'Hype Academia | 8–17 Yaş Online Yazılım, Kodlama ve Yapay Zeka Eğitimi',
    description:
      '8–17 yaş arası çocuklara Python, Scratch, Unity, Web Geliştirme, Yapay Zeka ve Arduino Robotik eğitimi. Hafta hafta açık müfredat, şeffaf fiyatlar, ücretsiz deneme dersi.',
  });

  return (
    <>
      <Hero />
      <AgeFinder />
      <CoursesPreview />
      <ProjectsTeaser />
      <TeachersTeaser />
      <ProcessSection />
      <PricingTeaser />
      <TrustSection />
      <GuideTeaser />
      <TrialCTA />
    </>
  );
}
