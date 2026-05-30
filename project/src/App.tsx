import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AgeFilter from './components/AgeFilter';
import CoursesSection from './components/CoursesSection';
import AboutSection from './components/AboutSection';
import Philosophy from './components/Philosophy';
import GallerySection from './components/GallerySection';
import Testimonials from './components/Testimonials';
import TrialCTA from './components/TrialCTA';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <Hero />
        <AgeFilter />
        <CoursesSection />
        <AboutSection />
        <Philosophy />
        <GallerySection />
        <Testimonials />
        <TrialCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
