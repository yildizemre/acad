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

import { COURSES, totalLessons, type Course } from './courses';

export type TierId = 'kulup' | 'atolye' | 'birebir';

export interface Tier {
  id: TierId;
  name: string;
  subtitle: string;
  /** 8 haftalık (16 ders) programın liste fiyatı, TL */
  price8: number;
  /** 10 haftalık (20 ders) programın liste fiyatı, TL */
  price10: number;
  /** Bu katmanın sınıf üst sınırı. Kursun kendi sınırı daha düşükse o geçerli. */
  maxStudents: number;
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
    maxStudents: 8,
    lessonLength: 'Haftada 2 canlı ders',
    bestFor: 'İlk kez kodlamayla tanışan, akran ortamında motive olan çocuklar',
    features: [
      'Haftada 2 canlı online ders — 8 haftalık kursta 16, 10 haftalık kursta 20 ders',
      'En fazla 8 kişilik sabit sınıf, sabit eğitmen (bazı kurslarda daha az)',
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
    maxStudents: 4,
    lessonLength: 'Haftada 2 canlı ders',
    popular: true,
    bestFor: 'Hızlı ilerleyen, projesini derinleştirmek isteyen öğrenciler',
    features: [
      'Kulüp paketindeki her şey',
      'En fazla 4 kişilik butik sınıf — söz hakkı iki katına çıkar',
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
    maxStudents: 1,
    lessonLength: 'Haftada 2 canlı ders (esnek saat)',
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
  courseIds: string[];
  /** Patika olarak alındığında ödenecek tutar */
  price: number;
  outcome: string;
}

export const PATHS: Path[] = [
  {
    id: 'kesif',
    name: 'Keşif Yılı',
    ageRange: '8–11 yaş',
    courseIds: ['scratch', 'robotics'],
    price: 19900,
    outcome:
      'Blok tabanlı kodlamadan fiziksel robotiğe geçer. Yıl sonunda hem kendi oyununu hem kendi robotunu yapmış olur.',
  },
  {
    id: 'uretici',
    name: 'Üretici Yılı',
    ageRange: '11–14 yaş',
    courseIds: ['python', 'web'],
    price: 19400,
    outcome:
      'Gerçek metin tabanlı programlamaya geçer. Yıl sonunda internette yayında olan kendi web sitesi ve çalışan Python projeleri olur.',
  },
  {
    id: 'muhendis',
    name: 'Mühendis Yılı',
    ageRange: '14–17 yaş',
    courseIds: ['unity', 'ai'],
    price: 20900,
    outcome:
      'Üniversite düzeyine yaklaşan konularla tanışır. Yıl sonunda yayınlanabilir bir oyunu ve kendi eğittiği bir yapay zeka modeli olur.',
  },
];

// ─── Ödeme planları ──────────────────────────────────────────────────────────

export interface PaymentPlan {
  id: string;
  name: string;
  badge?: string;
  /**
   * Liste fiyatına uygulanan çarpan. 0.90 = %10 indirim.
   *
   * ⚠️ Kart taksitlerinde 1'den BÜYÜK değer kullanmayın: vade farkını banka
   *    zaten ödeme ekranında ekliyor, buraya da eklenirse müşteri iki kez öder.
   *    (Online tahsile kapalı planlar bu kuralın dışındadır.)
   */
  multiplier: number;
  /**
   * İzin verilen EN FAZLA taksit sayısı. 1 = tek çekim.
   * PayTR'a `max_installment` olarak gider; müşteri bundan fazlasını seçemez.
   */
  installments: number;
  /**
   * true → taksit sayısını müşteri ödeme ekranında seçer.
   *
   * Bu durumda sitede kesin bir taksit tutarı GÖSTERMEYİZ: bankanın vade farkı
   * o ekranda ekleniyor, buradaki hesap yanıltıcı olurdu.
   */
  customerChooses?: boolean;
  description: string;
  note?: string;
  /**
   * Online ödemeye kapalı planlar için false.
   *
   * "Aylık Esnek" bunun tek örneği: taahhütsüz, ay ay ödenen ve istenildiği ay
   * bırakılabilen bir plan tek bir kart çekimi olarak tahsil edilemez. Bu plan
   * seçiliyken kayıt sayfası ödeme formu yerine iletişim yolunu gösterir.
   */
  onlineOdeme?: boolean;
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'pesin',
    name: 'Peşin Ödeme',
    badge: '%10 indirim',
    multiplier: 0.9,
    installments: 1,
    description:
      'Kurs ücretinin tamamı kayıt sırasında tek çekimde ödenir. En düşük toplam tutarı bu seçenek verir.',
    note: 'Havale / EFT veya kredi kartına tek çekim.',
  },
  {
    id: 'taksitli',
    name: 'Taksitli Ödeme',
    badge: '12 taksite kadar',
    multiplier: 1,
    installments: 12,
    customerChooses: true,
    description:
      'Kaç taksit istediğinizi ödeme ekranında kendiniz seçersiniz. Anlaşmalı bankaların kartlarında 9 taksite kadar vade farkı yoktur; daha uzun vadelerde farkı bankanız belirler ve ekranda toplam tutarla birlikte görürsünüz.',
    note: 'Anlaşmalı bankalar: Garanti BBVA, İş Bankası, Yapı Kredi, Akbank, QNB.',
  },
  {
    id: 'aylik',
    name: 'Aylık Esnek',
    badge: 'Taahhütsüz',
    multiplier: 1.12,
    installments: 2,
    onlineOdeme: false,
    description:
      'Kursu 4 haftalık dilimler hâlinde ay ay ödersiniz, istediğiniz ay bırakabilirsiniz. Esneklik primi %12.',
    note: 'Kararsız veliler için. Devam etmeye karar verirseniz peşin plana geçiş yapılabilir. Bu plan online kartla tek seferde tahsil edilemediği için kaydı telefonla açıyoruz.',
  },
];

/**
 * Plan seçildiğinde ödeme satırında yazacak tek cümle.
 *
 * Taksit sayısını müşterinin seçtiği planlarda kesin tutar yazmıyoruz; sitede
 * "12 × 741,66 TL" yazıp ödeme ekranında banka vade farkıyla başka bir rakam
 * çıkması güveni bozar.
 */
export function planLine(plan: PaymentPlan, base: number): string {
  if (plan.customerChooses) return `${plan.installments} taksite kadar`;
  const inst = installmentsFor(base, plan);
  return installmentLabel(inst);
}


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

/**
 * Liste fiyatı = paketin süre fiyatı + kursun kendi farkı.
 *
 * İkinci parametreye kursun kendisi verilirse `priceExtra` alanı da eklenir
 * (Arduino seti, bulut işlem gücü, daha küçük sınıf gibi). Sadece hafta sayısı
 * verilirse kursa özel fark hesaba katılmaz — kurs seçilmemiş genel paket
 * tablolarında bu kullanılır.
 */
export function priceFor(tier: Tier, course: Course | number): number {
  const weeks = typeof course === 'number' ? course : course.weeks;
  const extra = typeof course === 'number' ? 0 : course.priceExtra ?? 0;
  return (weeks >= 10 ? tier.price10 : tier.price8) + extra;
}

/** Kursun paket fiyatına eklediği fark — sıfırsa gösterilmez. */
export function courseExtraFor(course?: Course): number {
  return course?.priceExtra ?? 0;
}

/** Bir ödeme planının toplam tutarı (10 TL'ye yuvarlanır — ilan edilen fiyat budur). */
export function totalFor(base: number, plan: PaymentPlan): number {
  return Math.round((base * plan.multiplier) / 10) * 10;
}

export interface Installments {
  count: number;
  /** İlk taksitlerin tutarı, TL */
  monthly: number;
  /** Son taksidin tutarı — bölme tam çıkmadığında farklıdır */
  last: number;
  /** Taksitlerin tamamı eşit mi */
  equal: boolean;
  total: number;
}

/**
 * Taksitleri kuruş hassasiyetinde böler ve TOPLAMLA BİREBİR eşleşmesini garanti eder.
 *
 * Basit bölme + yuvarlama yapılırsa taksitlerin çarpımı toplamı tutmaz
 * (13.900 / 6 = 2.316,66… → 6 × 2.320 = 13.920 gibi). Bunu önlemek için
 * hesap kuruş üzerinden tam sayıyla yapılır, artan kuruş son takside bindirilir.
 */
export function installmentsFor(base: number, plan: PaymentPlan): Installments {
  const total = totalFor(base, plan);
  const n = plan.installments;
  const totalKurus = Math.round(total * 100);
  const perKurus = Math.floor(totalKurus / n);
  const lastKurus = totalKurus - perKurus * (n - 1);
  return {
    count: n,
    monthly: perKurus / 100,
    last: lastKurus / 100,
    equal: perKurus === lastKurus,
    total,
  };
}

/** 12345 → "12.345 TL" · 2316.66 → "2.316,66 TL" */
export function formatTRY(value: number): string {
  const hasKurus = Math.round(value * 100) % 100 !== 0;
  return `${value.toLocaleString('tr-TR', {
    minimumFractionDigits: hasKurus ? 2 : 0,
    maximumFractionDigits: 2,
  })} TL`;
}

/** Taksit planını tek satırda okunur biçimde anlatır. */
export function installmentLabel(inst: Installments): string {
  if (inst.count <= 1) return 'Tek çekim';
  if (inst.equal) return `${inst.count} × ${formatTRY(inst.monthly)}`;
  return `${inst.count - 1} × ${formatTRY(inst.monthly)} + son taksit ${formatTRY(inst.last)}`;
}

/** Ders başına düşen maliyet. Yaklaşık bir değerdir, tam sayıya yuvarlanır. */
export function perLesson(total: number, weeks: number): number {
  return Math.round(total / (weeks * 2));
}

// ─── Kurs + paket birleşimi ──────────────────────────────────────────────────
// Sınıf mevcudu ve ders süresi hem katmana hem kursa bağlı. Unity ve Yapay Zeka
// kurslarında sınıf zaten 6 kişiyle sınırlı; Kulüp paketinin 8 sınırı bu
// kurslarda geçerli değil. Aşağıdaki fonksiyonlar bu ikisini birleştirir.

/** Katman ve kursun sınırlarından düşük olanı geçerlidir. */
export function classSizeFor(tier: Tier, course?: Course): number {
  if (tier.maxStudents === 1) return 1;
  return course ? Math.min(tier.maxStudents, course.maxStudents) : tier.maxStudents;
}

export function classSizeLabel(tier: Tier, course?: Course): string {
  const n = classSizeFor(tier, course);
  if (n === 1) return '1 öğrenci — 1 eğitmen';
  return course ? `${n} öğrenci` : `En fazla ${n} öğrenci`;
}

/** Ders süresi kursa özeldir; paket süreyi değil yoğunluğu belirler. */
export function lessonLineFor(tier: Tier, course?: Course): string {
  if (!course) return tier.lessonLength;
  const esnek = tier.maxStudents === 1 ? ' (esnek saat)' : '';
  return `Haftada ${course.lessonsPerWeek} ders × ${course.lessonMinutes} dk${esnek}`;
}

/** Tüm kurslardaki ders sürelerinin aralığı — genel paket sayfasında kullanılır. */
export function lessonMinutesRange(courses: Course[]): string {
  const mins = courses.map((c) => c.lessonMinutes);
  const lo = Math.min(...mins);
  const hi = Math.max(...mins);
  return lo === hi ? `${lo} dk` : `${lo}–${hi} dk (kursa göre)`;
}

// ─── Patika özeti ────────────────────────────────────────────────────────────
// Süre, ders sayısı ve karşılaştırma fiyatı elle girilmez; kurslardan hesaplanır.
// Böylece bir kursun süresi değiştiğinde patika bilgisi kendiliğinden düzelir.

export interface PathInfo {
  courses: Course[];
  weeks: number;
  lessons: number;
  /** Kurslar tek tek Kulüp katmanında alınsa ödenecek toplam */
  listPrice: number;
  /** Patika fiyatıyla arasındaki fark */
  save: number;
  /** "2 dönem · 18 hafta · 36 ders" */
  duration: string;
}

export function pathInfo(path: Path): PathInfo {
  const courses = path.courseIds
    .map((id) => COURSES.find((c) => c.id === id))
    .filter((c): c is Course => Boolean(c));
  const weeks = courses.reduce((n, c) => n + c.weeks, 0);
  const lessons = courses.reduce((n, c) => n + totalLessons(c), 0);
  const listPrice = courses.reduce((n, c) => n + priceFor(TIERS[0], c), 0);
  return {
    courses,
    weeks,
    lessons,
    listPrice,
    save: listPrice - path.price,
    duration: `${courses.length} dönem · ${weeks} hafta · ${lessons} ders`,
  };
}
