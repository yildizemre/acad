// ─────────────────────────────────────────────────────────────────────────────
// PAYTR — ORTAK YARDIMCILAR
//
// Bu dosya YALNIZCA sunucu tarafında (Netlify Functions) çalışır.
// merchant_key ve merchant_salt burada okunur; tarayıcıya asla gitmez.
//
// Doküman: PayTR iFrame API Entegrasyonu, 1. ve 2. ADIM
//   1. ADIM → https://www.paytr.com/odeme/api/get-token ile iframe_token alınır
//   2. ADIM → Bildirim URL'ye gelen POST ile ödeme sonucu öğrenilir
// ─────────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';

export interface PaytrAyar {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  /** 1 = test işlemi (mağaza canlı modda olsa bile para çekilmez) */
  testMode: '0' | '1';
  /** Hata mesajlarının PayTR yanıtında görünmesi — canlıda 0 yapılabilir */
  debugOn: '0' | '1';
}

/**
 * Ortam değişkenlerini okur. Eksik varsa erken ve anlaşılır biçimde patlar —
 * yarım yapılandırmayla canlıya çıkıp sessizce ödeme kaybetmek en kötüsü.
 */
export function ayarOku(): PaytrAyar {
  const merchantId = process.env.PAYTR_MERCHANT_ID ?? '';
  const merchantKey = process.env.PAYTR_MERCHANT_KEY ?? '';
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT ?? '';

  const eksik = [
    !merchantId && 'PAYTR_MERCHANT_ID',
    !merchantKey && 'PAYTR_MERCHANT_KEY',
    !merchantSalt && 'PAYTR_MERCHANT_SALT',
  ].filter(Boolean);

  if (eksik.length) {
    throw new Error(
      `PayTR ortam değişkenleri eksik: ${eksik.join(', ')}. ` +
        'Netlify → Site configuration → Environment variables bölümünden tanımlayın.',
    );
  }

  return {
    merchantId,
    merchantKey,
    merchantSalt,
    // Varsayılan TEST. Canlıya geçerken bilinçli olarak 0 yapılmalı.
    testMode: process.env.PAYTR_TEST_MODE === '0' ? '0' : '1',
    debugOn: process.env.PAYTR_DEBUG === '0' ? '0' : '1',
  };
}

/** PayTR'ın istediği HMAC-SHA256 + base64 imzası. */
export function imzala(veri: string, merchantKey: string): string {
  return crypto.createHmac('sha256', merchantKey).update(veri).digest('base64');
}

/**
 * Benzersiz sipariş numarası.
 * PayTR kısıtı: en fazla 64 karakter, YALNIZCA alfanumerik (tire/alt çizgi yok).
 */
export function siparisNoUret(): string {
  const zaman = Date.now().toString(36).toUpperCase();
  const rastgele = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `HA${zaman}${rastgele}`;
}

/** Sipariş numarasının bize ait ve biçimce geçerli olduğunu doğrular. */
export function siparisNoGecerliMi(oid: unknown): oid is string {
  return typeof oid === 'string' && /^[A-Za-z0-9]{4,64}$/.test(oid);
}

export interface SepetSatiri {
  ad: string;
  /** "13900.00" gibi — PayTR sepet içinde metin bekliyor */
  tutar: string;
  adet: number;
}

/** PayTR'ın beklediği base64'lenmiş sepet dizisi. */
export function sepetKodla(satirlar: SepetSatiri[]): string {
  const dizi = satirlar.map((s) => [s.ad, s.tutar, s.adet]);
  return Buffer.from(JSON.stringify(dizi), 'utf8').toString('base64');
}

export interface TokenIstegi {
  siparisNo: string;
  /** Kuruş cinsinden tam sayı — 139,00 TL için 13900 */
  tutarKurus: number;
  email: string;
  adSoyad: string;
  telefon: string;
  adres: string;
  sepetB64: string;
  musteriIp: string;
  /** 1 → taksit seçenekleri hiç gösterilmez */
  taksitYok: '0' | '1';
  /** 0 → yürürlükteki en fazla taksit; 2–12 arası sınır konabilir */
  enFazlaTaksit: string;
  basariliUrl: string;
  hataUrl: string;
  /** Dakika cinsinden işlem zaman aşımı */
  zamanAsimi: number;
}

export interface TokenSonucu {
  ok: boolean;
  token?: string;
  /** PayTR'ın döndürdüğü hata metni (debug_on=1 iken anlamlı) */
  hata?: string;
}

/**
 * 1. ADIM — iframe_token isteği.
 *
 * İmza sırası dokümandaki sırayla BİREBİR aynı olmak zorunda; tek bir alanın
 * yeri değişse PayTR "paytr_token gecersiz" döner.
 */
export async function iframeTokenAl(
  ayar: PaytrAyar,
  istek: TokenIstegi,
): Promise<TokenSonucu> {
  const currency = 'TL';

  const hashSTR =
    ayar.merchantId +
    istek.musteriIp +
    istek.siparisNo +
    istek.email +
    String(istek.tutarKurus) +
    istek.sepetB64 +
    istek.taksitYok +
    istek.enFazlaTaksit +
    currency +
    ayar.testMode;

  const paytrToken = imzala(hashSTR + ayar.merchantSalt, ayar.merchantKey);

  const govde = new URLSearchParams({
    merchant_id: ayar.merchantId,
    user_ip: istek.musteriIp,
    merchant_oid: istek.siparisNo,
    email: istek.email,
    payment_amount: String(istek.tutarKurus),
    paytr_token: paytrToken,
    user_basket: istek.sepetB64,
    debug_on: ayar.debugOn,
    no_installment: istek.taksitYok,
    max_installment: istek.enFazlaTaksit,
    user_name: istek.adSoyad,
    user_address: istek.adres,
    user_phone: istek.telefon,
    merchant_ok_url: istek.basariliUrl,
    merchant_fail_url: istek.hataUrl,
    timeout_limit: String(istek.zamanAsimi),
    currency,
    test_mode: ayar.testMode,
    lang: 'tr',
  });

  const yanit = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: govde.toString(),
  });

  const metin = await yanit.text();

  let veri: { status?: string; token?: string; reason?: string };
  try {
    veri = JSON.parse(metin);
  } catch {
    return { ok: false, hata: `PayTR beklenmeyen yanıt döndü: ${metin.slice(0, 300)}` };
  }

  if (veri.status === 'success' && veri.token) return { ok: true, token: veri.token };
  return { ok: false, hata: veri.reason ?? 'PayTR token vermedi' };
}

/**
 * 2. ADIM — Bildirim imzasının doğrulanması.
 *
 * ⚠️ Bu kontrol atlanırsa herkes "status=success" POST'u atıp bedava kayıt
 *    açtırabilir. Doküman bunu açıkça uyarıyor: "Bu kontrolü yapmamanız
 *    durumunda maddi kayıplar ile karşılaşabilirsiniz."
 *
 * total_amount, PayTR'ın gönderdiği METİN hâliyle kullanılmalı — sayıya çevirip
 * geri yazmak imzayı bozar.
 */
export function bildirimImzasiDogru(
  ayar: PaytrAyar,
  alanlar: { merchant_oid: string; status: string; total_amount: string; hash: string },
): boolean {
  const beklenen = imzala(
    alanlar.merchant_oid + ayar.merchantSalt + alanlar.status + alanlar.total_amount,
    ayar.merchantKey,
  );
  // Zamanlama saldırısına karşı sabit süreli karşılaştırma
  const a = Buffer.from(beklenen);
  const b = Buffer.from(alanlar.hash ?? '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
