// ─────────────────────────────────────────────────────────────────────────────
// KURUMSAL İÇERİK
// SSS, kayıt süreci, eğitmenler, değerler, iade politikası ve hukuki metinler.
// Footer modallarına gömülü olan içerik buraya taşındı; artık gerçek sayfalar.
// ─────────────────────────────────────────────────────────────────────────────

import { COMMERCE_DOCS } from './legal-docs';

export interface Faq {
  q: string;
  a: string;
  category: 'genel' | 'dersler' | 'odeme' | 'teknik';
}

export const FAQS: Faq[] = [
  // ── Genel
  {
    category: 'genel',
    q: 'Hype Academia kimdir?',
    a: '2020 yılında Gebze Teknik Üniversitesi bünyesinde kurulmuş bir teknoloji eğitim platformuyuz. Kurucu ekibimiz bilgisayarla görü, derin öğrenme ve görüntü işleme alanlarında Türkiye’nin önde gelen sanayi kuruluşlarına yapay zeka çözümleri geliştiriyor. Bu endüstriyel birikimi çocuklara aktarmak için kurulduk.',
  },
  {
    category: 'genel',
    q: 'Hangi yaş grubuna eğitim veriyorsunuz?',
    a: '8–17 yaş arası çocuk ve gençlere eğitim veriyoruz. Her kursun kendi yaş aralığı vardır; yaş filtresini kullanarak çocuğunuza uygun kursları görebilirsiniz.',
  },
  {
    category: 'genel',
    q: 'E-Devlet onaylı sertifika nedir?',
    a: 'Kursu tamamlayan öğrenciler, E-Devlet sistemi üzerinden doğrulanabilen resmî bir tamamlama sertifikası alır. Sertifika öğrencinin adına düzenlenir ve üniversite başvurusu, staj veya portfolyo için kanıt olarak kullanılabilir.',
  },
  {
    category: 'genel',
    q: 'Hangi ülkelerden katılım mümkün?',
    a: 'Dersler tamamen online olduğu için Türkçe bilen her ülkeden katılım mümkündür. Yurt dışındaki öğrencilerimiz için saat dilimi farkına göre özel gruplar açıyoruz.',
  },
  {
    category: 'genel',
    q: 'Burs veriyor musunuz?',
    a: 'Evet. Her dönem kontenjanımızın %10’unu maddi imkânı kısıtlı ve başarılı öğrencilere ayırıyoruz. Burs oranı %50 ile %100 arasında değişir, başvurular kısa bir görüşmeyle değerlendirilir.',
  },

  // ── Dersler
  {
    category: 'dersler',
    q: 'Dersler canlı mı, video kaydı mı?',
    a: 'Tüm dersler canlıdır — eğitmen ve öğrenci aynı anda bağlanır, soru sorulur, kod birlikte yazılır. Ayrıca her ders kaydedilir ve öğrenci 12 ay boyunca kayıtlara tekrar erişebilir.',
  },
  {
    category: 'dersler',
    q: 'Sınıflar kaç kişilik?',
    a: 'Kulüp paketinde maksimum 8, Atölye paketinde maksimum 4 öğrenci. Birebir pakette tek öğrenci. Grupları kasıtlı olarak küçük tutuyoruz; kalabalık sınıfta çocuk soru sormaya çekiniyor.',
  },
  {
    category: 'dersler',
    q: 'Çocuğumun önceden kodlama bilgisi olması gerekiyor mu?',
    a: 'Başlangıç kurslarımız (Scratch, Arduino, Web) için hayır — sıfırdan başlanır. Unity ve Yapay Zeka kurslarımız için temel programlama bilgisi gerekiyor; kurs sayfalarında ön koşullar açıkça yazılıdır.',
  },
  {
    category: 'dersler',
    q: 'Bir dersi kaçırırsak ne olur?',
    a: 'Ders kaydı aynı gün panelinize yüklenir. Ayrıca dönem başına 2 telafi hakkınız vardır: en az 24 saat önce bildirirseniz dersi başka bir gruba veya telafi saatine alıyoruz.',
  },
  {
    category: 'dersler',
    q: 'Veli olarak süreci nasıl takip ederim?',
    a: 'Öğrenci panelinden devam durumunu, ödevleri ve eğitmen notlarını görebilirsiniz. Ayrıca her ay yazılı gelişim raporu gönderiyoruz ve dönem ortasında birebir veli görüşmesi yapıyoruz.',
  },
  {
    category: 'dersler',
    q: 'Ders saatleri nasıl belirleniyor?',
    a: 'Kayıt sırasında uygun gün ve saatlerinizi alıyor, benzer takvime sahip öğrencileri aynı gruba yerleştiriyoruz. Hafta içi akşam ve hafta sonu sabah/öğleden sonra seçenekleri mevcut. Birebir pakette saatler tamamen esnektir.',
  },

  // ── Ödeme
  {
    category: 'odeme',
    q: 'Fiyatlar neden pakete göre değişiyor?',
    a: 'Müfredat aynıdır, değişen şey ilgi yoğunluğudur. Kulüp 8 kişilik gruptur, Atölye 4 kişilik gruba ek olarak aylık birebir mentorluk içerir, Birebir pakette eğitmen tamamen tek öğrenciye ayrılır. Fiyat farkı bu eğitmen zamanından kaynaklanır.',
  },
  {
    category: 'odeme',
    q: 'Taksit imkânı var mı?',
    a: 'Evet. 3, 6 ve 9 taksit faizsizdir. 12 taksitte %5 vade farkı uygulanır. Peşin ödemede %10 indirim vardır. Ayrıca taahhütsüz aylık ödeme seçeneğimiz mevcuttur.',
  },
  {
    category: 'odeme',
    q: 'İndirimler birleşir mi?',
    a: 'Yüzdelik indirimlerden yalnızca en yüksek olan uygulanır. Kardeş indirimi ve referans kredisi bu kuralın istisnasıdır — diğer indirimlerin üzerine eklenir.',
  },
  {
    category: 'odeme',
    q: 'Memnun kalmazsam param geri döner mi?',
    a: 'Evet. İlk iki ders içinde iptal talep ederseniz ödemenin tamamı koşulsuz iade edilir. Ders başlamadan yapılan iptallerde de tam iade yapılır.',
  },
  {
    category: 'odeme',
    q: 'Gizli ek ücret var mı?',
    a: 'Yok. Sertifika, ders kayıtları, öğrenci paneli ve Arduino kursundaki donanım seti dahil her şey kurs ücretine dahildir. Kargo ücreti de bize aittir.',
  },

  // ── Teknik
  {
    category: 'teknik',
    q: 'Hangi teknik ekipman gerekiyor?',
    a: 'Kamera ve mikrofonu olan, internete bağlı bir bilgisayar yeterlidir. Unity kursu için en az 8 GB RAM ve ayrı ekran kartı öneriyoruz. Arduino kursunda donanım setini biz gönderiyoruz.',
  },
  {
    category: 'teknik',
    q: 'Tablet ile katılabilir mi?',
    a: 'Scratch dışındaki kurslar için önermiyoruz; kod yazmak ve program kurmak gerçek bir klavye ve masaüstü işletim sistemi gerektiriyor. Scratch kursunda bile sürükle-bırak tablette zorlaşıyor.',
  },
  {
    category: 'teknik',
    q: 'Hangi platform üzerinden ders yapılıyor?',
    a: 'Canlı dersler Zoom veya Google Meet üzerinden yapılır. Ödevler, ders kayıtları ve gelişim raporları Hype Academia öğrenci panelinde toplanır.',
  },
  {
    category: 'teknik',
    q: 'Program kurulumunu kim yapacak?',
    a: 'İlk derste eğitmenimiz ekran paylaşımıyla adım adım birlikte kuruyor. Gerekirse kayıt sonrası ayrı bir teknik hazırlık seansı da planlıyoruz — ücretsizdir.',
  },
];

