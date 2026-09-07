import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, LogIn } from 'lucide-react';
import { COURSES } from '../data/courses';
import { SITE } from '../data/site';
import CourseIcon from './ui/CourseIcon';

const NAV = [
  { label: 'Kurslar', to: '/kurslar', hasMenu: true },
  { label: 'Projeler', to: '/projeler' },
  { label: 'Fiyatlar', to: '/fiyatlar' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'Rehber', to: '/rehber' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number>();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sayfa değişince açık menüleri kapat
  useEffect(() => {
    setMobileOpen(false);
    setCoursesOpen(false);
  }, [pathname]);

  // Mobil menü açıkken arka planın kaymasını engelle
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setCoursesOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setCoursesOpen(false), 140);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-2xl text-sm font-medium transition-colors ${
      isActive ? 'text-night-950 bg-night-50' : 'text-night-600 hover:text-night-950 hover:bg-white'
    }`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div
        className={`container rounded-full transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-lift' : 'bg-white shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-20 px-2">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" aria-label={SITE.name}>
            <img
              src="/logo.png"
              alt={SITE.name}
              width={432}
              height={141}
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          {/* Masaüstü menü */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((item) =>
              item.hasMenu ? (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={openMenu}
                  onMouseLeave={scheduleClose}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${linkClass({ isActive })} inline-flex items-center gap-1`
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${coursesOpen ? 'rotate-180' : ''}`}
                    />
                  </NavLink>

                  {coursesOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[520px]">
                      <div className="bg-white rounded-2xl bg-night-50 p-2 grid grid-cols-2 gap-1">
                        {COURSES.map((c) => (
                          <Link
                            key={c.id}
                            to={`/kurslar/${c.slug}`}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white transition-colors group"
                          >
                            <span className="w-9 h-9 rounded border border-night-200 text-night-950 flex items-center justify-center shrink-0 group-hover:border-electric-500 group-hover:text-electric-500 transition-colors">
                              <CourseIcon name={c.icon} className="w-5 h-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-night-950 truncate">
                                {c.shortTitle}
                              </span>
                              <span className="block text-xs text-night-400">
                                {c.ageRange} · {c.weeks} hafta
                              </span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          to="/kurslar"
                          className="col-span-2 mt-1 flex items-center justify-between px-3 py-2.5 rounded-xl bg-night-950 text-white text-sm font-semibold hover:bg-night-900 transition-colors"
                        >
                          Tüm kursları ve müfredatları gör
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          {/* Masaüstü eylemler */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={SITE.panelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-2xl text-night-600 hover:text-night-950 hover:bg-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Giriş Yap
            </a>
            <Link to="/iletisim" className="btn-primary btn-sm">
              Ücretsiz Deneme Dersi
            </Link>
          </div>

          {/* Mobil menü düğmesi */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 -mr-2 rounded-2xl text-night-950 hover:bg-night-50 transition-colors"
            aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-3 top-24 bottom-3 bg-white rounded-3xl shadow-lift overflow-y-auto">
          <div className="container py-6 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-night-400 mb-2 px-1">
                Kurslar
              </div>
              <div className="grid gap-1">
                {COURSES.map((c) => (
                  <Link
                    key={c.id}
                    to={`/kurslar/${c.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white active:bg-night-50 transition-colors"
                  >
                    <span className="w-10 h-10 rounded border border-night-200 text-night-950 flex items-center justify-center shrink-0">
                      <CourseIcon name={c.icon} className="w-5 h-5" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-night-950">
                        {c.shortTitle}
                      </span>
                      <span className="block text-xs text-night-400">
                        {c.ageRange} · {c.level}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 grid gap-1">
              {NAV.filter((n) => !n.hasMenu).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="px-3 py-3 rounded-xl text-[15px] font-medium text-night-700 hover:bg-white transition-colors"
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/kurslar"
                className="px-3 py-3 rounded-xl text-[15px] font-medium text-night-700 hover:bg-white transition-colors"
              >
                Tüm Kurslar
              </Link>
            </div>

            <div className="pt-4 space-y-2">
              <a
                href={SITE.panelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full"
              >
                <LogIn className="w-4 h-4" />
                Giriş Yap
              </a>
              <Link to="/iletisim" className="btn-primary w-full">
                Ücretsiz Deneme Dersi Al
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
