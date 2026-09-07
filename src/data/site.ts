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
  email: 'info@hypeacademia.com',
  emailPress: 'basin@hypeacademia.com',
  emailCareer: 'kariyer@hypeacademia.com',
  emailKvkk: 'kvkk@hypeacademia.com',
  address: 'Gebze Teknik Üniversitesi, Gebze / Kocaeli',
  panelUrl: 'https://panel.hypeacademia.com',
  instagram: 'https://instagram.com/hypeacademia',
  youtube: '#',
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

export const STATS = [
  { value: '2.500+', label: 'Mezun Öğrenci' },
  { value: '%98', label: 'Veli Memnuniyeti' },
  { value: '6', label: 'Uzmanlık Programı' },
  { value: '2020', label: "GTÜ'de Kuruluş" },
] as const;