export const FAQ_CATEGORIES = [
  { id: 'genel', label: 'Genel' },
  { id: 'dersler', label: 'Dersler & İşleyiş' },
  { id: 'odeme', label: 'Ödeme & İade' },
  { id: 'teknik', label: 'Teknik Gereksinimler' },
] as const;

// ─── Kayıt süreci ────────────────────────────────────────────────────────────

export const PROCESS = [
  {
    n: '01',
    title: 'Ücretsiz Danışma',
    duration: '15 dakika',
    desc: 'Sizi arıyoruz. Çocuğunuzun yaşını, ilgi alanlarını ve daha önce ne yaptığını konuşuyoruz. Hangi kursun uygun olduğunu birlikte belirliyoruz.',
  },
  {
    n: '02',
    title: 'Ücretsiz Deneme Dersi',
    duration: '1 saat',
    desc: 'Çocuğunuz gerçek bir eğitmenle gerçek bir ders yapıyor. Platformu, eğitmeni ve yöntemi deneyimliyor. Hiçbir yükümlülük yok, kart bilgisi istemiyoruz.',
  },
  {
    n: '03',
    title: 'Paket ve Takvim Seçimi',
    duration: '10 dakika',
    desc: 'Kulüp, Atölye veya Birebir paketlerinden birini seçiyorsunuz. Uygun gün ve saatlerinizi alıp grubunuzu belirliyoruz.',
  },
  {
    n: '04',
    title: 'Kayıt ve Ödeme',
    duration: 'Aynı gün',
    desc: 'Ödeme planınızı seçiyorsunuz: peşin, taksitli veya aylık esnek. Sözleşme ve fatura e-posta ile gönderiliyor.',
  },
  {
    n: '05',
    title: 'Öğrenme Yolculuğu',
    duration: '8–10 hafta',
    desc: 'Canlı dersler başlıyor. Her ders sonunda ödev ve geri bildirim, her ay veli raporu, dönem ortasında birebir görüşme.',
  },
  {
    n: '06',
    title: 'Demo Günü ve Sertifika',
    duration: 'Son hafta',
    desc: 'Öğrenci bitirme projesini ailesine ve sınıfına canlı sunuyor. E-Devlet onaylı sertifikasını alıyor ve bir sonraki adımı planlıyoruz.',
  },
] as const;

