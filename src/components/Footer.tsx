import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { SITE, WA_URL } from '../data/site';

const kurumsal = [
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'Eğitmenlerimiz', to: '/hakkimizda#egitmenler' },
  { label: 'Nasıl Çalışır?', to: '/hakkimizda#surec' },
  { label: 'Kariyer', to: '/hakkimizda#kariyer' },
  { label: 'Öğrenci Projeleri', to: '/projeler' },
  { label: 'Veli Rehberi', to: '/rehber' },
  { label: 'Sıkça Sorulan Sorular', to: '/sss' },
];

const destek = [
  { label: 'Fiyatlar & Paketler', to: '/fiyatlar' },
  { label: 'Ödeme Seçenekleri', to: '/fiyatlar#odeme' },
  { label: 'İptal & İade Politikası', to: '/fiyatlar#iade' },
  { label: 'Gizlilik Politikası', to: '/yasal/gizlilik' },
  { label: 'Kullanım Koşulları', to: '/yasal/kullanim-kosullari' },
  { label: 'KVKK Aydınlatma Metni', to: '/yasal/kvkk' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: SITE.instagram },
  { icon: Youtube, label: 'YouTube', href: SITE.youtube },
];

export default function Footer() {
  return (
    <footer id="iletisim" className="bg-ink-950 text-white">
      {/* Kapanış çağrısı */}
      <div className="border-b border-white/10">
        <div className="container py-14 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-display-sm font-bold text-white">
                Çocuğunuz için doğru kursu birlikte bulalım
              </h2>
              <p className="mt-3 text-white/60 text-lg">
                Ücretsiz deneme dersi tamamen bağlayıcılıksızdır. Kart bilgisi istemiyoruz.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/iletisim" className="btn-primary btn-lg">
                Ücretsiz Deneme Dersi Al
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline btn-lg"
              >
                WhatsApp'tan Yaz
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bağlantılar */}
      <div className="container py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Marka */}
          <div className="col-span-2">
            <img src="/logo.png" alt={SITE.name} width={432}
              height={141}
              className="h-16 w-auto mb-6 brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              {SITE.foundedYear} yılında {SITE.parentInstitution} bünyesinde kurulan, 8–17 yaş
              arası çocuklara canlı online yazılım, robotik ve yapay zeka eğitimi veren teknoloji
              akademisi.
            </p>

            <div className="space-y-2.5 text-sm mb-6">
              <a
                href={`tel:${SITE.phoneIntl}`}
                className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-brick-400 shrink-0" />
                {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-brick-400 shrink-0" />
                {SITE.email}
              </a>
              <div className="flex items-start gap-2.5 text-white/70">
                <MapPin className="w-4 h-4 text-brick-400 shrink-0 mt-0.5" />
                {SITE.address}
              </div>
            </div>

            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-sand-50/10 hover:bg-brick-500 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Kurslar */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Kurslar</h3>
            <ul className="space-y-2.5">
              {COURSES.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/kurslar/${c.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {c.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/kurslar"
                  className="text-brick-400 hover:text-brick-300 text-sm font-medium transition-colors"
                >
                  Tümünü gör →
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Kurumsal</h3>
            <ul className="space-y-2.5">
              {kurumsal.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Destek & Yasal</h3>
            <ul className="space-y-2.5">
              {destek.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Güven rozetleri */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 bg-sand-50/5 border border-white/10 rounded px-4 py-2 text-xs font-medium text-white/70">
            <BadgeCheck className="w-4 h-4 text-brick-400" />
            E-Devlet onaylı sertifika
          </span>
          <span className="inline-flex items-center gap-2 bg-sand-50/5 border border-white/10 rounded px-4 py-2 text-xs font-medium text-white/70">
            <ShieldCheck className="w-4 h-4 text-brick-400" />
            İlk 2 ders içinde koşulsuz iade
          </span>
          <span className="inline-flex items-center gap-2 bg-sand-50/5 border border-white/10 rounded px-4 py-2 text-xs font-medium text-white/70">
            KVKK uyumlu veri işleme
          </span>
        </div>
      </div>

      {/* Alt şerit */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {SITE.legalName}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-5">
            <Link to="/yasal/gizlilik" className="text-white/40 hover:text-white text-xs transition-colors">
              Gizlilik
            </Link>
            <Link
              to="/yasal/kullanim-kosullari"
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              Koşullar
            </Link>
            <Link to="/yasal/kvkk" className="text-white/40 hover:text-white text-xs transition-colors">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
