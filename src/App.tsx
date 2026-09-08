import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import PromoModal from './components/PromoModal';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';

// Ana sayfa doğrudan yükleniyor; diğerleri ilk açılışı yavaşlatmasın diye
// ayrı paketlere bölündü ve ziyaret edildiklerinde indiriliyor.
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/** Sayfa paketi inerken görünen yer tutucu — boş ekran yerine. */
function PageFallback() {
  return (
    <div className="container py-32">
      <div className="max-w-2xl space-y-4" aria-hidden="true">
        <div className="h-3 w-24 bg-night-100 rounded" />
        <div className="h-10 w-3/4 bg-night-100 rounded" />
        <div className="h-4 w-full bg-night-50 rounded" />
        <div className="h-4 w-5/6 bg-night-50 rounded" />
      </div>
      <span className="sr-only">Sayfa yükleniyor</span>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      {/* Klavye ve ekran okuyucu kullanıcıları menüyü atlayabilsin */}
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-night-950 focus:text-white focus:px-5 focus:py-3 focus:rounded"
      >
        İçeriğe atla
      </a>
      <Navbar />
      <main id="icerik" className="flex-1 pt-24 md:pt-32">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kurslar" element={<CoursesPage />} />
            <Route path="/kurslar/:slug" element={<CourseDetailPage />} />
            <Route path="/fiyatlar" element={<PricingPage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/sss" element={<FaqPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/projeler" element={<ProjectsPage />} />
            <Route path="/kayit" element={<CheckoutPage />} />
            <Route path="/rehber" element={<GuidePage />} />
            <Route path="/rehber/:slug" element={<ArticlePage />} />
            <Route path="/yasal/:slug" element={<LegalPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <PromoModal />
    </div>
  );
}
