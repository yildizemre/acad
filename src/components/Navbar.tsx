import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, LogIn, Sparkles } from 'lucide-react';
import { COURSES, totalLessons } from '../data/courses';
import { PATHS, TIERS, priceFor, formatTRY, pathInfo } from '../data/pricing';
import { SITE } from '../data/site';
import CourseIcon from './ui/CourseIcon';

/** Kurs kartının üzerine gelince aldığı zemin — her kursun kendi rengi. */
const TINT: Record<string, string> = {
  peach: 'group-hover:bg-tint-peach',
  rose: 'group-hover:bg-tint-rose',
  lime: 'group-hover:bg-tint-lime',
  sky: 'group-hover:bg-tint-sky',
  lilac: 'group-hover:bg-tint-lilac',
  mint: 'group-hover:bg-tint-mint',
};

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
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[860px] max-w-[calc(100vw-2rem)]">
                      <div className="overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-night-100">
                        <div className="grid grid-cols-[minmax(0,1fr)_270px]">
                          {/* Sol: kurslar */}
                          <div className="p-4">
                            <p className="px-3 pb-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-night-400">
                              6 program · 8–17 yaş
                            </p>
                            <div className="grid grid-cols-2 gap-1">
                              {COURSES.map((c) => (
                                <Link
                                  key={c.id}
                                  to={`/kurslar/${c.slug}`}
                                  className={`group flex items-start gap-3 rounded-2xl p-3 transition-colors ${TINT[c.tint]}`}
                                >
                                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-night-50 text-night-950 transition-colors group-hover:bg-white">
                                    <CourseIcon name={c.icon} className="h-5 w-5" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-extrabold text-night-950">
                                      {c.shortTitle}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-night-500">
                                      {c.ageRange} · {c.weeks} hafta / {totalLessons(c)} ders
                                    </span>
                                    <span className="mt-1 block text-xs font-bold text-night-950">
                                      {formatTRY(priceFor(TIERS[0], c))}&apos;den başlar
                                    </span>
                                  </span>
                                </Link>
                              ))}
                            </div>

                            <Link
                              to="/kurslar"
                              className="mt-2 flex items-center justify-between rounded-2xl bg-night-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-night-900"
                            >
                              Tüm müfredatları hafta hafta gör
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>

                          {/* Sağ: yıllık patikalar ve deneme dersi */}
                          <div className="border-l border-night-100 bg-night-50/60 p-4">
                            <p className="px-1 pb-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-night-400">
                              Yıllık patikalar
                            </p>
                            <div className="space-y-1">
                              {PATHS.map((p) => {
                                const bilgi = pathInfo(p);
                                return (
                                  <Link
                                    key={p.id}
                                    to="/fiyatlar#patikalar"
                                    className="block rounded-2xl px-3 py-2.5 transition-colors hover:bg-white"
                                  >
                                    <span className="block text-sm font-extrabold text-night-950">
                                      {p.name}
                                    </span>
                                    <span className="block text-xs text-night-500">
                                      {p.ageRange} · {bilgi.courses.map((c) => c.shortTitle).join(' + ')}
                                    </span>
                                    <span className="mt-0.5 block text-xs font-bold text-electric-500">
                                      {formatTRY(bilgi.save)} avantaj
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>

                            <div className="mt-4 rounded-2xl bg-marker p-4">
                              <p className="flex items-center gap-1.5 text-xs font-extrabold text-night-950">
                                <Sparkles className="h-3.5 w-3.5" />
                                Hangisi doğru, emin değil misiniz?
                              </p>
                              <p className="mt-1.5 text-xs leading-relaxed text-night-800">
                                Ücretsiz deneme dersinde çocuğunuzun seviyesini birlikte görelim.
                                Kart bilgisi istemiyoruz.
                              </p>
                              <Link
                                to="/iletisim"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-night-950 underline decoration-2 underline-offset-4"
                              >
                                Deneme dersi al
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
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
