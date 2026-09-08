// ─────────────────────────────────────────────────────────────────────────────
// SEO ROTA LİSTESİ
//
// Derleme sonrası her rota için ayrı bir index.html üretmekte kullanılır
// (bkz. scripts/prerender.mjs). Böylece arama motorları ve sosyal medya
// önizlemeleri JavaScript çalıştırmadan doğru başlığı, açıklamayı ve
// özet içeriği görür.
//
// Bu dosya hem tarayıcıda hem Node tarafında çalışabilmeli — bu yüzden
// içinde React veya tarayıcıya özel hiçbir şey yok.
// ─────────────────────────────────────────────────────────────────────────────

import { COURSES, totalLessons } from '../data/courses';
import { ARTICLES_BY_DATE } from '../data/articles';
import { ALL_LEGAL_DOCS } from '../data/content';
import { PROJECTS } from '../data/projects';
import { STUDENT_VIDEOS } from '../data/videos';
import { TIERS, priceFor, formatTRY, classSizeLabel } from '../data/pricing';
import { SITE } from '../data/site';

export interface SeoRoute {
  path: string;
  title: string;
  description: string;
  /** JavaScript kapalıyken görünecek başlık */
  h1: string;
  /** JavaScript kapalıyken görünecek özet paragraf */
  summary: string;
  /** Sayfanın ana bilgi maddeleri — tarayıcıya metin olarak sunulur */
  facts?: string[];
  /** Sayfadan çıkan iç bağlantılar (tarayıcının siteyi gezebilmesi için) */
  links?: { label: string; href: string }[];
  /** Sitemap önceliği */
  priority: string;
  /** Sayfaya özel paylaşım görseli — verilmezse genel og.png kullanılır */
  image?: string;
  /** Sitemap'e eklenecek görseller (Google Görseller için) */
  images?: { url: string; caption: string }[];
  /** Arama motorunun indekslememesi gereken sayfalar */
  noindex?: boolean;
}

const courseLinks = COURSES.map((c) => ({
  label: c.title,
  href: `/kurslar/${c.slug}`,
}));

