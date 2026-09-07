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
    title: 'Hype Academia | 8–17 Yaş Online Yazılım, Kodlama ve Yapay Zeka Eğitimi',
    description:
      '8–17 yaş arası çocuklara canlı online Python, Scratch, Unity, Web, Yapay Zeka ve Arduino Robotik eğitimi. Hafta hafta açık müfredat, sitede yazılı fiyatlar, ücretsiz deneme dersi.',
    h1: 'Çocuğunuz ekranın üretici tarafına geçsin',
    summary: `${SITE.foundedYear} yılında ${SITE.parentInstitution} bünyesinde kurulan Hype Academia, 8–17 yaş arası çocuklara canlı online yazılım, robotik ve yapay zeka eğitimi verir. Müfredat hafta hafta açıktır, fiyatlar sitede yazılıdır, ilk ders ücretsizdir.`,
    facts: [
      'Maksimum 8 kişilik canlı sınıflar',
      'E-Devlet üzerinden doğrulanabilir tamamlama sertifikası',
      'İlk 2 ders içinde koşulsuz iade',
      'Her ders kaydedilir, 12 ay erişilebilir',
      `İletişim: ${SITE.phoneDisplay} · ${SITE.email}`,
    ],
    links: [...mainLinks, ...courseLinks],
  },
  {
    path: '/kurslar',
    priority: '0.9',
    title: 'Kurslar ve Haftalık Müfredatlar | Hype Academia',
    description:
      'Scratch, Python, Web Geliştirme, Unity, Yapay Zeka ve Arduino Robotik kursları. Her kursun hafta hafta müfredatı, ön koşulları ve fiyatı kayıt olmadan görülebilir.',
    h1: 'Her kursun müfredatı hafta hafta açık',
    summary:
      'Çocuğunuzun hangi hafta neyi öğreneceğini, hangi projeyi bitireceğini ve kurs sonunda elinde ne kalacağını kayıt olmadan önce görebilirsiniz.',
    facts: COURSES.map(
      (c) =>
        `${c.title} — ${c.ageRange}, ${c.level}, ${c.weeks} hafta / ${totalLessons(c)} canlı ders, ${formatTRY(priceFor(TIERS[0], c.weeks))} başlangıç fiyatı`,
    ),
    images: COURSES.map((c) => ({ url: c.image, caption: `${c.title} ders ekranı` })),
    links: [...courseLinks, { label: 'Fiyatlar', href: '/fiyatlar' }],
  },
  {
    path: '/projeler',
    priority: '0.8',
    title: 'Bitirme Projeleri — Kurs Sonunda Ne Üretiliyor? | Hype Academia',
    description:
      'Her kursun son haftasında öğrencinin ürettiği iş: oyunlar, web siteleri, robotik sistemler ve yapay zeka modelleri. Kurs sonunda elinizde ne kalacağını görün.',
    h1: '8 hafta sonunda elinde ne kalıyor?',
    summary:
      'Her kurs bir bitirme projesiyle sonuçlanır ve öğrenci bunu Demo Günü’nde canlı sunar. Aşağıda her programın ürettiği proje ve öğrencinin yolda çözmesi gereken problem yazılıdır.',
    facts: PROJECTS.map((p) => `${p.title} — ${p.brief}`),
    images: PROJECTS.map((p) => ({
      url: p.image,
      caption: `${p.title} — ${p.brief}`,
    })),
    links: [...courseLinks],
  },
  {
    path: '/fiyatlar',
    priority: '0.9',
    title: 'Fiyatlar, Paketler ve Ödeme Planları | Hype Academia',
    description:
      'Kulüp, Atölye ve Birebir paket fiyatları, faizsiz taksit seçenekleri, kardeş ve erken kayıt indirimleri ile iade politikası. Hesaplayıcıyla ödeyeceğiniz tutarı anında görün.',
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
    title: 'Veli Rehberi — Çocuklar ve Kodlama | Hype Academia',
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
    priority: '0.8',
    title: 'Ücretsiz Deneme Dersi ve İletişim | Hype Academia',
    description:
      'Formu doldurun, 48 saat içinde arayalım ve çocuğunuz için 1 saatlik ücretsiz deneme dersini planlayalım. Kart bilgisi istenmez.',
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
    title: `${c.title} — ${c.ageRange} Online Kurs | Hype Academia`,
    description: `${c.summary} ${c.weeks} hafta, ${totalLessons(c)} canlı ders, maksimum ${c.maxStudents} öğrenci. Haftalık müfredat, ön koşullar ve fiyatlar sayfada.`,
    h1: c.title,
    summary: c.intro,
    image: c.image,
    images: [{ url: c.image, caption: `${c.title} canlı ders ekranı` }],
    facts: [
      `Yaş aralığı: ${c.ageRange} · Seviye: ${c.level}`,
      `Süre: ${c.weeks} hafta, ${totalLessons(c)} canlı ders (haftada ${c.lessonsPerWeek} ders × ${c.lessonMinutes} dakika)`,
      `Sınıf: en fazla ${c.maxStudents} öğrenci`,
      `Başlangıç fiyatı: ${formatTRY(priceFor(TIERS[0], c.weeks))}`,
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
    description: d.intro ?? `Hype Academia ${d.title.toLowerCase()} — son güncelleme ${d.updated}.`,
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
