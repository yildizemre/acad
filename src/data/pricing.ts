// ─────────────────────────────────────────────────────────────────────────────
// FİYATLANDIRMA MODELİ
//
// Mantık: Fiyat "kurs"a değil, DERS FORMATINA bağlıdır. Aynı müfredat üç farklı
// yoğunlukta satılır (Kulüp / Atölye / Birebir). Kurs süresi (8 veya 10 hafta)
// çarpanı belirler. Böylece yeni kurs eklendiğinde fiyat listesi değişmez.
//
// Birim mantığı: her hafta 2 canlı ders → 8 hafta = 16 ders, 10 hafta = 20 ders.
// Tüm tutarlar KDV dahil, Türk Lirası.
// ─────────────────────────────────────────────────────────────────────────────

export type TierId = 'kulup' | 'atolye' | 'birebir';

export interface Tier {
  id: TierId;
  name: string;
  subtitle: string;
  /** 8 haftalık (16 ders) programın liste fiyatı, TL */
  price8: number;
  /** 10 haftalık (20 ders) programın liste fiyatı, TL */
  price10: number;
  classSize: string;
  lessonLength: string;
  popular?: boolean;
  bestFor: string;
  features: string[];
  /** Bu katmanda olmayan, üst katmanda bulunan özellikler */
  missing?: string[];
}

export const TIERS: Tier[] = [
  {
    id: 'kulup',
    name: 'Kulüp',
    subtitle: 'Grup dersi — arkadaşlarıyla birlikte öğrenir',
    price8: 8900,
    price10: 10900,
    classSize: 'Maks. 8 öğrenci',
    lessonLength: 'Haftada 2 ders × 60 dk',
    bestFor: 'İlk kez kodlamayla tanışan, akran ortamında motive olan çocuklar',
    features: [
      'Haftada 2 canlı online ders (8 haftada toplam 16 ders)',
      'Maksimum 8 kişilik sabit sınıf, sabit eğitmen',
      'Her ders sonunda uygulamalı ödev ve yazılı geri bildirim',
      'Ders kayıtlarına 12 ay boyunca erişim',
      'Aylık veli gelişim raporu',
      'Kurs sonunda bitirme projesi ve Demo Günü sunumu',
      'E-Devlet onaylı tamamlama sertifikası',
      'Öğrenci paneli: ödev takibi, devam durumu, not defteri',
    ],
    missing: ['Birebir mentor seansı', 'Kişiye özel müfredat', 'Yarışma hazırlığı'],
  },
  {
    id: 'atolye',
    name: 'Atölye',
    subtitle: 'Küçük grup + aylık birebir mentorluk',
    price8: 13900,
    price10: 16900,
    classSize: 'Maks. 4 öğrenci',
    lessonLength: 'Haftada 2 ders × 60 dk',
    popular: true,
    bestFor: 'Hızlı ilerleyen, projesini derinleştirmek isteyen öğrenciler',
    features: [
      'Kulüp paketindeki her şey',
      'Maksimum 4 kişilik butik sınıf — söz hakkı iki katına çıkar',
      'Ayda 1 adet 45 dakikalık birebir mentor seansı',
      'Kişiselleştirilmiş bitirme projesi (öğrencinin kendi fikri)',
      'Hafta içi eğitmene mesajla soru sorma hakkı',
      'Dönem ortası birebir veli görüşmesi',
      'GitHub portfolyo kurulumu ve projelerin yayınlanması',
    ],
    missing: ['Tamamen kişiye özel müfredat', 'Haftalık esnek saat seçimi'],
  },
  {
    id: 'birebir',
    name: 'Birebir',
    subtitle: 'Tamamen kişiye özel program ve takvim',
    price8: 24900,
    price10: 29900,
    classSize: '1 öğrenci — 1 eğitmen',
    lessonLength: 'Haftada 2 ders × 60 dk (esnek)',
    bestFor:
      'Yarışmaya hazırlanan, özel ilgi alanı olan veya kendi hızında ilerlemesi gereken öğrenciler',
    features: [
      'Atölye paketindeki her şey',
      'Birebir canlı ders — tempo tamamen öğrenciye göre ayarlanır',
      'Ders saatlerini haftalık olarak değiştirebilme esnekliği',
      'Öğrencinin hedefine göre yeniden yazılan müfredat',
      'Yarışma hazırlığı desteği (Teknofest, TÜBİTAK, Bebras)',
      'Sınırsız ödev geri bildirimi',
      'Dönem sonunda kariyer ve yönelim danışmanlığı görüşmesi',
    ],
  },
];

