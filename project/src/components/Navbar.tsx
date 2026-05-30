import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Kurslar', href: '#kurslar' },
  { label: 'Hakkımızda', href: '#hakkimizda' },
  { label: 'Felsefemiz', href: '#felsefe' },
  { label: 'Yorumlar', href: '#yorumlar' },
  { label: 'İletişim', href: '#iletisim' },
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
          ? 'bg-white/96 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center group -ml-4 -my-4">
            <img
              src="/logo.png"
              alt="Hype Academia"
              className="h-32 w-auto group-hover:scale-105 transition-transform"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-navy hover:bg-gray-100 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://panel.hypeacademia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium px-4 py-2 rounded-lg text-brand-navy hover:bg-gray-100 transition-all"
            >
              Giriş Yap
            </a>
            <button
              onClick={() => handleNavClick('#deneme')}
              className="btn-primary text-sm !px-5 !py-2.5"
            >
              Ücretsiz Dene
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-brand-navy hover:bg-gray-100 transition-colors"
            aria-label="Menüyü aç/kapat"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
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
            <a
              href="https://panel.hypeacademia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-xl text-brand-navy font-medium hover:bg-gray-50 transition-colors"
            >
              Giriş Yap
            </a>
            <button
              onClick={() => handleNavClick('#deneme')}
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
