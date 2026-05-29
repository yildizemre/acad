import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Courses from './components/Courses';
import WhyUs from './components/WhyUs';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <Hero />
        <Courses />
        <WhyUs />
        <HowItWorks />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
