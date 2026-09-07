import Hero from '../components/Hero';
import AgeFinder from '../components/home/AgeFinder';
import CoursesPreview from '../components/home/CoursesPreview';
import WhyUsSection from '../components/home/WhyUsSection';
import ProcessSection from '../components/home/ProcessSection';
import PricingTeaser from '../components/home/PricingTeaser';
import ProjectsTeaser from '../components/home/ProjectsTeaser';
import GuideTeaser from '../components/home/GuideTeaser';
import TrustSection from '../components/home/TrustSection';
import TrialCTA from '../components/TrialCTA';
import usePageMeta from '../hooks/usePageMeta';

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
      <WhyUsSection />
      <ProcessSection />
      <PricingTeaser />
      <ProjectsTeaser />
      <GuideTeaser />
      <TrustSection />
      <TrialCTA />
    </>
  );
}
