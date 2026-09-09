// ─────────────────────────────────────────────────────────────────────────────
// ONLINE ÖDEME — TARAYICI TARAFI
//
// Ödeme sağlayıcısı: PayTR (iFrame API).
//
// Buradaki kod yalnızca kendi sunucu uçlarımızla konuşur:
//   POST /api/paytr/token   → ödeme formunu açacak iframe_token
//   GET  /api/paytr/durum   → sonuç sayfasının siparişi yoklaması
//
// ⚠️ PayTR anahtarları (merchant_id / key / salt) BU DOSYAYA veya herhangi bir
//    VITE_ değişkenine yazılmaz — tarayıcıya sızar. Anahtarlar yalnızca Netlify
//    ortam değişkenlerinde durur, netlify/functions içinden okunur.
//
// ⚠️ Tutar da buradan gönderilmez. Sunucu, kurs/paket/plan seçimine bakarak
//    fiyatı kendisi hesaplar (bkz. netlify/functions/paytr-token.mts).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Online ödemeyi açıp kapatan bayrak.
 *
 * Kapalıyken kayıt akışı WhatsApp üzerinden yürür. Netlify ortam
 * değişkenlerine `VITE_PAYMENT_ONLINE=true` eklendiğinde ödeme formu devreye
 * girer. PayTR anahtarları tanımlanmadan açmayın; müşteri hata ekranı görür.
 */
export const PAYMENT_ONLINE = import.meta.env.VITE_PAYMENT_ONLINE === 'true';

/** PayTR'ın iframe'i içeriğe göre boyutlandıran betiği. */
export const PAYTR_RESIZER = 'https://www.paytr.com/js/iframeResizer.min.js';

/** Ödeme formunun açılacağı adres — sonuna iframe_token eklenir. */
export const PAYTR_IFRAME_URL = 'https://www.paytr.com/odeme/guvenli';

export interface OdemeAlicisi {
  adSoyad: string;
  email: string;
  telefon: string;
  adres: string;
  ogrenciAdi: string;
  ogrenciYasi: string;
  not: string;
}

export interface TokenIstegi extends OdemeAlicisi {
  kursId: string;
  paketId: string;
  planId: string;
  sozlesmeOnay: boolean;
  /** "instagram.com" · "google / cpc / yaz-kampanyasi" · "doğrudan" */
  kaynak: string;
  /** Ziyaretçinin siteye ilk girdiği sayfa */
  girisSayfasi: string;
}

export interface TokenYaniti {
  token: string;
  siparisNo: string;
  tutar: number;
  testModu: boolean;
}

/** Sunucudan ödeme formu jetonu ister. Hata durumunda okunabilir mesaj fırlatır. */
export async function odemeTokenIste(istek: TokenIstegi): Promise<TokenYaniti> {
  const yanit = await fetch('/api/paytr/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(istek),
  });

  const veri = await yanit.json().catch(() => ({}));

  if (!yanit.ok) {
    throw new Error(
      typeof veri?.hata === 'string'
        ? veri.hata
        : 'Ödeme formu açılamadı. Lütfen birazdan tekrar deneyin.',
    );
  }

  return veri as TokenYaniti;
}

export type SiparisDurumu = 'beklemede' | 'basarili' | 'basarisiz';

export interface SiparisDurumYaniti {
  siparisNo: string;
  durum: SiparisDurumu;
  kurs: string;
  paket: string;
  plan: string;
  tutar: number;
  tahsilEdilen: number | null;
  hataMesaji: string | null;
  testMi: boolean;
}

/** Sonuç sayfasının siparişi yoklaması için. Bulunamazsa null döner. */
export async function siparisDurumuSor(no: string): Promise<SiparisDurumYaniti | null> {
  const yanit = await fetch(`/api/paytr/durum?no=${encodeURIComponent(no)}`);
  if (!yanit.ok) return null;
  return (await yanit.json()) as SiparisDurumYaniti;
}