// ─── Öğrenme patikaları (paket satış) ────────────────────────────────────────

export interface Path {
  id: string;
  name: string;
  ageRange: string;
  duration: string;
  courseIds: string[];
  /** Kulüp katmanında tek tek alınsa ödenecek toplam */
  listPrice: number;
  /** Patika olarak alındığında ödenecek tutar */
  price: number;
  outcome: string;
}

export const PATHS: Path[] = [
  {
    id: 'kesif',
    name: 'Keşif Yılı',
    ageRange: '8–11 yaş',
    duration: '2 dönem · 16 hafta · 32 ders',
    courseIds: ['scratch', 'robotics'],
    listPrice: 17800,
    price: 14900,
    outcome:
      'Blok tabanlı kodlamadan fiziksel robotiğe geçer. Yıl sonunda hem kendi oyununu hem kendi robotunu yapmış olur.',
  },
  {
    id: 'uretici',
    name: 'Üretici Yılı',
    ageRange: '11–14 yaş',
    duration: '2 dönem · 18 hafta · 36 ders',
    courseIds: ['python', 'web'],
    listPrice: 19800,
    price: 16900,
    outcome:
      'Gerçek metin tabanlı programlamaya geçer. Yıl sonunda internette yayında olan kendi web sitesi ve çalışan Python projeleri olur.',
  },
  {
    id: 'muhendis',
    name: 'Mühendis Yılı',
    ageRange: '14–17 yaş',
    duration: '2 dönem · 18 hafta · 36 ders',
    courseIds: ['unity', 'ai'],
    listPrice: 21800,
    price: 18900,
    outcome:
      'Üniversite düzeyine yaklaşan konularla tanışır. Yıl sonunda yayınlanabilir bir oyunu ve kendi eğittiği bir yapay zeka modeli olur.',
  },
];

// ─── Ödeme planları ──────────────────────────────────────────────────────────

export interface PaymentPlan {
  id: string;
  name: string;
  badge?: string;
  /** Liste fiyatına uygulanan çarpan. 0.90 = %10 indirim, 1.05 = %5 vade farkı */
  multiplier: number;
  installments: number;
  description: string;
  note?: string;
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'pesin',
    name: 'Peşin Ödeme',
    badge: '%10 indirim',
    multiplier: 0.9,
    installments: 1,
    description:
      'Kurs ücretinin tamamı kayıt sırasında ödenir. En düşük toplam tutarı bu seçenek verir.',
    note: 'Havale / EFT veya kredi kartına tek çekim.',
  },
  {
    id: 'taksit3',
    name: '3 Taksit',
    badge: 'Faizsiz',
    multiplier: 1,
    installments: 3,
    description: 'Kredi kartına 3 eşit taksit. Liste fiyatı üzerinden, vade farkı yoktur.',
  },
  {
    id: 'taksit6',
    name: '6 Taksit',
    badge: 'Faizsiz · En çok tercih edilen',
    multiplier: 1,
    installments: 6,
    description:
      'Kredi kartına 6 eşit taksit. Kurs bittikten sonra da ödemesi devam eder, aylık yük en dengeli seçenektir.',
  },
  {
    id: 'taksit9',
    name: '9 Taksit',
    badge: 'Faizsiz',
    multiplier: 1,
    installments: 9,
    description: 'Anlaşmalı bankaların kredi kartlarına 9 eşit taksit.',
    note: 'Anlaşmalı bankalar: Garanti BBVA, İş Bankası, Yapı Kredi, Akbank, QNB.',
  },
  {
    id: 'taksit12',
    name: '12 Taksit',
    badge: '%5 vade farkı',
    multiplier: 1.05,
    installments: 12,
    description: 'En düşük aylık tutar. Banka vade farkı nedeniyle toplam tutar %5 artar.',
  },
  {
    id: 'aylik',
    name: 'Aylık Esnek',
    badge: 'Taahhütsüz',
    multiplier: 1.12,
    installments: 2,
    description:
      'Kursu 4 haftalık dilimler hâlinde ay ay ödersiniz, istediğiniz ay bırakabilirsiniz. Esneklik primi %12.',
    note: 'Kararsız veliler için. Devam etmeye karar verirseniz peşin plana geçiş yapılabilir.',
  },
];

