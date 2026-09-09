// ─────────────────────────────────────────────────────────────────────────────
// TÜZEL KİŞİLİK BİLGİLERİ
//
// Hype Academia bir MARKA'dır; satışı yapan ve faturayı kesen tüzel kişilik
// ana şirket Hype Vision'dır. Sanal POS (iyzico) da Hype Vision adına alındığı
// için bütün sözleşmelerde SATICI olarak Hype Vision görünür.
//
// KURAL: Bilinmeyen alan BOŞ bırakılır — uydurma değer yazılmaz.
// Boş alanlar sitede hiç görünmez (satır komple gizlenir); ziyaretçi
// "[DOLDURULACAK: ...]" gibi bir şey görmez. Eksik alan olduğunda:
//   · `npm run build` uyarı verir
//   · geliştirme modunda sözleşme sayfasında uyarı kutusu çıkar
//   · yayında hiçbir iz kalmaz
//
// ⚠️  iyzico başvurusundan ÖNCE doldurulmalı: bu bilgiler POS başvurusundaki
//     bilgilerle birebir aynı olmak zorunda.
// ─────────────────────────────────────────────────────────────────────────────

export const SELLER = {
  /** Ticaret sicilindeki tam ünvan — "... Ltd. Şti." / "... A.Ş." dahil */
  legalName: '',
  /** Kısa kullanım adı — bu biliniyor, her zaman gösterilir */
  shortName: 'Hype Vision',
  /** Fatura ve tebligat adresi */
  address: '',
  taxOffice: '',
  taxNumber: '',
  mersis: '',
  tradeRegistryNo: '',
  phone: '+90 541 862 91 90',
  email: 'info@hypevisionlab.com',
  /** Kayıtlı elektronik posta — varsa yazın */
  kep: '',
  website: 'https://hypeacademia.com',
} as const;

/** Satışın yapıldığı marka. Hukuki muhatap SELLER'dır. */
export const BRAND = {
  name: 'Hype Academia',
  description: 'Hype Vision bünyesinde faaliyet gösteren teknoloji eğitimi markası',
} as const;

/**
 * Ödeme altyapısı sağlayıcısı.
 *
 * Sağlayıcı adı sözleşmelerde, kayıt sayfasında ve hakkımızda sayfasında
 * buradan okunur — değiştirmek için tek yer burasıdır.
 *
 * Logo dosyaları `scripts/odeme-logolari.py` ile üretilir:
 *   · logo / logoWhite  — PayTR'ın kendi verdiği resmî logo paketinden
 *   · cards / cardsWhite — kart şeması kabul markaları (Mastercard, Visa,
 *     American Express, Troy). Bu markalar kart ağlarına aittir ve kartı kabul
 *     eden her işyeri tarafından gösterilebilir.
 *
 * ⚠️ Sağlayıcı değişirse logoları da değiştirin. Bir sağlayıcıyla çalışıp
 *    başkasının logosunu göstermek ziyaretçiyi yanıltır.
 */
export const PAYMENT_PROVIDER = {
  name: 'PayTR',
  legalName: 'PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.',
  note: 'Kart bilgileriniz Hype Vision sunucularında saklanmaz; ödeme PayTR’ın 3D Secure altyapısı üzerinden alınır.',
  /** Kabul edilen kart şemaları — görsel yüklenemezse alt metinde geçer. */
  cardNames: ['Mastercard', 'Visa', 'American Express', 'Troy'] as readonly string[],
  logo: '/odeme/paytr-renkli.svg',
  logoWhite: '/odeme/paytr-beyaz.svg',
  cards: '/odeme/kart-semalari.svg',
  cardsWhite: '/odeme/kart-semalari-beyaz.svg',
} as const;

/** Hizmetin niteliği — mesafeli satış sözleşmesinde kullanılır. */
export const SERVICE = {
  kind: 'Dijital ortamda sunulan canlı eğitim hizmeti',
  deliveryMethod: 'Zoom veya Google Meet üzerinden canlı çevrimiçi ders',
  physicalItem: 'Arduino & Robotik kursunda donanım seti kargo ile gönderilir',
} as const;

/**
 * Satıcının sözleşmelerde gösterilecek künyesi.
 * Yalnızca DOLU alanlar döner — boş olanlar listeye hiç girmez.
 */
export function sellerRows(): [string, string][] {
  const rows: [string, string][] = [];
  const ekle = (etiket: string, deger: string) => {
    if (deger.trim()) rows.push([etiket, deger]);
  };

  ekle('Ünvan', SELLER.legalName || SELLER.shortName);
  ekle('Marka', `${BRAND.name} (${BRAND.description})`);
  ekle('Adres', SELLER.address);
  if (SELLER.taxOffice && SELLER.taxNumber) {
    rows.push(['Vergi Dairesi / No', `${SELLER.taxOffice} / ${SELLER.taxNumber}`]);
  }
  ekle('MERSİS No', SELLER.mersis);
  ekle('Ticaret Sicil No', SELLER.tradeRegistryNo);
  ekle('Telefon', SELLER.phone);
  ekle('E-posta', SELLER.email);
  ekle('KEP Adresi', SELLER.kep);
  ekle('İnternet Sitesi', SELLER.website);
  return rows;
}

/** Sözleşmelerde satıcıyı anmak için kullanılacak ad. */
export const sellerName = SELLER.legalName || SELLER.shortName;

/** Hangi zorunlu alanlar hâlâ boş? */
export function missingLegalFields(): string[] {
  const zorunlu: [string, string][] = [
    ['Ticaret ünvanı', SELLER.legalName],
    ['Fatura ve tebligat adresi', SELLER.address],
    ['Vergi dairesi', SELLER.taxOffice],
    ['Vergi kimlik numarası', SELLER.taxNumber],
    ['MERSİS numarası', SELLER.mersis],
    ['Ticaret sicil numarası', SELLER.tradeRegistryNo],
  ];
  return zorunlu.filter(([, v]) => !v.trim()).map(([ad]) => ad);
}

export const LEGAL_READY = missingLegalFields().length === 0;
