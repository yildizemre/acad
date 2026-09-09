import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { SITE, WA_URL } from '../data/site';
import { SELLER, BRAND, sellerName } from '../data/legal-entity';
import PaymentBadges from './ui/PaymentBadges';

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
  { label: 'Teslimat ve İade Şartları', to: '/yasal/teslimat-ve-iade' },
  { label: 'Mesafeli Satış Sözleşmesi', to: '/yasal/mesafeli-satis-sozlesmesi' },
  { label: 'Ön Bilgilendirme Formu', to: '/yasal/on-bilgilendirme-formu' },
  { label: 'Gizlilik Politikası', to: '/yasal/gizlilik' },
  { label: 'Kullanım Koşulları', to: '/yasal/kullanim-kosullari' },
  { label: 'KVKK Aydınlatma Metni', to: '/yasal/kvkk' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: SITE.instagram },
];

export default function Footer() {
  // Yalnızca doldurulmuş kurumsal bilgiler gösterilir; boş alan hiç yazılmaz

  return (
    <footer id="iletisim" className="bg-night-950 text-white">
      {/* Kapanış çağrısı */}
      <div className="border-b border-white/10">
        <div className="container py-14 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-display-sm text-white">
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
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-electric-500 flex items-center justify-center transition-colors"
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

        {/* Ödeme ve güvenlik */}
        <div className="mt-12 pt-8 border-t border-white/15 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-night-400">
            <span>SSL sertifikası ile şifreli bağlantı</span>
            <span>3D Secure ile ödeme</span>
            <span>E-Devlet onaylı sertifika</span>
            <span>İlk 2 ders içinde koşulsuz iade</span>
          </div>
          <PaymentBadges tone="dark" className="md:justify-self-end" />
        </div>

        {/* Kurumsal kimlik — yalnızca bilinen bilgiler yazılır */}
        <div className="mt-8 pt-6 border-t border-white/15 text-xs text-night-400 leading-relaxed max-w-3xl">
          <p>
            <span className="text-night-200">{BRAND.name}</span>, {SELLER.shortName} bünyesinde
            faaliyet gösteren bir markadır. Satış ve faturalandırma işlemleri{' '}
            <span className="text-night-200">{sellerName}</span> tarafından yapılır.
          </p>
          <p className="mt-1.5">
            Ünvan, adres, vergi ve MERSİS bilgileri{' '}
            <Link to="/hakkimizda#kurumsal" className="text-night-200 underline hover:text-white">
              Hakkımızda
            </Link>{' '}
            sayfasında ve{' '}
            <Link
              to="/yasal/mesafeli-satis-sozlesmesi"
              className="text-night-200 underline hover:text-white"
            >
              Mesafeli Satış Sözleşmesi
            </Link>
            ’nde yazılıdır.
          </p>
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