// ─── İndirimler ──────────────────────────────────────────────────────────────

export interface Discount {
  name: string;
  amount: string;
  detail: string;
  stackable: boolean;
}

export const DISCOUNTS: Discount[] = [
  {
    name: 'Kardeş İndirimi',
    amount: '%15',
    detail: 'Aynı aileden ikinci ve sonraki her öğrenci için geçerlidir, süresizdir.',
    stackable: true,
  },
  {
    name: 'Erken Kayıt',
    amount: '%10',
    detail: 'Dönem başlangıcından en az 3 hafta önce yapılan kayıtlarda uygulanır.',
    stackable: false,
  },
  {
    name: 'Patika İndirimi',
    amount: "%15'e varan",
    detail:
      'İki kursu öğrenme patikası olarak birlikte aldığınızda otomatik uygulanır; patika fiyatlarına zaten dahildir.',
    stackable: false,
  },
  {
    name: 'Referans Kredisi',
    amount: '1.000 TL',
    detail:
      'Sizin önerinizle kayıt olan her öğrenci için hesabınıza 1.000 TL kredi tanımlanır, sonraki kursunuzda kullanılır.',
    stackable: true,
  },
  {
    name: 'Öğretmen & Kamu Çalışanı',
    amount: '%10',
    detail: 'Öğretmen, akademisyen ve kamu çalışanı velilerin çocukları için geçerlidir.',
    stackable: false,
  },
  {
    name: 'Burs Programı',
    amount: '%50 – %100',
    detail:
      "Maddi imkânı kısıtlı ve başarılı öğrenciler için. Her dönem kontenjanın %10'u burslu öğrencilere ayrılır; başvurular mülakatla değerlendirilir.",
    stackable: false,
  },
];

/**
 * İndirim kuralı — sitede açıkça yazılması gereken şey budur. Yazılmazsa
 * "indirimler birleşiyor mu?" sorusu her seferinde WhatsApp hattına düşer.
 */
export const DISCOUNT_RULE =
  'Yüzdelik indirimlerden yalnızca en yüksek olan uygulanır, üst üste binmez. Kardeş indirimi ve referans kredisi bu kuralın istisnasıdır — diğer indirimlerin üzerine eklenir.';

// ─── Hesaplama yardımcıları ──────────────────────────────────────────────────

/** Katman ve kurs süresine göre liste fiyatını döner. */
export function priceFor(tier: Tier, weeks: number): number {
  return weeks >= 10 ? tier.price10 : tier.price8;
}

/** Bir ödeme planının toplam tutarını hesaplar (10 TL'ye yuvarlanır). */
export function totalFor(base: number, plan: PaymentPlan): number {
  return Math.round((base * plan.multiplier) / 10) * 10;
}

/** Aylık taksit tutarını hesaplar. */
export function installmentFor(base: number, plan: PaymentPlan): number {
  return Math.round(totalFor(base, plan) / plan.installments / 10) * 10;
}

/** 12345 → "12.345 TL" */
export function formatTRY(value: number): string {
  return `${value.toLocaleString('tr-TR')} TL`;
}

/** Ders başına düşen maliyet — velinin en çok merak ettiği rakam. */
export function perLesson(base: number, weeks: number): number {
  return Math.round(base / (weeks * 2) / 5) * 5;
}