// ─── Eğitmenler ──────────────────────────────────────────────────────────────
//
// ⚠️  İsimler şu an baş harfle kısaltılmış durumda ("Müh. Ahmet K.").
//     Bu, güven vermek yerine tam tersini yapıyor — uydurma gibi okunuyor.
//     Eğitmenlerden izin alıp tam ad, fotoğraf ve profil bağlantısı ekleyin:
//
//       { initials: 'AK', name: 'Ahmet Kaya', photo: '/images/egitmen-ahmet.jpg',
//         profile: 'https://linkedin.com/in/...', ... }
//
//     `photo` verilince kart fotoğrafı, `profile` verilince profil bağlantısını
//     gösterir. İkisi de boşken bugünkü baş harf kutusu kullanılır.

export interface Teacher {
  initials: string;
  name: string;
  title: string;
  exp: string;
  courses: string;
  photo?: string;
  profile?: string;
}

export const TEACHERS: Teacher[] = [
  {
    initials: 'AK',
    name: 'Müh. Ahmet K.',
    title: 'Bilgisayarla Görü Uzmanı',
    exp: '8 yıl sektör deneyimi. Görüntü işleme ve derin öğrenme alanında büyük ölçekli sanayi projelerinde yer aldı.',
    courses: 'Python, Yapay Zeka & ML',
  },
  {
    initials: 'ZT',
    name: 'Müh. Zeynep T.',
    title: 'Full-Stack Yazılım Mühendisi',
    exp: '6 yıl deneyim. Fintech ve e-ticaret şirketlerinde web uygulamaları geliştirdi.',
    courses: 'Web Tasarım & Geliştirme',
  },
  {
    initials: 'CM',
    name: 'Müh. Can M.',
    title: 'Yapay Zeka Araştırmacısı',
    exp: 'Gebze Teknik Üniversitesi’nde araştırma görevlisi. Makine öğrenmesi üzerine akademik yayınları var.',
    courses: 'Yapay Zeka & ML, Python',
  },
  {
    initials: 'ES',
    name: 'Müh. Elif S.',
    title: 'Robotik & Gömülü Sistemler Uzmanı',
    exp: '5 yıl deneyim. IoT ve robotik projelerinde endüstriyel otomasyon sistemleri geliştirdi.',
    courses: 'Arduino & Robotik',
  },
  {
    initials: 'BD',
    name: 'Müh. Burak D.',
    title: 'Oyun Geliştirici',
    exp: '7 yıl deneyim. Unity ve Unreal Engine ile mobil ve PC oyunları geliştirdi.',
    courses: 'Unity Oyun Geliştirme, Scratch',
  },
];