const mainLinks = [
  { label: 'Kurslar', href: '/kurslar' },
  { label: 'Bitirme Projeleri', href: '/projeler' },
  { label: 'Fiyatlar', href: '/fiyatlar' },
  { label: 'Veli Rehberi', href: '/rehber' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Sıkça Sorulan Sorular', href: '/sss' },
  { label: 'İletişim', href: '/iletisim' },
];

export const SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    priority: '1.0',
    title: 'Çocuklar İçin Kodlama Kursu | 8–17 Yaş Online Yazılım Eğitimi — Hype Academia',
    description:
      'Çocuklar için online kodlama kursu: Scratch, Python, Unity, yapay zeka, robotik. 8–17 yaş, canlı ders, küçük sınıf. Müfredat ve fiyatlar açık, ilk ders ücretsiz.',
    h1: 'Çocuğunuz ekranın üretici tarafına geçsin',
    summary: `${SITE.foundedYear} yılında ${SITE.parentInstitution} bünyesinde kurulan Hype Academia, 8–17 yaş arası çocuklara canlı online yazılım, robotik ve yapay zeka eğitimi verir. Müfredat hafta hafta açıktır, fiyatlar sitede yazılıdır, ilk ders ücretsizdir.`,
    facts: [
      'Maksimum 8 kişilik canlı sınıflar',
      'E-Devlet üzerinden doğrulanabilir tamamlama sertifikası',
      'İlk 2 ders içinde koşulsuz iade',
      'Her ders kaydedilir, 12 ay erişilebilir',
      `İletişim: ${SITE.phoneDisplay} · ${SITE.email}`,
    ],
    images: STUDENT_VIDEOS.map((v) => ({
      url: `/videos/${v.id}.jpg`,
      caption: `${v.title} — ${v.tool} ile yapılmış öğrenci çalışması`,
    })),
    links: [...mainLinks, ...courseLinks],
  },
  {
    path: '/kurslar',
    image: '/og/kurslar.png',
    priority: '0.9',
    title: 'Çocuklar İçin Kodlama Kursları — Scratch, Python, Robotik | Hype Academia',
    description:
      'Çocuklar için 6 kodlama kursu: Scratch, Python, web, Unity, yapay zeka, robotik. Her kursun haftalık müfredatı, yaş aralığı ve fiyatı kayıt olmadan görülebilir.',
    h1: 'Her kursun müfredatı hafta hafta açık',
    summary:
      'Çocuğunuzun hangi hafta neyi öğreneceğini, hangi projeyi bitireceğini ve kurs sonunda elinde ne kalacağını kayıt olmadan önce görebilirsiniz.',
    facts: COURSES.map(
      (c) =>
        `${c.title} — ${c.ageRange}, ${c.level}, ${c.weeks} hafta / ${totalLessons(c)} canlı ders, ${formatTRY(priceFor(TIERS[0], c))} başlangıç fiyatı`,
    ),
    images: COURSES.map((c) => ({ url: c.image, caption: `${c.title} ders ekranı` })),
    links: [...courseLinks, { label: 'Fiyatlar', href: '/fiyatlar' }],
  },
  {
    path: '/projeler',
    image: '/og/projeler.png',
    priority: '0.8',
    title: 'Öğrenci Projeleri — Çocuklar Kodlamayla Ne Üretiyor? | Hype Academia',
    description:
      'Çocuklar kodlama kursunda ne üretiyor? Öğrencilerin kendi ekranlarından dokuz kayıt: Unity oyunları, telefon uygulamaları, 3B tasarımlar ve masaüstü yazılım.',
    h1: '8 hafta sonunda elinde ne kalıyor?',
    summary:
      'Öğrencilerimizin kendi ekranlarından alınmış dokuz kayıt ve her kursun bitirme projesi. Öğrencinin yolda çözmek zorunda kaldığı asıl problem de yazılıdır.',
    facts: [
      ...STUDENT_VIDEOS.map((v) => `${v.title} (${v.tool}) — ${v.blurb}`),
      ...PROJECTS.map((p) => `${p.title} — ${p.brief}`),
    ],
    images: [
      ...STUDENT_VIDEOS.map((v) => ({
        url: `/videos/${v.id}.jpg`,
        caption: `${v.title} — ${v.tool} ile yapılmış öğrenci çalışmasının ekran kaydı`,
      })),
      ...PROJECTS.map((p) => ({
        url: p.image,
        caption: `${p.title} — ${p.brief}`,
      })),
    ],
    links: [...courseLinks],
  },
  {
    path: '/fiyatlar',
    image: '/og/fiyatlar.png',
    priority: '0.9',
    title: 'Çocuk Kodlama Kursu Fiyatları 2026 — Paketler ve Taksit | Hype Academia',
    description:
      'Çocuk kodlama kursu fiyatları: 8.900 TL’den başlayan paketler, 9 taksite kadar faizsiz, peşin ödemede %10 indirim. Hesaplayıcıyla tutarı anında görün.',
    h1: 'Fiyatlarımız burada yazıyor',
    summary:
      'Müfredat her pakette aynıdır; değişen tek şey çocuğunuza ayrılan eğitmen zamanıdır. Sınıf küçüldükçe fiyat artar, çünkü öğrenci başına düşen ilgi artar.',
    facts: [
      ...TIERS.map(
        (t) =>
          `${t.name} paketi — ${classSizeLabel(t)}, ${t.lessonLength}. 8 haftalık program ${formatTRY(t.price8)}, 10 haftalık program ${formatTRY(t.price10)}`,
      ),
      'Peşin ödemede %10 indirim, 9 taksite kadar faizsiz',
      'Kardeş indirimi %15, erken kayıt indirimi %10',
      'İlk 2 ders içinde koşulsuz iade',
    ],
    links: [...mainLinks],
  },
  {
    path: '/rehber',
    priority: '0.8',
    title: 'Çocuklar ve Kodlama — Velilere Rehber Yazılar | Hype Academia',
    description:
      'Çocuğum kaç yaşında kodlamaya başlamalı, Scratch mi Python mı, kurs seçerken nelere dikkat etmeli? Velilere yönelik rehber yazılar.',
    h1: 'Karar vermeden önce okuyun',
    summary:
      'Velilerin bize en çok sorduğu sorulara uzun uzun cevap verdiğimiz yer. Kendi kursumuza yönlendirmediği yerlerde de dürüst olmaya çalışıyoruz.',
    facts: ARTICLES_BY_DATE.map((a) => `${a.title} — ${a.excerpt}`),
    links: ARTICLES_BY_DATE.map((a) => ({ label: a.title, href: `/rehber/${a.slug}` })),
  },
  {
    path: '/hakkimizda',
    priority: '0.7',
    title: 'Hakkımızda, Eğitmenlerimiz ve Kayıt Sürecimiz | Hype Academia',
    description: `${SITE.parentInstitution} bünyesinde ${SITE.foundedYear} yılında kurulan Hype Academia’nın misyonu, değerleri, eğitmen kadrosu ve kayıt süreci.`,
    h1: 'Sanayiye yapay zeka çözümü üreten bir ekip, çocuklara ders veriyor',
    summary: `Hype Academia, ${SITE.foundedYear} yılında ${SITE.parentInstitution} bünyesinde kuruldu. Kurucu ekip bilgisayarla görü, derin öğrenme ve görüntü işleme alanlarında sanayi kuruluşlarına çözüm geliştiriyor.`,
    facts: [
      'Kuruluş: 2020, Gebze Teknik Üniversitesi',
      'Eğitmenler aktif olarak sektörde çalışan mühendisler',
      'Kayıt süreci 6 adım; ilk iki adım ücretsiz',
    ],
    links: [...mainLinks],
  },
  {
    path: '/sss',
    priority: '0.7',
    title: 'Sıkça Sorulan Sorular | Hype Academia',
    description:
      'Dersler, ödeme, iade, teknik gereksinimler ve kayıt süreci hakkında en çok sorulan soruların cevapları.',
    h1: 'Sıkça sorulan sorular',
    summary:
      'Dersler nasıl işliyor, sınıflar kaç kişilik, ödeme ve iade nasıl çalışıyor, hangi teknik ekipman gerekiyor — hepsinin cevabı burada.',
    links: [...mainLinks],
  },
  {
    path: '/iletisim',
    image: '/og/iletisim.png',
    priority: '0.8',
    title: 'Ücretsiz Kodlama Deneme Dersi — Çocuklar İçin | Hype Academia',
    description:
      'Çocuğunuz için ücretsiz kodlama deneme dersi alın. 1 saatlik canlı ders, gerçek eğitmenle. Kart bilgisi istenmez, bağlayıcılığı yok.',
    h1: 'Önce deneyin, sonra karar verin',
    summary:
      '1 saatlik ücretsiz deneme dersinde çocuğunuz gerçek bir eğitmenle gerçek bir ders yapar. Bağlayıcılığı yoktur, kart bilgisi istenmez.',
    facts: [
      `Telefon: ${SITE.phoneDisplay}`,
      `E-posta: ${SITE.email}`,
      `Adres: ${SITE.address}`,
      'WhatsApp üzerinden de ulaşabilirsiniz',
    ],
    links: [...mainLinks],
  },
  {
    path: '/kayit',
    priority: '0.4',
    noindex: true,
    title: 'Kayıt Özeti | Hype Academia',
    description:
      'Seçtiğiniz kurs, paket ve ödeme planının toplam tutarını görün ve tek adımda kayda geçin.',
    h1: 'Seçiminizi onaylayın',
    summary:
      'Kursu, paketi ve ödeme planını seçin; toplam tutar ve aylık ödeme anında hesaplansın.',
    links: [{ label: 'Fiyatlar', href: '/fiyatlar' }, ...courseLinks],
  },

  // ─── Kurs detay sayfaları ───
  ...COURSES.map<SeoRoute>((c) => ({
    path: `/kurslar/${c.slug}`,
    priority: '0.8',
    title: `Çocuklar İçin ${c.shortTitle} Kursu — ${c.ageRange} Online | Hype Academia`,
    description: `${c.ageRange} çocuklar için online ${c.shortTitle} kursu. ${c.weeks} hafta, ${totalLessons(c)} canlı ders, en fazla ${c.maxStudents} kişilik sınıf. Haftalık müfredat ve fiyat sayfada.`,
    h1: c.title,
    summary: c.intro,
    image: `/og/kurs-${c.id}.png`,
    images: [{ url: c.image, caption: `${c.title} canlı ders ekranı` }],
    facts: [
      `Yaş aralığı: ${c.ageRange} · Seviye: ${c.level}`,
      `Süre: ${c.weeks} hafta, ${totalLessons(c)} canlı ders (haftada ${c.lessonsPerWeek} ders × ${c.lessonMinutes} dakika)`,
      `Sınıf: en fazla ${c.maxStudents} öğrenci`,
      `Başlangıç fiyatı: ${formatTRY(priceFor(TIERS[0], c))}`,
      `Ön koşul: ${c.prerequisites}`,
      `Kullanılan araçlar: ${c.tools.join(', ')}`,
      ...c.curriculum.map((w) => `${w.week}. hafta — ${w.title}: ${w.topics.join('; ')}. Çıktı: ${w.project}`),
      `Bitirme projesi: ${c.finalProject}`,
    ],
    links: [
      { label: 'Tüm kurslar', href: '/kurslar' },
      { label: 'Fiyatlar', href: '/fiyatlar' },
      { label: 'Ücretsiz deneme dersi', href: '/iletisim' },
      ...courseLinks.filter((l) => l.href !== `/kurslar/${c.slug}`),
    ],
  })),

  // ─── Rehber yazıları ───
  ...ARTICLES_BY_DATE.map<SeoRoute>((a) => ({
    path: `/rehber/${a.slug}`,
    priority: '0.7',
    title: `${a.title} | Hype Academia Veli Rehberi`,
    description: a.excerpt,
    h1: a.title,
    summary: a.excerpt,
    image: `/og/rehber-${a.slug}.png`,
    facts: a.body
      .filter((b): b is { type: 'h2'; text: string } => b.type === 'h2')
      .map((b) => b.text),
    links: [
      { label: 'Veli Rehberi', href: '/rehber' },
      ...ARTICLES_BY_DATE.filter((x) => x.slug !== a.slug).map((x) => ({
        label: x.title,
        href: `/rehber/${x.slug}`,
      })),
    ],
  })),

  // ─── Hukuki metinler ───
  ...ALL_LEGAL_DOCS.map<SeoRoute>((d) => ({
    path: `/yasal/${d.slug}`,
    priority: '0.3',
    title: `${d.title} | Hype Academia`,
    // Uzun sözleşme girişleri arama sonucunda kesiliyor; 155 karaktere sığdır
    description: (d.intro ?? `Hype Academia ${d.title.toLowerCase()}.`)
      .slice(0, 152)
      .replace(/[\s,;]+\S*$/, '') + '…',
    h1: d.title,
    summary: d.intro ?? d.sections.find((x) => x.body)?.body ?? d.title,
    // Sözleşme maddelerini de bota göster: satıcı bilgileri ve iade koşulları
    // JavaScript çalıştırmadan okunabilsin.
    facts: d.sections.flatMap((x) => [
      ...(x.heading ? [x.article ? `MADDE ${x.article} — ${x.heading}` : x.heading] : []),
      ...(x.body ? [x.body] : []),
      ...(x.rows ?? []).map(([k, v]) => `${k}: ${v}`),
      ...(x.list ?? []),
      ...(x.note ? [x.note] : []),
    ]),
    links: ALL_LEGAL_DOCS.map((x) => ({ label: x.title, href: `/yasal/${x.slug}` })),
  })),
];
