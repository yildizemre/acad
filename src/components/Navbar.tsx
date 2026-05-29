import { useState, useEffect } from 'react';
import { Menu, X, Code2, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Kurslar', href: '#kurslar' },
  { label: 'Neden Biz?', href: '#neden-biz' },
  { label: 'Nasıl Çalışır?', href: '#nasil-calisir' },
  { label: 'Hakkımızda', href: '#hakkimizda' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span
              className={`font-bold text-xl tracking-tight transition-colors ${
                scrolled ? 'text-brand-navy' : 'text-white'
              }`}
            >
              Hype<span className="text-brand-green">Academia</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                  scrolled
                    ? 'text-gray-600 hover:text-brand-navy hover:bg-gray-100'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                scrolled ? 'text-brand-navy hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => handleNavClick('#iletisim')}
              className="btn-primary text-sm !px-5 !py-2.5"
            >
              Ücretsiz Dene
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled
                ? 'text-brand-navy hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menüyü aç/kapat"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-xl px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:text-brand-navy transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <button className="w-full text-center py-3 rounded-xl text-brand-navy font-medium hover:bg-gray-50 transition-colors">
              Giriş Yap
            </button>
            <button
              onClick={() => handleNavClick('#iletisim')}
              className="w-full btn-primary justify-center"
            >
              Ücretsiz Deneme Dersi Al
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