// ─── Değerler ────────────────────────────────────────────────────────────────

export const VALUES = [
  {
    title: 'Merak ve Özgürlük',
    desc: 'Çocuk kendi fikrini denerken öğrenir. Müfredat bir sınır değil, bir zemin.',
  },
  {
    title: 'Uygulamalı Öğrenme',
    desc: 'Hiçbir ders sadece anlatımla geçmez. Her derste öğrenci kendi kodunu yazar.',
  },
  {
    title: 'Gerçek Projeler',
    desc: 'Alıştırma değil, çalışan ve paylaşılabilen ürünler üretiyoruz.',
  },
  {
    title: 'Sektörel Yetkinlik',
    desc: 'Eğitmenlerimiz aktif olarak sektörde çalışan mühendisler. Anlattıkları şeyi kendileri yapıyor.',
  },
  {
    title: 'Şeffaf İletişim',
    desc: 'Fiyatlar açık, politikalar yazılı, gelişim raporları düzenli. Sürpriz yok.',
  },
] as const;

// ─── İade politikası ─────────────────────────────────────────────────────────

export const REFUND_POLICY = [
  {
    title: 'Ders Başlamadan İptal',
    result: 'Tam iade',
    detail: 'İlk ders başlamadan yapılan iptallerde ödemenin tamamı iade edilir.',
    positive: true,
  },
  {
    title: 'İlk 2 Ders İçinde İptal',
    result: 'Tam iade',
    detail:
      'İkinci ders bitene kadar talep ederseniz ödemenin tamamı koşulsuz iade edilir. Gerekçe sormuyoruz, önceden haber verme şartı aranmaz.',
    positive: true,
  },
  {
    title: '2. Dersten Sonra İptal',
    result: 'İade yok, hak devri var',
    detail:
      'Ücret iadesi yapılmaz; ancak dersleri sonraki döneme erteleme veya başka bir kursa geçiş hakkı tanınır.',
    positive: false,
  },
  {
    title: 'Bizden Kaynaklı Aksaklık',
    result: 'Telafi veya tam iade',
    detail:
      'Platformumuzdan kaynaklanan teknik aksaklıklarda alternatif ders saati sunulur veya talebiniz hâlinde tam iade yapılır.',
    positive: true,
  },
] as const;

/**
 * Not: "48 saat" kuralı iade hakkıyla ilgili DEĞİLDİR. İade penceresi ders
 * sayısına bağlıdır (ilk 2 ders). 48 saat yalnızca tek bir dersi erteleme
 * veya telafiye alma talepleri için geçerlidir. İkisi karıştırılmasın diye
 * ayrı ayrı yazıldı.
 */
