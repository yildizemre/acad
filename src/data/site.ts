// Tek kaynak: iletişim bilgileri, kurumsal sabitler ve dış bağlantılar.
// Sitedeki her yerde buradan okunur; telefon/e-posta değişince tek dosya düzenlenir.

export const SITE = {
  name: 'Hype Academia',
  legalName: 'Hype Academia Teknoloji Eğitimleri',
  tagline: '8–17 yaş için canlı online yazılım, robotik ve yapay zeka akademisi',
  url: 'https://hypeacademia.com',
  foundedYear: 2020,
  parentInstitution: 'Gebze Teknik Üniversitesi',
  phoneDisplay: '0541 862 91 90',
  phoneIntl: '+905418629190',
  whatsapp: '905418629190',
  /** Sitede görünen ve tüm mailto bağlantılarının gittiği adres */
  email: 'emre.yildiz@hypevisionlab.com',
  emailPress: 'basin@hypeacademia.com',
  emailCareer: 'kariyer@hypeacademia.com',
  emailKvkk: 'kvkk@hypeacademia.com',
  /**
   * Form bildirimleri ve operasyonel yazışmalar buraya düşer.
   * Sitede görünen adres info@hypeacademia.com; bu adres arka planda çalışır.
   */
  emailOperations: 'emre.yildiz@hypevisionlab.com',
  address: 'Gebze Teknik Üniversitesi, Gebze / Kocaeli',
  panelUrl: 'https://panel.hypeacademia.com',
  instagram: 'https://instagram.com/hypeacademia',
} as const;

export const WA_URL = `https://wa.me/${SITE.whatsapp}`;

/** WhatsApp'a önceden yazılmış mesajla gitmek için. */
export function waLink(message: string): string {
  return `${WA_URL}?text=${encodeURIComponent(message)}`;
}

/** Sitenin her yerinde tekrar eden güven rozetleri. */
export const TRUST_POINTS = [
  'Ücretsiz deneme dersi — bağlayıcılığı yok',
  'E-Devlet üzerinden doğrulanabilir sertifika',
  'İlk 2 ders içinde koşulsuz iade',
  'Maksimum 8 kişilik canlı sınıflar',
] as const;

/**
 * Ana sayfadaki rakam şeridi.
 *
 * ⚠️  KURAL: Doğrulanabilir olmayan hiçbir rakam burada yer almaz.
 *     Her maddenin ya kendi içinde denetlenebilir olması (program sayısı gibi)
 *     ya da `note` alanında dayanağının yazılı olması gerekir.
 *
 * "2.500+ mezun" ve "%98 veli memnuniyeti" ifadeleri, dayanakları
 * belirtilemediği için şeritten çıkarıldı. Geri eklemek için:
 *   { value: '%98', label: 'Veli Memnuniyeti',
 *     note: 'Ocak–Haziran 2026 dönem sonu anketi, 214 veli' }
 * Anket dönemi ve katılımcı sayısı olmadan yayınlamayın.
 */
export interface Stat {
  value: string;
  label: string;
  /** Rakamın dayanağı — doldurulursa şeridin altında dipnot olarak görünür */
  note?: string;
}

export const STATS: Stat[] = [
  { value: '2020', label: 'Kuruluş yılı', note: 'Gebze Teknik Üniversitesi bünyesinde' },
  { value: '6', label: 'Uzmanlık programı', note: 'Müfredatların tamamı sitede açık' },
  { value: '8', label: 'Sınıftaki en fazla öğrenci', note: 'Unity ve Yapay Zeka kurslarında 6' },
  { value: '12 ay', label: 'Ders kaydı erişimi', note: 'Her ders kaydedilir' },
];
