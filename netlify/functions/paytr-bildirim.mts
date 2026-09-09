// ─────────────────────────────────────────────────────────────────────────────
// 2. ADIM — Bildirim URL (ödeme sonucu)
//
// PayTR ödemenin KESİN sonucunu buraya POST eder. Müşterinin yönlendirildiği
// sayfa değildir; oturum yoktur, sipariş numarasıyla çalışılır.
//
// PayTR panelinde tanımlanacak adres:
//     https://hypeacademia.com/api/paytr/bildirim
//     (Mağaza Paneli → Ayarlar → Bildirim URL Ayarları, protokol HTTPS)
//
// KURALLAR (dokümandan):
//  1. Erişim kısıtlaması olmamalı — PayTR'ın serbestçe ulaşabilmesi gerekir.
//  2. Yanıt olarak SADECE "OK" basılmalı; öncesinde/sonrasında HTML olmamalı.
//     OK alınmayan bildirimlerde işlem "Devam Ediyor" kalır ve para aktarılmaz.
//  3. Aynı sipariş için birden fazla bildirim gelebilir; yalnızca ilki işlenir.
//  4. hash doğrulaması zorunlu — atlanırsa sahte "success" POST'u ile bedava
//     kayıt açtırılabilir.
// ─────────────────────────────────────────────────────────────────────────────

import { ayarOku, bildirimImzasiDogru, siparisNoGecerliMi } from '../lib/paytr.js';
import { sonuclandir, type Siparis } from '../lib/siparis.js';
import { SITE } from '../../src/data/site.js';

/** PayTR yalnızca düz "OK" bekliyor. */
function ok() {
  return new Response('OK', {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

/**
 * Kayıt ekibine haber verir.
 *
 * Netlify Forms üzerinden gidiyor: sitede zaten tanımlı olan form altyapısını
 * kullandığı için ek servis, ek API anahtarı ve ek ücret gerektirmiyor.
 * Bildirim e-postası Netlify panelinden `odeme-bildirimi` formuna tanımlanır.
 */
async function kayitEkibineBildir(s: Siparis, basarili: boolean): Promise<void> {
  const siteUrl = (process.env.URL ?? SITE.url).replace(/\/$/, '');

  const alanlar = new URLSearchParams({
    'form-name': 'odeme-bildirimi',
    durum: basarili ? 'BAŞARILI' : 'BAŞARISIZ',
    siparisNo: s.siparisNo,
    kurs: s.kursAdi,
    paket: s.paketAdi,
    plan: `${s.planAdi} (${s.taksitSayisi} taksit)`,
    tutar: `${(s.tutarKurus / 100).toFixed(2)} TL`,
    tahsilEdilen: s.odenenKurus ? `${(s.odenenKurus / 100).toFixed(2)} TL` : '—',
    odemeTuru: s.odemeTuru ?? '—',
    veli: s.adSoyad,
    email: s.email,
    telefon: s.telefon,
    adres: s.adres,
    ogrenci: `${s.ogrenciAdi}${s.ogrenciYasi ? ` (${s.ogrenciYasi} yaş)` : ''}`,
    not: s.not || '—',
    hata: s.hataMesaji ? `${s.hataKodu ?? ''} ${s.hataMesaji}`.trim() : '—',
    testIslemi: s.testMi ? 'EVET — gerçek tahsilat yapılmadı' : 'hayır',
  });

  const yanit = await fetch(siteUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: alanlar.toString(),
  });

  if (!yanit.ok) {
    throw new Error(`Netlify Forms bildirimi başarısız: ${yanit.status}`);
  }
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Yalnızca POST', { status: 405 });
  }

  let ayar;
  try {
    ayar = ayarOku();
  } catch (e) {
    // OK dönmüyoruz: yapılandırma düzelince PayTR tekrar denesin.
    console.error('[paytr-bildirim] yapılandırma', e);
    return new Response('Yapılandırma eksik', { status: 503 });
  }

  const govde = new URLSearchParams(await req.text());
  const merchant_oid = govde.get('merchant_oid') ?? '';
  const status = govde.get('status') ?? '';
  const total_amount = govde.get('total_amount') ?? '';
  const hash = govde.get('hash') ?? '';

  if (!siparisNoGecerliMi(merchant_oid) || !status || !total_amount) {
    console.error('[paytr-bildirim] eksik alan', { merchant_oid, status });
    return new Response('Eksik alan', { status: 400 });
  }

  // ⚠️ Bu kontrol atlanamaz.
  if (!bildirimImzasiDogru(ayar, { merchant_oid, status, total_amount, hash })) {
    console.error('[paytr-bildirim] HASH DOĞRULANAMADI', merchant_oid);
    return new Response('Bad hash', { status: 400 });
  }

  const basarili = status === 'success';

  let sonuc;
  try {
    sonuc = await sonuclandir(merchant_oid, basarili ? 'basarili' : 'basarisiz', {
      odenenKurus: Number(total_amount) || undefined,
      odemeTuru: govde.get('payment_type') ?? undefined,
      hataKodu: govde.get('failed_reason_code') ?? undefined,
      hataMesaji: govde.get('failed_reason_msg') ?? undefined,
      testMi: govde.get('test_mode') === '1',
    });
  } catch (e) {
    // Depo hatası: OK dönmezsek PayTR tekrar dener, kayıp yaşamayız.
    console.error('[paytr-bildirim] sipariş güncellenemedi', merchant_oid, e);
    return new Response('Depo hatası', { status: 500 });
  }

  if (!sonuc.siparis) {
    // Bize ait olmayan veya süpürülmüş bir sipariş numarası. PayTR'ı sonsuz
    // denemede bırakmamak için OK dönüyoruz, ama günlüğe düşürüyoruz.
    console.error('[paytr-bildirim] sipariş bulunamadı', merchant_oid);
    return ok();
  }

  // Tekrarlayan bildirim: doküman "yalnızca OK yanıtı ile süreç sonlandırılmalı"
  // diyor. E-postayı ikinci kez göndermiyoruz.
  if (!sonuc.ilkKez) {
    console.info('[paytr-bildirim] tekrarlayan bildirim, atlandı', merchant_oid);
    return ok();
  }

  try {
    await kayitEkibineBildir(sonuc.siparis, basarili);
  } catch (e) {
    // Bildirim e-postası gitmese bile ödeme geçerlidir ve sipariş kaydedildi.
    // PayTR'a OK dönmemek, geçerli bir ödemeyi "Devam Ediyor" bırakır — bu
    // e-posta hatasından çok daha kötüdür.
    console.error('[paytr-bildirim] kayıt ekibi bildirimi başarısız', merchant_oid, e);
  }

  return ok();
};

export const config = { path: '/api/paytr/bildirim' };