export const REFUND_NOTES = [
  {
    title: 'İade talebi nasıl yapılır?',
    text: 'E-posta veya WhatsApp üzerinden yazılı olarak bildirmeniz yeterlidir. Önceden haber verme zorunluluğu yoktur — ilk iki ders içindeyseniz talep gününde geçerlidir. Gerekçe sormuyoruz.',
  },
  {
    title: 'İade ne zaman hesabınıza geçer?',
    text: 'Talebin onayından sonra 7 iş günü içinde, ödemeyi yaptığınız yönteme iade edilir. Taksitli ödemelerde bankanın iade süresi birkaç gün uzayabilir.',
  },
  {
    title: '48 saat kuralı neyle ilgili?',
    text: 'Yalnızca tek bir dersi erteleme veya telafiye alma taleplerini kapsar; dersten en az 24 saat önce bildirmeniz gerekir. İade hakkınızla hiçbir ilgisi yoktur.',
  },
];

// ─── Hukuki metinler ─────────────────────────────────────────────────────────

export interface LegalSection {
  /** Madde numarası — "MADDE 1" gibi bir başlık üretilir */
  article?: string;
  heading?: string;
  body?: string;
  list?: string[];
  /** Ad–değer tablosu (taraf bilgileri, hizmet künyesi) */
  rows?: [string, string][];
  /** Vurgulanacak uyarı kutusu */
  note?: string;
}

export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  /** Sayfa başında görünen kısa açıklama */
  intro?: string;
  sections: LegalSection[];
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: 'gizlilik',
    title: 'Gizlilik Politikası',
    updated: 'Ocak 2025',
    sections: [
      {
        body: 'Hype Academia olarak kişisel verilerinizin güvenliğine büyük önem veriyoruz. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızın neler olduğunu açıklar.',
      },
      {
        heading: 'Toplanan Veriler',
        list: [
          'Ad, soyad ve iletişim bilgileri (telefon, e-posta)',
          'Öğrenci yaşı ve eğitim tercihleri',
          'Ders katılım ve ilerleme verileri',
          'Platform kullanım istatistikleri',
        ],
      },
      {
        heading: 'Verilerin Kullanımı',
        body: 'Toplanan veriler yalnızca eğitim hizmetlerinin sunumu, iletişim ve hizmet geliştirme amacıyla kullanılır. Verileriniz üçüncü taraflarla paylaşılmaz, satılmaz veya reklam amacıyla kullanılmaz.',
      },
      {
        heading: 'Çocuk Verilerinin Korunması',
        body: '18 yaş altı öğrencilere ait veriler yalnızca veli onayıyla işlenir. Ders kayıtları yalnızca ilgili öğrenci ve velisiyle paylaşılır, kamuya açık hâle getirilmez.',
      },
      {
        heading: 'Haklarınız',
        body: '6698 sayılı KVKK kapsamında verilerinize erişim, düzeltme, silme ve itiraz hakkına sahipsiniz. Talepleriniz için: kvkk@hypeacademia.com',
      },
    ],
  },
  {
    slug: 'kullanim-kosullari',
    title: 'Kullanım Koşulları',
    updated: 'Ocak 2025',
    sections: [
      {
        body: 'Hype Academia platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.',
      },
      {
        heading: 'Hizmet Kapsamı',
        body: 'Hype Academia, 8–17 yaş arasındaki çocuklara yönelik online teknoloji eğitimi hizmetleri sunar. Dersler canlı video konferans yoluyla gerçekleştirilir.',
      },
      {
        heading: 'Kullanıcı Yükümlülükleri',
        list: [
          'Platformun yasal amaçlarla kullanılması',
          'Diğer kullanıcılara zarar verecek davranışlardan kaçınılması',
          'Ders materyallerinin ticari amaçla kullanılmaması veya dağıtılmaması',
          'Ders kayıtlarının izinsiz paylaşılmaması',
        ],
      },
      {
        heading: 'Fikri Mülkiyet',
        body: 'Tüm ders içerikleri, materyaller ve platform tasarımı Hype Academia’ya aittir. İzinsiz çoğaltılamaz veya dağıtılamaz. Öğrencinin derste ürettiği projeler ise öğrenciye aittir.',
      },
      {
        heading: 'Değişiklikler',
        body: 'Kullanım koşulları güncellenebilir. Önemli değişiklikler kayıtlı e-posta adresinize bildirilir; güncel sürüme her zaman bu sayfadan ulaşabilirsiniz.',
      },
    ],
  },
  {
    slug: 'kvkk',
    title: 'KVKK Aydınlatma Metni',
    updated: 'Ocak 2025',
    sections: [
      {
        body: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla Hype Academia olarak kişisel verilerinizi aşağıda açıklanan amaç ve yöntemlerle işlemekteyiz.',
      },
      {
        heading: 'Veri Sorumlusu',
        body: 'Hype Academia — Gebze Teknik Üniversitesi, Gebze / Kocaeli',
      },
      {
        heading: 'İşlenen Kişisel Veriler',
        list: [
          'Kimlik bilgileri (ad, soyad)',
          'İletişim bilgileri (telefon, e-posta)',
          'Eğitim ve ilerleme verileri',
          'Ödeme ve fatura bilgileri',
        ],
      },
      {
        heading: 'İşleme Amaçları',
        list: [
          'Eğitim hizmetlerinin sunulması ve koordinasyonu',
          'Sözleşme ilişkisinin yürütülmesi',
          'Veli bilgilendirme raporlarının hazırlanması',
          'Yasal yükümlülüklerin yerine getirilmesi',
        ],
      },
      {
        heading: 'Haklarınız (KVKK Madde 11)',
        list: [
          'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
          'İşlenen veriler hakkında bilgi talep etme',
          'Verilerin düzeltilmesini veya silinmesini isteme',
          'İşlemenin kısıtlanmasını talep etme',
          'Veri taşınabilirliği hakkı',
        ],
      },
      {
        heading: 'İletişim',
        body: 'Talepleriniz için: kvkk@hypeacademia.com — başvurularınız en geç 30 gün içinde yanıtlanır.',
      },
    ],
  },
];

