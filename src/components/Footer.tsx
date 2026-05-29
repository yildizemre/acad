import { Code2, Mail, Phone, MapPin, Instagram, Twitter, Youtube, Linkedin, ArrowRight } from 'lucide-react';

const footerLinks = {
  kurslar: [
    'Scratch ile Oyun Geliştirme',
    'Python Programlama',
    'Web Tasarım & Geliştirme',
    'Unity Oyun Geliştirme',
    'Yapay Zeka & ML',
    'Arduino & Robotik',
  ],
  kurumsal: [
    'Hakkımızda',
    'Eğitmenlerimiz',
    'Basın & Medya',
    'Kariyer',
    'Blog',
    'SSS',
  ],
  destek: [
    'Nasıl Çalışır?',
    'Ödeme Seçenekleri',
    'İptal & İade',
    'Gizlilik Politikası',
    'Kullanım Koşulları',
    'KVKK',
  ],
};

const socials = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  return (
    <footer id="iletisim" className="bg-brand-navy text-white">
      {/* Newsletter / CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Çocuğunuzun Potansiyelini Keşfedin
              </h3>
              <p className="text-white/60">
                Ücretsiz deneme dersine kayıt olun — 48 saat içinde sizi arayalım.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="tel"
                placeholder="Telefon numaranız"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-green transition-colors w-full sm:w-64"
              />
              <button className="btn-primary whitespace-nowrap !py-3">
                Kayıt Ol
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                Hype<span className="text-brand-green">Academia</span>
              </span>
            </a>
            <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-xs">
              8-17 yaş arası çocuklara yazılım ve teknoloji eğitimleri sunuyoruz.
              Geleceğin dijital liderlerini bugünden yetiştiriyoruz.
            </p>

            <div className="space-y-3 text-sm text-white/60">
              <a href="mailto:info@hypeacademia.com" className="flex items-center gap-3 hover:text-brand-green transition-colors">
                <Mail className="w-4 h-4 text-brand-green shrink-0" />
                info@hypeacademia.com
              </a>
              <a href="tel:+905001234567" className="flex items-center gap-3 hover:text-brand-green transition-colors">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                +90 500 123 45 67
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <span>Levent, Beşiktaş, İstanbul</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-green transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">
              Kurslar
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.kurslar.map((item) => (
                <li key={item}>
                  <a href="#kurslar" className="text-white/60 text-sm hover:text-brand-green transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">
              Kurumsal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.kurumsal.map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 text-sm hover:text-brand-green transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">
              Destek
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.destek.map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 text-sm hover:text-brand-green transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Hype Academia. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">
              Gizlilik
            </a>
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">
              Koşullar
            </a>
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">
              KVKK
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