/** Gizlilik/KVKK/koşullar + ticari sözleşmeler — tek liste. */
export const ALL_LEGAL_DOCS: LegalDoc[] = [...LEGAL_DOCS, ...COMMERCE_DOCS];

export function legalBySlug(slug: string): LegalDoc | undefined {
  return ALL_LEGAL_DOCS.find((d) => d.slug === slug);
}

// ─── Açık pozisyonlar ────────────────────────────────────────────────────────

export const JOBS = [
  {
    pos: 'Online Eğitmen — Python & Yapay Zeka',
    type: 'Tam Zamanlı / Part-Time',
    detail:
      'Python veya makine öğrenmesi alanında en az 3 yıl deneyim. Pedagojik formasyon veya eğitim deneyimi tercih sebebi.',
  },
  {
    pos: 'Online Eğitmen — Web Geliştirme',
    type: 'Part-Time',
    detail: 'HTML, CSS, JavaScript ve tercihen React bilgisi. Online ders verme deneyimi artı.',
  },
  {
    pos: 'Online Eğitmen — Robotik & Arduino',
    type: 'Part-Time',
    detail:
      'Gömülü sistemler veya elektronik alanında deneyim. Çocuklarla iletişim kurma becerisi önemli.',
  },
  {
    pos: 'Öğrenci Koordinatörü',
    type: 'Tam Zamanlı',
    detail:
      'Öğrenci–veli iletişimini yönetir, kayıt süreçlerini koordine eder. CRM deneyimi tercih sebebi.',
  },
  {
    pos: 'Sosyal Medya & İçerik Uzmanı',
    type: 'Part-Time',
    detail:
      'Instagram, TikTok ve YouTube için içerik üretimi. Video düzenleme ve grafik tasarım bilgisi.',
  },
] as const;
